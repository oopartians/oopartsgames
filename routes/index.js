/* GET home page. */
var express = require('express');
var router = express.Router();
var logic_user = require('../logic/user.js');

router.get('/', function(req, res){
  if (req.session.login_username){
    result_handler = function(result){
      if (result.worked && result.room_id){//already joined in a game
        res.redirect('/room/' + result.room_id);
      }
      else{//room_id is null or unexpected error
        res.render('index', {login_username: req.session.login_username});
      }
    }
    logic_user.select_room_id_from_user(result_handler, req.session.login_username);
  }
  else{
    res.render('signin', {});
  }
});

module.exports = router;
