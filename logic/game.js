var models = require('../models');

module.exports = {
  select_all_games: function(req, res, handler){
    models.sequelize.transaction(function(trx){
      return models.Game.findAll({
        transaction: trx,
      });
    }).then(function (result){//trx commit
      console.log('select all games success');
      console.log(result);
      handler(req, res, {worked: true, game_list: result});
    }).catch(function(error){//trx rollback
      console.log(req.body.room_name + ' select all games error: ' + error.message);
      handler(req, res, {worked: false, reason: error.message});
    });
  },
  select_game_from_room_id: function(req, res, handler){
    models.sequelize.transaction(function(trx){
      room_info = null;
      user_list = null;
      return models.User.findAll({
        attributes: ['username'],
        where: {
          room_id: req.params.room_id
        },
        transaction: trx
      }).then(function (result){
        console.log('userlist : ' + result);
        console.log('userlist : ' + result[0].username);
        user_list = result;
        return models.Room.find({
          where: {
            room_id: req.params.room_id
          },
          transaction: trx
        }).then(function (result){
          room_info = result;
          return models.Game.find({
            where: {
              game_name: result.game_name
            },
            transaction: trx
          });
        });
      });
    }).then(function (result){//trx commit
      console.log('select game from room_id success');
      console.log(result);
      handler(req, res, {worked: true, game_info: result, room_info: room_info, user_list: user_list});
    }).catch(function(error){//trx rollback
      console.log(req.params.room_id + ' select game from room_id error: ' + error.message);
      handler(req, res, {worked: false, reason: error.message});
    });
  }
};
