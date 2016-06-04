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
  pre_signup_username= req.session.pre_signup_username;
  delete req.session.pre_signup_username;
  res.render('signup', {pre_username: pre_signup_username});
});

router.post('/', function(req, res){
  console.log(JSON.stringify(req.body));
  if (req.body == undefined ||
      req.body.username == undefined ||
      req.body.password == undefined ||
      req.body.description == undefined){
      res.redirect('/');
  }

  result_handler = function(result){
    if (result.worked){
      req.session.pre_signin_username = req.body.username;
      res.redirect('/signin');
    }
    else{
      res.render('signup', {signup_failed_reason: result.reason, pre_username: req.body.username, pre_description: req.body.description});
    }
  };

  logic.create_account(result_handler, req.body.username, req.body.password, req.body.description);
});


module.exports = router;
