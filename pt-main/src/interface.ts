export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  privateKeyPath: string;
  privateKey: Buffer;
}
