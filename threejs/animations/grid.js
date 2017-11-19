/**
 * Created by evenyuan on 2017/11/18.
 */
(function(){
    let scene,camera,wrapper,width,height,renderer;
    (function init(){
        wrapper = document.querySelector(".container");
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(80,width/height,1,1000);
        camera.position.y = 100;
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(width,height);
        wrapper.appendChild(renderer.domElement);
        renderer.setClearColor(0xffff00,1.0);
    })();

    // 网格的边长是1000，每个小网格的边长是50
    (function initGrid(){
        var helper = new THREE.GridHelper( 1000, 50,0x0000ff, 0x808080 );
        scene.add( helper );
    })();
    renderer.render(scene, camera);

})();