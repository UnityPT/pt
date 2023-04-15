/* tslint:disable */
/* eslint-disable */
export interface TorrentsInfoReqDto {

  /**
   * Get torrents with the given category (empty string means 'without category'; no 'category' parameter means 'any category'). Remember to URL-encode the category name. For example, My category becomes My%20category
   */
  category?: string;

  /**
   * Filter torrent list by state. Allowed state filters: all, downloading, seeding, completed, paused, active, inactive, resumed, stalled, stalled_uploading, stalled_downloading, errored
   */
  filter?: string;

  /**
   * Filter by hashes. Can contain multiple hashes separated by |
   */
  hashes?: string;

  /**
   * Limit the number of torrents returned
   */
  limit?: number;

  /**
   * Set offset (if less than 0, offset from end)
   */
  offset?: number;

  /**
   * The peer to ban, or multiple peers separated by a pipe |. Each peer is a colon-separated host:port
   */
  peers?: string;

  /**
   * Enable reverse sorting. Defaults to false
   */
  reverse?: bool;

  /**
   * Sort torrents by given key. They can be sorted using any field of the response's JSON array (which are documented below) as the sort key.
   */
  sort?: string;

  /**
   * Get torrents with the given tag (empty string means 'without tag'; no 'tag' parameter means 'any tag'. Remember to URL-encode the category name. For example, My tag becomes My%20tag
   */
  tag?: string;
}
