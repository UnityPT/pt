import {Component, OnInit, ViewChild} from '@angular/core';
import {ExtraField} from '../gzip';
import {Meta, Resource} from '../types';
import createTorrent from 'create-torrent';
import {ApiService} from '../api.service';
import {QBittorrentService} from '../qbittorrent.service';
import path from 'path';
import {MatTable} from '@angular/material/table';
import util from 'util';
import {MatDialog} from '@angular/material/dialog';
import {Buffer} from 'buffer';
//@ts-ignore
import parseTorrent from 'parse-torrent';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit {
  displayedColumns: string[] = ['file', 'version_id', 'create_torrent', 'qBittorrent'];
  dataSource: PublishLog[] = [];
  @ViewChild(MatTable) table!: MatTable<PublishLog>;
  loading: boolean = false;
  publishing: boolean = false;
  protocol: string = '';
  unFinishedState: string[] = [
    'error',
    'missingFiles',
    'allocating',
    'downloading',
    'metaDL',
    'pausedDL',
    'queuedDL',
    'stalledDL',
    'checkingDL',
    'forcedDL',
  ];

  constructor(private api: ApiService, private qBittorrent: QBittorrentService, private dialog: MatDialog) {}

  async ngOnInit() {
    // this.protocol = (await window.electronAPI.store_get('qbConfig')).protocol;
  }

  async publish(selectFiles: FileList | null) {
    console.log('localpublish');
    if (!selectFiles) return;
    if (this.publishing) return;
    this.publishing = true;

    try {
      this.dataSource = [];
      const items = await this.api.index(true);
      const taskHashes = (await this.qBittorrent.torrentsInfo({category: 'Unity'})).map((t) => t.hash);
      const resourceVersionIds = items.map((item) => item.meta.version_id);
      for (let i = 0; i < selectFiles.length; i++) {
        try {
          await this.processLocalOne(selectFiles.item(i)!, items, taskHashes, resourceVersionIds);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.publishing = false;
    console.log('localpublish done,', this.publishing);
  }

  async processLocalOne(
    file: File,
    items: {
      resource: Resource;
      meta: any;
    }[],
    taskHashes: string[],
    resourceVersionIds: string[]
  ) {
    console.log('torrent proecessing', file.name);
    if (path.extname(file.name) !== '.unitypackage') return;
    // @ts-ignore  // provided by electron, not works in chrome.
    const p = file.path.replaceAll('\\', '/'); // 由于 path-browserify 只支持 posix 风格路径，不支持 win32风格

    const progress = this.startNewProgress(file.name);

    const description = await ExtraField(file, 65, 36);
    if (!description)
      return this.setProgressState(progress, 'version_id', false, `${file.webkitRelativePath} is not a unity asset store package`);
    const meta = <Meta>JSON.parse(description);
    if (!meta.version_id) return this.setProgressState(progress, 'version_id', false, `${file.webkitRelativePath} is strange`);

    this.setProgressState(progress, 'version_id', meta.version_id, meta.version_id);

    const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
    // pt有
    if (resourceIndex >= 0) {
      const item = items[resourceIndex];
      if (!item) return this.setProgressState(progress, 'qBittorrent', 'skipped', 'file is repeated');
      const {resource, meta} = item;
      if (taskHashes.includes(resource.info_hash)) {
        // pt有，qb 有
        const t = (await this.qBittorrent.torrentsInfo({hashes: resource.info_hash}))[0];
        if (this.unFinishedState.includes(t.state)) {
          // pt有，qb 有, 没下载完 => 重启任务
          // @ts-ignore   //t.content_path报错，实际有这个属性
          return this.reStartTask(resource.torrent_id, meta, resource.info_hash, t.content_path!, p, progress, false);
        } else {
          // pt有,qb 有,已下载完成或未知情况 => 跳过
          return this.setProgressState(progress, 'qBittorrent', 'skipped', `finished or unknown state:${t.state}`);
        }
      } else {
        if (description === resource.description) {
          // pt有，qb 无，一致 => 添加下载任务
          this.setProgressState(progress, 'create_torrent', 'downloading', `downloading ${meta.title}`);
          const torrent = await this.api.download(resource.torrent_id);
          if (!torrent) return this.setProgressState(progress, 'qBittorrent', 'skipped', `torrent is not exist: ${meta.title}`);
          this.setProgressState(progress, 'create_torrent', 'downloaded', `downloaded ${meta.title}`);

          const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
          taskHashes.push(resource.info_hash);
          // @ts-ignore file.path
          return this.torrentsAdd(torrent, progress, file.path, false, info.name);
        } else {
          // pt有，qb 无，不一致 => 忽略
          return this.setProgressState(progress, 'create_torrent', 'conflict', `${p} has same version_id with server but not same file`);
        }
      }
    } else if (resourceIndex < 0) {
      // pt无   => 发布资源并添加下载任务
      const torrent = (await this.createTorrent(file, meta, progress, true, false))!;
      this.setProgressState(progress, 'create_torrent', 'uploaded');

      const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
      resourceVersionIds.push(meta.version_id);
      taskHashes.push(info.infoHash);
      // @ts-ignore file.path
      return this.torrentsAdd(torrent, progress, file.path, false, info.name);
    }
  }

  async torrentsAdd(torrent: Blob, progress: PublishLog, filepath: string, is_remote_publish_flag: boolean, standardizedName?: string) {
    //注意standardizedName是标准名[xxx]xxx形式的标准名，只有需要创建新文件时才会用到
    // try {
    //   this.setProgressState(progress, 'qBittorrent', 'adding', `adding: ${filepath}`);
    //   const p = filepath.replaceAll('\\', '/');
    //   if (this.protocol == 'local' && !is_remote_publish_flag) {
    //     //本地qb本地发布
    //     await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
    //   } else {
    //     // 远程qb
    //     if (!is_remote_publish_flag) {
    //       // 远程qb本地发布
    //       const { result, newpath } = await this.checkLocalSmb(torrent, p);
    //       if (result) {
    //         //远程qb本地发布，但是选择了smb目录
    //         await this.qBittorrent.torrentsAdd(torrent, path.dirname(newpath!), path.basename(newpath!));
    //       } else {
    //         // 正常的远程qb本地发布，需要先上传文件到远程默认目录
    //         await window.electronAPI.upload_file(filepath, standardizedName!);
    //         await this.qBittorrent.torrentsAdd(torrent);
    //       }
    //     } else {
    //       // 远程qb远程发布
    //       await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
    //     }
    //   }
    // } catch (e) {
    //   this.setProgressState(progress, 'qBittorrent', 'skipped', 'add task failed');
    //   throw e;
    // }
    // this.setProgressState(progress, 'qBittorrent', 'added', `added ${path.posix.basename(filepath)} to qBittorrent`);
  }

  async reStartTask(
    torrent_id: number,
    meta: Meta,
    taskHash: string,
    oldPath: string,
    newPath: string,
    progress: PublishLog,
    is_remote_publish_flag: boolean
  ) {
    // try {
    //   this.setProgressState(progress, 'qBittorrent', 'adding', `restarting:${meta.title}`);
    //   await this.qBittorrent.torrentsPause(taskHash);
    //   await this.qBittorrent.waitPaused(taskHash);
    //   // @ts-ignore
    //   await window.electronAPI.delete_file(oldPath).catch(console.error);
    //   const torrent = await this.api.download(torrent_id)!;
    //   const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
    //
    //   if (this.protocol == 'local') {
    //     //本地qb本地发布
    //     await this.qBittorrent.torrentsSetLocation(taskHash, path.dirname(newPath));
    //     await this.qBittorrent.torrentsRestart(taskHash, info.name, path.basename(newPath));
    //     return this.setProgressState(progress, 'qBittorrent', 'added', `restarted ${meta.title} to ${newPath}`);
    //   } else {
    //     if (!is_remote_publish_flag) {
    //       const { result, newpath } = await this.checkLocalSmb(torrent, newPath);
    //       if (result) {
    //         //远程qb本地发布，但是选择了smb目录
    //         await this.qBittorrent.torrentsSetLocation(taskHash, path.dirname(newpath!));
    //         await this.qBittorrent.torrentsRestart(taskHash, info.name, path.basename(newpath!));
    //       } else {
    //         //正常远程qb本地发布，上传文件，并重置到默认位置和标准文件名
    //         await window.electronAPI.upload_file(newPath, info.name);
    //         const qbSavePath = (await window.electronAPI.store_get('qbConfig')).save_path;
    //         await this.qBittorrent.torrentsSetLocation(taskHash, qbSavePath);
    //         await this.qBittorrent.torrentsRestart(taskHash, info.name, info.name);
    //       }
    //     } else {
    //       //远程qb远程发布
    //       await this.qBittorrent.torrentsSetLocation(taskHash, path.dirname(newPath));
    //       await this.qBittorrent.torrentsRestart(taskHash, info.name, path.basename(newPath));
    //     }
    //   }
    // } catch (e) {
    //   this.setProgressState(progress, 'qBittorrent', 'skipped', 'failed to restart task:' + e);
    // }
    // this.setProgressState(progress, 'create_torrent', 'restart');
    // return this.setProgressState(progress, 'qBittorrent', 'added', `restarted ${meta.title} to ${newPath}`);
  }

  async checkLocalSmb(torrent: Blob, p: string) {
    // if (this.protocol == 'smb') {
    //   const smbRemotePath = (await window.electronAPI.store_get('smbConfig')).remotePath;
    //   const macLocalSmbPath = smbRemotePath.startsWith('smb://') ? path.posix.join('/Volumes', await window.electronAPI.url_pathname(smbRemotePath)) : null; //这是mac的挂载路径，win的跟远程路径相同
    //   // 远程qb本地发布，但是选择了跟qb中填写的同一个smb文件夹,等于走远程qb远程发布(即源文件原地不动,所以需要rename)
    //   if (p.startsWith(smbRemotePath.replaceAll('\\', '/')) || (macLocalSmbPath && p.startsWith(macLocalSmbPath))) {
    //     const newPath = path.posix.join(
    //       (await window.electronAPI.store_get('qbConfig')).save_path,
    //       p.replace(smbRemotePath.replaceAll('\\', '/'), '').replace(macLocalSmbPath ?? '', '')
    //     );
    //     return { result: true, newpath: newPath };
    //   }
    // }
    // return { result: false, newpath: null };
  }

  async browseRemote() {
    if (this.publishing) return;
    if (this.protocol === 'local') return alert('请设置远程通讯协议');

    this.loading = true;
    this.publishing = true;
    await this.openBrowser().catch(console.error);
    this.loading = false;
  }

  async openBrowser() {
    // if (this.protocol === 'smb') {
    //   const result = await window.electronAPI.smb_browse();
    //   return this.onSelected(result);
    // } else if (this.protocol == 'sftp' || this.protocol == 'webdav') {
    //   const dirItems = await window.electronAPI.get_list('', 'd');
    //   const dialogRef = this.dialog.open(BrowseRemoteComponent, {
    //     width: '600px',
    //     height: '320px',
    //     data: {
    //       dirItems,
    //     },
    //   });
    //   dialogRef.afterClosed().subscribe(this.onSelected);
    // }
  }

  async onSelected(result: string) {
    // if (!result) {
    //   this.publishing = false;
    //   return console.log('no result');
    // }
    //
    // try {
    //   this.dataSource = [];
    //   const items = await this.api.index(true);
    //   const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
    //   const resourceVersionIds = items.map((item) => item.meta.version_id);
    //   const qbSavePath = (await window.electronAPI.store_get('qbConfig')).save_path;
    //   const smbRemotePath = (await window.electronAPI.store_get('smbConfig')).remotePath;
    //   const filepaths = (await window.electronAPI.get_list(result, 'f')) as string[];
    //   for (const filepath of filepaths) {
    //     try {
    //       await this.processRemoteOne(filepath, items, taskHashes, resourceVersionIds, qbSavePath, smbRemotePath);
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
    // this.publishing = false;
  }

  async processRemoteOne(
    filepath: string,
    items: {resource: Resource; meta: Meta}[],
    taskHashes: string[],
    resourceVersionIds: string[],
    qbSavePath: string,
    smbRemotePath: string
  ) {
    // console.log('torrent proecessing', filepath);
    // if (path.extname(filepath) !== '.unitypackage') return;
    // //对于容器内的qb,这里的p是容器内路径, filepath则是相对于远程文件夹的相对路径
    // const p = path.posix.join(qbSavePath, filepath.replaceAll('\\', '/'));
    //
    // const progress = this.startNewProgress(path.posix.basename(p));
    //
    // const description = await window.electronAPI.extra_field(filepath);
    // if (!description) return this.setProgressState(progress, 'version_id', 'false', `${filepath} is not a unity asset store package`);
    // const meta = <Meta>JSON.parse(description);
    // if (!meta.version_id) return this.setProgressState(progress, 'version_id', 'false', `${filepath} is strange`);
    //
    // progress.version_id = meta.version_id;
    // this.table.renderRows();
    // this.setProgressState(progress, 'version_id', meta.version_id);
    //
    // const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
    // if (resourceIndex >= 0) {
    //   //pt有
    //   const item = items[resourceIndex];
    //   if (!item) return this.setProgressState(progress, 'create_torrent', 'skipped', 'file is repeated');
    //
    //   const { resource, meta } = item;
    //   if (taskHashes.includes(resource.info_hash)) {
    //     // pt有，qb有
    //     const t = (await this.qBittorrent.torrentsInfo({ hashes: resource.info_hash }))[0];
    //     if (this.unFinishedState.includes(t.state)) {
    //       // pt有，qb有，未完成 => 重启任务
    //       const torrent = await this.createTorrent(filepath, meta, progress, false, true);
    //       // @ts-ignore
    //       return this.reStartTask(resource.torrent_id, meta, resource.info_hash, t.content_path, p, progress, true);
    //     } else {
    //       // pt有，qb有，完成或未知 => 跳过
    //       return this.setProgressState(progress, 'qBittorrent', 'skipped', `finished or unknown state: ${t.state}`);
    //     }
    //   } else {
    //     if (description === resource.description) {
    //       // pt有，qb无，一致 => 添加下载任务
    //       progress.create_torrent = 'downloading';
    //       this.table.renderRows();
    //       this.setProgressState(progress, 'qBittorrent', 'downloading', `downloading ${meta.title}`);
    //       const torrent = await this.api.download(resource.torrent_id);
    //       if (!torrent) return this.setProgressState(progress, 'qBittorrent', 'skipped', `torrent is not exist: ${meta.title}`);
    //       this.setProgressState(progress, 'create_torrent', 'downloaded', `downloaded ${meta.title}`);
    //
    //       taskHashes.push(resource.info_hash);
    //
    //       return this.torrentsAdd(torrent, progress, p, true, undefined);
    //     } else {
    //       // pt有，qb无，不一致 => 忽略
    //       return this.setProgressState(progress, 'create_torrent', 'conflict', `${filepath} has same version_id with server but not same file`);
    //     }
    //   }
    // } else if (resourceIndex < 0) {
    //   // pt无 => 发布资源并添加下载任务
    //   const torrent = (await this.createTorrent(filepath, meta, progress, true, true))!;
    //   this.setProgressState(progress, 'create_torrent', 'uploaded');
    //
    //   const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
    //   resourceVersionIds.push(meta.version_id);
    //   taskHashes.push(info.infoHash);
    //
    //   return this.torrentsAdd(torrent, progress, p, true, undefined);
    // }
  }

  async browseLocal() {
    const result = await showDirectoryPicker();
    for (const file of result) {
      console.log(file);
    }
  }

  private async createTorrent(file: File | string, meta: any, progress: PublishLog, upload_flag: boolean, is_remote_publish_flag: boolean) {
    try {
      this.setProgressState(progress, 'create_torrent', 'creating');

      const name = meta.title
        .replace(/[<>:"\/\\|?*+#&().,—!™'\[\]]/g, '')
        .replace(/ {2,}/g, ' ')
        .trim();

      const opts = {
        name: `[${meta.version_id}] ${name} ${meta.version}.unitypackage`,
        createdBy: 'UnityPT 1.0',
        announceList: [],
        private: true,
      };

      // @ts-ignore promisify
      const torrent0: Buffer = await util.promisify(createTorrent)(file, opts);

      this.setProgressState(progress, 'create_torrent', 'uploading');

      return upload_flag
        ? await this.api.upload(torrent0, JSON.stringify(meta), `${name}.torrent`)
        : new Blob([torrent0], {type: 'application/x-bittorrent'});
    } catch (err) {
      this.setProgressState(progress, 'qBittorrent', 'skipped');
      this.setProgressState(progress, 'create_torrent', 'conflict', `create torrent failed: ${meta.title}`);
      throw err;
    }
  }

  private startNewProgress(filename: string) {
    const progress = {file: filename} as PublishLog;
    this.dataSource.push(progress);
    this.table.renderRows();
    document.querySelector(`tr:nth-child(${this.dataSource.length})`)?.scrollIntoView({block: 'nearest'});
    return progress;
  }

  private setProgressState(progress: PublishLog, key: 'create_torrent' | 'version_id' | 'qBittorrent', value: any, log?: string) {
    progress[key] = value;
    this.table.renderRows();
    if (log) console.log(log);
  }
}

export interface PublishLog {
  file: string;
  version_id?: string | boolean;
  create_torrent?: 'downloading' | 'downloaded' | 'creating' | 'uploading' | 'uploaded' | 'restart' | 'conflict';
  qBittorrent?: 'adding' | 'added' | 'skipped';
}
