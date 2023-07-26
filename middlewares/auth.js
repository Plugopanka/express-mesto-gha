const jwt = require('jsonwebtoken');
const { ERROR_UNAUTHORIZED } = require('../errors/errors');

const handleAuthError = (res) => {
  res
    .status(ERROR_UNAUTHORIZED)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
