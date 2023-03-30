import Struct from 'typed-struct';
import { AuthType, createClient } from 'webdav';
import { electronAPI } from './electronAPI';
import path from 'path';
import * as fs from 'fs';
import { DirItem, QBConfig } from './interface';
import util from 'util';
import createTorrent from 'create-torrent';
import { webContents } from 'electron';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();
const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

export class Webdav {
  webDavClient;
  ready = false;
  createConnect() {
    const cfg = electronAPI.store.get('httpConfig');
    this.webDavClient = createClient('http://144.24.50.48:7000', {
      authType: AuthType.Password,
      username: cfg.username,
      password: cfg.password,
    });
    this.ready = true;
  }

  async getFile(infoHash: string, p: string) {
    if (!this.ready) this.createConnect();
    const qbConfig = electronAPI.store.get('qbConfig') as QBConfig;
    p = p.replace(qbConfig.save_path, '');
    const stream = this.webDavClient.createReadStream(p);
    //进度条
    const total = await this.webDavClient.getFileSize(p);
    let total_transferred = 0;
    stream.on('data', (chunk) => {
      total_transferred += chunk.length;
      console.log(total_transferred, chunk.length, total);
      webContents.getFocusedWebContents()?.send('get_file_progress', {
        infoHash,
        progress: total_transferred / total,
      });
    });
    return new Promise((resolve, reject) => {
      stream
        .on('end', () => {
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

  async getList(p: string, type: 'd' | 'f') {
    if (!this.ready) this.createConnect();
    const filePathList: string[] = type == 'f' ? [] : null;
    const rootDir = type == 'd' ? {} : null;
    return await readdir.bind(this)(p, rootDir);
    async function readdir(p: string, dir?: Record<string, DirItem>) {
      const list = await this.webDavClient.getDirectoryContents(p);
      // @ts-ignore
      for (const x of list) {
        if (x.type == 'directory') {
          if (type == 'd') {
            dir[x.basename] = { name: x.basename, children: {} } as DirItem;
            await readdir.bind(this)(path.posix.join(p, x.basename), dir[x.basename].children);
          } else {
            await readdir.bind(this)(path.posix.join(p, x.basename), null);
          }
        } else if (x.type == 'file' && type == 'f') {
          filePathList.push(path.posix.join(p, x.basename));
        }
      }
      if (type == 'f') return filePathList;
      else return Object.values(rootDir);
    }
  }

  async extraField(p: string) {
    if (!this.ready) this.createConnect();
    console.log('extraField');
    const SI1 = 65;
    const SI2 = 36;
    const stream = this.webDavClient.createReadStream(p);
    async function read(stream: fs.ReadStream, size: number): Promise<Buffer> {
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
    if (member.ID1 != 31 || member.ID2 != 139) {
      throw new Error('invalid file sginature:' + member.ID1 + ',' + member.ID2);
    }
    if (member.CM != 8) {
      throw new Error('invalid compression method:' + member.CM);
    }

    const FlagsMask = { FTEX: 1, FHCRC: 2, FEXTRA: 4, FNAME: 8, FCOMMENT: 16 };

    if ((member.FLG & FlagsMask.FEXTRA) !== 0) {
      const lengthBuffer = await read(stream, 2);
      const length = lengthBuffer.readUInt16LE();
      const extraBuffer = await read(stream, length);
      for (let offset = 0; offset < length; ) {
        const extra = new Extra(extraBuffer.subarray(offset));
        if (extra.SI1 == SI1 && extra.SI2 == SI2) {
          return extra.data.subarray(offset, offset + extra.LEN).toString();
        }
        offset += Extra.baseSize + extra.LEN;
      }
    }
  }

  async createTorrent(p: string, options: any) {
    if (!this.ready) this.createConnect();
    // @ts-ignore
    return await util.promisify(createTorrent)(this.webDavClient.createReadStream(p), options);
  }

  async uploadFile(p: string) {
    if (!this.ready) this.createConnect();
    await this.webDavClient.putFileContents(path.basename(p), fs.createReadStream(p));
  }
}
