import {Component, OnInit} from '@angular/core';
import {Resource, ResourceMeta} from '../types';
import {Torrent} from '@ctrl/qbittorrent/dist/src/types';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {QBittorrentService} from '../qbittorrent.service';
import {ApiService} from '../api.service';
import {MatDialog} from '@angular/material/dialog';
import path from 'path';
import {orderBy} from 'lodash-es';
import {MatSelectionListChange} from '@angular/material/list';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

// 列表开始
//   resources: Resource[] = [];
//   meta: Meta[] = []
  items: ResourceMeta[] = [];
  torrents: Record<string, Torrent> = {};
  refreshed_at: Date = new Date();
  requesting: Set<string> = new Set();

  statusFinished = new Set(['uploading', 'pausedUP', 'queuedUP', 'stalledUP', 'checkingUP', 'forcedUP']);
  statusDownloading = new Set(['downloading', 'pausedDL', 'stalledDL', 'checkingDL', 'forcedDL']);

  // 列表结束
//   下载功能函数
  myControl = new FormControl('');
  filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => this.filter(value || ''))
  );
  selected?: ResourceMeta;

// 取数据end

// 取数据
  constructor(private http: HttpClient, private qBittorrent: QBittorrentService, private api: ApiService, public dialog: MatDialog) {
  }

// 列表结束
  trackById(index: number, item: ResourceMeta) {
    return item.resource.torrent_id;
  };

  async ngOnInit() {

    try {
      await this.qBittorrent.authLogin();
    } catch (error) {
      alert('无法连接 qBittorrent，请确认 qBittorrent 正在运行，且启用了 WebUI');
      throw error;
    }

    // await this.api.login();
    await this.loadTorrents();
    await this.refresh();
    setInterval(() => this.loadTorrents(), 800);
  }

  async loadTorrents() {
    const list: Torrent[] = await this.qBittorrent.torrentsInfo({category: 'Unity'});
    this.torrents = Object.fromEntries(list.map(i => [i.hash, i]));
  }

  async download(resource: Resource) {
    const torrent = await this.api.download(resource.torrent_id);
    if (!torrent) return;
    await this.qBittorrent.torrentsAdd(torrent);
  }

  async import(torrent: Torrent) {
    try {
      const files = await this.qBittorrent.torrentsFiles(torrent.hash);
      const get_url = (await window.electronAPI.store_get('qbInfo', {})).get_url;
      if (get_url) {
        if (get_url.startsWith('\\\\')) {
          await window.electronAPI.import(get_url + '\\' + files[0].name);
        } else {
          await window.electronAPI.import(path.join(get_url, files[0].name));
        }
      } else {
        await window.electronAPI.import(path.join(torrent.save_path, files[0].name));
      }
    } catch (error) {
      alert(error);
    }
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
    this.items = orderBy(this.items = (await this.api.index()), [(item) => item.meta.title, (item) => item.meta.version_id], ['asc', 'desc']);
    this.refreshed_at = new Date();
    this.api.user_stat_published = this.items.filter(({resource}) => resource.username === this.api.username).length;
    await this.api.refreshUserStat();
    this.myControl.reset();
  }

  select(event: MatSelectionListChange) {
    this.selected = event.options[0].value;
  }


  nothing($event: SubmitEvent) {
    $event.preventDefault();
  }

  private filter(value: string): ResourceMeta[] {
    const filterValue = value.toLowerCase();
    return this.items.filter(({meta}) =>
      meta.title.toLowerCase().includes(filterValue)
      || meta.id.toString().includes(filterValue)
    );
  }
}
