$(document).ready(function () {
    function makeRippleMenuItem(menuItem, e) {
        var relX = e.pageX - $(menuItem).offset().left;
        var relY = e.pageY - $(menuItem).offset().top;
        Ripple.makeRipple($(menuItem), relX, relY, $(menuItem).width(), $(menuItem).height(), 500, 0);
    }

    $('.bookmarks a').mousedown(function (e) {
        makeRippleMenuItem($(this), e);
    });
    var marginRight = 8;
    $('.bookmarks').css('width', $('.bookmarks a').width() * 3 + 3 * marginRight);
});