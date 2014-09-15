"use strict";

/**
 * 游戏显示尺寸
 * @type {{Width: number, Height: number}}
 */
var DisPlay = {
  Width: window.innerWidth,
  Height: window.innerHeight
};

/**
 * 中间那个小孩的尺寸
 * @type {{Width: number, Height: number}}
 */
var BoySize = {
  Width: 120,
  Height: 210
};

/**
 * 中间小孩的名字,要和图片同名
 */
var BoyName;

/**
 * 循环按钮是正方形,这是他的原图片的边长
 * @type {number}
 */
var LoopBtnImgSize = 140;

/**
 * 一共为游戏提供了多少种按钮
 * @type {number}
 */
var LoopBtnSumCount = 9;

/**
 * 下面会显示多少个循环按钮
 * @type {number}
 */
var LoopBtnCount = 5;

/**
 * 此时同时显示几个请求按钮
 * @type {number}
 */
var NowReqBtnCount = 2;

/**
 * 此时下面请求选修的个数
 * @type {number}
 */
var NowLoopChooseCount = 5;

/**
 *
 * 循环按钮是正方形,这是他的在屏幕上真正显示的边长
 * @type {number}
 */
var LoopBtnDisplaySize = DisPlay.Width / LoopBtnCount;

/**
 * 因为院图片和真正应该显示的边长不同,所以应该缩放
 * @type {number}
 */
var ShouldScale = LoopBtnDisplaySize / LoopBtnImgSize;

/**
 * 延时调用时间ms
 * @type {number}
 */
var DelayTime = 600;

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
 * 分数在所有分数中的百分比
 * @type {number}
 */
var rankBi = 0;

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

/**
 * 显示给用户的文字
 */
var ShowLabel;

var game = new Phaser.Game(DisPlay.Width, DisPlay.Height, Phaser.AUTO, 'the');

var main_state = {
  preload: preload,
  create: create
};
game.state.add('main', main_state);

function preload() {


  //加载所需资源
  game.load.spritesheet('btn', 'assets/btn.png', LoopBtnImgSize, LoopBtnImgSize);
  game.load.spritesheet(BoyName, 'assets/' + BoyName + '.png', BoySize.Width, BoySize.Height);
  game.load.image('gameback', 'assets/gameback.png');

}

function create() {

  game.add.sprite(0, 0, 'gameback');

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

  //生成显示给用户的文字
  ShowLabel = game.add.text(DisPlay.Width / 2, 5, '0分', {font: "25px Arial", fill: "#fff", align: "center"});
  ShowLabel.anchor.set(0.5, 0);

  //设置中间小孩的图像的位置和动画
  Boy = game.add.sprite(DisPlay.Width / 2, DisPlay.Height / 2, BoyName, 0);
  Boy.anchor.set(0.5);
  Boy.animations.add('happy', [0], 2);
  Boy.animations.add('req', [1, 2], 2, true);
  Boy.animations.add('cry', [2], 2);

  buildReq();

  //生成下面一排的按钮
  for (var i = 0; i < LoopBtnCount; i++) {
    var one = game.add.sprite((i + 0.5) * LoopBtnDisplaySize, DisPlay.Height - LoopBtnDisplaySize * 0.5, 'btn', i % NowLoopChooseCount);
    one.anchor.set(0.5);
    one.scale.set(ShouldScale * 0.6);
    one.alpha = 0.5;
    LoopBtnList[i] = one;
  }
  //答案按钮
  AnswerBtn = LoopBtnList[2];
  AnswerBtn.alpha = 1;
  AnswerBtn.scale.set(ShouldScale);

  updateReq();
}

/**
 * 轮播按钮到下一个状态
 */
function goNext() {
  for (var i = 0; i < LoopBtnCount - 1; i++) {
    LoopBtnList[i].frame = LoopBtnList[i + 1].frame;
  }
  LoopBtnList[LoopBtnList.length - 1].frame = Math.floor(Math.random() * NowLoopChooseCount);
}

