import { CreateMeetingPage } from './../pages/create-meeting/create-meeting';
import { HomePage } from './../pages/home/home';
import { SignInPage } from './../pages/sign-in/sign-in';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppPreferences } from '@ionic-native/app-preferences';

@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  rootPage:any = CreateMeetingPage;
  user:String

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    preferences: AppPreferences
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      // check if user is already logged-in
      // if logged in set home as root
      /*preferences.fetch('username').then((res) => {
        this.user = res;
        if (this.user != null && this.user != '') {
          this.rootPage = HomePage;
        }else{
          this.rootPage = SignInPage;
        }
      });*/
    });
  }
}

