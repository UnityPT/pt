import { Client } from 'ssh2';
import { SSHConfig } from './interface';
import {readFileSync} from 'fs';

export class SSH {
  conn = new Client();
  async createConnect(cfg:SSHConfig) {
    cfg.privateKey = readFileSync('id_rsa')
    //
    await this.conn.connect(cfg);
  }

  async getFile(remotePath: string, localPath: string) {
    return new Promise((resolve,reject)=>{
    this.conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.fastGet(remotePath, localPath, {
        step: (total_transferred, chunk, total) => {
          resolve(total_transferred/total*100);
        },
      }, (err) => {
        if (err) throw err;
        this.conn.end();
      });
    });
  })
  }
}
