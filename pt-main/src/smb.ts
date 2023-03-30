import Struct from 'typed-struct';
import { AuthType, createClient } from 'webdav';
import { electronAPI } from './electronAPI';
import path from 'path';
import * as fs from 'fs';
import { DirItem } from './interface';
import util from 'util';
import createTorrent from 'create-torrent';
import SMB2 from 'smb2';

export class SMB {
  client;
  ready = false;
  createConnect() {
    this.client = new SMB2({
      share: '\\\\10.198.11.1\\share',
      username: 'frog',
      domain: '',
      password: '123456',
      port: '445',
    });
  }

  getList(p: string, type: 'd' | 'f') {
    console.log('getList');
    if (!this.ready) this.createConnect();
    this.client.readdir('.', (err, files) => {
      if (err) console.log(err);
      console.log(files);
    });
  }

  getFile(infoHash: any, fileName: any) {}

  uploadFile(path: any) {}

  createTorrent(path: any, options: any) {}

  extraField(path: any) {}
}
