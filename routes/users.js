const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getUserId, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), changeUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserId);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(/^https?:\/\/(www\.)?[a-zA-Z0-9\._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/),
  }),
}), changeUserAvatar);

module.exports = router;
