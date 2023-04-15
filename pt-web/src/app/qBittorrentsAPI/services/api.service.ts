/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AddTorrentDto } from '../models/add-torrent-dto';
import { BuildInfoDto } from '../models/build-info-dto';
import { FileDto } from '../models/file-dto';
import { LoginDto } from '../models/login-dto';
import { MainDataDto } from '../models/main-data-dto';
import { MainLogDto } from '../models/main-log-dto';
import { MainLogReqDto } from '../models/main-log-req-dto';
import { PeerLogDto } from '../models/peer-log-dto';
import { PreferencesDto } from '../models/preferences-dto';
import { RssRuleDto } from '../models/rss-rule-dto';
import { TorrentPropertiesDto } from '../models/torrent-properties-dto';
import { TorrentsInfoDto } from '../models/torrents-info-dto';
import { TorrentsInfoReqDto } from '../models/torrents-info-req-dto';
import { TrackerDto } from '../models/tracker-dto';
import { TransferInfoDto } from '../models/transfer-info-dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation login
   */
  static readonly LoginPath = '/api/v2/auth/login';

  /**
   * Login to qBittorrent WebUI.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login$Response(params?: {
    body?: LoginDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.LoginPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Login to qBittorrent WebUI.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `login$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login(params?: {
    body?: LoginDto
  },
  context?: HttpContext

): Observable<void> {

    return this.login$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation logout
   */
  static readonly LogoutPath = '/api/v2/auth/logout';

  /**
   * Logout from qBittorrent WebUI.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `logout()` instead.
   *
   * This method doesn't expect any request body.
   */
  logout$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.LogoutPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Logout from qBittorrent WebUI.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `logout$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  logout(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.logout$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation version
   */
  static readonly VersionPath = '/api/v2/app/version';

  /**
   * Get qBittorrent version.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `version()` instead.
   *
   * This method doesn't expect any request body.
   */
  version$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.VersionPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * Get qBittorrent version.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `version$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  version(params?: {
  },
  context?: HttpContext

): Observable<string> {

    return this.version$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation webApiVersion
   */
  static readonly WebApiVersionPath = '/api/v2/app/webapiVersion';

  /**
   * Get qBittorrent WebAPI version.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `webApiVersion()` instead.
   *
   * This method doesn't expect any request body.
   */
  webApiVersion$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.WebApiVersionPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * Get qBittorrent WebAPI version.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `webApiVersion$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  webApiVersion(params?: {
  },
  context?: HttpContext

): Observable<string> {

    return this.webApiVersion$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation buildInfo
   */
  static readonly BuildInfoPath = '/api/v2/app/buildInfo';

  /**
   * Get qBittorrent build info.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `buildInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  buildInfo$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BuildInfoDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.BuildInfoPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BuildInfoDto>;
      })
    );
  }

  /**
   * Get qBittorrent build info.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `buildInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  buildInfo(params?: {
  },
  context?: HttpContext

): Observable<BuildInfoDto> {

    return this.buildInfo$Response(params,context).pipe(
      map((r: StrictHttpResponse<BuildInfoDto>) => r.body as BuildInfoDto)
    );
  }

  /**
   * Path part for operation shutdown
   */
  static readonly ShutdownPath = '/api/v2/app/shutdown';

  /**
   * Shutdown qBittorrent.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `shutdown()` instead.
   *
   * This method doesn't expect any request body.
   */
  shutdown$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ShutdownPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Shutdown qBittorrent.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `shutdown$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  shutdown(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.shutdown$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation preferences
   */
  static readonly PreferencesPath = '/api/v2/app/preferences';

  /**
   * Get qBittorrent preferences.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `preferences()` instead.
   *
   * This method doesn't expect any request body.
   */
  preferences$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PreferencesDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PreferencesPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PreferencesDto>;
      })
    );
  }

  /**
   * Get qBittorrent preferences.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `preferences$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  preferences(params?: {
  },
  context?: HttpContext

): Observable<PreferencesDto> {

    return this.preferences$Response(params,context).pipe(
      map((r: StrictHttpResponse<PreferencesDto>) => r.body as PreferencesDto)
    );
  }

  /**
   * Path part for operation setPreferences
   */
  static readonly SetPreferencesPath = '/api/v2/app/setPreferences';

  /**
   * Set qBittorrent preferences.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setPreferences()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setPreferences$Response(params?: {
    body?: PreferencesDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetPreferencesPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set qBittorrent preferences.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setPreferences$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setPreferences(params?: {
    body?: PreferencesDto
  },
  context?: HttpContext

): Observable<void> {

    return this.setPreferences$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation defaultSavePath
   */
  static readonly DefaultSavePathPath = '/api/v2/app/defaultSavePath';

  /**
   * Get qBittorrent default save path.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `defaultSavePath()` instead.
   *
   * This method doesn't expect any request body.
   */
  defaultSavePath$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.DefaultSavePathPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * Get qBittorrent default save path.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `defaultSavePath$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  defaultSavePath(params?: {
  },
  context?: HttpContext

): Observable<string> {

    return this.defaultSavePath$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation main
   */
  static readonly MainPath = '/api/v2/log/main';

  /**
   * Get qBittorrent main log.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `main()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  main$Response(params?: {
    body?: MainLogReqDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<MainLogDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.MainPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MainLogDto>>;
      })
    );
  }

  /**
   * Get qBittorrent main log.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `main$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  main(params?: {
    body?: MainLogReqDto
  },
  context?: HttpContext

): Observable<Array<MainLogDto>> {

    return this.main$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<MainLogDto>>) => r.body as Array<MainLogDto>)
    );
  }

  /**
   * Path part for operation peer
   */
  static readonly PeerPath = '/api/v2/log/peer';

  /**
   * Get qBittorrent peer log.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `peer()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  peer$Response(params?: {
    body?: {

/**
 * Exclude messages with "message id" <= last_known_id
 */
'last_known_id'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<PeerLogDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PeerPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<PeerLogDto>>;
      })
    );
  }

  /**
   * Get qBittorrent peer log.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `peer$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  peer(params?: {
    body?: {

/**
 * Exclude messages with "message id" <= last_known_id
 */
