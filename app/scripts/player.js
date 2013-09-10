/*global define */

define(['controls'], function(controls) {

    var PLAYER_SPEED = 200;
    var JUMP_VELOCITY = 1250;
    var GRAVITY = 3300;
    var PLAYER_HALF_WIDTH = 14;
    var PLAYER_RADIUS = 30;

    var COLLISION_PADDING = -13;
    var DEATH_Y = 800;
    var DEATH = 800;

    //this.score = 0;


    var Player = function(el, game, death) {
        this.game = game;
        this.el = el;
        this.DEATH = death;
        this.score = 0;
        this.bonus = 0;
    };

    Player.prototype.reset = function() {
        this.pos = { x: 50, y: 400 };
        this.vel = { x: 0, y: 0 };
    };

    Player.prototype.onFrame = function(delta) {
        // Player input
        this.vel.x = controls.inputVec.x * PLAYER_SPEED;
        this.vel.y = controls.inputVec.y * PLAYER_SPEED;

        // Throwing the player through to the other side of the screen
        // Gravity
        //this.vel.y += GRAVITY * delta;

        if (this.pos.x < 0) {
            this.pos.x = 320;
        }
        if (this.pos.x > 320){
            this.pos.x = 0;
        }

        //Highscore

        if (this.score < -this.pos.y) {
            this.score = Math.floor(-this.pos.y);
        }
        $('#score').html(this.score + this.bonus);

        var oldY = this.pos.y;
        this.pos.x += delta * this.vel.x;
        this.pos.y += delta * this.vel.y;


        // Collision detection
        this.checkPlatforms(oldY);
        this.checkEnemies();
        this.checkCoins();

        this.checkGameOver();

        // Update UI
        this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
    };

    Player.prototype.checkGameOver = function() {
        //if (this.pos.y > DEATH_Y) {
        if (this.pos.y > this.DEATH) {
            this.game.gameOver();
        }
    };

    Player.prototype.checkPlatforms = function(oldY) {
        var that = this;

        this.game.forEachPlatform(function(p) {
            // Are we crossing Y.
            if (p.rect.y + COLLISION_PADDING >= oldY && p.rect.y + COLLISION_PADDING < that.pos.y) {

                // Are inside X bounds.
                if (that.pos.x + PLAYER_HALF_WIDTH >= p.rect.x && that.pos.x - PLAYER_HALF_WIDTH <= p.rect.right) {

                    // COLLISION. Make player jump on impact.
                    that.vel.y = 0;
                    that.vel.y += -JUMP_VELOCITY;
                }
            }
        });
    };

    Player.prototype.checkEnemies = function() {
        var centerX = this.pos.x;
        var centerY = this.pos.y - 43;

        var that = this;
        this.game.forEachEnemy(function(enemy) {

            // Distance squared, 32 is half the width of the enemy, 38 is half the height
            var distanceX = (enemy.pos.x + 32) - centerX;
            var distanceY = (enemy.pos.y + 38) - centerY;

            // Minimum distance squared
            var distanceSq = distanceX * distanceX + distanceY * distanceY;
            var minDistanceSq = (enemy.radius + PLAYER_RADIUS) * (enemy.radius + PLAYER_RADIUS);

            // What up?
            if (distanceSq < minDistanceSq) {
                console.log("COLLISION ENEMY!")
                //that.game.sound.play('winner');
                //console.log('player-posX: ' + centerX + ' player-posY: ' + centerY);
                //console.log('enemy-posX: ' + enemy.pos.x + ' enemy-posY: ' + enemy.pos.y);
                //that.game.gameOver();
            }
        });
    };

    Player.prototype.checkCoins = function() {
        var centerX = this.pos.x;
        var centerY = this.pos.y - 43;

        var that = this;
        this.game.forEachCoin(function(coin) {

            // Distance squared
            var distanceX = (coin.rect.x + 20) - centerX;
            var distanceY = (coin.rect.y + 20)- centerY;

            var COIN_RADIUS = 13;
            // Minimum distance squared
            var distanceSq = distanceX * distanceX + distanceY * distanceY;
            var minDistanceSq = (COIN_RADIUS + PLAYER_RADIUS) * (COIN_RADIUS + PLAYER_RADIUS);   //wat why coin pos x?

            // What up?
            if (distanceSq < minDistanceSq) {
                console.log("COLLISION COIN")

                // hide coin
                // increase score by 500
            }
        });
    };

    return Player;
});
