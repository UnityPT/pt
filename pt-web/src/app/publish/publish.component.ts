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

  test: string[] = [];
  constructor(private api: ApiService, private qBittorrent: QBittorrentService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.protocol = (await window.electronAPI.store_get('qbConfig')).protocol;
  }

  async publish(selectFiles: FileList | null) {
    console.log('localpublish');
    if (!selectFiles) return;
    if (this.publishing) return;
    this.publishing = true;
    this.dataSource = [];
    const items = await this.api.index(true);
    let taskHashes: string[] = [];
    const resourceVersionIds = items.map((item) => item.meta.version_id);
    try {
      taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
    } catch (e) {
      console.error(e);
      alert('无法连接 qBittorrent，请确认 1. qBittorrent 正在运行，2. 正确启用了 WebUI， 3.已在设置界面正确填写用户密码');
      return;
    }

    for (let i = 0; i < selectFiles.length; i++) {
      const file = selectFiles.item(i)!;
      if (path.extname(file.name) !== '.unitypackage') continue;
      const progress = { file: file.name } as PublishLog;
      this.dataSource.push(progress);
      this.table.renderRows();
      document.querySelector(`tr:nth-child(${this.dataSource.length + 1})`)?.scrollIntoView({ block: 'nearest' });
      const description = await ExtraField(file, 65, 36).catch((err) => {
        console.error(err);
      });
      if (!description) {
        progress.version_id = false;
        this.table.renderRows();
        console.log(`${file.webkitRelativePath} is not a unity asset store package`);
        continue;
      }
      const meta = <Meta>JSON.parse(description);
      if (!meta.version_id) {
        progress.version_id = false;
        this.table.renderRows();
        console.log(`${file.webkitRelativePath} is strange`);
        continue;
      }
      progress.version_id = meta.version_id;
      this.table.renderRows();

      // @ts-ignore
      let p = file.path // provided by electron, not works in chrome.
        .replaceAll('\\', '/'); // 由于 path-browserify 只支持 posix 风格路径，不支持 win32风格
      console.log(p);

      const resourceIndex = resourceVersionIds.indexOf(meta.version_id);

      const torrentAdd = async (torrent: Blob) => {
        let isSmb = false;
        try {
          if (this.protocol == 'smb' && (p.startsWith('/Volumes') || p.startsWith('\\\\'))) {
            isSmb = true;
            const smbRemotePath = (await window.electronAPI.store_get('smbConfig')).remotePath;
            p = path.posix.join(
              (await window.electronAPI.store_get('qbConfig')).save_path,
              p.replace(smbRemotePath, '').replace(path.posix.join('/Volumes', new URL(smbRemotePath).pathname), '')
            );
          }
          await this.qBittorrent.torrentsAdd(torrent, this.protocol == 'local' || isSmb ? path.dirname(p) : undefined, path.basename(p));
          progress.qBittorrent = 'added';
        } catch (e) {
          console.error(e);
          progress.qBittorrent = 'skipped';
        }
        this.table.renderRows();
      };

      // 本地有，远端有
      if (resourceIndex >= 0) {
        const item = items[resourceIndex];
        if (!item) {
          progress.qBittorrent = 'skipped';
          this.table.renderRows();
          continue;
        } // 刚刚上传的，本地有重复文件。
        const { resource, meta } = item;
        if (taskHashes.includes(resource.info_hash)) {
          // 本地有，远端有，qb 有
          const t = (await this.qBittorrent.torrentsInfo({ hashes: resource.info_hash }))[0];
          if (this.unFinishedState.includes(t.state)) {
            // 本地有，远端有，qb 有, 没下载完 => 重启任务
            await this.qBittorrent.torrentsPause(resource.info_hash);
            await this.qBittorrent.waitPaused(resource.info_hash);
            // @ts-ignore
            await window.electronAPI.delete_file(t.content_path);
            await this.qBittorrent.torrentsSetLocation(resource.info_hash, path.dirname(p));
            const torrent = (await this.createTorrent(file, meta, progress, false))!;

            const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
            const hash = info.infoHash!;
            resourceVersionIds.push(meta.version_id);
            taskHashes.push(hash);

            if (this.protocol == 'local') {
              try {
                await this.qBittorrent.torrentsRestart(resource.info_hash, info.name, path.basename(p));
                progress.qBittorrent = 'added';
              } catch (e) {
                console.error(e);
                progress.qBittorrent = 'skipped';
              }
              this.table.renderRows();
              //continue;
            } else {
              //@ts-ignore
              window.electronAPI.upload_file(file.path, info.name).then(() => {
                torrentAdd(torrent);
              });
              //continue;
            }
          } else {
            // 本地有,远端有,qb 有,已下载完成或未知情况 => 跳过
            progress.qBittorrent = 'skipped';
            this.table.renderRows();
            //continue;
          }
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
              continue;
            }
            progress.create_torrent = 'downloaded';
            taskHashes.push(resource.info_hash);
            //@ts-ignore
            if (this.protocol == 'local') {
              torrentAdd(torrent);
              //continue;
            } else {
              //@ts-ignore
              window.electronAPI.upload_file(file.path, resource.name).then(() => {
                torrentAdd(torrent);
              });
              //continue;
            }
          } else {
            // 本地有，远端有，qb 无，不一致 => 忽略
            console.log(`${p} has same version_id with server but not same file`);
            progress.create_torrent = 'conflict';
            this.table.renderRows();
            //continue;
          }
        }
      } else if (resourceIndex < 0) {
        // 本地有，远端无   => 发布资源并添加下载任务
        console.log(`uploading ${meta.title}`);
        progress.create_torrent = 'creating';
        this.table.renderRows();

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

        progress.create_torrent = 'uploading';
        this.table.renderRows();

        const torrent = await this.api.upload(torrent0, description, `${name}.torrent`);
        if (!torrent) {
          progress.qBittorrent = 'skipped';
          this.table.renderRows();
          continue;
        }
        progress.create_torrent = 'uploaded';
        this.table.renderRows();

        const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
        const hash = info.infoHash!;
        resourceVersionIds.push(meta.version_id);
        taskHashes.push(hash);

        //@ts-ignore
        if (this.protocol == 'local') {
          torrentAdd(torrent);
        } else {
          //@ts-ignore
          window.electronAPI.upload_file(file.path, info.name).then(() => {
            torrentAdd(torrent);
          });
        }
      }
    }
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

    this.dataSource = [];
    const items = await this.api.index(true);
    const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
    const resourceVersionIds = items.map((item) => item.meta.version_id);
    const qbSavePath = (await window.electronAPI.store_get('qbConfig')).save_path;
    const smbRemotePath = (await window.electronAPI.store_get('smbConfig')).remotePath;
    const filepaths = (await window.electronAPI.get_list(result, 'f')) as string[];
    for (const filepath of filepaths) {
      await this.processOne(filepath, items, taskHashes, resourceVersionIds, qbSavePath, smbRemotePath);
    }
    this.publishing = false;
  }

  async processOne(
    filepath: string,
    items: { resource: Resource; meta: Meta }[],
    taskHashes: string[],
    resourceVersionIds: string[],
    qbSavePath: string,
    smbRemotePath: string
  ) {
    if (path.extname(filepath) !== '.unitypackage') return;
    const progress = { file: path.posix.basename(filepath.replaceAll('\\', '')) } as PublishLog;
    this.dataSource.push(progress);
    this.table.renderRows();

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
    progress.create_torrent = 'creating';
    this.table.renderRows();

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

    progress.create_torrent = 'uploading';
    this.table.renderRows();

    const torrent = upload_flag
      ? await this.api.upload(torrent0, JSON.stringify(meta), `${name}.torrent`)
      : new Blob([torrent0], { type: 'application/x-bittorrent' });
    if (!torrent) {
      progress.qBittorrent = 'skipped';
      this.table.renderRows();
    }
    progress.create_torrent = 'uploaded';
    this.table.renderRows();
    return torrent;
  }
}

export interface PublishLog {
  file: string;
  version_id?: string | boolean;
  create_torrent?: 'downloading' | 'downloaded' | 'creating' | 'uploading' | 'uploaded' | 'conflict';
  qBittorrent?: 'added' | 'skipped';
}
