/* These variables must be same as server-side variables */
var BRD_HEIGHT = 19;
var BRD_WIDTH = 19;
var START_X = 10;
var START_Y = 10;
var dx = [0,1,1,1];
var dy = [1,1,0,-1];
var BLACK = 1;
var WHITE = 2;

function Manager(game, imgs, gameData, WIDTH, HEIGHT){
//  alert('manager constructor start');
//  this.test = new Img(game, "a.png", "a", 400, 400);
  this.map = gameData.map;
  this.userInfo = gameData.userInfo;
  this.turn= gameData.turn;
  this.idToUser = []
  for (var name in this.userInfo){
    this.idToUser[this.userInfo[name].id] = name;
  }
  this.showResult = gameData.showResult;
  this.gamePhase = new GamePhase(game, imgs, WIDTH, HEIGHT);
  this.currPhase = this.gamePhase;
//  alert('manager constructor end');
}


Manager.prototype.getColor = function(stone){
  return stone == 1 ? 'black' : 'white';
}

Manager.prototype.getTurnPlayer = function(){
  return this.userInfo[this.idToUser[this.turn]]
}

Manager.prototype.isValidPos = function(x,y){
  return x >= 0 && x < BRD_HEIGHT && y >= 0 && y < BRD_WIDTH;
}

Manager.prototype.placeStone = function(x, y){
  if (!isValidPos(x,y)) return false;
  var stone = this.getTurnPlayer().stone;
  this.currPhase.placeStone(x, y, this.getColor(stone));
  map[x][y] = stone;
  return true;
}

Manager.prototype.init = function(){
//  alert('omok manager init');
  this.currPhase.clearLayers();
  this.currPhase = this.gamePhase;

  this.currPhase.init();
  
  for (var i = 0; i < BRD_HEIGHT; i++){
    for (var j = 0; j < BRD_WIDTH; j++){
      if (this.map[i][j]){
        this.currPhase.placeStone(i, j, this.getColor(map[i][j]));
      }
    }
  }
  this.currPhase.printPlayerInfo(this.userInfo);
  alert('omok manager end');
}
