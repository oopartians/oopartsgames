/* GET home page. */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  req.session.login_username = undefined
  res.redirect('/');
});

module.exports = router;
