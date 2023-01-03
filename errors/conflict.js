const HttpCodes = require('../constants/http-status-codes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = HttpCodes.CONFLICT;
  }
}

module.exports = ConflictError;
