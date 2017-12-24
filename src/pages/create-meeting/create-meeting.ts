import { HomePage } from './../home/home';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from '../../providers/rest/rest';
//import {AppPreferences} from '@ionic-native/app-preferences' ;


/**
 * Generated class for the CreateMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-meeting',
  templateUrl: 'create-meeting.html',
})
export class CreateMeeting {

  public var meetingDetailsForm:FormGroup;

  user:String;
  password:String;
  serverurl:String;
  submitted: boolean;
  dateFormat:String = "yyyy-MM-DD HH:mm"

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private restProvider: RestProvider,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              // private preferences: AppPreferences
  ) {
    this.meetingDetailsForm = this.formBuilder.group({
      meetingStartTime:[
        Date.now(),
        Validators.compose([
          Validators.required
        ])
      ],
      meetingEndTime: [
        Date.now(),
        Validators.compose([
          Validators.required
        ])
      ],

      meetingDetails: [
        "",
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateMeetingPage');
  }

  ionViewDidEnter(){
    /*this.preferences.fetch('username').then((res) => {
      this.user = res ;
    });
    this.preferences.fetch('password').then((res) => {
      this.password = res;
    });
    this.preferences.fetch('serverurl').then((res) => {
      this.serverurl = res;
    });*/
  }


  onCreateMeeting(){
    let loader = this.loadingCtrl.create({
      content: "",
      duration: 5000,
      dismissOnPageChange:true
    });


  }
}
