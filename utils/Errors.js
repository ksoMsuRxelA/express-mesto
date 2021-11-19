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

class ServiceDefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'serviceDefaultError';
    this.statusCode = 500;
  }
}

const serviceError = new ServiceDefaultError('Сбой на стороне сервера или базы данных ');

module.exports = {
  DataError,
  NotFoundError,
  serviceError,
};
