import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Torrent, TorrentFile} from '@ctrl/qbittorrent/dist/src/types';
import parseTorrent from 'parse-torrent';
import * as ParseTorrentFile from 'parse-torrent-file';

@Injectable({
  providedIn: 'root'
})
export class QBittorrentService {
  baseUrl = 'http://localhost:8080';
  username = 'admin';
  password = 'adminadmin';

  constructor(private http: HttpClient) {
  }

  async torrentsAdd(torrent: Blob, savepath?: string, filename?: string) {
    await this.request('torrents/add', {
      torrents: torrent,
      savepath,
      category: 'Unity',
      paused: filename ? 'true' : 'false',
      skip_checking: filename ? 'true' : 'false'
    });

    const info = <ParseTorrentFile.Instance>parseTorrent(Buffer.from(await torrent.arrayBuffer()));
    const hash = info.infoHash!;

    console.log(filename);

    if (filename) {
      const oldPath = info.files![0].path;
      await this.request('torrents/renameFile', {
        hash: hash,
        oldPath,
        newPath: filename
      });
      await this.request('torrents/recheck', {hashes: hash});
      await this.request('torrents/resume', {hashes: hash});
    }

    return hash;
  }

  authLogin(username: string = this.username, password: string = this.password) {
    return this.request('auth/login', {username, password});
  }

  torrentsInfo(params: {filter?: string, category?: string, tag?: string, sort?: string, reverse?: string, limit?: string, offset?: string, hashes?: string}) {
    return this.request<Torrent[]>('torrents/info', params, 'json');
  }

  torrentsDelete(hash: string) {
    return this.request('torrents/delete', {hashes: hash, deleteFiles: 'true'});
  }

  torrentsPause(hash: string) {
    return this.request('torrents/pause', {hashes: hash});
  }

  torrentsResume(hash: string) {
    return this.request('torrents/resume', {hashes: hash});
  }

  torrentsFiles(hash: string) {
    return this.request<TorrentFile[]>('torrents/files', {hash}, 'json');
  }

  // low level apis

  // https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)

  request<T>(method: string, params: Record<string, string | Blob | undefined>, responseType: 'json' | 'text' = 'text'): Promise<T> {
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
    return firstValueFrom(this.http.post<T>(`${this.baseUrl}/api/v2/${method}`, body, {
      // @ts-ignore
      responseType,
      withCredentials: true
    }));
  }
}
