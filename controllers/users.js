const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const SomethingWrongError = require('../errors/not-found-err');
const AlreadyExistsError = require('../errors/already-exists-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new SomethingWrongError('Передан невалидный id'));
      }
      return next(err);
    });
};

const getOwner = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new AlreadyExistsError('Такой email уже существует.'));
      }
      return next(err);
    });
};

const updateInformationUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

const updateAvatarUser = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateInformationUser, updateAvatarUser, login, getOwner,
};
