import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpConfig, RegisterInfo, Resource, UserStat } from './types';
import { NavigationEnd, Router } from '@angular/router';
import * as path from 'path';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'https://pt.lolo.moe';
  //baseUrl = 'https://frogeater.vip';
  //baseUrl = 'http://localhost:80';
  username = localStorage.getItem('username');
  curPage = '';
  user_stat = {
    published: 0,
    uploaded: 0,
    downloaded: 0,
    passkey: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router // private jwtHelperService: JwtHelperService
  ) {
    this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        this.curPage = data.url;
      }
    });
    // const token = localStorage.getItem('token');
    // if (token) {
    //   const user = this.jwtHelperService.decodeToken(token).user;
    //   console.log(this.jwtHelperService.decodeToken(token));
    //   this.setUser(user.username);
    // }
  }

  async login(username: string, password: string) {
    const res = await firstValueFrom(
      this.http.post(
        this.url('login'),
        {
          username,
          password,
        },
        {
          responseType: 'text',
          withCredentials: true,
        }
      )
    );
    localStorage.setItem('access_token', JSON.parse(res).access_token);
    this.setUser(username);
  }

  logout() {
    localStorage.removeItem('username');
    this.username = '';
  }

  setUser(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  async index(forceRefresh = false) {
    const url = new URL(this.url('index'));
    if (forceRefresh) url.searchParams.append('t', Date.now().toString());

    let body = [] as Resource[];
    try {
      const ret = await lastValueFrom(
        this.http.get<Resource[]>(url.href, {
          withCredentials: true,
          observe: 'response',
        })
      );
      body = ret.body ?? ([] as Resource[]);
    } catch (e) {
      this.dealWithError(e as HttpErrorResponse);
    }
    return body.map((resource) => ({
      resource,
      meta: JSON.parse(resource.description),
    }));
  }

  async upload(torrent: Uint8Array, description: string, filename: string) {
    const body = new FormData();
    body.append('torrent', new Blob([torrent]), filename);
    body.append('description', description);

    try {
      return await firstValueFrom(
        this.http.post(this.url('upload'), body, {
          withCredentials: true,
          responseType: 'blob',
        })
      );
    } catch (e) {
      this.dealWithError(e as HttpErrorResponse);
    }
    return;
  }

  download(id: number) {
    try {
      return lastValueFrom(
        this.http.get(this.url('download'), {
          params: { id: id.toString() },
          responseType: 'blob',
          withCredentials: true,
        })
      );
    } catch (e) {
      this.dealWithError(e as HttpErrorResponse);
    }
    return;
  }

  url(method: string) {
    return `${this.baseUrl}/${method}`;
  }

  async register(registerInfo: RegisterInfo) {
    return await firstValueFrom(
      this.http.post(this.url('register'), registerInfo, {
        responseType: 'text',
        withCredentials: true,
      })
    );
  }

  invitations(email: string) {
    try {
      return firstValueFrom(
        this.http.post(
          this.url('invitations'),
          {
            email,
          },
          {
            responseType: 'text',
            withCredentials: true,
          }
        )
      );
    } catch (e) {
      return this.dealWithError(e as HttpErrorResponse);
    }
  }

  async refreshUserStat() {
    const user_stat = await firstValueFrom(
      this.http.get<UserStat>(this.url('userstat'), {
        withCredentials: true,
      })
    );
    this.user_stat.uploaded = +user_stat.uploaded;
    this.user_stat.downloaded = +user_stat.downloaded;
    this.user_stat.passkey = user_stat.passkey;
  }

  checkShowParticles() {
    return !this.username && this.curPage != '/help';
  }

  async test() {}

  private dealWithError(e: HttpErrorResponse) {
    if (e.status == 401) {
      this.logout();
      this.router.navigate(['login']);
    }
    return;
  }
}
