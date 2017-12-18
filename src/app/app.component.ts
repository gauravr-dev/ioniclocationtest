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
  rootPage:any = SignInPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    preferences: AppPreferences
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // check if user is already logged-in
      // if logged in set home as root
      var user = '' ;
      preferences.fetch('username').then((res) => {
        console.log(res);
        user = res;
      });

      if (user != '') {
        this.rootPage = HomePage;
      }else{
        this.rootPage = SignInPage;
      }
    });
  }
}

