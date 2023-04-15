/* tslint:disable */
/* eslint-disable */
export interface PeerLogDto {

  /**
   * Whether or not the peer was blocked
   */
  blocked?: boolean;

  /**
   * ID of the peer
   */
  id?: number;

  /**
   * IP of the peer
   */
  ip?: string;

  /**
   * Reason of the block
   */
  reason?: string;

  /**
   * Milliseconds since epoch
   */
  timestamp?: number;
}
