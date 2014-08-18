/**
 * Created by wuhaolin on 8/17/14.
 */
"use strict";

/**
 * 一行按钮模版
 * @type {*|jQuery|HTMLElement}
 */
var oneBtnRow = $('<div class="button-bar"></div>');

/**
 * 一行中的一个按钮模版
 */
var oneBtnTemp = $('<div class="button" data-color style="border: 1px solid green"></div>');

/**
 * 存放所有按钮的容器
 */
var main = $('#mainCon');

/**
 * 储存正方形矩阵里没有小块的RGB值
 * @type {Array} 二维数组
 */
var colorMatrix = [];

/**
 * 目前按钮矩阵的大小的边长
 * @type {number}
 */
var nowSize = 3;

/**
 * 颜色仓库
 */
var colorLib = [
	{color: 'write', count: 0},
	{color: 'black', count: 0}
];

/**
 * 构造一个按钮
 * @param height 按钮的高度
 * @param backgroundColor 按钮的颜色
 */
function makeOneBtn(height, backgroundColor) {
	var newBtn = $(oneBtnTemp).clone();
	$(newBtn).css('height', height);
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
 * 构造一行按钮,每个按钮的都是正方形
 * @param rowWidth 这一行的宽度
 * @param rowHeight 这一行的高度
 * @param rowIndex 这一排时正方形矩阵的第几排(0开始)
 */
function makeBtnRow(rowWidth, rowHeight, rowIndex) {
	var newBtnRow = $(oneBtnRow).clone();
	var btnCount = rowWidth / rowHeight;
	colorMatrix[rowIndex] = [];
	for (var i = 0; i < btnCount; i++) {
		var oneColor = randomRGB();
		colorMatrix[rowIndex][i] = oneColor;
		$(newBtnRow).append(makeOneBtn(rowHeight, oneColor));
	}
	return newBtnRow;
}

/**
 * 从colorLib里面随机产生一个RGB值，并且对应的颜色值加一
 */
function randomRGB() {
	var index = Math.floor(Math.random() * colorLib.length);
	colorLib[index].count++;
	return colorLib[index].color;
}

/**
 * 重新设置中间的正方形矩阵
 * @param size 这个矩阵一行包含多少个小正方形
 */
function randomMain(size) {
	//计数清0
	for (var i = 0; i < colorLib.length; i++) {
		colorLib[i].count = 0;
	}

	$(main).html('');
	var width = $(main).width();
	var rowHeight = width / size;
	for (var i = 0; i < size; i++) {
		$(main).append(makeBtnRow(width, rowHeight, i));
	}
}

randomMain(nowSize);

