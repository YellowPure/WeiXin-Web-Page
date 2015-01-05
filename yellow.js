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
var scene2 = document.querySelector('.scene2');
var scene3 = document.querySelector('.scene3');
var scene1_title = document.querySelector('.scene1 h3');
var scene1_left_side = document.querySelector('.scene1 .left-side');
var scene1_right_side = document.querySelector('.scene1 .right-side');
var startTouches={};
var endTouches={};
var delay={};
var curPage={};
var totalPage=[scene1,scene2,scene3];
var isTurnPage=false;
var SHAKE_THRESHOLD=3000;
var shake_last_time=0;
var shake={x:0,y:0,z:0};
var last_shake={x:0,y:0,z:0};
var shake_count=0;

function startScene() {
	loadPanel.style.display = 'none';
	curPage.pageNum=0;
	yellow.addClass(scene1,'play');
	addEvent();
	
}
function deviceMotionHandler(e){
	var acceleration=e.accelerationIncludingGravity;

	var curTime=new Date().getTime();
	var diffTime=curTime=shake_last_time;
	console.log('start devicemotion');
	if(diffTime>100){
		shake_last_time=curTime;

		shake.x=acceleration.x;
		shake.y=acceleration.y;
		shake.z=acceleration.z;

		var speed=Math.abs(shake.x+shake.y+shake.z - last_shake.x - last_shake.y - last_shake.z)/diffTime*10000;
		if(speed>SHAKE_THRESHOLD){
			shake_count++;
			document.querySelector('.shake_count').textContent=shake_count.toString();
		}
		last_shake.x=shake.x;
		last_shake.y=shake.y;
		last_shake.z=shake.z;
	}
}
function addEvent(){
	window.addEventListener('touchstart',onTouchStart);
	if(window.DeviceMotionEvent){
		window.addEventListener('devicemotion',deviceMotionHandler,false);
	}else{
		alert('不支持 传感器');
	}
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
	if(Math.abs(delay.y)>36&&isTurnPage===false){
		if(delay.y<0){
			console.log('scroll up');
			next();
		}else if(delay.y>0){
			console.log('scroll down');
			prev();
		}	
	}
	
}
function prev(){
	var prevOne=totalPage[curPage.pageNum];
	yellow.removeClass(totalPage[curPage.pageNum],'in');
	curPage.pageNum--;
	if(curPage.pageNum<0){
		curPage.pageNum=0;
	}else{
		isTurnPage=true;
	}
	var curOne=totalPage[curPage.pageNum];
	yellow.addClass(totalPage[curPage.pageNum],'in');
	setTimeout(function(){
		yellow.removeClass(prevOne,'play');
		yellow.addClass(curOne,'play');
		isTurnPage=false;
	},500);
}
function next(){
	var prevOne=totalPage[curPage.pageNum];
	yellow.removeClass(totalPage[curPage.pageNum],'in');
	curPage.pageNum++;
	if(curPage.pageNum>totalPage.length-1){
		curPage.pageNum=totalPage.length-1;
	}else{
		isTurnPage=true;
	}
	var curOne=totalPage[curPage.pageNum];
	yellow.addClass(totalPage[curPage.pageNum],'in');
	setTimeout(function(){
		yellow.removeClass(prevOne,'play');
		yellow.addClass(curOne,'play');
		isTurnPage=false;
	},500);
}
yellow.preload([
	"z1.jpg",
	"z2.jpg",
	"z3.jpg",
	"z4.jpg"
], startScene);