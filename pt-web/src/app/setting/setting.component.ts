import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpConfig, QBConfig, SmbConfig, SSHConfig } from '../types';
import { FormBuilder, Validators } from '@angular/forms';
import { QBittorrentService } from '../qbittorrent.service';
import { defaultHTTPConfig, defaultQBConfig, defaultSMBConfig, defaultSSHConfig } from './defaultSetting';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  qbConfig: QBConfig = defaultQBConfig;
  sshConfig: SSHConfig = defaultSSHConfig;
  smbConfig: SmbConfig = defaultSMBConfig;
  httpConfig: HttpConfig = defaultHTTPConfig;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  isSmb = false;

  constructor(private api: ApiService, private _formBuilder: FormBuilder, private qBittorrent: QBittorrentService) {
    this.init();
  }

  async init() {
    this.qbConfig = await window.electronAPI.store_get('qbConfig', defaultQBConfig);
    this.sshConfig = await window.electronAPI.store_get('sshConfig', defaultSSHConfig);
    this.smbConfig = await window.electronAPI.store_get('smbConfig', defaultSMBConfig);
    this.httpConfig = await window.electronAPI.store_get('httpConfig', defaultHTTPConfig);
    await window.electronAPI.store_set('qbConfig', this.qbConfig);
    await window.electronAPI.store_set('sshConfig', this.sshConfig);
    await window.electronAPI.store_set('smbConfig', this.smbConfig);
    await window.electronAPI.store_set('httpConfig', this.httpConfig);
  }

  ngOnInit() {}

  async submit() {
    try {
      if (this.qbConfig) {
        await window.electronAPI.store_set('sshConfig', this.sshConfig);
        await window.electronAPI.store_set('smbConfig', this.smbConfig);
        await window.electronAPI.store_set('httpConfig', this.httpConfig);
        const old_qb_cfg = await window.electronAPI.store_get('qbConfig', this.qbConfig);
        await window.electronAPI.store_set('qbConfig', this.qbConfig);
        if (!isEqual(old_qb_cfg, this.qbConfig)) {
          const cf = confirm('你修改了qb信息,需要重启客户端,是否保存并重启?');
          if (cf) {
            return await window.electronAPI.relaunch();
          } else {
            this.qbConfig = old_qb_cfg;
            return;
          }
        }
      }
    } catch (error) {
      alert('保存失败');
      throw error;
    }
  }

  localQb() {
    return this.qbConfig.qb_url.split('://')[1].startsWith('localhost');
  }

  onInputChange() {
    if (this.localQb()) {
      this.qbConfig.protocol = 'local';
    } else {
      this.qbConfig.protocol = 'sftp';
    }
  }
}
