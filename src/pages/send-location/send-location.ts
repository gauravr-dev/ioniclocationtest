import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SendLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-location',
  templateUrl: 'send-location.html',
})
export class SendLocationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  /**
   * <key>NSLocationAlwaysUsageDescription</key>
	<string>We require your location to update CRM.</string>
	<key>NSLocationUsageDescription</key>
	<string>We require your location to update CRM.</string>
	<key>NSLocationWhenInUseUsageDescription</key>
	<string>We require your location to update CRM.</string>
   */
  ionViewDidLoad() {
    console.log('ionViewDidLoad SendLocationPage');
  }

}
