import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, RequestMethod, RequestOptionsArgs, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { environment } from '../../environments/environment'

import 'rxjs/add/operator/catch'; 
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiHandler extends Http {
  //Used in conjunction with token
  private bearer: string = 'Bearer';

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

/**
 * Pass in API calls which is processed by via the Angular Http request
 */
  callService(service_url, method: RequestMethod, params: any = {}, options?: RequestOptionsArgs): Observable<any> {
    return super.request(this.getFullUrl(service_url), this.requestOptions(method, params, options))
      .catch(this.onCatch);
  }

  /**
   * Build API URL.
   * and we remove any leading / from the service calls since 
   * we are not needing them in making request calls
   * e.g localhost:1337//base... to localhost:1337/base..
   */
  private getFullUrl(url: string): string {
    if (url.charAt(0) == "/") {
      url = url.substring(1);
    }
    return environment.endpoint + url;
  }

  /**
   * Request options is used to manipulate and handle needed information before
   * it is sent to server and it also adds our token authorization header if it is 
   * present in our storage
   */
  private requestOptions(method: RequestMethod, params: any, options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    options.method = method;

    //'Post and Put' else 'Get'
    if (options.method === RequestMethod.Post || options.method === RequestMethod.Put) {
      options.body = params;
    } else {
      options.params = params;
    }

    //Authorization header if token exists in local storage
    if (options.headers == null && localStorage.getItem('token') != null) {
      options.headers = new Headers({
        'Authorization': `${this.bearer} ${localStorage.getItem('token')}`
      });
    }
    return options;
  }

 /**
 * Error handler.
 * do any middle ware checking before sending it to observable caller
 *
 * convert the error to normal text
 */
private onCatch(error: any, caught: Observable<any>): Observable<any> {

  return Observable.throw(error.text());
}


}