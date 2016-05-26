"use strict";

var connection_check_time_in_waiting_room = 5000;
/*
 * concurrent access will not be problem with this model.
 * REFERENCE : http://stackoverflow.com/questions/3776282/is-concurrent-access-to-shared-array-a-problem-in-node-js
 */

var sock_list = {};
var spark_info= {};

var broadcast = function(room_id, data){
  if (room_id == undefined){
    return;
  }
  for (var i = 0; i < sock_list[room_id].length; i++){
    sock_list[room_id][i].write(data);
  }
}

var interval_object = setInterval(function(){
  console.log('connection check interval start');
  for (var room_id in sock_list){
    var connected_user_list = [];
    var logic_user = require('../logic/user.js');
    for (var i = 0; i < sock_list[room_id]; i++){
      connected_user_list.push(spark_info[sock_list[room_id][i]].username);
    }
    var result_handler = function(result){
      if (result.worked){
        broadcast(room_id, {type: 'connection_check', connected_user_list: connected_user_list});
      }
      else{
        console.log('update state during connection check error : ' + result.reason);
      }
    };
    logic_user.update_state_not_in_user_list(result_handler, connected_user_list, room_id, 'disconnected');
  }
  console.log('connection check interval end');
}, connection_check_time_in_waiting_room);

module.exports = {
  name: "waiting_room",
  open: function(spark, data){
    var username = spark.request.session_.login_username;
    var logic_room = require('../logic/room.js');
    var logic_user = require('../logic/user.js');

    var result_handler = function(result){
      if (result.worked){
        var room_id = result.room_id;
        spark_info[spark.id] = {room_id: room_id, username: username};
        if (sock_list[room_id] == undefined){
          sock_list[room_id] = [];
        }
        sock_list[room_id].push(spark);
        var result_handler = function(result){
          if (result.worked){
            spark.write({type: 'init', user_list: result.user_list});
          }
          else{
            spark.write({type: 'error', reason: result.reason});
          }
        };
        logic_room.select_user_list_in_room(result_handler, room_id);
      }
      else{
        spark.write({type: 'error', reason: result.reason});
      }
    };
    logic_user.select_room_id_from_user(result_handler, username);
  },
  recv: function(spark, data) {
    var username = spark_info[spark.id].username;
    var room_id = spark_info[spark.id].room_id;
    console.log('recv');
    console.log(username);
    console.log(room_id);
    console.log(data.type);
    if (room_id == undefined){
      return;
    }
    var logic_user = require('../logic/user.js');
    var result_handler = function(result){
      if (result.worked){
        broadcast(room_id, {type: data.type ? 'ready' : 'unready', username: username});
        spark.write({type: 'commited'});
      }
      else{
        console.log('update state from ready button error : ' + result.reason);
        spark.write({type: 'error', reason: result.reason});
      }
    };
    logic_user.update_state_in_user_list(result_handler, username, room_id, data.type ? 'ready' : 'unready');
  },
  broadcast: broadcast,
  close: function(spark, data) {
    try{
      var username = spark_info[spark.id].username;
      var room_id = spark_info[spark.id].room_id;
      if (room_id == undefined){
        return;
      }
      sock_list[room_id].splice(sock_list[room_id].indexOf(spark),1);
      delete spark_room_id[spark.id];
      if (sock_list[room_id].length <= 0){
        delete sock_list[room_id];
      }
    }catch(error){
      console.log('sock close error');
    }
  },
};
