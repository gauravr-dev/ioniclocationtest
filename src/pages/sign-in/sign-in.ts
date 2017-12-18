import { HomePage } from './../home/home';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from '../../providers/rest/rest';
import {AppPreferences} from '@ionic-native/app-preferences' ;


@IonicPage()
@Component({
  selector: "page-sign-in",
  templateUrl: "./sign-in.html",
  animations: []
})

export class SignInPage {
  public credentialsForm: FormGroup;

  public submitted: boolean = false;

  public emailState: any = "out";
  public passwordState: any = "in";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private preferences: AppPreferences
  ) {
    this.credentialsForm = this.formBuilder.group({
      user: [
        "admin",
        Validators.compose([
          Validators.required
        ])
      ],
      password: [
        "admin",
        Validators.compose([
          Validators.required
        ])
      ]
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

  public onSignIn() {
    this.submitted = true;

    if (this.credentialsForm.valid) {
      var user = this.credentialsForm.controls['user'].value;
      var password = this.credentialsForm.controls['password'].value;
      let loader = this.loadingCtrl.create({
        content: ""
      });
      loader.present();
      this.restProvider.checklogin(user, password).then(
        res => { // Success
          console.log(res);
          loader.dismiss();
          if(res['result']['status'] == 'SUCCESS'){
            this.preferences.store('username', user);
            this.preferences.store('password', password);

            this.navCtrl.push(HomePage);
          }else{
            // show alert if status is failed.
            this.presentAlert('Error', 'Your User Name or Password is wrong. Please try again.');
          }
        },
        err => {
          loader.dismiss();
          console.log(err);
          // show alert if error occurred.
          this.presentAlert('Error', err.message);
        }
      );
    }
  }

  public onForgotPassword() {

  }
}
