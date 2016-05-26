"use strict";

module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    game_name: { type: DataTypes.STRING, primaryKey : true, notNull: true},
    description: { type: DataTypes.STRING, notNull: true},
    min_player: { type: DataTypes.INTEGER, notNull: true},
    max_player: { type: DataTypes.INTEGER, notNull: true}
  }, {
    comment : "Game table has rows of each games in Oopartsgames.",
    classMethods: {
      associate: function(models) {
        Game.hasMany(models.Room, {foreignKey: 'game_name'});
        Game.findOrCreate({
          where:{
            game_name: "가위바위보"
          },
          defaults: {
            game_name: "가위바위보",
            description: "간단한 가위바위보 게임입니다.",
            min_player: "2",
            max_player: "4"
          }
        });
        Game.findOrCreate({
          where:{
            game_name: "오셀로"
          },
          defaults: {
            game_name: "오셀로",
            description: "흑백이 번갈아가며 두어, 마지막에 더 많은 색이 승리하는 게임입니다.",
            min_player: "2",
            max_player: "2"
          }
        });
      }
    }
  });

  return Game;
};