'last_known_id'?: number;
}
  },
  context?: HttpContext

): Observable<Array<PeerLogDto>> {

    return this.peer$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<PeerLogDto>>) => r.body as Array<PeerLogDto>)
    );
  }

  /**
   * Path part for operation mainData
   */
  static readonly MainDataPath = '/api/v2/sync/maindata';

  /**
   * Get qBittorrent main data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `mainData()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  mainData$Response(params?: {
    body?: {

/**
 * Response ID. If not provided, rid=0 will be assumed. If the given rid is different from the one of last server reply, full_update will be true (see the server reply details for more info)
 */
'rid'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<MainDataDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.MainDataPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MainDataDto>;
      })
    );
  }

  /**
   * Get qBittorrent main data.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `mainData$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  mainData(params?: {
    body?: {

/**
 * Response ID. If not provided, rid=0 will be assumed. If the given rid is different from the one of last server reply, full_update will be true (see the server reply details for more info)
 */
'rid'?: number;
}
  },
  context?: HttpContext

): Observable<MainDataDto> {

    return this.mainData$Response(params,context).pipe(
      map((r: StrictHttpResponse<MainDataDto>) => r.body as MainDataDto)
    );
  }

  /**
   * Path part for operation torrentPeers
   */
  static readonly TorrentPeersPath = '/api/v2/sync/torrentPeers';

  /**
   * Get qBittorrent torrent peers.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `torrentPeers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  torrentPeers$Response(params?: {
    body?: {

/**
 * Torrent hash
 */
'hash'?: string;

/**
 * Response ID. If not provided, rid=0 will be assumed. If the given rid is different from the one of last server reply, full_update will be true (see the server reply details for more info)
 */
'rid'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.TorrentPeersPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Get qBittorrent torrent peers.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `torrentPeers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  torrentPeers(params?: {
    body?: {

/**
 * Torrent hash
 */
'hash'?: string;

/**
 * Response ID. If not provided, rid=0 will be assumed. If the given rid is different from the one of last server reply, full_update will be true (see the server reply details for more info)
 */
'rid'?: number;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.torrentPeers$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation transferInfo
   */
  static readonly TransferInfoPath = '/api/v2/transfer/info';

  /**
   * Get qBittorrent transfer info.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `transferInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  transferInfo$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<TransferInfoDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.TransferInfoPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TransferInfoDto>;
      })
    );
  }

  /**
   * Get qBittorrent transfer info.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `transferInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  transferInfo(params?: {
  },
  context?: HttpContext

): Observable<TransferInfoDto> {

    return this.transferInfo$Response(params,context).pipe(
      map((r: StrictHttpResponse<TransferInfoDto>) => r.body as TransferInfoDto)
    );
  }

  /**
   * Path part for operation speedLimitsMode
   */
  static readonly SpeedLimitsModePath = '/api/v2/transfer/speedLimitsMode';

  /**
   * Get qBittorrent transfer speed limits mode.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `speedLimitsMode()` instead.
   *
   * This method doesn't expect any request body.
   */
  speedLimitsMode$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<'1' | '0'>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SpeedLimitsModePath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<'1' | '0'>;
      })
    );
  }

  /**
   * Get qBittorrent transfer speed limits mode.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `speedLimitsMode$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  speedLimitsMode(params?: {
  },
  context?: HttpContext

): Observable<'1' | '0'> {

    return this.speedLimitsMode$Response(params,context).pipe(
      map((r: StrictHttpResponse<'1' | '0'>) => r.body as '1' | '0')
    );
  }

  /**
   * Path part for operation toggleSpeedLimitsMode
   */
  static readonly ToggleSpeedLimitsModePath = '/api/v2/transfer/toggleSpeedLimitsMode';

  /**
   * Toggle qBittorrent transfer speed limits mode.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `toggleSpeedLimitsMode()` instead.
   *
   * This method doesn't expect any request body.
   */
  toggleSpeedLimitsMode$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ToggleSpeedLimitsModePath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Toggle qBittorrent transfer speed limits mode.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `toggleSpeedLimitsMode$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  toggleSpeedLimitsMode(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.toggleSpeedLimitsMode$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation downloadLimit
   */
  static readonly DownloadLimitPath = '/api/v2/transfer/downloadLimit';

  /**
   * Get qBittorrent transfer download limit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `downloadLimit()` instead.
   *
   * This method doesn't expect any request body.
   */
  downloadLimit$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.DownloadLimitPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * Get qBittorrent transfer download limit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `downloadLimit$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  downloadLimit(params?: {
  },
  context?: HttpContext

): Observable<number> {

    return this.downloadLimit$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation setDownloadLimit
   */
  static readonly SetDownloadLimitPath = '/api/v2/transfer/setDownloadLimit';

  /**
   * Set qBittorrent transfer download limit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setDownloadLimit()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setDownloadLimit$Response(params?: {
    body?: {

/**
 * The global download speed limit to set in bytes/second
 */
'limit'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetDownloadLimitPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set qBittorrent transfer download limit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setDownloadLimit$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setDownloadLimit(params?: {
    body?: {

/**
 * The global download speed limit to set in bytes/second
 */
'limit'?: number;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setDownloadLimit$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation uploadLimit
   */
  static readonly UploadLimitPath = '/api/v2/transfer/uploadLimit';

  /**
   * Get qBittorrent transfer upload limit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadLimit()` instead.
   *
   * This method doesn't expect any request body.
   */
  uploadLimit$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.UploadLimitPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * Get qBittorrent transfer upload limit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadLimit$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  uploadLimit(params?: {
  },
  context?: HttpContext

): Observable<number> {

    return this.uploadLimit$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation setUploadLimit
   */
  static readonly SetUploadLimitPath = '/api/v2/transfer/setUploadLimit';

  /**
   * Set qBittorrent transfer upload limit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setUploadLimit()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setUploadLimit$Response(params?: {
    body?: {

/**
 * The global upload speed limit to set in bytes/second
 */
'limit'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetUploadLimitPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set qBittorrent transfer upload limit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setUploadLimit$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setUploadLimit(params?: {
    body?: {

/**
 * The global upload speed limit to set in bytes/second
 */
'limit'?: number;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setUploadLimit$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation banPeers
   */
  static readonly BanPeersPath = '/api/v2/transfer/banPeers';

  /**
   * Ban peers.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `banPeers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  banPeers$Response(params?: {
    body?: {

/**
 * The peer to ban,or multiple peers separated by a pipe |. Each peer is a colon-separated host:port
 */
'peers'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.BanPeersPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Ban peers.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `banPeers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  banPeers(params?: {
    body?: {

/**
 * The peer to ban,or multiple peers separated by a pipe |. Each peer is a colon-separated host:port
 */
'peers'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.banPeers$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation info
   */
  static readonly InfoPath = '/api/v2/torrents/info';

  /**
   * Get qBittorrent torrents info.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `info()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  info$Response(params?: {
    body?: TorrentsInfoReqDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<TorrentsInfoDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.InfoPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TorrentsInfoDto>>;
      })
    );
  }

  /**
   * Get qBittorrent torrents info.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `info$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  info(params?: {
    body?: TorrentsInfoReqDto
  },
  context?: HttpContext

): Observable<Array<TorrentsInfoDto>> {

    return this.info$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<TorrentsInfoDto>>) => r.body as Array<TorrentsInfoDto>)
    );
  }

  /**
   * Path part for operation properties
   */
  static readonly PropertiesPath = '/api/v2/torrents/properties';

  /**
   * Get qBittorrent torrent properties.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `properties()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  properties$Response(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the generic properties of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<TorrentPropertiesDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PropertiesPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TorrentPropertiesDto>;
      })
    );
  }

  /**
   * Get qBittorrent torrent properties.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `properties$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  properties(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the generic properties of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<TorrentPropertiesDto> {

    return this.properties$Response(params,context).pipe(
      map((r: StrictHttpResponse<TorrentPropertiesDto>) => r.body as TorrentPropertiesDto)
    );
  }

  /**
   * Path part for operation trackers
   */
  static readonly TrackersPath = '/api/v2/torrents/trackers';

  /**
   * Get qBittorrent torrent trackers.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `trackers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  trackers$Response(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the trackers of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<TrackerDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.TrackersPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TrackerDto>>;
      })
    );
  }

  /**
   * Get qBittorrent torrent trackers.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `trackers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  trackers(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the trackers of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<Array<TrackerDto>> {

    return this.trackers$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<TrackerDto>>) => r.body as Array<TrackerDto>)
    );
  }

  /**
   * Path part for operation webSeeds
   */
  static readonly WebSeedsPath = '/api/v2/torrents/webseeds';

  /**
   * Get qBittorrent torrent web seeds.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `webSeeds()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  webSeeds$Response(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the webseeds of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<{

/**
 * The URL of the webseed
 */
'url'?: string;
}>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.WebSeedsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<{
        
        /**
         * The URL of the webseed
         */
        'url'?: string;
        }>>;
      })
    );
  }

  /**
   * Get qBittorrent torrent web seeds.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `webSeeds$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  webSeeds(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the webseeds of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<Array<{

/**
 * The URL of the webseed
 */
'url'?: string;
}>> {

    return this.webSeeds$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<{

/**
 * The URL of the webseed
 */
'url'?: string;
}>>) => r.body as Array<{

/**
 * The URL of the webseed
 */
'url'?: string;
}>)
    );
  }

  /**
   * Path part for operation files
   */
  static readonly FilesPath = '/api/v2/torrents/files';

  /**
   * Get torrent contents.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `files()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  files$Response(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the contents of
 */
