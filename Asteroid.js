export class Asteroid {
    constructor(x, y, color, radius, velocity){
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        };
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(){
        this.x+= this.velocity.x;
        this.y+= this.velocity.y;
    }

}