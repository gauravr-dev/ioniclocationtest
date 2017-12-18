import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendLocationPage } from './send-location';

@NgModule({
  declarations: [
    SendLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(SendLocationPage),
  ],
})
export class SendLocationPageModule {}
