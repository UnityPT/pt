import {QBittorrent, Torrent} from '@ctrl/qbittorrent';
import {download} from './api';
import {addTorrent} from './qbittorrent';
import {app, shell} from 'electron';
import path from 'path';

const client = new QBittorrent({
  baseUrl: 'http://localhost:8080/',
  username: 'admin',
  password: 'adminadmin',
});

export class electronAPI {
  static async download(event, torrentId: number) {
    const torrent = await download(torrentId);
    await addTorrent(client, torrent, app.getPath('downloads'), undefined, false);
  }

  static list(event) {
    return client.listTorrents({category: 'Unity'});
  }

  static async import(event, torrent: Torrent) {
    const files = await client.torrentFiles(torrent.hash);
    return shell.openPath(path.join(torrent.save_path, files[0].name));
  }
}
