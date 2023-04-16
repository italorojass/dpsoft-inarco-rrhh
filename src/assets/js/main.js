(function($) {
  'use strict';
  $(function() {
    $("#demo-variations-button").click(function() {
        $('html, body').animate({
            scrollTop: $("#demo-variations").offset().top
        }, 1000);
    });
    $("#features-link").click(function() {
        $('html, body').animate({
            scrollTop: $("#features").offset().top
        }, 1000);
    });
  });
})(jQuery);