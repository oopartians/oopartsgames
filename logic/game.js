var models = require('../models');

module.exports = {
  select_all_games: function(handler){
    models.sequelize.transaction(function(trx){
      return models.Game.findAll({
        transaction: trx,
      });
    }).then(function(result){
      console.log('select all games success');
      console.log(result);
      handler({worked: true, game_list: result});
    }).catch(function(error){
      console.log(req.body.room_name + ' select all games error: ' + error.message);
      handler({worked: false, reason: error.message});
    });
  }
};
