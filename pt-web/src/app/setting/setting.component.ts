import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpConfig, QBConfig, SmbConfig, SSHConfig } from '../types';
import { FormBuilder } from '@angular/forms';
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

  // qb_url_err = false;

  // firstFormGroup = this._formBuilder.group({
  //   firstCtrl: ['', Validators.required],
  // });
  // secondFormGroup = this._formBuilder.group({
  //   secondCtrl: ['', Validators.required],
  // });
  // isLinear = false;

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

  async connectTest() {
    try {
      await this.qBittorrent.authLoginTest(this.qbConfig.qb_url, this.qbConfig.username, this.qbConfig.password);
      console.log('connect test success');
      try {
        const configMap = {
          sftp: this.sshConfig,
          smb: this.smbConfig,
          webdav: this.httpConfig,
          local: null,
        };
        await window.electronAPI.connect_test(this.qbConfig.protocol, configMap[this.qbConfig.protocol]);
        alert('连接成功');
      } catch (e) {
        alert('远程目录读取失败:' + e);
      }
    } catch (error) {
      console.error(error);
      alert('无法连接 qBittorrent，请确认 1. qBittorrent 正在运行，2. 正确启用了 WebUI， 3.已在设置界面正确填写用户密码');
    }
  }

  async submit() {
    try {
      if (this.qbConfig.qb_location == 'local') {
        this.qbConfig.protocol = 'local';
      }
      await window.electronAPI.store_set('sshConfig', this.sshConfig);
      await window.electronAPI.store_set('smbConfig', this.smbConfig);
      await window.electronAPI.store_set('httpConfig', this.httpConfig);
      const old_qb_cfg = await window.electronAPI.store_get('qbConfig', this.qbConfig);
      await window.electronAPI.store_set('qbConfig', this.qbConfig);
      console.log(this.qbConfig, old_qb_cfg);
      if (!isEqual(old_qb_cfg, this.qbConfig)) {
        alert('你修改了qb信息,需要重启客户端');
        return await window.electronAPI.relaunch();
      }
      alert('保存成功');
    } catch (error) {
      alert('保存失败');
      throw error;
    }
  }

  onBlur(key: string): void {
    if (key == 'qb_url') {
      this.qbConfig.qb_url = this.qbConfig.qb_url.replace('https://', 'http://');
      // const isLocal = this.qbConfig.qb_url.replace('http://', '').startsWith('localhost');
      // if ((this.qbConfig.qb_location == 'remote' && isLocal) || (this.qbConfig.qb_location == 'local' && !isLocal)) this.qb_url_err = true;
    } else if (key == 'save_path') {
      if (this.qbConfig.qb_location == 'local' && navigator.platform == 'Win32') this.qbConfig.save_path.replaceAll('/', '\\');
      if (this.qbConfig.save_path.endsWith('/')) this.qbConfig.save_path = this.qbConfig.save_path.slice(0, -1);
    } else if (key == 'local_path') {
      if (navigator.platform == 'Win32') this.qbConfig.local_path.replaceAll('/', '\\');
      if (this.qbConfig.local_path.endsWith('/')) this.qbConfig.local_path = this.qbConfig.local_path.slice(0, -1);
    } else if (key == 'sftp_remote_path') {
      if (this.sshConfig.remotePath.endsWith('/')) this.sshConfig.remotePath = this.sshConfig.remotePath.slice(0, -1);
    } else if (key == 'smb_remote_path') {
      if (navigator.platform == 'Win32') this.qbConfig.local_path.replaceAll('/', '\\');
      if (this.smbConfig.remotePath.endsWith('/')) this.smbConfig.remotePath = this.smbConfig.remotePath.slice(0, -1);
    } else if (key == 'webdav_remote_path') {
      if (this.httpConfig.remotePath.endsWith('/')) this.httpConfig.remotePath = this.httpConfig.remotePath.slice(0, -1);
    }
  }

  // protected readonly CheckboxControlValueAccessor = CheckboxControlValueAccessor;
  protected readonly onchange = onchange;

  async locationChange() {
    if (this.qbConfig.qb_location == 'local') {
      this.qbConfig.protocol = 'local';
    } else {
      this.qbConfig.protocol = (await window.electronAPI.store_get('qbConfig', this.qbConfig)).protocol;
    }
  }
}
