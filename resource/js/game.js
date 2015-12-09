/**
 * Created by valentino.ekaputra on 12/9/2015.
 */

Array.prototype.last = function(){
    return this[this.length - 1];
};

var topCanvas = document.getElementById('top-canvas');
var botCanvas = document.getElementById('bottom-canvas');
var topContext = topCanvas.getContext('2d');
var botContext = botCanvas.getContext('2d');

var sprite = document.getElementById('cvs-sprite');

function Game (topCtx, botCtx) {
    this.topCtx = topCtx;
    this.botCtx = botCtx;
    this.delay = 125;
    this.size = 16;
    this.boardSize = { width:14, height: 20 };
    this.offset = { x:46, y:48 };
    this.dir = 1; // 0 top 1 right 2 bot 3 left
    this.tempDir = 1;
    this.snakes = [];
    this.food = new Food(0, 0, this.size);
    this.score = 0;
    this.isPlaying = false;
    this.alive = false;
    this.over = false;
    this.initGame = function() {
        this.isPlaying = true;
        this.alive = true;
        this.over = false;
        this.reset();
        this.gameLoop();
    };
    this.reset = function () {
        this.dir = 1;
        this.tempDir = 1;
        this.score = 0;
        this.snakes = [
            new Snake(8, 5, this.size),
            new Snake(7, 5, this.size),
            new Snake(6, 5, this.size)
        ];
        this.food.randomFood(this.snakes);
    };
    this.gameLoop = function() {
        // render
        this.clearCanvas();
        this.drawField();
        this.drawFood();
        this.drawSnake();
        this.drawInfo();

        // logic
        this.checkDir();
        this.moveSnake();

        // call gameLoop again
        if (this.isPlaying) setTimeout(this.gameLoop.bind(this), this.delay);
        else this.drawPaused();
    };
    this.moveSnake = function() {
        var i;
        // check if snake eat food
        if (this.snakes[0].isEat(this.food)) {
            this.score += this.snakes.length;
            this.snakes.push(new Snake(this.snakes.last().x, this.snakes.last().y, this.size));
            this.food.randomFood(this.snakes);
        }
        // check if snake eat itself
        for (i = 1; i < this.snakes.length; i++) {
            if (this.snakes[0].isEat(this.snakes[i])) {
                this.isPlaying = false;
                this.alive = false;
                this.over = true;
                this.drawGameOver();
            }
        }
        for (i = this.snakes.length - 1; i >= 0; i--) {
            if (i == 0) this.snakes[i].move(this.dir, null);
            else this.snakes[i].move(this.dir, this.snakes[i - 1]);
        }
    };
    this.checkDir = function() {
        if (this.tempDir != this.dir) this.dir = this.tempDir;
    };
    this.turnSnake = function (dir) {
        this.tempDir = dir;
    };
    this.drawField = function() {
        var i, j;
        for (i = 0; i < 22; i++) {
            for (j = 0; j < 16; j++) {
                if (i == 0 || i == 21 || j == 0 || j == 15) {
                    if (i < 10) this.finalDraw(this.topCtx, 80, 0, (this.offset.x - this.size) + j * this.size, (this.offset.y - this.size) + i * this.size);
                    else this.finalDraw(this.botCtx, 80, 0, j * this.size, (i - 10) * this.size);
                } else {
                    if (i < 10) this.finalDraw(this.topCtx, 80, 16, (this.offset.x - this.size) + j * this.size, (this.offset.y - this.size) + i * this.size);
                    else this.finalDraw(this.botCtx, 80, 16, j * this.size, (i - 10) * this.size);
                }
            }
        }
    };
    this.drawSnake = function () {
        var i;
        for (i = this.snakes.length - 1; i >= 0; i--) {
            if (i == 0) this.snakes[i].draw(this.topCtx, this.botCtx, this.offset, this.dir, this.snakes[i+1], null);
            else if (i == this.snakes.length - 1) this.snakes[i].draw(this.topCtx, this.botCtx, this.offset, this.dir, null, this.snakes[i-1]);
            else this.snakes[i].draw(this.topCtx, this.botCtx, this.offset, this.dir, this.snakes[i+1], this.snakes[i-1]);
        }
    };
    this.drawFood = function () {
        this.food.draw(this.topCtx, this.botCtx, this.offset);
    };
    this.drawInfo = function () {
        this.topCtx.font = "16px opensans";
        this.topCtx.fillStyle = "#ffffff";
        this.topCtx.textAlign = "left";
        this.topCtx.fillText("SNAKE DEMO", 32, 24);
        this.topCtx.textAlign = "right";
        this.topCtx.fillText(this.score + " PTS", 288, 24);
    };
    this.drawGameOver = function () {
        this.botCtx.font = "20px opensans";
        this.botCtx.fillStyle = "#ffffff";
        this.botCtx.textAlign = "center";
        this.botCtx.fillText("GAME OVER", 128, 64);
        this.botCtx.fillText("YOU GOT " + this.score + " PTS", 128, 96);
        this.botCtx.fillText("PRESS SPACE TO RETRY", 128, 128);
    };
    this.drawMenu = function() {
        this.clearCanvas();
        this.topCtx.font = "20px opensans";
        this.topCtx.fillStyle = "#ffffff";
        this.topCtx.textAlign = "center";
        this.topCtx.fillText("WELCOME TO SNAKE DEMO", 152, 82);
        this.topCtx.fillText("GOOD LUCK", 152, 110);

        this.botCtx.font = "16px opensans";
        this.botCtx.fillStyle = "#ffffff";
        this.botCtx.textAlign = "center";
        this.botCtx.fillText("PRESS SPACE TO PLAY", 128, 96);
    };
    this.drawPaused = function() {
        this.botCtx.font = "16px opensans";
        this.botCtx.fillStyle = "#ffffff";
        this.botCtx.textAlign = "center";
        this.botCtx.fillText("PRESS SPACE TO CONTINUE", 128, 96);
    };
    this.clearCanvas = function () {
        this.topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
        this.botCtx.clearRect(0, 0, botCanvas.width, botCanvas.height);
    };
    this.finalDraw = function (ctx, sx, sy, x, y) {
        ctx.drawImage(sprite, sx, sy, this.size, this.size, x, y, this.size, this.size);
    };
    this.spacePressed = function () {
        if (!this.isPlaying && !this.alive && !this.over) {
            this.initGame();
        } else if (this.alive && !this.isPlaying) {
            this.isPlaying = true;
            this.gameLoop();
        } else if (this.over) {
            this.reset();
            this.drawMenu();
            this.over = false;
        } else if (this.alive && this.isPlaying) {
            this.isPlaying = false;
        }
    };
}

var game = new Game(topContext, botContext);

window.onload = function () {
    game.drawMenu();
};

document.addEventListener('keydown', function(e) {
    var key = e.keyCode;
    if(game.isPlaying) {
        if (game.tempDir == game.dir) {
            if ((key == 37 || key == 65) && game.dir != 1) game.turnSnake(3); // arrow left
            else if ((key == 38 || key == 87) && game.dir != 2) game.turnSnake(0); // arrow up
            else if ((key == 39 || key == 68) && game.dir != 3) game.turnSnake(1); // arrow right
            else if ((key == 40 || key == 83) && game.dir != 0) game.turnSnake(2); // arrow down
        }
    }
    if(key == 32) { // space
        game.spacePressed();
    }
});