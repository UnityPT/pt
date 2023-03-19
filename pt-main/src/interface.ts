export interface UserSSHConfig {
  remotePath: string;
  localPath: string;
  username: string;
  privateKeyPath: string;
}
export interface FileItem {
  name: string;
  isDirectory: boolean;
  children?: FileItem[];
}
