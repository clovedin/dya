function $(slz){
	return document.getElementById(slz);
}

var $cc = $;

var dya = {};

dya.sheetP = 0;							//在那个styleSheet对象里动态生成CSSKeyframeRule，该styleSheet在document中的序号
dya.curRuleP = 0;						//当前CSSKeyframeRule对象在CSSRuleList中的位置


function keyframes(name){

	if (!name) {
		var name = 'dyn'+dya.curRuleP;
	};
	this.name = name;
	this.status = -1;
	this.ruleP = dya.curRuleP;
	this.rules = '';
	this.ruleStatus = -1;
	this.param = {
		origin : '',
		style : '',
		perspective : '',
		perspectiveOrigin : '',
		backfaceVisibility : ''
	};
	document.styleSheets[dya.sheetP].addRule('@-webkit-keyframes '+name, '', dya.curRuleP++);
}

keyframes.prototype.scale = function(x, y){
	if (!x) x = 1;
	if(!y) y = 1;
	var temp = 'scale('+x+', '+y+')';

	if (this.rules || !this.ruleStatus) {								//
		this.rules += temp;
	}else{											//第一次调用，添加头部
		this.rules = '-webkit-transform:'+temp;
	};
	return this;
}

keyframes.prototype.skew = function (x, y){
	if (!x) x = 1;
	if(!y) y = 1;
	var temp = 'skew('+x+'deg, '+y+'deg)';

	if (this.rules || !this.ruleStatus) {
		this.rules += temp;
	}else{
		this.rules = '-webkit-transform:'+temp;
	};
	return this;
}

keyframes.prototype.rotate = function (x){
	if (!x) x = 1;
	var temp = 'rotate('+x+'deg)';

	if (this.rules || !this.ruleStatus) {
		this.rules += temp;
	}else{
		this.rules = '-webkit-transform:'+temp;
	};
	return this;
}

keyframes.prototype.translate = function (x, y){
	if (!x) x = 0;
	if (!y) y = 0;
	var temp = ' translate('+x+'px, '+y+'px)';
	
	if (this.rules || !this.ruleStatus) {
		this.rules += temp;
	}else{
		this.rules = '-webkit-transform:'+temp;
	};
	return this;
}

keyframes.prototype.origin = function(x, y){
	if (!x) x = 0;
	if (!y) y = 0;

	this.param.origin = '-webkit-transform-origin:'+x+'% '+y+'%;';

	return this;
}

keyframes.prototype.start = function(param){
	if (param) {
		this.rules = 'from{'+addKeyframesParam(param);
	}else{
		this.rules = 'from{';
	};
	this.rules += '-webkit-transform:';
	this.ruleStatus = 0;
	// console.log(this.rules);
	return this;
}

keyframes.prototype.then = function(point, param){
	this.rules += ';}|';
	if (!point) point = 100; 
	if (param) {
		this.rules += (point+'%{'+addKeyframesParam(param));
	}else{
		this.rules += (point+'%{');
	};
	this.rules += '-webkit-transform:';
	this.ruleStatus = 1;
	// console.log(this.rules);
	return this;
}

keyframes.prototype.end = function(){
	if (this.rules.indexOf('to{') < 0 || (this.rules.indexOf('100%{') < 0) )  {	//	检查是否已经结束
		this.rules += ';}|to{}';
	}else{
		this.rules += ';}';
	};

	createKeyframes(document.styleSheets[dya.sheetP].rules[this.ruleP], this.rules);
	
	return this;
}

function createKeyframes(rule, rules){
	var rle = rules.split('|');
	if (rle.length > 2) {
		for (var i = 0; i < rle.length; i++) {
			rule.insertRule(rle[i], i);
		};
	}else if (rle.length == 2){
		rule.insertRule('from{'+rle[0], 0);
		rule.insertRule(rle[1], 1);
		if (rle[1].substring(0,4) != '100%') {
			rule.insertRule('to{}', 2);
		};
	}else{
		rule.insertRule('from{}', 0);
		rule.insertRule('to{'+rle[0]+';}', 1);
	};
}

keyframes.prototype.play = function(node, time, param, endCallback, iterCallback){

	if (Object.prototype.toString.call(node) === '[object String]') {
		node = $(node);
	}
	if (typeof(node) === 'object') {
		node.style.webkitAnimationName = this.name;										//添加动画名，时间两个必选属性
		if (!time) time = 3;
		node.style.webkitAnimationDuration = time+'s';

		if (param) {																	//添加可选的动画属性
			if (param.fillMode) node.style.webkitAnimationFillMode = param.fillMode;
			if (param.delay) node.style.webkitAnimationDelay = param.delay;
			if (param.direction) node.style.webkitAnimationDirection = param.direction;
			if (param.iteration) node.style.webkitAnimationIterationCount = param.iteration;
			if (param.playState) node.style.webkitAnimationPlayState = param.playState;
			if (param.timing) node.style.webkitAnimationTimingFunction = param.timing;
		};
		node.addEventListener('webkitAnimationEnd', endCallback, false);				//添加动画完成事件的回调
		node.addEventListener('webkitAnimationIteration', iterCallback, false);			//添加动画循环事件的回调

		this.status = 0;
	};

	
}

keyframes.prototype.pause = function(node){
	console.log('animation paused');
	node.style.webkitAnimationPlayState = 'paused';
	this.status = -2;
}
keyframes.prototype.resume = function(node){
	console.log('animation resume');
	node.style.webkitAnimationPlayState = 'running';
	this.status = 2;
}

//使用当前对象，创建新的keyframes对象，使用参数对当前对象进行修改
keyframes.prototype.clone = function(update, name){
	var newKeyframes = new keyframes(name);
	if (Object.prototype.toString.call(update) === '[object Array]') {

	}else {
		newKeyframes.rules = updateRule(''+this.rules, update);
	};
	createKeyframes(document.styleSheets[dya.sheetP].rules[newKeyframes.ruleP], newKeyframes.rules);
	return newKeyframes;
}

function updateRule(rule, udt){
	rule = rule.replace('from', '0%');
	rule = rule.replace('to', '100%');
	if (Object.prototype.toString.call(udt) === '[object Number]') {
		var s1 = rule.indexOf(udt+'%{');
		var s2 = rule.indexOf('|', s1);
		rule = rule.substr(0, s1)+rule.substr(s2+1, rule.length-s2);
	}else if (Object.prototype.toString.call(udt) === '[object String]'){
		var point = udt.substr(0, udt.indexOf('%')+1);
		var s1 = rule.indexOf(point+'{');
		var s2 = rule.indexOf('|', s1);
		rule = rule.substr(0, s1-1)+'|'+udt+'|'+rule.substr(s2+1, rule.length-s2);
	};
	return rule;
}

function addKeyframesParam(param){
	var temp = '';
	if (param.origin) temp += ('-webkit-transform-origin:'+param.origin+';');
	if (param.style) temp += ('-webkit-transform-style:'+param.style+';'+';');
	if (param.perspective) temp += ('-webkit-perspective:'+param.perspective+';');
	if (param.perspectiveOrigin) temp += ('-webkit-perspective-origin:'+param.perspectiveOrigin+';');
	if (param.backfaceVisibility) temp += ('-webkit-backface-visibility:'+param.backfaceVisibility+';');
	return temp;
}

