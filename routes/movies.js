const router = require('express').Router();
const { validateCreateMovieBody, validateMovieId } = require('../middlewares/validation');

const {
  createMovie, listMovies, deleteMovie,
} = require('../controllers/movies');

router.get('/', listMovies);
router.post('/', validateCreateMovieBody, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
