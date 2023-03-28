import { HttpConfig, QBConfig, SmbConfig, UserSSHConfig } from '../types';

const defaultQBConfig: QBConfig = {
  qb_url: 'http://localhost:8080',
  username: 'admin',
  password: 'adminadmin',
  save_path: '/downloads',
  get_protocol: 'local',
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
  remotePath: '',
};

export { defaultQBConfig, defaultSSHConfig, defaultSMBConfig, defaultHTTPConfig };
