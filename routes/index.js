const router = require('express').Router();
const NotFoundError = require('../errors/not-found');
const { register, login } = require('../controllers/auth');
const { validateSignUpBody, validateSignInBody } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

router.post('/signup', validateSignUpBody, register);
router.post('/signin', validateSignInBody, login);

router.use(auth);

router.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

module.exports = router;
