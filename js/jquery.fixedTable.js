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



/*
    주어진 div id 영역의 height를 브라우저 사이즈에 맞도록 조절하고 
    해당 div 영역에  스크롤바를 붙여 그외 상단 Div영역을 고정하는 효과를 얻는 함수.
    (프레임으로 나누어 고정하는 것과 동일한 효과)
    
    스크롤을 붙일 div 영역은 아래와 같이 position:absolute 속성을 주거나 스타일을
    지정해야 한다.

    <div id="content" style="position:absolute; padding-bottom:15px; width:100%; overflow:auto;">
    
    사용예) <HTML><HEAD><SCRIPT> 영역 하단에 아래 줄 추가
            addLoadEvent( divFixOnLoad("content") );

    김지성, 2008. 08. 05   
*/


// window.load 이벤트를 겹쳐쓰기 없이 추가
// 김지성, 2008. 08. 05
function addLoadEvent(func) {
    var oldOnLoad = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
        oldOnLoad();
        func();
        }
    }
}

//Wrapper function <script></script> 영역에서 사용
function divFixOnLoad(divId) {
    return function() { divFixInit(divId) };
}

/*
 <body onload="divFixInit('divId')">
 혹은 jsp 최하단에
 <script type="text/javascript">divFixInit('divId');</script>
 와 같이 직접 핸들러를 붙일 수 있음
*/
function divFixInit(divId) {
    var cont = document.getElementById(divId);

    var offsetTop = findPosY(cont);
    // style 적용
    cont.style.position = "absolute";
    cont.style.paddingBottom = "15px";
    jQuery(cont).width ( document.body.clientWidth - findPosX(cont)  - marginLeft );
    cont.style.overflow = "auto";
    
    // Initialize div height
    cont.style.height = document.body.clientHeight - offsetTop;
    cont.style.top = offsetTop;

    // Def. Event handler of widnow.onresize
    var divResize = function(cont) {
        return function() { 
        	
        	// top 및 height 재계산 
        	cont.style.position = "static";
        	var offsetTop2 = findPosY(cont);
        	cont.style.position = "absolute";
            jQuery(cont).width ( document.body.clientWidth - findPosX(cont)  - marginLeft );

            cont.style.height = document.body.clientHeight - offsetTop2;
            cont.style.top = offsetTop2;
        }
    }

    // Attach event handler
    window.onresize = divResize(cont);  
}



/*
    -----------------------------------------------------------
    테이블 헤더 틀고정 스크립트
    
    2008. 06. 31 김지성
    -----------------------------------------------------------
    Desc : 지정된 div id에 담긴 테이블의 열, 행 고정을 수행
           테이블 하단의 페이징 처리 Div 영역도 처리 가능
           
    Useage : document.body.onload 혹은 body 제일 하단에서
             (XJOS와 같은 기타 body.onload 함수가 쓰일 경우)
             headerFixInit(...) 호출 
            
             테이블은 반드시 웹표준에 따라 다음과 같은 형식을
             가져야 틀고정 적용이 가능하다.

               <table>
                 <thead>
                   <tr>
                     <th></th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td></td>
                   </tr>
                 </tbody>
               </table>

    -----------------------------------------------------------
    headerFixInit( input1, input2 [, input3] )
    
    input1      : 틀고정할 대상 테이블을 담는 Div 영역 id
    input2      : 열고정할 컬럼 수
    input3(opt) : 페이징 처리 시 페이징 부분을 담는 Div 영역 id
    -----------------------------------------------------------
 */

/* // TODO : 아래 변수와 함께 closure 사용으로 변경하자.

var headerFixObj = {
                      divMn : null,
                      divTl : null,
                      divTr : null,
                      divBl : null,
                      divBr : null,
                     
                      divWidth  : null,
                      divHeight : null,
                      divTop    : null,
                      divLeft   : null,
                     
                      divPageId   : "",
                      divPageTop  : null,
                      divPageLeft : null,
                     
                      rowFixCnt : 0
                    };
                   
var headerFixUserConf = { 
                          minHeight : "100px",      // TBODY 내용의 최소 Height 설정
                          marginLeft : "30px",      // 테이블의 우측 마진 값
                          mainTitleHeight : "10px"  // Title 영역이 로딩 후 동적으로 생기기 때문에 이 영역 높이를 지정
                        };
 */

var _div_mn; 
var _div_tl; 
var _div_tr; 
var _div_bl; 
var _div_br; 

var _divWidth; 
var _divHeight; 
var _divTop; 
var _divLeft;
 
var _divPageTop;
var _divPageLeft;
var _pageDivId = ""; // Div id of a paging area
var _rowFixCnt = 0; // 헤더 고정되는 row 갯수

//// 사용자 정의 
var minHeight = 100; // TBODY 내용의 최소 Height 설정
var marginLeft = 30; // 테이블의 우측 마진 값
var mainTitleHeight = 0;   // Title 영역이 로딩 후 동적으로 생기기 때문에 이 영역 높이를 지정


