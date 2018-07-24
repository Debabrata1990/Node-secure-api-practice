var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');


var router = function (User) {
  var usersRouter = express.Router();

  usersRouter.route('/')
    .get(function (req, res) {
      User.find({}, function (err, users) {
        if (err) {
          res.status(500);
          res.send(err);
        } else
          res.json(users);
      });
    });

  usersRouter.route('/authenticate')
    .post(function (req, res) {

      // find the user
      User.findOne({
        name: req.body.name
      }, function (err, user) {

        if (err) throw err;

        if (!user) {
          res.json({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        } else if (user) {
          // check if password matches
          if (user.password != req.body.password) {
            res.json({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
          } else {
            // if user is found and password is right
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password
            const payload = {
              admin: user.admin
            };
            var token = jwt.sign(payload, config.secret, {
              //expiresInMinutes: 1440 // expires in 24 hours
            });

            //return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }
        }
      });
    });

  return usersRouter;
};

module.exports = router;