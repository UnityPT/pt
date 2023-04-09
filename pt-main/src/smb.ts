import { electronAPI } from './electronAPI';
import path from 'path';
import * as fs from 'fs';
import util from 'util';
import createTorrent from 'create-torrent';
import { dialog, shell } from 'electron';
import glob from 'glob';
import { QBConfig } from './interface';

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

    const smbRemotePath = electronAPI.store.get('smbConfig').remotePath;

    const list: string[] = [];
    for await (let file of g) {
      //win中获取的路劲会被转成大写，需要i_flag
      //mac中路径可能会好几层,需要pathname
      file = file.replace(new RegExp(smbRemotePath, 'i'), '').replace(path.join('Volumes', new URL(smbRemotePath).pathname), '');
      list.push(file);
    }
    return list;
  }

  async deleteFile(p: string) {
    console.log('deleteFile', p);
    const qbConfig = electronAPI.store.get('qbConfig') as QBConfig;
    const smbRemotePath = electronAPI.store.get('smbConfig').remotePath;
    p = path.join(process.platform == 'darwin' ? path.join('/Volumes', new URL(smbRemotePath).pathname) : smbRemotePath, path.normalize(p.replace(qbConfig.save_path, '')));
    fs.unlinkSync(p);
  }

  async getFile(event, infoHash: string, p: string) {
    //smb方式可以直接使用import方法打开文件，不需要将文件下载回本地
  }

  uploadFile(p: string, filename: string) {
    console.log(p);
    const stream = fs.createReadStream(p);
    const smbRemotePath = electronAPI.store.get('smbConfig').remotePath;
    const platform = process.platform;
    const writeStream = fs.createWriteStream(path.join(platform == 'darwin' ? path.join('/Volumes', new URL(smbRemotePath).pathname) : smbRemotePath, filename));
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
    return electronAPI.extraField(await fs.createReadStream(p));
  }
}
