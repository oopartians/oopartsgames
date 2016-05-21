var models = require('../models');

module.exports = {
  join_room_from_submit: function(req, res, handler){
    console.log('join game_name: ' + req.body.game_name);
    console.log('join room_id: ' + req.body.room_id);
    console.log('join room_name: ' + req.body.room_name);
    console.log('join password: ' + req.body.password);
    models.sequelize.transaction(function(trx){
      return models.Room.findAll({
        attributes: ['curr_player', 'max_player'],
        where : {
          room_id: req.body.room_id,
          password: req.body.password
        },
        transaction: trx,
        lock: trx.LOCK.UPDATE
      }).then(function (result){
        console.log(result);
        if (result.length > 0){
            if (result[0].curr_player < result[0].max_player){
              return result[0].updateAttributes({
                curr_player: result[0].curr_player+1
              }, {
                transaction: trx
              });
            }
            else{//room is full
              console.log(req.body.room_name + ' room is full');
              throw new Error("방에 플레이어가 너무 많습니다.");
            }
        }
        else{//password is not correct or there is no room_id
          console.log(req.body.room_name + ' password not correct');
          throw new Error("방에 입장할 수 없습니다.");
        }
      });
    }).then(function (result){//trx commit
      console.log(req.body.room_name + ' join room success');
      handler(req, res, {worked: true});
    }).catch(function(error){//trx rollback
      console.log(req.body.room_name + ' join room error: ' + error.message);
      handler(req, res, {worked: false, reason: error.message});
    });
  },
  create_room: function(req, res, handler){ 
    created_room = null
    console.log('create game_name: ' + req.body.game_name);
    console.log('create room_name: ' + req.body.room_name);
    console.log('create password: ' + req.body.password);
    console.log('create main_time: ' + req.body.main_time);
    console.log('create byoyomi: ' + req.body.byoyomi);
    console.log('create num_byoyomi: ' + req.body.num_byoyomi);
    models.sequelize.transaction(function(trx){
      return models.Room.create({
        room_name: req.body.room_name,
        password: req.body.password,
        game_name: req.body.game_name,
        max_player: 2,
        curr_player: 1,
        main_time: req.body.main_time,
        num_byoyomi: req.body.num_byoyomi,
        byoyomi: req.body.byoyomi
      },{
        transaction: trx
      }).then(function(room){
        console.log(room.room_id + ':' + room.room_name + ' is created.');
        created_room = room;
        return models.User.update({
          room_id: room.room_id
        },{
          where: {
            username: req.session.login_username
          },
          transaction: trx
        });
      });
    }).then(function(result){
      console.log(req.session.login_username + ' joined ' + created_room.room_id);
      handler(req, res, {worked: true, room_id: created_room.room_id});
    }).catch(function(error){
      console.log(req.body.room_name + ' create error: ' + error);
      handler(req, res, {worked: false, reason:"알 수 없는 오류가 발생했습니다."});
    });
  }
};
