import {Component, ElementRef} from '@angular/core';
import * as glMatrix from 'gl-matrix';

@Component({
  selector: 'draw-cube-texture',
  templateUrl: 'draw-cube-texture.html'
})
export class DrawCubeTextureComponent {
  cubeCanvas: HTMLCanvasElement;
  public width: number;
  public height: number;
  mat4;
  vec3;
  modelViewMatrix;
  projectionMatrix;
  rotationAxis;
  shaderTexCoordAttribute;
  shaderProjectionMatrixUniform;
  shaderModelViewMatrixUniform;
  shaderSamplerUniform;

  shaderProgram;
  shaderVertexPositionAttribute;
  shaderVertexColorAttribute;

  vertexShaderSource =

    "    attribute vec3 vertexPos;\n" +
    "    attribute vec2 texCoord;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec2 vTexCoord;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the texture coordinate in vTexCoord\n" +
    "        vTexCoord = texCoord;\n" +
    "    }\n";

  fragmentShaderSource =
    "    precision mediump float;\n" +
    "    varying vec2 vTexCoord;\n" +
    "    uniform sampler2D uSampler;\n" +
    "    void main(void) {\n" +
    "    // Return the pixel color: always output white\n" +
    "    gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));\n" +
    "}\n";
  okToRun: boolean;
  webGLTexture: any;
  duration = 5000; // ms
  currentTime = Date.now();


  constructor(public elementErf: ElementRef) {
  }

  initCanvasSize() {
    let container = this.elementErf.nativeElement.querySelector('.container');
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.cubeCanvas = this.elementErf.nativeElement.querySelector('#cubeCanvas');
    this.cubeCanvas.width = this.width;
    this.cubeCanvas.height = this.height;
  }

  initWebGL() {
    return this.cubeCanvas.getContext('webgl');
  }

  initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  initMatrices(canvas) {
    // Create a model view matrix with object at 0, 0, -8
    this.modelViewMatrix = this.mat4.create();
    this.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -8]);

    // Create a project matrix with 45 degree field of view
    this.projectionMatrix = this.mat4.create();
    this.mat4.perspective(this.projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);

    this.rotationAxis = this.vec3.create();
    this.vec3.normalize(this.rotationAxis, [1, 1, 1]);
  }

  // Create the vertex, color and index data for a multi-colored cube
  createCube(gl) {

    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
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

    let texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    let textureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

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
      buffer: vertexBuffer, texCoordBuffer: texCoordBuffer, indices: cubeIndexBuffer,
      vertSize: 3, nVerts: 24, texCoordSize: 2, nTexCoords: 24, nIndices: 36,
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


  handleTextureLoaded(gl, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.okToRun = true;
  }

  initShader(gl) {

    // load and compile the fragment and vertex shader
    //let fragmentShader = getShader(gl, "fragmentShader");
    //let vertexShader = getShader(gl, "vertexShader");
    let fragmentShader = this.createShader(gl, this.fragmentShaderSource, "fragment");
    let vertexShader = this.createShader(gl, this.vertexShaderSource, "vertex");

    // link them together into a new program
    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    // get pointers to the shader params
    this.shaderVertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(this.shaderVertexPositionAttribute);

    this.shaderTexCoordAttribute = gl.getAttribLocation(this.shaderProgram, "texCoord");
    gl.enableVertexAttribArray(this.shaderTexCoordAttribute);

    this.shaderProjectionMatrixUniform = gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
    this.shaderModelViewMatrixUniform = gl.getUniformLocation(this.shaderProgram, "modelViewMatrix");
    this.shaderSamplerUniform = gl.getUniformLocation(this.shaderProgram, "uSampler");

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
  }

  initTexture(gl) {
    this.webGLTexture = gl.createTexture();
    this.webGLTexture.image = new Image();
    this.webGLTexture.image.onload = () => {
      this.handleTextureLoaded(gl, this.webGLTexture)
    };

    this.webGLTexture.image.src = "../assets/images/webgl-logo-256.jpg";
  }

  draw(gl, obj) {

    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(this.shaderProgram);

    // connect up the shader parameters: vertex position, texture coordinate,
    // projection/model matrices and texture
    // set up the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.vertexAttribPointer(this.shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoordBuffer);
    gl.vertexAttribPointer(this.shaderTexCoordAttribute, obj.texCoordSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

    gl.uniformMatrix4fv(this.shaderProjectionMatrixUniform, false, this.projectionMatrix);
    gl.uniformMatrix4fv(this.shaderModelViewMatrixUniform, false, this.modelViewMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.webGLTexture);
    gl.uniform1i(this.shaderSamplerUniform, 0);

    // draw the object
    gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
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
    if (this.okToRun) {
      this.draw(gl, cube);
      this.animate();
    }
  }

  invoke() {
    let gl = this.initWebGL();
    this.initViewport(gl, this.cubeCanvas);
    this.initMatrices(this.cubeCanvas);
    let cube = this.createCube(gl);
    this.initShader(gl);
    this.initTexture(gl);
    this.run(gl, cube);
  }

  public init() {
    this.mat4 = glMatrix.mat4;
    this.vec3 = glMatrix.vec3;
    this.initCanvasSize();
    let gl = this.initWebGL();
    this.initViewport(gl, this.cubeCanvas);
    this.invoke();
  }


}
