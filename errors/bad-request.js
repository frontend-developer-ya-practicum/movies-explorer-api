const HttpCodes = require('../constants/http-status-codes');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = HttpCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
