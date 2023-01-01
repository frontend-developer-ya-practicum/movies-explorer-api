const HttpCodes = require('../constants/http-status-codes');

class InternalServerError extends Error {
  constructor() {
    super('Internal server error');
    this.name = 'InternalServerError';
    this.statusCode = HttpCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
