import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss'],
})
export class RssComponent implements OnInit {
  title: string = '请将下面的订阅地址复制到qbittorent中的工具->选项->rss订阅，或其他rss订阅器中使用';
  rss_url: string = '';

  constructor(private api: ApiService) {}

  async ngOnInit() {
    await this.api.refreshUserStat();
    const url = new URL('https://pt.lolo.moe/rss/');
    url.searchParams.set('passkey', this.api.user_stat.passkey);
    this.rss_url = url.href;
  }
}
