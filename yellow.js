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


var debugPanel = document.getElementById('debug');
var loadPanel = document.querySelector('.loading');
var scene1 = document.querySelector('.scene1');
var scene2 = document.querySelector('.scene2');
var scene3 = document.querySelector('.scene3');
var scene4 = document.querySelector('.scene4');
var scene1_title = document.querySelector('.scene1 h3');
var scene1_left_side = document.querySelector('.scene1 .left-side');
var scene1_right_side = document.querySelector('.scene1 .right-side');
var startTouches = {};
var endTouches = {};
var delay = {};
var curPage = {};
var totalPage = [scene1, scene2, scene3, scene4];
var isTurnPage = false;
var touchStart = false;
var isScrolling;

function init() {
	loadPanel.style.display = 'none';
	curPage.pageNum = 0;
	yellow.addClass(scene1, 'play');
	addEvent();
}

function addEvent() {
	window.addEventListener('resize', onResize);
	window.addEventListener('touchstart', onTouchStart);

}

function onResize() {
	document.body.style.width = "100%";
	document.body.style.height = "100%";
}

function onTouchStart(e) {
	e.preventDefault();
	isScrolling = undefined;
	startTouches.x = e.touches[0].pageX;
	startTouches.y = e.touches[0].pageY;
	window.addEventListener('touchmove', onTouchMove);
	window.addEventListener('touchend', onTouchEnd);
}

function onTouchMove(e) {
	if (e.touches.length > 1 || e.scale && e.scale !== 1) return;

	delay.x = e.touches[0].pageX - startTouches.x;
	delay.y = e.touches[0].pageY - startTouches.y;
	if (typeof isScrolling == 'undefined') {
		isScrolling = !!(isScrolling);
	}
}

function onTouchEnd(e) {
	if (Math.abs(delay.y) > 36 && isTurnPage === false && !isScrolling) {
		touchStart = false;
		if (delay.y < 0) {
			console.log('scroll up');
			next();
		} else if (delay.y > 0) {
			console.log('scroll down');
			prev();
		}
	}
	window.removeEventListener('touchmove', onTouchMove);
	window.removeEventListener('touchend', onTouchEnd);
}
var shake_game = {
	SHAKE_THRESHOLD: 1000,
	shake_last_time: 0,
	cur_shake_info: {
		x: 0,
		y: 0,
		z: 0
	},
	last_shake_info: {
		x: 0,
		y: 0,
		z: 0
	},
	cur_progress: 0,
	shake_count: 0,
	shake_speed:0,
	SHAKE_MINUS: -0.01,
	requestId: null,
	init: function() {
		shake_game.cur_progress=0;
		document.querySelector('.progress-line').style.height ='0%';
		yellow.addClass(document.querySelector('.tips'),'block');
		yellow.removeClass(document.querySelector('.shakegame'),'block');
		document.querySelector('.hands').addEventListener('touchstart', shake_game.stopPropagationHandler);
	},
	stopPropagationHandler: function(e) {
		e.stopPropagation();
	},
	updateProgressBar: function() {
		shake_game.requestId = requestAnimationFrame(shake_game.updateProgressBar);
		if (shake_game.shake_speed == 0) {
			if(shake_game.cur_progress>=0){
				shake_game.cur_progress += shake_game.SHAKE_MINUS;
			}
		} else {
			var _num = (shake_game.shake_speed / 2000);
			shake_game.cur_progress += shake_game.SHAKE_MINUS + _num;
		}
		debugPanel.textContent='cur_progress:'+shake_game.cur_progress+'\n'+'speed'+shake_game.shake_speed;
		if (shake_game.cur_progress >= 100) {
			shake_game.cur_progress = 100;
			//游戏结束！
			yellow.removeClass(document.querySelector('.tips'),'block');
			yellow.addClass(document.querySelector('.shakegame'),'block');
			cancelAnimationFrame(shake_game.requestId);
		}
		document.querySelector('.progress-line').style.height = shake_game.cur_progress + '%';
	},
	deviceMotionHandler: function(e) {
		var acceleration = e.accelerationIncludingGravity;
		var curTime = new Date().getTime();
		var diffTime = curTime - shake_game.shake_last_time;
		if (diffTime > 100) {
			shake_game.shake_last_time = curTime;

			shake_game.cur_shake_info.x = acceleration.x;
			shake_game.cur_shake_info.y = acceleration.y;
			shake_game.cur_shake_info.z = acceleration.z;
			var speed = Math.abs(shake_game.cur_shake_info.x + shake_game.cur_shake_info.y + shake_game.cur_shake_info.z - shake_game.last_shake_info.x - shake_game.last_shake_info.y - shake_game.last_shake_info.z) / diffTime * 10000;
			if (speed > shake_game.SHAKE_THRESHOLD) {
				shake_game.shake_speed = parseInt(speed); //大约1000 ~3000
				shake_game.shake_count++;
				// debugPanel.textContent += speed.toString() + '\n';
			}
			shake_game.last_shake_info.x = shake_game.cur_shake_info.x;
			shake_game.last_shake_info.y = shake_game.cur_shake_info.y;
			shake_game.last_shake_info.z = shake_game.cur_shake_info.z;
		} else {
			shake_game.shake_speed = 0;
		}
	}
}

function doAction() {
	switch (curPage.pageNum) {
		case 0:
			break;
		case 1:
			//摇一摇小游戏
			shakeGame();
			break;
		case 2:
			break;
		default:
			break;
	}
}

function shakeGame() {
	shake_game.init();
	shake_game.requestId = requestAnimationFrame(shake_game.updateProgressBar);
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', shake_game.deviceMotionHandler, false);
	} else {
		alert('不支持 传感器');
	}
}

function prev() {
	var prevOne = totalPage[curPage.pageNum];

	curPage.pageNum--;
	if (curPage.pageNum < 0) {
		curPage.pageNum = 0;
	} else {
		yellow.removeClass(document.getElementById('btn'),'none');
		yellow.removeClass(prevOne, 'in');
		isTurnPage = true;
		var curOne = totalPage[curPage.pageNum];
		yellow.addClass(totalPage[curPage.pageNum], 'in');
		setTimeout(function() {
			yellow.removeClass(prevOne, 'play');
			yellow.addClass(curOne, 'play');
			doAction();
			isTurnPage = false;
		}, 500);
	}
}

function next() {
	var prevOne = totalPage[curPage.pageNum];
	
	curPage.pageNum++;
	if(curPage.pageNum==totalPage.length - 1){
		yellow.addClass(document.getElementById('btn'),'none');
	}
	if (curPage.pageNum > totalPage.length - 1) {
		curPage.pageNum = totalPage.length - 1;
	} else {
		isTurnPage = true;
		yellow.removeClass(prevOne, 'in');
		var curOne = totalPage[curPage.pageNum];
		yellow.addClass(totalPage[curPage.pageNum], 'in');
		setTimeout(function() {
			yellow.removeClass(prevOne, 'play');
			yellow.addClass(curOne, 'play');
			isTurnPage = false;
			doAction();
		}, 500);
	}

}
yellow.preload([
	"z1.jpg",
	"z2.jpg",
	"z3.jpg",
	"z4.jpg",
	"z5.gif"
], init);