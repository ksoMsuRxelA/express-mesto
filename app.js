const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6196bac1c730d6686a53e519',
  };

  next();
});

app.use('/', users);
app.use('/', cards);

app.listen(PORT, () => {
  console.log(`App has been started on port: ${PORT}`);
});
