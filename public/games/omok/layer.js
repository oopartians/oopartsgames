function Layer(game){
  this.objs = {};
  this.inst = game.add.group();
}

Layer.prototype.insertObj = function(instName, obj){
  if (!(instName in this.objs)){
    this.objs[instName] = [];
  }
  this.objs[instName].push(obj);
}

Layer.prototype.addSprite = function(x, y, sprite, instName, options){
//  alert('layer addSprite start');
//  alert(sprite);
//  alert(sprite.getSprite);
  var newSprite = sprite.getSprite(this.inst, x, y, options.frameName, options.anchor);
//  alert('layer addSprite 1');
  this.insertObj(instName, newSprite);
//  alert('layer addSprite end');
  return newSprite;
}

Layer.prototype.addText = function(x, y, width, height, text, content, instName){
//  alert('layer add start');
  var newText = text.getText(this.inst, content, x, y, width, height);
  this.insertObj(instName, newText);
//  alert('layer add end');
  return newText;
}

Layer.prototype.remove = function(inst){
  if (inst.destroy){
    inst.destroy();
  }
  else{
    var spriteList = this.objs[inst];
    for (var i = 0; i < spriteList.length; i++){
      spriteList[i].destroy();
    }
    delete this.objs[inst];
  }
}

Layer.prototype.clear = function(){
  Object.keys(this.objs).forEach(function(name) {
    this.remove(name);
  });
}
