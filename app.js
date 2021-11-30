require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const joiObjectSign = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true),
};
const joiObjectUser = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
};

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', celebrate(joiObjectSign), createUser);
app.post('/signin', celebrate(joiObjectSign), login);

// auth in success this middleware will put user._id prop in our req object for middlewares below

app.use('/', auth, celebrate(joiObjectUser), users);
app.use('/', auth, cards);
app.use((req, res) => {
  res.status(404).send({ message: 'Error 404. Could not found such page...' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const {statusCode = 500, message} = err;

  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`App has been started on port: ${PORT}`);
});
