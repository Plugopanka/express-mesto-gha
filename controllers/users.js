const User = require('../models/user');
const {
  STATUS_CODE_POST,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_ON_SERVER,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_ON_SERVER).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODE_POST).send({ data: user }))
    .catch((err) => {
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
