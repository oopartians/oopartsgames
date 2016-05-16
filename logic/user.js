var models = require('../models');

module.exports = {
  check_account: function(req, res, handler){
    console.log('check username: ' + req.body.username);
    console.log('check password: ' + req.body.password);
    models.User.findAll({
      attributes: ['password'],
      where : {
        username: req.body.username
      }
    }).then(function (result){
      console.log(result);
      if (result.length > 0){
        if (result[0].password == req.body.password){//login success
            console.log(req.body.username + ' login success');
            handler(req, res, {worked: true});
        }
        else{//password is not correct
          console.log(req.body.username + 'password not correct');
          handler(req, res, {worked: false});
        }
      }
      else{//username is not exist in db
        console.log(req.body.username + 'is not exist');
        handler(req, res, {worked: false, move_to_signup: true});
      }
    }).catch(function(error){//unexpected error
      console.log(req.body.username + ' login error: ' + error);
      handler(req, res, {worked: false});
    });
  },
  create_account: function(req, res, handler){ 
    console.log('create username: ' + req.body.username);
    console.log('create password: ' + req.body.password);
    console.log('create description: ' + req.body.description);
    models.User.findAll({
      where : {
        username: req.body.username
      }
    }).then(function (result){
      console.log(result);
      if (result.length > 0){
        console.log(req.body.username + ' is already existing.');
        handler(req, res, {worked: false, reason:"이미 존재하는 아이디입니다."});
      }
      else{
        models.User.create({
          username: req.body.username,
          password: req.body.password,
          description: req.body.description,
        }).then(function(){
          console.log(req.body.username + ' is created.');
          handler(req, res, {worked: true, reason:""});
        }).catch(function(error){
          console.log(req.body.username + ' create error: ' + error);
          handler(req, res, {worked: false, reason:"알 수 없는 오류가 발생했습니다."});
        });
      }
    });
  }
};
