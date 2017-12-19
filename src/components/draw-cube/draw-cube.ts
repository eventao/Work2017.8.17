import {Component, ElementRef} from '@angular/core';
import * as glMatrix from "gl-matrix";

@Component({
  selector: 'draw-cube',
  templateUrl: 'draw-cube.html'
})
export class DrawCubeComponent {
  cubeCanvas: HTMLCanvasElement;
  public width: number;
  public height: number;
  mat4;
  vec3;
  projectionMatrix;
  modelViewMatrix;
  rotationAxis;
  shaderProgram;
  shaderVertexPositionAttribute;
  shaderVertexColorAttribute;
  shaderProjectionMatrixUniform;
  shaderModelViewMatrixUniform;
  duration = 5000; // ms
  currentTime = Date.now();

  constructor(public elementRef: ElementRef) {
  }

  initWebGL(canvas) {
    return canvas.getContext("webgl");
  }

  initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  initMatrices(canvas) {
    let projectionMatrix,
      modelViewMatrix,
      rotationAxis;

    modelViewMatrix = this.modelViewMatrix = this.mat4.create();
    this.mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -8]);

    projectionMatrix = this.projectionMatrix = this.mat4.create();
    this.mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);

    rotationAxis = this.rotationAxis = this.vec3.create();
    this.vec3.normalize(rotationAxis, [1, 1, 1]);
    return {
      projectionMatrix,
      modelViewMatrix,
      rotationAxis
    };

  }

  draw(gl, obj) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.vertexAttribPointer(this.shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
    gl.vertexAttribPointer(this.shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

    gl.uniformMatrix4fv(this.shaderProjectionMatrixUniform, false, this.projectionMatrix);
    gl.uniformMatrix4fv(this.shaderModelViewMatrixUniform, false, this.modelViewMatrix);

    gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
  }

  createCube(gl) {

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let verts = [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0
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
      for (let j = 0; j < 4; j++) {
        vertexColors = vertexColors.concat(color);
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn)
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    let cubeIndices = [
      0, 1, 2, 0, 2, 3,    // Front face
      4, 5, 6, 4, 6, 7,    // Back face
      8, 9, 10, 8, 10, 11,  // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    return {
      buffer: vertexBuffer, colorBuffer: colorBuffer, indices: cubeIndexBuffer,
      vertSize: 3, nVerts: 24, colorSize: 4, nColors: 24, nIndices: 36,
      primtype: gl.TRIANGLES
    };
  }

  createShader(gl, str, type) {
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

  initShader(gl) {
    const vertexShaderSource =
      `   attribute vec3 vertexPos;
          attribute vec4 vertexColor;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          varying vec4 vColor;
          void main(void) {
              gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
              vColor = vertexColor;
          }`;

    const fragmentShaderSource =
      `precision mediump float;
          varying vec4 vColor;
          void main(void) {
          gl_FragColor = vColor;
      }`;

    let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute;

    let fragmentShader = this.createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = this.createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = this.shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute =
      this.shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute =
      this.shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    this.shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");

    this.shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
  }

  animate() {
    let now = Date.now();
    let deltat = now - this.currentTime;
    this.currentTime = now;
    let fract = deltat / this.duration;
    let angle = Math.PI * 2 * fract;
    this.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, this.rotationAxis);
  }

  run(gl, cube) {
    let self = this;
    requestAnimationFrame(function () {
      self.run(gl, cube);
    });
    this.draw(gl, cube);
    this.animate();
  }

  initCanvasSize() {
    let container = this.elementRef.nativeElement.querySelector(".container");
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.cubeCanvas = this.elementRef.nativeElement.querySelector("#cubeCanvas");
    this.cubeCanvas.width = this.width;
    this.cubeCanvas.height = this.height;
  }

  public init() {
    this.mat4 = glMatrix.mat4;
    this.vec3 = glMatrix.vec3;

    this.initCanvasSize();

    let gl = this.initWebGL(this.cubeCanvas);
    this.initViewport(gl, this.cubeCanvas);
    this.initMatrices(this.cubeCanvas);
    let cube = this.createCube(gl);
    this.initShader(gl);
    this.run(gl, cube);
  }

}
