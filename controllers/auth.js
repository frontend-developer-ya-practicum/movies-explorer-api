const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/users');
const HttpCodes = require('../constants/http-status-codes');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');

module.exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!password) {
    next(new BadRequestError('password is required'));
    return;
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((userCreated) => {
      const user = userCreated.toObject();
      delete user.password;
      res.status(HttpCodes.CREATED).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('User with given email already exists'));
      } else {
        next(err);
      }
    });
};
