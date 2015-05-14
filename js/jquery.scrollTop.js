/*!
 * NAME: jQuery.scrollTop.js
 * DATE: 2015-05-14
 * VERSION: 0.0.1
 * DESCRIPTION: scrollTop
 * @author: nomi, nomisoul@gmail.com
 **/

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