import * as ParseTorrentFile from 'parse-torrent-file';
import parseTorrent from 'parse-torrent';
import * as Buffer from 'buffer';
import {QBittorrent} from '@ctrl/qbittorrent';
import pRetry from 'p-retry';

export async function addTorrent(client: QBittorrent, torrent: Buffer, savepath: string, filename: string, skip_checking: boolean) {
  const info = <ParseTorrentFile.Instance>parseTorrent(torrent);
  const oldPath = info.files[0].path;
  if (!filename) filename = oldPath;
  const rename = filename !== oldPath;
  await client.addTorrent(torrent, {
    savepath,
    filename,
    category: 'Unity',
    paused: rename ? 'true' : 'false',
    skip_checking: rename || skip_checking ? 'true' : 'false',
  });
  if (rename) {
    console.log('=' + oldPath);
    console.log('>' + filename);
    await pRetry(
      () =>
        client.request('/torrents/renameFile', 'GET', {
          hash: info.infoHash,
          oldPath,
          newPath: filename,
        }),
      {retries: 5}
    );

    await client.recheckTorrent(info.infoHash);
    await client.resumeTorrent(info.infoHash);
    return info.infoHash;
  }
}