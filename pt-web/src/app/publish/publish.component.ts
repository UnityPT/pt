import {Component, OnInit, ViewChild} from '@angular/core';
import {Gzip} from '../gzip';
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

import 'core-js/actual/async-iterator/filter.js';
import {SettingsService} from '../setting/settings.service';

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

  constructor(
    private api: ApiService,
    private qBittorrent: QBittorrentService,
    private dialog: MatDialog,
    private settings: SettingsService
  ) {}

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
  ) {}

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
  }

  async browseLocal() {
    // const headers = new Headers({
    //   // @ts-ignore
    //   Authorization: 'Basic ' + btoa(this.settings.config.remote.username + ':' + this.settings.config.remote.password),
    // });
    //
    // const response = await fetch('https://qb.lolo.moe:8443/[628317] UHAK Ultimate Horror Adventure Kit 1.2.5.unitypackage', {headers});
    // console.log(response.body);
    // if (!response.body) throw '?';
    // try {
    //   const description = await Gzip.ExtractField(response.body);
    //   console.log(description.length);
    // } catch {
    //   await response.body.cancel();
    //   return;
    // }

    for await (const file of this.recursive(await showDirectoryPicker())) {
      if (path.extname(file.name) !== '.unitypackage') continue;

      const f = await file.getFile();
      console.log(f.size);
      console.log(await f.arrayBuffer());
      setTimeout(() => {
        console.log(f);
      }, 1000000);

      // console.log();
      // ExtraField(file.getFile());
      // const x = new ReadableStream();
      // new Blob([x]);
    }
  }

  async *recursive(root: FileSystemDirectoryHandle): AsyncIterableIterator<FileSystemFileHandle> {
    for await (const file of root.values()) {
      if (file.kind === 'file') {
        yield file;
      } else {
        yield* this.recursive(file);
      }
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
