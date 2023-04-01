import Struct from 'typed-struct';
import { AuthType, createClient } from 'webdav';
import { electronAPI } from './electronAPI';
import path from 'path';
import * as fs from 'fs';
import { DirItem, QBConfig } from './interface';
import util from 'util';
import createTorrent from 'create-torrent';
import SMB2 from 'v9u-smb2';
import { webContents } from 'electron';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();
const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

export class SMB {
  client;
  ready = false;
  createConnect() {
    //@ts-ignore
    this.client = new SMB2({
      share: '\\\\10.198.11.1\\shared',
      username: 'frog',
      password: '123456',
    });
    this.ready = true;
  }

  async getList(p: string, type: 'd' | 'f') {
    if (!this.ready) this.createConnect();
    fs.readdir('\\\\10.198.11.1\\shared', (err, files) => {
      console.log(files);
    })
    // const filePathList: string[] = type == 'f' ? [] : null;
    // const rootDir = type == 'd' ? {} : null;
    // return await readdir.bind(this)(p, rootDir);
    // async function readdir(p: string, dir?) {
    //   const list = await this.client.readdir(p, { stats: true });
    //   for (const x of list) {
    //     if (x.isDirectory()) {
    //       if (type == 'd') {
    //         dir[x.name] = { name: x.name, children: {} } as DirItem;
    //         await readdir.bind(this)(path.posix.join(p, x.name), dir[x.name].children);
    //       } else {
    //         await readdir.bind(this)(path.posix.join(p, x.name), null);
    //       }
    //     } else if (type == 'f') {
    //       filePathList.push(path.posix.join(p, x.name));
    //     }
    //   }
    //   if (type == 'f') return filePathList;
    //   return Object.values(rootDir);
    // }
  }

  async getFile(infoHash: string, p: string) {
    //smb方式可以直接使用import方法打开文件，不需要将文件下载回本地
    // if (!this.ready) this.createConnect();
    // const qbConfig = electronAPI.store.get('qbConfig') as QBConfig;
    // p = p.replace(qbConfig.save_path, '');
    // const stream = this.client.createReadStream(p);
    // const writeStream = fs.createWriteStream(path.join(qbConfig.local_path, path.basename(p)));
    //
    // //进度条
    // const total = (await this.client.getSize(p));
    // console.log(total);
    // let total_transferred = 0;
    // stream.on('data', (chunk) => {
    //   writeStream.write(chunk);
    //   total_transferred += chunk.length;
    //   console.log(total_transferred, chunk.length, total);
    //   webContents.getFocusedWebContents()?.send('get_file_progress', {
    //     infoHash,
    //     progress: total_transferred / total,
    //   });
    // });
    //
    // return new Promise((resolve, reject) => {
    //   stream
    //     .on('end', () => {
    //       stream.destroy();
    //       resolve(null);
    //     })
    //     .on('error', (err) => {
    //       reject(err);
    //     })
    //     .on('close', () => {
    //       resolve(null);
    //     });
    // });
  }

  uploadFile(p: string) {
    if (!this.ready) this.createConnect();
    const stream = fs.createReadStream(p);
    const writeStream = this.client.createWriteStream(path.basename(p));
    stream.pipe(writeStream);
    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        resolve(null);
      });
      stream.on('error', (err) => {
        reject(err);
        stream.destroy();
      });
      writeStream.on('error', (err) => {
        reject(err);
        writeStream.destroy();
      });
    });
  }

  async createTorrent(p: string, options: any) {
    if (!this.ready) this.createConnect();
    const stream = await this.client.createReadStream(p);

    const ws = fs.createWriteStream(path.basename(p));
    stream.pipe(ws);
    ws.on('finish', () => {
      console.log('finish');
      const s = fs.createReadStream(path.basename(p));
      createTorrent(stream, options, (err, torrent) => {
        if (err) console.log(err);
        console.log(torrent);
      });
    });
    // @ts-ignore
    // const torrent = await util.promisify(createTorrent)(stream, options);
    // console.log(torrent);
    // // stream.destroy();
    // return torrent;
  }

  async extraField(p: string) {
    console.log('extraField');
    if (!this.ready) this.createConnect();
    const SI1 = 65;
    const SI2 = 36;
    const stream = await this.client.createReadStream(p);

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
          // stream.destroy();
          return extra.data.subarray(offset, offset + extra.LEN).toString();
        }
        offset += Extra.baseSize + extra.LEN;
      }
    }
    // stream.destroy();
  }
}
