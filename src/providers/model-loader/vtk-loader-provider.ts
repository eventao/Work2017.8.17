import {Injectable} from '@angular/core';
import * as Detector from "three/examples/js/Detector";
import Rx from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {VTKLoader} from "../../lib/loader/VTKLoader";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

/*
  Generated class for the ClockProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VtkLoaderProvider {
  vtkLoader: VTKLoader;
  THREE: any;

  constructor() {
  }

  public loadModel(THREE): Observable<any> {
    this.THREE = THREE;
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    new VTKLoader(THREE);
    let loader = new THREE.VTKLoader();

    return Rx.Observable.create(observer => {
      loader.addEventListener( 'load',
        function ( event ) {
          let geometry = event.content;
          observer.next(geometry);
        },
        function(param){
          console.log(param);
        },
        function(){

        }
      );
      loader.load("../assets/d3-models/bunny.vtk", geometry => {
        observer.next(geometry);
      });
    });

  }

}