/**
 * 生成所有的请求按钮,顺时针旋转平均分
 */
function buildReq() {
  //先清空原来所有的
  for (var i = 0; i < ReqBtnList.length; i++) {
    ReqBtnList[i].destroy();
  }
  for (var i = 0; i < NowReqBtnCount; i++) {
    var distance = Boy.width;
    var degree = 2 * Math.PI * i / NowReqBtnCount;
    var one = game.add.sprite(Boy.x + distance * Math.cos(degree), Boy.y + distance * Math.sin(degree), 'btn', i % NowLoopChooseCount);
    one.anchor.set(0.5);
    one.scale.set(ShouldScale * 0.8);
    ReqBtnList[i] = one;
  }
}

/**
 * 更新请求状态
 */
function updateReq(beginIndex) {
  Boy.play('req');
  //分数每增加3分就变化一下难度
  if (score != 0 && score % 3 == 0) {
    //如果有更多选项选修就变多
    if (NowLoopChooseCount <= LoopBtnSumCount) {
      NowLoopChooseCount++;
    }
    //如果请求按钮的数量的/2
    if (NowReqBtnCount <= NowLoopChooseCount / 2) {
      NowReqBtnCount++;
    }
    //下面越来越快
    DelayTime *= 0.95;
    buildReq();
    return;
  }
  for (var i = beginIndex; i < ReqBtnList.length - 1; i++) {
    ReqBtnList[i].frame = ReqBtnList[i + 1].frame;
  }
  ReqBtnList[ReqBtnList.length - 1].frame = Math.floor(Math.random() * NowLoopChooseCount);
}

/**
 * 检查第三个轮播按钮的值是否在所有的请求按钮里
 */
function checkNow() {
  for (var i = 0; i < ReqBtnList.length; i++) {
    if (LoopBtnList[2].frame == ReqBtnList[i].frame) {
      score++;
      ShowLabel.text = score + '分';
      showMarchAnima(i);//这里面有updateReq
      return;
    }
  }

  gameOver();

}

/** * 当猜对时显示飞翔动画
 * @param desIndex
 */
function showMarchAnima(desIndex) {
  MarchAnimaBtn.reset(AnswerBtn.x, AnswerBtn.y);
  MarchAnimaBtn.frame = AnswerBtn.frame;
  var tween = game.add.tween(MarchAnimaBtn).to({
    x: Boy.x,
    y: Boy.y
  }, DelayTime, Phaser.Easing.Quadratic.InOut);
  tween.onComplete.add(function () {
    Boy.play('happy');
    MarchAnimaBtn.exists = false;
  }, this);
  tween.start();
  timer.add(DelayTime * 2, updateReq, this, desIndex);
}

/**
 * 重新开始游戏主场景
 */
function restartGame(e) {
  //如果提供了事件对象，则这是一个非IE浏览器
  if (e && e.stopPropagation) {
    e.stopPropagation();
  } else {//否则，我们需要使用IE的方式来取消事件冒泡
    window.event.cancelBubble = true;
  }
  score = 0;
  NowReqBtnCount = 2;

  ScreenChange(1);
  game.state.start('main');
}

/**
 * 开始游戏主场景
 */
function startGame() {
  ScreenChange(1);
  game.state.start('main');
}

/**
 * 进入游戏结束
 */
function gameOver() {
  Boy.play('cry');
  //把网页的标题设置为分数,便于分享到朋友圈
  document.title = '我获得了' + score + '分';
  commitInfo(function () {
    timer.add(DelayTime * 2, ScreenChange, this, 2);
  });
}

/**
 * 游戏开屏
 * */

function gameStart() {
  ScreenChange(0);

}


/**
 * 进入角色选择
 */
function RoleOpen() {
  ScreenChange(3);
}

/**
 * 场景切换
 * @param index 场景的id
 * 当index=0:进入开屏
 * 当index=1:进入游戏界面
 * 当index=2:进入结束界面
 */
