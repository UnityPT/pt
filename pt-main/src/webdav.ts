import { AuthType, createClient, WebDAVClient } from 'webdav';
import { electronAPI } from './electronAPI';
import path from 'path';
import * as fs from 'fs';
import { DirItem, QBConfig } from './interface';
import util from 'util';
import createTorrent from 'create-torrent';

export class Webdav {
  client: WebDAVClient;
  ready = false;
  connectTest(cfg: any) {
    this.createConnect(cfg);
    this.ready = false;
    return new Promise(async (resolve, reject) => {
      try {
        await this.client.getDirectoryContents('');
        resolve(null);
      } catch (e) {
        reject(e);
      }
    });
  }
  createConnect(cfg?: any) {
    if (!cfg) cfg = electronAPI.store.get('httpConfig');
    this.client = createClient(cfg.remotePath, {
      authType: AuthType.Digest,
      username: cfg.username,
      password: cfg.password,
    });
    this.ready = true;
  }

  async deleteFile(p: string) {
    if (!this.ready) this.createConnect();
    const qbConfig = electronAPI.store.get('qbConfig') as QBConfig;
    p = p.replace(qbConfig.save_path, '');
    return await this.client.deleteFile(p);
  }

  async getFile(event, infoHash: string, p: string) {
    if (!this.ready) this.createConnect();
    const qbConfig = electronAPI.store.get('qbConfig') as QBConfig;
    p = p.replace(qbConfig.save_path, '');
    const stream = this.client.createReadStream(p);
    const writeStream = fs.createWriteStream(path.join(qbConfig.local_path, path.basename(p)));

    //进度条
    // @ts-ignore
    const total = (await this.client.stat(p)).size!;
    let total_transferred = 0;
    stream.on('data', (chunk) => {
      writeStream.write(chunk);
      total_transferred += chunk.length;
      console.log(total_transferred, chunk.length, total);
      event.sender.send('get_file_progress', {
        infoHash,
        progress: total_transferred / total,
      });
    });

    return new Promise((resolve, reject) => {
      stream
        .on('end', () => {
          stream.destroy();
          resolve(null);
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('close', () => {
          resolve(null);
        });
    });
  }

  async getList(event, p: string, type: 'd' | 'f') {
    if (!this.ready) this.createConnect();
    if (type == 'd') {
      return this.getDir(p);
    } else {
      const g = await this.getFileList(p);
      const list = [];
      for await (const file of g) {
        list.push(file);
      }
      return list;
    }
  }
  async getDir(p: string) {
    const rootDir = {};
    return await readdir.bind(this)(p, rootDir);
    async function readdir(p: string, dir?: Record<string, DirItem>) {
      const list = await this.client.getDirectoryContents(p);
      const promises = [];
      for (const x of list) {
        if (x.type == 'directory') {
          dir[x.basename] = { name: x.basename, children: {} } as DirItem;
          promises.push(await readdir.bind(this)(path.posix.join(p, x.basename), dir[x.basename].children));
        }
      }
      await Promise.all(promises);
      return Object.values(rootDir);
    }
  }

  async getFileList(p: string) {
    return await readdir.bind(this)(p);

    async function* readdir(p: string) {
      const list = await this.client.getDirectoryContents(p);
      for (const x of list) {
        if (x.type == 'directory') {
          yield* readdir.bind(this)(path.posix.join(p, x.basename));
        } else if (x.type == 'file') {
          yield path.posix.join(p, x.basename);
        }
      }
    }
  }

  async extraField(p: string) {
    if (!this.ready) this.createConnect();
    return electronAPI.extraField(this.client.createReadStream(p));
  }

  async createTorrent(p: string, options: any) {
    if (!this.ready) this.createConnect();
    const stream = this.client.createReadStream(p);
    // @ts-ignore
    const torrent = await util.promisify(createTorrent)(stream, options);
    stream.destroy();
    return torrent;
  }

  async uploadFile(p: string, filename: string) {
    if (!this.ready) this.createConnect();
    const stream = fs.createReadStream(p);
    await this.client.putFileContents(filename, stream);
    stream.destroy();
    return;
  }
}
