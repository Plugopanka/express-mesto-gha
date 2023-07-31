const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

require('dotenv').config();
const { ERROR_NOT_FOUND, ERROR_ON_SERVER } = require('./errors/errors');
const {
  login, createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(/^https?:\/\/(www\.)?[a-zA-Z0-9\._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/),
  }),
}), createUser);

app.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({
    message: 'Страница не найдена',
  });
});

app.use((err, req, res, next) => {
  const { statusCode = ERROR_ON_SERVER, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_ON_SERVER
        ? 'Произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
});
