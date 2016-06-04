"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: { type: DataTypes.STRING, primaryKey : true, notNull: true},
    password: { type: DataTypes.STRING, notNull: true},
    description: { type: DataTypes.STRING, notNull: true},
    state: { type: DataTypes.STRING}//ready unready disconnected observing
  }, {
    comment : "This table is User's table who signed up.",
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Room, {foreignKey: 'room_id'});
      }
    }
  });

  return User;
};
