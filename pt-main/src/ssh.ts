import { Client, ConnectConfig, ReadStream, utils } from 'ssh2';
import { readFileSync } from 'fs';
import { webContents } from 'electron';
import { electronAPI } from './electronAPI';
import Struct from 'typed-struct';
import path from 'path';
import { DirItem, QBConfig, SSHConfig } from './interface';
import util from 'util';
import createTorrent from 'create-torrent';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();
const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

export class SSH {
  client;
  ready = false;
  async createConnect() {
    const cfg = await electronAPI.store.get('sshConfig');
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

  async getFile(infoHash: string, p: string) {
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
          webContents.getFocusedWebContents()?.send('get_file_progress', {
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

  async getList(p: string, type: 'd' | 'f') {
    console.log('getList', p, type);
    const sshRemotePath = electronAPI.store.get('sshConfig').remotePath.split(':').at(-1);
    p = path.posix.join(sshRemotePath, p);
    if (!this.ready) await this.createConnect();
    const filePathList: string[] = type == 'f' ? [] : null;
    const rootdir = type == 'd' ? {} : null;
    const listPromise = await util.promisify(this.client.readdir).bind(this.client);
    return await readdir(p, rootdir);
    async function readdir(p: string, dir?: Record<string, DirItem>) {
      const list = await listPromise(p);
      for (const x of list) {
        if (x.longname[0] == 'd') {
          if (type == 'd') {
            dir[x.filename] = { name: x.filename, children: {} } as DirItem;
            await readdir(path.posix.join(p, x.filename), dir[x.filename].children);
          } else {
            await readdir(path.posix.join(p, x.filename), null);
          }
        } else if (type == 'f' && x.longname[0] == '-') {
          filePathList.push(path.posix.join(p.replace(sshRemotePath, ''), x.filename));
        }
      }
      if (type == 'f') return filePathList;
      else return Object.values(rootdir);
    }
  }

  async extraField(p: string) {
    console.log('extraField', p);
    if (!this.ready) await this.createConnect();
    const SI1 = 65;
    const SI2 = 36;
    p = path.posix.join(electronAPI.store.get('sshConfig').remotePath.split(':').at(-1), p);

    const stream = this.client.createReadStream(p);
    async function read(stream: ReadStream, size: number) {
      const result = stream.read(size);
      if (result) return result;
      return new Promise((resolve) => {
        stream.on('readable', function readable() {
          const result = stream.read(size);
          if (result) {
            resolve(result);
            stream.off('readable', readable);
          }
        });
      });
    }

    const headerBuffer = await read(stream, Member.baseSize);
    const member = new Member(headerBuffer);
    if (member.ID1 !== 31 || member.ID2 !== 139) {
      throw new Error('invalid file signature:' + member.ID1 + ',' + member.ID2);
    }
    if (member.CM !== 8) {
      throw new Error('unknown compression method: ' + member.CM);
    }

    const FlagsMask = { FTEXT: 1, FHCRC: 2, FEXTRA: 4, FNAME: 8, FCOMMENT: 16 };

    if ((member.FLG & FlagsMask.FEXTRA) !== 0) {
      const lengthBuffer = await read(stream, 2);
      const length = lengthBuffer.readUInt16LE();
      const extraBuffer = await read(stream, length);
      for (let offset = 0; offset < length; ) {
        const extra = new Extra(extraBuffer.subarray(offset));
        if (extra.SI1 == SI1 && extra.SI2 == SI2) {
          console.log('destroy');
          stream.destroy();
          return extra.data.subarray(offset, offset + extra.LEN).toString();
        }
        offset += Extra.baseSize + extra.LEN;
      }
    }
    stream.destroy();
  }

  async createTorrent(p: string, options: any) {
    if (!this.ready) await this.createConnect();
    p = path.posix.join(electronAPI.store.get('sshConfig').remotePath.split(':').at(-1), p);
    //@ts-ignore
    return await util.promisify(createTorrent)(this.client.createReadStream(p), options);
  }

  async uploadFile(p: string) {
    console.log('uploadFile', p);
    if (!this.ready) await this.createConnect();
    const sshConfig = electronAPI.store.get('sshConfig') as SSHConfig;
    const remotePath = path.posix.join(sshConfig.remotePath.split(':').at(-1), path.basename(p));
    await util.promisify(this.client.fastPut).bind(this.client)(p, remotePath, {
      mode: '0755',
    });
  }
}
