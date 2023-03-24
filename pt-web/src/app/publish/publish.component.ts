import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtraField } from '../gzip';
import { FileItem, Meta } from '../types';
import createTorrent from 'create-torrent';
import { ApiService } from '../api.service';
import { QBittorrentService } from '../qbittorrent.service';
import path from 'path';
import { MatTable } from '@angular/material/table';
import util from 'util';
import { AuthType, createClient, FileStat, WebDAVClient } from 'webdav';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowseRemoteComponent } from '../browse-remote/browse-remote.component';
import * as fs from 'fs';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit {
  displayedColumns: string[] = ['file', 'version_id', 'create_torrent', 'qBittorrent'];
  dataSource: PublishLog[] = [];
  @ViewChild(MatTable) table!: MatTable<PublishLog>;
  public browsingRemote = false;
  public webDavClient!: WebDAVClient;

  constructor(private api: ApiService, private qBittorrent: QBittorrentService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.webDavClient = createClient('https://frogeater.vip/webdav/', {
      authType: AuthType.Password,
      username: 'frogeater',
      password: '123456',
    });
    console.log('this.client: ');
  }

  async publish(files: FileList | null) {
    if (!files) return;

    this.dataSource = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)!;
      if (path.extname(file.name) !== '.unitypackage') continue;
      this.dataSource.push({ file: file.name });
    }
    this.table.renderRows();

    const items = await this.api.index(true);
    const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
    const resourceVersionIds = items.map((item) => item.meta.version_id);

    for (let i = 0; i < files.length; i++) {
      document.querySelector(`tr:nth-child(${i + 1})`)?.scrollIntoView({ block: 'nearest' });
      const file = files.item(i)!;
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
              await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
              progress.create_torrent = 'downloaded';
              this.table.renderRows();
              taskHashes.push(resource.info_hash);
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

        const hash = await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
        progress.qBittorrent = 'added';
        this.table.renderRows();

        resourceVersionIds.push(meta.version_id);
        taskHashes.push(hash);
      }
    }
  }

  async browseRemote() {
    this.browsingRemote = true;
    const remoteType = 'sftp';

    // http
    // const directoryItems = await this.client.getDirectoryContents('/', { deep: true });
    // console.log(directoryItems);
    //
    if (remoteType === 'sftp') {
      //ssh
      const directoryItems = await this.api.getRemoteDir();
      const dialogRef = this.dialog.open(BrowseRemoteComponent, {
        width: '600px',
        data: {
          directoryItems,
        },
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (!result) return;
        this.dataSource = [];
        const filepaths: string[] = [];
        (await window.electronAPI.get_list(result[0].path, 'f')).split('\n').forEach((filepath) => {
          if (!filepath) return;
          if (path.extname(filepath) !== '.unitypackage') return;
          this.dataSource.push({ file: path.basename(filepath) });
          filepaths.push(filepath);
          this.table.renderRows();
        });
        const items = await this.api.index(true);
        const taskHashes = (await this.qBittorrent.torrentsInfo({ category: 'Unity' })).map((t) => t.hash);
        const resourceVersionIds = items.map((item) => item.meta.version_id);

        for (let i = 0; i < this.dataSource.length; i++) {
          const filepath = filepaths[i];
          const progress = this.dataSource[i];
          const description = await window.electronAPI.extra_field(filepath);
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
                  await this.qBittorrent.torrentsAdd(torrent, path.dirname(filepath), path.basename(filepath));
                  progress.create_torrent = 'downloaded';
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

            progress.create_torrent = 'uploading';
            this.table.renderRows();

            const torrent = await this.api.upload(torrent0, description, `${name}.torrent`);
            if (!torrent) continue;
            progress.create_torrent = 'uploaded';
            this.table.renderRows();

            const hash = await this.qBittorrent.torrentsAdd(torrent, path.dirname(filepath), path.basename(filepath));
            progress.qBittorrent = 'added';
            this.table.renderRows();

            resourceVersionIds.push(meta.version_id);
            taskHashes.push(hash);
          }
        }
      });
    }
  }
}

export interface PublishLog {
  file: string;
  version_id?: string | boolean;
  create_torrent?: 'downloading' | 'downloaded' | 'creating' | 'uploading' | 'uploaded' | 'conflict';
  qBittorrent?: 'added' | 'skipped';
}