function headerFixInit(headerFixDivId, pageDivId) {
  _pageDivId = pageDivId == undefined ? "" : pageDivId;

  var div_header = null;
  var div_mn_tbody; 
  var div_mn_header;

  _div_mn = document.getElementById(headerFixDivId);    // 헤더고정할 div 영역

  // TBODY 영역에 대해 모든 TR의 높이를 스타일로 세팅
  var trs = _div_mn.getElementsByTagName("TBODY")[0].getElementsByTagName("TR");

  for(var inx=0, max=trs.length; inx<max; inx++) {
    
      //trs[inx].firstChild.style.height = trs[inx].firstChild.clientHeight;
      jQuery(trs[inx]).first().children().height( (jQuery(trs[inx]).first().children().get()).clientHeight );
  }

  // THEAD 영역에 대해 모든 셀의 높이와 너비를 스타일로 세팅
  var trs = _div_mn.getElementsByTagName("THEAD")[0].getElementsByTagName("TR");
  _rowFixCnt = trs.length;

  for(var inx=0, max=trs.length; inx<max; inx++) {

      var ths = trs[inx].getElementsByTagName("TH");

      for(var jnx=0; jnx<ths.length; jnx++) {
        ths[jnx].setAttribute("fixHeight", ths[jnx].clientHeight);
        ths[jnx].setAttribute("fixWidth",  ths[jnx].clientWidth);
      }
  }

  var trs = _div_mn.getElementsByTagName("TBODY")[0].getElementsByTagName("TR");

  // TBODY의 너비 세팅
  for(var inx=0, max=_rowFixCnt; inx<max; inx++) {

      var tds = trs[inx].getElementsByTagName("TD");
    
      for(var jnx=0; jnx<tds.length; jnx++) {
        tds[jnx].setAttribute("fixHeight", tds[jnx].clientHeight);
        tds[jnx].setAttribute("fixWidth", tds[jnx].clientWidth);
      }
  }
  
  // selectedIndex란 attribute로 따로 세팅하고 cloneNode 후 다시 selected 세팅 (IE)
  setSelectedBeforeCloneNode(_div_mn.getElementsByTagName("SELECT"));
  
  // 분할 div 테이블 영역 생성
  _div_tl = _div_mn.cloneNode(true);
  _div_tr = _div_mn.cloneNode(true);
  _div_bl = _div_mn.cloneNode(true);
  _div_br = _div_mn.cloneNode(true);

  //jQuery(_div_tr).css("background","gray");
  //jQuery(_div_br).css("background","gray");

  jQuery(_div_tl).find("table").css("table-layout","fixed");
  jQuery(_div_tr).find("table").css("table-layout","fixed");
  jQuery(_div_bl).find("table").css("table-layout","fixed");
  jQuery(_div_br).find("table").css("table-layout","fixed");

  jQuery(_div_tl).find("td").css("text-overflow","ellipsis").css("overflow","hidden");
  jQuery(_div_tr).find("td").css("text-overflow","ellipsis").css("overflow","hidden");
  jQuery(_div_bl).find("td").css("text-overflow","ellipsis").css("overflow","hidden");
  jQuery(_div_br).find("td").css("text-overflow","ellipsis").css("overflow","hidden");

  jQuery(_div_tl).find("table").width(jQuery(_div_tl).width());
  jQuery(_div_tr).find("table").width(jQuery(_div_tr).width());
  jQuery(_div_bl).find("table").width(jQuery(_div_bl).width());
  jQuery(_div_br).find("table").width(jQuery(_div_br).width());

  _div_tl.setAttribute("id", "");
  _div_tr.setAttribute("id", "");
  _div_bl.setAttribute("id", "");
  _div_br.setAttribute("id", "");
  
  _div_tl.style.position = 'absolute'; 
  _div_tl.style.overflow = 'hidden'; 
  _div_tl.style.display = "none";
  _div_tr.style.position = 'absolute'; 
  _div_tr.style.overflow = 'hidden'; 
  _div_tr.style.display = "none";
  _div_bl.style.position = 'absolute'; 
  _div_bl.style.overflow = 'hidden'; 
  _div_bl.style.display = "none";
  _div_br.style.position = 'absolute'; 
  _div_br.style.overflow = 'auto'; 
  _div_br.style.display = "none";
  
  _div_br.onscroll = _onScrolling;

  // 원본 div 테이블 영역 앞에 분할 생성한 div를 삽입
  _div_mn.parentNode.insertBefore(_div_tl, _div_mn);
  _div_mn.parentNode.insertBefore(_div_tr, _div_mn);
  _div_mn.parentNode.insertBefore(_div_bl, _div_mn);
  _div_mn.parentNode.insertBefore(_div_br, _div_mn);


  // _div_mn 
  div_mn_tbody = _div_mn.getElementsByTagName("tbody")[0]; 
  div_mn_header = _div_mn.getElementsByTagName("tr")[0].getElementsByTagName("th");

  // 분할될 테이블에서 우상단 테이블의 첫번째 셀을 뽑아낸다.(우측div 영역의 left값 계산)
  for(var inx=0, max=div_mn_header.length; inx<max && div_header == null; inx++) {
    
    if ( div_mn_header[inx].getAttribute("columnFix") == undefined ) {
        div_header = div_mn_header[inx]; 
    }
  }
  // 테이블이 위치할 position 결정
  _divHeight = div_mn_tbody.offsetTop;  // 하단 div(bl, br) 영역의 Y 위치 
  _divWidth = $(div_header).offset().left;    // 우측 div(tr, br) 영역의 X 위치
  _divTop = findPosY(_div_mn);          // 상단 div(tl, tr) 영역의 Y 위치
  _divLeft = findPosX(_div_mn);         // 좌측 div(tl, bl) 영역의 X 위치
  // 페이징 영역의 현재 position 설정   
  if (_pageDivId != "") {
      divPage = document.getElementById(_pageDivId);
      divPage.style.position = "absolute";
      _divPageTop = findPosY(divPage);
      _divPageLeft = findPosX(divPage);
  }
  _devideTable();   // 테이블을 4개의 div영역으로 둘러싼 테이블 분할
  _resizeInit();

  //selectedIndex란 attribute로 따로 세팅하고 cloneNode 후 다시 selected 세팅 (IE)
  setSelectedAfterCloneNode(_div_tl.getElementsByTagName("SELECT"));
  setSelectedAfterCloneNode(_div_tr.getElementsByTagName("SELECT"));
  setSelectedAfterCloneNode(_div_bl.getElementsByTagName("SELECT"));
  setSelectedAfterCloneNode(_div_br.getElementsByTagName("SELECT"));
  
  //엑셀 다운로드 시 div_mn의 th정보를 가져가므로 THEAD만 남기고 TBODY는 삭제
  var _div_mn_tbody = _div_mn.getElementsByTagName( "TBODY" )[0];
  _div_mn_tbody.parentNode.removeChild(_div_mn_tbody);
  _div_mn.style.display = "none";
}


