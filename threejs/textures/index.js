
function init(wrapperSelector){
    let wrapper = document.querySelector(wrapperSelector);
    let scene = new THREE.Scene();
    //设置透视相机
    let camera = new THREE.PerspectiveCamera( 80, wrapper.clientWidth / wrapper.clientHeight, 1, 1000 );
    //设置渲染对象
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( wrapper.clientWidth, wrapper.clientHeight );
    wrapper.appendChild( renderer.domElement );
    renderer.setClearColor(0xffffff,1.0);
    return {
        scene,
        camera,
        renderer,
        rende:function(){
            this.renderer.render(this.scene, this.camera);
        }
    }
}


//立方体几何结构
(function(){
    let initObje = init('.canvas-wrapper.w1');

    // let geometry = new THREE.PlaneGeometry(300,300,1,1);
    // geometry.vertices[0].uv = new THREE.Vector2(0.5,0.5);
    // geometry.vertices[1].uv = new THREE.Vector2(1.5,0.5);
    // geometry.vertices[2].uv = new THREE.Vector2(1.5,1.5);
    // geometry.vertices[3].uv = new THREE.Vector2(0.5,1.5);

    let cubeGeometry = new THREE.CubeGeometry(300, 300, 300);

    let clockPro = new ClockPro(100);

    let texture = new THREE.Texture(clockPro.canvas);
    texture.needsUpdate = true;
    let material = new THREE.MeshBasicMaterial( { map: texture } );
    //绘制平面
    let mesh = new THREE.Mesh( cubeGeometry, material );
    initObje.camera.position.z = 500;
    initObje.scene.add( mesh );

    //动画渲染
    function animate() {
        requestAnimationFrame( animate );
        mesh.rotation.y -= 0.01;
        mesh.rotation.x -= 0.01;
        texture.needsUpdate = true;
        initObje.renderer.render( initObje.scene, initObje.camera );
    }
    animate();

})();



