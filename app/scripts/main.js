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
    $('#play').click(function() {
        $('#FML').hide();
        $('#menu').hide();
        game.unFreezeGame();
    });

    $('#retry').click(function() {
        game.start();
        $('#game_over').hide();
    });

    $('#submit_username').click(function() {
        submitUsername();
    });

    function updateHighScoreList(){
        var highScoreEl = $('#highscores');

        highScoreEl.empty();

        var html = "";
        var counter = 0;
        for (var i = game.highscores.length-1; i >= 0; i--){
            if (counter > 4){
                break;
            }

            html += "<li>" + game.highscores[i].name +": <span class=\"highscore\">"  + game.highscores[i].value +  "</span></li>"
            counter += 1;
        }
        highScoreEl.append(html);
    }

    updateHighScoreList();

    function submitUsername() {
        game.username = $('#username').val();
        if (game.username === undefined) {
            game.username = "";
        }

        game.highscores.push({name: game.username, value: game.player.score});
        game.highscores.sort(function(a,b) {return a.value - b.value});
        localStorage.setItem('highscores', JSON.stringify(game.highscores));

        updateHighScoreList();
    }

});