// SELECT의 경우 selected attribute가 cloneNode 함수를 통해 복사되지 않는다. (IE)
// 따라서 selectedIndex란 attribute로 따로 세팅하고 cloneNode 후 다시 selected 세팅
function setSelectedBeforeCloneNode( sels ) {
	
  if ( sels.length < 1 ) return;
  
  for(var inx=0, max=sels.length; inx<max; inx++) {
	
	  for( var jnx=0, maxJ=sels[inx].options.length; jnx<maxJ; jnx++) {
		  
		  if ( sels[inx].options[jnx].getAttribute( "selected" ) ) {
			
			  sels[inx].options[jnx].setAttribute( "isSelected", true );
		  }
	  }
  }
}

// SELECT의 경우 selected attribute가 cloneNode 함수를 통해 복사되지 않는다. (IE)
// 따라서 selectedIndex란 attribute로 따로 세팅하고 cloneNode 후 다시 selected 세팅
function setSelectedAfterCloneNode( newSels ) {
	
  // SELECT의 selected 재 세팅
  if ( newSels.length < 1 ) return;
  
  // cloneNode 후 SELECT의 선택된 옵션이 있을 경우 selected 해준다.
  for(var inx=0, max=newSels.length; inx<max; inx++) {

	  for( var jnx=0, maxJ=newSels[inx].options.length; jnx<maxJ; jnx++) {
		  
		  if ( newSels[inx].options[jnx].getAttribute( "isSelected" ) ) {
			
			  newSels[inx].options[jnx].setAttribute( "selected", true );
		  }
	  }
  }
}


// 화면에서 절대 X 위치를 찾는 함수
function findPosX(obj){
    var curleft = 0;
    if(obj.offsetParent) {
        while(obj.offsetParent){
            curleft += obj.offsetLeft;
            obj = obj.offsetParent;
        }
    }

    return curleft;
}

// 화면에서 절대 Y 위치를 찾는 함수
function findPosY(obj) {
    var curtop = 0;
    if(obj.offsetParent) {
        while(obj.offsetParent){
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        }
    }

    return curtop;
}

// div로 둘러싸인 원본 테이블을 4개의 div 테이블 영역으로 분할하는 함수
function _devideTable() { 
  var isRemove;
  var isContinue;

  // _div_tl (devide) 
  var div_tl_table = _div_tl.getElementsByTagName("table");
  div_tl_table[0].id = "";
  var div_tl_thead = div_tl_table[0].getElementsByTagName("thead"); 
  var div_tl_tbody = div_tl_table[0].getElementsByTagName("tbody"); 
  var div_tl_title = div_tl_thead[0].getElementsByTagName("tr"); 
  var div_tl_header = div_tl_title[0].getElementsByTagName("th"); 
  
  div_tl_tbody[0].parentNode.removeChild(div_tl_tbody[0]);
  
  for (var j=0; j<div_tl_title.length; j++) {
    div_tl_header = div_tl_title[j].getElementsByTagName("th");

    for (i=div_tl_header.length - 1; i>= 0; i--) {
      if(div_tl_header[i].getAttribute("columnFix") == undefined) {
        div_tl_header[i].parentNode.removeChild(div_tl_header[i]);
      } else {
        //div_tl_header[i].style.width  = div_tl_header[i].getAttribute("fixWidth");
        //div_tl_header[i].style.height = div_tl_header[i].getAttribute("fixHeight");
        jQuery(div_tl_header[i]).width  ( div_tl_header[i].getAttribute("fixWidth") );
        jQuery(div_tl_header[i]).height ( div_tl_header[i].getAttribute("fixHeight"));
      }
    }
  } 

  // _div_tr (devide) 
  var div_tr_table = _div_tr.getElementsByTagName("table");
  div_tr_table[0].id = "";
  var div_tr_thead = div_tr_table[0].getElementsByTagName("thead"); 
  var div_tr_tbody = div_tr_table[0].getElementsByTagName("tbody"); 
  var div_tr_title = div_tr_thead[0].getElementsByTagName("tr"); 
  
  div_tr_tbody[0].parentNode.removeChild(div_tr_tbody[0]); 
  for (j=0; j<div_tr_title.length; j++) { 
    div_tr_header = div_tr_title[j].getElementsByTagName("th");
    for (i=div_tr_header.length - 1; i>=0; i--) {
      if (div_tr_header[i].getAttribute("columnFix") != undefined) {
        div_tr_header[i].parentNode.removeChild(div_tr_header[i]);
      } else {
        //div_tr_header[i].style.width  = div_tr_header[i].getAttribute("fixWidth");
        //div_tr_header[i].style.height = div_tr_header[i].getAttribute("fixHeight");
	  	jQuery(div_tr_header[i]).width  ( div_tr_header[i].getAttribute("fixWidth"));
		jQuery(div_tr_header[i]).height ( div_tr_header[i].getAttribute("fixHeight"));
      }
    } 
  } 
  
  // _div_bl (devide) 
  var div_bl_table = _div_bl.getElementsByTagName("table");
  div_bl_table[0].id = ""; 
  var div_bl_thead = div_bl_table[0].getElementsByTagName("thead"); 
  var div_bl_tbody = div_bl_table[0].getElementsByTagName("tbody"); 
  var div_bl_title = div_bl_tbody[0].getElementsByTagName("tr"); 
  
  div_bl_thead[0].parentNode.removeChild(div_bl_thead[0]); 
  for (j=0; j<div_bl_title.length; j++) { 
    div_bl_header = div_bl_title[j].getElementsByTagName("td"); 
    for (i=div_bl_header.length - 1; i>= 0; i--) {
      if(div_bl_header[i].getAttribute("columnFix") == undefined) {
        div_bl_header[i].parentNode.removeChild(div_bl_header[i]);
      } else {
        if ( j<_rowFixCnt ) {    // 헤더 고정되는 행 갯수만큼만 너비를 지정
          //div_bl_header[i].style.width  = div_bl_header[i].getAttribute("fixWidth");
          jQuery(div_bl_header[i]).width  ( div_bl_header[i].getAttribute("fixWidth"));
        }
      }
    }
  } 

  // _div_br (devide) 
  var div_br_table = _div_br.getElementsByTagName("table");
  div_br_table[0].id = "";
  var div_br_thead = div_br_table[0].getElementsByTagName("thead"); 
  var div_br_tbody = div_br_table[0].getElementsByTagName("tbody"); 
  var div_br_title = div_br_tbody[0].getElementsByTagName("tr"); 

  div_br_thead[0].parentNode.removeChild(div_br_thead[0]); 
  for (j=0; j<div_br_title.length; j++) { 
    div_br_header = div_br_title[j].getElementsByTagName("td"); 
    for (i=div_br_header.length - 1; i>=0; i--) {
      if (div_br_header[i].getAttribute("columnFix") != undefined) {
        div_br_header[i].parentNode.removeChild(div_br_header[i]);
      } else {
        if ( j<_rowFixCnt ) { // 헤더 고정되는 행 갯수만큼만 너비를 지정
          //div_br_header[i].style.width  = div_br_header[i].getAttribute("fixWidth");
      	  jQuery(div_br_header[i]).width  ( div_br_header[i].getAttribute("fixWidth"));
        }
      }
    } 
  } 
  
}

