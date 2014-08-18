/**
 * Created by wuhaolin on 8/17/14.
 */
"use strict";

/**
 * 一行中的一个按钮模版
 */
var oneBtnTemp = $('<div class="one" data-color></div>');

/**
 * 目前按钮矩阵的大小的边长
 * @type {number}
 */
var nowSize = 2;

/**
 * 目前剩余的时间，秒
 */
var nowReTime = 120;

/**
 * 显示分数的html
 * @type {*|jQuery|HTMLElement}
 */
var nowScoreCon = $('#scoreCon');

/**
 * 显示剩余时间的html
 * @type {*|jQuery|HTMLElement}
 */
var nowTimeCon = $('#timeCon');

/**
 * 存放所有按钮的容器
 */
var main = $('#mainCon');

/**
 * 颜色仓库
 */
var colorLib = [
	{color: 'yellow', count: 0},
	{color: 'green', count: 0}
];

/**
 * 构造一个正方形按钮
 * @param size 按钮的高度
 * @param backgroundColor 按钮的颜色
 * @param left x
 * @param top y
 */
function makeOneBtn(size, left, top, backgroundColor) {
	var newBtn = $(oneBtnTemp).clone();
	$(newBtn).css('height', size-2);
	$(newBtn).css('width', size-2);
	$(newBtn).css('left', left);
	$(newBtn).css('top', top);
	$(newBtn).css('backgroundColor', backgroundColor);
	$(newBtn).data('color', backgroundColor);
	$(newBtn).click(function () {
		if (checkNow(this)) {
			randomMain(++nowSize);
		} else {
			alert('no');
			randomMain(--nowSize);
		}
	});
	return newBtn;
}

/**
 * 检验选择的按钮是否是颜色最多的按钮
 * @param btn
 * @returns {boolean}
 */
function checkNow(btn) {
	var color = $(btn).data('color');
	var count = 0;
	for (var i = 0; i < colorLib.length; i++) {
		if (colorLib[i].color == color) {
			count = colorLib[i].count;
			break;
		}
	}
	for (var i = 0; i < colorLib.length; i++) {
		if (count < colorLib[i].count) {
			return false;
		}
	}
	return true;
}

/**
 * 从colorLib里面随机产生一个颜色值，并且对应的颜色值加一
 */
function randomColor() {
	var index = Math.floor(Math.random() * colorLib.length);
	colorLib[index].count++;
	return colorLib[index].color;
}

/**
 * 重新设置中间的正方形矩阵
 * @param count 这个矩阵一行包含多少个小正方形
 */
function randomMain(count) {
	//更新显示分数
	$(nowScoreCon).html(nowSize - 3);

	//计数清0
	for (var i = 0; i < colorLib.length; i++) {
		colorLib[i].count = 0;
	}

	$(main).html('');
	var conSize = $(main).width();
	var oneSize = conSize / count;
	for (var i = 0; i < count; i++) {
		for (var j = 0; j < count; j++) {
			var oneBtn = makeOneBtn(oneSize, j * oneSize, i * oneSize, randomColor());
			$(main).append(oneBtn);
		}
	}
}

/**
 * 倒计时
 */
function timer() {
	nowReTime--;
	//更新到html
	$(nowTimeCon).html(nowReTime);

	if (nowReTime <= 0) {
		alert('no');
		return;
	}
	setTimeout(timer, 1000);
}

/**
 * 开始游戏
 */
function startGame() {
	randomMain(nowSize);
	timer();
}

startGame();
