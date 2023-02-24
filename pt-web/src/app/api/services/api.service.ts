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

import { RegisterInfo } from '../models/register-info';
import { User } from '../models/user';

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
   * Path part for operation appControllerInvitations
   */
  static readonly AppControllerInvitationsPath = '/invitations';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerInvitations()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerInvitations$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerInvitationsPath, 'post');
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
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerInvitations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerInvitations(params?: {
  },
  context?: HttpContext

): Observable<{
}> {

    return this.appControllerInvitations$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation appControllerRegister
   */
  static readonly AppControllerRegisterPath = '/register';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerRegister()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  appControllerRegister$Response(params: {
    body: RegisterInfo
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerRegisterPath, 'post');
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
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerRegister$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  appControllerRegister(params: {
    body: RegisterInfo
  },
  context?: HttpContext

): Observable<string> {

    return this.appControllerRegister$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation appControllerLogin
   */
  static readonly AppControllerLoginPath = '/login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerLogin()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerLogin$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerLoginPath, 'post');
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerLogin$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerLogin(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.appControllerLogin$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation appControllerDownload
   */
  static readonly AppControllerDownloadPath = '/download';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerDownload()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerDownload$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerDownloadPath, 'get');
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerDownload$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerDownload(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.appControllerDownload$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation appControllerUpload
   */
  static readonly AppControllerUploadPath = '/upload';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerUpload()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerUpload$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerUploadPath, 'post');
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerUpload$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerUpload(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.appControllerUpload$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation appControllerIndex
   */
  static readonly AppControllerIndexPath = '/index';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerIndex()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerIndex$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<{
}>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerIndexPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<{
        }>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerIndex$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerIndex(params?: {
  },
  context?: HttpContext

): Observable<Array<{
}>> {

    return this.appControllerIndex$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<{
}>>) => r.body as Array<{
}>)
    );
  }

  /**
   * Path part for operation appControllerUserStat
   */
  static readonly AppControllerUserStatPath = '/userstat';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerUserStat()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerUserStat$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerUserStatPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerUserStat$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerUserStat(params?: {
  },
  context?: HttpContext

): Observable<User> {

    return this.appControllerUserStat$Response(params,context).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  /**
   * Path part for operation appControllerDownloads
   */
  static readonly AppControllerDownloadsPath = '/rss_download';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerDownloads()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerDownloads$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerDownloadsPath, 'get');
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerDownloads$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerDownloads(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.appControllerDownloads$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation appControllerRss
   */
  static readonly AppControllerRssPath = '/rss';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerRss()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerRss$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerRssPath, 'get');
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerRss$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerRss(params?: {
  },
  context?: HttpContext

): Observable<void> {

    return this.appControllerRss$Response(params,context).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation appControllerTorrent
   */
  static readonly AppControllerTorrentPath = '/torrent';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerTorrent()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerTorrent$Response(params: {
    infoHash: any;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerTorrentPath, 'get');
    if (params) {
      rb.query('infoHash', params.infoHash, {});
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerTorrent$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerTorrent(params: {
    infoHash: any;
  },
  context?: HttpContext

): Observable<{
}> {

    return this.appControllerTorrent$Response(params,context).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation appControllerTest
   */
  static readonly AppControllerTestPath = '/test';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `appControllerTest()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerTest$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.AppControllerTestPath, 'get');
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `appControllerTest$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  appControllerTest(params?: {
  },
  context?: HttpContext

): Observable<string> {

    return this.appControllerTest$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

}
