
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
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshBasicMaterial( { color: 0x00a1cb } );
    //绘制立方体
    let cube = new THREE.Mesh( geometry, material );
    initObje.camera.position.z = 5;
    initObje.scene.add( cube );

    //动画渲染
    function animate() {
        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;
        cube.rotation.z += 0.1;
        requestAnimationFrame( animate );
        initObje.renderer.render( initObje.scene, initObje.camera );
    }
    animate();

})();

//直线几何结构
(function(){
    let initObje = init('.canvas-wrapper.w2');
    let lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(-2,0,0));
    lineGeometry.vertices.push(new THREE.Vector3(0,2,0));
    lineGeometry.vertices.push(new THREE.Vector3(2,0,0));
    //绘制线
    let lineMaterial = new THREE.LineBasicMaterial({color:0x0000ff});
    let line = new THREE.Line(lineGeometry,lineMaterial);
    initObje.camera.position.z = 5;
    initObje.scene.add(line);
    //动画渲染
    function animate() {
        requestAnimationFrame( animate );
        initObje.renderer.render( initObje.scene, initObje.camera );
    }
    animate();
})();

//burffer geometry 随机线段
(function (){
    let initObje = init('.canvas-wrapper.w3');
    let MAX_POINTS = 500;
    // geometry
    let geometry = new THREE.BufferGeometry();

    // attributes
    let positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

    // draw range
    let drawCount = 2; // draw the first 2 points, only
    geometry.setDrawRange( 0, drawCount );

    // material
    let material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

    // line
    let line = new THREE.Line( geometry,  material );

    //buffer geometry
    let positions1 = line.geometry.attributes.position.array;
    let x, y, z, index;
    x = y = z = index = 0;
    for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {
        positions1[ index ++ ] = x;
        positions1[ index ++ ] = y;
        positions1[ index ++ ] = z;
        x += ( Math.random() - 0.5 ) * 30;
        y += ( Math.random() - 0.5 ) * 30;
        z += ( Math.random() - 0.5 ) * 30;
    }
    line.geometry.setDrawRange( 0,5 );
    initObje.camera.position.z = 5;
    initObje.scene.add( line );
    line.geometry.attributes.position.needsUpdate = true; // required after the first render

    //动画渲染
    function animate() {
        requestAnimationFrame( animate );
        initObje.renderer.render( initObje.scene, initObje.camera );
    }
    animate();
})();

//线段颜色根据端点颜色插入
(function(){
    let wrapper = document.querySelector('.canvas-wrapper.w4');
    let renderer;
    function initThree() {
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        renderer.setSize(width, height);
        wrapper.appendChild(renderer.domElement);
        renderer.setClearColor(0x000000, 1.0);
    }

    let camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 1000;
        camera.position.z = 0;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });
    }

    let scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    let light;
    function initLight() {
        light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        light.position.set(100, 100, 200);
        scene.add(light);
    }

    let cube;
    function initObject() {

        let geometry = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial( { vertexColors: true } );
        let color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );

        // 线的材质可以由2点的颜色决定
        let p1 = new THREE.Vector3( -100, 0, 100 );
        let p2 = new THREE.Vector3(  100, 0, -100 );
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        geometry.colors.push( color1, color2 );

        let line = new THREE.LineSegments( geometry, material );
        // let line = new THREE.Line( geometry, material, THREE.LinePieces );
        scene.add(line);
    }

    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        renderer.clear();
        renderer.render(scene, camera);
    }
    threeStart();
})();

//绘制直角坐标系
(function(){
    let renderer;
    let initThree = function(){
        let wrapper = document.querySelector('.canvas-wrapper.w5');
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias:false
        });
        renderer.setSize(width,height);
        wrapper.appendChild(renderer.domElement);
        renderer.setClearColor(0x000000,1.0);
    };
    let camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 1000;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });

    }

    let scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    let light;
    function initLight() {
        light = new THREE.DirectionalLight(0x000000, 1.0, 0);
        light.position.set(100, 100, 200);
        scene.add(light);
    }

    let cube;
    function initObject() {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( - 500, 0, 0 ) );
        geometry.vertices.push(new THREE.Vector3( 500, 0, 0 ) );

        for ( let i = 0; i <= 20; i ++ ) {
            let line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.2 } ) );
            line.position.y = ( i * 50 ) - 500;
            scene.add( line );

            let line2 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.2 } ) );
            line2.position.x = ( i * 50 ) - 500;
            line2.rotation.z = 90 * Math.PI / 180;
            scene.add( line2 );
        }

    }

    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        renderer.clear();
        renderer.render(scene, camera);
    }
    threeStart();
})();
(function(){
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
})();
//只能用于geometry但不能用户buffer geometry的属性修改。
function aboutGeometry(){
    let geometry = new THREE.Geometry();
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.morphTargetsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
    geometry.tangentsNeedUpdate = true;
    geometry.dynamic = true;
}

