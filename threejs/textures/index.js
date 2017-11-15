//贴图
// (function(){
    
//     let wrapper,camera,scene,renderer,mesh,width,height;
//     function init(){
//         wrapper = document.querySelector('.canvas-wrapper.w1');
//         width = wrapper.clientWidth;
//         height = wrapper.clientHeight;
//         renderer = new THREE.WebGLRenderer();
//         renderer.setSize(width,height);
//         wrapper.appendChild(renderer.domElement);

//         camera = new THREE.PerspectiveCamera(70,width/height,1,1000);
//         camera.position.z = 400;
//         scene = new THREE.Scene();

//         //A begin
//         let geometry = new THREE.PlaneGeometry(500,300,1,1);
//         geometry.vertices[0].uv = new THREE.Vector2(0,0);
//         geometry.vertices[1].uv = new THREE.Vector2(2,0);
//         geometry.vertices[2].uv = new THREE.Vector2(2,2);
//         geometry.vertices[3].uv = new THREE.Vector2(0,2);
//         // A end


//         //B begin
//         let texture = THREE.ImageUtils.loadTexture('skin.jpg',null,t=>{
            
//         });
//         //let material = THREE.MeshBasicMaterial({map:texture});
//         let material = THREE.MeshBasicMaterial({ color: 0x00a1cb });
//         let mesh = new THREE.Mesh(geometry,material);
//         scene.add(mesh);
//         //B end

//     }

//     function invoke(){
//         init();
//         animate();
//     }

//     function animate(){
//         requestAnimationFrame(animate);
//         renderer.render(scene,camera);
//     }

//     invoke();
// })();


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

    // let geometry = new THREE.BoxGeometry( 1, 1, 1 );

    let geometry = new THREE.PlaneGeometry(500,300,1,1);
    geometry.vertices[0].uv = new THREE.Vector2(0,0);
    geometry.vertices[1].uv = new THREE.Vector2(2,0);
    geometry.vertices[2].uv = new THREE.Vector2(2,2);
    geometry.vertices[3].uv = new THREE.Vector2(0,2);


    let texture = THREE.ImageUtils.loadTexture('../assets/images/skin.jpg',null,t=>{
    });
    // let material = new THREE.MeshBasicMaterial( { color: 0x00a1cb } );
    let material = new THREE.MeshBasicMaterial( { map: texture } );
    //绘制平面
    let plane = new THREE.Mesh( geometry, material );
    initObje.camera.position.z = 5;
    initObje.scene.add( plane );

    //动画渲染
    function animate() {
        // plane.rotation.x += 0.1;
        // plane.rotation.y += 0.1;
        // plane.rotation.z += 0.1;
        requestAnimationFrame( animate );
        initObje.renderer.render( initObje.scene, initObje.camera );
    }
    animate();

})();

