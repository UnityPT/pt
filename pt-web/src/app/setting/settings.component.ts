import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder } from '@angular/forms';
import { QBittorrentService } from '../qbittorrent.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-setting',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(private api: ApiService, private _formBuilder: FormBuilder, private qBittorrent: QBittorrentService, public settings: SettingsService) {

  }

  connectionTestQBittorrent() {
    return this.qBittorrent.authLoginTest(this.settings.config.qBittorrent.qb_url, this.settings.config.qBittorrent.username, this.settings.config.qBittorrent.password);
  }

  connectionTestRemote() {

  }

  submit() {
    this.settings.save();
  }
}
