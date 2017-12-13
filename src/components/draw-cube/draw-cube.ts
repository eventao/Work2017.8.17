import {Component, ViewChild,ElementRef } from '@angular/core';
import * as glMatrix from 'gl-matrix/dist/gl-matrix-min.js';

@Component({
  selector: 'draw-cube',
  templateUrl: 'draw-cube.html'
})
export class DrawCubeComponent {
  模型视图矩阵;
  项目矩阵;
  旋转轴;
  mat4;
  vec3;
  cubeWidth:number;
  cubeHeight:number;
  container:HTMLDivElement;
  cubeShaderProgram;
  cubeColorAttr;
  cubePoiAttr;
  shaderModelUniform;
  shaderProUniform;
  cubeDuration = 5000;
  currentCubeTime = Date.now();
  @ViewChild('cubeCanvas') cubeCanvas;
  constructor(public elementRef:ElementRef) {}
  public init(){
    let mat4 = this.mat4 = glMatrix.mat4;
    let vec3 = this.vec3 = glMatrix.vec3;
    this.container = this.elementRef.nativeElement.querySelector('.container');
    this.cubeWidth = this.container.clientWidth;
    this.cubeHeight = this.container.clientHeight;

    function initWebGL(canvas) {

      let gl = null;
      let msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
      try
      {
        gl = canvas.getContext("experimental-webgl");
      }
      catch (e)
      {
        msg = "Error creating WebGL Context!: " + e.toString();
      }

      if (!gl)
      {
        alert(msg);
        throw new Error(msg);
      }

      return gl;
    }

    function initViewport(gl, canvas)
    {
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    let projectionMatrix, modelViewMatrix;
    let rotationAxis;

    function initMatrices(canvas)
    {
      // Create a model view matrix with object at 0, 0, -8
      modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -8]);

      // Create a project matrix with 45 degree field of view
      projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);

      rotationAxis = vec3.create();
      vec3.normalize(rotationAxis, [1, 1, 1]);
    }

    // Create the vertex, color and index data for a multi-colored cube
    function createCube(gl) {

      // Vertex Data
      let vertexBuffer;
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      let verts = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

      // Color data
      let colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0]  // Left face
      ];
      let vertexColors = [];
      for (let i in faceColors) {
        let color = faceColors[i];
        for (let j=0; j < 4; j++) {
          vertexColors = vertexColors.concat(color);
        }
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

      let cubeIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
      let cubeIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
      ];
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

      let cube = {buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
        vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:36,
        primtype:gl.TRIANGLES};

      return cube;
    }

    function createShader(gl, str, type) {
      let shader;
      if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
        return null;
      }

      gl.shaderSource(shader, str);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
    }

    let vertexShaderSource =
      `   attribute vec3 vertexPos;
          attribute vec4 vertexColor;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          varying vec4 vColor;
          void main(void) {
              gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
              vColor = vertexColor;
          }`;

    let fragmentShaderSource =
      `    precision mediump float;
          varying vec4 vColor;
          void main(void) {
          gl_FragColor = vColor;
      }`;


    let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute,
      shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

    function initShader(gl) {

      // load and compile the fragment and vertex shader
      //let fragmentShader = getShader(gl, "fragmentShader");
      //let vertexShader = getShader(gl, "vertexShader");
      let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
      let vertexShader = createShader(gl, vertexShaderSource, "vertex");

      // link them together into a new program
      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      // get pointers to the shader params
      shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
      gl.enableVertexAttribArray(shaderVertexPositionAttribute);

      shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
      gl.enableVertexAttribArray(shaderVertexColorAttribute);

      shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
      shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");


      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
      }
    }

    function draw(gl, obj) {

      // clear the background (with black)
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

      // set the shader to use
      gl.useProgram(shaderProgram);

      // connect up the shader parameters: vertex position, color and projection/model matrices
      // set up the buffers
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
      gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
      gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

      gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
      gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

      // draw the object
      gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }

    let duration = 5000; // ms
    let currentTime = Date.now();
    function animate() {
      let now = Date.now();
      let deltat = now - currentTime;
      currentTime = now;
      let fract = deltat / duration;
      let angle = Math.PI * 2 * fract;
      mat4.rotate(modelViewMatrix, modelViewMatrix, angle, rotationAxis);
    }

    function run(gl, cube) {

      requestAnimationFrame(function() { run(gl, cube); });
      draw(gl, cube);
      animate();
    }


    let canvas = this.cubeCanvas.nativeElement;
    let gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initMatrices(canvas);
    let cube = createCube(gl);
    initShader(gl);
    run(gl, cube);

  }

}
