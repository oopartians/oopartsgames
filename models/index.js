"use strict";

var env       = process.env.NODE_ENV || "mysql";

var configs = {
  "development": {
    "dialect": "sqlite",
    "storage": "./db.development.sqlite"
  },
  "mysql": {
    "username": process.env.OPENSHIFT_MYSQL_DB_USERNAME || "oopartsgames",
    "password": process.env.OPENSHIFT_MYSQL_DB_PASSWORD || "ooparts",
    "database": process.env.OPENSHIFT_APP_NAME || "oopartsgames",
    "host": process.env.OPENSHIFT_MYSQL_DB_HOST || "localhost",
    "port": process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
    "dialect": "mysql",
    "define": {
      "charset": "utf8",
      "collate": "utf8_general_ci"
    }
  },
  "postgresql": {
    "username": process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME || "oopartsgames",
    "password": process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD || "ooparts",
    "database": process.env.OPENSHIFT_APP_NAME || "oopartsgames",
    "host": process.env.OPENSHIFT_POSTGRESQL_DB_HOST || "localhost",
    "port": process.env.OPENSHIFT_POSTGRESQL_DB_PORT || 5432,
    "dialect": "postgresql",
    "define": {
      "charset": "utf8",
      "collate": "utf8_general_ci"
    }
  }
};

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var config = configs[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.init_row = function(){
  Object.keys(db).forEach(function(modelName) {
    if ("init_row" in db[modelName]) {
      db[modelName].init_row(db);
    }
  });
}

module.exports = db;
/* play.js
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Play = sequelize.define("Play", {
  }, {
    comment : "Play table connect user A and room B so it means  A joined B.",
    classMethods: {
      associate: function(models) {
        Play.belongsTo(models.User, {foreignkey: 'username'});
        Play.belongsTo(models.Room, {foreignkey: 'roomid'});
      }
    }
  });

  return Play;
};
*/
