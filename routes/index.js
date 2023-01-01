const router = require('express').Router();
const NotFoundError = require('../errors/not-found');
const { signup } = require('../controllers/auth');
const { validateSignUpBody } = require('../middlewares/validation');

router.post('/signup', validateSignUpBody, signup);

router.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

module.exports = router;
