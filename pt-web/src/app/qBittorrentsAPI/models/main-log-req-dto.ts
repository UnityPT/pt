/* tslint:disable */
/* eslint-disable */
export interface MainLogReqDto {

  /**
   * Include critical messages
   */
  critical?: boolean;

  /**
   * Include info messages
   */
  info?: boolean;

  /**
   * Exclude messages with "message id" <= last_known_id
   */
  last_known_id?: number;

  /**
   * Include normal messages
   */
  normal?: boolean;

  /**
   * Include warning messages
   */
  warning?: boolean;
}
