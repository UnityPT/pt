import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';
import { webContents } from 'electron';
import { electronAPI } from './electronAPI';
import Struct from 'typed-struct';
import path from 'path';
import { DirItem } from './interface';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();
const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

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
            //todo: on minimize, stop sending, on restore, send again;
            webContents.getFocusedWebContents().send('get_file_progress', {
              infoHash,
              progress: total_transferred / total,
            });
          },
        },
        (err) => {
          if (err) throw err;
        }
      );
    });
  }

  async getList(p: string, type: 'd' | 'f') {
    if (!this.ready) await this.createConnect();
    return new Promise((resolve, reject) => {
      this.conn.sftp(async (err, sftp) => {
        console.log('1');
        if (err) throw err;
        const filePathList: string[] = type == 'f' ? [] : null;
        const rootDirItem: DirItem = type == 'd' ? ({ name: path.basename(p), children: {} } as DirItem) : null;

        function readdir(p: string, dir: Record<string, DirItem>) {
          return new Promise((resolve, reject) => {
            sftp.readdir(p, async (err, list) => {
              if (err) throw err;
              for (const x of list) {
                if (x.longname[0] == 'd') {
                  if (type == 'd') {
                    dir[x.filename] = { name: x.filename, children: {} } as DirItem;
                    await readdir(path.posix.join(p, x.filename), dir[x.filename].children);
                  } else {
                    await readdir(path.posix.join(p, x.filename), null);
                  }
                } else if (type == 'f' && x.longname[0] == '-') {
                  filePathList.push(path.posix.join(p, x.filename));
                }
              }
              if (type == 'f') resolve(filePathList);
              else resolve(rootDirItem);
            });
          });
        }
        resolve(await readdir(p, rootDirItem.children));
      });
    });
  }

  async ExtraField(path: string) {
    const SI1 = 65;
    const SI2 = 36;
    if (!this.ready) await this.createConnect();
    return new Promise((resolve, reject) => {
      this.conn.sftp((err, sftp) => {
        let position = 0;
        sftp.open(path, 'r', async (err, handle) => {
          if (err) throw err;
          function read(length: number): Promise<Buffer> {
            const buffer = Buffer.alloc(length);
            return new Promise((resolve, reject) => {
              sftp.read(handle, buffer, 0, length, position, (err, bytesRead, buffer) => {
                if (err) reject(err);
                position += length;
                resolve(buffer);
              });
            });
          }

          const headerBuffer = await read(Member.baseSize);
          const member = new Member(headerBuffer);
          if (member.ID1 != 31 || member.ID2 != 139) {
            throw new Error('invalid file signature:' + member.ID1 + ',' + member.ID2);
          }
          if (member.CM != 8) {
            throw new Error('invalid compression method:' + member.CM);
          }
          const flagsMask = { FTEXT: 1, FHCRC: 2, FEXTRA: 4, FNAME: 8, FCOMMENT: 16 };
          if ((member.FLG & flagsMask.FEXTRA) !== 0) {
            const lengthBuffer = await read(2);
            const length = lengthBuffer.readUInt16LE(0);
            const extraBuffer = await read(length);
            for (let offset = 0; offset < length; ) {
              const extra = new Extra(extraBuffer.subarray(offset));
              if (extra.SI1 == SI1 && extra.SI2 == SI2) {
                return resolve(extra.data.subarray(offset, offset + extra.LEN).toString());
              }
              offset += Extra.baseSize + extra.LEN;
            }
          }
        });
      });
    });
  }

  async createTorrent(path: string, options: any) {
    if (!this.ready) await this.createConnect();
    return new Promise((resolve, reject) => {
      this.conn.sftp((err, sftp) => {
        sftp.stat(path, async (err, stats) => {});
      });
    });
  }
}
