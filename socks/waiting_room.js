"use strict";

/*
 * concurrent access will not be problem with this model.
 * REFERENCE : http://stackoverflow.com/questions/3776282/is-concurrent-access-to-shared-array-a-problem-in-node-js
 */

var sock_name = 'waiting_room';

module.exports = {
  name: sock_name,
  open: function(sock_func, username, room_id){
    var logic_room = require('../logic/room.js');
    var select_user_handler = function(result){
      if (result.worked){
        sock_func.unicast(username, {type: 'init', user_list: result.user_list});
      }
      else{
        sock_func.unicast(username, {type: 'error', reason: result.reason});
      }
    };
    logic_room.select_user_list_in_room(select_user_handler, room_id);
  },
  recv: function(sock_func, username, room_id, data) {
    var logic_user = require('../logic/user.js');
    var update_user_state_handler = function(result){
      if (result.worked){
        var logic_room = require('../logic/room.js');
        console.log(username + ', ' + room_id + ', ' + data);
        var update_room_state_handler= function(result){
          if (result.worked){
            console.log('check state all ready broadcast');
            sock_func.broadcast(room_id, {type: 'allready'});
          }
          else{
            if (result.reason != ''){
              console.log('check state all ready error : ' + result.reason);
              sock_func.unicast(username, {type: 'error', reason: result.reason});
            }
            else{
              sock_func.broadcast(room_id, {type: data.type ? 'ready' : 'unready', username: username});
              sock_func.unicast(username, {type: 'commited'});
            }
          }
        };
        logic_room.update_state_after_all_ready(update_room_state_handler, room_id);
      }
      else{
        console.log('update state from ready button error : ' + result.reason);
        sock_func.unicast(username, {type: 'error', reason: result.reason});
      }
    };
    logic_user.update_state_in_user_list(update_user_state_handler, username, room_id, "room", data.type ? 'ready' : 'unready');
  }
};
