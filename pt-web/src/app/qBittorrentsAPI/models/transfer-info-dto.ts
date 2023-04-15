/* tslint:disable */
/* eslint-disable */
export interface TransferInfoDto {

  /**
   * Connection status. See possible values here below
   */
  connection_status?: string;

  /**
   * DHT nodes connected to
   */
  dht_nodes?: number;

  /**
   * Data downloaded this session (bytes)
   */
  dl_info_data?: number;

  /**
   * Global download rate (bytes/s)
   */
  dl_info_speed?: number;

  /**
   * Download rate limit (bytes/s)
   */
  dl_rate_limit?: number;

  /**
   * True if torrent queueing is enabled
   */
  queueing?: boolean;

  /**
   * Transfer list refresh interval (milliseconds)
   */
  refresh_interval?: number;

  /**
   * Data uploaded this session (bytes)
   */
  up_info_data?: number;

  /**
   * Global upload rate (bytes/s)
   */
  up_info_speed?: number;

  /**
   * Upload rate limit (bytes/s)
   */
  up_rate_limit?: number;

  /**
   * True if alternative speed limits are enabled
   */
  use_alt_speed_limits?: boolean;
}
