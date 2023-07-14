const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при получении пользователя',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Передан некорректный _id пользователя',
        });
      }
      if (err.message.indexOf('not found')) {
        return res.status(404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }

      return res.status(500).send({ message: err.message });
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
      upsert: true,
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }

      if (err.message.indexOf('not found')) {
        return res.status(404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }

      return res.status(500).send({ message: err.message });
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
      upsert: true,
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }

      if (err.message.indexOf('not found')) {
        return res.status(404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};
