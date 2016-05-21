"use strict";

module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    game_name: { type: DataTypes.STRING, primaryKey : true, notNull: true},
    min_need_player: { type: DataTypes.INTEGER, notNull: true},
    max_need_player: { type: DataTypes.INTEGER, notNull: true},
  }, {
    comment : "Game table has rows of each games in Oopartsgames.",
    classMethods: {
      associate: function(models) {
        Game.hasMany(models.Room, {foreignKey: 'game_name'});
        Game.create({
          game_name: "가위바위보",
          min_need_player: "2",
          max_need_player: "4"
        });
        Game.create({
          game_name: "오셀로",
          min_need_player: "2",
          max_need_player: "2"
        });
      }
    }
  });

  return Game;
};
