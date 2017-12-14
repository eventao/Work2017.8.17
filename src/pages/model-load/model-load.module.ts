import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModelLoadPage } from './model-load';

@NgModule({
  declarations: [
    ModelLoadPage,
  ],
  imports: [
    IonicPageModule.forChild(ModelLoadPage),
  ],
})
export class ModelLoadPageModule {}
