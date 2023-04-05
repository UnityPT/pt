import { HttpConfig, QBConfig, SmbConfig, SSHConfig } from '../types';

const defaultQBConfig: QBConfig = {
  qb_url: 'http://localhost:8080',
  username: 'admin',
  password: 'adminadmin',
  save_path: '/downloads',
  local_path: '',
  protocol: 'local',
};

const defaultSSHConfig: SSHConfig = {
  username: '',
  remotePath: '',
  auth: 'password',
  password: '',
  privateKeyPath: undefined,
};

const defaultHTTPConfig: HttpConfig = {
  remotePath: '',
  username: '',
  password: '',
};

const defaultSMBConfig: SmbConfig = {
  remotePath: '',
  username: '',
  password: '',
};

export { defaultQBConfig, defaultSSHConfig, defaultSMBConfig, defaultHTTPConfig };
