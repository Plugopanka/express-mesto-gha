const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }

      res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, userId } = req.body;
  console.log(req.user._id);
  Card.create({ name, link, user: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }

      res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(404).send({ message: "Карточка с указанным _id не найдена" }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: "Передан несуществующий _id карточки",
        });
      }

      res.status(500).send({ message: err.message });
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
  if (err.name === "CastError") {
    return res.status(400).send({
      message: "Переданы некорректные данные для снятии лайка",
    });
  }

  if (err.name === "DocumentNotFoundError") {
    return res.status(404).send({
      message: "Передан несуществующий _id карточки",
    });
  }

  res.status(500).send({ message: err.message });
});
};
