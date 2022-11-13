import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';
import { webContents } from 'electron';
import { UserSSHConfig } from './interface';

export class SSH {
  conn = new Client();

  async createConnect(cfg: UserSSHConfig) {
    const portExists = cfg.remotePath.split(':').length > 1;
    const connectCfg:ConnectConfig = {
      privateKey:readFileSync(cfg.privateKeyPath),
      username:cfg.username,
      host:cfg.remotePath.split(':')[0],
      //是否为数字
      port:portExists?parseInt(cfg.remotePath.split(':')[1]):22,
    }
    return new Promise((resolve, reject) => {
      this.conn.on('ready', () => {
        resolve(true);
      }).on('error', (err) => {
        reject(err);
      }).connect(connectCfg);
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
