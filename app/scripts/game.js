/*global define, $ */

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
            y: 570,
            width: 280,
            height: 10
        }));

        // Outside viewport platforms
        this.addPlatform(new Platform({
            x: 80,
            y: -30,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 30,
            y: -90,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 200,
            y: -150,
            width: 100,
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
            y: 408,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 675,
            y: 188,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 750,
            y: 308,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 620,
            y: 388,
            width: 100,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: 450,
            y: 438,
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
        this.viewport = {x: 0, y:100, width: 320, height: 480};
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