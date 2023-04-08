import Struct from 'typed-struct';
import { electronAPI } from './electronAPI';
import path from 'path';
import * as fs from 'fs';
import util from 'util';
import createTorrent from 'create-torrent';
import { dialog, shell } from 'electron';
import glob from 'glob';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();
const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

export class SMB {
  async connectTest(cfg) {
    let remotePath = cfg.remotePath;
    if (process.platform == 'darwin') {
      remotePath = path.join('/Volumes', new URL(remotePath).pathname);
    }
    fs.accessSync(remotePath, fs.constants.R_OK);
  }
  async smbBrowse() {
    let remotePath = electronAPI.store.get('smbConfig').remotePath;
    if (process.platform == 'darwin') {
      remotePath = path.join('/Volumes', new URL(remotePath).pathname);
      try {
        await fs.accessSync(remotePath, fs.constants.R_OK);
      } catch (e) {
        console.log(e);
        await shell.openExternal(electronAPI.store.get('smbConfig').remotePath);
      }
    }
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: remotePath });
    if (res.canceled == true) return null;
    return res.filePaths[0];
  }

  async getList(event, p: string, t: 'f') {
    console.log('getList', p, t);
    const g = glob.globStream('**/*.unitypackage', { cwd: p, absolute: true, nodir: true });

    const list: string[] = [];
    for await (const file of g) {
      list.push(file);
    }
    return list;
  }

  async deleteFile(p: string) {}

  async getFile(event, infoHash: string, p: string) {
    //smb方式可以直接使用import方法打开文件，不需要将文件下载回本地
  }

  uploadFile(p: string, filename: string) {
    console.log(p);
    const stream = fs.createReadStream(p);
    const smbRemotePath = electronAPI.store.get('smbConfig').remotePath;
    const platform = process.platform;
    const writeStream = fs.createWriteStream(
      path.join(platform == 'darwin' ? path.join('/Volumes', new URL(smbRemotePath).pathname) : smbRemotePath, filename)
    );
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
    const stream = await fs.createReadStream(p);
    //@ts-ignore
    const torrent = await util.promisify(createTorrent)(stream, options);
    stream.destroy();
    return torrent;
  }

  async extraField(p: string) {
    console.log('extraField');
    const SI1 = 65;
    const SI2 = 36;
    console.log(p);
    const stream = await fs.createReadStream(p);
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
          stream.destroy();
          return extra.data.subarray(offset, offset + extra.LEN).toString();
        }
        offset += Extra.baseSize + extra.LEN;
      }
    }
    stream.destroy();
  }
}
