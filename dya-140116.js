var dyaBase = document.styleSheets[0];
var tt1 = document.getElementById('tt1');

// console.log(dyaBase.cssRules[0]);

var count = 0;
var kfs = [];

//configure dynic animation object
function instance(kfNamesArray){
	count = kfNamesArray.length;
	for (var i = 0; i < kfNamesArray.length; i++) {
		kfs[kfNamesArray[i]] = dyaBase.cssRules[i];
	};
}

//操作 keyframes 用 insertRule, deleteRule, findRule三个方法
//对CSSStyleSheet类型的对象,可以使用addRule, deleteRule, insertRule, removeRule操作里面的rules
//CSSStyleSheet >> CSSStyleRule, CSSKeyframesRule >>
//可以通过 CSSStyleRule.style.具体属性 来操控CSSStyleRule
//CSSKeyframesRule使用上面的三个方法操控
function createKF(kf){
	kf.insertRule("from{width:20px}", 0);
	kf.insertRule("to{width:200px}", 1);
}

//将 animation 追加到 element 上，呈现动态生成的动画
function addAnimation(element, anim){
	element.style.webkitAnimation = anim;
}

//
function createAniamtion(element, animation){

}

instance(['a','b']);
var kf = dyaBase.cssRules[0];
console.log(kf);
createKF(kf);
console.log(kf);

console.log('------------------------');

addAnimation(tt1, 'a 10s')
