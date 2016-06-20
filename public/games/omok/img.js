function Img(game, imgPath, imgName, width, height, frameNames){
  this.game = game;
  this.imgPath = imgPath;
  this.imgName = imgName;
  this.width = width;
  this.height = height;
  if (frameNames && frameNames.length){
    this.frameLength = frameNames.length;
    this.frames = {};
    for (var i = 0; i < this.frameLength; i++){
      frames[frameNames[i]] = i;
    }
    game.load.spritesheet(imgName, imgPath, width, height);
  }
  else{
    game.load.image(imgName, imgPath);
  }
}
Img.prototype.getImage = function(layer, x, y, frameName){
//  alert('img getImage start');
  var sprite = layer ? 
    layer.create(x, y, this.imgName) :
    this.game.add.sprite(x, y, this.imgName);

  if (frameName){
    sprite.frame = this.frames[frameName];
  }
  else{
    sprite.frame = 0;
  }
//  alert('img getImage end');
  return sprite;
}