//摄像头运动
(function(){
    let renderer;
    function initThree() {
        let wrapper = document.querySelector('.canvas-wrapper.w6');
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        renderer.setSize(width, height);
        wrapper.appendChild(renderer.domElement);
        renderer.setClearColor(0x000000, 1.0);
    }

    let camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 600;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });
    }

    let scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    let light;
    function initLight() {
        light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(100, 100, 200);
        scene.add(light);
        light = new THREE.PointLight(0x00FF00);
        light.position.set(0, 0,300);
        scene.add(light);
    }

    let cube;
    function initObject() {
        let geometry = new THREE.CylinderGeometry( 100,150,400);
        let material = new THREE.MeshLambertMaterial( { color:0xFFFF00} );
        let mesh = new THREE.Mesh( geometry,material);
        mesh.position = new THREE.Vector3(0,0,0);
        scene.add(mesh);
    }

    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        animation();

    }

    let flag = false;
    function animation(){
        //renderer.clear();

        camera.position.x = flag?camera.position.x - 5:camera.position.x + 5;
        if(camera.position.x > 500){
            flag = true;
        }
        if(camera.position.x < -400){
            flag = false;
        }
        console.log(camera.position.x);
        renderer.render(scene, camera);
        requestAnimationFrame(animation);
    }
    threeStart();
})();

//对象本身运动
(function(){
    let renderer;
    function initThree() {
        let wrapper = document.querySelector('.canvas-wrapper.w7');
        let width = wrapper.clientWidth;
        let height = wrapper.clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        renderer.setSize(width, height);
        wrapper.appendChild(renderer.domElement);
        renderer.setClearColor(0x000000, 1.0);
    }

    let camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 600;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });
    }

    let scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    let light;
    function initLight() {
        light = new THREE.AmbientLight(0xFF0000);
        light.position.set(100, 100, 200);
        scene.add(light);
        light = new THREE.PointLight(0x00FF00);
        light.position.set(0, 0,300);
        scene.add(light);
    }

    let cube;
    let mesh;
    function initObject() {
        let geometry = new THREE.CylinderGeometry( 100,150,400);
        let material = new THREE.MeshLambertMaterial( { color:0xFFFFFF} );
        mesh = new THREE.Mesh( geometry,material);
        mesh.position = new THREE.Vector3(0,0,0);
        scene.add(mesh);
    }

    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        animation();

    }
    let flag = false;
    function animation()
    {
        mesh.position.x-=1;

        mesh.position.x = flag?mesh.position.x - 5:mesh.position.x + 5;
        if(mesh.position.x > 500){
            flag = true;
        }
        if(mesh.position.x < -400){
            flag = false;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animation);
    }
    threeStart();
})();

//正投影相机
(function(){

    let renderer;
    function initThree(){
        let wrapper = document.querySelector('.canvas-wrapper.w8');
        let width = wrapper.clientWidth;
        let height = wrapper.clientHeight;
        renderer = new THREE.WebGLRenderer({antialias : true});
        renderer.setSize(width,height);
        wrapper.appendChild(renderer.domElement);
        renderer.setClearColor(0x000000,1.0);
    }

    let camera;
    function initCamera(){
        camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
        camera.position.x = -300;
        camera.position.y = 0;
        camera.position.z = 1000;

        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;

        camera.lookAt({
            x:0,
            y:0,
            z:0
        });
    }

    let scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    let light,pLight;
    function initLight() {
        light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(100, 100, 200);
        scene.add(light);
        pLight = new THREE.PointLight(0x00FF00);
        pLight.position.set(0, 0,300);
        scene.add(pLight);
    }

    let mesh,cube;
    function initObject(){
        let geometry = new THREE.CylinderGeometry(100,150,400);
        let material = new THREE.MeshLambertMaterial({color:0xFFFFFF});
        mesh = new THREE.Mesh(geometry,material);
        scene.add(mesh);
    }
    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        animation();
    }
    function animation(){
        camera.position.x -= 1;
        renderer.render(scene, camera);
        requestAnimationFrame(animation);
    }
    threeStart();
})();

