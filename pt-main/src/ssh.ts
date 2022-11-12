import { Client } from 'ssh2';
import { readFileSync } from 'fs';
import { SSHConfig } from './interface';


export class SSH {
  conn = new Client();
  async createConnect(cfg:SSHConfig) {
    await this.conn.connect(cfg);
  }

  async getFile(){
    return new Promise((resolve,reject)=>{
    this.conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.fastGet('./pt/testdir/202107161430.mp4', './test.mp4', {
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
