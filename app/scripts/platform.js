/*global define */

define(function() {

    var Platform = function(rect, el) {
        this.rect = rect;
        this.rect.right = rect.x + rect.width;
        this.rect.dead = false;

        if (el === undefined){
            this.el = $('<div class="platform">');
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

    Platform.prototype.onFrame = function() {};

    return Platform;
});