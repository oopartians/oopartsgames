/* GET home page. */
var express = require('express');
var router = express.Router();
var logic_room = require('../logic/room.js');
var logic_user = require('../logic/user.js');

router.get('/', function(req, res){
  var join_room_failed_reason_from_session = undefined;
  if (req.session.join_room_failed_reason){
    join_room_failed_reason_from_session = req.session.join_room_failed_reason;
    delete req.session.join_room_failed_reason;
  }

  var select_user_info_handler= function(result){
    if (result.worked && result.user_info.room_id){
      res.redirect('/room/' + result.user_info.room_id);
    }
    else{
      res.render('gamelobby', {
        login_username: req.session.login_username,
        join_room_failed_reason: join_room_failed_reason_from_session
      });
    }
  }
  logic_user.select_user_info(select_user_info_handler, req.session.login_username);
});

router.post('/', function(req, res){
  console.log(JSON.stringify(req.body));
  if (req.body == undefined ||
      req.body.room_id == undefined ||
      req.body.password == undefined){
    res.redirect('/');
  }
  var select_user_info_handler = function(result){
    if (result.worked && result.user_info.room_id){
      res.redirect('/room/' + result.user_info.room_id);
    }
    else{
      var result_handler = function(result){
        if (result.worked){
          res.redirect('/room/' + req.body.room_id);
        }
        else{
          req.session.join_room_failed_reason = result.reason;
          res.redirect('/room/lobby');
        }
      }
      logic_room.join_room(
        result_handler,
        req.body.room_id, 
        req.body.password, 
        req.session.login_username
      );
    }
  };
  logic_user.select_user_info(select_user_info_handler, req.session.login_username);
});

module.exports = router;
