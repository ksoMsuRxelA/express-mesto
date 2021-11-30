const { UnauthError, ForbiddenError } = require('../utils/Errors');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ForbiddenError('Неавторизованный запрос.');
    }

    let payload = undefined;

    try {
      payload = jwt.verify(token, 'some-very-secret-code');
    } catch (err) {
      throw new UnauthError('Невалидный токен доступа к ресурсу.');
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}