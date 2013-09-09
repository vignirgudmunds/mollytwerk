/*global define */

define(function() {

    var Coin = function(rect, el) {
        this.rect = rect;
        this.rect.right = rect.x + rect.width;
        this.rect.dead = false;

        if (el === undefined){
            this.el = $('<div class="coins">');
        }
        else {
            this.el = el;
        }
        this.el.css({
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height
        });
    };

    Coin.prototype.onFrame = function() {};

    return Coin;
});