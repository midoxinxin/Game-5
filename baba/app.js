/**
 * 游戏显示尺寸
 * @type {{Width: number, Height: number}}
 */
const DisPlay = {
	Width: 320,
	Height: 568
};

/**
 * 延时调用时间ms
 * @type {number}
 */
const DelayTime = 500;

/**
 * 下面会显示多少个循环按钮
 * @type {number}
 */
const LoopBtnCount = 5;

/**
 * 循环按钮是正方形,这是他的原图片的边长
 * @type {number}
 */
const LoopBtnImgSize = 64;

/**
 * 循环按钮是正方形,这是他的在屏幕上真正显示的边长
 * @type {number}
 */
const LoopRealSize = DisPlay.Width / LoopBtnCount;

/**
 * 因为院图片和真正应该显示的边长不同,所以应该缩放
 * @type {number}
 */
const ShouldScale = LoopRealSize / LoopBtnImgSize;

/**
 * 一共为游戏提供了多少种按钮
 * @type {number}
 */
const LoopBtnSumCount = 15;

/**
 * 同时显示几个请求按钮
 * @type {number}
 */
const ReqBtnCount = 5;

/**
 * 计时器
 */
var timer;

/**
 * 最下面轮播的按钮
 * @type {Array}
 */
var LoopBtnList = [];

/**
 * 存放请求的按钮组
 * @type {Array}
 */
var ReqBtnList = [];

/**
 * 目前的总分
 * @type {number}
 */
var score = 0;

/**
 * 当成功匹配时的那个飞向目标的按钮
 */
var MarchAnimaBtn;

/**
 * 中间那个小孩
 */
var Boy;

const BoySize = {
	Width: 120,
	Height: 210
};

var game = new Phaser.Game(DisPlay.Width, DisPlay.Height, Phaser.AUTO, 'the');

var main_state = {
	preload: preload,
	create: create,
	update: update,
	render: render
};
game.state.add('main', main_state);
game.state.start('main');

function preload() {
	game.load.spritesheet('btn', 'assets/btn.png', LoopBtnImgSize, LoopBtnImgSize);
	game.load.spritesheet('boy', 'assets/boy.png', BoySize.Width, BoySize.Height);
	game.load.image('border', 'assets/border.png');
	game.stage.backgroundColor = '#71c5cf';
}

function create() {
	timer = game.time.create(false);
	timer.loop(DelayTime, goNext, this);
	timer.start();

	MarchAnimaBtn = game.add.sprite(0, 0, 'btn', 0);
	MarchAnimaBtn.exists = false;
	game.physics.enable(MarchAnimaBtn);

	Boy = game.add.sprite(DisPlay.Width / 2, DisPlay.Height / 2, 'boy', 0);
	Boy.anchor.setTo(0.5, 0.5);
	Boy.animations.add('happy', [0, 1, 2, 3], 10, false);
	Boy.animations.add('req', [4, 5, 6, 7], 10, true);
	Boy.animations.add('cry', [8, 9, 10, 11], 10);

	for (var i = 0; i < LoopBtnCount; i++) {
		var one = game.add.sprite(i * LoopRealSize, DisPlay.Height - LoopRealSize, 'btn', i);
		one.scale.setTo(ShouldScale, ShouldScale);
		LoopBtnList[i] = one;
	}
	for (var i = 0; i < ReqBtnCount; i++) {
		var one = game.add.sprite(i * LoopRealSize, 0, 'btn', i);
		one.scale.setTo(ShouldScale, ShouldScale);
		ReqBtnList[i] = one;
	}
	game.add.sprite(2 * LoopRealSize - 2, DisPlay.Height - LoopRealSize - 2, 'border');
	updateReq();
}

/**
 * 轮播按钮到下一个状态
 */
function goNext() {
	for (var i = 0; i < LoopBtnCount - 1; i++) {
		LoopBtnList[i].frame = LoopBtnList[i + 1].frame;
	}
	LoopBtnList[LoopBtnList.length - 1].frame = Math.floor(Math.random() * LoopBtnSumCount);
}

/**
 * 更新所有请求状态
 */
function updateReq(beginIndex) {
	for (var i = beginIndex; i < ReqBtnList.length - 1; i++) {
		ReqBtnList[i].frame = ReqBtnList[i + 1].frame;
	}
	ReqBtnList[ReqBtnList.length - 1].frame = Math.floor(Math.random() * LoopBtnSumCount);
	Boy.play('req');
}

/**
 * 检查第三个轮播按钮的值是否在所有的请求按钮里
 */
function checkNow() {
	console.log(LoopBtnList[2].frame);
	for (var i = 0; i < ReqBtnList.length; i++) {
		if (LoopBtnList[2].frame == ReqBtnList[i].frame) {
			score++;
			showMarchAnima(i);
			Boy.play('happy');

			timer.add(DelayTime, updateReq, this, i);
//			updateReq(i);
			return;
		}
	}
	score = 0;
	Boy.play('cry');
	timer.add(DelayTime, function () {
		restartGame();
	});
}

function showMarchAnima(desIndex) {
	var desSprite = ReqBtnList[desIndex];
	MarchAnimaBtn.reset(2 * LoopRealSize, DisPlay.Height - LoopRealSize);
	MarchAnimaBtn.frame = desSprite.frame;
	game.physics.arcade.accelerateToObject(MarchAnimaBtn, desSprite, 5000, 0);
}

function update() {
}

function render() {
	game.debug.text(score + '分', 100, 100, 'red');
}

function restartGame() {
	alert('游戏结束,分数为' + score + '重新开始');
	game.state.start('main');
}