import { Client, ConnectConfig, utils } from 'ssh2';
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
  client = new Client();
  ready = false;
  async createConnect() {
    const cfg = await electronAPI.store.get('sshConfig');
    const connectCfg: ConnectConfig = {
      privateKey: readFileSync(cfg.privateKeyPath),
      username: cfg.username,
      host: cfg.remotePath.split(':')[0],
    };

    return new Promise((resolve, reject) => {
      this.client
        .on('ready', () => {
          console.log('sshClient :: ready');
          this.ready = true;
          resolve(null);
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
    p = p.replace(qbConfig.save_path, '');
    const remotePath = path.posix.join(sshConfig.remotePath.split(':').at(-1), p);
    const localPath = path.join(qbConfig.local_path, path.posix.basename(p));
    if (!this.ready) await this.createConnect();
    const sftp = await util.promisify(this.client.sftp).bind(this.client)();
    sftp.fastGet(
      remotePath,
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
    if (!this.ready) await this.createConnect();
    const sftp = await util.promisify(this.client.sftp).bind(this.client)();
    const filePathList: string[] = type == 'f' ? [] : null;
    const rootdir = type == 'd' ? {} : null;
    const listPromise = await util.promisify(sftp.readdir).bind(sftp);
    return await readdir(p, rootdir);
    async function readdir(p: string, dir?: Record<string, DirItem>) {
      const list = await listPromise(p);
      for (const x of list) {
        if (x.longname[0] == 'd') {
          if (type == 'd') {
            dir[x.filename] = { name: x.filename, children: {} } as DirItem;
            //todo: 目录改成点开再readdir而不是一次性递归获取全部？
            await readdir(path.posix.join(p, x.filename), dir[x.filename].children);
          } else {
            await readdir(path.posix.join(p, x.filename), null);
          }
        } else if (type == 'f' && x.longname[0] == '-') {
          filePathList.push(path.posix.join(p, x.filename));
        }
      }
      if (type == 'f') return filePathList;
      else return Object.values(rootdir);
    }
  }

  async extraField(path: string) {
    if (!this.ready) await this.createConnect();
    const sftp = await util.promisify(this.client.sftp).bind(this.client)();
    const SI1 = 65;
    const SI2 = 36;
    let position = 0;
    const handle = await util.promisify(sftp.open).bind(sftp)(path, 'r');
    const closePromise = util.promisify(sftp.close).bind(sftp);
    //自定义返回值为buffer，否则默认返回的是bytesRead
    sftp.read[util.promisify.custom] = (handle: Buffer, buffer: Buffer, offset: number, length: number, position: number) => {
      return new Promise((resolve, reject) => {
        sftp.read(handle, buffer, offset, length, position, (err: Error, bytesRead: number, buffer: Buffer) => {
          if (err) reject(err);
          resolve(buffer);
        });
      });
    };

    const sftpReadPromise = util.promisify(sftp.read).bind(sftp);
    async function read(length: number) {
      const buffer = await sftpReadPromise(handle, Buffer.alloc(length), 0, length, position);
      position += length;
      return buffer;
    }

    const headerBuffer = await read(Member.baseSize);
    const member = new Member(headerBuffer);
    if (member.ID1 !== 31 || member.ID2 !== 139) {
      throw new Error('invalid file signature:' + member.ID1 + ',' + member.ID2);
    }
    if (member.CM !== 8) {
      throw new Error('unknown compression method: ' + member.CM);
    }

    const FlagsMask = { FTEXT: 1, FHCRC: 2, FEXTRA: 4, FNAME: 8, FCOMMENT: 16 };

    if ((member.FLG & FlagsMask.FEXTRA) !== 0) {
      const lengthBuffer = await read(2);
      const length = lengthBuffer.readUInt16LE();
      const extraBuffer = await read(length);
      for (let offset = 0; offset < length; ) {
        const extra = new Extra(extraBuffer.subarray(offset));
        if (extra.SI1 == SI1 && extra.SI2 == SI2) {
          closePromise(handle);
          return extra.data.subarray(offset, offset + extra.LEN).toString();
        }
        offset += Extra.baseSize + extra.LEN;
      }
    }
    closePromise(handle);
  }

  async createTorrent(p: string, options: any) {
    if (!this.ready) await this.createConnect();
    const sftp = await util.promisify(this.client.sftp).bind(this.client)();
    //@ts-ignore
    return await util.promisify(createTorrent)(sftp.createReadStream(p), options);
  }

  async uploadFile(p: string) {
    console.log('uploadFile', p);
    if (!this.ready) await this.createConnect();
    const sftp = await util.promisify(this.client.sftp).bind(this.client)();
    const sshConfig = electronAPI.store.get('sshConfig') as SSHConfig;
    const remotePath = path.posix.join(sshConfig.remotePath.split(':').at(-1), path.basename(p));
    await util.promisify(sftp.fastPut).bind(sftp)(p, remotePath, {
      mode: '0755',
    });
  }
}
