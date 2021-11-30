class DataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'validationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notFound';
    this.statusCode = 404;
  }
}

class UnauthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauth';
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden';
    this.statusCode = 403;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Conflict';
    this.statusCode = 409;
  }
}

module.exports = {
  DataError,
  NotFoundError,
  UnauthError,
  ForbiddenError,
  ConflictError,
};
