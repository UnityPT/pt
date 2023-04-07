import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Torrent, TorrentFile } from '@ctrl/qbittorrent/dist/src/types';
// @ts-ignore
import parseTorrent from 'parse-torrent';
import pRetry from 'p-retry';
import { countBy } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class QBittorrentService {
  constructor(private http: HttpClient) {}

  async torrentsAdd(torrent: Blob, savepath?: string, filename?: string) {
    await pRetry(() =>
      this.request('torrents/add', {
        torrents: torrent,
        savepath,
        category: 'Unity',
        paused: filename ? 'true' : 'false',
        skip_checking: filename ? 'true' : 'false',
      })
    );

    const info = await parseTorrent(Buffer.from(await torrent.arrayBuffer()));
    console.log(info);
    const hash = info.infoHash!;

    console.log(filename);

    if (filename) {
      const oldPath = info.files![0].path;
      await this.request('torrents/renameFile', {
        hash: hash,
        oldPath,
        newPath: filename,
      });
      const timer1 = setInterval(async () => {
        const amount_left = (await this.request<Torrent[]>('torrents/info', { hashes: hash }, 'json')).map((x) => x.amount_left)[0];
        console.log('resume', amount_left);
        if (amount_left != 0) {
          await this.request('torrents/resume', { hashes: hash });
        } else {
          clearInterval(timer1);
        }
      }, 500);
    }
    return hash;
  }

  async authLogin(username?: string, password?: string) {
    if (!username) username = (await window.electronAPI.store_get('qbConfig')).username;
    if (!password) password = (await window.electronAPI.store_get('qbConfig')).password;
    return this.request('auth/login', { username, password });
  }

  async authLoginTest(qburl: string, username: string, password: string) {
    const body = new FormData();
    body.append('username', username);
    body.append('password', password);
    return firstValueFrom(this.http.post(`${qburl}/api/v2/auth/login`, body, { responseType: 'text' }));
  }

  torrentsInfo(params: {
    filter?: string;
    category?: string;
    tag?: string;
    sort?: string;
    reverse?: string;
    limit?: string;
    offset?: string;
    hashes?: string;
  }) {
    return this.request<Torrent[]>('torrents/info', params, 'json');
  }

  torrentsDelete(hash: string) {
    return this.request('torrents/delete', { hashes: hash, deleteFiles: 'true' });
  }

  async torrentsPause(hash: string) {
    return this.request('torrents/pause', { hashes: hash });
  }

  async torrentsResume(hash: string) {
    return this.request('torrents/resume', { hashes: hash });
  }

  torrentsFiles(hash: string) {
    return this.request<TorrentFile[]>('torrents/files', { hash }, 'json');
  }

  // low level apis

  // https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)

  async request<T>(method: string, params: Record<string, string | Blob | undefined>, responseType: 'json' | 'text' = 'text'): Promise<T> {
    const body = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        if (typeof value === 'string') {
          body.append(key, value);
        } else {
          body.append(key, value, 'test.torrent');
        }
      }
    }
    // @ts-ignore
    return firstValueFrom(
      this.http.post<T>(
        `${(await window.electronAPI.store_get('qbConfig')).qb_url}/api/v2/${method}`,
        Object.keys(params).length == 0 ? null : body,
        {
          // @ts-ignore
          responseType,
          withCredentials: true,
        }
      )
    );
  }
}
