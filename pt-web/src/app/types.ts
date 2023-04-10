export interface Resource {
  torrent_id: number;
  name: string;
  description: string;
  username: string;
  submitted: string;
  info_hash: string;
  total_size: number;
}

export interface Meta {
  link: Link;
  unity_version: string;
  pubdate: string;
  version: string;
  upload_id: string;
  version_id: string;
  category: Category;
  id: string;
  title: string;
  publisher: Publisher;
  description: string;
}

export interface ResourceMeta {
  resource: Resource;
  meta: Meta;
}

export interface Link {
  id: string;
  type: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface Publisher {
  id: string;
  label: string;
}

export interface RegisterInfo {
  username: string;
  password: string;
  password_again: string;
  email: string;
  invitation: string;
}

export interface UserStat {
  uploaded: number;
  downloaded: number;
  passkey: string;
}

export interface DirItem {
  name: string;
  children: Record<string, DirItem>;
}

export interface Config {
  qBittorrent: QBittorrentConfig;
  remote: SmbConfig | SSHPasswordConfig | SSHKeyConfig | HttpConfig;
}

export interface QBittorrentConfig {
  qb_location: 'local' | 'remote';
  qb_url: string;
  username: string;
  password: string;
  save_path: string;
  local_path: string;
}

export interface RemoteConfig {
  protocol: string;
  remotePath: string;
  username: string;
  password: string;
}

export interface SmbConfig extends RemoteConfig {
  protocol: 'smb';
  remotePath: string;
  username: string;
  password: string;
}

export interface SSHConfig {
  protocol: 'sftp';
  username: string;
  remotePath: string;
  auth: 'password' | 'key';
}

export interface SSHPasswordConfig extends SSHConfig {
  auth: 'password';
  password: string;
}

export interface SSHKeyConfig extends SSHConfig {
  auth: 'key';
  privateKeyPath: string;
}

export interface HttpConfig extends RemoteConfig {
  protocol: 'http';
  remotePath: string;
  username: string;
  password: string;
}
