import { CreateMeeting } from './../create-meeting/create-meeting';
import { SignInPage } from './../sign-in/sign-in';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform  } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { RestProvider } from '../../providers/rest/rest';
import { AppPreferences } from '@ionic-native/app-preferences' ;

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';
import { isUndefined } from 'ionic-angular/util/util';

declare var google;

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
  locationMarker: Marker ;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  // map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    private geolocation : Geolocation,
    private restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private preferences: AppPreferences,
    private googleMaps: GoogleMaps
  ) {
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
    this.getUserPosition();
    this.loadMap();
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

  onGetLocation(){
    this.getUserPosition();
  }

  onCreateMeeting(){

    this.navCtrl.push(CreateMeeting);
  }

  async loadMap(){
    await this.platform.ready();
    var lat = 37.4220 ;
    var lng = -122.0840 ;

    // static api key - AIzaSyCwCYaAzkiqQUJBtydjWJYsT2zSHtB2xXY

    if(!isUndefined(this.currentPos) && !isUndefined(this.currentPos.coords)) {
      lat = this.currentPos.coords.latitude ;
      lng = this.currentPos.coords.longitude ;
    }

    let latLng = new google.maps.LatLng(lat, lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: !("ontouchend" in document)
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let current_position = {
      lat: lat,
      lng: lng
    };

    this.locationMarker = new google.maps.Marker({
      position: current_position,
      label: "Your location",
      map: this.map
    });
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
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    };
    let loader = this.loadingCtrl.create({
      content: "Fetching current location...",
      duration: 5000,
      dismissOnPageChange:true
    });
    loader.present();
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
        this.currentPos = pos;
        loader.dismiss();
        this.updateLocation();
    },(err : PositionError)=>{
        loader.dismiss();
        this.presentAlert('Error', 'There is some error in getting your location.');
        this.updateLocation();
    })
  }

  /**
   *
   */
  updateLocation(){
    let watch = this.geolocation.watchPosition();
    watch.subscribe((pos) => {
      if(!isUndefined(pos) && !isUndefined(pos.coords)) {
        this.currentPos = pos;
        let current_position = {
          lat: this.currentPos.coords.latitude,
          lng: this.currentPos.coords.longitude
        };
        this.locationMarker = new google.maps.Marker({
          position: current_position,
          label: "Your location",
          map: this.map
        });
      }
    });
  }

  onTapLogout(){
    this.preferences.store('serverurl', '');
    this.preferences.store('username', '');
    this.preferences.store('password', '');
    this.navCtrl.setRoot(SignInPage);
  }
}
