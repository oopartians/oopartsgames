/* GET home page. */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  delete req.session.login_username;
  delete req.session.room_id;
  res.redirect('/');
});

module.exports = router;