'hash'?: string;

/**
 * The indexes of the files you want to retrieve. indexes can contain multiple values separated by |.
 */
'index'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<FileDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FilesPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FileDto>>;
      })
    );
  }

  /**
   * Get torrent contents.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `files$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  files(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the contents of
 */
'hash'?: string;

/**
 * The indexes of the files you want to retrieve. indexes can contain multiple values separated by |.
 */
'index'?: string;
}
  },
  context?: HttpContext

): Observable<Array<FileDto>> {

    return this.files$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<FileDto>>) => r.body as Array<FileDto>)
    );
  }

  /**
   * Path part for operation pieceStates
   */
  static readonly PieceStatesPath = '/api/v2/torrents/pieceStates';

  /**
   * Get torrent piece states.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `pieceStates()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  pieceStates$Response(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the pieces' states of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<0 | 1 | 2>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PieceStatesPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<0 | 1 | 2>>;
      })
    );
  }

  /**
   * Get torrent piece states.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `pieceStates$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  pieceStates(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the pieces' states of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<Array<0 | 1 | 2>> {

    return this.pieceStates$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<0 | 1 | 2>>) => r.body as Array<0 | 1 | 2>)
    );
  }

  /**
   * Path part for operation pieceHashes
   */
  static readonly PieceHashesPath = '/api/v2/torrents/pieceHashes';

  /**
   * Get torrent pieces' hashes.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `pieceHashes()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  pieceHashes$Response(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the pieces' hashes of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<string>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PieceHashesPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<string>>;
      })
    );
  }

  /**
   * Get torrent pieces' hashes.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `pieceHashes$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  pieceHashes(params?: {
    body?: {

/**
 * The hash of the torrent you want to get the pieces' hashes of
 */
'hash'?: string;
}
  },
  context?: HttpContext

): Observable<Array<string>> {

    return this.pieceHashes$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<string>>) => r.body as Array<string>)
    );
  }

  /**
   * Path part for operation pause
   */
  static readonly PausePath = '/api/v2/torrents/pause';

  /**
   * Pause torrents.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `pause()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  pause$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to pause. hashes can contain multiple hashes separated by |, to pause multiple torrents, or set to all, to pause all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PausePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Pause torrents.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `pause$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  pause(params?: {
    body?: {

/**
 * The hashes of the torrents you want to pause. hashes can contain multiple hashes separated by |, to pause multiple torrents, or set to all, to pause all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.pause$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation resume
   */
  static readonly ResumePath = '/api/v2/torrents/resume';

  /**
   * Resume torrents.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `resume()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  resume$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to resume. hashes can contain multiple hashes separated by |, to resume multiple torrents, or set to all, to resume all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ResumePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Resume torrents.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `resume$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  resume(params?: {
    body?: {

/**
 * The hashes of the torrents you want to resume. hashes can contain multiple hashes separated by |, to resume multiple torrents, or set to all, to resume all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.resume$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation delete
   */
  static readonly DeletePath = '/api/v2/torrents/delete';

  /**
   * Delete torrents.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `delete()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  delete$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to delete. hashes can contain multiple hashes separated by |, to delete multiple torrents, or set to all, to delete all torrents.
 */
'hashes'?: string;

/**
 * If set to true, the downloaded data will also be deleted, otherwise has no effect.
 */
