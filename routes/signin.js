/* GET home page. */
var express = require('express');
var router = express.Router();
var logic = require('../logic/user.js');

router.get('/*', function(req, res, next){
  if (req.session.login_username){
    res.redirect('/');
  }
  else{
    next();
  }
});
router.post('/*', function(req, res, next){
  if (req.session.login_username){
    res.redirect('/');
  }
  else{
    next();
  }
});

router.get('/', function(req, res){
  pre_signin_username = req.session.pre_signin_username;
  delete req.session.pre_signin_username;
  res.render('signin', {pre_username: pre_signin_username});
});

router.post('/', function(req, res){
  console.log(JSON.stringify(req.body));

  result_handler = function(result){
    if (result.worked){
      req.session.login_username = req.body.username;
      console.log(req.session.login_username);
      res.redirect('/');
    }
    else{
      if (result.move_to_signup){
        req.session.pre_signup_username = req.body.username
        res.redirect('/signup');
      }
      else{
        res.render('signin', {signin_failed: true , pre_username: req.body.username});
      }
    }
  };

  logic.check_account(result_handler, req.body.username, req.body.password);
});



module.exports = router;
