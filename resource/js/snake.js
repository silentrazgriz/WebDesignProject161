/**
 * Created by valentino.ekaputra on 12/9/2015.
 */

function Snake (x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.spritePos = [
        // head - top, right, bot, left
        {x:0, y:0},
        {x:16, y:0},
        {x:32, y:0},
        {x:48, y:0},
        // tail - top, right, bot, left
        {x:0, y:16},
        {x:16, y:16},
        {x:32, y:16},
        {x:48, y:16},
        // corner - topright, topleft, botright, botleft
        {x:0, y:32},
        {x:16, y:32},
        {x:32, y:32},
        {x:48, y:32},
        // straight - horizontal, vertical
        {x:64, y:0},
        {x:64, y:16}
    ];
    this.move = function(dir, prev) {
        if (prev == null) {
            if (dir == 0) this.y--;
            else if (dir == 1) this.x++;
            else if (dir == 2) this.y++;
            else this.x--;

            if (this.y == -1) this.y = 19;
            else if (this.y == 20) this.y = 0;
            if (this.x == -1) this.x = 13;
            else if (this.x == 14) this.x = 0;
        } else {
            this.x = prev.x;
            this.y = prev.y;
        }
    };
    this.draw = function(topCtx, botCtx, offset, dir, next, prev) {
        var spriteIndex = -1;
        if (prev == null) { // head
            spriteIndex = dir;
        } else if (next == null) { // tail
            if (prev.y == this.y - 1 || (this.y == 0 && prev.y == 19)) spriteIndex = 4;
            else if (prev.x == this.x + 1 || (this.x == 13 && prev.x == 0)) spriteIndex = 5;
            else if (prev.y == this.y + 1 || (this.y == 19 && prev.y == 0)) spriteIndex = 6;
            else if (prev.x == this.x - 1 || (this.x == 0 && prev.x == 13)) spriteIndex = 7;
        } else {
            if (this.isHorizontal(next, prev)) spriteIndex = 12;
            else if (this.isVertical(next, prev)) spriteIndex = 13;
            else if (this.isTopRight(next, prev)) spriteIndex = 8;
            else if (this.isTopLeft(next, prev)) spriteIndex = 9;
            else if (this.isBottomRight(next, prev)) spriteIndex = 10;
            else if (this.isBottomLeft(next, prev)) spriteIndex = 11;
        }

        if (spriteIndex != -1) {
            if (this.y < 9) this.drawTop(topCtx, offset, spriteIndex);
            else this.drawBot(botCtx, spriteIndex);
        } else {
            console.log ('snakedraw ' + spriteIndex);
            console.log ();
            console.log (prev);
        }
    };
    this.drawTop = function (ctx, offset, i) {
        this.finalDraw(ctx, this.spritePos[i].x, this.spritePos[i].y, offset.x + this.x * this.size, offset.y + this.y * this.size);
    };
    this.drawBot = function (ctx, i) {
        this.finalDraw(ctx, this.spritePos[i].x, this.spritePos[i].y, this.size + this.x * this.size, (this.y - 9) * this.size);
    };
    this.finalDraw = function (ctx, sx, sy, x, y) {
        ctx.drawImage(sprite, sx, sy, this.size, this.size, x, y, this.size, this.size);
    };
    this.isTopRight = function (next, prev) {
        return (prev.x == this.x + 1 && next.y == this.y - 1) || (next.x == this.x + 1 && prev.y == this.y - 1) || // normal top right
            (prev.x == 0 && this.x == 13 && next.y == this.y - 1) || (next.x == 0 && this.x == 13 && prev.y == this.y - 1) || // most left & warp, top
            (prev.y == 19 && this.y == 0 && next.x == this.x + 1) || (next.y == 19 && this.y == 0 && prev.x == this.x + 1) || // most bottom & warp, right
            (this.y == 0 && this.x == 13 && ((prev.y == 19 && next.x == 0) || (next.y == 19 && prev.x == 0))); // top right corner
    };
    this.isTopLeft = function (next, prev) {
        return (prev.x == this.x - 1 && next.y == this.y - 1) || (next.x == this.x - 1 && prev.y == this.y - 1) || // normal top left
            (prev.x == 13 && this.x == 0 && next.y == this.y - 1) || (next.x == 13 && this.x == 0 && prev.y == this.y - 1) || // most right & warp, top
            (prev.y == 19 && this.y == 0 && next.x == this.x - 1) || (next.y == 19 && this.y == 0 && prev.x == this.x - 1) || // most bottom & warp, left
            (this.y == 0 && this.x == 0 && ((prev.y == 19 && next.x == 13) || (next.y == 19 && prev.x == 13))); // top left corner
    };
    this.isBottomRight = function (next, prev) {
        return (prev.x == this.x + 1 && next.y == this.y + 1) || (next.x == this.x + 1 && prev.y == this.y + 1) || // normal bottom right
            (prev.x == 0 && this.x == 13 && next.y == this.y + 1) || (next.x == 0 && this.x == 13 && prev.y == this.y + 1) || // most left & warp, bottom
            (prev.y == 0 && this.y == 19 && next.x == this.x + 1) || (next.y == 0 && this.y == 19 && prev.x == this.x + 1) || // most top & warp, right
            (this.y == 19 && this.x == 13 && ((prev.y == 0 && next.x == 0) || (next.y == 0 && prev.x == 0))); // bottom right corner
    };
    this.isBottomLeft = function (next, prev) {
        return (prev.x == this.x - 1 && next.y == this.y + 1) || (next.x == this.x - 1 && prev.y == this.y + 1) || // normal bottom left
            (prev.x == 13 && this.x == 0 && next.y == this.y + 1) || (next.x == 13 && this.x == 0 && prev.y == this.y + 1) || // most right & warp, bottom
            (prev.y == 0 && this.y == 19 && next.x == this.x - 1) || (next.y == 0 && this.y == 19 && prev.x == this.x - 1) || // most top & warp, left
            (this.y == 19 && this.x == 0 && ((prev.y == 0 && next.x == 13) || (next.y == 0 && prev.x == 13))); // bottom left corner
    };
    this.isHorizontal = function (next, prev) {
        return (prev.y == this.y && next.y == this.y);
    };
    this.isVertical = function (next, prev) {
        return (prev.x == this.x && next.x == this.x);
    };
    this.isEat = function (food) {
        return (this.x == food.x && this.y == food.y);
    };
}