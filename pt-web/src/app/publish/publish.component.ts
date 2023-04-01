import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtraField } from '../gzip';
import { Meta } from '../types';
import createTorrent from 'create-torrent';
import { ApiService } from '../api.service';
import { QBittorrentService } from '../qbittorrent.service';
import path from 'path';
import { MatTable } from '@angular/material/table';
import util from 'util';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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

  constructor(private api: ApiService, private qBittorrent: QBittorrentService, private dialog: MatDialog) {}

  async ngOnInit() {}

  async publish(selectFiles: FileList | null) {
    console.log('local publish');
    if (!selectFiles) return;

    this.dataSource = [];
    const files: File[] = [];
    for (let i = 0; i < selectFiles.length; i++) {
      const file = selectFiles[i];
      if (path.extname(file.name) !== '.unitypackage') continue;
      files.push(file);
      this.dataSource.push({ file: file.name });
    }
    this.table.renderRows();

    const protocol = (await window.electronAPI.store_get('qbConfig')).protocol;
    const items = await this.api.index(true);
    const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
    const resourceVersionIds = items.map((item) => item.meta.version_id);
    for (let i = 0; i < files.length; i++) {
      document.querySelector(`tr:nth-child(${i + 1})`)?.scrollIntoView({ block: 'nearest' });
      const file = files[i];
      const progress = this.dataSource[i];
      const description = await ExtraField(file, 65, 36);
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
      const p = file.path // provided by electron, not works in chrome.
        .replaceAll('\\', '/'); // 由于 path-browserify 只支持 posix 风格路径，不支持 win32风格
      console.log(p);

      const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
      // 本地有，远端有
      if (resourceIndex >= 0) {
        const item = items[resourceIndex];
        if (!item) continue; // 刚刚上传的，本地有重复文件。

        const { resource, meta } = item;
        // 本地有，远端有，qb 有 => 什么都不做
        if (taskHashes.includes(resource.info_hash)) {
          progress.qBittorrent = 'skipped';
        } else {
          if (description === resource.description) {
            // 本地有，远端有，qb 无，一致 => 添加下载任务
            console.log(`downloading ${meta.title}`);
            progress.create_torrent = 'downloading';
            this.table.renderRows();
            const torrent = await this.api.download(resource.torrent_id);
            if (torrent) {
              taskHashes.push(resource.info_hash);
              const refreshState = async () => {
                await this.qBittorrent.torrentsAdd(torrent, protocol == 'local' ? path.dirname(p) : undefined, path.basename(p));
                progress.create_torrent = 'downloaded';
                progress.qBittorrent = 'added';
                this.table.renderRows();
              };
              //@ts-ignore
              if (protocol == 'local') {
                Promise.resolve().then(refreshState);
              } else {
                //@ts-ignore
                window.electronAPI.upload_file(file.path).then(refreshState);
              }
            }
          } else {
            // 本地有，远端有，qb 无，不一致 => 忽略
            console.log(`${p} has same version_id with server but not same file`);
            progress.create_torrent = 'conflict';
            this.table.renderRows();
          }
        }
      } else {
        // 本地有，远端无 => 发布资源并添加下载任务
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
        if (!torrent) continue;
        progress.create_torrent = 'uploaded';
        this.table.renderRows();

        const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
        const hash = info.infoHash!;
        resourceVersionIds.push(meta.version_id);
        taskHashes.push(hash);
        const refreshState = async () => {
          await this.qBittorrent.torrentsAdd(torrent, protocol == 'local' ? path.dirname(p) : undefined, path.basename(p));
          progress.qBittorrent = 'added';
          this.table.renderRows();
        };

        //@ts-ignore
        if (protocol == 'local') {
          Promise.resolve().then(refreshState);
        } else {
          //@ts-ignore
          window.electronAPI.upload_file(file.path).then(refreshState);
        }
      }
    }
  }

  async browseRemote() {
    const protocol = (await window.electronAPI.store_get('qbConfig')).protocol;
    if (protocol === 'local') {
      return alert('请先设置远程通讯协议');
    }
    const items = await this.api.index(true);
    const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
    const resourceVersionIds = items.map((item) => item.meta.version_id);
    this.dataSource = [];

    const qbSavePath = (await window.electronAPI.store_get('qbConfig')).save_path;

    const protoPath = await this.api.getProtoPath(protocol);
    const dirItems = await window.electronAPI.get_list(protoPath, 'd');
    const dialogRef = this.dialog.open(BrowseRemoteComponent, {
      width: '600px',
      data: {
        dirItems,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return console.log('no result');
      const filepaths: string[] = [];
      ((await window.electronAPI.get_list(path.posix.join(protoPath, result), 'f')) as string[]).forEach((filepath) => {
        if (!filepath) return;
        if (path.extname(filepath) !== '.unitypackage') return;
        this.dataSource.push({ file: path.basename(filepath) });
        filepaths.push(filepath);
      });
      this.table.renderRows();
      for (let i = 0; i < this.dataSource.length; i++) {
        const filepath = filepaths[i];
        const progress = this.dataSource[i];
        const description = await window.electronAPI.extra_field(filepath);
        console.log(description);
        if (!description) {
          progress.version_id = false;
          this.table.renderRows();
          console.log(`${filepath} is not a unity asset store package`);
          continue;
        }
        const meta = <Meta>JSON.parse(description);
        if (!meta.version_id) {
          progress.version_id = false;
          this.table.renderRows();
          console.log(`${filepath} is strange`);
          continue;
        }
        progress.version_id = meta.version_id;
        this.table.renderRows();

        const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
        // 以下的"本地"指用户远程qb的服务器, "远端"指pt的数据库
        // 本地有，远端有
        //这里的p是容器内路径
        const p = path.posix.join(qbSavePath, filepath);
        if (resourceIndex >= 0) {
          const item = items[resourceIndex];
          if (!item) continue; // 刚刚上传的，本地有重复文件。

          const { resource, meta } = item;
          // 本地有，远端有，qb 有 => 什么都不做
          if (taskHashes.includes(resource.info_hash)) {
            progress.qBittorrent = 'skipped';
          } else {
            if (description === resource.description) {
              // 本地有，远端有，qb 无，一致 => 添加下载任务
              console.log(`downloading ${meta.title}`);
              progress.create_torrent = 'downloading';
              this.table.renderRows();
              const torrent = await this.api.download(resource.torrent_id);
              if (torrent) {
                await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
                progress.create_torrent = 'downloaded';
                progress.qBittorrent = 'added';
                this.table.renderRows();
                taskHashes.push(resource.info_hash);
              }
            } else {
              // 本地有，远端有，qb 无，不一致 => 忽略
              console.log(`${filepath} has same version_id with server but not same file`);
              progress.create_torrent = 'conflict';
              this.table.renderRows();
            }
          }
        } else {
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
          if (!torrent) continue;
          progress.create_torrent = 'uploaded';
          this.table.renderRows();

          const hash = await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
          progress.qBittorrent = 'added';
          this.table.renderRows();

          resourceVersionIds.push(meta.version_id);
          taskHashes.push(hash);
        }
      }
    });
  }
}

export interface PublishLog {
  file: string;
  version_id?: string | boolean;
  create_torrent?: 'downloading' | 'downloaded' | 'creating' | 'uploading' | 'uploaded' | 'conflict';
  qBittorrent?: 'added' | 'skipped';
}
