const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const HttpCodes = require('../constants/http-status-codes');
const ErrorMessages = require('../constants/error-messages');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');

module.exports.register = (req, res, next) => {
  const { name, email, password } = req.body;

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
        next(new ConflictError(ErrorMessages.USER_ALREADY_EXISTS));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};
