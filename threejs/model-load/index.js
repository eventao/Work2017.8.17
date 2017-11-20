(function(){
    // function load(cb){
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('get','/model/BoxesEtc01.skp');
    //     xhr.onload = function(event){
    //         cb(event.target.responseText);
    //     };
    //     xhr.send(null);
    // }


    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    let container, stats;
    let camera, controls, scene, renderer;
    let cross;
    let width,height;
    init();
    animate();


    function init() {
        container = document.querySelector( '.container' );
        width = container.clientWidth;
        height = container.clientHeight;

        camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 1e10 );
        camera.position.z = 0.2;
        controls = new THREE.TrackballControls( camera );

        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 5;
        controls.panSpeed = 2;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        scene = new THREE.Scene();
        scene.add( camera );

        // light
        let dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 200, 200, 1000 ).normalize();

        camera.add( dirLight );
        camera.add( dirLight.target );
        let material = new THREE.MeshLambertMaterial( { color:0xff0000, side: THREE.DoubleSide } );
        let loader = new THREE.VTKLoader();
        loader.addEventListener( 'load',
            function ( event ) {
                let geometry = event.content;
                let mesh = new THREE.Mesh( geometry, material );
                mesh.position.setY( - 0.09 );
                scene.add( mesh );
            },
            function(param){
                console.log(param);
            },
            function(){

            }
        );

        loader.load( "../assets/d3-models/bunny.vtk",data => {
            let mesh = new THREE.Mesh( data, material );
            mesh.position.setY( - 0.09 );
            scene.add( mesh );
        });


        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColor( 0xaaaaaa, 1 );

        renderer.setSize( width, height );
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );
        //
        window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );
        controls.handleResize();
    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        renderer.render( scene, camera );
        stats.update();
    }
    
})();