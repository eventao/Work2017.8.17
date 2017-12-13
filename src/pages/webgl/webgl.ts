import {Component, ViewChild} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import * as mat4 from 'gl-mat4';


@IonicPage()
@Component({
  selector: 'page-webgl',
  templateUrl: 'webgl.html',
})
export class WebglPage {

  @ViewChild('ioncontent') content;
  @ViewChild('canvas') canvas;
  @ViewChild('drawCube') drawCube;
  width: number;
  height: number;
  gl: WebGLRenderingContext;
  square: any;
  vertexShaderSource: string;
  fragmentShaderSource: string;

  shaderProgram;
  shaderVertexPositionAttribute;
  shaderProjectionMatrixUniform;
  shaderModelViewMatrixUniform;
  projectionMatrix;
  modelViewMatrix;




  constructor() {
  }

  ionViewDidEnter() {
    this.init();
    this.generateSquare(this.gl);
    this.initMatrix();
    this.initShaderSource();
    this.initShader(this.gl);
    this.draw(this.gl, this.square);

    this.drawCube.init();

  }

  // 绘制正方形的五个步骤

  // 一、初始化canvas(webgl context)
  init() {
    // this.width = this.content.contentWidth;
    // this.height = this.content.contentHeight;
    this.width = 250;
    this.height = 200;
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;

    //
    let id = 'experimental-webgl';
    // id = "webgl";
    let gl = this.gl = this.canvas.nativeElement.getContext(id);
    gl.viewport(0, 0, this.width, this.height);

  }

  // 二、初始化投影矩阵 和 模型-视图矩阵
  initMatrix() {
    let projectionMatrix, modelViewMatrix;
    modelViewMatrix = this.modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3.333]);
    projectionMatrix = this.projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, this.width / this.height, 1, 10000);
  }

  // 三、准备正方形顶点数据
  generateSquare(gl: WebGLRenderingContext) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let verts = [
      .5, .5, 0.0,
      -.5, .5, 0.0,
      .5, -.5, 0.0,
      -.5, -.5, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    return this.square = {
      buffer: vertexBuffer,
      vertSize: 3,
      nVerts: 4,
      primtype: gl.TRIANGLE_STRIP
    };
  }

  // 四、定义(GLSL语言)着色器资源
  initShaderSource() {
    this.vertexShaderSource = `
      attribute vec3 vertexPos;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      void main(void){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos,1.0);
      }`;

    this.fragmentShaderSource = `
      void main(void){
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);
      }`;

  }

  private static createShader(gl: WebGLRenderingContext, str, type) {
    let shader;
    if (type === 'fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type === 'vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  // 五、构建着色器
  initShader(gl: WebGLRenderingContext) {
    let fragmentShader: WebGLShader = WebglPage.createShader(gl, this.vertexShaderSource, 'vertex');
    let vertexShader: WebGLShader = WebglPage.createShader(gl, this.fragmentShaderSource, 'fragment');
    let shaderProgram = this.shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    let shaderVertexPositionAttribute =
      this.shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vertexPos');
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    this.shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
    this.shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
  }

  // 六、绘制
  draw(gl: WebGLRenderingContext, obj) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.useProgram(this.shaderProgram);

    gl.vertexAttribPointer(
      this.shaderVertexPositionAttribute,
      obj.vertSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.uniformMatrix4fv(this.shaderProjectionMatrixUniform, false, this.projectionMatrix);
    gl.uniformMatrix4fv(this.shaderModelViewMatrixUniform, false, this.modelViewMatrix);

    gl.drawArrays(obj.primtype, 0, obj.nVerts);

  }



}






