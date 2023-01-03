const HttpCodes = require('../constants/http-status-codes');
const ErrorMessages = require('../constants/error-messages');

module.exports = (err, req, res, next) => {
  const { statusCode = HttpCodes.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HttpCodes.INTERNAL_SERVER_ERROR
        ? ErrorMessages.INTERNAL
        : message,
  });

  next();
};
