/**
 * Created by wuhaolin on 8/17/14.
 */
"use strict";

/**
 * 一行中的一个按钮模版
 */
var oneBtnTemp = $('<div class="one" data-color></div>');

/**
 * 初始化时
 * @type {number}
 */
var initSize = 2;

/**
 * 目前按钮矩阵的大小的边长
 * @type {number}
 */
var nowSize = initSize;

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
 * 存储矩阵里所有的正方形
 * @type {Array}
 */
var btnList = [];

/**
 * 初始化btnList
 */
function initBtnList() {
	var conSize = $(main).width();
	var oneSize = conSize / initSize;
	for (var i = 0; i < initSize * initSize; i++) {
		var oneBtn = makeOneBtn(oneSize, randomColor());
		btnList.push(oneBtn);
		$(main).append(oneBtn);
	}
}

/**
 * 构造一个正方形按钮
 * @param size 按钮的高度
 * @param backgroundColor 按钮的颜色
 */
function makeOneBtn(size, backgroundColor) {
	var newBtn = $(oneBtnTemp).clone();
	$(newBtn).css('height', size - 2);
	$(newBtn).css('width', size - 2);
	$(newBtn).css('backgroundColor', backgroundColor);
	$(newBtn).data('color', backgroundColor);
	$(newBtn).click(function () {
		if (checkNow(this)) {
			randomMain(++nowSize);
		} else {
			alert('no');
			randomMain(nowSize);
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
	$(nowScoreCon).html(nowSize - 2);

	//计数清0
	for (var i = 0; i < colorLib.length; i++) {
		colorLib[i].count = 0;
	}
	var conSize = $(main).width();
	var oneSize = conSize / count;

	var btnSumCount = count * count;
	var shouldAddCount = btnSumCount - btnList.length;

	//重新设置以前现有按钮的大小
	$(btnList).each(function () {
		$(this).css('height', oneSize - 2);
		$(this).css('width', oneSize - 2);
	});

	//如果现有的不够就增加
	if (shouldAddCount > 0) {
		for (var i = 0; i < shouldAddCount; i++) {
			var oneBtn = makeOneBtn(oneSize, randomColor());
			btnList.push(oneBtn);
			$(main).append(oneBtn);
		}
	}

	//对所有的按钮重新设置颜色
	$(btnList).each(function () {
		var backgroundColor = randomColor();
		$(this).css('backgroundColor', backgroundColor);
		$(this).data('color', backgroundColor);
	});

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
	initBtnList();
	timer();
}

startGame();
