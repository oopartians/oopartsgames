/* GET home page. */
var express = require('express');
var router = express.Router();
var logic = require('../logic/user.js');

router.get('/', function(req, res){
  if (req.session.login_username)
    res.redirect('/');
  else{
    pre_signup_username= req.session.pre_signup_username;
    req.session.pre_signup_username = undefined;
    res.render('signup', {pre_username: pre_signup_username});
  }
});

router.post('/', function(req, res){
  console.log(JSON.stringify(req.body));

  result_handler = function(req, res, result){
    if (result.worked){
      req.session.pre_signin_username = req.body.username;
      res.redirect('/signin');
    }
    else{
      res.render('signup', {signup_failed: true, signup_failed_reason: result.reason, pre_username: req.body.username, pre_description: req.body.description});
    }
  };

  logic.create_account(req, res, result_handler);
});


module.exports = router;
