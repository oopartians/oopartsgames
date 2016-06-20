var primus;
var WIDTH = $('#game-area-div').innerWidth();
var HEIGHT = $('#game-area-div').innerHeight();
if (WIDTH > HEIGHT){
  WIDTH = HEIGHT;
}
else{
  HEIGHT = WIDTH;
}
var SIZE = WIDTH;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game-area-div', { preload: preload, create: create}, false);

var DPR = window.devicePixelRatio;

var gamePhase;
var manager;

function preload() {
  var imgs = {
    board : new Img(game, "omok/400px-Blank_Go_board.png", "board", 400, 400),
    stone : new Img(game, "omok/19x19stones.png", "stone", 19, 19, ["black", "white"]),
    border : new Img(game, "omok/game_info.png", "border", 339, 228),
    btn : new Img(game, "omok/btn_background.png", "btn", 220, 50)
  };
  primus = Primus.connect();
  primus.on("open", function(){
    //alert('primus open');
    primus.write({ action: 'join'});
  });
  primus.on("data", function(data){
    switch(data.type){
      case "init":
        alert('primus init');
        manager = new Manager(game, imgs, data, WIDTH, HEIGHT);
        //alert('primus init 1');
        manager.init();
        alert('primus init end');
        break;
      case "error":
        $.alert({
          title: 'websocket failed',
          content: data.reason,
          confirmButtonClass: 'btn-info'
        });
        break;
      case "restart":
        break;
      case "result":
        break;
      case "place":
        break;
    }
  });
}

function create() {
  //alert('primus connect');
  
}
