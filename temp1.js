function $(slz){
	return document.getElementById(slz);
}

var dya = {};

dya.sheet = createSheet();
dya.ruleP = 0;
dya.rules = '';



function prefix(tag){
	return '-webkit-'+tag;
}

function createSheet(){
	//create <style> element
	var style = document.createElement('style');
	//append <style> to <head>
	document.head.appendChild(style);
	return style.sheet;
}

function keyframes(name){
	if (!name) var name = 'dyn'+dya.ruleP;

	this.name = name;		//关键帧的名字

	dya.sheet.addRule(prefix('keyframes')+' '+name, '');
}

dya.transform = function(selector){
	if (selector) {
		dya.sheet.addRule(selector, this.rules, this.ruleP++);
	}
	return this.sheet;
}

//2d缩放
dya.scale = function(x, y){
	if(!y) y = 1;
	var temp = 'scale('+x+', '+y+')';

	if (this.rules) {								//
		this.rules += temp;
	}else{											//第一次调用，添加头部
		this.rules = prefix('transform:')+temp;
		this.ruleStatus++;
	}
	return this;
}
//2d翻转
dya.skew = function (x, y){
	if(!y) y = 0;
	var temp = 'skew('+x+'deg, '+y+'deg)';

	if (this.rules) {
		this.rules += temp;
	}else{
		this.rules = prefix('transform:')+temp;
		this.ruleStatus++;
	};
	return this;
}
//2d旋转
dya.rotate = function (x){
	if (!x) x = 1;
	var temp = 'rotate('+x+'deg)';

	if (this.rules) {
		this.rules += temp;
	}else{
		this.rules = prefix('transform:')+temp;
		this.ruleStatus++;
	};
	return this;
}
//2d移动
dya.translate = function (x, y){
	if (!y) y = 0;
	var temp = ' translate('+x+'px, '+y+'px)';
	
	if (this.rules) {
		this.rules += temp;
	}else{
		this.rules = prefix('transform:')+temp;
		this.ruleStatus++;
	};
	return this;
}

dya.checkType = function(willCheck, type){
	switch (type){
		case 'String':
		case 'string':
			type = '[object String]';
			break;
		case 'Number':
		case 'number':
			type = '[object Number]';
			break;
		case 'Bool':
		case 'bool':
		case 'Boolean':
		case 'boolean':
			type = '[object Boolean]';
			break;
		case 'Array':
		case 'array':
			type = '[object Array]';
			break;
		case 'Obj':
		case 'obj':
		case 'Object':
		case 'object':
			type = '[object Object]';
			break;
		case 'Fun':
		case 'fun':
		case 'Function':
		case 'function':
			type = '[object Function]';
			break;
	}
	if (Object.prototype.toString.call(willCheck) === '[object Array]') {
		for(var i=0,len=weillCheck.length;i<len;i++){
			if (Object.prototype.toString.call(willCheck[i]) !== type) return -(i+1);
		}
	}else{
		if (Object.prototype.toString.call(willCheck) !== type) {
			return -1;
		}
	};

	return 0;
}
