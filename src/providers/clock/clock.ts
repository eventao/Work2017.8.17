import {Injectable} from '@angular/core';
import {Vector} from "../../models/CommonModel";
/*
  Generated class for the ClockProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClockProvider {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public mesh:any;
  constructor(public center: Vector,
              public radius: number,
              public edge: number,
              public margin: number = 20,
              public color:string = "#00a1cb"
              ) {

    this.canvas = document.createElement('canvas');
    this.canvas.width = 2 * this.radius;
    this.canvas.height = 2 * this.radius;
    this.context = this.canvas.getContext('2d');
  }

  drawCircle(){
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.context.beginPath();
    this.context.fillStyle = "#d46bff";
    this.context.fillRect(0,0,
      this.canvas.width,
      this.canvas.height);

    this.context.strokeStyle = "#00a1cb";
    this.context.arc(
      this.center.x,
      this.center.y,
      this.radius - this.edge,
      0,
      2 * Math.PI,
      false);
    this.context.stroke();

    this.context.fillStyle = "#ffffff";
    this.context.fill();

  }

  drawClockPoint(){
    const total = 60;
    let weight = 1,length = 5;
    let mWeight = 0.3, mLength = 3;
    let unitRadian = 2 * Math.PI / total;
    let r = this.radius - this.margin;

    for (let i = 0; i < total; i++) {
      let isKey = i % 5 === 0;
      let r1 = r - (isKey ? length:mLength);

      this.context.strokeStyle = this.color;
      this.context.lineWidth = isKey ? weight:mWeight;

      let x, y, x1, y1;
      let raTotal = unitRadian * i;
      y = Math.sin(raTotal) * r;
      y += this.radius;
      x = Math.cos(raTotal) * r;
      x += this.radius;

      y1 = Math.sin(raTotal) * r1;
      y1 += this.radius;
      x1 = Math.cos(raTotal) * r1;
      x1 += this.radius;

      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x, y);
      this.context.stroke();
    }
  }

  drawSecondPoint(){
    let now = new Date();
    let second = now.getSeconds();
    this.context.lineWidth = 1;
    let r = this.radius - this.edge;
    let unitSecondsRad = 2 * Math.PI / 60;
    let secondsRad = unitSecondsRad * second;
    let x = Math.cos(secondsRad) * r;
    x += r + this.margin;
    let y = Math.sin(secondsRad) * r;
    y += r + this.margin;

    this.context.beginPath();
    this.context.strokeStyle = "#aaa";
    this.context.moveTo(this.center.x,this.center.y);
    this.context.lineTo(x, y);
    this.context.stroke();
  }

  start(){
    this.drawCircle();
    this.drawClockPoint();
    this.drawSecondPoint();
  }

}
