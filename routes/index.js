/* GET home page. */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  if (req.session.login_username){
    res.render('index', {login_username: req.session.login_username});
  }
  else{
    res.render('signin', {});
  }
});

module.exports = router;
