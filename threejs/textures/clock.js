window.utils = window.utils || {};

class ClockPro {
    init(r) {
        this.center = {
            x:r,
            y:r
        };
        this.margin = 20;
        this.r = r - this.margin;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width = 2 * r;
        this.canvas.height = this.height = 2 * r;
    }

    draw() {
        this.ctx = this.ctx || this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();

        //背景
        this.ctx.fillStyle = "#ffff00";
        this.ctx.fillRect(0,0, this.width,this.height);

        this.ctx.strokeStyle = this.color;
        this.ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawClockPoint() {
        const total = 12;
        let weight = 5,length = 15;
        let mWeight = 3, mLength = 10;
        let unitRadian = 2 * Math.PI / total;
        let r = this.r - this.edge;
        for (let i = 0; i < total; i++) {
            let isKey = i % 3 === 0;
            let r1 = r - (isKey ? length:mLength);
            this.ctx.beginPath();

            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = isKey ? weight:mWeight;

            let x, y, x1, y1;
            let raTotal = unitRadian * i;
            y = Math.sin(raTotal) * r;
            y += this.r + this.margin;
            x = Math.cos(raTotal) * r;
            x += this.r + this.margin;

            y1 = Math.sin(raTotal) * r1;
            y1 += this.r + this.margin;
            x1 = Math.cos(raTotal) * r1;
            x1 += this.r + this.margin;

            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    drawSecondPoint(){
        let now = new Date();
        console.log(now.getTime());
        let second = now.getSeconds();
        this.ctx.lineWidth = 1;
        let r = this.r - this.edge;
        let unitSecondsRad = 2 * Math.PI / 60;
        let secondsRad = unitSecondsRad * second;
        secondsRad -= Math.PI / 2;
        let x = Math.cos(secondsRad) * r;
        x += this.r + this.margin;
        let y = Math.sin(secondsRad) * r;
        y += this.r + this.margin;

        this.ctx.beginPath();
        this.ctx.strokeStyle = "#aaa";
        this.ctx.moveTo(this.center.x,this.center.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    start(){
        this.draw();
        this.drawClockPoint();
        this.drawSecondPoint();
        let self = this;
        requestAnimationFrame(function(){
            self.start.call(self);
        });
    }

    constructor(radius) {
        this.edge = 5;
        this.color = '#00a1cb';
        this.init(radius);
        this.start();
    }
}

