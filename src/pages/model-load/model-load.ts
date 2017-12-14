import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as THREE from 'three';
import {VTKLoader} from "../../lib/loader/VTKLoader";
import {TrackballControls} from 'three-trackballcontrols';

@IonicPage()
@Component({
  selector: 'page-model-load',
  templateUrl: 'model-load.html',
})
export class ModelLoadPage {
  container;
  stats;
  camera;
  controls;
  scene;
  renderer;
  cross;
  dirLight;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    new VTKLoader(THREE);

    let camera = this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1e10);
    this.camera.position.z = 0.2;
    let controls = this.controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 2;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    let scene = this.scene = new THREE.Scene();
    scene.add(camera);

    // light
    let dirLight = this.dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, 200, 1000).normalize();

    camera.add(dirLight);
    camera.add(dirLight.target);
    // A begin
    var material = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide});
    var loader = new THREE.VTKLoader();
    loader.addEventListener('load', function (event) {
      var geometry = event.content;
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.setY(-0.09);
      scene.add(mesh);
    });
    loader.load("../../assets/d3-models/bunny.vtk");
    // A end
    // renderer
    let renderer = this.renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setClearColorHex(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    let container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    // let stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.top = '0px';
    // container.appendChild( stats.domElement );
    //
    window.addEventListener('resize', this.onWindowResize, false);

    this.animate();
  }


  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.handleResize();
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }
}
