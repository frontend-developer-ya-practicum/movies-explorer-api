const HttpCodes = require('../constants/http-status-codes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = HttpCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
