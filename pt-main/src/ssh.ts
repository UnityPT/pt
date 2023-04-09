import { Client, ConnectConfig, ReadStream, utils } from 'ssh2';
import { readFileSync } from 'fs';
import { electronAPI } from './electronAPI';
import path from 'path';
import { DirItem, QBConfig, SSHConfig } from './interface';
import util from 'util';
import createTorrent from 'create-torrent';

export class SSH {
  client;
  ready = false;
  async connectTest(cfg: any) {
    await this.createConnect(cfg);
    this.ready = false;
    return new Promise(async (resolve, reject) => {
      try {
        await this.client.readdir('');
        resolve(null);
      } catch (e) {
        reject(e);
      }
    });
  }
  async createConnect(cfg?: any) {
    if (!cfg) cfg = await electronAPI.store.get('sshConfig');
    const remoteSplits = cfg.remotePath.split(':');
    const connectCfg: ConnectConfig = {
      privateKey: cfg.auth == 'key' ? readFileSync(cfg.privateKeyPath) : undefined,
      password: cfg.password,
      username: cfg.username,
      host: remoteSplits[0],
      port: isFinite(Number(remoteSplits[1])) ? Number(remoteSplits[1]) : 22,
    };

    return new Promise((resolve, reject) => {
      const conn = new Client();
      conn
        .on('ready', () => {
          console.log('sshClient :: ready');
          conn.sftp((err, sftp) => {
            this.client = sftp;
            sftp.on('end', () => {
              this.ready = false;
            });
            this.ready = true;
            resolve(null);
          });
        })
        .on('error', (err) => {
          this.ready = false;
          reject(err);
        })
        .on('end', () => {
          this.ready = false;
        })
        .on('close', () => {
          this.ready = false;
        })
        .connect(connectCfg);
    });
  }

  async deleteFile(p: string) {
    console.log('deleteFile', p);
    const sshConfig = electronAPI.store.get('sshConfig') as SSHConfig;
    const qbConfig = electronAPI.store.get('qbConfig') as QBConfig;
    p = path.posix.join(sshConfig.remotePath.split(':').at(-1), p.replace(qbConfig.save_path, ''));
    return await util.promisify(this.client.unlink)(p);
  }

  async getFile(event, infoHash: string, p: string) {
    console.log('getFile', infoHash, p);
    const sshConfig = electronAPI.store.get('sshConfig') as SSHConfig;
    const qbConfig = electronAPI.store.get('qbConfig') as QBConfig;
    p = path.posix.join(sshConfig.remotePath.split(':').at(-1), p.replace(qbConfig.save_path, ''));
    const localPath = path.join(qbConfig.local_path, path.posix.basename(p));
    if (!this.ready) await this.createConnect();
    this.client.fastGet(
      p,
      localPath,
      {
        step: (total_transferred, chunk, total) => {
          console.log(total_transferred, chunk, total);
          event.sender.send('get_file_progress', {
            infoHash,
            progress: total_transferred / total,
          });
        },
      },
      (err) => {
        if (err) throw err;
      }
    );
  }

  async getList(event, p: string, type: 'd' | 'f') {
    console.log('getList', p, type);
    if (!this.ready) await this.createConnect();
    const sshRemotePath = electronAPI.store.get('sshConfig').remotePath.split(':').at(-1);
    p = path.posix.join(sshRemotePath, p);
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
    const rootdir = {};
    const readdirPromise = await util.promisify(this.client.readdir).bind(this.client);
    return await readdir(p, rootdir);
    async function readdir(p: string, dir?: Record<string, DirItem>) {
      const list = await readdirPromise(p);
      const promises = [];
      for (const x of list) {
        if (x.longname[0] == 'd') {
          dir[x.filename] = { name: x.filename, children: {} } as DirItem;
          promises.push(readdir(path.posix.join(p, x.filename), dir[x.filename].children));
        }
      }
      await Promise.all(promises);
      return Object.values(rootdir);
    }
  }

  async getFileList(p: string) {
    const sshRemotePath = electronAPI.store.get('sshConfig').remotePath.split(':').at(-1);
    const readdirPromise = await util.promisify(this.client.readdir).bind(this.client);
    return readdir(p);

    async function* readdir(p: string) {
      const list = await readdirPromise(p);
      for (const x of list) {
        if (x.longname.startsWith('d')) {
          yield* readdir(path.posix.join(p, x.filename));
        } else if (x.longname.startsWith('-')) {
          yield path.posix.join(p.replace(sshRemotePath, ''), x.filename);
        }
      }
    }
  }

  async extraField(p: string) {
    console.log('extraField', p);
    if (!this.ready) await this.createConnect();
    p = path.posix.join(electronAPI.store.get('sshConfig').remotePath.split(':').at(-1), p);
    return electronAPI.extraField(this.client.createReadStream(p));
  }

  async createTorrent(p: string, options: any) {
    if (!this.ready) await this.createConnect();
    p = path.posix.join(electronAPI.store.get('sshConfig').remotePath.split(':').at(-1), p);
    //@ts-ignore
    return await util.promisify(createTorrent)(this.client.createReadStream(p), options);
  }

  async uploadFile(p: string, filename: string) {
    console.log('uploadFile', p);
    if (!this.ready) await this.createConnect();
    const sshConfig = electronAPI.store.get('sshConfig') as SSHConfig;
    const remotePath = path.posix.join(sshConfig.remotePath.split(':').at(-1), filename);
    await util.promisify(this.client.fastPut).bind(this.client)(p, remotePath, {
      mode: '0755',
    });
  }
}
