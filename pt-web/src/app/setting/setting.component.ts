import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { QBInfo } from '../types';

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
    savepath: '',
    get_url: '',
  };

  constructor(private api: ApiService) {
    this.init();
  }

  async init() {
    this.qbInfo = await window.electronAPI.store_get('qbInfo', {
      qb_url: 'http://localhost:8080',
      username: 'admin',
      password: 'adminadmin',
      downloads: '',
      get_url: ' ',
    });
  }

  ngOnInit() {}

  async submit() {
    if (this.qbInfo) {
      const old_qb_info = await window.electronAPI.store_get('qbInfo', this.qbInfo);
      await window.electronAPI.store_set('qbInfo', this.qbInfo);
      if (old_qb_info.qb_url != this.qbInfo.qb_url) {
        const cf = confirm('你修改了qb地址,需要重启客户端,是否重启?');
        if (cf == true) {
          await window.electronAPI.relaunch();
        }
      }
    }
  }
}
