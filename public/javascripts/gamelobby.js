var primus = Primus.connect();
primus.on("open", function(){
  primus.write({action: 'join', room: 'gamelobby'});
});

primus.on("data", function(data){
  if (data.type == "init"){
    for (var i = data.room_list.length - 1; i >= 0; i--){
      $("#room-list-div").prepend(
        "<a id='room-row-" + data.room_list[i].room_id + "' class='list-group-item' href='#' onclick=\"click_one_room('" + data.room_list[i].room_id + "');\">"+
        "<h4 class='list-group-item-heading'>" + data.room_list[i].room_id + ":" + data.room_list[i].game_name +"</h4>" + 
        "<p class='list-group-item-text'>" + data.room_list[i].room_name +"</p>" + 
        "<p class='list-group-item-text'>" + data.room_list[i].curr_player + "명/" + data.room_list[i].Game.max_player + "명</p>" + 
        "</a>"
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
  else if (data.type == "add"){
    $("#room-list-div").prepend(
      "<a id='room-row-" + data.room_info.room_id + "' class='list-group-item' href='#' onclick=\"click_one_room('" + data.room_info.room_id + "');\">"+
      "<h4 class='list-group-item-heading'>" + data.room_info.room_id + ":" + data.room_info.game_name +"</h4>" + 
      "<p class='list-group-item-text'>" + data.room_info.room_name +"</p>" + 
      "<p class='list-group-item-text'>" + data.room_info.curr_player + "명/" + data.room_info.Game.max_player + "명</p>" + 
      "</a>"
    );
  }
  else if (data.type == "remove"){
    $("#room-row-" + data.room_info.room_id).remove();
  }
  else{//"update"
    $("#room-row-" + data.room_info.room_id + " p").eq(1).innerHTML = data.room_info.curr_player + "명/" + data.room_info.Game.max_player +"명";
  }
});

$("#input-submit").click(function(){
  var room_id = $("input[name='room_id']")[0];
  var passwd = $("input[name='password']")[0];

  if (room_id.value != "" && passwd.value != ""){
    passwd.value = CryptoJS.SHA512(passwd.value);
  }

  return true;
});
//alert('성공');
