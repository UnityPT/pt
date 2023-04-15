/* tslint:disable */
/* eslint-disable */
export interface FileDto {

  /**
   * Percentage of file pieces currently available (percentage/100)
   */
  availability?: number;

  /**
   * True if file is seeding/complete
   */
  is_seed?: boolean;

  /**
   * File name (including relative path)
   */
  name?: string;

  /**
   * The first number is the starting piece index and the second number is the ending piece index (inclusive)
   */
  piece_range?: Array<number>;

  /**
   * File priority. See possible values here below
   */
  priority?: 0 | 1 | 6 | 7;

  /**
   * File progress (percentage/100)
   */
  progress?: number;

  /**
   * File size (bytes)
   */
  size?: number;
}
