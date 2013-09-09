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

    // TODO refactor into menu.js
    $('#play').click(function() {
        $('#menu').hide();
    });


    $('#game_over').hide();

    var game = new Game($('.game'));
    game.start();

    $('#retry').click(function() {
        game.start();
        $('#game_over').hide();
    });

});


