import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {QBInfo, SmbConfig, UserSSHConfig} from '../types';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  qbInfo: QBInfo = {
    qb_url: 'http://localhost:8080',
    username: 'admin',
    password: 'adminadmin',
    get_protocol: '', // 'sftp'/'smb'/'http'
  };
  sshConfig: UserSSHConfig = {
    username: '',
    remotePath: '',
    localPath: '',
    privateKeyPath: '',
  };
  smbConfig: SmbConfig = {
    get_url: '',
  };

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  isSmb = false;

  constructor(private api: ApiService, private _formBuilder: FormBuilder) {
    this.init();
  }

  async init() {
    this.qbInfo = await window.electronAPI.store_get('qbInfo', {
      qb_url: 'http://localhost:8080',
      username: 'admin',
      password: 'adminadmin',
      get_protocol: '',
    });
    this.sshConfig = await window.electronAPI.store_get('sshConfig', {
      username: '',
      remotePath: '',
      localPath: '',
      privateKeyPath: '',
    });
    this.smbConfig = await window.electronAPI.store_get('smbConfig', {
      get_url: '',
    });
  }

  ngOnInit() {
  }

  async submit() {
    if (this.qbInfo) {
      await window.electronAPI.store_set('sshConfig', this.sshConfig);
      await window.electronAPI.store_set('smbConfig', this.smbConfig);
      const old_qb_info = await window.electronAPI.store_get('qbInfo', this.qbInfo);
      await window.electronAPI.store_set('qbInfo', this.qbInfo);
      if (this.qbInfo.get_protocol == 'sftp') {
        // console.log(await window.electronAPI.create_ssh());
      }
      if (old_qb_info.qb_url != this.qbInfo.qb_url) {
        const cf = confirm('你修改了qb地址,需要重启客户端,是否重启?');
        if (cf) {
          await window.electronAPI.relaunch();
        }
      }

    }
  }
}
