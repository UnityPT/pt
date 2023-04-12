import {Component, OnInit} from '@angular/core';
import {Resource, ResourceMeta} from '../types';
import {Torrent} from '@ctrl/qbittorrent/dist/src/types';
import {FormControl} from '@angular/forms';
import {concatMap, map, reduce, startWith, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {QBittorrentService} from '../qbittorrent.service';
import {ApiService} from '../api.service';
import {mapValues, orderBy, pullAll, sortBy} from 'lodash-es';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  items: ResourceMeta[] = [];
  version_sum: number = 0;
  itemsGroup: Record<string, ResourceMeta[]> = {};
  torrents: Record<string, Torrent> = {};
  refreshed_at: Date = new Date();
  requesting: Set<string> = new Set();

  statusFinished = new Set(['uploading', 'pausedUP', 'queuedUP', 'stalledUP', 'checkingUP', 'forcedUP']);
  statusDownloading = new Set(['downloading', 'pausedDL', 'stalledDL', 'checkingDL', 'forcedDL']);

  myControl = new FormControl('');
  filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map((value) => this.filter(value || ''))
  );
  selected?: ResourceMeta;

  ssh_get_file_progress: Record<string, number> = {};

  constructor(private http: HttpClient, private qBittorrent: QBittorrentService, private api: ApiService) {}

  trackById(index: number, item: ResourceMeta) {
    return item.resource.torrent_id;
  }

  async ngOnInit() {
    // try {
    //   await this.qBittorrent.appVersion();
    // } catch (error) {
    //   alert('无法连接 qBittorrent，请确认 qBittorrent 正在运行，且启用了 WebUI');
    //   throw error;
    // }

    // await this.api.login();
    // await this.loadTorrents();
    await this.refresh();
    // setInterval(() => this.loadTorrents(), 800);

    // window.electronAPI.on('get_file_progress', async (event, data) => {
    //   this.ssh_get_file_progress[data.infoHash] = data.progress;
    //   if (data.progress === 1) {
    //     const localPath = (await window.electronAPI.store_get('qbConfig', {})).local_path;
    //     await window.electronAPI.import(localPath, this.torrents[data.infoHash].name);
    //   }
    // });
    this.sync().subscribe((d) => console.log(d));
  }

  sync() {
    let rid = 0;
    return timer(0, 8000).pipe(
      concatMap((i) => this.qBittorrent.syncMaindata(rid)),
      reduce((last, current) => {
        rid = current.rid;

        if (current.full_update) {
          return current;
        } else {
          Object.assign(last.server_state, current.server_state);
          for (const [key, value] of Object.entries(current.torrents)) {
            Object.assign(last.torrents[key], value);
          }
          for (const key of current.torrents_removed) {
            delete last.torrents[key];
          }
          for (const [key, value] of Object.entries(current.categories)) {
            Object.assign(last.torrents[key], value);
          }
          for (const key of current.categories_removed) {
            delete last.categories[key];
          }
          pullAll(last.tags, current.tags_removed);
        }
        return last;
      })
    );
  }

  async loadTorrents() {
    const list: Torrent[] = await this.qBittorrent.torrentsInfo({category: 'Unity'});
    this.torrents = Object.fromEntries(list.map((i) => [i.hash, i]));
  }

  async download(resource: Resource) {
    // const torrent = await this.api.download(resource.torrent_id);
    // console.log(resource);
    // if (!torrent) return;
    // const qb_cfg = await window.electronAPI.store_get('qbConfig', defaultQBConfig);
    // await this.qBittorrent.torrentsAdd(torrent, qb_cfg.save_path);
  }

  async import(torrent: Torrent) {
    // try {
    //   console.log(torrent);
    //   const qb_cfg = await window.electronAPI.store_get('qbConfig', defaultQBConfig);
    //   if (qb_cfg.protocol === 'sftp' || qb_cfg.protocol === 'webdav') {
    //     // @ts-ignore
    //     await window.electronAPI.get_file(torrent.hash, torrent.content_path);
    //   } else if (qb_cfg.protocol === 'smb') {
    //     const remotePath = (await window.electronAPI.store_get('smbConfig', defaultSMBConfig)).remotePath;
    //     if (remotePath) {
    //       await window.electronAPI.import(
    //         remotePath,
    //         // @ts-ignore
    //         torrent.content_path.replace(qb_cfg.save_path, '')
    //       );
    //     }
    //   } else if (qb_cfg.protocol === 'local') {
    //     await window.electronAPI.import(torrent.save_path, torrent.name);
    //   }
    // } catch (error) {
    //   alert(error);
    // }
  }

  cancel(torrent: Torrent) {
    return this.qBittorrent.torrentsDelete(torrent.hash);
  }

  pause(torrent: Torrent) {
    return this.qBittorrent.torrentsPause(torrent.hash);
  }

  resume(torrent: Torrent) {
    return this.qBittorrent.torrentsResume(torrent.hash);
  }

  async refresh() {
    console.log(1);
    const items = await this.api.index();
    this.version_sum = items.length;
    this.itemsGroup = mapValues(
      items.group(({meta}) => meta.id),
      (arr) => orderBy(arr, [({meta}) => meta.version_id], ['desc'])
    );
    this.items = sortBy(
      Object.values(this.itemsGroup).map((arr) => arr[0]),
      (item) => item.meta.title
    );

    this.refreshed_at = new Date();
    this.api.user_stat.published = items.filter(({resource}) => resource.username === this.api.username).length;
    await this.api.refreshUserStat();
    this.myControl.reset();
    console.log(2);
  }

  select(event: ResourceMeta) {
    this.selected = event;
  }

  nothing($event: SubmitEvent) {
    $event.preventDefault();
  }

  private filter(value: string): ResourceMeta[] {
    const filterValue = value.toLowerCase();
    return this.items.filter(({meta}) => meta.title.toLowerCase().includes(filterValue) || meta.id.toString().includes(filterValue));
  }
}
