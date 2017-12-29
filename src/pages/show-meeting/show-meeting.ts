import { HomePage } from './../home/home';
import { DateUtils } from './../../utilities/DateUtils';
/**
 * Generated class for the ShowMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { Component } from "@angular/core";
import { IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Platform
} from "ionic-angular" ;
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from '../../providers/rest/rest';
import { AppPreferences } from '@ionic-native/app-preferences' ;
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-show-meeting',
  templateUrl: 'show-meeting.html',
})

export class ShowMeetingPage {

  public meetingDetailsForm: FormGroup;

  user:string;
  password:string;
  serverurl:string;
  subject:string;
  customerName:string;
  contactPerson:string;
  agenda:string;
  datetime:string;
  detail:string;
  isStarted:boolean;
  meetingid:string;
  currentTime: string ;
  options : GeolocationOptions;
  currentPos : Geoposition;
  //timer:any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private preferences: AppPreferences,
    private geolocation : Geolocation,
    private platform: Platform
  ) {

  }

  ionViewDidLoad() { }

  ionViewDidEnter(){
    this.preferences.fetch('username').then((res) => {
      this.user = res ;
    });
    this.preferences.fetch('password').then((res) => {
      this.password = res;
    });
    this.preferences.fetch('serverurl').then((res) => {
      this.serverurl = res;
    });
    this.preferences.fetch('meetingtitle').then((res) => {
      this.subject = res ;
    });
    this.preferences.fetch('meetingpartner').then((res) => {
      this.customerName = res;
    });
    this.preferences.fetch('meetingcontactperson').then((res) => {
      this.contactPerson = res;
    });
    this.preferences.fetch('meetingagenda').then((res) => {
      this.agenda = res;
    });
    this.preferences.fetch('meetingid').then((res) => {
      this.meetingid = res;
    });

    this.preferences.fetch('meetingstarted').then((res) => {
      this.isStarted = (res == "false") ? false : true ;
      /*if(this.isStarted){
        this.startTimer();
      }else{
        this.currentTime = "00:00:00" ;
        this.preferences.store('currentTime', "00:00:00");
      }*/
    });
    this.getUserPosition();
  }

  /*startTimer(){
    this.preferences.fetch('currentTime').then((res) => {
      var hms = res.split(":")
      let h = parseInt(hms[0]) ;
      let m = parseInt(hms[1]) ;
      let s = parseInt(hms[2]) ;

      var timestamp = new Date(0,0,0,h,m,s);
      var interval = 1;
      this.timer = setInterval(() => {
        timestamp = new Date(timestamp.getTime() + interval*1000);
        this.currentTime = this.checkTime(timestamp.getHours()) +':'
        + this.checkTime(timestamp.getMinutes())
        +':'+ this.checkTime(timestamp.getSeconds()) ;
        this.preferences.store("currentTime", "" + this.currentTime) ;
      }, 1000);
    });

  }

  checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

  stopTimer(){
    clearInterval(this.timer);
    this.currentTime = "00:00:00" ;
    this.preferences.store('currentTime', "00:00:00");
  }*/


  onEndMeeting(){
    var starttime = DateUtils.getCurrentDateTime();
    var description = this.meetingDetailsForm.controls['meetingDetails'].value;

    let loader = this.loadingCtrl.create({
      content: "",
      duration: 5000,
      dismissOnPageChange:true
    });
    loader.present();

    this.restProvider.endMeeting(
      this.serverurl,
      this.user,
      this.password,
      this.meetingid,
      this.currentPos.coords.latitude,
      this.currentPos.coords.longitude,
      starttime,
      description).then(
        res => {
          loader.dismiss();
          if(res['result']['status'] == 'SUCCESS'){
            this.preferences.store('meetingstarted', "");
            this.preferences.store('meetingid', '');
            this.preferences.store('meetingtitle', '');
            this.preferences.store('meetingstarttime', '');
            this.preferences.store('meetingcontactperson', '');
            this.preferences.store('meetingagenda', '');
            this.preferences.store('meetingpartner', '');
            this.presentAlert('Success', res['result']['message']);
            this.navCtrl.setRoot(HomePage);
          }else{
            // show alert if status is failed.
            this.presentAlert('Error', "Some error has been occurred.");
          }
        },
        err => {
          this.presentAlert('Error', "Some error has been occurred.");
        }
      )
  }

  onStartMeeting(){
    var starttime = DateUtils.getCurrentDateTime();
    let loader = this.loadingCtrl.create({
      content: "",
      duration: 5000,
      dismissOnPageChange:true
    });
    loader.present();


    this.user = "admin" ;
    this.password = "admin";
    this.serverurl = "http://191.101.239.214:8079";

    this.restProvider.startMeeting(
      this.serverurl,
      this.user,
      this.password,
      this.meetingid,
      this.currentPos.coords.latitude,
      this.currentPos.coords.longitude,
      starttime).then(
        res => {
          loader.dismiss();
          // this.presentAlert('Success', JSON.stringify(res));
          if(res['result']['status'] == 'SUCCESS'){
            this.preferences.store('meetingstarted', "true");
            this.isStarted = true ;
            this.presentAlert('Success', res['result']['message']);
          }else{
            // show alert if status is failed.
            this.presentAlert('Error', "Some error has been occurred.");
          }
        },
        err => {
          this.presentAlert('Error', "Some error has been occurred.");
        }
      )
  }


  async getUserPosition(){
    await this.platform.ready();
    this.options = {
      enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
        this.currentPos = pos;
        let watch = this.geolocation.watchPosition();
          watch.subscribe((pos) => {
          this.currentPos = pos;
        });
    },(err : PositionError)=>{
    })
  }

  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
}
