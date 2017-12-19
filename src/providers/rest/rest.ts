import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  oldchecklogin(user, password): Observable<string[]> {
    var data = JSON.stringify({'params':{'login': user, 'password':password}});
    return this.http.post(this.loginApiUrl, data)
              .map(this.extractData)
              .catch(this.handleError);
  }
/**
 *
 *
 * @param {any} user
 * @param {any} password
 * @memberof RestProvider
 */
checklogin(serverurl, user, password) {
    var data = JSON.stringify({'params':{'login': user, 'password':password}});
    var headers = new HttpHeaders().set('content-type','application/json')
    .set('accept', 'text/plain');

    var options = { headers:headers, json: true };
    var loginurl = serverurl + '/CheckLogin' ;

    let promise = new Promise((resolve, reject) => {
      this.http.post(loginurl, data, options).subscribe(
        res => {
          resolve(res);
        },
        (err: HttpErrorResponse) => {
          reject(err);
        }
      );
    });
    return promise;
  }

  sendLocation(serverurl, user, password, latitude, longitude) {
    var data = JSON.stringify({'params':{'login': user, 'password':password, 'latitude':latitude, 'longitude':longitude}});
    console.log(data) ;
    var headers = new HttpHeaders().set('content-type','application/json')
    .set('accept', 'text/plain');

    var options = { headers:headers, json: true };
    var locationUpdateUrl = serverurl + '/SendLocation' ;

    let promise = new Promise((resolve, reject) => {
      this.http.post(locationUpdateUrl, data, options).subscribe(
        res => {
          resolve(res);
        },
        (err: HttpErrorResponse) => {
          reject(err);
        }
      );
    });
    return promise;
  }



  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
