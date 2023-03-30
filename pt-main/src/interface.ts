export interface SSHConfig {
  remotePath: string;
  username: string;
  privateKeyPath: string;
}
export interface DirItem {
  name: string;
  children: Record<string, DirItem>;
}
export interface QBConfig {
  qb_url: string;
  username: string;
  password: string;
  save_path: string;
  local_path: string;
  protocol: 'local' | 'sftp' | 'smb' | 'webdav';
}
