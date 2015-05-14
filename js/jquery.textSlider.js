/*!
 * NAME: jQuery.textSlider.js
 * DATE: 2015-05-14
 * VERSION: 0.0.1
 * DESCRIPTION: 텍스트 슬라이드
 * @author: nomi, nomisoul@gmail.com
 **/

(function ($) {
	$.fn.extend({
		textSlide: function (option) {
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