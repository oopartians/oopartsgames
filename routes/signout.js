/* GET home page. */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  delete req.session.login_username;
  res.redirect('/');
});

module.exports = router;
