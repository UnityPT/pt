import {Component, OnInit} from '@angular/core';
import {ExtraField} from "../gzip";
import {Meta} from "../types";
import createTorrent from "create-torrent";
import {ApiService} from "../api.service";
import {QBittorrentService} from "../qbittorrent.service";
import path from "path";

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {

  constructor(private api: ApiService, private qBittorrent: QBittorrentService) {
  }

  ngOnInit(): void {
  }

  async publish(files: FileList | null) {
    if (!files) return;

    const items = await this.api.index(true);
    const taskHashes = (await this.qBittorrent.torrentsInfo({category: 'Unity'})).map(t => t.hash);
    const resourceVersionIds = items.map((item) => item.meta.version_id);

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)!;
      const description = await ExtraField(file, 65, 36);
      if (!description) {
        console.log(`${file.webkitRelativePath} is not a unity asset store package`);
        continue;
      }
      const meta = <Meta>JSON.parse(description);
      if (!meta.version_id) {
        console.log(`${file.webkitRelativePath} is strange`);
        continue;
      }

      // @ts-ignore
      const p = file.path // provided by electron, not works in chrome.
        .replaceAll('\\', '/'); // 由于 path-browserify 只支持 posix 风格路径，不支持 win32风格
      console.log(p);

      const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
      // 本地有，远端有
      if (resourceIndex >= 0) {
        const item = items[resourceIndex];
        if (!item) continue; // 刚刚上传的，本地有重复文件。

        const {resource, meta} = item;
        // 本地有，远端有，qb 有 => 什么都不做
        if (taskHashes.includes(resource.info_hash)) {
        } else {
          if (description === resource.description) {
            // 本地有，远端有，qb 无，一致 => 添加下载任务
            console.log(`downloading ${meta.title}`);
            const torrent = await this.api.download(resource.torrent_id);
            if(torrent) {
              await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
              taskHashes.push(resource.info_hash);
            }
          } else {
            // 本地有，远端有，qb 无，不一致 => 忽略
            console.log(`${p} has same version_id with server but not same file`);
          }
        }
      } else {
        // 本地有，远端无 => 发布资源并添加下载任务
        console.log(`uploading ${meta.title}`);
        const name = meta.title
          .replace(/[<>:"\/\\|?*+#&().,—!™'\[\]]/g, '')
          .replace(/ {2,}/g, ' ')
          .trim();

        const torrent0: Uint8Array = await new Promise((resolve, reject) => {
          createTorrent(file, {
            name: `[${meta.version_id}] ${name} ${meta.version}.unitypackage`,
            createdBy: 'UnityPT 1.0',
            announceList: [],
            private: true,
          }, (err: any, torrent: any) => err ? reject(err) : resolve(torrent))
        })

        const torrent = await this.api.upload(torrent0, description, `${name}.torrent`);
        if (!torrent) return;
        const hash = await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
        resourceVersionIds.push(meta.version_id);
        taskHashes.push(hash);
      }
    }
  }
}
