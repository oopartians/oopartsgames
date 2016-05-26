/* GET home page. */
var express = require('express');
var router = express.Router();
var logic_room = require('../logic/room.js');
var logic_user = require('../logic/user.js');

router.get('/*', function(req, res, next){
  if (req.session.login_username == undefined){
    res.redirect('/');
  }
  else{
    next();
  }
});

router.post('/*', function(req, res, next){
  if (req.session.login_username == undefined){
    res.redirect('/');
  }
  else{
    next();
  }
});

router.use('/lobby', require('./gamelobby'));
router.use('/new', require('./create_room'));

router.get('/:room_id([0-9]+)', function(req, res){
  var room_id = Number(req.params.room_id);
  var check_already_in_handler = function(result){
    if (result.worked){
      if (result.room_id == room_id){//already in the room
        var result_handler = function(result){
          if (result.worked){
            req.session.room_id = room_id;
            res.render('waiting_room', {
              login_username: req.session.login_username,
              joined_room_id: room_id,
              room_info: result.room_info
            });
          }
          else{
            console.log('cannot get room info, so quit the room');
            res.redirect('/room/quit');
          }
        };

        logic_room.select_room_info(result_handler, room_id);
      }
      else if (result.room_id){//already in another room
        res.redirect('/room/' + result.room_id);
      }
      else{//not in any rooms.
        var result_handler = function(result){
          if (result.worked){
            res.redirect('/room/' + room_id);
          }
          else{
            req.session.join_room_failed_reason = result.reason;
            res.redirect('/room/lobby');
          }
        };
        logic_room.join_room(
          result_handler,
          room_id,
          '',
          req.session.login_username
        );
      }
    }
    else{
      req.session.join_room_failed_reason = "알수없는 오류가 발생했습니다.";
      res.redirect('/room/lobby');
    }
  };
  logic_user.select_room_id_from_user(check_already_in_handler, req.session.login_username);
});

router.get('/quit', function(req, res){
  var result_handler = function(result){
    if (result.worked){
      res.redirect('/room/lobby');
    }
    else{
      res.redirect('/');
    }
  };
  delete req.session.room_id;
  logic_user.quit_room(result_handler, req.session.login_username);
});

module.exports = router;
