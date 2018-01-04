import { EndMeetingPage } from './../pages/end-meeting/end-meeting';
import { ShowMeetingPageModule } from './../pages/show-meeting/show-meeting.module';
import { ShowMeetingPage } from './../pages/show-meeting/show-meeting';
import { CreateMeetingModule } from './../pages/create-meeting/create-meeting.module';
import { CreateMeeting } from './../pages/create-meeting/create-meeting';
import { SignInPageModule } from './../pages/sign-in/sign-in.module';
import { RestProvider } from './../providers/rest/rest';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign-in/sign-in';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { AppPreferences } from '@ionic-native/app-preferences';
import { GoogleMaps } from '@ionic-native/google-maps';
import { EndMeetingPageModule } from '../pages/end-meeting/end-meeting.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    SignInPageModule,
    CreateMeetingModule,
    ShowMeetingPageModule,
    EndMeetingPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    HomePage,
    CreateMeeting,
    ShowMeetingPage,
    EndMeetingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    Geolocation,
    AppPreferences,
    GoogleMaps
  ]
})
export class AppModule {}
