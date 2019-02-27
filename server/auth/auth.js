var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });
var User = require('../api/user/userModel');

exports.decodeToken = function() {
  return function(req, res, next) {
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format
    // so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    // this will call next if token is valid
    // and send error if its not. It will attached
    // the decoded token to req.user
    checkToken(req, res, next);
  };
};

exports.getFreshUser = function() {
  return function(req, res, next) {
    User.findById(req.user._id)
      .then(function(user){
        if(!user){
          res.status(401).send('Unautohorized');
        }else {
          req.user = user;
          next();
        }
      },function(err){
        next(err);
      });

  }
};

exports.verifyUser = function() {
  return function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    // if no username or password then stop.
    if(!username || !password){
      res.status(400).send('Username and Password required');
      return;
    }

    // look user up in the DB so we can check
    // if the passwords match for the username
    User.findOne({username: username})
      .then(function(user){
        if(!user){
          res.status(401).send('No user with given username found');
        }else {
          if(!user.authenticate(password)){
            res.status(401).send('Wrong password');
          }else {
            req.user = user;
            next();
          }
        }
      }, function(err){
          next(err);
      });
  };
};

// util method to sign tokens on signup
exports.signToken = function(id) {
  return jwt.sign(
    {_id: id},
    config.secrets.jwt,
    {expiresInMinutes: config.expireTime}
  );
};
