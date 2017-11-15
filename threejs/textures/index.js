
function init(wrapperSelector){
    let wrapper = document.querySelector(wrapperSelector);
    let scene = new THREE.Scene();
    //设置透视相机
    let camera = new THREE.PerspectiveCamera( 75, wrapper.clientWidth / wrapper.clientHeight, 1, 1000 );
    //设置渲染对象
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( wrapper.clientWidth, wrapper.clientHeight );
    wrapper.appendChild( renderer.domElement );
    renderer.setClearColor(0x000000,1.0);
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

    let geometry = new THREE.PlaneGeometry(100,60,1,1);
    geometry.vertices[0].uv = new THREE.Vector2(0.5,0.5);
    geometry.vertices[1].uv = new THREE.Vector2(1.5,0.5);
    geometry.vertices[2].uv = new THREE.Vector2(1.5,1.5);
    geometry.vertices[3].uv = new THREE.Vector2(0.5,1.5);


    let texture = THREE.ImageUtils.loadTexture('../assets/images/skin.jpg',null,t=>{
    });
    let material = new THREE.MeshBasicMaterial( { map: texture } );
    //绘制平面
    let plane = new THREE.Mesh( geometry, material );
    initObje.camera.position.z = 5;
    initObje.scene.add( plane );

    //动画渲染
    function animate() {
        requestAnimationFrame( animate );
        initObje.renderer.render( initObje.scene, initObje.camera );
    }
    animate();

})();

//
(function(){
    let wrapper = document.querySelector('.canvas-wrapper.w2');
    var camera, scene, renderer;
    var mesh;
    var texture;
    
    function start()
    {
        clock();
        init();
        animate();
    }

    function init() {

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( wrapper.clientWidth, wrapper.clientHeight );
        wrapper.appendChild( renderer.domElement );
        //
        camera = new THREE.PerspectiveCamera( 70, wrapper.clientWidth / wrapper.clientHeight, 1, 1000 );
        camera.position.z = 400;
        scene = new THREE.Scene();
        
        var geometry = new THREE.CubeGeometry(150, 150, 150);
        texture = new THREE.Texture( canvas);
        var material = new THREE.MeshBasicMaterial({map:texture});
        texture.needsUpdate = true;
        mesh = new THREE.Mesh( geometry,material );
        scene.add( mesh );

        window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        texture.needsUpdate = true;
        mesh.rotation.y -= 0.01;
        mesh.rotation.x -= 0.01;
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
})();

