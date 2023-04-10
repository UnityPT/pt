import { HttpConfig, QBittorrentConfig, SmbConfig, SSHConfig, SSHPasswordConfig } from '../types';

const defaultQBConfig: QBittorrentConfig = {
  qb_location: 'local',
  qb_url: 'http://localhost:8080',
  username: 'admin',
  password: 'adminadmin',
  save_path: '/downloads',
  local_path: '',
};

const defaultSSHConfig: SSHPasswordConfig = {
  protocol: 'sftp',
  username: '',
  remotePath: '',
  auth: 'password',
  password: '',
};

const defaultHTTPConfig: HttpConfig = {
  protocol: 'http',
  remotePath: '',
  username: '',
  password: '',
};

const defaultSMBConfig: SmbConfig = {
  protocol: 'smb',
  remotePath: '',
  username: '',
  password: '',
};

export { defaultQBConfig, defaultSSHConfig, defaultSMBConfig, defaultHTTPConfig };
