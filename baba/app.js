/**
 * 游戏显示尺寸
 * @type {{Width: number, Height: number}}
 */
const DisPlay = {
	Width: window.innerWidth,
	Height: window.innerHeight
};

/**
 * 中间那个小孩的尺寸
 * @type {{Width: number, Height: number}}
 */
const BoySize = {
	Width: 120,
	Height: 210
};

/**
 * 循环按钮是正方形,这是他的原图片的边长
 * @type {number}
 */
const LoopBtnImgSize = 64;

/**
 * 一共为游戏提供了多少种按钮
 * @type {number}
 */
const LoopBtnSumCount = 15;

/**
 * 下面会显示多少个循环按钮
 * @type {number}
 */
const LoopBtnCount = 5;

/**
 * 同时显示几个请求按钮
 * @type {number}
 */
const ReqBtnCount = 8;

/**
 * 循环按钮是正方形,这是他的在屏幕上真正显示的边长
 * @type {number}
 */
const LoopBtnDisplaySize = DisPlay.Width / LoopBtnCount;

/**
 * 因为院图片和真正应该显示的边长不同,所以应该缩放
 * @type {number}
 */
const ShouldScale = LoopBtnDisplaySize / LoopBtnImgSize;

/**
 * 延时调用时间ms
 * @type {number}
 */
const DelayTime = 500;

/**
 * 计时器
 */
var timer;

/**
 * 目前的总分
 * @type {number}
 */
var score = 0;

/**
 * 最下面轮播的按钮
 * @type {Array}
 */
var LoopBtnList = [];

/**
 * 最下面那排按钮的中间那个答案按钮
 */
var AnswerBtn;

/**
 * 最下面那排按钮的中间那个答案按钮的外面的边框
 */
var AnswerBtnBorder;

/**
 * 存放请求的按钮组
 * @type {Array}
 */
var ReqBtnList = [];

/**
 * 当成功匹配时的那个飞向目标的按钮
 */
var MarchAnimaBtn;

/**
 * 中间那个小孩
 */
var Boy;

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
	//生成计时器
	timer = game.time.create(false);
	timer.loop(DelayTime, goNext, this);
	timer.start();

	//生成答对时的动画按钮
	MarchAnimaBtn = game.add.sprite(0, 0, 'btn', 0);
	MarchAnimaBtn.anchor.set(0.5);
	MarchAnimaBtn.scale.set(ShouldScale);
	MarchAnimaBtn.exists = false;
	game.physics.enable(MarchAnimaBtn);

	//设置中间小孩的位置和动画
	Boy = game.add.sprite(DisPlay.Width / 2, DisPlay.Height / 3, 'boy', 0);
	Boy.anchor.set(0.5);
	Boy.animations.add('happy', [0, 1, 2, 3], 10);
	Boy.animations.add('req', [4, 5, 6, 7], 10, true);
	Boy.animations.add('cry', [8, 9, 10, 11], 10);

	//生成下面一排的按钮
	for (var i = 0; i < LoopBtnCount; i++) {
		var one = game.add.sprite((i + 0.5) * LoopBtnDisplaySize, DisPlay.Height - LoopBtnDisplaySize * 0.5, 'btn', i);
		one.anchor.set(0.5);
		one.scale.set(ShouldScale * 0.5);
		one.alpha = 0.7;
		LoopBtnList[i] = one;
	}
	//答案按钮
	AnswerBtn = LoopBtnList[2];
	AnswerBtn.alpha = 1;
	AnswerBtn.scale.set(ShouldScale);

	//答案按钮的边框
	AnswerBtnBorder = game.add.sprite(2 * LoopBtnDisplaySize - 2, DisPlay.Height - LoopBtnDisplaySize - 2, 'border');
	AnswerBtnBorder.scale.set(ShouldScale);

	//生成所有的请求按钮,顺时针旋转平均分
	for (var i = 0; i < ReqBtnCount; i++) {
		var distance = Boy.width;
		var degree = 2 * Math.PI * i / ReqBtnCount;
		var one = game.add.sprite(Boy.x + distance * Math.cos(degree), Boy.y + distance * Math.sin(degree), 'btn', i);
		one.anchor.set(0.5);
		one.scale.set(ShouldScale);
		ReqBtnList[i] = one;
	}

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
 * 更新请求状态
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
	MarchAnimaBtn.reset(AnswerBtn.x, AnswerBtn.y);
	MarchAnimaBtn.frame = AnswerBtn.frame;
	var tween = game.add.tween(MarchAnimaBtn).to({
		x: Boy.x,
		y: Boy.y
	}, DelayTime, Phaser.Easing.Quadratic.InOut);
	tween.onComplete.add(function () {
		Boy.play('happy');
	}, this);
	tween.start();
	timer.add(DelayTime * Math.random() * 5, updateReq, this, desIndex);
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