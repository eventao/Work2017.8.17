window.utils = window.utils || {};

class ClockPro{
    init(r){
        this.r = r;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width = 2 * r;
        this.canvas.height = this.height = 2 * r;
    }

    draw(){
        this.ctx = this.ctx || this.canvas.getContext('2d');
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.arc(this.r,this.r , this.r-1 , 0 , 2*Math.PI , false);
        this.ctx.stroke();
    }

    drawClockPoint(){
        let total = 12;
        let width = 5;
        let height = 10;
        let unitRadian = 2 * Math.PI / total;
        let rotateRadia = 0.01;
        this.ctx.fillStyle = this.color;
        for(let i = 0; i < total; i++){
            let x,y,edge;
            let raTotal = unitRadian * i;
            y = Math.sin(raTotal) * this.r;
            x = Math.cos(raTotal) * this.r;
            
            // this.ctx.moveTo(x + this.r,y + this.r);
            // this.ctx.lineTo();
            // Math.PI / 2 + raTotal

            this.ctx.fillRect(x + this.r,y + this.r, width , height );
            
        }
    }

    constructor(selector){
        this.color = '#00a1cb';
        let wrapper = document.querySelector(selector);
        let r = wrapper.clientWidth / 2;
        this.init(r);
        wrapper.appendChild(this.canvas);
        this.draw();
        this.drawClockPoint();
    }
}

