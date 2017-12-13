import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import {DrawCubeComponent} from '../components/draw-cube/draw-cube';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {ThreeDPage} from "../pages/three-d/three-d";
import {WebglPage} from "../pages/webgl/webgl";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ClockProvider } from '../providers/clock/clock';
import { VtkLoaderProvider } from '../providers/model-loader/vtk-loader-provider';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ThreeDPage,
    WebglPage,
    DrawCubeComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ThreeDPage,
    WebglPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ClockProvider,
    VtkLoaderProvider
  ]
})
export class AppModule {}
