var inherit = (function(){
  var F = function(){};
  return function( Parent, Child ){
    F.prototype = new Parent;
    // F.prototype = Parent.prototype; 
    // 이경우는 Child에서 apply, call을 사용해 scope 바인딩을 해줘야 
    // 부모의 프로퍼티에 접근이 가능하다.
    Child.prototype = new F();
    Child.uper = Parent.prototype;
    Child.prototype.constructor = Child;
  }
})();
