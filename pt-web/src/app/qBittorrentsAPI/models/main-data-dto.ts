/* tslint:disable */
/* eslint-disable */
import { TorrentsInfoDto } from './torrents-info-dto';
export interface MainDataDto {

  /**
   * Info for categories added since last request
   */
  categories?: {
};

  /**
   * List of categories removed since last request
   */
  categories_removed?: Array<any>;

  /**
   * Whether the response contains all the data or partial data
   */
  full_update?: boolean;

  /**
   * Response ID
   */
  rid?: number;

  /**
   * Global transfer info
   */
  server_state?: {
};

  /**
   * List of tags added since last request
   */
  tags?: Array<any>;

  /**
   * List of tags removed since last request
   */
  tags_removed?: Array<any>;
  torrents?: {
[key: string]: TorrentsInfoDto;
};

  /**
   * List of hashes of torrents removed since last request
   */
  torrents_removed?: Array<any>;
}
