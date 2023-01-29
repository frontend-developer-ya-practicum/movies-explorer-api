const mongoose = require('mongoose');
const Movie = require('../models/movies');
const HttpCodes = require('../constants/http-status-codes');
const ErrorMessages = require('../constants/error-messages');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(HttpCodes.CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(ErrorMessages.VALIDATION_ERROR));
        return;
      }
      next(err);
    });
};

module.exports.listMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(ErrorMessages.MOVIE_NOT_FOUND))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(ErrorMessages.NOT_ENOUGH_PERMISSIONS);
      }
      return movie.remove();
    })
    .then(() => res.status(HttpCodes.NO_CONTENT).send())
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(ErrorMessages.INVALID_MOVIE_ID));
        return;
      }
      next(err);
    });
};
