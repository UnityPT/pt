import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtraField } from '../gzip';
import { Meta, Resource } from '../types';
import createTorrent from 'create-torrent';
import { ApiService } from '../api.service';
import { QBittorrentService } from '../qbittorrent.service';
import path from 'path';
import { MatTable } from '@angular/material/table';
import util from 'util';
import { MatDialog } from '@angular/material/dialog';
import { BrowseRemoteComponent } from '../browse-remote/browse-remote.component';
import { Buffer } from 'buffer';
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
  unFinishedState: string[] = ['error', 'missingFiles', 'allocating', 'downloading', 'metaDL', 'pausedDL', 'queuedDL', 'stalledDL', 'checkingDL', 'forcedDL'];

  constructor(private api: ApiService, private qBittorrent: QBittorrentService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.protocol = (await window.electronAPI.store_get('qbConfig')).protocol;
  }

  async publish(selectFiles: FileList | null) {
    console.log('localpublish');
    if (!selectFiles) return;
    if (this.publishing) return;
    this.publishing = true;

    try {
      this.dataSource = [];
      const items = await this.api.index(true);
      const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
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
  }

  async processLocalOne(file: File, items: { resource: Resource; meta: any }[], taskHashes: string[], resourceVersionIds: string[]) {
    if (path.extname(file.name) !== '.unitypackage') return;

    const progress = this.startNewProgress(file.name);

    const description = await ExtraField(file, 65, 36).catch(console.error);
    if (!description) return this.setProgressState(progress, 'version_id', false, `${file.webkitRelativePath} is not a unity asset store package`);
    const meta = <Meta>JSON.parse(description);
    if (!meta.version_id) return this.setProgressState(progress, 'version_id', false, `${file.webkitRelativePath} is strange`);

    this.setProgressState(progress, 'version_id', meta.version_id, meta.version_id);

    // @ts-ignore  // provided by electron, not works in chrome.
    const p = file.path.replaceAll('\\', '/'); // 由于 path-browserify 只支持 posix 风格路径，不支持 win32风格

    const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
    // 本地有，远端有
    if (resourceIndex >= 0) {
      const item = items[resourceIndex];
      if (!item) return this.setProgressState(progress, 'qBittorrent', 'skipped', 'file is repeated');
      const { resource, meta } = item;
      if (taskHashes.includes(resource.info_hash)) {
        // 本地有，远端有，qb 有
        const t = (await this.qBittorrent.torrentsInfo({ hashes: resource.info_hash }))[0];
        if (this.unFinishedState.includes(t.state)) {
          // 本地有，远端有，qb 有, 没下载完 => 重启任务
          // @ts-ignore   //t.content_path报错，实际有这个属性
          return this.reStartTask(file, meta, resource.info_hash, t.content_path!, p, progress);
        } else {
          // 本地有,远端有,qb 有,已下载完成或未知情况 => 跳过
          return this.setProgressState(progress, 'qBittorrent', 'skipped', 'fished or unknown state');
        }
      } else {
        if (description === resource.description) {
          // 本地有，远端有，qb 无，一致 => 添加下载任务
          this.setProgressState(progress, 'create_torrent', 'downloading', `downloading ${meta.title}`);
          const torrent = await this.api.download(resource.torrent_id);
          if (!torrent) return this.setProgressState(progress, 'qBittorrent', 'skipped', `torrent is not exist: ${meta.title}`);
          this.setProgressState(progress, 'create_torrent', 'downloaded');

          const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
          taskHashes.push(resource.info_hash);
          // @ts-ignore
          this.torrentsAdd(torrent, file.path, info.name, progress);
          return;
        } else {
          // 本地有，远端有，qb 无，不一致 => 忽略
          return this.setProgressState(progress, 'create_torrent', 'conflict', `${p} has same version_id with server but not same file`);
        }
      }
    } else if (resourceIndex < 0) {
      // 本地有，远端无   => 发布资源并添加下载任务
      console.log(`uploading ${meta.title}`);
      const torrent = (await this.createTorrent(file, meta, progress, true))!;
      if (!torrent) {
        this.setProgressState(progress, 'qBittorrent', 'skipped');
        return this.setProgressState(progress, 'create_torrent', 'conflict', `create torrent failed: ${meta.title}`);
      }
      this.setProgressState(progress, 'create_torrent', 'uploaded');

      const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
      resourceVersionIds.push(meta.version_id);
      taskHashes.push(info.infoHash);
      // @ts-ignore
      this.torrentsAdd(torrent, file.path, info.name, progress);
    }
  }

  async torrentsAdd(torrent: Blob, filepath: string, name: string, progress: PublishLog) {
    const p = filepath.replaceAll('\\', '/');
    if (this.protocol == 'local') {
      await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
    } else {
      // 远程qb本地发布，但选择了smb目录
      const { result, newpath } = await this.checkLocalSmb(torrent, p);
      if (result) {
        await this.qBittorrent.torrentsAdd(torrent, path.dirname(newpath!), path.basename(newpath!));
      } else {
        // @ts-ignore
        await window.electronAPI.upload_file(filepath, name);
        // 正常的远程qb本地发布，需要先上传文件到远程默认目录，再添加任务
        await this.qBittorrent.torrentsAdd(torrent);
      }
    }
    this.setProgressState(progress, 'qBittorrent', 'added', `added ${name} to qBittorrent`);
  }

  async reStartTask(file: File, meta: Meta, taskHash: string, oldPath: string, newPath: string, progress: PublishLog) {
    try {
      await this.qBittorrent.torrentsPause(taskHash);
      await this.qBittorrent.waitPaused(taskHash);
      // @ts-ignore
      await window.electronAPI.delete_file(oldPath);

      const torrent = (await this.createTorrent(file, meta, progress, false))!;
      const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));

      if (this.protocol == 'local') {
        await this.qBittorrent.torrentsSetLocation(taskHash, path.dirname(newPath));
        await this.qBittorrent.torrentsRestart(taskHash, info.name, path.basename(newPath));
        return this.setProgressState(progress, 'qBittorrent', 'added', `restarted ${meta.title} to ${newPath}`);
      } else {
        const { result, newpath } = await this.checkLocalSmb(torrent, newPath);
        if (result) {
          await this.qBittorrent.torrentsSetLocation(taskHash, path.dirname(newpath!));
          await this.qBittorrent.torrentsRestart(taskHash, info.name, path.basename(newpath!));
          return this.setProgressState(progress, 'qBittorrent', 'added', `restarted ${meta.title} to ${newpath}`);
        } else {
          // 本地qb远程发布，上传文件，并重置到默认位置和标准文件名
          window.electronAPI.upload_file(newPath, info.name).then(async () => {
            const qbSavePath = (await window.electronAPI.store_get('qbConfig')).save_path;
            await this.qBittorrent.torrentsSetLocation(taskHash, qbSavePath);
            await this.qBittorrent.torrentsRestart(taskHash, info.name, info.name);
            this.setProgressState(progress, 'qBittorrent', 'added', `restarted ${meta.title} to ${newpath}`);
          });
        }
      }
    } catch (e) {
      this.setProgressState(progress, 'qBittorrent', 'skipped', 'failed to restart task:' + e);
    }
  }

  async checkLocalSmb(torrent: Blob, p: string) {
    if (this.protocol == 'smb') {
      const smbRemotePath = (await window.electronAPI.store_get('smbConfig')).remotePath;
      const macLocalSmbPath = path.posix.join('/Volumes', new URL(smbRemotePath).pathname); //这是mac的挂载路径，win的跟远程路径相同
      // 远程qb本地发布，但是选择了跟qb中填写的同一个smb文件夹,等于走远程qb远程发布(即源文件原地不动,所以需要rename)
      if (p.startsWith(smbRemotePath.replaceAll('\\', '/')) || p.startsWith(macLocalSmbPath)) {
        const newPath = path.posix.join(
          (await window.electronAPI.store_get('qbConfig')).save_path,
          p.replace(smbRemotePath.replaceAll('\\', '/'), '').replace(macLocalSmbPath, '')
        );
        return { result: true, newpath: newPath };
      }
    }
    return { result: false, newpath: null };
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
    if (this.protocol === 'smb') {
      const result = await window.electronAPI.smb_browse();
      return this.onSelected(result);
    } else if (this.protocol == 'sftp' || this.protocol == 'webdav') {
      const dirItems = await window.electronAPI.get_list('', 'd');
      const dialogRef = this.dialog.open(BrowseRemoteComponent, {
        width: '600px',
        height: '320px',
        data: {
          dirItems,
        },
      });
      dialogRef.afterClosed().subscribe(this.onSelected);
    }
  }

  async onSelected(result: string) {
    if (!result) {
      this.publishing = false;
      return console.log('no result');
    }

    try {
      this.dataSource = [];
      const items = await this.api.index(true);
      const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
      const resourceVersionIds = items.map((item) => item.meta.version_id);
      const qbSavePath = (await window.electronAPI.store_get('qbConfig')).save_path;
      const smbRemotePath = (await window.electronAPI.store_get('smbConfig')).remotePath;
      const filepaths = (await window.electronAPI.get_list(result, 'f')) as string[];
      for (const filepath of filepaths) {
        await this.processRemoteOne(filepath, items, taskHashes, resourceVersionIds, qbSavePath, smbRemotePath);
      }
    } catch (e) {
      console.error(e);
    }
    this.publishing = false;
  }

  async processRemoteOne(
    filepath: string,
    items: { resource: Resource; meta: Meta }[],
    taskHashes: string[],
    resourceVersionIds: string[],
    qbSavePath: string,
    smbRemotePath: string
  ) {
    if (path.extname(filepath) !== '.unitypackage') return;
    const progress = this.startNewProgress(path.posix.basename(filepath.replaceAll('\\', '')));

    const description = await window.electronAPI.extra_field(filepath).catch(console.error);
    if (!description) {
      progress.version_id = false;
      this.table.renderRows();
      console.log(`${filepath} is not a unity asset store package`);
      return;
    }
    const meta = <Meta>JSON.parse(description);
    if (!meta.version_id) {
      progress.version_id = false;
      this.table.renderRows();
      console.log(`${filepath} is strange`);
      return;
    }
    progress.version_id = meta.version_id;
    this.table.renderRows();

    // 以下的"本地"指用户远程qb的服务器, "远端"指pt的数据库
    // 本地有，远端有
    //对于容器内的qb,这里的p是容器内路径
    const p = path.posix.join(
      qbSavePath,
      filepath
        .replace(smbRemotePath.toUpperCase(), '') //win中fs获取的共享文件夹路径会被全部转成大写,所以这里要转成大写
        .replace(path.join('/Volumes', path.basename(smbRemotePath)), '') //mac中
        .replaceAll('\\', '/')
    ); //这里不是smb的路径不会被修改
    console.log('torrent add path: ', p);

    const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
    if (resourceIndex >= 0) {
      const item = items[resourceIndex];
      if (!item) {
        progress.qBittorrent = 'skipped';
        this.table.renderRows();
        return;
      } // 刚刚上传的，本地有重复文件。

      const { resource, meta } = item;
      if (taskHashes.includes(resource.info_hash)) {
        //todo;
      } else {
        if (description === resource.description) {
          // 本地有，远端有，qb 无，一致 => 添加下载任务
          console.log(`downloading ${meta.title}`);
          progress.create_torrent = 'downloading';
          this.table.renderRows();
          const torrent = await this.api.download(resource.torrent_id);
          if (!torrent) {
            progress.qBittorrent = 'skipped';
            this.table.renderRows();
            return;
          }
          try {
            await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
            progress.create_torrent = 'downloaded';
            progress.qBittorrent = 'added';
          } catch (e) {
            progress.qBittorrent = 'skipped';
          }
          this.table.renderRows();
          taskHashes.push(resource.info_hash);
          return;
        } else {
          // 本地有，远端有，qb 无，不一致 => 忽略
          console.log(`${filepath} has same version_id with server but not same file`);
          progress.create_torrent = 'conflict';
          this.table.renderRows();
          return;
        }
      }
    } else if (resourceIndex < 0) {
      // 本地有，远端无 => 发布资源并添加下载任务
      console.log(`uploading ${meta.title}`);
      progress.create_torrent = 'creating';
      this.table.renderRows();

      const name = meta.title
        .replace(/[<>:"\/\\|?*+#&().,—!™'\[\]]/g, '')
        .replace(/ {2,}/g, ' ')
        .trim();

      const torrent0: Buffer = await window.electronAPI.create_torrent(filepath, {
        name: `[${meta.version_id}] ${name} ${meta.version}.unitypackage`,
        createdBy: 'UnityPT 1.0',
        announceList: [],
        private: true,
      });
      console.log(torrent0);

      progress.create_torrent = 'uploading';
      this.table.renderRows();

      const torrent = await this.api.upload(torrent0, description, `${name}.torrent`);
      if (!torrent) {
        progress.qBittorrent = 'skipped';
        this.table.renderRows();
        return;
      }
      progress.create_torrent = 'uploaded';
      this.table.renderRows();
      try {
        const hash = await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
        progress.qBittorrent = 'added';
        resourceVersionIds.push(meta.version_id);
        taskHashes.push(hash);
      } catch (e) {
        console.error(e);
        progress.qBittorrent = 'skipped';
      }
      this.table.renderRows();
    }
  }

  private async createTorrent(file: File, meta: any, progress: PublishLog, upload_flag: boolean) {
    this.setProgressState(progress, 'create_torrent', 'creating');

    const name = meta.title
      .replace(/[<>:"\/\\|?*+#&().,—!™'\[\]]/g, '')
      .replace(/ {2,}/g, ' ')
      .trim();

    // @ts-ignore
    const torrent0: Buffer = await util.promisify(createTorrent)(file, {
      name: `[${meta.version_id}] ${name} ${meta.version}.unitypackage`,
      createdBy: 'UnityPT 1.0',
      announceList: [],
      private: true,
    });

    this.setProgressState(progress, 'create_torrent', 'uploading');

    return upload_flag ? await this.api.upload(torrent0, JSON.stringify(meta), `${name}.torrent`) : new Blob([torrent0], { type: 'application/x-bittorrent' });
  }

  private startNewProgress(filename: string) {
    document.querySelector(`tr:nth-child(${this.dataSource.length + 1})`)?.scrollIntoView({ block: 'nearest' });
    const progress = { file: filename } as PublishLog;
    this.dataSource.push(progress);
    this.table.renderRows();
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
  create_torrent?: 'downloading' | 'downloaded' | 'creating' | 'uploading' | 'uploaded' | 'conflict';
  qBittorrent?: 'added' | 'skipped';
}
