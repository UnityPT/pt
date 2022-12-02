// import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';
import { webContents } from 'electron';
import { electronAPI } from './electronAPI';
import path from 'path';

// export class SSH {
//   conn = new Client();
//
//   async createConnect() {
//     const cfg = await electronAPI.store.get('sshConfig');
//     const portExists = cfg.remotePath.split(':').length > 1;
//     const connectCfg: ConnectConfig = {
//       privateKey: readFileSync(cfg.privateKeyPath),
//       username: cfg.username,
//       host: cfg.remotePath.split(':')[0],
//       port: portExists ? parseInt(cfg.remotePath.split(':')[1]) : 22,
//     };
//     return new Promise((resolve, reject) => {
//       this.conn.on('ready', () => {
//         resolve(true);
//       }).on('error', (err) => {
//         reject(err);
//       }).connect(connectCfg);
//     });
//   }
//
//   async getFile(remotePath: string, localPath: string, infoHash: string) {
//     this.conn.sftp((err, sftp) => {
//       if (err) throw err;
//       sftp.fastGet(remotePath, localPath, {
//         step: (total_transferred, chunk, total) => {
//           console.log(total_transferred, chunk, total);
//           webContents.getFocusedWebContents().send('get_file_progress', {
//             infoHash,
//             progress: total_transferred / total,
//           });
//         },
//       }, (err) => {
//         if (err) throw err;
//         this.conn.end();
//       });
//     });
//   }
// }
