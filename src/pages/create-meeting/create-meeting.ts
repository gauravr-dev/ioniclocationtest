import { ShowMeetingPage } from './../show-meeting/show-meeting';
import { DateUtils } from './../../utilities/DateUtils';
/**
 * Generated class for the CreateMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Platform
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from '../../providers/rest/rest';
import { AppPreferences } from '@ionic-native/app-preferences' ;
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-create-meeting',
  templateUrl: 'create-meeting.html',
})
export class CreateMeeting {

  public meetingDetailsForm: FormGroup;
  user:string;
  password:string;
  serverurl:string;
  subject:string;
  customerName:string;
  contactPerson:string;
  agenda:string;
  starttime:string;
  submitted: boolean;
  options : GeolocationOptions;
  currentPos : Geoposition;
  public maxDate: string;

  @ViewChild('datePicker') datePicker: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private preferences: AppPreferences,
    private geolocation : Geolocation,
    private platform: Platform,
  ) {
      this.meetingDetailsForm = this.formBuilder.group({
        meetingSubject:[
          "",
          Validators.compose([
            Validators.required
          ])
        ],
        customerName: [
          "",
          Validators.compose([
            Validators.required
          ])
        ],
        contactPerson: [
          "",
          Validators.compose([
            Validators.required
          ])
        ],
        meetingAgenda: [
          "",
          Validators.compose([
            Validators.required
          ])
        ]
      });
  }

  ionViewDidLoad() {
    this.getUserPosition();
  }

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
    /*this.starttime = DateUtils.getCurrentDateTime();
    this.datePicker.setValue(this.starttime);
    */
  }


  onStartMeeting(){
    let loader = this.loadingCtrl.create({
      content: "",
      duration: 5000,
      dismissOnPageChange:true
    });

    this.subject = this.meetingDetailsForm.controls['meetingSubject'].value;
    this.customerName = this.meetingDetailsForm.controls['customerName'].value;
    this.contactPerson = this.meetingDetailsForm.controls['contactPerson'].value;
    this.agenda = this.meetingDetailsForm.controls['meetingAgenda'].value;

    /*
      var datetimestr = this.meetingDetailsForm.controls['meetingStartTime'].value;
    */
    this.starttime = DateUtils.formatDateTime(new Date(Date.now()));
    loader.present();

    this.restProvider.createMeeting(
      this.serverurl,
      this.user,
      this.password,
      this.subject,
      this.customerName,
      this.contactPerson,
      this.agenda,
      this.starttime
    ).then(
      res => {
        loader.dismiss();
        if(res['result']['status'] == 'SUCCESS'){
          let meetingid = res['result']['meeting_id'] ;
          this.preferences.store('meetingtitle', this.subject);
          this.preferences.store('meetingpartner', this.customerName);
          this.preferences.store('meetingcontactperson', this.contactPerson);
          this.preferences.store('meetingagenda', this.agenda);
          this.preferences.store('meetingstarttime', this.starttime);
          this.preferences.store('meetingstarted', "false");
          this.preferences.store('meetingid', "" + meetingid);
          // this.presentAlert('Success', res['result']['message']);

          // It API to start
          this.restProvider.startMeeting(
            this.serverurl,
            this.user,
            this.password,
            meetingid,
            this.currentPos.coords.latitude,
            this.currentPos.coords.longitude,
            this.starttime
          ).then(
              res => {
                loader.dismiss();
                if(res['result']['status'] == 'SUCCESS'){
                  this.preferences.store('meetingstarted', "true");
                  this.presentAlert('Success', 'Meeting started successfully.'); // res['result']['message']
                  this.navCtrl.setRoot(ShowMeetingPage);
                }else{
                  // show alert if status is failed.
                  this.presentAlert('Error', "Some error has been occurred.");
                }
              },
              err => {
                this.presentAlert('Error', "Some error has been occurred.");
              }
            )
        }else{
          // show alert if status is failed.
          this.presentAlert('Error', "Some error has been occurred.");
        }
      },
      err => {
        loader.dismiss();
        // show alert if error occurred.
        this.presentAlert('Error', "Error in server connection.");
      }
    )
  }

  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
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



}