// 분할된 div 테이블 영역의 위치를 초기화하는 함수
function _resizeInit() {
  /*
  // 페이징 Div영역 초기화
  if ( _pageDivId != "") {
      divPage.style.top =  _divPageTop + mainTitleHeight;
      divPage.style.left =  _divPageLeft;
  }
  
  _div_tl.style.top = _divTop + mainTitleHeight;
  _div_br.style.top = _divTop + _divHeight + mainTitleHeight; 
  _div_tr.style.top = _divTop + mainTitleHeight; 
  _div_bl.style.top = _divTop + _divHeight + mainTitleHeight; 
  _div_br.style.left = _divWidth + _divLeft; 
  _div_tl.style.left = _divLeft;
  _div_tr.style.left = _divWidth + _divLeft;
  _div_bl.style.left = _divLeft;

  _div_tl.style.display = "block"; 
  _div_tr.style.display = "block"; 
  _div_bl.style.display = "block"; 
  _div_br.style.display = "block";
   */
  // 페이징 Div영역 초기화
  if ( _pageDivId != "") {
      jQuery(divPage).css("top",  _divPageTop + mainTitleHeight);
      jQuery(divPage).css("left",  _divPageLeft );
  }
  _divWidth = jQuery(_div_tl).width();
  jQuery(_div_tl).css("top", _divTop + mainTitleHeight);
  jQuery(_div_br).css("top", _divTop + _divHeight + mainTitleHeight); 
  jQuery(_div_tr).css("top", _divTop + mainTitleHeight); 
  jQuery(_div_bl).css("top", _divTop + _divHeight + mainTitleHeight); 
  jQuery(_div_br).css("left", _divWidth + _divLeft); 
  jQuery(_div_tl).css("left", _divLeft);
  jQuery(_div_tr).css("left", _divWidth + _divLeft);
  jQuery(_div_bl).css("left", _divLeft);

  jQuery(_div_tl).show(); 
  jQuery(_div_tr).show();
  jQuery(_div_bl).show();
  jQuery(_div_br).show();

  // 상단 헤더 틀고정 시 border 겹침 제거
  //_div_bl.firstChild.style.marginTop = "-1px";    // 좌상단 테이블과 좌하단 테이블의 border가 겹치도록 1px을 뺀다. 
  //_div_br.firstChild.style.marginTop = "-1px";    // 우상단 테이블과 우하단 테이블의 border가 겹치도록 1px을 뺀다.

  // 좌측 헤더 틀고정 시 border 겹침 제거
  //_div_tr.firstChild.style.marginLeft = "-1px";   // 좌상단 테이블과 우상단 테이블의 border가 겹치도록 1px을 뺀다. 
  //_div_br.firstChild.style.marginLeft = "-1px";   // 좌하단 테이블과 우하단 테이블의 border가 겹치도록 1px을 뺀다. 

  
  // 전체 테이블에서 볼 때 하단과 우단 div영역에 선을 만든다.
  //_div_br.style.borderBottom = "#d1d1d1 1px solid";
  //_div_tl.style.borderLeft = "#d1d1d1 1px solid";
  //_div_bl.style.borderLeft = "#d1d1d1 1px solid";
  //_div_bl.style.borderBottom = "#d1d1d1 1px solid";
  //_div_tr.style.borderRight = "#d1d1d1 1px solid";
  //_div_br.style.borderRight = "#d1d1d1 1px solid";
  
  _resize();

  window.onresize = _resize;
}

