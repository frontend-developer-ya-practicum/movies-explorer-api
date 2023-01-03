const HttpCodes = require('../constants/http-status-codes');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = HttpCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
