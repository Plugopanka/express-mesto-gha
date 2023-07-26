const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { ERROR_NOT_FOUND } = require('./errors/errors');
const {
  login, createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser);

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64ac04273692dc3e6400f04e',
//   };
//   next();
// });

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({
    message: 'Страница не найдена',
  });
});

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
});
