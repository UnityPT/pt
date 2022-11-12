export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  privateKey: Buffer;
}
