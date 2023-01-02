const mongoose = require('mongoose');
const User = require('../models/users');
const ErrorMessages = require('../constants/error-messages');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(ErrorMessages.USER_NOT_FOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(ErrorMessages.INVALID_USER_ID));
        return;
      }
      next(err);
    });
};

module.exports.patchCurrentUser = (req, res, next) => {
  const { name, email } = req.body;
  const options = { new: true, runValidators: true };

  User.findByIdAndUpdate(req.user._id, { name, email }, options)
    .orFail(new NotFoundError(ErrorMessages.USER_NOT_FOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(ErrorMessages.INVALID_USER_ID));
      } else if (err.code === 11000) {
        next(new ConflictError(ErrorMessages.USER_ALREADY_EXISTS));
      } else {
        next(err);
      }
    });
};
