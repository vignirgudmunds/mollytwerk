require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['game', 'jquery'], function (Game) {
    'use strict';

    $('#game_over').hide();

    var game = new Game($('.game'));
    game.start();
    game.freezeGame();

    // TODO refactor into menu.js



    function updateHighScoreList(){
        var highScoreEl = $('#highscores');

        highScoreEl.empty();

        var html = "";
        for (var i = game.highscores.length-1; i >= 0; i--){
            html += "<li>" + game.highscores[i].name +": <span class=\"highscore\">"  + game.highscores[i].value +  "</span></li>"
        }

        //$('#highscores').append(html);

        highScoreEl.append(html);
    }

    updateHighScoreList();



    $('#play').click(function() {
        $('#menu').hide();
        game.unFreezeGame();
    });

    $('#retry').click(function() {
        game.start();
        $('#game_over').hide();
    });

    $('#submit_username').click(function() {
        console.log("wat");
        game.username = $('#username').val();
        if (game.username === undefined) {
            game.username = "";
        }

        game.highscores.push({name: game.username, value: game.player.score});
        game.highscores.sort(function(a,b) {return a.value - b.value});
        localStorage.setItem('highscores', JSON.stringify(game.highscores));
        console.log(game.highscores)

        updateHighScoreList();
    });

});


