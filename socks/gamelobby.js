"use strict";
/*
 * concurrent access will not be problem with this model.
 * REFERENCE : http://stackoverflow.com/questions/3776282/is-concurrent-access-to-shared-array-a-problem-in-node-js
 */

var sock_list = [];
module.exports = {
  name: "gamelobby",
  open: function(spark, data){
    var logic_room = require('../logic/room.js');
    sock_list.push(spark);
    var result_handler = function(result){
      if (result.worked){
        spark.write({type: "init", room_list: result.room_list_info});
      }
      else{
        spark.write({type: "error", reason: result.reason});
      }
    };
    console.log('sock select all rooms');
    logic_room.select_all_rooms(result_handler);
  },
  recv: function(spark, data){
  },
  broadcast: function(data){
    for (var i = 0; i < sock_list.length; i++){
      sock_list[i].write(data);
    }
  },
  close: function(spark, data) {
    sock_list.splice(sock_list.indexOf(spark),1);
  },
};
