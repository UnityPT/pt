import { Component, OnInit } from '@angular/core';
import { Resource, ResourceMeta } from '../types';
import { Torrent } from '@ctrl/qbittorrent/dist/src/types';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QBittorrentService } from '../qbittorrent.service';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { orderBy } from 'lodash-es';
import { MatSelectionListChange } from '@angular/material/list';
// import 'user-agent-data-types';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
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
    map((value) => this.filter(value || '')),
  );
  selected?: ResourceMeta;

  ssh_get_file_progress: Record<string, number> = {};

  // 取数据end

  // 取数据
  constructor(private http: HttpClient, private qBittorrent: QBittorrentService, private api: ApiService, public dialog: MatDialog) {}

  // 列表结束
  trackById(index: number, item: ResourceMeta) {
    return item.resource.torrent_id;
  }

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

    window.electronAPI.on('get_file_progress', async (event, data) => {
      this.ssh_get_file_progress[data.infoHash] = data.progress;
      if (data.progress === 1) {
        const localPath = (await window.electronAPI.store_get('sshConfig', {})).localPath;
        await window.electronAPI.import(localPath, this.torrents[data.infoHash].name, navigator.userAgentData!.platform);
      }
    });
  }

  async loadTorrents() {
    const list: Torrent[] = await this.qBittorrent.torrentsInfo({ category: 'Unity' });
    this.torrents = Object.fromEntries(list.map((i) => [i.hash, i]));
  }

  async download(resource: Resource) {
    const torrent = await this.api.download(resource.torrent_id);
    console.log(resource);
    if (!torrent) return;
    await this.qBittorrent.torrentsAdd(torrent);
  }

  async import(torrent: Torrent) {
    console.log('import');
    try {
      const files = await this.qBittorrent.torrentsFiles(torrent.hash);
      console.log(torrent.hash, torrent.name);
      const qb_info = await window.electronAPI.store_get('qbInfo', {});
      if (qb_info.get_protocol === 'sftp') {
        const res = await window.electronAPI.create_ssh();
        if (res === true) {
          await window.electronAPI.get_file(torrent.hash, torrent.name);
        } else {
          throw new Error('ssh连接失败');
        }
      } else if (qb_info.get_protocol === 'smb') {
        const get_url = (await window.electronAPI.store_get('smbConfig', {})).get_url;
        if (get_url) {
          await window.electronAPI.import(get_url, files[0].name, navigator.userAgentData!.platform);
        } else {
          await window.electronAPI.import(torrent.save_path, files[0].name, navigator.userAgentData!.platform);
        }
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
    this.items = orderBy(
      (this.items = await this.api.index()),
      [(item) => item.meta.title, (item) => item.meta.version_id],
      ['asc', 'desc'],
    );
    this.refreshed_at = new Date();
    this.api.user_stat_published = this.items.filter(({ resource }) => resource.username === this.api.username).length;
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
    return this.items.filter(({ meta }) => meta.title.toLowerCase().includes(filterValue) || meta.id.toString().includes(filterValue));
  }
}
