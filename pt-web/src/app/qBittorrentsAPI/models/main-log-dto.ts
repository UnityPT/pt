/* tslint:disable */
/* eslint-disable */
export interface MainLogDto {

  /**
   * ID of the message
   */
  id?: number;

  /**
   * Text of the message
   */
  message?: string;

  /**
   * Milliseconds since epoch
   */
  timestamp?: number;

  /**
   * Type of the message
   */
  type?: 1 | 2 | 4 | 8;
}
