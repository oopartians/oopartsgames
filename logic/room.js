var models = require('../models');
var socks = require('../socks');

check_and_update_room_id = function(trx, room_id, username){
  var user_info;
  return models.User.findAll({
    attributes: ['username', 'room_id'],
    where: {
      username: username
    },
    transaction: trx,
    lock: trx.LOCK.UPDATE
  }).then(function(result){
    if (result.length == undefined || result.length <= 0){//there is no room_id
      console.log(username+ ' there is not exist');
      throw new Error("로그인한 유저가 존재하지 않습니다.");
    }
    user_info = result[0];
    if (user_info.room_id == Number(room_id)){
      console.log(username + ' is already in ' + room_id + ' room.');
      throw new Error("");
    }
    if (user_info.room_id != null){
      console.log(username + ' is already in another room.');   
      throw new Error("이미 참가해 있는 방이 있습니다.");
    }
    return user_info.updateAttributes({
      room_id: Number(room_id),
      state: 'unready'
    },{
      transaction: trx
    });
  });
};

check_and_increase_curr_player = function(trx, room_id, password){
  var room_info;
  var trx_result = models.Room.findAll({
    where: {
      room_id: Number(room_id)
    },
    include: [models.Game],
    transaction: trx,
    lock: trx.LOCK.UPDATE
  }).then(function (result){
    console.log(result);
    if (result.length == undefined || result.length <= 0){//there is no room_id
      console.log(room_id + ' there is no room_id');
      throw new Error("방이 존재하지 않습니다.");
    }
    room_info = result[0];
    if (room_info.password != password){//password not correct
      console.log(room_id + ' password not correct');
      throw new Error("비밀번호가 다릅니다.");
    }
    if (room_info.curr_player >= result[0].Game.max_player){//room is full
      console.log(room_id + ' room is full');
      throw new Error("방에 플레이어가 너무 많습니다.");
    }
    if (room_info.state != 'wait'){//room is already started
      console.log(room_id + ' room is already started');
      throw new Error("이미 시작된 게임에는 참가할 수 없습니다.");
    }
    room_info.curr_player += 1;
    return room_info.updateAttributes({
      curr_player: room_info.curr_player
    }, {
      transaction: trx
    });
  });
  return {trx_result: trx_result, room_info: room_info};
};

module.exports = {
  select_all_rooms: function(handler){
    models.sequelize.transaction(function(trx){
      return models.Room.findAll({
        order: 'room_id DESC',
        include: [models.Game],
        transaction: trx,
      });
    }).then(function(result){
      console.log('select all rooms success');
      handler({worked: true, room_list_info: result});
    }).catch(function(error){
      console.log(' select all rooms error: ' + error.message);
      handler({worked: true, reason: error.message});
    });
  },
  join_room: function(handler, room_id, password, username){
    console.log('join room_id: ' + room_id);
    console.log('join username: ' + username);
    console.log('join password: ' + password);
    var room_result;
    models.sequelize.transaction(function(trx){
      return check_and_update_room_id(trx, room_id, username).then(function(result){
        room_result = check_and_increase_curr_player(trx, room_id, password);
        return room_result.trx_result;
      });
    }).then(function(result){
      console.log(room_id + ' join room success');

      socks.gamelobby.broadcast({type: "update", room_info: room_result.room_info});

      models.User.findAll({
        where: {
          username : username
        }
      }).then(function(result){
        console.log(room_id + ' join room select user info success');
        socks.waiting_room.broadcast(room_id, {type: "join", user_info: result[0]});
      }).catch(function(error){
        console.log(room_id + ' join room select user info error : '+ error.message);
      });

      handler({worked: true, room_info: room_result.room_info});
    }).catch(function(error){
      console.log(room_id + ' join room error: ' + error.message);
      handler({worked: false, reason: error.message});
    });
  },
  create_room: function(handler, game_name, room_name, password, main_time, byoyomi, num_byoyomi, username){ 
    console.log('create game_name: ' + game_name);
    console.log('create room_name: ' + room_name);
    console.log('create password: ' + password);
    console.log('create main_time: ' + main_time);
    console.log('create byoyomi: ' + byoyomi);
    console.log('create num_byoyomi: ' + num_byoyomi);
    var created_room_id;
    models.sequelize.transaction(function(trx){
      return models.Room.create({
        room_name: room_name,
        password: password,
        game_name: game_name,
        curr_player: 1,
        main_time: main_time,
        num_byoyomi: num_byoyomi,
        byoyomi: byoyomi,
        state: 'wait',
      },{
        transaction: trx
      }).then(function(result){
        created_room_id = result.room_id;
        console.log(result.room_id + ':' + result.room_name + ' is created.');
        return check_and_update_room_id(trx, result.room_id, username);
      });
    }).then(function(result){
      models.Room.findAll({
        where: {
          room_id: created_room_id
        },
        include: [models.Game]
      }).then(function(result){
        if (result == undefined || result.length <= 0){
          throw new Error("알수 없는 오류입니다.");
        }
        console.log(username + ' joined ' + result[0].room_id);
        socks.gamelobby.broadcast({type: "add", room_info: result[0]});

        handler({worked: true, room_info: result[0]});
      }).catch(function(error){
        console.log(room_name + ' create error: ' + error);
        handler({worked: false, reason: error.message});
      });
    }).catch(function(error){
      console.log(room_name + ' create error: ' + error);
      handler({worked: false, reason: error.message});
    });
  },
  select_user_list_in_room: function(handler, room_id){
    var user_list = null;
    models.sequelize.transaction(function(trx){
      return models.User.findAll({
        attributes: ['username', 'description', 'state', 'room_id'],
        where: {
          room_id: room_id
        },
        transaction: trx
      });
    }).then(function(result){
      console.log(room_id + ' select user list in room success');
      handler({worked: true, user_list: result});
    }).catch(function(error){
      console.log(room_id + ' select user list in room error: ' + error.message);
      handler({worked: false, reason: error.message});
    });
  },
  select_room_info: function(handler, room_id){
    models.sequelize.transaction(function(trx){
      return models.Room.findOne({
        where: {
          room_id: room_id
        },
        include: [models.Game],
        transaction: trx
      });
    }).then(function(result){
      console.log(room_id + ' select room info success');
      handler({worked: true, room_info: result});
    }).catch(function(error){
      console.log(room_id + ' select room info error: ' + error.message);
      handler({worked: false, reason: error.message});
    });
  },
  update_state_after_all_ready: function(handler, room_id){
    console.log('check state all ready room_id : ' + room_id);
    models.sequelize.transaction(function(trx){
      return models.User.findAll({
        where : {
          state : { $not : 'ready'},
          room_id: room_id
        },
        transaction : trx,
      }).then(function(result){
        if (result.length > 0){
          console.log(room_id + ' check state all ready fail: There are at least one unready user');
          throw new Error('');
        }
        return models.Room.findAll({
          where: {
            room_id: Number(room_id)
          },
          include: [models.Game],
          transaction: trx,
          lock: trx.LOCK.UPDATE
        }).then(function(result){
          if (result[0].curr_player < result[0].Game.min_player){
            console.log(room_id + ' check state all ready fail: The number of readied user cannot satisfy min_player.');
            throw new Error('');
          }
          return result[0].updateAttributes({
            state: 'game'
          },{
            transaction: trx,
                 where:{room_id: room_id}
          });
        });
      });
    }).then(function(result){
      console.log(room_id + ' check state all ready success');
      handler({worked: true, doGame: true});
    }).catch(function(error){
      console.log(room_id + ' check state all ready error : ' + error.message);
      handler({worked: false, reason: error.message});
    });
  }
};
