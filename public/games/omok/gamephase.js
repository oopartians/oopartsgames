function GamePhase(game, imgs, WIDTH, HEIGHT){
  //Phase.apply(this, layers);
  Phase.call(this, {
    board: new Layer(game),
    stone: new Layer(game),
    info: new Layer(game),
    ui: new Layer(game)
  });
  alert('GamePhase constructor start');
  this.WIDTH = WIDTH;
  this.HEIGHT = HEIGHT;
  //this.imgs = imgs;
  this.spriteBoard = new Sprite(imgs.board, this.W(4 / 5), this.H(4 / 5));
  this.spriteStone = new Sprite(imgs.stone, this.W(4 / 5 * imgs.stone.width / imgs.board.width), this.H(4 / 5 * imgs.stone.height / imgs.board.height));
  this.spriteBorder = new Sprite(imgs.border, this.W(4 / 5), this.H(2 / 15));
  this.spriteBtn = new Sprite(imgs.btn, this.W(1), this.H(2 / 15));
  alert('GamePhase constructor sprite done');
  this.textDefault = new Text(game, { font: "bold " + this.W(4 / 5 * 15 / imgs.board.width).toString() + "px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "left" });
  alert('GamePhase constructor text done');
  this.stoneStartX = this.W(4 / 5 * 12 / imgs.board.width);
  this.stoneStartY = this.H(4 / 5 * 12 / imgs.board.height);
  this.stoneWidth = this.W(4 / 5 * 20 / imgs.board.width);
  this.stoneHeight = this.H(4 / 5 * 20 / imgs.board.height);
  this.playerInfoStartX = this.W(1 / 10);
  this.playerInfoStartY = this.H(13 / 15);
  this.playerInfoWidth = this.W(4 / 5);
  this.playerInfoHeight = this.H(1 / 15);
  alert('GamePhase constructor end');
}
inherit(Phase, GamePhase);
GamePhase.prototype.W = function(x){
  return parseInt(this.WIDTH * x);
}

GamePhase.prototype.H = function(x){
  return parseInt(this.HEIGHT * x);
}

GamePhase.prototype.init = function(){
  alert('gamephase init start');
  this.layers.board.addSprite(
    this.W(1/2), 0, this.spriteBoard, "board",
    { anchor: {x: 0.5, y: 0.0} }
  );
//  alert('gamephase init 1');
  this.layers.board.addSprite(
    this.W(1/2), this.H(13/15), this.spriteBorder, "border",
    { anchor: {x: 0.5, y: 0.0} }
  );
  alert('gamephase init end');
}
GamePhase.prototype.placeStone = function(x, y, color){
  /* We use x as top and y as left at game. so convert each other in this function*/
  this.layers.stone.addSprite(
    this.stoneStartX + this.stoneWidth * y, this.stoneStartY + this.stoneHeight * x, this.spriteStone, 'stone',
    { anchor: {x: 0.5, y: 0.5}, frameName: color }
  );
}

GamePhase.prototype.printPlayerInfo = function(userInfo){
  var i = 0;
  Object.keys(userInfo).forEach(function(name) {
    this.layer.info.addText(
      this.palyerInfoStartX,
      this.playerInfoStartY + i * this.playerInfo.Height,
      this.playerInfoWidth, 
      this.playerInfoHeight,
      this.textDefault, name, name);
    i++;
  });
}

