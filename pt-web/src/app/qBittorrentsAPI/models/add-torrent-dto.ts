/* tslint:disable */
/* eslint-disable */
export interface AddTorrentDto {

  /**
   * Whether Automatic Torrent Management should be used
   */
  autoTMM?: boolean;

  /**
   * Category for the torrent
   */
  category?: string;

  /**
   * Cookie sent to download the .torrent file
   */
  cookie?: string;

  /**
   * Set torrent download speed limit. Unit in bytes/second
   */
  dlLimit?: number;

  /**
   * Prioritize download first last piece. Possible values are true, false (default)
   */
  firstLastPiecePrio?: string;

  /**
   * Add torrents in the paused state. Possible values are true, false (default)
   */
  paused?: string;

  /**
   * Set torrent share ratio limit
   */
  ratioLimit?: number;

  /**
   * Rename torrent
   */
  rename?: string;

  /**
   * Create the root folder. Possible values are true, false, unset (default)
   */
  root_folder?: string;

  /**
   * Download folder
   */
  savepath?: string;

  /**
   * Set torrent seeding time limit. Unit in minutes
   */
  seedingTimeLimit?: number;

  /**
   * Enable sequential download. Possible values are true, false (default)
   */
  sequentialDownload?: string;

  /**
   * Skip hash checking. Possible values are true, false (default)
   */
  skip_checking?: string;

  /**
   * Tags for the torrent, split by ','
   */
  tags?: string;

  /**
   * Raw data of torrent file. torrents can be presented multiple times.
   */
  torrents?: string;

  /**
   * Set torrent upload speed limit. Unit in bytes/second
   */
  upLimit?: number;

  /**
   * URLs separated with newlines
   */
  urls?: string;
}
