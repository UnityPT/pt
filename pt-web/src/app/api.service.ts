import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import {RegisterInfo, Resource, ResourceMeta} from './types';
import {NavigationEnd, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //baseUrl = 'https://pt.lolo.moe';
  //baseUrl = 'https://frogeater.vip';
  baseUrl = 'http://localhost:80';
  username = localStorage.getItem('username');
  curPage = '';

  constructor(private http: HttpClient, private router: Router,
             // private jwtHelperService: JwtHelperService
               ) {
    this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        this.curPage = data.url;
      }
    });
    console.log('constuctor');
    // const token = localStorage.getItem('token');
    // if (token) {
    //   const user = this.jwtHelperService.decodeToken(token).user;
    //   console.log(this.jwtHelperService.decodeToken(token));
    //   this.setUser(user.username);
    // }
  }

  async login(username: string, password: string) {
    const res = await firstValueFrom(this.http.post(this.url('login'), {
      username,
      password
    }, {
      responseType: 'text',
      withCredentials: true
    }));
    localStorage.setItem('token',JSON.parse(res).access_token);
    this.setUser(username);
  }

  logout() {
    localStorage.removeItem('username');
    this.username = ''
  }
  setUser(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  async index(forceRefresh = false): Promise<ResourceMeta[]> {
    const url = new URL(this.url('index'));
    if (forceRefresh) {
      url.searchParams.append('t', Date.now().toString());
    }
    return (await lastValueFrom(this.http.get<Resource[]>(url.href, {withCredentials: true}))).map((resource => ({
      resource,
      meta: JSON.parse(resource.description)
    })));
  }

  async upload(torrent: Uint8Array, description: string, filename: string): Promise<Blob> {
    const body = new FormData();
    body.append('torrent', new Blob([torrent]), filename);
    body.append('description', description);

    return (await firstValueFrom(this.http.post(this.url('upload'), body, {
      withCredentials: true,
      responseType: 'blob'
    })));
  }

  download(id: number): Promise<Blob> {
    return lastValueFrom(this.http.get(this.url('download'), {
      params: {id: id.toString()},
      responseType: 'blob',
      withCredentials: true
    }));
  }

  url(method: string) {
    return `${this.baseUrl}/${method}`;
  }

  async register(registerInfo: RegisterInfo) {
    await firstValueFrom(this.http.post(this.url('register'), registerInfo, {
      responseType: 'text',
      withCredentials: true
    }));
    //注册后自动登录
    this.setUser(registerInfo.username);
  }

  invitations(email: string) {
    return firstValueFrom(this.http.post(this.url('invitations'), {
      email
    }, {
      responseType: 'text',
      withCredentials: true
    }));
  }

  checkShowParticles() {
    return !this.username && this.curPage != '/help';
  }

  // test() {
  //   await fs.readFileSync('./test.torrent'),
  //   const items = await this.api.index(true);
  //   const taskHashes = (await this.qBittorrent.torrentsInfo({category: 'Unity'})).map(t => t.hash);
  //   const resourceVersionIds = items.map((item) => item.meta.version_id);
  //
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files.item(i)!;
  //     const description = await ExtraField(file, 65, 36);
  //     if (!description) {
  //       console.log(`${file.webkitRelativePath} is not a unity asset store package`);
  //       continue;
  //     }
  //     const meta = <Meta>JSON.parse(description);
  //     if (!meta.version_id) {
  //       console.log(`${file.webkitRelativePath} is strange`);
  //       continue;
  //     }
  //
  //     // @ts-ignore
  //     const p = file.path // provided by electron, not works in chrome.
  //       .replaceAll('\\', '/'); // 由于 path-browserify 只支持 posix 风格路径，不支持 win32风格
  //     console.log(p);
  //
  //     const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
  //     // 本地有，远端有
  //     if (resourceIndex >= 0) {
  //       const item = items[resourceIndex];
  //       if (!item) continue; // 刚刚上传的，本地有重复文件。
  //
  //       const {resource, meta} = item;
  //       // 本地有，远端有，qb 有 => 什么都不做
  //       if (taskHashes.includes(resource.info_hash)) {
  //       } else {
  //         if (description === resource.description) {
  //           // 本地有，远端有，qb 无，一致 => 添加下载任务
  //           console.log(`downloading ${meta.title}`);
  //           const torrent = await this.api.download(resource.torrent_id);
  //           await this.qBittorrent.torrentsAdd(torrent, path.dirname(p), path.basename(p));
  //           taskHashes.push(resource.info_hash);
  //         } else {
  //           // 本地有，远端有，qb 无，不一致 => 忽略
  //           console.log(`${p} has same version_id with server but not same file`);
  //         }
  //       }
  //     } else {
  //       // 本地有，远端无 => 发布资源并添加下载任务
  //       console.log(`uploading ${meta.title}`);
  //       const name = meta.title
  //         .replace(/[<>:"\/\\|?*+#&().,—!™'\[\]]/g, '')
  //         .replace(/ {2,}/g, ' ')
  //         .trim();
  //
  //       const torrent0: Uint8Array = await new Promise((resolve, reject) => {
  //         createTorrent(file, {
  //           name: `[${meta.version_id}] ${name} ${meta.version}.unitypackage`,
  //           createdBy: 'UnityPT 1.0',
  //           announceList: [],
  //           private: true,
  //         }, (err: any, torrent: any) => err ? reject(err) : resolve(torrent))
  //       })
  //
  //       const torrent = await this.api.upload(torrent0, description, `${name}.torrent`);
  //
  //
  //
  //   const body = new FormData();
  //   body.append('torrent', new Blob([torrent]), filename);
  //   body.append('description', description);
  //
  //   return (await firstValueFrom(this.http.post(this.url('upload'), body, {
  //     withCredentials: true,
  //     responseType: 'blob'
  //   })));
  // }
}
