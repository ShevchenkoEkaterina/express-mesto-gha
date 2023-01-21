const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const error = require('../middlewares/error');

const getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('ValidationError'))
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send(error);
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(new Error('notValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'notValidId') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send(error);
    });
};

const getOwner = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail(new Error('notValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'notValidId') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send(error);
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
    .orFail(new Error('ValidationError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Такой email уже существует' });
      }
      return res.status(500).send(error);
    });
};

const updateInformationUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true }, { runValidators: true })
    .orFail(new Error('notValidId'))
    .orFail(new Error('ValidationError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'notValidId') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля. ' });
      }
      return res.status(500).send(error);
    });
};

const updateAvatarUser = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true }, { runValidators: true })
    .orFail(new Error('notValidId'))
    .orFail(new Error('ValidationError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'notValidId') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля. ' });
      }
      return res.status(500).send(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .orFail(new Error('incorrectToken'))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === 'incorrectToken') {
        res.status(401).send({ message: 'Неккоректный токен.' });
      }
      return res.status(500).send(err);
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateInformationUser, updateAvatarUser, login, getOwner,
};
