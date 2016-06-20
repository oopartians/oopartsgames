function Text(game, style){
  this.game = game;
  this.style = style;
  this.applyOptionFunc = null;
}
Text.prototype.getText = function(layer, content, x, y, width, height){
  var text = layer ?
    layer.add.text(0, 0, content, this.style) :
    this.game.add.text(0, 0, content, this.style);

  if (this.applyOptionFunc){
    this.applyOptionFunc(text);
  }
  text.setTextBounds(x, y, width, height);
  return text;
}
