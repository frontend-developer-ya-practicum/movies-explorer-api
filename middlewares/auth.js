const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const ErrorMessages = require('../constants/error-messages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ErrorMessages.UNAUTHORIZED);
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

    req.user = jwt.verify(token, secret);
  } catch (err) {
    next(new UnauthorizedError(ErrorMessages.UNAUTHORIZED));
    return;
  }

  next();
};
