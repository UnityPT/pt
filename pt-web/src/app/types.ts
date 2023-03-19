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

export interface QBInfo {
  qb_url: string;
  username: string;
  password: string;
  get_protocol: string;
}

export interface UserStat {
  uploaded: number;
  downloaded: number;
}
export interface UserSSHConfig {
  remotePath: string;
  username: string;
  localPath: string;
  privateKeyPath: string;
}
export interface SmbConfig {
  get_url: string;
}
export interface HttpConfig {
  remotePath: string;
  localPath: string;
}

export interface FileItem {
  name: string;
  isDirectory: boolean;
  children?: FileItem[];
}
