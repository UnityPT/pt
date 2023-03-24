export interface UserSSHConfig {
  remotePath: string;
  localPath: string;
  username: string;
  privateKeyPath: string;
}
export interface DirItem {
  name: string;
  children: Record<string, DirItem>;
}
