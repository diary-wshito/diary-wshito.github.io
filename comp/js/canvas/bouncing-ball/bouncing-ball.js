//
// Written by w.shito (2017/9/6)
//
// Use it freely at your own risk!
// 自己責任でご自由にお使いください．
// http://diary.wshito.com/comp/js/canvas/bouncing-ball/

var gravity = 3;
var friction = 0.03;
var fps = 60;

function Ball(radius, color, context) {
  this.context = context;
  this.radius = radius;
  this.color = color;
  this.x = Math.random() * (context.canvas.width - radius) + radius;
  this.y = radius;
  this.dir = [1, -1];
  this.vx = 8 * this.dir[Math.floor(Math.random() * this.dir.length)];
  this.vy = 0;
  this.ax = 0;
  this.ay = gravity;
  this.gradOffset = 0.25 * radius; // gradiation starting position offset
  this.gradBeginRadius = 0.1 * radius;
  this.gradEndRadius = radius;
}

Ball.prototype.isStopped = function() {
  return this.vx === 0;
}

Ball.prototype.draw = function(dt) {
  var vx, vy, x, y, t, gradient;

  vx = this.vx + (this.ax * dt);
  vy = this.vy + (this.ay * dt);
  x = this.x + (vx * dt);
  y = this.y + (vy * dt);

  if (y > (this.context.canvas.height - this.radius)) {
    t = (this.context.canvas.height - this.radius - this.y) / vy;
    this.vy += (this.ay * t);
    this.vy *= -1;
    this.y = (this.context.canvas.height - this.radius) + this.vy * (dt - t);
  } else if (y < this.radius) {
    t = (this.y - this.radius) / vy;
    this.vy += (this.ay * t);
    this.vy *= -1;
    this.y = this.radius + this.vy * (dt - t);
  } else {
    this.y = y;
    this.vy = vy;
  }

  // 地上を転がる間は摩擦でx方向減速
  if (this.y === (this.context.canvas.height - this.radius) && this.vy === 0) {
    this.ax = vx > 0 ? -friction : friction;
    if (vx < friction && vx > -friction) {
      this.ax = 0;
      vx = 0;
    }
  } else if (this.y > (this.context.canvas.height - this.radius - friction) &&
    this.vy < friction && this.vy > -friction) { // y方向速度が誤差以内なら0に設定
    this.vy = 0;
    this.y = (this.context.canvas.height - this.radius);
  }

  if (x < this.radius) {
    t = (this.x - this.radius) / vx; // 衝突までの時間
    this.vx += (this.ax * t); // 衝突時の速度
    this.vx *= -1;
    this.x = (this.radius + this.vx * (dt - t)); // はね返り後の位置
  } else if (x > (this.context.canvas.width - this.radius)) {
    t = (this.context.canvas.width - this.radius - this.x) / vx;
    this.vx += (this.ax * t);
    this.vx *= -1;
    this.x = (this.context.canvas.width - this.radius) + this.vx * (dt - t);
  } else {
    this.x = x;
    this.vx = vx;
  }

  console.log("Begin x=" + (this.x - this.gradOffset) + " y=" + (this.y - this.gradOffset) + " r=" + this.gradBeginRadius);
  console.log("End   x=" + this.x + " y=" + this.y + " r=" + this.gradEndRadius);
  this.context.strokeStyle = this.color;
  this.context.lineWidth = 3;
  gradient = this.context.createRadialGradient(
    this.x - this.gradOffset, this.y - this.gradOffset, this.gradBeginRadius,
    this.x, this.y, this.gradEndRadius);
  gradient.addColorStop(0, "#6bcdff");
  gradient.addColorStop(1, this.color);
  this.context.fillStyle = gradient;

  this.context.beginPath();
  this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
  this.context.closePath();
  this.context.stroke(); // *
  this.context.fill();
}

var mySketch = (function() {
  var ball;
  var prevTime;

  function setup(context) {
    ball = new Ball(25, "#00158e", context); // #0000ff
  }

  function draw(dt, context) {
    if (ball.isStopped()) {
      ball = new Ball(25, "#00158e", context);
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    ball.draw(dt);
  }

  return {
    setup: setup,
    draw: draw
  };
})();

//
// Setup the canvas and run the animation
//
var mycanvas = FullCanvas("#canvas", mySketch.setup, mySketch.draw, fps);
mycanvas.init();
