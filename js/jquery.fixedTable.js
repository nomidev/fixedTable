/*!
 * NAME: jQuery.fixedTable.js
 * DATE: 2015-02-13
 * VERSION: 0.0.2
 * @author: nomi, nomisoul@gmail.com
 **/

(function ($) {

	$.fn.fixedTable = function (opts) {
		var defaults, options;

		defaults = {
			scrollSize: 17,
			width: 1000,					//넓이
			height: 300,					//높이
			leftWidth: 500,					//고정 영역 사이즈
			autoWidth: true,				//넓이 100% (상위 엘리먼트 기준)
			autoHeight: true,				//높이 100% (상위 엘리먼트 기준)
			columResizable: true,			//TD 컬럼 리사이즈
			columMaxWidth: 150,				//TD 컬럼 리사이즈 최대 크기
			columMinWidth: 70,				//TD 컬럼 리사이즈 최소 크기
			borderColor: "#ddd",			//TD 테두리 색상
			leftHeadBg: "#dff0d8",			//왼쪽 상단 배경색
			leftBodyBg: "#d9edf7",			//왼쪽 하단 배경색
			rightHeadBg: "#f2dede",			//오른쪽 상단 배경색
			rightBodyBg: "#f5f5f5"			//오른쪽 하단 배경색
		}
		
		options = $.extend({}, defaults, opts);
		
		return this.each(function () {
			var self = this,
				buildObj = buildObj || {};
				
			buildObj = {
				fixedLeft: $(self).children().eq(0),
				fixedLeftHead: $(self).children().eq(0).children().eq(0),
				fixedLeftBody: $(self).children().eq(0).children().eq(1),				
				fixedRight: $(self).children().eq(1),
				fixedRightHead: $(self).children().eq(1).children().eq(0),
				fixedRightBody: $(self).children().eq(1).children().eq(1),				
				fixedLeftHeader: $(self).children().eq(0).children().eq(0).find("table"),				
				getWidth: function () {
					return $(self).width();
				},
				getHeight: function () {
					return $(self).height();
				},
				getLeftHeadWidth: function () {
					return this.fixedLeftHeader.width();
				},
				getLeftHeadHeight: function () {
					return this.fixedLeftHeader.height();
				},
				linkScroll: function (leftObj, topObj) {
					$(self).scroll(function () {
						var $scrollY = $(self).scrollTop();
						var $scrollX = $(self).scrollLeft();
						
						$(leftObj).scrollTop($scrollY);
						$(topObj).scrollLeft($scrollX);
					});
				},
				setColor: function () {
					$(self).find("table th, table td").css({
						borderColor: options.borderColor
					});
					this.fixedLeftHead.children('table').css({
						backgroundColor: options.leftHeadBg
					});
					this.fixedLeftBody.children('table').css({
						backgroundColor: options.leftBodyBg
					});
					$(this.fixedRightHead, this.fixedRightHead.children('table')).css({
						backgroundColor: options.rightHeadBg
					});
					this.fixedRightBody.children('table').css({
						backgroundColor: options.rightBodyBg
					});
				},
				setTrHeight: function () {
					$("table tr", this.fixedLeftBody).each($.proxy(function(i, el) {
						var $obj = $("table tr", this.fixedRightBody);
						
						$obj.eq(i).outerHeight(function() {
							var $trHeight = $(el).outerHeight();
							return $trHeight;
						});
					}, this));
				},				
				windowResizable: function () {
					$(window).resize($.proxy(function () {
						var $parentWidth = $(self).parent().width();
						options.leftWidth = this.fixedLeft.width();

						$(self).width($parentWidth);

						this.fixedRight.css({
							"padding-left": options.leftWidth
						});
						this.fixedRightHead.width($parentWidth - (options.leftWidth + options.scrollSize));
						
					}, this)).resize();
				},
				columResizable: function (obj, bool) {
					if(bool) {
						$("table td", obj).each(function (i, el) {
							var $target = $(obj).next().find("table td").eq(i);

							$(el).resizable({
								alsoResize: $target,
								maxWidth: options.columMaxWidth,
								minWidth: options.columMinWidth,
								handles: 'e',
								resize: $.proxy(function( event, ui ) {
									this.fixedLeftHead.height(this.getLeftHeadHeight());
									
									this.fixedLeftBody.height(this.getHeight() - (this.getLeftHeadHeight() + options.scrollSize)).css({
										"padding-top": this.getLeftHeadHeight()
									});
									this.fixedRightHead.height(this.getLeftHeadHeight()).children("table").height(this.getLeftHeadHeight());
									this.fixedRightBody.css({
										"padding-top": this.getLeftHeadHeight()
									});

									this.setTrHeight();
								}, buildObj)
							});
						})
					} else {
						$(obj).resizable({
							minWidth: options.leftWidth,
							maxWidth: options.leftWidth * 2,
							handles: 'e',
							resize: $.proxy(function( event, ui ) {
								if (options.autoWidth) {
									this.windowResizable();
								} else {
									options.leftWidth = this.fixedLeft.width();									

									this.fixedLeftHead.height(this.getLeftHeadHeight());						
									
									this.fixedLeftBody.height(this.getHeight() - (this.getLeftHeadHeight() + options.scrollSize)).css({
										"padding-top": this.getLeftHeadHeight()
									});
									
									this.fixedRight.css({
										"padding-left": options.leftWidth
									});
									this.fixedRightHead.width(options.width - (options.leftWidth + options.scrollSize)).height(this.getLeftHeadHeight())
									.children("table").height(this.getLeftHeadHeight());
									this.fixedRightBody.css({
										"padding-top": this.getLeftHeadHeight()
									});
								}

								this.setTrHeight();
							}, this)
						});
					}
				},
				leftMouseWheel: function () {
					var scrollCount = 0;

					this.fixedLeftBody.on("mousewheel", function (e, delta) {
						if (e.originalEvent.wheelDelta < 0) {
							//scroll down
							if (scrollCount < 0) {
								return false;
							} else {
								$(self).scrollTop(scrollCount -= 100);
							}
							//console.log('Down',scrollCount);
						} else {
							if (scrollCount > $(self).scrollTop()) {
								return false;
							} else {
								$(self).scrollTop(scrollCount += 100);
							}
							//console.log('Up',scrollCount);
						}
						return false;
					})					
				},
				build: function () {
					this.setColor();
					this.leftMouseWheel();

					if (options.autoHeight) {
						options.height = "100%";
					}

					$(self).height(options.height);

					this.fixedLeft.width(options.leftWidth);
					this.fixedLeftHead.height(this.getLeftHeadHeight());
					
					this.fixedLeftBody.height(this.getHeight() - (this.getLeftHeadHeight() + options.scrollSize)).css({
						"padding-top": this.getLeftHeadHeight()
					});

					if (options.autoWidth) {
						this.windowResizable();
					} else {
						$(self).width(options.width);
						this.fixedRightHead.width(options.width - (options.leftWidth + options.scrollSize));
					}

					this.fixedRight.css({
						"padding-left": options.leftWidth
					});
					this.fixedRightHead.children("table").height(this.getLeftHeadHeight());
					this.fixedRightBody.css({
						"padding-top": this.getLeftHeadHeight()
					});				

					this.setTrHeight();
					this.linkScroll(this.fixedLeftBody, this.fixedRightHead);

					if (options.columResizable) {
						this.columResizable(this.fixedLeftHead, true);
						this.columResizable(this.fixedRightHead, true);
						this.columResizable(this.fixedLeft, false);
					}

				},
				init: function () {
					this.build();
				}
			}

			buildObj.init();
			
		})
	}
})(jQuery);