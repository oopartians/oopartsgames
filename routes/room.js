/* GET home page. */
var express = require('express');
var router = express.Router();
var logic_room = require('../logic/room.js');
var logic_game = require('../logic/game.js');

router.get('/new', function(req, res){
  if (req.session.login_username){
    result_handler = function(req, res, result){
      if (result.worked){
        res.render('create_room', {login_username: req.session.login_username, game_list: result.game_list});
      }
      else{
        res.render('create_room', {
          login_username: req.session.login_username,
          create_room_failed: true,
          create_room_failed_reason: result.reason
        });
      }
    };

    logic_game.select_all_games(req, res, result_handler);

  }
  else{
    res.redirect('/');
  }
});

router.get('/:room_id([0-9]+)', function(req, res){
  if (req.session.room_id && req.session.room_id.toString() == req.params.room_id){
    result_handler = function(req, res, result){
      if (result.worked){
        res.render('waiting_room', {
          login_username: req.session.login_username,
          game_info: result.game_info});
      }
      else{
        res.send('fail');
      }
    };

    logic_game.select_game_from_room_id(req, res, result_handler);
  }
  else{
    res.send('fail');
  }
});

router.post('/new', function(req, res){
  console.log(JSON.stringify(req.body));

  result_handler = function(req, res, result){
    if (result.worked){
      req.session.room_id = result.room_id;
      res.redirect('/room/' + result.room_id);
    }
    else{
      res.render('create_room', {
        login_username: req.session.login_username,
        create_room_failed: true, create_room_failed_reason: result.reason,
        pre_room_name: req.body.room_name, pre_game_name: req.body.game_name,
        pre_main_time: req.body.main_time, pre_byoyomi: req.body.byoyomi,
        pre_num_byoyomi: req.body.num_byoyomi
      });
    }
  };

  logic_room.create_room(req, res, result_handler);
});


module.exports = router;
