import Struct from 'typed-struct';
import { electronAPI } from './electronAPI';
import path from 'path';
import * as fs from 'fs';
import util from 'util';
import createTorrent from 'create-torrent';
import { dialog } from 'electron';
import glob from 'glob';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();
const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

export class SMB {
  async smbBrowse() {
    const remotePath = electronAPI.store.get('smbConfig').remotePath;
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: remotePath });
    if (res.canceled == true) return null;
    return res.filePaths[0];
  }

  async getList(p: string, t: 'f') {
    return await glob('**/*.unitypackage', { cwd: p, absolute: true });
  }

  async getFile(infoHash: string, p: string) {
    //smb方式可以直接使用import方法打开文件，不需要将文件下载回本地
  }

  uploadFile(p: string) {
    const stream = fs.createReadStream(p);
    const smbRemotePath = electronAPI.store.get('smbConfig').remotePath;
    const writeStream = fs.createWriteStream(path.join(smbRemotePath, path.basename(p)));
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
