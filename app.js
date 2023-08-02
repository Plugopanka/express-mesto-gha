const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

require('dotenv').config();
const { ERROR_ON_SERVER } = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(require('./routes/index'));

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_ON_SERVER, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_ON_SERVER ? 'Произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
});
