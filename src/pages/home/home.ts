import { SignInPage } from './../sign-in/sign-in';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform  } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { RestProvider } from '../../providers/rest/rest';
import { AppPreferences } from '@ionic-native/app-preferences' ;
import { isUndefined } from 'ionic-angular/util/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  options : GeolocationOptions;
  currentPos : Geoposition;
  user:String;
  password:String;
  serverurl:String;
  timer:any;
  time:number;

  constructor(
    public navCtrl: NavController,
    private geolocation : Geolocation,
    private restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private preferences: AppPreferences
  ) {

  }

  ionViewDidEnter(){
    this.getUserPosition();

    this.preferences.fetch('username').then((res) => {
      this.user = res ;
      if(!isUndefined(this.user) && this.user != ''){
        this.autoSendLocation();
      }
    });
    this.preferences.fetch('password').then((res) => {
      this.password = res;
    });
    this.preferences.fetch('serverurl').then((res) => {
      this.serverurl = res;
    });
  }

  onSendLocation(){
    if(this.currentPos){
      this.restProvider.sendLocation(this.serverurl,this.user, this.password, this.currentPos.coords.latitude, this.currentPos.coords.longitude)
      .then(res => {
        if(res['result'] == false){
          this.presentAlert('Error', 'There is some error in request.');
        }else{
          this.presentAlert('Success', 'You location has been sent successfully.');
        }
      },
      err => {
        this.presentAlert('Error', err.message);
      });
    }
  }

  autoSendLocation(){
    // this.timer = setTimeout(this.silentSendLocation.bind(this), 1000)
    this.timer = setInterval( () => {
      this.silentSendLocation();
    }, 1000*60*10);
  }

  silentSendLocation() {
    if(this.currentPos){
      this.time = Date.now();
      this.restProvider.sendLocation(this.serverurl, this.user, this.password, this.currentPos.coords.latitude, this.currentPos.coords.longitude)
      .then(res => {
        if(res['result'] == false){
          // this.presentAlert('Error', 'There is some error in request.');
        }else{
          // this.presentAlert('Success', 'You location has been sent successfully.');
        }
      },
      err => {
        // this.presentAlert('Error', err.message);
      });
    }
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
    // this.options = {
    //   enableHighAccuracy : true
    let loader = this.loadingCtrl.create({
      content: "Fetching current location...",
      dismissOnPageChange:true
    });
    loader.present();
    this.geolocation.getCurrentPosition().then((pos : Geoposition) => {
        this.currentPos = pos;
        loader.dismiss();
        this.updateLocation();
    },(err : PositionError)=>{
        loader.dismiss();
        this.presentAlert('Error', 'There is some error in getting your location.');
    })
  }

  updateLocation(){
    let watch = this.geolocation.watchPosition();
    watch.subscribe((pos) => {
      this.currentPos = pos;
    });
  }

  onTapLogout(){
    // this.preferences.store('serverurl', '');
    // this.preferences.store('username', '');
    // this.preferences.store('password', '');

    this.preferences.clearAll();
    clearInterval(this.timer);
    this.navCtrl.setRoot(SignInPage);
  }
}
