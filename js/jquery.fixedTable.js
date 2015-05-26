/*!
 * NAME: jQuery.fixedTable.js
 * DATE: 2015-02-13
 * VERSION: 0.0.4
 * DESCRIPTION: 틀고정 테이블
 * @author: nomi, nomisoul@gmail.com
 **/

(function ($) {
	$.fn.extend({
		fixedTable: function (opts) {
			var defaults, options;

			defaults = {
				scrollSize: 17,					//스크롤사이즈
				width: 1000,					//넓이
				height: 300,					//높이
				leftWidth: 500,					//고정 영역 사이즈
				autoWidth: true,				//넓이 100% (상위 엘리먼트 기준)
				autoHeight: true,				//높이 100% (상위 엘리먼트 기준)
				//borderColor: "#ddd",			//TD 테두리 색상
				leftHeadBg: "#e2eddd",			//왼쪽 상단 배경색
				leftBodyBg: "#d9edf7",			//왼쪽 하단 배경색
				rightHeadBg: "#eadddd",			//오른쪽 상단 배경색
				rightBodyBg: "#f5f5f5",			//오른쪽 하단 배경색
				cellHoverColor: "rgb(255, 221, 244)",
				cellOutColor: "cellOutColor"
			};

			options = $.extend({}, defaults, opts);

			return this.each(function () {
				var self = this,
					fixedObj = fixedObj || {};

				fixedObj = {
					firstNode: $(self).children().eq(0),
					firstNodeHead: $(self).children().eq(0).children().eq(0),
					firstNodeBody: $(self).children().eq(0).children().eq(1),
					secondNode: $(self).children().eq(1),
					secondNodeHead: $(self).children().eq(1).children().eq(0),
					secondNodeBody: $(self).children().eq(1).children().eq(1),
					firstNodeHeader: $(self).children().eq(0).children().eq(0).find("table"),
					getWidth: function () {
						return $(self).outerWidth(true);
					},
					getHeight: function () {
						return $(self).outerHeight(true);
					},
					getParentWidth: function () {
						return $(self).parent().outerWidth(true);
					},
					getParentHeight: function () {
						return $(self).parent().outerHeight(true);
					},
					getLeftHeadWidth: function () {
						return this.firstNodeHeader.outerWidth(true);
					},
					getLeftHeadHeight: function () {
						return this.firstNodeHeader.outerHeight(true);
					},
					getNodesLength: function () {
						return $(self).children().length;
					},
					linkScroll: function (leftObj, topObj) {
						$(self).scroll(function () {
							var $scrollY = $(self).scrollTop();
							var $scrollX = $(self).scrollLeft();

							if (fixedObj.getNodesLength() == 1) {
								$(topObj).scrollLeft($scrollX);
							} else if (fixedObj.getNodesLength() == 2) {
								$(leftObj).scrollTop($scrollY);
								$(topObj).scrollLeft($scrollX);
							}

						});
					},
					setColor: function () {
						$(self).find("table th, table td").css({
							borderColor: options.borderColor
						});
						this.firstNodeHead.children('table').css({
							backgroundColor: options.leftHeadBg
						});
						this.firstNodeBody.children('table').css({
							backgroundColor: options.leftBodyBg
						});
						$(this.secondNodeHead, this.secondNodeHead.children('table')).css({
							backgroundColor: options.rightHeadBg
						});
						this.secondNodeBody.children('table').css({
							backgroundColor: options.rightBodyBg
						});
					},
					setTrHeight: function () {
						$("table tr", this.firstNodeBody).each($.proxy(function(i, el) {
							var $obj = $("table tr", this.secondNodeBody);

							$obj.eq(i).outerHeight(function() {
								var $trHeight = $(el).outerHeight();
								return $trHeight;
							});
						}, this));
					},
					windowResizable: function () {
						$(window).resize($.proxy(function () {
							$(self).width(this.getParentWidth());

							if (options.autoHeight) {
								$(self).height(this.getParentHeight());
								if (this.getNodesLength() !== 1) {
									this.firstNodeBody.outerHeight(this.getHeight() - options.scrollSize);
								}
							} else {
								$(self).height(options.height);
							}

							if (this.getNodesLength() == 1) {
								if (options.autoWidth) {
									//this.firstNode.width($(self).width() - options.scrollSize);
									this.firstNodeHead.width($(self).width() - options.scrollSize);
									this.firstNodeBody.width($(self).width() - options.scrollSize);
								} else {
									//this.firstNode.width(options.width - options.scrollSize);
									this.firstNodeHead.width(options.width - options.scrollSize);
									this.firstNodeBody.width(options.width - options.scrollSize);
								}
								this.firstNodeBody.css({
									"padding-top": this.firstNodeHead.height()
								});
							} else if (this.getNodesLength() == 2) {
								this.firstNode.width(options.leftWidth);
								this.secondNode.css({
									"padding-left": options.leftWidth
								});
								this.secondNodeHead.width(this.getParentWidth() - (options.leftWidth + options.scrollSize));
							}

						}, this)).resize();

						//초기 로딩시 DOM 스크롤 사이즈 영향으로 self의 가로가 17px 줄어드는 현상을 위한 부분
						if (this.getNodesLength() == 1) {
							if (options.autoWidth) {
								$(self).width(this.getParentWidth());
								this.firstNodeHead.width($(self).width() - options.scrollSize);
								this.firstNodeBody.width($(self).width() - options.scrollSize);
							}
						} else if (this.getNodesLength() == 2) {
							if (options.autoWidth) {
								$(self).width(this.getParentWidth());
								this.secondNodeHead.width(this.getParentWidth() - options.leftWidth - options.scrollSize);
							}
						}
					},
					leftMouseWheel: function () {
						var scrollCount = 0;

						this.firstNodeBody.on("mousewheel", function (e, delta) {
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
						});
					},
					build: function () {
						this.setColor();

						if (this.getNodesLength() == 1) {
							this.firstNode.css('position', 'static');
							this.firstNodeHead.css('top','initial');
							if (options.autoWidth || options.autoHeight) {
								this.windowResizable();
							} else {
								$(self).width(options.width);
								$(self).height(options.height);
								this.firstNodeHead.width(options.width - options.scrollSize);
							}

							this.firstNodeBody.css({
								"padding-top": this.firstNodeHead.height()
							});

							this.linkScroll(null, this.firstNodeHead);
							//this.firstNodeBody.outerHeight(this.getHeight() - options.scrollSize);

						} else if (this.getNodesLength() == 2) {
							this.leftMouseWheel();

							if (options.autoWidth || options.autoHeight) {
								this.windowResizable();
							} else {
								$(self).width(options.width);
								$(self).height(options.height);
								this.firstNode.width(options.leftWidth);
								this.secondNodeHead.width(options.width - (options.leftWidth + options.scrollSize));
							}

							if (this.firstNodeHead.height() < this.secondNodeHead.find("table").height()) {
								this.firstNodeHead.height(this.secondNodeHead.find("table").height());
								this.firstNodeHead.children("table").height(this.secondNodeHead.find("table").height());
							} else {
								this.firstNodeHead.height(this.getLeftHeadHeight());
								this.secondNodeHead.children("table").height(this.getLeftHeadHeight());
							}

							this.secondNode.css({
								"padding-left": options.leftWidth
							});

							this.firstNodeBody.css({
								"padding-top": this.secondNodeHead.height()
							});

							this.secondNodeBody.css({
								"padding-top": this.secondNodeHead.height()
							});

							this.setTrHeight();
							this.linkScroll(this.firstNodeBody, this.secondNodeHead);
							this.firstNodeBody.outerHeight(this.getHeight() - options.scrollSize);
						}

					},
					init: function () {
						this.build();
					}
				};

				fixedObj.init();

			});
		}
	});
})(jQuery);