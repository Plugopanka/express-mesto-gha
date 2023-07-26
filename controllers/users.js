const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  STATUS_CODE_POST,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_NOT_FOUND,
  ERROR_REQUEST_CONFLICT,
  ERROR_ON_SERVER,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_ON_SERVER).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Передан некорректный _id пользователя',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }

      return res.status(ERROR_ON_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(STATUS_CODE_POST).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(ERROR_REQUEST_CONFLICT).send({
          message: 'Пользователь с таким email уже существует',
        });
      }

      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }

      return res.status(ERROR_ON_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Передан некорректный _id пользователя',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }

      return res.status(ERROR_ON_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }

      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }

      return res.status(ERROR_ON_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }

      if (err.message === 'NotFound') {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }

      return res.status(ERROR_ON_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      // if (err.name === "ValidationError") {
      res.status(ERROR_UNAUTHORIZED).send({
        message: 'Переданы некорректные email или пароль',
      });
      // }

      // return res.status(ERROR_ON_SERVER).send({ message: "Произошла ошибка" });
    });
};
