"use strict";

/*
 * concurrent access will not be problem with this model.
 * REFERENCE
 * http://stackoverflow.com/questions/3776282/is-concurrent-access-to-shared-array-a-problem-in-node-js
 * http://stackoverflow.com/questions/5481675/node-js-and-mutexes
 */

var Manager = require('./manager');
var sock_name = 'omok';
var rooms = {};

module.exports = {
  name: sock_name,
  open: function(sock_func, username, room_id){
    if (room_id in rooms){
      rooms[room_id].init(sock_func, username);
    }
    else{ // This part MUST be processed atomically!
      var logic_room = require('../../../logic/room.js');
      var select_user_handler = function(result){
        if (result.worked){
          var select_room_info_handler = function(result){
            if (result.worked){
              rooms[room_id] = new Manager(sock_func, result.room_info, result.user_list);
              rooms[room_id].init(sock_func, username);
            }
            else{
              sock_func.unicast(username, {type: 'error', reason: result.reason});
            }
          };
          logic_room.select_room_info(select_room_info_handler, room_id);
        }
        else{
          sock_func.unicast(username, {type: 'error', reason: result.reason});
        }
      };
      logic_room.select_user_list_in_room(select_user_handler, room_id);
    }
  },
  recv: function(sock_func, username, room_id, data) {
    if (room_id in rooms){
      rooms[room_id].recv(sock_func, username, data);
    }
  },
  quit: function(sock_func, username, room_id){
    rooms[room_id].quit(sock_func, username);
  }
};
