import {Component, ElementRef,ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import * as GridHelper from 'three/src/extras/helpers/GridHelper';

@IonicPage()
@Component({
  selector: 'page-three-d',
  templateUrl: 'three-d.html',
})
export class ThreeDPage {
  @ViewChild('wrapper') wrapper: ElementRef;
  orControls:any;
  camera:any;
  scene:any;
  renderer:any;
  width:any;
  height:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public eleRef: ElementRef) {}

  private generateCamera(){
    this.width = this.wrapper.nativeElement.clientWidth;
    this.height = this.wrapper.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(80,this.width / this.height,1,1000);
    this.camera.position.y = 100;
    this.camera.position.z = 150;
    this.camera.rotation.x = -0.5;
  }
  private generateScene(){
    this.scene = new THREE.Scene();
  }
  private generateRenderer(){
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width,this.height - 4);
  }
  private generateCube(){
    let geometry = new THREE.BoxGeometry( 35, 35, 35 );
    let material = new THREE.MeshBasicMaterial( { color: 0x00a1cb } );
    let cube = new THREE.Mesh( geometry, material );
    cube.position.y = 17.5;
    this.scene.add( cube );
  }
  private generateControl(){
    let control = OrbitControls(THREE);
    this.orControls = new control(this.camera, this.renderer.domElement);
  }
  // 网格绘制
  private initGrid(){
    let gridHelper = new THREE.GridHelper( 450, 10,0x0000ff, 0x808080 );
    this.scene.add(gridHelper);
  }
  private runAnimate(){
    requestAnimationFrame(() => {
      this.runAnimate();
    });
    this.renderer.render(this.scene,this.camera );
  }
  ionViewDidEnter() {
    this.generateCamera();
    this.generateScene();
    this.generateRenderer();
    this.generateControl();
    this.generateCube();
    this.initGrid();
    this.wrapper.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0xffff00,1.0);
    this.runAnimate();
  }



}
