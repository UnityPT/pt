import { Injectable } from '@angular/core';
import { Config } from '../types';
import { defaultHTTPConfig, defaultQBConfig } from './defaultSetting';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  config: Config;

  constructor() {
    const config = localStorage.getItem('config');
    this.config = config ? <Config>JSON.parse(config) : ({ qBittorrent: defaultQBConfig, remote: defaultHTTPConfig });
  }

  save() {
    localStorage.setItem('config', JSON.stringify(this.config));
  }
}
