const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const SomethingWrongError = require('../errors/not-found-err');
const AlreadyExistsError = require('../errors/already-exists-err');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new SomethingWrongError('Переданы некорректные данные при создании пользователя.');
      }
      return res.status(201).send(user);
    })
    .catch(next);
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(new Error('CastError'))
    .then((user) => {
      if (!user) {
        throw new SomethingWrongError('Переданы некорректные данные при поиске пользователя.');
      }
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return next(err);
    });
};

const getOwner = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail(new Error('CastError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return next(err);
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      if (!user) {
        throw new SomethingWrongError('Переданы некорректные данные при создании пользователя');
      }
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new AlreadyExistsError('Такой email уже существует.');
      }
      return next(err);
    });
};

const updateInformationUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('CastError'))
    .then((user) => {
      if (!user) {
        throw new SomethingWrongError('Переданы некорректные данные при обновлении профиля.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return next(err);
    });
};

const updateAvatarUser = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('CastError'))
    .then((user) => {
      if (!user) {
        throw new SomethingWrongError('Переданы некорректные данные при обновлении профиля.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return next(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });
      if (!user) {
        throw new SomethingWrongError('Неккоректный токен.');
      }
      return res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateInformationUser, updateAvatarUser, login, getOwner,
};
