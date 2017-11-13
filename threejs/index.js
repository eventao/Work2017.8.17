let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1 ,500);
camera.position.set(0,0,100);
camera.lookAt(new THREE.Vector3(0,0,0));

let material = new THREE.LineBasicMaterial({color:0x0000ff});
let geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(0,14.1,0));
geometry.vertices.push(new THREE.Vector3(4.6,4.8,0));
geometry.vertices.push(new THREE.Vector3(14.9,3.4,0));
geometry.vertices.push(new THREE.Vector3(7.5,-3.9,0));
geometry.vertices.push(new THREE.Vector3(9.2,-14.1,0));
geometry.vertices.push(new THREE.Vector3(0,-9.4,0));
geometry.vertices.push(new THREE.Vector3(-9.2,-14.1,0));
geometry.vertices.push(new THREE.Vector3(-7.5,-3.9,0));
geometry.vertices.push(new THREE.Vector3(-14.9,3.4,0));
geometry.vertices.push(new THREE.Vector3(-4.6,4.8,0));
geometry.vertices.push(new THREE.Vector3(0,14.1,0));

let line = new THREE.Line(geometry,material);
scene.add(line);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.render(scene,camera);