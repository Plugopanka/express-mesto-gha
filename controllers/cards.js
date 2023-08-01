const Card = require("../models/card");
const { STATUS_CODE_POST } = require("../errors/errors");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CODE_POST).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки"
          )
        );
      }

      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
  .orFail(() => {
    throw new Error("NotFound");
  })
    .then((card) => {
      if (!String(card.owner) !== String(req.user._id)) {
        return next(new ForbiddenError("Нет доступа для удаления карточки"));
      }
      Card.deleteOne()
        .then(() => res.send("Карточка удалена"))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при удалении карточки"
          )
        );
      }
      if (err.message === "NotFound") {
        return next(new NotFoundError("Карточка с указанным _id не найдена"));
      }

      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError(
            "Переданы некорректные данные для постановки лайка"
          )
        );
      }

      if (err.message === "NotFound") {
        next(new NotFoundError("Передан несуществующий _id карточки"));
      }

      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Переданы некорректные данные для снятия лайка")
        );
      }

      if (err.message === "NotFound") {
        return next(new NotFoundError("Передан несуществующий _id карточки"));
      }

      return next(err);
    });
};