// 4개의 분할된 div 테이블의 크기를 화면에 맞게 조절하는 함수
function _resize() { 
  //_div_tl.style.pixelWidth = _divWidth; 
  //_div_tr.style.pixelWidth = document.body.clientWidth - _divWidth - _divLeft  - marginLeft;
  jQuery(_div_tl).width(_divWidth); 
  jQuery(_div_tr).width(document.body.clientWidth - _divWidth - _divLeft  - marginLeft + _leftWidth );
  
  //_div_tl.style.pixelHeight = _divHeight; 
  //_div_tr.style.pixelHeight = _divHeight;
  jQuery(_div_tl).height(_divHeight); 
  jQuery(_div_tr).height(_divHeight);

  //_div_bl.style.pixelWidth = _divWidth;
  //_div_br.style.pixelWidth = document.body.clientWidth - _divWidth - _divLeft - marginLeft ;
  jQuery(_div_bl).width(_divWidth);
  jQuery(_div_br).width(document.body.clientWidth - _divWidth - _divLeft - marginLeft + _leftWidth);
  
  //_div_bl.style.pixelHeight = document.body.clientHeight - _divTop - 60; // 40px; paging div area
  //_div_br.style.pixelHeight = document.body.clientHeight - _divTop - 60; 
  jQuery(_div_bl).height ( jQuery(window).height() - _divTop - 60); // 40px; paging div area
  jQuery(_div_br).height ( jQuery(window).height() - _divTop - 60); 

    // 페이징 처리 테이블 일때
    if ( _pageDivId != "" ) { 
        //_div_bl.style.pixelHeight -= 40;
        //_div_br.style.pixelHeight -= 40;
    	jQuery(_div_bl).height(jQuery(_div_bl).height()-40) ;
    	jQuery(_div_br).height(jQuery(_div_br).height()-40) ;
    }
    // 화면에서 가로 너비, 세로 높이가 넘쳤는지 여부 확인
    var isOverflowX = _div_br.scrollWidth > _div_br.clientWidth; 
    var isOverflowY = _div_br.scrollHeight > _div_br.clientHeight; 

    // 횡으로 overflow
    if ( isOverflowX && !isOverflowY) {
      //_div_bl.style.pixelHeight = _div_bl.getElementsByTagName("TABLE")[0].clientHeight;
      //_div_br.style.pixelHeight = _div_br.getElementsByTagName("TABLE")[0].clientHeight + 17;
      //jQuery(_div_bl).height ( _div_bl.getElementsByTagName("TABLE")[0].clientHeight + "px");
      //jQuery(_div_br).height ( _div_bl.getElementsByTagName("TABLE")[0].clientHeight + 17 + "px");
      //jQuery(_div_bl).height ( jQuery(_div_br).height()-17 );
    	jQuery(_div_br).height(jQuery(_div_br).height()+17);
    	jQuery(_div_bl).height(jQuery(_div_br).height()-17 );
    } 
    
    // 종으로 overflow : ok
    if ( !isOverflowX && isOverflowY ) {
        //_div_br.style.pixelWidth += 17;
        jQuery(_div_br).width(jQuery(_div_br).width()+17);
    } 

    // 횡과 종으로 모두 overflow : ok
    if ( isOverflowX && isOverflowY ) {
        //_div_br.style.pixelWidth  += 17;
        //_div_br.style.pixelHeight += 17;
    	//jQuery(_div_br).width(jQuery(_div_br).width()+17) ;
    	//jQuery(_div_br).height(jQuery(_div_br).height()+17);
    	//jQuery(_div_bl).height ( jQuery(_div_br).height()-17 );
    	//jQuery(_div_tr).width(jQuery(_div_br).width()-17) ;
    	jQuery(_div_br).height(jQuery(_div_br).height()+17);
    	jQuery(_div_bl).height(jQuery(_div_br).height()-17 );

    	jQuery(_div_br).width(jQuery(_div_tr).width()+17) ;
    	//jQuery(_div_tr).width((_div_br).clientWidth) ;
    	jQuery(_div_tr).width(jQuery(_div_br).width()-17)
    }
    
    // overflow 없음 : ok
    if ( !isOverflowX && !isOverflowY ) {
        //_div_bl.style.pixelHeight = _div_bl.getElementsByTagName("TABLE")[0].clientHeight;
        //_div_br.style.pixelHeight = _div_br.getElementsByTagName("TABLE")[0].clientHeight;
        jQuery(_div_bl).height ( _div_bl.getElementsByTagName("TABLE")[0].clientHeight );
        jQuery(_div_br).height ( _div_br.getElementsByTagName("TABLE")[0].clientHeight );
    }
  // TBODY 내용영역의 최소 height 설정 (지정한 minHeight 높이 이하로 줄어들지 않는다)
  if (jQuery(_div_bl).height() < minHeight) {
    //_div_bl.style.pixelHeight = minHeight - 17;
    //_div_br.style.pixelHeight = minHeight;
	  jQuery(_div_bl).height ( minHeight - 17);
	  jQuery(_div_br).height ( minHeight);
  } else {
    //_div_bl.style.pixelHeight = _div_bl.style.pixelHeight;
    //_div_br.style.pixelHeight = _div_br.style.pixelHeight;
	  //jQuery(_div_bl).height ( jQuery(_div_br).height() );
	  //jQuery(_div_br).height ( jQuery(_div_br).height() );
    _div_bl.style.borderBottom = "#d1d1d1 1px solid";  // 좌하단 div영역에 border 삽입
  }
  
    // 페이징 처리 테이블 일때
    if ( _pageDivId != "" ) { 
   
        // 페이징 영역의 Top 위치 설정
        //divPage.style.top = _divTop + _div_tr.clientHeight + _div_br.clientHeight + 25 + "px";	// 25px : 내용 테이블과의 여백
        jQuery(divPage).css('top',_divTop + _div_tr.clientHeight + _div_br.clientHeight + 25 + "px");	// 25px : 내용 테이블과의 여백
        jQuery(divPage).width(jQuery(_div_tl).width()+jQuery(_div_tr).width());	
    } 
  
} 

