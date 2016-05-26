var models = require('../models');
var socks = require('../socks');

update_state = function(user_arg, room_id, state, use_in){ 
  var user_list = [];
  if (typeof(user_arg) == 'object'){
    user_list = user_arg;
  }
  else{
    user_list = [user_arg];
  }
  var where_option;
  if (use_in){
    if (user_list.length <= 0){
      where_option = {
        room_id: room_id
      };
    }
    else{
      where_option = {
        username: (use_in ? { $in: user_list}: { $notIn: user_list}),
        room_id: room_id
      };
    }
  }
  return models.sequelize.transaction(function(trx){
    return models.User.update({
      state: state
    },{
      where : where_option,
      transaction: trx
    });
  });
}

module.exports = {
 quit_room: function(handler, username){
    console.log('username: ' + username);
    var type;
    var user_info;
    var room_info;
    models.sequelize.transaction(function(trx){
      return models.User.findAll({
        attributes: ['username', 'room_id'],
        where: {
          username: username,
        },
        transaction: trx,
        lock: trx.LOCK.UPDATE
      }).then(function(result){
        if (result.length == undefined || result.length <= 0){
          console.log(username + ' is not existing username.');
          throw new Error("로그인된 유저가 존재하지 않습니다.");
        }

        user_info = result[0];
        if (user_info.room_id == null){
          console.log(username + ' is already out of the room.');
          throw new Error('');
        }
        return models.Room.findAll({
          attributes: ['room_id', 'curr_player'],
          where: {
            room_id: Number(user_info.room_id)
          },
          transaction: trx,
          lock: trx.LOCK.UPDATE
        }).then(function (result){
          console.log(result);
          if (result.length == undefined || result.length <= 0){
            console.log(user_info.room_id + ' is not existing room.');
            return user_info.updateAttributes({
              room_id: null,
              state: null,
            },{
              transaction: trx
            });
          }
          room_info = result[0];
          return user_info.updateAttributes({
            room_id: null
          },{
            transaction: trx
          }).then(function(result){
            room_info.curr_player -= 1;
            if (room_info.curr_player <= 0){
              type = "remove";
              return room_info.destroy({transaction: trx});
            }
            else{
              type = "update";
              return room_info.updateAttributes({
                curr_player: room_info.curr_player
              }, {
                transaction: trx
              });
            }
          });
        });
      });
    }).then(function(result){
      console.log(username+ ' quit room success');
      socks.gamelobby.broadcast({type: type, room_info: room_info});
      socks.waiting_room.broadcast(room_info.room_id, {type: 'quit', username: user_info.username});
      handler({worked: true});
    }).catch(function(error){
      if (error.message == ''){//the user is already out of room.
        console.log(username + ' quit room success');
        handler({worked: true});
      }
      else{
        console.log(username + ' quit room error: ' + error.message);
        handler({worked: false, reason: error.message});
      }
    });
  },
  select_room_id_from_user: function(handler, username){
    console.log('username: ' + username);
    models.User.findAll({
      attributes: ['username', 'room_id'],
      where : {
        username: username
      }
    }).then(function (result){
      console.log(username + ' select room id from user success');
      handler({worked: true, room_id: result[0].room_id});
    }).catch(function(error){//unexpected error
      console.log(username + ' select room id from user error: ' + error);
      handler({worked: false});
    });
  },
  check_account: function(handler, username, password){
    console.log('check username: ' + username);
    console.log('check password: ' + password);
    models.User.findAll({
      attributes: ['password'],
      where : {
        username: username
      }
    }).then(function (result){
      console.log(result);
      if (result.length > 0){
        if (result[0].password == password){//login success
            console.log(username + ' login success');
            handler({worked: true});
        }
        else{//password is not correct
          console.log(username + 'password not correct');
          handler({worked: false});
        }
      }
      else{//username is not exist in db
        console.log(username + 'is not exist');
        handler({worked: false, move_to_signup: true});
      }
    }).catch(function(error){//unexpected error
      console.log(username + ' login error: ' + error);
      handler({worked: false});
    });
  },
  create_account: function(handler, username, password, description){ 
    console.log('create username: ' + username);
    console.log('create password: ' + password);
    console.log('create description: ' + description);

    models.User.findAll({
      where : {
        username: username
      }
    }).then(function (result){
      console.log(result);
      if (result.length > 0){
        console.log(username + ' is already existing.');
        handler({worked: false, reason:"이미 존재하는 아이디입니다."});
      }
      else{
        models.User.create({
          username: username,
          password: password,
          description: description,
        }).then(function(){
          console.log(username + ' is created.');
          handler({worked: true});
        }).catch(function(error){
          console.log(username + ' create error: ' + error);
          handler({worked: false, reason:"알 수 없는 오류가 발생했습니다."});
        });
      }
    });
  },
  update_state_in_user_list: function(handler, user_arg, room_id, state){ 
    console.log('update state username: ' + user_arg);
    console.log('update state room_id: ' + room_id);
    console.log('update state state: ' + state);

    update_state(user_arg, room_id, state, true).then(function(result){
      console.log(user_list+ ' update state success.');
      handler({worked: true});
    }).catch(function(error){
      console.log(user_list+ ' update state error : ' + error.message);
      handler({worked: false, reason:error.message});
    });
  },
  update_state_not_in_user_list: function(handler, user_arg, room_id, state){ 
    console.log('update state not in user list username: ' + user_arg);
    console.log('update state not in user list room_id: ' + room_id);
    update_state(user_arg, room_id, state, false).then(function(result){
      console.log(user_list+ ' update state success.');
      handler({worked: true});
    }).catch(function(error){
      console.log(user_list+ ' update state error : ' + error.message);
      handler({worked: false, reason:error.message});
    });
  },
};
