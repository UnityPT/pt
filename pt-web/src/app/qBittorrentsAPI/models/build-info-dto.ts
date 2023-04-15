/* tslint:disable */
/* eslint-disable */
export interface BuildInfoDto {

  /**
   * Bitness of the OS
   */
  bitness?: number;

  /**
   * Boost version
   */
  boost?: string;

  /**
   * libtorrent version
   */
  libtorrent?: string;

  /**
   * OpenSSL version
   */
  openssl?: string;

  /**
   * Qt version
   */
  qt?: string;
}
