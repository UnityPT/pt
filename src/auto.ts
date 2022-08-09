import path from 'path';
import util from 'util';
import glob from 'glob';
import Buffer from 'buffer';

import createTorrent from 'create-torrent';
import {QBittorrent} from '@ctrl/qbittorrent';

import {download, index, login, upload} from './api.js';
import {Meta} from './resource.js';
import {ExtraField} from './gzip.js';
import {addTorrent} from './qbittorrent.js';

async function UnityPackageMeta(file: string) {
  return ExtraField(file, 65, 36);
}

(async function () {
  const watchedDirectories = [path.join(process.env.APPDATA, 'Unity', 'Asset Store-5.x'), 'D:/买的资源'];

  const client = new QBittorrent({
    baseUrl: 'http://localhost:8080/',
    username: 'admin',
    password: 'adminadmin',
  });

  const tasks = await client.listTorrents({category: 'Unity'});
  const taskHashes = tasks.map((item) => item.hash);
  await login('simpletracker', 'simpletracker');
  const resources = await index();
  const resourceVersionIds = resources.map((i) => JSON.parse(i.description).version_id);

  for (const cwd of watchedDirectories) {
    const files = await util.promisify(glob)('**/*.unitypackage', {cwd});

    for (const file of files) {
      const p = path.join(cwd, file);
      const description = await UnityPackageMeta(p);
      if (!description) {
        console.log(`${p} is not a unity asset store package`);
        continue;
      }
      const meta = <Meta>JSON.parse(description);

      // 本地有，远端有
      const resourceIndex = resourceVersionIds.indexOf(meta.version_id);
      if (resourceIndex >= 0) {
        const resource = resources[resourceIndex];

        // 本地有，远端有，qb 有 => 什么都不做
        if (taskHashes.includes(resource.info_hash)) {
        } else {
          if (description === resource.description) {
            // 本地有，远端有，qb 无，一致 => 添加下载任务
            console.log(`downloading ${meta.title}`);
            const torrent = await download(resource.torrent_id);
            await addTorrent(client, torrent, path.dirname(p), path.basename(p), false);
            taskHashes.push(resource.info_hash);
          } else {
            // 本地有，远端有，qb 无，不一致 => 忽略
            console.log(`${p} has same version_id with server but not same file`);
          }
        }
      } else {
        // 本地有，远端无 => 发布资源并添加下载任务
        // console.log(`uploading ${meta.title}`);
        const name = meta.title
          .replace(/[<>:"\/\\|?*+#&().,—!™'\[\]]/g, '')
          .replace(/ {2,}/g, ' ')
          .trim();
        // @ts-ignore
        const torrent0: Buffer = await util.promisify(createTorrent)(p, {
          name: name + '.unitypackage',
          createdBy: 'UnityPT 1.0',
          announceList: [],
          private: true,
        });
        const torrent = await upload(torrent0, description, `${name}.torrent`);
        const hash = await addTorrent(client, torrent, path.dirname(p), path.basename(p), true);
        taskHashes.push(hash);
      }
    }
  }
})();
