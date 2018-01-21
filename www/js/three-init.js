pinkCalf.placeInit = function (wrapper) {
  this.wrapper = document.querySelector(wrapper);
  this.width = this.wrapper.clientWidth;
  this.height = this.wrapper.clientHeight;
  this.textureCubes = [];
  this.clockMesh = null;
  this.pillarAnimateLimit = 0;
  this.gridRadius = 1000;
};

pinkCalf.placeInit.prototype = {
  createMaterials: function () {
    map = null;
    let path = "./assets/cubemap/skybox/";
    this.materials = {};

    let urls = [path + "px.jpg", path + "nx.jpg",
      path + "py.jpg", path + "ny.jpg",
      path + "pz.jpg", path + "nz.jpg"];
    this.envMap = THREE.ImageUtils.loadTextureCube(urls);
    this.materials["phong"] = new THREE.MeshBasicMaterial({color: 0xffffff, map: map});
    this.materials["phong-envmapped"] = new THREE.MeshBasicMaterial({
      color: 0xffffff, envMap: this.envMap,
      map: map, reflectivity: 1.3
    });
  },
  setMaterial: function () {
    materialName = name;
    if (this.envMapOn) {
      this.skySphere.visible = false;
      this.sphereEnvMapped.visible = true;
      this.sphereEnvMapped.material = this.materials[name];
    }
    else {
      this.skySphere.visible = true;
      this.sphereEnvMapped.visible = false;
      this.skySphere.material = this.materials[name];
    }
  },
  createSkybox: function () {

    // Create a group to hold all the objects
    this.cube3DObj = new THREE.Object3D;

    let ambientLight = new THREE.AmbientLight(0);
    this.cube3DObj.add(ambientLight);

    // Create a group to hold the spheres
    let group = new THREE.Object3D;
    this.cube3DObj.add(group);

    // Create all the materials
    this.createMaterials();

    // Create the sphere geometry
    let geometry = new THREE.SphereGeometry(2, 20, 20);
    // And put the geometry and material together into a mesh
    this.skySphere = new THREE.Mesh(geometry, this.materials["phong"]);
    this.skySphere.visible = false;
    // Create the sphere geometry
    let geometry1 = new THREE.SphereGeometry(2, 20, 20);
    // And put the geometry and material together into a mesh
    this.sphereEnvMapped = new THREE.Mesh(geometry1, this.materials["phong-envmapped"]);
    this.sphereEnvMapped.visible = true;
    this.setMaterial("phong-envmapped");

    // Add the sphere mesh to our group
    // group.add(this.skySphere);
    group.add(this.sphereEnvMapped);

    // Create the skybox
    let shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = this.envMap;

    let material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      side: THREE.BackSide
    });


    let skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), material);
    this.scene.add(skyboxMesh);

    // Now add the group to our scene
    this.scene.add(this.cube3DObj);
  },
  generateCamera: function () {
    this.camera = new THREE.PerspectiveCamera(80, this.width / this.height, 1, 10000);
    this.camera.position.y = 500;
    this.camera.position.z = 550;
    this.camera.rotation.x = -1;
  },
  generateScene: function () {
    this.scene = new THREE.Scene();
  },
  generateRenderer: function () {
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.setSize(this.width, this.height - 4);
    this.renderer.setClearColor(0x000000, 1.0);
    this.wrapper.appendChild(this.renderer.domElement);
  },
  addPillar: function () {
    let cubes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let pR = 800;
    let innerLimit = 50;
    cubes.forEach((c, i) => {
      let rX1 = pinkCalf.RandomBoth(-pR, -innerLimit);
      let rX2 = pinkCalf.RandomBoth(innerLimit, pR);
      let rZ1 = pinkCalf.RandomBoth(-pR, -innerLimit);
      let rZ2 = pinkCalf.RandomBoth(innerLimit, pR);
      let randomChoiseBoth = Math.random();
      let rX = randomChoiseBoth > 0.5 ? rX1 : rX2;
      randomChoiseBoth = Math.random();
      let rZ = randomChoiseBoth > 0.5 ? rZ1 : rZ2;
      let randomColor = pinkCalf.RandomBoth(0x000000, 0xffffff);
      let cube = pinkCalf.generateCube(25, 25, 25, randomColor);
      cube.position.y = 12.5;
      cube.position.x = rX;
      cube.position.z = rZ;
      this.scene.add(cube);
      cubes[i] = cube;
    });
    return cubes;
  },
  generateControl: function () {
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

    let control = pinkCalf.OrbitControls(THREE);
    new control(this.camera, this.renderer.domElement);
  },
  setLight: function () {
    let light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0, 350, 350);
    this.scene.add(light);
    return light;
  },
  initGrid: function () {
    let gridHelper = new THREE.GridHelper(this.gridRadius, 10, 0x0000ff, 0x808080);
    this.scene.add(gridHelper);
  },
  cubeAnimation: function () {
    this.clockMesh.rotation.y += 0.01;
  },
  sphereGroupAnima: function () {
    if (this.car) {
      if(this.carReturn){
        this.car.position.z -= 1;
      }else{
        this.car.position.z += 1;
      }
      if(this.car.position.z > 1300){
        this.carReturn = true;
      }
      if(this.car.position.z < -1300){
        this.carReturn = false;
      }
    }
    if (this.cubeGroup) {
      // this.cubeGroup.rotation.y += 0.01;
    }
    if (this.sphere1) {
      // this.sphere1.rotation.y += 0.01;
    }
    if (this.cone) {
      if(this.carReturn){
        this.cone.rotation.x -= 0.02;
      }else{
        this.cone.rotation.x += 0.02;
      }

    }
    if (this.cone1) {
      if(this.carReturn){
        this.cone1.rotation.x -= 0.02;
      }else{
        this.cone1.rotation.x += 0.02;
      }

    }
    if (this.cone2) {
      if(this.carReturn){
        this.cone2.rotation.x -= 0.02;
      }else{
        this.cone2.rotation.x += 0.02;
      }

    }
    if (this.cone3) {
      if(this.carReturn){
        this.cone3.rotation.x -= 0.02;
      }else{
        this.cone3.rotation.x += 0.02;
      }

    }
  },
  textureCubeAni: function () {
    this.textureCubes.forEach(cube => {
      cube.rotation.y += 0.03
    });
  },
  animatePillar: function (pillars) {
    if (this.pillarAnimateLimit % 50 === 0) {
      let pR = 400;
      let innerLimit = 200;
      pillars.forEach(cube => {
        let rX1 = pinkCalf.RandomBoth(-pR, -innerLimit);
        let rX2 = pinkCalf.RandomBoth(innerLimit, pR);
        let rZ1 = pinkCalf.RandomBoth(-pR, -innerLimit);
        let rZ2 = pinkCalf.RandomBoth(innerLimit, pR);
        let randomChoiseBoth = Math.random();
        let rX = randomChoiseBoth > 0.5 ? rX1 : rX2;
        randomChoiseBoth = Math.random();
        let rZ = randomChoiseBoth > 0.5 ? rZ1 : rZ2;
        cube.position.x = rX;
        cube.position.z = rZ;
      });
    }
    this.pillarAnimateLimit++;
  },
  addClockCube: function () {
    let cubeGeometry = new THREE.CubeGeometry(128, 128, 128);
    let vector = {x: 64, y: 64, z: 0};
    this.clockProvider = new pinkCalf.clockTexture(vector, 64, 10, 12.5);
    this.texture = this.texture || new THREE.Texture(this.clockProvider.canvas);
    let material = new THREE.MeshPhongMaterial({map: this.texture});
    let mesh = this.clockMesh = this.clockProvider.mesh = this.clockProvider.mesh || new THREE.Mesh(cubeGeometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    mesh.position.y = 64;
    mesh.position.x = -200;
    this.scene.add(mesh);
    return mesh;
  },
  addTextureCube: function (poi, poiVerte = null) {
    let cubeGeometry = new THREE.CubeGeometry(128, 128, 128);
    let ra = Math.random();
    let cueColor = './assets/imgs/webwxgetmsgimg.jpg';
    let map = THREE.ImageUtils.loadTexture(ra > 0.5 ? './assets/imgs/webwxgetmsgimg.jpg' : cueColor);
    let imgMaterial = new THREE.MeshLambertMaterial({map});
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
  },
  /**
   * 场景图
   */
  objectGroupt: function () {
    let cubeGroup = this.cubeGroup = new THREE.Object3D();
    let car = this.car = new THREE.Object3D();

    let mapUrl = "./assets/imgs/cube-3d/ash_uvgrid01.jpg";
    let map = THREE.ImageUtils.loadTexture(mapUrl);
    let material = new THREE.MeshPhongMaterial({map});

    let geometry = new THREE.CubeGeometry(60, 60, 60);
    let cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;
    cube.position.z = -350;
    cube.position.x = -350;
    cube.position.y = 200;
    cubeGroup.add(cube);

    cubeGroup.add(car);
    car.position.set(-500,30, -400);

    let sphereGometry = new THREE.SphereGeometry(30, 80, 80);
    let sphere1 = this.sphere1 = new THREE.Mesh(sphereGometry, material);
    sphere1.castShadow = true;
    sphere1.receiveShadow = false;
    sphere1.position.y = 30;
    car.add(sphere1);


    let cylinderGeometry = new THREE.CylinderGeometry(30, 30, 22, 30, 50);
    let cone = this.cone = new THREE.Mesh(cylinderGeometry, material);
    cone.rotation.z = Math.PI / 2;
    cone.position.set(40,0, 0);
    cone.castShadow = true;
    cone.receiveShadow = false;

    let cone1 = this.cone1 = new THREE.Mesh(cylinderGeometry, material);
    cone1.rotation.z = Math.PI / 2;
    cone1.position.set(-40,0, 0);
    cone1.castShadow = true;
    cone1.receiveShadow = false;

    let cone2 = this.cone2 = new THREE.Mesh(cylinderGeometry, material);
    cone2.rotation.z = Math.PI / 2;
    cone2.position.set(40,0,-100);
    cone2.castShadow = true;
    cone2.receiveShadow = false;

    let cone3 = this.cone3 = new THREE.Mesh(cylinderGeometry, material);
    cone3.rotation.z = Math.PI / 2;
    cone3.position.set(-40,0,-100);
    cone3.castShadow = true;
    cone3.receiveShadow = false;

    car.add(cone);
    car.add(cone1);
    car.add(cone2);
    car.add(cone3);

    this.scene.add(cubeGroup);


  },

  modelLoader: function () {
    let malePath = "./assets/obj/male02/";
    let self = this;
    let onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        let percentComplete = xhr.loaded / xhr.total * 100;
        console.log(percentComplete.toFixed(2) + '% downloaded');
      }
    };
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(malePath);
    mtlLoader.load('male02_dds.mtl', function (materials) {
      materials.preload();
      let objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(malePath);
      objLoader.load('male02.obj', function (object) {
        self.maleCube = object;
        self.maleCube.position.y = 130;
        self.scene.add(self.maleCube);
      }, onProgress, (xhr) => {
        console.log(xhr);
      });
    });
  },

  runAnimate: function () {
    requestAnimationFrame(() => {
      this.runAnimate();
    });
    this.texture.needsUpdate = true;
    this.clockProvider.start();
    this.renderer.render(this.scene, this.camera);
    this.animatePillar(this.pillars);
    this.cubeAnimation();
    this.textureCubeAni();
    this.sphereGroupAnima();
  },
  physi: function () {
    Physijs.scripts.worker = './js/libs/physi/physijs_worker.js';
    Physijs.scripts.ammo = './js/libs/physi/ammo.js';
  },
  init: function () {
    this.generateCamera();
    this.generateScene();
    this.generateRenderer();
    this.generateControl();
    this.initGrid();
    this.setLight();
    this.createSkybox();

    //region 添加内容
    this.pillars = this.addPillar();
    this.addClockCube();
    this.addTextureCube({x: 0, y: 64, z: 0});
    this.addTextureCube({x: 200, y: 64});
    this.addTextureCube({x: 0, y: 64, z: 200});
    this.addTextureCube({}, {x: 200, y: 200, z: 0});
    this.modelLoader();
    this.objectGroupt();
    //endregion

    this.runAnimate();
  },

};