// 스크롤시 타 div 테이블 영역의 스크롤되게 하는 함수
function _onScrolling() { 
  _div_tr.scrollLeft = _div_br.scrollLeft; 
  _div_bl.scrollTop  = _div_br.scrollTop; 
}

var _leftObjMargin = 10;
var _leftWidth = 0;

// clientWidth : scroll 제외 , $().width() : scroll 포함
// scroll 이 없을때는 두 값이 같고 scroll이 있을때는 $().width()가 + 17만큼 더 크다.
 
// 좌측메뉴 숨김상태일때 테이블 영역 redraw 
function reDrawDataTableByLeft(leftObjId, flag_spread){
	_leftObjMargin = 10;
	_leftWidth = $(leftObjId).width();
	
	if(flag_spread == "hide"){
		jQuery(_div_br).css("left", _div_br.offsetLeft - _leftWidth + _leftObjMargin); 
		jQuery(_div_tl).css("left", _div_tl.offsetLeft - _leftWidth + _leftObjMargin);
		jQuery(_div_tr).css("left", _div_tr.offsetLeft - _leftWidth + _leftObjMargin);
		jQuery(_div_bl).css("left", _div_bl.offsetLeft - _leftWidth + _leftObjMargin);
		
		jQuery(divPage).css("left", divPage.offsetLeft - _leftWidth + _leftObjMargin);

		jQuery(_div_tr).width($(_div_tr).width() + _leftWidth -_leftObjMargin) ;
		jQuery(_div_br).width($(_div_br).width() + _leftWidth -_leftObjMargin) ;

	}else if(flag_spread == "show"){
		jQuery(_div_br).css("left", _div_br.offsetLeft + _leftWidth - _leftObjMargin); 
		jQuery(_div_tl).css("left", _div_tl.offsetLeft + _leftWidth - _leftObjMargin);
		jQuery(_div_tr).css("left", _div_tr.offsetLeft + _leftWidth - _leftObjMargin);
		jQuery(_div_bl).css("left", _div_bl.offsetLeft + _leftWidth - _leftObjMargin);
		
		jQuery(divPage).css("left", divPage.offsetLeft + _leftWidth - _leftObjMargin);

		jQuery(_div_tr).width($(_div_tr).width() - _leftWidth +_leftObjMargin) ;
		jQuery(_div_br).width($(_div_br).width() - _leftWidth +_leftObjMargin) ;

		_leftWidth = 0;
	}

    jQuery(divPage).width(jQuery(_div_tl).width()+jQuery(_div_tr).width());	
    // 화면에서 가로 너비, 세로 높이가 넘쳤는지 여부 확인
    var isOverflowY = _div_br.scrollHeight > _div_br.clientHeight; 
 
    if ( isOverflowY ) {
        //_div_br.style.pixelWidth += 17;
    	//jQuery(_div_br).width(jQuery(_div_br).width()+17);
    	jQuery(_div_br).width(jQuery(_div_tr).width()+17 + 17) ;
    	jQuery(_div_tr).width((_div_br).clientWidth) ;
    } 

	
}

/**
 * Project : SCS_renewal
 * Name : fixedTable.js
 * Author: 노종민
 * version : 1.01
 * Date: 2015-09-30
 * Desc:
 */

var fixedTable = fixedTable || {};

