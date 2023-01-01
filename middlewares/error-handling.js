const HttpCodes = require('../constants/http-status-codes');

module.exports = (err, req, res, next) => {
  const { statusCode = HttpCodes.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HttpCodes.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : message,
  });

  next();
};
