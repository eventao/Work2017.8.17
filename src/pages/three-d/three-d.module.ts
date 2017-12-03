import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThreeDPage } from './three-d';

@NgModule({
  declarations: [
    ThreeDPage,
  ],
  imports: [
    IonicPageModule.forChild(ThreeDPage),
  ],
})
export class ThreeDPageModule {}
