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

  ionViewDidLoad() {
    this.loadMap();
  }

  ionViewDidEnter(){
    this.getUserPosition();
    this.preferences.fetch('username').then((res) => {
      this.user = res ;
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

  onGetLocation(){
    this.getUserPosition();
  }

  onCreateMeeting(){

    this.navCtrl.push(CreateMeeting);
  }

  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let current_position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: current_position,
        label: "Your location",
        map: this.map
      });
    });
  }

  loadMapold() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    /*let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }*/

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    // this.map = this.googleMaps.create('map_canvas', mapOptions);
    // Wait the MAP_READY before using any methods.
    /*this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');
        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: 43.0741904,
              lng: -89.3809802
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });*/
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
    })
  }

  updateLocation(){
    let watch = this.geolocation.watchPosition();
    watch.subscribe((pos) => {
      this.currentPos = pos;
    });


  }

  onTapLogout(){
    this.preferences.store('serverurl', '');
    this.preferences.store('username', '');
    this.preferences.store('password', '');
    this.navCtrl.setRoot(SignInPage);
  }
}
