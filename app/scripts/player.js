/*global define */

define(['controls'], function(controls) {

    var PLAYER_SPEED = 200;
    var JUMP_VELOCITY = 1250;
    var GRAVITY = 4000;
    var PLAYER_HALF_WIDTH = 0;
    var COLLISION_PADDING = -13;
    var DEATH_Y = 800;
    var DEATH = 800;

    var Player = function(el, game, death) {
        this.game = game;
        this.el = el;
        this.DEATH = death;
    };

    Player.prototype.reset = function() {

        this.pos = { x: 50, y: 400 };
        this.vel = { x: 0, y: 0 };
    };

    Player.prototype.onFrame = function(delta) {
        // Player input
        this.vel.x = controls.inputVec.x * PLAYER_SPEED;



        // Gravity
        this.vel.y += GRAVITY * delta;

        var oldY = this.pos.y;
        this.pos.x += delta * this.vel.x;
        this.pos.y += delta * this.vel.y;


        // Collision detection
        this.checkPlatforms(oldY);

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
                    // that.game.sound.play('winner');
                }
            }
        });
    };

    return Player;
});
