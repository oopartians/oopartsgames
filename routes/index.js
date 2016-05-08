var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ooparts games' });
});

router.get('/test', function(req, res, next) {
  res.render('signin', { title: 'Ooparts games' });
});

module.exports = router;
