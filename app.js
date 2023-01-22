const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const error = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-err');
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
app.use(express.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().unique(),
    password: Joi.string().required().unique(),
  }),
}), createUser);
app.use(error);
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});
app.get('*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
