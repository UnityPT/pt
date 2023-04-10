import {Component} from '@angular/core';
import {ApiService} from '../api.service';
import {FormBuilder} from '@angular/forms';
import {QBittorrentService} from '../qbittorrent.service';
import {SettingsService} from './settings.service';
import {HttpConfig, SmbConfig, SSHKeyConfig, SSHPasswordConfig} from '../types';
import {includes} from 'lodash-es';

@Component({
  selector: 'app-setting',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  // for angular template use
  r: any;

  testQBittorrent?: Promise<string>;
  testRemote?: Promise<string>;

  showRemote: boolean;

  isWeb = true;

  constructor(
    private api: ApiService,
    private _formBuilder: FormBuilder,
    private qBittorrent: QBittorrentService,
    public settings: SettingsService
  ) {
    this.r = this.settings.config.remote;
    this.showRemote = this.settings.config.remote.protocol !== 'local';
  }

  async saveQBittorrent() {
    this.settings.save();
    this.testQBittorrent = this.qBittorrent.appVersion();

    const url = new URL(this.settings.config.qBittorrent.qb_url);
    this.showRemote = !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (!this.showRemote) {
      this.settings.config.remote = {protocol: 'local'};
    }
  }

  async saveRemote() {
    this.settings.save();
    switch (this.settings.config.remote.protocol) {
      case 'http':
        const body = `<?xml version="1.0" ?>
      <D:propfind xmlns:D="DAV:">
        <D:allprop/>
      </D:propfind>`;
        const headers = new Headers({Depth: '0'});
        const url = this.settings.config.remote.remotePath;
        this.testRemote = (async () => {
          const response = await fetch(url, {method: 'PROPFIND', headers, body});
          return '';
        })();
    }
  }

  submit() {
    this.settings.save();
  }
}
