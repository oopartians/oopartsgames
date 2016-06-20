function Sprite(img, width, height){
  this.img = img;
  this.width = width;
  this.height = height;
}
//Img.prototype.init = function(){
//}
Sprite.prototype.getSprite = function(layer, x, y, frameName, anchor){
//  alert('sprite getSprite start');
  var sprite = this.img.getImage(layer, x, y, frameName);
  sprite.scale.setTo(this.width / this.img.width, this.height / this.img.height);
  sprite.anchor.x = anchor.x;
  sprite.anchor.y = anchor.y;
//  alert('sprite getSprite end');
  return sprite;
}
