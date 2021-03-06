//
// Written by w.shito (2017/9/6)
//
// Use it freely at your own risk!
// 自己責任でご自由にお使いください．
// http://diary.wshito.com/comp/js/canvas/bouncing-ball/

function FullCanvas(id, setup, draw, fps) {
  var id = id;
  var fps = fps;
  var setup = setup;
  var draw = draw;
  var prevTime = 0;
  var canvas, context, prevTime;
  var isRunning = false;

  var _registerEventHandlers = function() {
    // Window のリサイズ・イベントでcanvasのcontextを更新
    $(window).resize(_resizeCanvas);
    /*
    var timer = false;
    $(window).resize(function() {
      if (timer !== false) {
        clearTimeout(timer);
      }
      timer = setTimeout(_resizeCanvas, 200);
    });
    */
    // ページが非表示・表示になった時の対応
    $(document).on('visibilitychange', function(e) {
      if (e.target.visibilityState === 'visible') {
        _resizeCanvas();
        resume();
      } else if (e.target.visibilityState === 'hidden') {
        stop();
      }
    });
  };

  var _init = function() {
    canvas = $(id)[0];
    context = this.canvas.getContext("2d");
    _resizeCanvas();
  };

  var _resizeCanvas = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  var _run = function() {
    // 経過フレーム数を渡す
    draw((new Date().getTime() - prevTime) / (1000 / fps), context);
    prevTime = new Date().getTime();
    if (isRunning)
      requestAnimationFrame(_run);
  };
  /**
   *	画面サイズ変更Event登録
   */
  function init() {
    // requestAnimationFrame()関数のクロスブラウザ設定
    (function() {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(c) {
          window.setTimeout(c, 1000 / fps);
        };
      window.requestAnimationFrame = requestAnimationFrame;
    })();

    // CMSのThemeでは一般にJQuery等のスクリプトを最後に読み込むので，全てリソースが読み込まれて
    // からJQueryを用いたコードを記述する．
    if (typeof jQuery == 'undefined') {
      document.addEventListener("DOMContentLoaded", function invokeLater() {
        _registerEventHandlers();
        start();
      });
    } else {
      _registerEventHandlers();
      start();
    }
  }

  var start = function() {
    isRunning = true;
    _init();
    setup(context);
    prevTime = new Date().getTime();
    _run();
  };

  var resume = function() {
    isRunning = true;
    prevTime = new Date().getTime();
    _run();
  };

  var stop = function() {
    isRunning = false;
  };

  return {
    init: init,
    start: start,
    resume: resume,
    stop: stop
  };
}
