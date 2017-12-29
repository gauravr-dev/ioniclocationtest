import { DateUtils } from './../../utilities/DateUtils';
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  constructor(public http: HttpClient) {
    console.log("Hello RestProvider Provider");
  }

  /**
   *
   *
   * @param {any} user
   * @param {any} password
   * @memberof RestProvider
   */
  checklogin(serverurl, user, password) {
    var data = JSON.stringify({ params: { login: user, password: password } });
    var headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("accept", "text/plain");

    var options = { headers: headers, json: true };
    var loginurl = serverurl + "/CheckLogin";

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
    var dateString = DateUtils.getCurrentDateTime();

    var data = JSON.stringify({
      params: {
        login: user,
        password: password,
        lat: latitude,
        long: longitude,
        date_info: dateString
      }
    });

    var headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("accept", "text/plain");

    var options = { headers: headers, json: true };
    var locationUpdateUrl = serverurl + "/SaveLocation";

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

  createMeeting(serverurl, user, password, subject, customerName, contactPerson, agenda, starttime) {
    var dateString = DateUtils.getCurrentDateTime();
    var data = JSON.stringify({
      params: {
        login: user,
        password: password,
        name: subject,
        partner_name: customerName,
        contactPerson: contactPerson,
        agenda: agenda,
        start_time: starttime
      }
    });

    var headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("accept", "text/plain");

    var options = { headers: headers, json: true };
    var url = serverurl + "/NewMeeting";

    let promise = new Promise((resolve, reject) => {
      this.http.post(url, data, options).subscribe(
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

  startMeeting(serverurl, user, password, meetingid, latitude, longitude, starttime) {
    var dateString = DateUtils.getCurrentDateTime();
    var data = JSON.stringify({
      params: {
        login: user,
        password: password,
        start_lat: latitude,
        start_long: longitude,
        meeting_id:meetingid,
        start_time: dateString
      }
    });

    var headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("accept", "text/plain");

    var options = { headers: headers, json: true };
    var url = serverurl + "/StartMeeting";

    let promise = new Promise((resolve, reject) => {
      this.http.post(url, data, options).subscribe(
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

  endMeeting(serverurl, user, password, meetingid, latitude, longitude, endtime, description) {
    var dateString = DateUtils.getCurrentDateTime();

    var data = JSON.stringify({
      params: {
        login: user,
        password: password,
        end_lat: latitude,
        end_long: longitude,
        meeting_id:meetingid,
        end_time: dateString,
        description: description
      }
    });

    var headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("accept", "text/plain");

    var options = { headers: headers, json: true };
    var locationUpdateUrl = serverurl + "/EndMeeting";

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





  /**private extractData(res: Response) {
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
  }*/
}
