import { Client } from 'ssh2';
import { SSHConfig } from './interface';
import { readFileSync } from 'fs';
import { webContents } from 'electron';

export class SSH {
  conn = new Client();

  async createConnect(cfg: SSHConfig) {
    cfg.privateKey = readFileSync(cfg.privateKeyPath);
    return new Promise((resolve, reject) => {
      this.conn.on('ready', () => {
        resolve(true);
      }).on('error', (err) => {
        reject(err);
      }).connect(cfg);
    });
  }

  async getFile(remotePath: string, localPath: string, infoHash: string) {
    this.conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.fastGet(remotePath, localPath, {
        step: (total_transferred, chunk, total) => {
          webContents.getFocusedWebContents().send('get_file_progress', {
            infoHash,
            step: total_transferred / total * 100,
          });
        },
      }, (err) => {
        if (err) throw err;
        this.conn.end();
      });
    });
  }
}