'deletFiles'?: boolean;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.DeletePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Delete torrents.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `delete$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  delete(params?: {
    body?: {

/**
 * The hashes of the torrents you want to delete. hashes can contain multiple hashes separated by |, to delete multiple torrents, or set to all, to delete all torrents.
 */
'hashes'?: string;

/**
 * If set to true, the downloaded data will also be deleted, otherwise has no effect.
 */
'deletFiles'?: boolean;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.delete$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation recheck
   */
  static readonly RecheckPath = '/api/v2/torrents/recheck';

  /**
   * Recheck torrents.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `recheck()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  recheck$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to recheck. hashes can contain multiple hashes separated by |, to recheck multiple torrents, or set to all, to recheck all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RecheckPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Recheck torrents.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `recheck$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  recheck(params?: {
    body?: {

/**
 * The hashes of the torrents you want to recheck. hashes can contain multiple hashes separated by |, to recheck multiple torrents, or set to all, to recheck all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.recheck$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation reannounce
   */
  static readonly ReannouncePath = '/api/v2/torrents/reannounce';

  /**
   * Reannounce torrents.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reannounce()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  reannounce$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to reannounce. hashes can contain multiple hashes separated by |, to reannounce multiple torrents, or set to all, to reannounce all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ReannouncePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Reannounce torrents.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `reannounce$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  reannounce(params?: {
    body?: {

/**
 * The hashes of the torrents you want to reannounce. hashes can contain multiple hashes separated by |, to reannounce multiple torrents, or set to all, to reannounce all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.reannounce$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation add
   */
  static readonly AddPath = '/api/v2/torrents/add';

  /**
   * Add new torrent.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `add()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  add$Response(params: {
    body: AddTorrentDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AddPath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add new torrent.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `add$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  add(params: {
    body: AddTorrentDto
  },
  context?: HttpContext

): Observable<void> {

    return this.add$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addTrackers
   */
  static readonly AddTrackersPath = '/api/v2/torrents/addTrackers';

  /**
   * Add trackers to torrent.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addTrackers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addTrackers$Response(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The URLs of the trackers you want to add.
 */
'urls'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AddTrackersPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add trackers to torrent.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addTrackers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addTrackers(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The URLs of the trackers you want to add.
 */
'urls'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.addTrackers$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation editTracker
   */
  static readonly EditTrackerPath = '/api/v2/torrents/editTracker';

  /**
   * Edit tracker of torrent.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `editTracker()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editTracker$Response(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The tracker URL you want to edit
 */
'origUrl'?: string;

/**
 * The new URL to replace the origUrl
 */
'newUrl'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.EditTrackerPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Edit tracker of torrent.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `editTracker$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editTracker(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The tracker URL you want to edit
 */
'origUrl'?: string;

/**
 * The new URL to replace the origUrl
 */
'newUrl'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.editTracker$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeTrackers
   */
  static readonly RemoveTrackersPath = '/api/v2/torrents/removeTrackers';

  /**
   * Remove trackers.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeTrackers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeTrackers$Response(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * URLs to remove, separated by |
 */
'urls'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RemoveTrackersPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Remove trackers.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `removeTrackers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeTrackers(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * URLs to remove, separated by |
 */
'urls'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.removeTrackers$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addPeers
   */
  static readonly AddPeersPath = '/api/v2/torrents/addPeers';

  /**
   * Add peers to torrent.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addPeers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addPeers$Response(params?: {
    body?: {

/**
 * The hash of the torrent, or multiple hashes separated by a pipe |
 */
'hashes'?: string;

/**
 * The peer to add, or multiple peers separated by a pipe |. Each peer is a colon-separated
 */
'peers'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AddPeersPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add peers to torrent.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addPeers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addPeers(params?: {
    body?: {

/**
 * The hash of the torrent, or multiple hashes separated by a pipe |
 */
'hashes'?: string;

/**
 * The peer to add, or multiple peers separated by a pipe |. Each peer is a colon-separated
 */
'peers'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.addPeers$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation increasePrio
   */
  static readonly IncreasePrioPath = '/api/v2/torrents/increasePrio';

  /**
   * Increase torrent priority.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `increasePrio()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  increasePrio$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to increase the priority of. hashes can contain multiple hashes separated by |, to increase the priority of multiple torrents, or set to all, to increase the priority of all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.IncreasePrioPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Increase torrent priority.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `increasePrio$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  increasePrio(params?: {
    body?: {

/**
 * The hashes of the torrents you want to increase the priority of. hashes can contain multiple hashes separated by |, to increase the priority of multiple torrents, or set to all, to increase the priority of all torrents.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.increasePrio$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation topPrio
   */
  static readonly TopPrioPath = '/api/v2/torrents/topPrio';

  /**
   * Set torrent priority to top.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `topPrio()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  topPrio$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to set to the maximum priority. hashes can contain multiple hashes separated by |, to set multiple torrents to the maximum priority, or set to all, to set all torrents to the maximum priority.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.TopPrioPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set torrent priority to top.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `topPrio$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  topPrio(params?: {
    body?: {

/**
 * The hashes of the torrents you want to set to the maximum priority. hashes can contain multiple hashes separated by |, to set multiple torrents to the maximum priority, or set to all, to set all torrents to the maximum priority.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.topPrio$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation bottomPrio
   */
  static readonly BottomPrioPath = '/api/v2/torrents/bottomPrio';

  /**
   * Set torrent priority to bottom.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `bottomPrio()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  bottomPrio$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to set to the minimum priority. hashes can contain multiple hashes separated by |, to set multiple torrents to the minimum priority, or set to all, to set all torrents to the minimum priority.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.BottomPrioPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set torrent priority to bottom.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `bottomPrio$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  bottomPrio(params?: {
    body?: {

/**
 * The hashes of the torrents you want to set to the minimum priority. hashes can contain multiple hashes separated by |, to set multiple torrents to the minimum priority, or set to all, to set all torrents to the minimum priority.
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.bottomPrio$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation filePrio
   */
  static readonly FilePrioPath = '/api/v2/torrents/filePrio';

  /**
   * Set file priority.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `filePrio()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  filePrio$Response(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hashes'?: string;

/**
 * File ids, separated by |
 */
'id'?: string;

/**
 * File priority to set (consult torrent contents API for possible values)
 */
'priority'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FilePrioPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set file priority.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `filePrio$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  filePrio(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hashes'?: string;

/**
 * File ids, separated by |
 */
'id'?: string;

/**
 * File priority to set (consult torrent contents API for possible values)
 */
'priority'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.filePrio$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation torrentsDownloadLimit
   */
  static readonly TorrentsDownloadLimitPath = '/api/v2/torrents/downloadLimit';

  /**
   * Set torrent download limit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `torrentsDownloadLimit()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  torrentsDownloadLimit$Response(params?: {
    body?: {

/**
 * can contain multiple hashes separated by | or set to all
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
[key: string]: number;
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.TorrentsDownloadLimitPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        [key: string]: number;
        }>;
      })
    );
  }

  /**
   * Set torrent download limit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `torrentsDownloadLimit$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  torrentsDownloadLimit(params?: {
    body?: {

/**
 * can contain multiple hashes separated by | or set to all
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<{
[key: string]: number;
}> {

    return this.torrentsDownloadLimit$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
[key: string]: number;
}>) => r.body as {
[key: string]: number;
})
    );
  }

  /**
   * Path part for operation setTorrentsDownloadLimit
   */
  static readonly SetTorrentsDownloadLimitPath = '/api/v2/torrents/setDownloadLimit';

  /**
   * Set torrent download limit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setTorrentsDownloadLimit()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setTorrentsDownloadLimit$Response(params?: {
    body?: {

/**
 * The hashes of the torrents you want to set the download limit of. hashes can contain multiple hashes separated by |, to set the download limit of multiple torrents, or set to all, to set the download limit of all torrents.
 */
'hashes'?: string;

/**
 * the download speed limit in bytes per second you want to set.
 */
'limit'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetTorrentsDownloadLimitPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set torrent download limit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setTorrentsDownloadLimit$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setTorrentsDownloadLimit(params?: {
    body?: {

/**
 * The hashes of the torrents you want to set the download limit of. hashes can contain multiple hashes separated by |, to set the download limit of multiple torrents, or set to all, to set the download limit of all torrents.
 */
'hashes'?: string;

/**
 * the download speed limit in bytes per second you want to set.
 */
'limit'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setTorrentsDownloadLimit$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setShareLimits
   */
  static readonly SetShareLimitsPath = '/api/v2/torrents/setShareLimits';

  /**
   * Set torrent share limits.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setShareLimits()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setShareLimits$Response(params?: {
    body?: {
'hashes'?: string;
'ratioLimit'?: string;
'seedingTimeLimit'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetShareLimitsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set torrent share limits.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setShareLimits$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setShareLimits(params?: {
    body?: {
'hashes'?: string;
'ratioLimit'?: string;
'seedingTimeLimit'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setShareLimits$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation torrentsUploadLimit
   */
  static readonly TorrentsUploadLimitPath = '/api/v2/torrents/uploadLimit';

  /**
   * Set torrent upload limit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `torrentsUploadLimit()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  torrentsUploadLimit$Response(params?: {
    body?: {

/**
 * can contain multiple hashes separated by | or set to all
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
[key: string]: number;
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.TorrentsUploadLimitPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        [key: string]: number;
        }>;
      })
    );
  }

  /**
   * Set torrent upload limit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `torrentsUploadLimit$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  torrentsUploadLimit(params?: {
    body?: {

/**
 * can contain multiple hashes separated by | or set to all
 */
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<{
[key: string]: number;
}> {

    return this.torrentsUploadLimit$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
[key: string]: number;
}>) => r.body as {
[key: string]: number;
})
    );
  }

  /**
   * Path part for operation setLocation
   */
  static readonly SetLocationPath = '/api/v2/torrents/setLocation';

  /**
   * Set torrent location.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setLocation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setLocation$Response(params?: {
    body?: {
'hashes'?: string;

/**
 * the location to download the torrent to. If the location doesn't exist, the torrent's location is unchanged.
 */
'location'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetLocationPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set torrent location.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setLocation$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setLocation(params?: {
    body?: {
'hashes'?: string;

/**
 * the location to download the torrent to. If the location doesn't exist, the torrent's location is unchanged.
 */
'location'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setLocation$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation rename
   */
  static readonly RenamePath = '/api/v2/torrents/rename';

  /**
   * Set torrent name.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rename()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  rename$Response(params?: {
    body?: {
'hashes'?: string;
'name'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RenamePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set torrent name.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `rename$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  rename(params?: {
    body?: {
'hashes'?: string;
'name'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.rename$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setCategory
   */
  static readonly SetCategoryPath = '/api/v2/torrents/setCategory';

  /**
   * Set torrent category.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setCategory$Response(params?: {
    body?: {
'hashes'?: string;
'category'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetCategoryPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set torrent category.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setCategory(params?: {
    body?: {
'hashes'?: string;
'category'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setCategory$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation categories
   */
  static readonly CategoriesPath = '/api/v2/torrents/categories';

  /**
   * Get all categories.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `categories()` instead.
   *
   * This method doesn't expect any request body.
   */
  categories$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
[key: string]: {
};
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.CategoriesPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        [key: string]: {
        };
        }>;
      })
    );
  }

  /**
   * Get all categories.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `categories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  categories(params?: {
  },
  context?: HttpContext

): Observable<{
[key: string]: {
};
}> {

    return this.categories$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
[key: string]: {
};
}>) => r.body as {
[key: string]: {
};
})
    );
  }

  /**
   * Path part for operation createCategory
   */
  static readonly CreateCategoryPath = '/api/v2/torrents/createCategory';

  /**
   * Add new category.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCategory$Response(params?: {
    body?: {
'category'?: string;
'savePath'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.CreateCategoryPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add new category.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCategory(params?: {
    body?: {
'category'?: string;
'savePath'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.createCategory$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation editCategory
   */
  static readonly EditCategoryPath = '/api/v2/torrents/editCategory';

  /**
   * Edit category.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `editCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editCategory$Response(params?: {
    body?: {
'category'?: string;
'savePath'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.EditCategoryPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Edit category.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `editCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editCategory(params?: {
    body?: {
'category'?: string;
'savePath'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.editCategory$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeCategories
   */
  static readonly RemoveCategoriesPath = '/api/v2/torrents/removeCategories';

  /**
   * Remove categories.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeCategories()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeCategories$Response(params?: {
    body?: {

/**
 * can contain multiple cateogies separated by \n
 */
'categories'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RemoveCategoriesPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Remove categories.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `removeCategories$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeCategories(params?: {
    body?: {

/**
 * can contain multiple cateogies separated by \n
 */
'categories'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.removeCategories$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addTags
   */
  static readonly AddTagsPath = '/api/v2/torrents/addTags';

  /**
   * Add tags to torrent.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addTags()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addTags$Response(params?: {
    body?: {
'hashes'?: string;
'tags'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AddTagsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add tags to torrent.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addTags$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addTags(params?: {
    body?: {
'hashes'?: string;
'tags'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.addTags$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeTags
   */
  static readonly RemoveTagsPath = '/api/v2/torrents/removeTags';

  /**
   * Remove tags from torrent.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeTags()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeTags$Response(params?: {
    body?: {
'hashes'?: string;
'tags'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RemoveTagsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Remove tags from torrent.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `removeTags$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeTags(params?: {
    body?: {
'hashes'?: string;
'tags'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.removeTags$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation tags
   */
  static readonly TagsPath = '/api/v2/torrents/tags';

  /**
   * Get all tags.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tags()` instead.
   *
   * This method doesn't expect any request body.
   */
  tags$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.TagsPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * Get all tags.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tags$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tags(params?: {
  },
  context?: HttpContext

): Observable<string> {

    return this.tags$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation createTags
   */
  static readonly CreateTagsPath = '/api/v2/torrents/createTags';

  /**
   * Create tags.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createTags()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTags$Response(params?: {
    body?: {

/**
 * a list of tags you want to create. Can contain multiple tags separated by ','
 */
'tags'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.CreateTagsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Create tags.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createTags$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTags(params?: {
    body?: {

/**
 * a list of tags you want to create. Can contain multiple tags separated by ','
 */
'tags'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.createTags$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setAutoManagement
   */
  static readonly SetAutoManagementPath = '/api/v2/torrents/setAutoManagement';

  /**
   * Set auto management.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setAutoManagement()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setAutoManagement$Response(params?: {
    body?: {
'hashes'?: string;
'enable'?: boolean;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetAutoManagementPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set auto management.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setAutoManagement$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setAutoManagement(params?: {
    body?: {
'hashes'?: string;
'enable'?: boolean;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setAutoManagement$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation toggleSequentialDownload
   */
  static readonly ToggleSequentialDownloadPath = '/api/v2/torrents/toggleSequentialDownload';

  /**
   * Toggle sequential download.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `toggleSequentialDownload()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  toggleSequentialDownload$Response(params?: {
    body?: {
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ToggleSequentialDownloadPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Toggle sequential download.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `toggleSequentialDownload$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  toggleSequentialDownload(params?: {
    body?: {
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.toggleSequentialDownload$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation toggleFirstLastPiecePrio
   */
  static readonly ToggleFirstLastPiecePrioPath = '/api/v2/torrents/toggleFirstLastPiecePrio';

  /**
   * Toggle first last piece priority.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `toggleFirstLastPiecePrio()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  toggleFirstLastPiecePrio$Response(params?: {
    body?: {
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ToggleFirstLastPiecePrioPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Toggle first last piece priority.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `toggleFirstLastPiecePrio$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  toggleFirstLastPiecePrio(params?: {
    body?: {
'hashes'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.toggleFirstLastPiecePrio$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setForceStart
   */
  static readonly SetForceStartPath = '/api/v2/torrents/setForceStart';

  /**
   * Set force start.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setForceStart()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setForceStart$Response(params?: {
    body?: {
'hashes'?: string;
'value'?: boolean;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetForceStartPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set force start.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setForceStart$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setForceStart(params?: {
    body?: {
'hashes'?: string;
'value'?: boolean;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setForceStart$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setSuperSeeding
   */
  static readonly SetSuperSeedingPath = '/api/v2/torrents/setSuperSeeding';

  /**
   * Set super seeding.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setSuperSeeding()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setSuperSeeding$Response(params?: {
    body?: {
'hashes'?: string;
'value'?: boolean;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetSuperSeedingPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set super seeding.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setSuperSeeding$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setSuperSeeding(params?: {
    body?: {
'hashes'?: string;
'value'?: boolean;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setSuperSeeding$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation renameFile
   */
  static readonly RenameFilePath = '/api/v2/torrents/renameFile';

  /**
   * Rename file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `renameFile$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  renameFile$Json$Response(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The old name of the file
 */
'oldPath'?: string;

/**
 * The new name of the file
 */
'newPath'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RenameFilePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Rename file.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `renameFile$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  renameFile$Json(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The old name of the file
 */
'oldPath'?: string;

/**
 * The new name of the file
 */
'newPath'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.renameFile$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Rename file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `renameFile$Responses()` instead.
   *
   * This method sends `responses` and handles request body of type `responses`.
   */
  renameFile$Responses$Response(params?: {
    body?: any
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RenameFilePath, 'post');
    if (params) {
      rb.body(params.body, 'responses');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Rename file.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `renameFile$Responses$Response()` instead.
   *
   * This method sends `responses` and handles request body of type `responses`.
   */
  renameFile$Responses(params?: {
    body?: any
  },
  context?: HttpContext

): Observable<void> {

    return this.renameFile$Responses$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation renameFolder
   */
  static readonly RenameFolderPath = '/api/v2/torrents/renameFolder';

  /**
   * Rename folder.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `renameFolder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  renameFolder$Response(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The old path of the torrent
 */
'oldPath'?: string;

/**
 * The new path to use for the file
 */
'newPath'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RenameFolderPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Rename folder.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `renameFolder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  renameFolder(params?: {
    body?: {

/**
 * The hash of the torrent
 */
'hash'?: string;

/**
 * The old path of the torrent
 */
'oldPath'?: string;

/**
 * The new path to use for the file
 */
'newPath'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.renameFolder$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addRssFolder
   */
  static readonly AddRssFolderPath = '/api/v2/rss/addFolder';

  /**
   * Add RSS folder.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addRssFolder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addRssFolder$Response(params?: {
    body?: {

/**
 * Current full path of added folder (e.g. "The Pirate Bay\Top100")
 */
'path'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AddRssFolderPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add RSS folder.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addRssFolder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addRssFolder(params?: {
    body?: {

/**
 * Current full path of added folder (e.g. "The Pirate Bay\Top100")
 */
'path'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.addRssFolder$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addRssFeed
   */
  static readonly AddRssFeedPath = '/api/v2/rss/addFeed';

  /**
   * Add RSS feed.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addRssFeed()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addRssFeed$Response(params?: {
    body?: {

/**
 * URL of the RSS feed
 */
'url'?: string;

/**
 * Current full path of added feed (e.g. "The Pirate Bay\Top100")
 */
'path'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AddRssFeedPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add RSS feed.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addRssFeed$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addRssFeed(params?: {
    body?: {

/**
 * URL of the RSS feed
 */
'url'?: string;

/**
 * Current full path of added feed (e.g. "The Pirate Bay\Top100")
 */
'path'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.addRssFeed$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeRssItem
   */
  static readonly RemoveRssItemPath = '/api/v2/rss/removeItem';

  /**
   * Remove RSS item.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeRssItem()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeRssItem$Response(params?: {
    body?: {

/**
 * Current full path of removed item (e.g. "The Pirate Bay\Top100")
 */
'path'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RemoveRssItemPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Remove RSS item.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `removeRssItem$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeRssItem(params?: {
    body?: {

/**
 * Current full path of removed item (e.g. "The Pirate Bay\Top100")
 */
'path'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.removeRssItem$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation moveRssItem
   */
  static readonly MoveRssItemPath = '/api/v2/rss/moveItem';

  /**
   * Move RSS item.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `moveRssItem()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  moveRssItem$Response(params?: {
    body?: {

/**
 * Current full path of item (e.g. "The Pirate Bay\Top100")
 */
'itemPath'?: string;

/**
 * New full path of item (e.g. "The Pirate Bay")
 */
'destPath'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.MoveRssItemPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Move RSS item.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `moveRssItem$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  moveRssItem(params?: {
    body?: {

/**
 * Current full path of item (e.g. "The Pirate Bay\Top100")
 */
'itemPath'?: string;

/**
 * New full path of item (e.g. "The Pirate Bay")
 */
'destPath'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.moveRssItem$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation items
   */
  static readonly ItemsPath = '/api/v2/rss/items';

  /**
   * Get all items.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `items()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  items$Response(params?: {
    body?: {

/**
 * True if you want to get the data of the items
 */
'withData'?: boolean;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ItemsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        }>;
      })
    );
  }

  /**
   * Get all items.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `items$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  items(params?: {
    body?: {

/**
 * True if you want to get the data of the items
 */
'withData'?: boolean;
}
  },
  context?: HttpContext

): Observable<{
}> {

    return this.items$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation markAsRead
   */
  static readonly MarkAsReadPath = '/api/v2/rss/markAsRead';

  /**
   * Mark item as read.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `markAsRead()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  markAsRead$Response(params?: {
    body?: {

/**
 * Current full path of item (e.g. "The Pirate Bay\Top100")
 */
'itemPath'?: string;

/**
 * ID of article
 */
'articleId'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.MarkAsReadPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Mark item as read.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `markAsRead$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  markAsRead(params?: {
    body?: {

/**
 * Current full path of item (e.g. "The Pirate Bay\Top100")
 */
'itemPath'?: string;

/**
 * ID of article
 */
'articleId'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.markAsRead$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation refreshItem
   */
  static readonly RefreshItemPath = '/api/v2/rss/refreshItem';

  /**
   * Refresh item.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `refreshItem()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  refreshItem$Response(params?: {
    body?: {

/**
 * Current full path of item (e.g. "The Pirate Bay\Top100")
 */
'itemPath'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RefreshItemPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Refresh item.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `refreshItem$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  refreshItem(params?: {
    body?: {

/**
 * Current full path of item (e.g. "The Pirate Bay\Top100")
 */
'itemPath'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.refreshItem$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setRssRule
   */
  static readonly SetRssRulePath = '/api/v2/rss/setRule';

  /**
   * Set auto-downloading rule.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setRssRule()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setRssRule$Response(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;

/**
 * JSON encoded rule definition
 */
'ruleDef'?: {
};
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SetRssRulePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set auto-downloading rule.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `setRssRule$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setRssRule(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;

/**
 * JSON encoded rule definition
 */
'ruleDef'?: {
};
}
  },
  context?: HttpContext

): Observable<void> {

    return this.setRssRule$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation renameRssRule
   */
  static readonly RenameRssRulePath = '/api/v2/rss/renameRule';

  /**
   * Rename auto-downloading rule.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `renameRssRule()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  renameRssRule$Response(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;

/**
 * New rule name (e.g. "Punisher")
 */
'newRulesName'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RenameRssRulePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Rename auto-downloading rule.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `renameRssRule$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  renameRssRule(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;

/**
 * New rule name (e.g. "Punisher")
 */
'newRulesName'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.renameRssRule$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeRssRule
   */
  static readonly RemoveRssRulePath = '/api/v2/rss/removeRule';

  /**
   * Remove auto-downloading rule.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeRssRule()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeRssRule$Response(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RemoveRssRulePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Remove auto-downloading rule.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `removeRssRule$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  removeRssRule(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.removeRssRule$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation rules
   */
  static readonly RulesPath = '/api/v2/rss/rules';

  /**
   * Get all auto-downloading rules.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rules()` instead.
   *
   * This method doesn't expect any request body.
   */
  rules$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RssRuleDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.RulesPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RssRuleDto>;
      })
    );
  }

  /**
   * Get all auto-downloading rules.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `rules$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  rules(params?: {
  },
  context?: HttpContext

): Observable<RssRuleDto> {

    return this.rules$Response(params,context).pipe(
      map((r: StrictHttpResponse<RssRuleDto>) => r.body as RssRuleDto)
    );
  }

  /**
   * Path part for operation matchingArticles
   */
  static readonly MatchingArticlesPath = '/api/v2/rss/matchingArticles';

  /**
   * Get all matching articles.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `matchingArticles()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  matchingArticles$Response(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.MatchingArticlesPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        }>;
      })
    );
  }

  /**
   * Get all matching articles.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `matchingArticles$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  matchingArticles(params?: {
    body?: {

/**
 * Rule name (e.g. "Punisher")
 */
'ruleName'?: string;
}
  },
  context?: HttpContext

): Observable<{
}> {

    return this.matchingArticles$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation start
   */
  static readonly StartPath = '/api/v2/search/start';

  /**
   * Start search.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `start()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  start$Response(params?: {
    body?: {

/**
 * Search pattern (e.g. "Ubuntu")
 */
'pattern'?: string;

/**
 * Search category (e.g. "all")
 */
'category'?: string;

/**
 * Search plugins (e.g. "all")
 */
'plugins'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{

/**
 * Search ID
 */
'id'?: number;
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.StartPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        
        /**
         * Search ID
         */
        'id'?: number;
        }>;
      })
    );
  }

  /**
   * Start search.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `start$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  start(params?: {
    body?: {

/**
 * Search pattern (e.g. "Ubuntu")
 */
'pattern'?: string;

/**
 * Search category (e.g. "all")
 */
'category'?: string;

/**
 * Search plugins (e.g. "all")
 */
'plugins'?: string;
}
  },
  context?: HttpContext

): Observable<{

/**
 * Search ID
 */
'id'?: number;
}> {

    return this.start$Response(params,context).pipe(
      map((r: StrictHttpResponse<{

/**
 * Search ID
 */
'id'?: number;
}>) => r.body as {

/**
 * Search ID
 */
'id'?: number;
})
    );
  }

  /**
   * Path part for operation stop
   */
  static readonly StopPath = '/api/v2/search/stop';

  /**
   * Stop search.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stop()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stop$Response(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.StopPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Stop search.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stop$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stop(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.stop$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation status
   */
  static readonly StatusPath = '/api/v2/search/status';

  /**
   * Get search status.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `status()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  status$Response(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.StatusPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Get search status.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `status$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  status(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.status$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation results
   */
  static readonly ResultsPath = '/api/v2/search/results';

  /**
   * Get search results.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `results()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  results$Response(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;

/**
 * Maximum number of results to return
 */
'limit'?: number;

/**
 * Offset of the first result to return
 */
'offset'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
'results'?: Array<any>;

/**
 * Current status of the search job (either Running or Stopped)
 */
'status'?: string;

/**
 * Total number of results. If the status is Running this number may contineu to increase
 */
'total'?: number;
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ResultsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'results'?: Array<any>;
        
        /**
         * Current status of the search job (either Running or Stopped)
         */
        'status'?: string;
        
        /**
         * Total number of results. If the status is Running this number may contineu to increase
         */
        'total'?: number;
        }>;
      })
    );
  }

  /**
   * Get search results.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `results$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  results(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;

/**
 * Maximum number of results to return
 */
