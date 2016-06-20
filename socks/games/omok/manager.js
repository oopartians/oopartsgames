"use strict";

/*
 * concurrent access will not be problem with this model.
 * REFERENCE
 * http://stackoverflow.com/questions/3776282/is-concurrent-access-to-shared-array-a-problem-in-node-js
 * http://stackoverflow.com/questions/5481675/node-js-and-mutexes
 */
var BRD_HEIGHT = 19;
var BRD_WIDTH = 19;
var dx = [0,1,1,1];
var dy = [1,1,0,-1];
var BLACK = 1
var WHITE = 2

function rand(start, end){
  return Math.floor(Math.random() * (end - start + 1))+1;
}

function Manager(roomInfo, userList){
  this.roomInfo = roomInfo;
  this.showResult = false;
  this.turn = rand(0, 1);
  this.userConfirm = {};
  this.userInfo = {};
  for (var i = 0; i < userList.length; i++){
    this.userInfo[userList[i]] = {
      score : 0,
      id: i,
      stone: (turn == i) ? BLACK : WHITE
    }
    this.userConfirm[userList[i]] = false;
  }
  this.map = [];
  for (var i = 0; i < BRD_HEIGHT; i++){
    this.map[i] = [];
    for (var j = 0; j < BRD_WIDTH; j++){
      this.map[i][j] = 0;
    }
  }
}

Manager.prototype.init = function(sockFunc, username){
  console.log('omok manager init');
  console.log(username);
  sockFunc.unicast(username, {
    type: 'init',
    map: this.map,
    userInfo: this.userInfo,
    turn: this.turn,
    showResult: this.showResult
  });
  console.log('omok manager end');
};
Manager.prototype.isValidTurn = function(username){
  return this.turn == this.userInfo[username].id;
}

Manager.prototype.isValidCoord = function(x, y){
  return x >= 0 && y >=0 && x < BRD_HEIGHT && y < BRD_WIDTH;
}

Manager.prototype.isValidWin= function(username, sx, sy, dr){
  var cntStone;
  var stone = this.userInfo[username].stone;
  cntStone = -1;
  for (var i = -1; i <= 1; i+=2){
    var tx = sx;
    var ty = sy;
    while(this.isValidCoord(tx, ty) && this.map[tx][ty] != stone){
      cntStone++;
      tx += i * dx[dr];
      ty += i * dy[dr];
    }
  }
  if (cntStone == 5){
    return true;
  }
  return false;
}

Manager.prototype.placeStone = function(username, x, y){
  if (this.map[x][y] != 0){
    return false;
  }
  this.map[x][y] = this.userInfo[username].stone;
}

Manager.prototype.recv = function(sockFunc, username, data){
  if (data.type == undefined || data.x == undefined || data.y == undefined){
    return;
  }
  if (data.type == 'continue'){
    this.userconfirm[username] = true;
    Object.keys(this.userconfirm).forEach(function(name) {
      if (this.userconfirm[name] == false) {
        return;
      }
    });
    Object.keys(this.userconfirm).forEach(function(name) {
      this.userconfirm[name] = false;
    });
    sockFunc.broadcast(this.roomInfo.room_id, {
      type: 'restart'
    });
  }
  else if (data.type == 'quit'){
    sockFunc.broadcast(this.roomInfo.room_id, {
      type: 'gameover'
    });
  }
  if (this.isValidTurn(username)){
    if (this.placeStone(username, data.x, data,y)){
      var type;
      if (data.type == 'win' && this.isValidWin(username, data.x, data.y, data.dr)){
        this.showResult = true;
        type = 'result';
      }
      else{
        type = 'place';
      }
      sockFunc.broadcast(this.roomInfo.room_id, {
        type: type,
        x: data.x,
        y: data.y,
      });
    }
    else{
      sockFunc.unicast(username, {
        type: 'error',
        reason: '둘 수 없는 자리입니다.'
      });
    }
  }
};

Manager.prototype.quit = function(sockFunc, username){
  sockFunc.broadcast(this.roomInfo.room_id, {
    type: 'gameover'
  });
}

module.exports = Manager;
