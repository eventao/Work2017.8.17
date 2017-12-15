import {Component, ElementRef} from '@angular/core';


@Component({
  selector: 'draw-cube2',
  templateUrl: 'draw-cube2.html'
})
export class DrawCube2Component {

  vertexShaderSource =`attribute vec3 vertexPos;
        attribute vec2 texCoord;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vTexCoord;
        void main(void) {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
            vTexCoord = texCoord;
        }`;
  fragmentShaderSource =`precision mediump float;
        varying vec2 vTexCoord;
        uniform sampler2D uSampler;
        void main(void) {
          gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
      }`;

  constructor(public elementRef:ElementRef) {}

  initCanvasSize(){

  }

  initWebGl(){

  }

  initViewport(gl,canvas){}

  initMatrices(canvas){

  }

  createCube(gl){

  }

  createShader(gl,str,type){

  }

  handleTextureLoaded(gl,texture){

  }

  initShader(gl){

  }

  initTexture(gl){

  }

  draw(gl,cube){

  }

}
