/*!
 * NAME: jQuery.scrollTop.js
 * DATE: 2015-05-14
 * VERSION: 0.0.1
 * DESCRIPTION: scrollTop
 * @author: nomi, nomisoul@gmail.com
 **/

(function ($) {
	$.fn.extend({
		scrollUp: function (option) {
			var defaults = {
				titleClass: "subTitle",
				copyClass: "subCopy"
			};
			var options = $.extend({}, defaults, option);

			return this.each(function () {
				var textArray = [];
				var text = $('.' + options.titleClass).text();

				$('.' + options.copyClass).hide();

				for (var i=0,len = text.length; i < len ;i++ ){
					textArray.push( $('<span>' + text[ i ] + '</span>' ) );
				}

				$('.' + options.titleClass).text( '' );

				$.each( textArray , function( i, el ){
					$('.' + options.titleClass).append( el );
					el.css({
						'position' : 'relative',
						'top' : -20,
						'opacity' : 0
					});
					setTimeout( function(){
						el.animate({
							'top' : 0,
							'opacity' : 1
						} , 200);
					}, 100 * i );
				});
				setTimeout( function(){
					$('.' + options.copyClass).fadeIn( 500 );
				} , 100 * (text.length + 1) );
			});
		}
	});
})(jQuery);

$(document).ready(function () {
	$(window).scroll(function () {
		var top = $(window).scrollTop();
		var left = $(window).scrollLeft();
		var scrollHalf = $(window).height() / 2;

		$(".layer").animate({
			top: top + 50
		}, {
			queue: false,
			duration: 500
		})

		if (top > scrollHalf) {
			$(".top_btn").fadeIn();
		} else {
			$(".top_btn").fadeOut();
		}

	})

	$(".top_btn").on("click", function () {
		$("body").animate({
			scrollTop: 0
		});
	}).css("cursor", "pointer");
})