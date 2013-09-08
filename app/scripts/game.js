/* global define, alert, Howl */

define(['player', 'platform'], function(Player, Platform) {
    /**
     * Main game class.
     * @param {Element} el DOM element containig the game.
     * @constructor
     */

    var VIEWPORT_PADDING = 100;

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
        this.createPlatforms();
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
            x: 120,
            y: 50,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 80,
            y: 308,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 30,
            y: 188,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 170,
            y: 358,
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
        alert('Wat, why am I not a menu?');

        var game = this;
        setTimeout(function() {
            game.start();
        }, 0);
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

        this.player.onFrame(delta);
        // this.updateViewport();

        var that = this;

        var platformsInViewport = 0;
        this.forEachPlatform(function (p,i) {
            //console.log(p.rect.y);
            //console.log(that.viewport.y);
            //console.log(that.viewport.height);
            //console.log(p.rect.y);
            if (that.viewport.y <= p.rect.y && p.rect.y <= that.viewport.y + that.viewport.height ) {
                //console.log("wat");
                platformsInViewport++;
            }
        });

        //console.log(platformsInViewport);
        if (platformsInViewport <= 4) {
            //console.log("Num of platforms in viewport: " + platformsInViewport);
            // create a random platform
            this.addPlatform(new Platform({
                x: 10,
                y: -100,
                width: 100,
                height: 10
            }));
        }
        this.updateViewport();

        // Request next frame.
        requestAnimFrame(this.onFrame);
    };


    Game.prototype.updateViewport = function() {
        var minY = this.viewport.y + VIEWPORT_PADDING;
        var maxY = this.viewport.y + this.viewport.width - VIEWPORT_PADDING;

        var playerY = this.player.pos.y;

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