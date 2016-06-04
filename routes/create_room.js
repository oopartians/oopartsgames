/* GET home page. */
var express = require('express');
var router = express.Router();
var logic_room = require('../logic/room.js');
var logic_game = require('../logic/game.js');
var logic_user = require('../logic/user.js');

router.get('/', function(req, res){
  var select_user_info_handler= function(result){
    if (result.worked && result.user_info.room_id){
      res.redirect('/room/' + result.user_info.room_id);
    }
    else{
      var result_handler = function(result){
        if (result.worked){
          res.render('create_room', {login_username: req.session.login_username, game_list: result.game_list});
        }
        else{
          res.render('create_room', {
            login_username: req.session.login_username,
            create_room_failed_reason: result.reason
          });
        }
      };
      logic_game.select_all_games(result_handler);
    }
  };
  logic_user.select_user_info(select_user_info_handler, req.session.login_username);
});

router.post('/', function(req, res){
  console.log(JSON.stringify(req.body));
  if (req.body == undefined ||
    req.body.game_name == undefined ||
    req.body.room_name == undefined ||
    req.body.password == undefined ||
    req.body.main_time == undefined ||
    req.body.byoyomi == undefined ||
    req.body.num_byoyomi == undefined ){
      res.redirect('/');
  }

  var select_user_info_handler = function(result){
    if (result.worked && result.user_info.room_id){
      res.redirect('/room/' + result.user_info.room_id);
    }
    else{
      var result_handler = function(result){
        if (result.worked){
          res.redirect('/room/' + result.room_info.room_id);
        }
        else{
          var result_handler = function(result){
            if (result.worked){
              res.render('create_room', {
                login_username: req.session.login_username,
                game_list: result.game_list,
                create_room_failed_reason: result.reason,
                pre_room_name: req.body.room_name, pre_game_name: req.body.game_name,
                pre_main_time: req.body.main_time, pre_byoyomi: req.body.byoyomi,
                pre_num_byoyomi: req.body.num_byoyomi
              });
            }
            else{
              res.render('create_room', {
                login_username: req.session.login_username,
                create_room_failed_reason: result.reason,
                pre_room_name: req.body.room_name, pre_game_name: req.body.game_name,
                pre_main_time: req.body.main_time, pre_byoyomi: req.body.byoyomi,
                pre_num_byoyomi: req.body.num_byoyomi
              });
            }
          };
          logic_game.select_all_games(result_handler);
        }
      };
      logic_room.create_room(
        result_handler,
        req.body.game_name,
        req.body.room_name,
        req.body.password,
        req.body.main_time,
        req.body.byoyomi,
        req.body.num_byoyomi,
        req.session.login_username
      );
    }
  };
  logic_user.select_user_info(select_user_info_handler, req.session.login_username);
});

module.exports = router;
