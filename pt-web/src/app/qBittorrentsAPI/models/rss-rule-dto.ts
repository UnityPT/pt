/* tslint:disable */
/* eslint-disable */
export interface RssRuleDto {

  /**
   * Indicates whether to add matched torrent in paused mode.
   */
  addPaused?: boolean;

  /**
   * The list of feed URLs the rule applies to.
   */
  affectedFeeds?: Array<any>;

  /**
   * The category to assign to the torrent.
   */
  assignedCategory?: string;

  /**
   * Indicates whether the rule is enabled or not.
   */
  enabled?: boolean;

  /**
   * The definition of the episode filter.
   */
  episodeFilter?: string;

  /**
   * Ignore subsequent rule matches within the specified number of days.
   */
  ignoreDays?: number;

  /**
   * The last time the rule matched a torrent.
   */
  lastMatch?: string;

  /**
   * The substring that the torrent name must contain.
   */
  mustContain?: string;

  /**
   * The substring that the torrent name must not contain.
   */
  mustNotContain?: string;

  /**
   * The list of episode IDs already matched by smart filter.
   */
  previouslyMatchedEpisodes?: Array<any>;

  /**
   * The directory to save the torrent to.
   */
  savePath?: string;

  /**
   * Indicates whether to enable smart episode filter.
   */
  smartFilter?: boolean;

  /**
   * Indicates whether to enable regex mode in "mustContain" and "mustNotContain".
   */
  useRegex?: boolean;
}
