import { HttpConfig, QBInfo, SmbConfig, UserSSHConfig } from '../types';

const defaultQBInfo: QBInfo = {
  qb_url: 'http://localhost:8080',
  username: 'admin',
  password: 'adminadmin',
  get_protocol: 'local', // 'local'/'sftp'/'smb'/'http',
};

const defaultSSHConfig: UserSSHConfig = {
  username: '',
  remotePath: '',
  localPath: '',
  privateKeyPath: '',
};

const defaultHTTPConfig: HttpConfig = {
  remotePath: '',
  localPath: '',
};

const defaultSMBConfig: SmbConfig = {
  get_url: '',
};

export { defaultQBInfo, defaultSSHConfig, defaultSMBConfig, defaultHTTPConfig };
