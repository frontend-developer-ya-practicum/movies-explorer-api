const mongoose = require('mongoose');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('User with specified id not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid user id'));
        return;
      }
      next(err);
    });
};

module.exports.patchCurrentUser = (req, res, next) => {
  const { name, email } = req.body;
  const options = { new: true, runValidators: true };

  User.findByIdAndUpdate(req.user._id, { name, email }, options)
    .orFail(new NotFoundError('User with specified id not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid user id'));
        return;
      }
      next(err);
    });
};
