const HttpCodes = require('../constants/http-status-codes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = HttpCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