function ScreenChange(index) {

  var hula = document.getElementById("isWhonowDiv");
  var the = document.getElementById("the");
  var gamestartObj = document.getElementById("GameStart");
  var gamestartMain = document.getElementById("gamestartMain");
  var gameoverObj = document.getElementById("GameOver");
  var gameoverMain = document.getElementById("gameoverMain");
  var roleObj = document.getElementById("Role");


  if (index == 0) {
    //场景0 开屏

    the.style.display = "none";
    gameoverObj.style.display = "none";
    roleObj.style.display = "none";
    gamestartObj.style.display = "block";
    gamestartMain.style.width = DisPlay.Width + "px";
    gamestartMain.style.height = DisPlay.Height + "px";

    console.log("开屏场景：" + gamestartObj.style.display + "  游戏界面：" + the.style.display + "  结束界面：" + gameoverObj.style.display + "   角色界面：" + roleObj.style.display);

  }
  else if (index == 1) {
    //场景1 游戏界面
    hula.style.display = "none";
    gamestartObj.style.display = "none";
    gameoverObj.style.display = "none";
    roleObj.style.display = "none";
    the.style.display = "block";
    console.log("开屏场景：" + gamestartObj.style.display + "  游戏界面：" + the.style.display + "  结束界面：" + gameoverObj.style.display + "   角色界面：" + roleObj.style.display);
  }
  else if (index == 2) {
    //场景2 结束界面
    hula.style.display = "block";
    the.style.display = "none";
    gamestartObj.style.display = "none";
    roleObj.style.display = "none";
    gameoverObj.style.display = "block";
    gameoverMain.style.width = DisPlay.Width + "px";
    gameoverMain.style.height = DisPlay.Height + "px";
    var thescore = document.getElementById("theScore");
    thescore.innerHTML = score + '打败了全国 ' + rankBi + '% 的玩家';
    console.log("开屏场景：" + gamestartObj.style.display + "  游戏界面：" + the.style.display + "  结束界面：" + gameoverObj.style.display + "   角色界面：" + roleObj.style.display);

  }

  else if (index == 3) {
    //场景3 角色选择
    hula.style.display = "none";
    roleObj.style.display = "block";
    the.style.display = "none";
    gamestartObj.style.display = "none";
    gameoverObj.style.display = "none";
    roleObj.style.width = DisPlay.Width + "px";
    roleObj.style.height = DisPlay.Height + "px";
    console.log("开屏场景：" + gamestartObj.style.display + "  游戏界面：" + the.style.display + "  结束界面：" + gameoverObj.style.display + "   角色界面：" + roleObj.style.display);

  }
}

/**
 * 设置游戏中小孩的角色
 * @param name 小孩的名字,要和小孩的图片同名
 * @param id 每个选择的id
 */
function roleChoose(name, id) {
  BoyName = name;
  startGame();
  ChooseID = id;
}

/////////////////信息收集////////////////////
/**
 * 使用jsonp方法跨域获得JSON时传入JSP部分路径生成完整标准jsonp URL
 * @param path
 * @returns {string}
 */
function makeApiUrl(path) {
  /**
   * 主机基本URL
   * @type {string}
   */
  var HostURL = "http://42.96.157.54:13145/api/";

  /**
   * 使用jsonp方法跨域获得JSON的回调函数
   * @type {string}
   */
  var CallBackName = '?callback=?';

  return HostURL + path + CallBackName;
}

var GameID = 1;
var ChooseID;
/**
 * 添加商品apiURL
 */
var url_AddItem = makeApiUrl('add');
/**
 * 向服务器发送一条收集到的信息
 */
function commitInfo(callback) {
  var one = {
    gameId: GameID,
    chooseId: ChooseID,
    score: score
  };
  $.getJSON(url_AddItem, one).done(function (data) {
    var bi = data.rank / data.sum;
    rankBi = 100 - bi.toFixed(1) * 100;
    callback();
  })
}

