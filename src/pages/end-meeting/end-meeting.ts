import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the EndMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-end-meeting',
  templateUrl: 'end-meeting.html',
})
export class EndMeetingPage {
  // vars
  meetingNotes:string ;

  //
  constructor(public viewCtrl: ViewController) {
  }

  onTapEndMeeting(){
    this.viewCtrl.dismiss(this.meetingNotes);
  }

  onTapCancel(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EndMeetingPage');
  }
}
