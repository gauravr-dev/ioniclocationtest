import { ShowMeetingPage } from './../show-meeting/show-meeting';
import { DateUtils } from './../../utilities/DateUtils';
/**
 * Generated class for the CreateMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from '../../providers/rest/rest';
import { AppPreferences } from '@ionic-native/app-preferences' ;

import * as moment from 'moment';

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

  public maxDate: string;

  @ViewChild('datePicker') datePicker: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private preferences: AppPreferences
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

      // this.user = "admin" ;
      // this.password = "admin";
      // this.serverurl = "http://191.101.239.214:8079";

  }

  ionViewDidLoad() {
  }

  ionViewDidEnter(){
    //this.maxDate = moment().add(10, 'years').format('YYYY');

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


  onCreateMeeting(){
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
    this.starttime = DateUtils.formatDateTime(new Date(new Date().getUTCMilliseconds()));
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
          this.preferences.store('meetingtitle', this.subject);
          this.preferences.store('meetingpartner', this.customerName);
          this.preferences.store('meetingcontactperson', this.contactPerson);
          this.preferences.store('meetingagenda', this.agenda);
          this.preferences.store('meetingstarttime', this.starttime);
          this.preferences.store('meetingstarted', "false");
          this.preferences.store('meetingid', "" + res['result']['meeting_id']);
          this.navCtrl.setRoot(ShowMeetingPage);
          this.presentAlert('Success', res['result']['message']);
        }else{
          // show alert if status is failed.
          this.presentAlert('Error', "Some error has been occurred.");
        }
      },
      err => {
        loader.dismiss();
        // show alert if error occurred.
        this.presentAlert('Error', err.message);
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

}
