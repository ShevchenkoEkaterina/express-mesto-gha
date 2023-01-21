const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  createUser, login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.post('/signin', login);
app.post('/signup', createUser);
app.get('*', (req, res) => {
  res.status(404).send('message: Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
