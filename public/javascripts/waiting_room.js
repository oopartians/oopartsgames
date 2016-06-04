var primus = Primus.connect();
var is_ready = false;

primus.on("open", function(){
  primus.write({ action: 'join', room: 'waiting_room'});
});

primus.on("data", function(data){
  var a_list = $("#user-list-div a"); 
  if (data.type == "init"){
    $("#user-list-div").empty();
    for (var i = 0; i < data.user_list.length; i++){
      var state = data.user_list[i].state == 'ready' ? ' list-group-item-info' :
                  data.user_list[i].state == 'disconnected' ? ' list-group-item-danger' : '';

      $("#user-list-div").append(
        "<a href='#' class='list-group-item" + state + "' onclick=\"user_info_confirm('" +
        data.user_list[i].username + "','" + data.user_list[i].description + "');\">" + 
        data.user_list[i].username + "</a>"
      );
    }
  }
  else if (data.type == "error"){
    $.alert({
      title: 'websocket failed',
      content: data.reason,
      confirmButtonClass: 'btn-info'
    });
  }
  else if (data.type == "join"){
    $("#user-list-div").append(
      "<a href='#' class='list-group-item' onclick=\"user_info_confirm('" +
      data.user_info.username + "','" + data.user_info.description + "');\">" + 
      data.user_info.username + "</a>"
    );
  }
  else if (data.type == 'commited'){
    is_ready = !is_ready;
    $("#input-submit").text(is_ready ? "준비해제" : "준비");
  }
  else if (data.type == 'allready'){
    post('/games/loading', {});
  }
  else{
    for (var i = 0; i < a_list.length; i++){
      if (a_list[i].innerHTML == data.username){
        //alert(data.type == "ready");
        if (data.type == "ready"){
          a_list[i].setAttribute('class', 'list-group-item list-group-item-info');
          break;
        }
        else if (data.type == "unready"){
          a_list[i].setAttribute('class', 'list-group-item');
          break;
        }
        else if (data.type == "disconnected"){
          a_list[i].setAttribute('class', 'list-group-item list-group-item-danger');
          break;
        }
        else if (data.type == "quit"){
          a_list[i].remove();
          break;
        }
      }
    }
  }
});

function user_info_confirm(username, description){
  $.alert({
    title: username,
    content: description,
    confirmButtonClass: 'btn-info'
  });
}

$("#input-submit").click(function(){
  primus.write({room: "waiting_room", data:{
    type: !is_ready
  }});
});

//alert('성공');
