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
  }
};
