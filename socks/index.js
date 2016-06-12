"use strict";

var fs        = require("fs");
var path      = require("path");
var socks = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js") && (file !== "games");
  })
  .forEach(function(file) {
    var handler = require(path.join(__dirname, file));
    socks[handler.name] = handler;
  });

module.exports = socks;
