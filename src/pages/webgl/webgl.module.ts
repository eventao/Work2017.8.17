import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebglPage } from './webgl';

@NgModule({
  declarations: [
    WebglPage,
  ],
  imports: [
    IonicPageModule.forChild(WebglPage),
  ],
})
export class WebglPageModule {}
