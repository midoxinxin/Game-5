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
var oneBtnTemp = $('<div class="button" data-color style="border: none"></div>');

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
		alert($(this).data('color'));
	});
	return newBtn;
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
 * 随机产生一个RGB值
 */
function randomRGB() {
	function c() {
		return Math.floor(Math.random() * 256).toString(16)
	}

	return "#" + c() + c() + c();
}

/**
 * 重新设置中间的正方形矩阵
 * @param size 这个矩阵一行包含多少个小正方形
 */
function randomMain(size) {
	$(main).html('');
	var width = $(main).width();
	var rowHeight = width / size;
	for (var i = 0; i < size; i++) {
		$(main).append(makeBtnRow(width, rowHeight,i));
	}
}

randomMain(5);

