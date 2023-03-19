import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';
import { webContents } from 'electron';
import { electronAPI } from './electronAPI';
import path from 'path';
import { FileItem } from './interface';

export class SSH {
  conn = new Client();
  ready = false;
  async createConnect() {
    if (this.ready) {
      console.log('already connected');
      return new Promise((resolve) => resolve(true));
    }

    const cfg = await electronAPI.store.get('sshConfig');
    const portExists = cfg.remotePath.split(':').length > 1;
    const connectCfg: ConnectConfig = {
      privateKey: readFileSync(cfg.privateKeyPath),
      username: cfg.username,
      host: cfg.remotePath.split(':')[0],
      port: portExists ? parseInt(cfg.remotePath.split(':')[1]) : 22,
    };

    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', () => {
          console.log('Client :: ready');
          this.ready = true;
          resolve(true);
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

  async getFile(remotePath: string, localPath: string, infoHash: string) {
    if (!this.ready) await this.createConnect();
    this.conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.fastGet(
        remotePath,
        localPath,
        {
          step: (total_transferred, chunk, total) => {
            console.log(total_transferred, chunk, total);
            webContents.getFocusedWebContents().send('get_file_progress', {
              infoHash,
              progress: total_transferred / total,
            });
          },
        },
        (err) => {
          if (err) throw err;
          this.conn.end();
        }
      );
    });
  }

  async getList() {
    if (!this.ready) await this.createConnect();
    const remotePath = electronAPI.store.get('sshConfig').remotePath.split(':').at(-1);
    return new Promise((resolve, reject) => {
      this.conn.exec(`find ${remotePath} -type d`, (err, stream) => {
        if (err) throw err;
        let buffer = '';
        let list: FileItem[] = [];
        stream
          .on('close', (code, signal) => {
            buffer.split('\n').map((item) => {});
            this.conn.exec(`find ${remotePath} -type f`, (err, stream) => {
              if (err) throw err;
              buffer = '';
              stream.on('close', (code, signal) => {
                const list = buffer.split('\n').filter((item) => item);
              });
            });
          })
          .on('data', (data) => {
            buffer += data;
          })
          .stderr.on('data', (data) => {
            reject(data);
          });
      });
    });
  }
}
