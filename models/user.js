"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: { type: DataTypes.STRING, primaryKey : true, notNull: true},
    password: { type: DataTypes.STRING, notNull: true},
    description: { type: DataTypes.STRING, notNull: true}
  }, {
    classMethods: {
      /*associate: function(models) {
        User.hasMany(models.Task)
      }
      */
    }
  });

  return User;
};
