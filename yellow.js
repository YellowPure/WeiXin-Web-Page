var yellow = {
	preload: function(picList, callback) {
		var self = this;
		var cache = [];
		var len = picList.length;
		var now = 0;
		var node = document.querySelector('.load-line span');
		var timer = [];
		var reload = function(pic, url) {
			return setTimeout(function() {
				pic.src = url;
			}, 10000);
		}
		for (var i = 0; i < len; i++) {
			cache[i] = new Image();
			cache[i].onload = function() {
				clearTimeout(timer[i]);
				now++;
				node.style.width = now * 100 / len + "%";
				if (now == len && callback) {
					callback();
				}
			}
			cache[i].src = picList[i];
			timer[i] = reload(cache[i], cache[i].src);
		};
	},
	init: function() {
		yellow.preload();
	},
	slider: function(options) {
		var content = options.content;
		var director = options.director;
		var targetPosLeft = null;
		var targetPosTop = null;
		var posTop = 0;
		var posLeft = 0;
		// var reqId = requestAnimationFrame(_scroll);
		switch (director) {
			case 'up':
				posTop = window.innerHeight;
				targetPosTop = options.targetPos;
				break;
			case 'down':
				posTop = -window.innerHeight;
				targetPosTop = options.targetPos;
				break;
			case 'left':
				posLeft = window.innerWidth;
				targetPosLeft = options.targetPos;
				break;
			case 'right':
				targetPosLeft = options.targetPos;
				posLeft = -window.innerWidth;
				break;
			default:
				posTop = -window.innerHeight;
				break;
		}
		var reqId = requestAnimationFrame(_scroll);
		// content.style.left=posLeft+'px';
		// content.style.top=posTop+'px';
		if (targetPosLeft != null) content.style.left = '100px';
		if (targetPosTop != null) content.style.top = targetPosTop + 'px';
		// content.style.transition='';
		function _scroll() {
			if (content.style.left == targetPosLeft || content.style.top == targetPosTop) {}
		}
	},
	core_rnotwhite: /\S+/g,
	rclass: /[\t\r\n\f]/g,
	addClass: function(node, str) {
		if (!new RegExp("(^|\\s+)" + str).test(node.className)) {
			node.className = node.className + " " + str;
		}
	},
	removeClass: function(node, str) {
		node.className = node.className.replace(new RegExp("(^|\\s+)" + str), "");
	}
}



var loadPanel = document.querySelector('.loading');
var scene1 = document.querySelector('.scene1');
var scene1_title = document.querySelector('.scene1 h3');
var scene1_left_side = document.querySelector('.scene1 .left-side');
var scene1_right_side = document.querySelector('.scene1 .right-side');
var startTouches={};
var endTouches={};
var delay={};
var curPage={};
var nextPage={};
var prevPage={};

function startScene() {
	loadPanel.style.display = 'none';
	yellow.addClass(scene1,'in');
	yellow.addClass(scene1_title, 'fadeInDown');
	yellow.addClass(scene1_title, 'animated');
	yellow.addClass(scene1_left_side, 'fadeInLeft');
	yellow.addClass(scene1_left_side, 'animated');
	yellow.addClass(scene1_right_side, 'fadeInRight');
	yellow.addClass(scene1_right_side, 'animated');
	addEvent();

	
}

function addEvent(){
	scene1_title.addEventListener('webkitAnimationEnd', function() {
		yellow.removeClass(scene1_title, 'fadeInDown');
		yellow.removeClass(scene1_title, 'animated');
	});
	scene1_left_side.addEventListener('webkitAnimationEnd', function() {
		yellow.removeClass(scene1_title, 'fadeInLeft');
		yellow.removeClass(scene1_title, 'animated');
	});
	scene1_right_side.addEventListener('webkitAnimationEnd', function() {
		yellow.removeClass(scene1_title, 'fadeInRight');
		yellow.removeClass(scene1_title, 'animated');
	});
	window.addEventListener('touchstart',onTouchStart);
}
function onTouchStart(e){
	startTouches.x=e.touches[0].pageX;
	startTouches.y=e.touches[0].pageY;
	window.addEventListener('touchmove',onTouchMove);
	window.addEventListener('touchend',onTouchEnd);
}
function onTouchMove(e){
	if(e.touches.length>1||e.scale&&e.scale!==1)return;
	delay.x=e.touches[0].pageX - startTouches.x;
	delay.y=e.touches[0].pageY - startTouches.y;
}
function onTouchEnd(e){
	if(delay.y<0){
		console.log('scroll up');
		next();
	}	
}
function next(){

}
yellow.preload([
	"http://p2.youxi.bdimg.com/site/wx/images/dtszj-bg.jpg",
	"z1.jpg",
	"z2.jpg"
], startScene);