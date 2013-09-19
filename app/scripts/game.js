/* global define, alert, Howl */

define(['player', 'platform', 'enemy', 'coin', 'controls'], function(Player, Platform, Enemy, Coin, controls) {
    /**
     * Main game class.
     * @param {Element} el DOM element containing the game.
     * @constructor
     */

    //var VIEWPORT_PADDING = 260;
    var platformCnt = 0;

    var Game = function(el) {
        this.el = el;
        this.player = new Player(this.el.find('.player'), this, 800);
        this.entities = [];
        this.platformsEl = el.find('.platforms');
        this.coinsEl = el.find('.coins');
        this.entitiesEl = el.find('.entities');
        this.worldEl = el.find('.world');
        this.isPlaying = false
        this.viewportPadding = 260;

        if (localStorage.getItem("highscores") === null){
            this.highscores = [];
        }else{
            this.highscores = JSON.parse(localStorage.getItem('highscores'));
        }

        this.soundCoin = new Howl({
            urls: ['/sounds/coin.mp3', '/sounds/coin.ogg'],
            sprite: {
                coin: [0, 1000]
            }
        });

        this.soundJump = new Howl({
            urls: ['/sounds/molly-jump-short.mp3', '/sounds/molly-jump-short.ogg'],
            sprite: {
              jump: [0, 330]
            },
            volume: 0.2
        });

        this.soundDead = new Howl({
            urls: ['/sounds/molly-dead.mp3', '/sounds/molly-dead.ogg'],
            sprite: {
                mollyDead: [0, 3000]
            }
        });

        this.soundLaugh = new Howl({
            urls: ['/sounds/molly-laugh.mp3', '/sounds/molly-laugh.ogg'],
            sprite: {
                enemyKill: [0, 1000]
            }
        });

        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);

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

    Game.prototype.createWorld = function() {
        // Ground
        this.addPlatform(new Platform({
            x: 20,
            y: 470,
            width: 280,
            height: 10
        }));

        // Floating platforms
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: 400,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: 320,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: 240,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: 160,
            width: 70,
            height: 10
        }));

        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: 80,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: 0,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: -80,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: -160,
            width: 70,
            height: 10
        }));

        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: -240,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: -320,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: -400,
            width: 70,
            height: 10
        }));
        this.addPlatform(new Platform({
            x: Math.floor(Math.random()*211) + 5,
            y: -480,
            width: 70,
            height: 10
        }));

        this.addEnemy(new Enemy({
            start: {x: 260, y: -2000},
            end: {x: 260, y: -1900}
        }));


        this.addCoin(new Coin({
            x: Math.floor(Math.random()*211) + 5,
            y: -100,
            width: 40,
            height: 40
        }));


    };

    Game.prototype.addPlatform = function(platform) {
        this.entities.push(platform);
        this.platformsEl.append(platform.el);
    };

    Game.prototype.addCoin = function(coin) {
        this.entities.push(coin);
        this.coinsEl.append(coin.el);
    };

    Game.prototype.addEnemy = function(enemy) {
        this.entities.push(enemy);
        this.entitiesEl.append(enemy.el);
    };

    Game.prototype.gameOver = function() {
        this.freezeGame();
        var game = this;

        this.soundDead.play('mollyDead');
        $('#user_score').html("You scored: " + this.player.score + " points.")
        $('#game_over').show();
    };


    /**
     * Runs every frame. Calculates a delta and allows each game entity to update itself.
     */
    Game.prototype.onFrame = function() {
        if (!this.isPlaying){
            return;
        }

        //console.log(this.player.score + this.player.bonus);
        /*if (this.player.score + this.player.bonus > 5000) {
            this.viewportPadding = 290;
            console.log(this.viewportPadding);
        }
        else if (this.player.score + this.player.bonus > 15000) {
            this.viewportPadding = 320;
        }     */
        //console.log(this.VIEWPORT_PADDING);

        var now = +new Date() / 1000,
            delta = now - this.lastFrame;
        this.lastFrame = now;

        controls.onFrame(delta);
        this.player.onFrame(delta);

        for (var i = 0, e; e = this.entities[i]; i++) {
            e.onFrame(delta);

            if (e.dead) {
                this.entities.splice(i--, 1);
            }
        }

        var that = this;

        this.forEachPlatform(function (p,i) {

            var maxY = that.viewport.y + that.viewport.height;

            if (p.rect.y > maxY) {
                var el = that.entities[i].el;

                that.entities[i] = new Platform({
                    x: Math.floor(Math.random()*201) + 10,
                    y: (top_platform-20)+Math.floor(Math.random()*40),
                    width: 70,
                    height: 10
                }, el);

                top_platform -= 80;
            }
        });

        this.forEachCoin(function (p,i) {

            var maxY = that.viewport.y + that.viewport.height;
            if (p.rect.y > maxY) {
                var el = that.entities[i].el;
                //that.soundCoin.play('coin');


                that.entities[i] = new Coin({
                    x: Math.floor(Math.random()*201) + 10,
                    y: top_platform-30,
                    width: 40,
                    height: 40
                }, el);
            }
        });

        this.forEachEnemy(function (e, i) {
            var maxY = that.viewport.y + that.viewport.height;

            if (e.pos.y > maxY) {
                var el = that.entities[i].el;

                that.entities[i] = new Enemy({
                    start: {x: Math.floor(Math.random()*201) + 10, y: top_platform-950},
                    end: {x: Math.floor(Math.random()*201) + 10, y: top_platform-900}
                }, el);
            }
        })


            /* this.addEnemy(new Enemy({
                start: {x: Math.floor(Math.random()*201) + 10, y: -1900},
                end: {x: Math.floor(Math.random()*201) + 10, y: -1800}
            })); */

        this.updateViewport();

        // Request next frame.
        requestAnimFrame(this.onFrame);
    };


    Game.prototype.updateViewport = function() {
        var minY = this.viewport.y + this.viewportPadding;
        var playerY = this.player.pos.y;

        // Check if game over, 87 is the height of the player so it falls completely out of the screen before game over.
        if (playerY > (this.viewport.y + this.viewport.height + 87)){
            this.gameOver();
        }

        if (playerY < minY) {
            this.viewport.y = playerY - this.viewportPadding;
        }

        this.worldEl.css({
            top: -this.viewport.y
        });
    };


    /**
     * Starts the game.
     */
    Game.prototype.start = function() {
        // Cleanup last game.
        this.entities.forEach(function(e) { e.el.remove(); });
        this.entities = [];

        top_platform = -560;
        
        // Set the stage
        this.createWorld();
        //this.soundPartyUSA.play();
        this.player.reset();
        this.viewport = {x: 0, y:0, width: 320, height: 480};

        //console.log(this.entities);

        // Then start
        this.unFreezeGame();
    };

    Game.prototype.forEachPlatform = function(handler) {
        for (var i = 0, e; e = this.entities[i]; i++) {
            if (e instanceof Platform) {
                handler(e,i);
            }
        }
    };

    Game.prototype.forEachCoin = function(handler) {
        for (var i = 0, e; e = this.entities[i]; i++) {
            if (e instanceof Coin) {
                handler(e, i);
            }
        }
    };

    Game.prototype.forEachEnemy = function(handler) {
        for (var i = 0, e; e = this.entities[i]; i++) {
            if (e instanceof Enemy) {
                handler(e, i);
            }
        }
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