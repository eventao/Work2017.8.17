import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import * as Detector from 'three/examples/js/Detector';
import '../../lib/loader/DDSLoader';
import '../../lib/loader/MTLLoader';
import '../../lib/loader/OBJLoader';

// import "three/examples/js/loaders/DDSLoader";
// import "three/examples/js/loaders/MTLLoader";
// import "three/examples/js/loaders/OBJLoader";
// import {TrackballControls} from 'three-trackballcontrols';
import {ClockProvider} from "../../providers/clock/clock";
import {Vector} from "../../models/CommonModel";


import {VtkLoaderProvider} from "../../providers/model-loader/vtk-loader-provider";

@IonicPage()
@Component({
  selector: 'page-three-d',
  templateUrl: 'three-d.html',
})
export class ThreeDPage {
  @ViewChild('wrapper') wrapper: ElementRef;
  orControls: any;
  camera: any;
  scene: any;
  renderer: any;
  texture: any;
  width: any;
  height: any;
  gridRadius: number = 1000;
  clockProvider: ClockProvider;
  vtkLoaderProvider: VtkLoaderProvider;
  pillars = [];
  pillarAnimateLimit = 0;
  rabbit = null;
  clockMesh = null;
  textureCubes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public eleRef: ElementRef) {}

  private generateCamera() {
    this.width = this.wrapper.nativeElement.clientWidth;
    this.height = this.wrapper.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(80, this.width / this.height, 1, 10000);
    this.camera.position.y = 500;
    this.camera.position.z = 550;
    this.camera.rotation.x = -1;
  }

  private generateScene() {
    this.scene = new THREE.Scene();
  }

  private generateRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(this.width, this.height - 4);
    this.renderer.setClearColor(0x000000, 1.0);
    this.wrapper.nativeElement.appendChild(this.renderer.domElement);
  }

  //四舍五入获取范围随机数
  private RandomBoth(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    return Min + Math.round(Rand * Range); //四舍五入
  }

  //添加柱子
  private addPillar() {
    let cubes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let pR = 800;
    let innerLimit = 50;
    cubes.forEach((c, i) => {
      let rX1 = this.RandomBoth(-pR, -innerLimit);
      let rX2 = this.RandomBoth(innerLimit, pR);
      let rZ1 = this.RandomBoth(-pR, -innerLimit);
      let rZ2 = this.RandomBoth(innerLimit, pR);
      let randomChoiseBoth = Math.random();
      let rX = randomChoiseBoth > 0.5 ? rX1 : rX2;
      randomChoiseBoth = Math.random();
      let rZ = randomChoiseBoth > 0.5 ? rZ1 : rZ2;
      let randomColor = this.RandomBoth(0x000000, 0xffffff);
      let cube = this.generateCube(25, 25, 25, randomColor);
      cube.position.y = 12.5;
      cube.position.x = rX;
      cube.position.z = rZ;
      this.scene.add(cube);
      cubes[i] = cube;
    });
    return cubes;
  }

  private cubeAnimation(){
    this.clockMesh.rotation.y += 0.01;
  }

  //柱子随机位移
  private animatePillar(pillars) {
    if (this.pillarAnimateLimit % 30 === 0) {
      let pR = 400;
      let innerLimit = 200;
      pillars.forEach(cube => {
        let rX1 = this.RandomBoth(-pR, -innerLimit);
        let rX2 = this.RandomBoth(innerLimit, pR);
        let rZ1 = this.RandomBoth(-pR, -innerLimit);
        let rZ2 = this.RandomBoth(innerLimit, pR);
        let randomChoiseBoth = Math.random();
        let rX = randomChoiseBoth > 0.5 ? rX1 : rX2;
        randomChoiseBoth = Math.random();
        let rZ = randomChoiseBoth > 0.5 ? rZ1 : rZ2;
        cube.position.x = rX;
        cube.position.z = rZ;
      });
    }
  }

  private generateCube(width, height, depth, color) {
    let geometry = new THREE.BoxGeometry(width, height, depth);
    let material = new THREE.MeshPhongMaterial({color: color});
    return new THREE.Mesh(geometry, material);
  }

  private addClockCube() {
    let cubeGeometry = new THREE.CubeGeometry(128, 128, 128);
    let vector = new Vector(64, 64, 0);
    this.clockProvider = new ClockProvider(vector, 64, 10, 12.5);
    this.texture = this.texture || new THREE.Texture(this.clockProvider.canvas);
    let material = new THREE.MeshPhongMaterial({map: this.texture});
    let mesh = this.clockMesh = this.clockProvider.mesh = this.clockProvider.mesh || new THREE.Mesh(cubeGeometry, material);
    mesh.position.y = 64;
    mesh.position.x = -200;
    this.scene.add(mesh);
    return mesh;
  }

  textureCubeAni(){
    this.textureCubes.forEach(cube => {
      cube.rotation.y += 0.03
    });
  }

  private addTextureCube(poi, poiVerte = null) {
    let cubeGeometry = new THREE.CubeGeometry(128, 128, 128);
    let ra = Math.random();
    let cueColor = '../assets/imgs/cue-color.jpg';
    let map = THREE.ImageUtils.loadTexture(ra > 0.5 ? '../assets/imgs/cue.jpg' : cueColor);
    let imgMaterial = new THREE.MeshPhongMaterial({map});
    let cubeMesh = new THREE.Mesh(cubeGeometry, imgMaterial);

    cubeMesh.position.y = poi.y;
    cubeMesh.position.x = poi.x;
    cubeMesh.position.z = poi.z;

    if (poiVerte) {
      cubeMesh.position.set(poiVerte.x, poiVerte.y, poiVerte.z);
    }

    this.scene.add(cubeMesh);
    this.textureCubes.push(cubeMesh);
    return cubeMesh;
  }

  private setLight() {
    let light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(200, 200, 200);
    this.scene.add(light);
    return light;
  }

  private generateControl() {
    // console.log(TrackballControls);
    // let trackControls = new TrackballControls( this.camera );
    //
    // trackControls.rotateSpeed = 5.0;
    // trackControls.zoomSpeed = 5;
    // trackControls.panSpeed = 2;
    //
    // trackControls.noZoom = false;
    // trackControls.noPan = false;
    //
    // trackControls.staticMoving = true;
    // trackControls.dynamicDampingFactor = 0.3;

    let control = OrbitControls(THREE);
    this.orControls = new control(this.camera, this.renderer.domElement);
  }

  private initGrid() {
    let gridHelper = new THREE.GridHelper(this.gridRadius, 10, 0x0000ff, 0x808080);
    // this.scene.add(gridHelper);
  }

  private modelLoader(){
    let self = this;
    let onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        let percentComplete = xhr.loaded / xhr.total * 100;
        console.log( percentComplete.toFixed(2) + '% downloaded' );
      }
    };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'obj/male02/' );
    mtlLoader.load( 'male02_dds.mtl', function( materials ) {

      materials.preload();

      let objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.setPath( 'obj/male02/' );
      objLoader.load( 'male02.obj', function ( object ) {

        object.position.y = - 95;
        self.scene.add( object );

      }, onProgress, (xhr)=>{} );

    });
  }

  private rabitAnimation(rabitModel) {
    if (rabitModel && rabitModel.position) {
      rabitModel.position.x += 0.1;
      rabitModel.rotation.x += 0.01;
      rabitModel.rotation.z += 0.01;
    }
  }

  private loadModel() {
    this.vtkLoaderProvider = new VtkLoaderProvider();
    this.vtkLoaderProvider.loadModel(THREE).subscribe(data => {

      let material = new THREE.MeshLambertMaterial({color: 0xff0000, side: THREE.DoubleSide});
      let mesh = new THREE.Mesh(data, material);
      mesh.position.setY(0);
      mesh.position.setZ(0);
      mesh.position.setX(0);
      // mesh.position.setY( - 0.09 );

      this.scene.add(mesh);
      this.rabbit = mesh;
    });
  }

  private runAnimate() {
    requestAnimationFrame(() => {
      this.runAnimate();
    });
    this.texture.needsUpdate = true;
    this.clockProvider.start();
    this.renderer.render(this.scene, this.camera);
    // this.animatePillar(this.pillars);
    this.cubeAnimation();
    this.textureCubeAni();
    this.rabitAnimation(this.rabbit);
    this.pillarAnimateLimit++;
  }

  ionViewDidEnter() {
    console.log(THREE.DDSLoader,'THREE.DDSLoader');
    this.generateCamera();
    this.generateScene();

    this.generateRenderer();
    this.generateControl();

    this.pillars = this.addPillar();
    this.initGrid();
    this.addClockCube();
    this.addTextureCube({x: 0, y: 64,z:0});
    this.addTextureCube({x: 200, y: 64});
    this.addTextureCube({x: 0, y: 64, z: 200});
    this.addTextureCube({}, {x: 200, y: 200, z: 0});
    this.setLight();

    this.loadModel();
    this.runAnimate();
  }

}
