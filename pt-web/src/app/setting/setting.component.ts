import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpConfig, QBInfo, SmbConfig, UserSSHConfig } from '../types';
import { FormBuilder, Validators } from '@angular/forms';
import { QBittorrentService } from '../qbittorrent.service';
import { defaultHTTPConfig, defaultQBInfo, defaultSMBConfig, defaultSSHConfig } from './defaultSetting';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  qbInfo: QBInfo = defaultQBInfo;
  sshConfig: UserSSHConfig = defaultSSHConfig;
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
    this.qbInfo = await window.electronAPI.store_get('qbInfo', defaultQBInfo);
    this.sshConfig = await window.electronAPI.store_get('sshConfig', defaultSSHConfig);
    this.smbConfig = await window.electronAPI.store_get('smbConfig', defaultSMBConfig);
    this.httpConfig = await window.electronAPI.store_get('httpConfig', defaultHTTPConfig);
    await window.electronAPI.store_set('qbInfo', this.qbInfo);
    await window.electronAPI.store_set('sshConfig', this.sshConfig);
    await window.electronAPI.store_set('smbConfig', this.smbConfig);
    await window.electronAPI.store_set('httpConfig', this.httpConfig);
  }

  ngOnInit() {}

  async submit() {
    try {
      if (this.qbInfo) {
        await window.electronAPI.store_set('sshConfig', this.sshConfig);
        await window.electronAPI.store_set('smbConfig', this.smbConfig);
        await window.electronAPI.store_set('httpConfig', this.httpConfig);
        const old_qb_info = await window.electronAPI.store_get('qbInfo', this.qbInfo);
        await window.electronAPI.store_set('qbInfo', this.qbInfo);
        if (old_qb_info.qb_url != this.qbInfo.qb_url) {
          const cf = confirm('你修改了qb地址,需要重启客户端,是否重启?');
          if (cf) {
            await window.electronAPI.relaunch();
          }
        }
      }
    } catch (error) {
      alert('保存失败');
      throw error;
    }
  }
}
