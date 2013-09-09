/* global define, alert, Howl */

define(['player', 'platform', 'controls'], function(Player, Platform, controls) {
    /**
     * Main game class.
     * @param {Element} el DOM element containig the game.
     * @constructor
     */

    var VIEWPORT_PADDING = 300;
    var TOP_PLATFORM = -900;

    var Game = function(el) {
        this.el = el;
        this.player = new Player(this.el.find('.player'), this, 800);
        this.platformsEl = el.find('.platforms');
        this.worldEl = el.find('.world');
        this.isPlaying = false;

        this.sound = new Howl({
            urls: ['/sounds/chicken.mp3'],
            sprite: {
                winner: [0, 2000]
            }
        });


        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);

        this.platforms = [];
        //this.createPlatforms();
    };

    Game.prototype.freezeGame = function() {
        this.isPlaying = false;
    }

    Game.prototype.unFreezeGame = function() {
        if (!this.isPlaying) {
            this.isPlaying = true;

            // Restart the onFrame loop
            this.lastFrame = +new Date() / 1000;
            requestAnimFrame(this.onFrame);
        }
    };

    Game.prototype.createPlatforms = function() {
        // Ground
        this.addPlatform(new Platform({
            x: 20,
            y: 470,
            width: 280,
            height: 10
        }));

        // Floating platforms
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: 360,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: 260,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: 160,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: 60,
            width: 100,
            height: 10
        }));

        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -100,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -200,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -300,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -400,
            width: 100,
            height: 10
        }));

        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -500,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -600,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -700,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*201) + 10,
            y: -800,
            width: 100,
            height: 10
        }));
    };

    Game.prototype.addPlatform = function(platform) {
        this.platforms.push(platform);
        this.platformsEl.append(platform.el);
    };

    Game.prototype.gameOver = function() {
        this.freezeGame();
        //alert('Wat, why am I not a menu?');

        var game = this;

        $('#game_over').show();

//        setTimeout(function() {
//            game.start();
//        }, 0);
    };

    /**
     * Runs every frame. Calculates a delta and allows each game entity to update itself.
     */
    Game.prototype.onFrame = function() {
        if (!this.isPlaying){
            return;
        }

        var now = +new Date() / 1000,
            delta = now - this.lastFrame;
        this.lastFrame = now;

        controls.onFrame(delta);
        this.player.onFrame(delta);
        // this.updateViewport();

        var that = this;
        var platformsInViewport = 0;
        this.forEachPlatform(function (p,i) {
            var maxY = that.viewport.y + that.viewport.height;


            if (p.rect.y > maxY) {

                var el = that.platforms[i].el;

                that.platforms[i] = new Platform({
                    x: Math.floor(Math.random()*201) + 10,
                    y: TOP_PLATFORM,
                    width: 100,
                    height: 10
                }, el);

                TOP_PLATFORM -= 100;
            }
        });

        this.updateViewport();

        // Request next frame.
        requestAnimFrame(this.onFrame);
    };


    Game.prototype.updateViewport = function() {
        var minY = this.viewport.y + VIEWPORT_PADDING;
        var playerY = this.player.pos.y;

        // Check if game over, 87 is the height of the player so it falls completely out of the screen before game over.
        if (playerY > (this.viewport.y + this.viewport.height + 87)){
            this.gameOver();
        }

        if (playerY < minY) {
            this.viewport.y = playerY - VIEWPORT_PADDING;
        }
        this.worldEl.css({
            //left: -this.viewport.x,
            top: -this.viewport.y
        });
    };


    /**
     * Starts the game.
     */
    Game.prototype.start = function() {
        this.platforms = [];
        this.createPlatforms();
        this.player.reset();
        this.viewport = {x: 0, y:0, width: 320, height: 480};
        this.unFreezeGame();
    };

    Game.prototype.forEachPlatform = function(handler) {
        this.platforms.forEach(handler);
    };

    /**
     * Cross browser RequestAnimationFrame
     */
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    return Game;
});