//环境光源
(function(){
    //
    let wrapper = document.querySelector(".canvas-wrapper.w9");
    let renderer,width,height;
    function initThree() {
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        renderer.setSize(width, height);
        wrapper.appendChild(renderer.domElement);
        renderer.setClearColor(0xFFFFFF, 1.0);
    }

    let camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 600;
        camera.position.y = 0;
        camera.position.z = 600;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });
    }

    let scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    let light;
    function initLight() {
        light = new THREE.AmbientLight(0xFF0000);
        light.position.set(100, 100, 200);
        scene.add(light);
    }

    let cube;
    function initObject() {
        let geometry = new THREE.CubeGeometry( 200, 100, 50,4,4);
        let material = new THREE.MeshLambertMaterial( { color:0x880000} );
        let mesh = new THREE.Mesh( geometry,material);
        mesh.position = new THREE.Vector3(0,0,0);
        scene.add(mesh);
    }

    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        renderer.clear();
        renderer.render(scene, camera);
    }
    threeStart();
})();



//材质(materials) ***************************************************************************/
//所有uniforms的值可以自由改变（如颜色，纹理，不透明等），值被发送到(shader-着色器)每帧。
//也可以在任何时候改变与Glstate相关的参数(depthTest, blending, polygonOffset, 等)
//平坦/光滑的阴影被烘烤成法线。您需要重置normals buffer(见上图)。
//下面的属性不能在运行时被轻易的改变
//. uniforms 的数量和类型
//. 光源的数量和类型(numbers and types of lights)
//. 雾(fog)
//. 存在或不存在的
//. 纹理(texture)
//. 顶点颜色（vertex colors）
//. 油漆(skinning)
//. 变形(morphing)
//. 阴影地图(shadow map)
//. α测试(alpha test)
//改变他们需要构建新的着色器，你需要设置

//material.needsUpdate = true
//请记住，这可能相当缓慢，并导致帧速率的不稳定(特别是在Windows上，因为在DirectX上着色器编译比OpenGL慢)。
//要获得更流畅的体验，你可以在某种程度上模拟这些特性的变化，比如零强度灯光、白色纹理或零密度雾等“假”值。
//你可以自由地改变几何块的材料，但是你不能改变物体(根据面料)被分成的块。

//如果你需要在运行时拥有不同的材料配置:
//如果材料/块的数量很小，你可以预先将物体预先划分(例如:头发/脸/身体/上衣裤/人的裤子，前/侧/顶部/玻璃/轮胎/内部的一辆车)。
//如果数字很大(例如，每个面孔可能有可能不同)，考虑一个不同的解决方案，比如使用属性/纹理来驱动不同的外观。

//纹理(Textures) ***************************************************************************/
//Image, canvas, video and data textures 更改后，需要设置下列标志集:
//texture.needsUpdate = true;

//相机(Cameras) ***************************************************************************/
//相机的位置和目标是自动更新的，如果你需要改变。
// fog
// aspect
// near
// far
//然后你需要重新计算投影矩阵:
// camera.aspect = window.innerWidth / window.innerHeight;
// camera.updateProjectionMatrix();



//Matrix transformation (矩阵转换) ***************************************************************************/
//three.js 使用矩阵编码3D变换---translations(位移),rotations(旋转),和scaling(缩放)。
//每一个3D对象的实例都有一个矩阵来存储其位移、旋转、和缩放。 本页描述怎样更新对象的变形。
//方便的属性和matrixAutoUpdate(自动更新矩阵)

//两种方式更新对象的转换
//1、更改对象的位移、四元数(quaternion)、和缩放比例(scale properties)属性，然后让three.js从这些属性中重新计算物体的矩阵:
// object.position.copy(start_position);
//      object.quaternion.copy(quaternion);
//默认情况下matrixAutoUpdate属性为true，矩阵将会自动重新计算，如果对象是静态的或者你希望在重新计算发生时手动控制，
//可将该属性设置为false获得更好的性能。
//      object.matrixAutoUpdate = false;
//在改变任何属性后，手动更新矩阵:
// object.updateMatrix();


//2、直接修改对象的矩阵，Matrix4 类提供了多种修改矩阵的方法
// object.matrix.setRotationFromQuaternion(quaternion);
// 		object.matrix.setPosition(start_position);
// 		object.matrixAutoUpdate = false;

//注意，在本例中matrixAutoUpdate必须设置为false，并且确保不要调用updateMatrix
//调用updateMatrix将clobber完成对矩阵的手动更改，位移、缩放等重新计算矩阵。





