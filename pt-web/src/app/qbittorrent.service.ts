import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Torrent, TorrentFile } from '@ctrl/qbittorrent/dist/src/types';
// @ts-ignore
import parseTorrent from 'parse-torrent';
import pRetry from 'p-retry';
import { countBy } from 'lodash-es';
import path from 'path';

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
    const hash = info.infoHash!;

    if (filename) {
      await this.torrentsRestart(hash, info.files![0].path, filename);
    }
    return hash;
  }

  async authLogin(username?: string, password?: string) {
    if (!username) username = (await window.electronAPI.store_get('qbConfig')).username;
    if (!password) password = (await window.electronAPI.store_get('qbConfig')).password;
    return this.request('auth/login', { username, password });
  }

  async authLoginTest(qburl: string, username: string, password: string) {
    await this.request('auth/logout', {}).catch(console.error);
    await this.request(`auth/login`, { username, password }, undefined, qburl);
    await this.request('auth/logout', {}, undefined, qburl);
    await this.authLogin().catch(console.error);
  }

  torrentsInfo(params: { filter?: string; category?: string; tag?: string; sort?: string; reverse?: string; limit?: string; offset?: string; hashes?: string }) {
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

  async torrentsSetLocation(hash: string, location: string) {
    console.log(hash, location);
    return this.request('torrents/setLocation', { hashes: hash, location });
  }

  torrentsFiles(hash: string) {
    return this.request<TorrentFile[]>('torrents/files', { hash }, 'json');
  }

  async torrentsRestart(hash: string, oldName: string, newPath: string) {
    console.log('restart', hash, oldName, path.basename(newPath));
    await this.request('torrents/setLocation', { hashes: hash, location: path.dirname(newPath) });
    if (oldName) {
      await this.request('torrents/renameFile', {
        hash: hash,
        oldPath: oldName,
        newPath: path.basename(newPath),
      });
    }
    await this.request('torrents/recheck', { hashes: hash });
    const finishedState = ['uploading', 'stalledUP'];
    let i = 0; //尝试次数
    const timer1 = setInterval(async () => {
      if (i++ > 10) clearInterval(timer1);
      const state1 = (await this.request<Torrent[]>('torrents/info', { hashes: hash }, 'json'))[0].state;
      if (state1 != 'checkingResumeData') {
        clearInterval(timer1);
        await this.request('torrents/resume', { hashes: hash });
        const timer2 = setInterval(async () => {
          if (i++ > 10) clearInterval(timer2);
          const state2 = (await this.request<Torrent[]>('torrents/info', { hashes: hash }, 'json'))[0].state;
          if (finishedState.includes(state2)) {
            clearInterval(timer2);
          }
          await this.request('torrents/resume', { hashes: hash });
        }, 1000);
      }
    }, 1000);
  }
  async waitPaused(hash: string) {
    await new Promise((resolve) => {
      let i = 0; //尝试次数
      const t1 = setInterval(async () => {
        const state = (await this.torrentsInfo({ hashes: hash }))[0].state;
        console.log('wait pause', state);
        if (state == 'pausedDL' || i++ > 5) {
          clearInterval(t1);
          resolve(null);
        }
      }, 500);
    });
  }

  // low level apis

  // https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)

  async request<T>(method: string, params: Record<string, string | Blob | undefined>, responseType: 'json' | 'text' = 'text', qburl?: string): Promise<T> {
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
      this.http.post<T>(`${qburl ?? (await window.electronAPI.store_get('qbConfig')).qb_url}/api/v2/${method}`, Object.keys(params).length == 0 ? null : body, {
        // @ts-ignore
        responseType,
        withCredentials: true,
      })
    );
  }
}
