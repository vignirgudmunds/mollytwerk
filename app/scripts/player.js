/*global define */

define(['controls'], function(controls) {

    var PLAYER_SPEED = 200;
    var JUMP_VELOCITY = 1250;
    var GRAVITY = 4000;
    var PLAYER_HALF_WIDTH = 0;

    var Player = function(el, game) {
        this.game = game;
        this.el = el;
        this.jumping = false;
        this.pos = { x: 650, y: 570 };
        this.vel = { x: 0, y: 0 };
    };

    Player.prototype.onFrame = function(delta) {
        // Player input
        if (controls.keys.right) {
            this.vel.x = PLAYER_SPEED;
        }
        else if (controls.keys.left) {
            this.vel.x = -PLAYER_SPEED;
        }
        else {
            this.vel.x = 0;
        }



        // Gravity
        this.vel.y += GRAVITY * delta;

        var oldY = this.pos.y;
        this.pos.x += delta * this.vel.x;
        this.pos.y += delta * this.vel.y;


        // Collision detection
        this.checkPlatforms(oldY);

        // Update UI
        this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
    };

    Player.prototype.checkPlatforms = function(oldY) {
        var that = this;

        this.game.forEachPlatform(function(p) {
            // Are we crossing Y.
            if (p.rect.y >= oldY && p.rect.y < that.pos.y) {

                // Are inside X bounds.
                if (that.pos.x + PLAYER_HALF_WIDTH >= p.rect.x && that.pos.x - PLAYER_HALF_WIDTH <= p.rect.right) {

                    // COLLISION. Make player jump on impact.
                    that.vel.y = 0;
                    that.vel.y += -JUMP_VELOCITY;

                }
            }
        });
    };

    return Player;
});
