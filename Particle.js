export class Particle {
    constructor(x, y, color, radius, velocity){
        this.life = radius/5;
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        };
        this.alpha = 1;
    }

    draw(ctx){
        ctx.save();

        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }

    update(){
        this.velocity.x*=0.9999;
        this.velocity.y*=0.9999;

        this.x+= this.velocity.x;
        this.y+= this.velocity.y;

        this.alpha-=0.001;
    }

}