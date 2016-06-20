function Phase(layers){
  this.layers = layers;
  this.endCheckFunc = null;
  this.loopFunc = null;
  this.pickNextPhaseFunc = null;
  this.nextPhases = null;
}

Phase.prototype.loop = function(){
  return this.loopFunc(this);
}

Phase.prototype.clearLayers = function(){
//  alert('clearLayers start');
//  alert(this.layers);
  for (var name in this.layers){
//    alert(name);
//    alert(this.layers[name]);
    this.layers[name].clear();
  }
//  alert('clearLayers end');
}

Phase.prototype.endCheck = function(){
  return this.endCheckFunc(this);
}

Phase.prototype.getNextPhase = function(){
  return this.pickNextPhaseFunc(this);
}
