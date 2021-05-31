const { registerLocaleData } = require('@angular/common');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      });
      console.log(user);
      user.save().then( result => {
        res.status(201).json ({
          message: 'User has been Added!!',
          result: result
        });

      }).catch (err => {
        res.status(500).json ({
          error: err
        });
      });

    });
});

router.post("/login", (req, res, next) => {
  let userInDB;
  User.findOne({email: req.body.email})
    .then(user => {
      userInDB = user;
      console.log(userInDB);
      if(!user) {
        return res.status(401).json({
          message: "Authentication Failed - User Not Found!"
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then (result => {
      console.log('Checking password');
      if(!result) {
        return res.status(401).json({
          message: "Authentication Failed - Invalid Password!"
        });
      }
      const token = jwt.sign({email: userInDB.email, firstName: userInDB.firstName, id: userInDB._id}, 'secret_this_should_be_a_long_string',
          {expiresIn: "1h"});
      console.log('token generated');
      res.status(200).json({
        message: 'Login Success!!',
        token: token,
        expiresIn: 3600,
        userID: userInDB._id
      });
    })
    .catch (err => {
      console.log(err);
      return res.status(401).json({
         message: "Authentication Failed - Error!"
      });
    });
});

module.exports = router;
