"use strict";

module.exports = function(sequelize, DataTypes) {
  var Room = sequelize.define("Room", {
    room_id: { type: DataTypes.INTEGER, primaryKey : true, notNull: true, autoIncrement: true},
    room_name: { type: DataTypes.STRING, notNull: true},
    password: { type: DataTypes.STRING, notNull: true},

    max_player: { type: DataTypes.INTEGER, notNull: true},
    curr_player: { type: DataTypes.INTEGER, notNull: true, defaultValue: 0},
    can_observe: { type: DataTypes.BOOLEAN, notNull: true, defaultValue: true},
    
    main_time: { type: DataTypes.DOUBLE, notNull: true},
    num_byoyomi: { type: DataTypes.INTEGER, notNull: true},
    byoyomi: { type: DataTypes.DOUBLE, notNull: true},
  }, {
    comment : "This table is Room which means a unit of playing a game.",
    classMethods: {
      associate: function(models) {
        Room.hasMany(models.User, {foreignKey: 'room_id'});
        Room.belongsTo(models.Game, {foreignKey: 'game_name'});
      }
    }
  });

  return Room;
};
