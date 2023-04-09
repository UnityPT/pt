import { shell } from 'electron';
import path from 'path';
import Struct from 'typed-struct';
import * as fs from 'fs';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();
const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

export class electronAPI {
  static store;

  static async import(event, origin: string, pathname: string) {
    const platform = process.platform;
    if (platform == 'win32') {
      return shell.openPath(path.join(origin, pathname));
    } else if (platform == 'darwin') {
      const url = new URL(origin);
      url.pathname = path.join(url.pathname, pathname);
      return shell.openExternal(url.href);
    } else {
      console.log('其他平台', platform);
      return shell.openExternal(path.join(origin, pathname));
    }
  }

  static async store_get(event, key: string, defaultValue = undefined) {
    return this.store.get(key, defaultValue);
  }

  static async store_set(event, key: string, value) {
    return this.store.set(key, value);
  }

  static async deleteFile(p: string) {
    console.log('deleteFile', p);
    fs.unlinkSync(p);
  }

  static async new_url(event, url: string) {
    return new URL(url);
  }

  static async extraField(stream: any) {
    async function read(stream: any, size: number): Promise<Buffer> {
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

    const SI1 = 65;
    const SI2 = 36;
    const headerBuffer = await read(stream, Member.baseSize);
    const member = new Member(headerBuffer);
    if (member.ID1 != 31 || member.ID2 != 139) {
      throw new Error('invalid file signature:' + member.ID1 + ',' + member.ID2);
    }
    if (member.CM != 8) {
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
          stream.destroy();
          return extra.data.subarray(offset, offset + extra.LEN).toString();
        }
        offset += Extra.baseSize + extra.LEN;
      }
    }
    stream.destroy();
  }
}
