const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при получении карточки',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) =>
    {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      if (err.message.indexOf('not found')) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }

      return res.status(500).send({ message: err.message });
    });

};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }

      if (err.message.indexOf('not found')) {
        return res.status(404).send({
          message: 'Передан несуществующий _id карточки',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed')) {
        return res.status(400).send({
          message: 'Переданы некорректные данные для снятии лайка',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Передан несуществующий _id карточки',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};
