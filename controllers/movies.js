const mongoose = require('mongoose');
const Movie = require('../models/movies');
const HttpCodes = require('../constants/http-status-codes');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const ownerId = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId,
  })
    .then((movie) => res.status(HttpCodes.CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};

module.exports.listMovies = (req, res, next) => {
  const ownerId = req.user._id;

  Movie.find({ owner: ownerId })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Movie with specified id not found'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Not enough permissions');
      }
      return movie.remove();
    })
    .then(() => res.status(HttpCodes.NO_CONTENT).send())
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid movie id'));
        return;
      }
      next(err);
    });
};
