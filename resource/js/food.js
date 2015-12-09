/**
 * Created by valentino.ekaputra on 12/9/2015.
 */

function Food (x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.draw = function (topCtx, botCtx, offset) {
        if (this.y < 9) this.finalDraw(topCtx, 64, 32, offset.x + (this.x * this.size), offset.y + (this.y * this.size));
        else this.finalDraw(botCtx, 64, 32, this.size + this.x * this.size, (this.y - 9) * this.size);
    };
    this.randomFood = function (snakes) {
        var i;
        var temp = [];
        var pos = [];
        for (i = 0; i < snakes.length; i++) {
            temp.push(snakes[i].y * 14 + snakes[i].x);
        }
        for (i = 0; i < 20; i++) {
            for (j = 0; j < 14; j++) {
                if (temp.indexOf(i * 14 + j) == -1) {
                    pos.push({x:j,y:i});
                }
            }
        }
        var n = Math.floor(Math.random() * pos.length);
        this.x = pos[n].x;
        this.y = pos[n].y;
    };
    this.finalDraw = function (ctx, sx, sy, x, y) {
        ctx.drawImage(sprite, sx, sy, this.size, this.size, x, y, this.size, this.size);
    };
}