(function($) {
	fixedTable = {
		fixedDiv: null,
		parentDiv: null,
		cloneLeftTop: null,
		cloneRightTop: null,
		cloneLeftBottom: null,
		cloneRightBottom: null,
		cols: [],
		pagingId: null,
		tbodyMinHeight: 200,
		scrollSize: 17,
		setParent: function() {
			this.parentDiv = this.fixedDiv.parent();
		},
		getParentWidth: function() {
			return this.parentDiv.width();
		},
		getParentHeight: function() {
			return this.parentDiv.height();
		},
		getNextAllHeight: function() {
			var nextHeight = 0;
			this.parentDiv.nextAll().each(function(i, el) {
				nextHeight += $(el).outerHeight(true);
			});
			return nextHeight;
		},
		getOffset: function() {
			return this.parentDiv.offset();
		},
		getOffsetX: function() {
			return this.getOffset().left;
		},
		getOffsetY: function() {
			return this.getOffset().top + 2;
		},
		//테이블 복사
		cloneNode: function() {
			this.cloneLeftTop = this.fixedDiv.clone(true);
			this.cloneRightTop = this.fixedDiv.clone(true);
			this.cloneLeftBottom = this.fixedDiv.clone(true);
			this.cloneRightBottom = this.fixedDiv.clone(true);
		},
		//테이블 분할
		devideTable: function() {
			this.setParent();
			this.setColumnWidth();
			this.setRowsHeight();
			this.cloneNode();
			this.appendTable(this.cloneLeftTop, "left", "top");
			this.appendTable(this.cloneRightTop, "right", "top");
			this.appendTable(this.cloneLeftBottom, "left", "bottom");
			this.appendTable(this.cloneRightBottom, "right", "bottom");
			this.render();
			this.fixedDiv.remove();
			this.fixedDiv = null;
		},
		//테이블 가로 사이즈 설정
		setTableWidth: function(obj) {
			obj.find("table").width(function() {
				var sum = 0;
				for (var i = 0; i < obj.find("col").length; i++) {
					sum += parseInt(obj.find("col").eq(i).attr("width"));
				}
				return sum;
			});
		},
		//클론된 테이블 삽입
		//@param  {[objcet]} obj [복사된 객체]
		//@param  {[position]} horizontal [객체의 가로 위치]
		//@param  {[position]} vertical [객체의 세로 위치]
		appendTable: function(obj, horizontal, vertical) {
			if (vertical == "top") {
				if (obj.find("th[columnFix]").length) {
					if (horizontal == "left") {
						obj.find("col").each(function(i, el){
							if (i >= obj.find("table > thead > tr:first-child > th[columnFix]").length) {
								$(el).remove();
							}
						});
						obj.find("th").not("th[columnFix]").remove();
						obj.attr("id", "fixed_frame_top_left_div");
						obj.find("table").css("table-layout", "fixed");
						this.setTableWidth(obj);
					} else if (horizontal == "right") {
						obj.find("col").each(function(i, el){
							if (i < obj.find("table > thead > tr:first-child > th[columnFix]").length) {
								$(el).remove();
							}
						});
						obj.find("th[columnFix]").remove();
						obj.attr("id", "fixed_frame_top_right_div");
						obj.find("table").css("table-layout", "fixed");
						this.setTableWidth(obj);
					}
					obj.find("table > tbody").remove();
					obj.appendTo(this.parentDiv);
				} else {
					if (horizontal == "left") {
						this.setTableWidth(obj);
						obj.find("table > tbody").remove();
						obj.attr("id", "fixed_frame_top_left_div");
						obj.appendTo(this.parentDiv);
					} else if (horizontal == "right") {
						obj.remove();
						this.cloneRightTop = null;
					}
				}
			} else if (vertical == "bottom") {
				if (obj.find("td[columnFix]").length) {
					if (horizontal == "left") {
						obj.find("col").each(function(i, el){
							if (i >= obj.find("table > tbody > tr:first-child > td[columnFix]").length) {
								$(el).remove();
							}
						});
						obj.find("td").not("td[columnFix]").remove();
						obj.attr("id", "fixed_frame_bottom_left_div");
						obj.find("table").css("table-layout", "fixed");
						this.setTableWidth(obj);
					} else if (horizontal == "right") {
						obj.find("col").each(function(i, el){
							if (i < obj.find("table > tbody > tr:first-child > td[columnFix]").length) {
								$(el).remove();
							}
						});
						obj.attr("id", "fixed_frame_bottom_right_div");
						obj.find("td[columnFix]").remove();
						obj.find("table").css("table-layout", "fixed");
						this.setTableWidth(obj);
					}
					obj.find("table > thead").remove();
					obj.appendTo(this.parentDiv);
				} else {
					if (horizontal == "left") {
						this.setTableWidth(obj);
						obj.find("table > thead").remove();
						obj.attr("id", "fixed_frame_bottom_left_div");
						obj.appendTo(this.parentDiv);
					} else if (horizontal == "right") {
						obj.remove();
						this.cloneRightBottom = null;
					}
				}
			}
		},
		//테이블 열 사이즈 설정
		setColumnWidth: function() {
			var that = this;
			var $tds = this.fixedDiv.find("table > tbody").find("tr").first().children("td");
			var len = $tds.length;

			//td의 width를 가져와 col 배열에 삽입
			for (var i = 0; i < len; i++) {
				this.cols[i] = $tds.eq(i).outerWidth(true);
			}

			var colgroup = $('<colgroup></colgroup>');
			var col;

			//cols 배열의 값을 col에 삽입
			for (var i = 0; i < this.cols.length; i++) {
				col = $('<col width='+ that.cols[i] +'px>');
				col.appendTo(colgroup);
			}

			colgroup.prependTo(this.fixedDiv.find("table"));
		},
		//테이블 행 사이즈 설정
		setRowsHeight: function() {
			this.fixedDiv.find("table > thead > tr").each(function(i, el) {
				$(el).outerHeight($(this).outerHeight());
			});

			this.fixedDiv.find("table > tbody > tr").each(function(i, el) {
				$(el).outerHeight($(this).outerHeight());
			});
		},
		//초기화면 렌더링
		render: function() {
			var winHeight = $(window).height();

			//틀고정 상위 객체 높이 설정
			this.parentDiv.outerHeight($.proxy(function() {
				var selfHeight;

				if (this.pagingId != null || this.parentDiv.next()) {
					selfHeight = winHeight - this.getOffsetY() - this.getNextAllHeight() - 15;
				} else {
					selfHeight = winHeight - this.getOffsetY() - 15;
				}

				return selfHeight;
			}, this)).css({
				minHeight: this.cloneLeftTop.outerHeight() + this.tbodyMinHeight
			});

			//왼쪽 상단 객체
			this.cloneLeftTop.css({
				position: "absolute",
				overflow: "hidden",
				top: this.getOffsetY(),
				left: this.getOffsetX()
			}).width($.proxy(function() {
				var h;
				if (this.cloneRightBottom != null) {
					h = $(this).find("table").outerWidth();
				} else {
					h = this.parentDiv.width();
				}
				return h;
			}, this));

			if (this.cloneRightTop === null) {
				this.cloneLeftTop.css({
					overflowX: "hidden",
					overflowY: "scroll"
				});
			}

			//오른쪽 상단 객체
			if (this.cloneRightTop != null) {
				this.cloneRightTop.css({
					position: "absolute",
					overflowX: "hidden",
					overflowY: "scroll",
					top: this.getOffsetY(),
					left: this.getOffsetX() + this.cloneLeftTop.width()
				}).width($.proxy(function() {
					return this.getParentWidth() - this.cloneLeftTop.width();
				},this));
			}

			//왼쪽 하단 객체
			this.cloneLeftBottom.css({
				position: "absolute",
				top: this.getOffsetY() + this.cloneLeftTop.height(),
				left: this.getOffsetX(),
				minHeight: this.tbodyMinHeight
			}).width($.proxy(function() {
				var h;
				if (this.cloneRightBottom != null) {
					h = $(this).find("table").outerWidth();
				} else {
					h = this.parentDiv.width();
				}
				return h;
			}, this)).height($.proxy(function() {
				return this.getParentHeight() - this.cloneLeftTop.outerHeight();
			}, this));

			if (this.cloneRightBottom != null) {
				this.cloneLeftBottom.css({
					overflowX: "scroll",
					overflowY: "hidden"
				});
			} else {
				this.cloneLeftBottom.css({
					overflow: "scroll"
				});
			}

			//오른쪽 하단 객체
			if (this.cloneRightBottom != null) {
				this.cloneRightBottom.css({
					position: "absolute",
					overflow: "scroll",
					top: this.getOffsetY() + this.cloneRightTop.height(),
					left: this.getOffsetX() + this.cloneLeftTop.width(),
					minHeight: this.tbodyMinHeight
				}).width($.proxy(function() {
					return this.getParentWidth() - this.cloneLeftTop.width();
				},this)).height($.proxy(function() {
					return this.getParentHeight() - this.cloneLeftTop.outerHeight();
				}, this));
			}

			$('html, body').css("overflow-x", "auto");
		},
		//리사이즈시 각 클론 영역을 초기화
		resizable: function() {
			var winHeight = $(window).height();

			this.parentDiv.outerHeight($.proxy(function() {
				if (this.pagingId != null || this.parentDiv.next()) {
					selfHeight = winHeight - this.getOffsetY() - this.getNextAllHeight() - 15;
				} else {
					selfHeight = winHeight - this.getOffsetY() - 15;
				}

				return selfHeight;
			}, this)).css({
				minHeight: this.cloneLeftTop.outerHeight() + this.tbodyMinHeight
			});

			//왼쪽 상단 객체
			this.cloneLeftTop.width($.proxy(function() {
				var h;
				if (this.cloneRightBottom != null) {
					h = $(this).find("table").outerWidth();
				} else {
					h = this.parentDiv.width();
				}
				return h;
			}, this)).stop().animate({
				top: this.getOffsetY(),
				left: this.getOffsetX()
			});

			//오른쪽 상단 객체
			if (this.cloneRightTop != null) {
				this.cloneRightTop.width($.proxy(function() {
					return this.getParentWidth() - this.cloneLeftTop.width();
				},this)).stop().animate({
					top: this.getOffsetY(),
					left: this.getOffsetX() + this.cloneLeftTop.width()
				});
			}

			//왼쪽 하단 객체
			this.cloneLeftBottom.width($.proxy(function() {
				var h;
				if (this.cloneRightBottom != null) {
					h = $(this).find("table").outerWidth();
				} else {
					h = this.parentDiv.width();
				}
				return h;
			}, this)).height($.proxy(function() {
				return this.getParentHeight() - this.cloneLeftTop.outerHeight();
			}, this)).stop().animate({
				top: this.getOffsetY() + this.cloneLeftTop.height(),
				left: this.getOffsetX()
			});

			//오른쪽 하단 객체
			if (this.cloneRightBottom != null) {
				this.cloneRightBottom.width($.proxy(function() {
					return this.getParentWidth() - this.cloneLeftTop.width();
				},this)).height($.proxy(function() {
					return this.getParentHeight() - this.cloneLeftTop.outerHeight();
				}, this)).stop().animate({
					top: this.getOffsetY() + this.cloneRightTop.height(),
					left: this.getOffsetX() + this.cloneLeftTop.width()
				});
			}
		},
		//복사된 객체끼리 스크롤을 동기화 시킨다.
		scrollSync: function() {
			if (this.cloneRightBottom != null) {
				this.cloneRightBottom.scroll($.proxy(function() {
					var scrollX = this.cloneRightBottom.scrollLeft();
					var scrollY = this.cloneRightBottom.scrollTop();

					this.cloneRightTop.scrollLeft(scrollX);
					this.cloneLeftBottom.scrollTop(scrollY);
				}, this));
			} else {
				this.cloneLeftBottom.scroll($.proxy(function() {
					var scrollX = this.cloneLeftBottom.scrollLeft();

					this.cloneLeftTop.scrollLeft(scrollX);
				}, this));
			}
		},
		//틀고정 초기화
		init: function(fixedId, pagingId) {
			var $fixedDiv = $("#" + fixedId);
			this.fixedDiv = $fixedDiv;

			if (pagingId != "undefinded") {
				this.pagingId = $("#" + pagingId);
			}

			if (($fixedDiv).find("tbody").find("td").length <= 1) {
				$fixedDiv.css("overflow", "auto");
				return;
			}

			this.devideTable();
			this.scrollSync();

			//리사이즈시 resizable을 호출
			$(window).resize(function() {
				fixedTable.resizable();
			});
		}
	};
})(jQuery);

//기존 프로그램과 호환성을 위해 headerFixInit과 divFixInit 함수 두개를 선언(기능은 같음)
function headerFixInit(headerFixDivId, pageDivId) {
	//페이지 선택시 로딩 이미지
	try{
		$("#pageDivId").find("select").on("change", function (){
			showMessageImage(LoadingAnimation, aniImage01, true, 0, -100);
		});
		$("#pageDivId").find("a").on("click", function (){
			showMessageImage(LoadingAnimation, aniImage01, true, 0, -100);
		});
	}catch(e){}

	fixedTable.init(headerFixDivId, pageDivId);
}

function divFixInit(headerFixDivId, pageDivId) {
	//페이지 선택시 로딩 이미지
	try{
		$("#pageDivId").find("select").on("change", function (){
			showMessageImage(LoadingAnimation, aniImage01, true, 0, -100);
		});
		$("#pageDivId").find("a").on("click", function (){
			showMessageImage(LoadingAnimation, aniImage01, true, 0, -100);
		});
	}catch(e){}

	fixedTable.init(headerFixDivId, pageDivId);
}
