"use strict";

var sock_games = require('./games');
var sock_waiting_room = require('./waiting_room');
var connection_check_time_in_waiting_room = 5000;
/*
 * concurrent access will not be problem with this model.
 * REFERENCE : http://stackoverflow.com/questions/3776282/is-concurrent-access-to-shared-array-a-problem-in-node-js
 */

var sock_list = {};
var spark_info= {};
var user_spark = {};
var sock_name = "room";

var sock_func = {
  broadcast: function(room_id, data){
    if (room_id == undefined || sock_list[room_id] == undefined){
      return;
    }
    for (var i = 0; i < sock_list[room_id].length; i++){
      sock_list[room_id][i].write(data);
    }
  },
  unicast: function(username, data){
    if (username == undefined || user_spark[username] == undefined){
      return;
    }
    user_spark[username].write(data);
  }
};

var interval_object = setInterval(function(){
  console.log('connection check interval start');
  for (var room_id in sock_list){
    var connected_user_list = [];
    var logic_user = require('../logic/user.js');
    console.log(sock_list[room_id].length);
    for (var i = 0; i < sock_list[room_id].length; i++){
      connected_user_list.push(spark_info[sock_list[room_id][i].id].username);
    }
    var result_handler = function(result){
      if (result.worked){
        console.log('connection check success');
      }
      else{
        console.log('update state during connection check error : ' + result.reason);
      }
    };
    logic_user.update_state_not_in_user_list(result_handler, connected_user_list, room_id, sock_name, 'disconnected');
  }
  console.log('connection check interval end');
}, connection_check_time_in_waiting_room);

module.exports = {
  name: sock_name,
  open: function(spark, data){
    var username = spark.request.session_.login_username;
    var logic_room = require('../logic/room.js');
    var logic_user = require('../logic/user.js');

    var select_user_info_handler = function(result){
      if (result.worked){
        var room_id = result.user_info.room_id;
        var select_room_info_handler = function(result){
          if (result.worked){
            var room_info = result.room_info;
            spark_info[spark.id] = {room_id: room_id, username: username};
            user_spark[username] = spark;
            if (sock_list[room_id] == undefined){
              sock_list[room_id] = [];
            }
            sock_list[room_id].push(spark);
            var update_state_handler = function(result){
              if (result.worked){
                if (room_info.state == 'game'){
                  sock_games[room_info.eng_name].open(sock_func, username, room_id);
                }
                else if (room_info.state == 'wait'){
                  sock_waiting_room.open(sock_func, username, room_id);
                }
              }
              else{
                spark.write({type: 'error', reason: result.reason});
              }
            };
            logic_user.update_state_in_user_list(update_state_handler, username, room_id, sock_name, 'unready');
          }
          else{
            spark.write({type: 'error', reason: result.reason});
          }
        };
        logic_room.select_room_info(select_room_info_handler, room_id);
      }
      else{
        spark.write({type: 'error', reason: result.reason});
      }
    };
    logic_user.select_user_info(select_user_info_handler, username);
  },
  recv: function(spark, data) {
    if (spark_info[spark.id] == undefined){
      return;
    }
    var username = spark_info[spark.id].username;
    var room_id = spark_info[spark.id].room_id;
    console.log('recv');
    console.log(username);
    console.log(room_id);
    console.log(data.type);
    if (username == undefined || room_id == undefined){
      return;
    }
    var logic_room = require('../logic/room.js');
    var select_room_info_handler = function(result){
      if (result.worked){
        if (result.room_info.state == 'game'){
          sock_games[room_info.eng_name].recv(sock_func, username, room_id, data);
        }
        else{ //if (room_info.state == 'wait'){
          sock_waiting_room.recv(sock_func, username, room_id, data);
        }
      }
      else{
        spark.write({type: 'error', reason: result.reason});
      }
    }
    logic_room.select_room_info(select_room_info_handler, room_id);
  },
  broadcast: sock_func.broadcast,
  unicast: sock_func.unicast,
  close: function(spark, data) {
    try{
      var username = spark_info[spark.id].username;
      var room_id = spark_info[spark.id].room_id;
      if (username == undefined || room_id == undefined){
        return;
      }
      sock_list[room_id].splice(sock_list[room_id].indexOf(spark),1);
      delete spark_info[spark.id];
      delete user_spark[username];
      sock_func.broadcast(room_id, {type:'disconnected', username:username});
      if (sock_list[room_id].length <= 0){
        delete sock_list[room_id];
      }
    }catch(error){
      console.log('sock close error: ' + error.message);
    }
  },
};