'limit'?: number;

/**
 * Offset of the first result to return
 */
'offset'?: number;
}
  },
  context?: HttpContext

): Observable<{
'results'?: Array<any>;

/**
 * Current status of the search job (either Running or Stopped)
 */
'status'?: string;

/**
 * Total number of results. If the status is Running this number may contineu to increase
 */
'total'?: number;
}> {

    return this.results$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
'results'?: Array<any>;

/**
 * Current status of the search job (either Running or Stopped)
 */
'status'?: string;

/**
 * Total number of results. If the status is Running this number may contineu to increase
 */
'total'?: number;
}>) => r.body as {
'results'?: Array<any>;

/**
 * Current status of the search job (either Running or Stopped)
 */
'status'?: string;

/**
 * Total number of results. If the status is Running this number may contineu to increase
 */
'total'?: number;
})
    );
  }

  /**
   * Path part for operation searchDelete
   */
  static readonly SearchDeletePath = '/api/v2/search/delete';

  /**
   * Delete search.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `searchDelete()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  searchDelete$Response(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.SearchDeletePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Delete search.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `searchDelete$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  searchDelete(params?: {
    body?: {

/**
 * Search ID
 */
'id'?: number;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.searchDelete$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation plugins
   */
  static readonly PluginsPath = '/api/v2/search/plugins';

  /**
   * Get search plugins.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `plugins()` instead.
   *
   * This method doesn't expect any request body.
   */
  plugins$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PluginsPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Get search plugins.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `plugins$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  plugins(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.plugins$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation installPlugin
   */
  static readonly InstallPluginPath = '/api/v2/search/installPlugin';

  /**
   * Get search categories.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `installPlugin()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  installPlugin$Response(params?: {
    body?: {

/**
 * Url or file path of the plugin to install (e.g. "https://raw.githubusercontent.com/qbittorrent/search-plugins/master/nova3/engines/legittorrents.py"). Supports multiple sources separated by |
 */
'sources'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.InstallPluginPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Get search categories.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `installPlugin$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  installPlugin(params?: {
    body?: {

/**
 * Url or file path of the plugin to install (e.g. "https://raw.githubusercontent.com/qbittorrent/search-plugins/master/nova3/engines/legittorrents.py"). Supports multiple sources separated by |
 */
'sources'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.installPlugin$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation uninstallPlugin
   */
  static readonly UninstallPluginPath = '/api/v2/search/uninstallPlugin';

  /**
   * Uninstall search plugin.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uninstallPlugin()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uninstallPlugin$Response(params?: {
    body?: {

/**
 * Name of the plugin to uninstall (e.g. "legittorrents"). Supports multiple names separated by |
 */
'names'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.UninstallPluginPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Uninstall search plugin.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uninstallPlugin$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uninstallPlugin(params?: {
    body?: {

/**
 * Name of the plugin to uninstall (e.g. "legittorrents"). Supports multiple names separated by |
 */
'names'?: string;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.uninstallPlugin$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation enablePlugin
   */
  static readonly EnablePluginPath = '/api/v2/search/enablePlugin';

  /**
   * Enable search plugin.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `enablePlugin()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  enablePlugin$Response(params?: {
    body?: {

/**
 * Name of the plugin to enable (e.g. "legittorrents"). Supports multiple names separated by |
 */
'names'?: string;

/**
 * True to enable the plugin, false to disable it
 */
'enable'?: bool;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.EnablePluginPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Enable search plugin.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `enablePlugin$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  enablePlugin(params?: {
    body?: {

/**
 * Name of the plugin to enable (e.g. "legittorrents"). Supports multiple names separated by |
 */
'names'?: string;

/**
 * True to enable the plugin, false to disable it
 */
'enable'?: bool;
}
  },
  context?: HttpContext

): Observable<void> {

    return this.enablePlugin$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation updatePlugins
   */
  static readonly UpdatePluginsPath = '/api/v2/search/updatePlugins';

  /**
   * Update search plugins.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updatePlugins()` instead.
   *
   * This method doesn't expect any request body.
   */
  updatePlugins$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.UpdatePluginsPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Update search plugins.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updatePlugins$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  updatePlugins(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.updatePlugins$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
