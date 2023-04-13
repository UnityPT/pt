import {Injectable} from '@angular/core';
import {BehaviorSubject, lastValueFrom} from 'rxjs';
import * as path from 'node:path';
import {Gzip} from '../gzip';
import {Meta, Resource, ResourceMeta} from '../types';
import {Torrent, TorrentState} from '@ctrl/qbittorrent/dist/src/types';
import {ApiService} from '../api/services/api.service';
// @ts-ignore
import * as parseTorrent from 'parse-torrent';

const unfinishedState: string[] = [
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

@Injectable({
  providedIn: 'root',
})
export class PublishService {
  items!: Record<string, ResourceMeta>;
  tasks!: Record<string, Torrent>;

  constructor(private api: ApiService) {}

  Local(files: AsyncIterableIterator<FileSystemFileHandle>, taskHashes: string[], resourceVersionIds: string[]) {
    const result = new BehaviorSubject<PublishLog[]>([]);
    const _ = this.Local2(result, files, taskHashes, resourceVersionIds);
    return result;
  }

  async Local2(
    subject: BehaviorSubject<PublishLog[]>,
    files: AsyncIterableIterator<FileSystemFileHandle>,
    taskHashes: string[],
    resourceVersionIds: string[]
  ) {
    const result: PublishLog[] = [];
    for await (const file of files) {
      if (path.extname(file.name) !== '.unitypackage') continue;
      this.processLocalOne(subject, file);
    }
  }

  setProgress(subject: BehaviorSubject<PublishLog[]>, progress: PublishLog, update: Partial<PublishLog>, log?: string) {
    Object.assign(progress, update);
    subject.next(subject.value);
    if (log) console.log(log);
  }

  async processLocalOne(subject: BehaviorSubject<PublishLog[]>, file: FileSystemFileHandle) {
    const progress: PublishLog = {file: file.name};
    subject.value.push(progress);
    subject.next(subject.value);

    const description = await Gzip.ExtractField((await file.getFile()).stream());
    if (!description) {
      this.setProgress(subject, progress, {version_id: null}, `${file.name} is not a unity asset store package`);
      return;
    }
    const meta = <Meta>JSON.parse(description);
    if (!meta.version_id) return this.setProgress(subject, progress, {version_id: null});
    this.setProgress(subject, progress, {version_id: meta.version_id}, `${file.name} is strange`);

    const item = this.items[meta.version_id];

    if (item) {
      // pt 有
      const {resource} = item;
      const t = this.tasks[resource.info_hash];
      if (t) {
        // pt 有，qb 有
        if (unfinishedState.includes(t.state)) {
          // pt 有，qb 有，没下载完 => 重启任务
          // return this.reStartTask(resource.torrent_id, meta, resource.info_hash, t.content_path!, p, progress, false);
        } else {
          // pt 有，qb 有，下载完 => 跳过
          this.setProgress(subject, progress, {qBittorrent: 'skipped'}, `finished or unknown state:${t.state}`);
        }
      } else if (description === resource.description) {
        // pt 有，qb 无，一致 => 添加下载任务
        this.setProgress(subject, progress, {create_torrent: 'downloading'}, `downloading ${meta.title}`);
        // @ts-ignore
        const torrent: Blob = await lastValueFrom(this.api.appControllerDownload());
        this.setProgress(subject, progress, {create_torrent: 'downloaded'}, `downloaded ${meta.title}`);
        const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
        this.torrentsAdd(torrent, progress, file.path, false, info.name);
        this.tasks[resource.info_hash] = <Torrent>{state: TorrentState.Uploading};
      } else {
        // pt有，qb 无，不一致 => 忽略
        this.setProgress(subject, progress, {create_torrent: 'conflict'}, `has same version_id with server but not same file`);
      }
    } else {
      // pt 无 => 发布资源并添加下载任务
      const torrent = (await this.createTorrent(file, meta, progress, true, false))!;
      this.setProgress(subject, progress, {'create_torrent': 'uploaded'});

      const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
      // @ts-ignore file.path
      this.torrentsAdd(torrent, progress, file.path, false, info.name);
      this.items[meta.version_id] = {resource: <Resource>{info_hash: info.infoHash}, meta};
      this.tasks[info.info_hash] = <Torrent>{state: TorrentState.Uploading};
    }
  }
}

export interface PublishLog {
  file: string;
  version_id?: string | null;
  transmission?: string | number;
  create_torrent?: 'downloading' | 'downloaded' | 'creating' | 'uploading' | 'uploaded' | 'restart' | 'conflict';
  qBittorrent?: 'adding' | 'added' | 'skipped';
}
