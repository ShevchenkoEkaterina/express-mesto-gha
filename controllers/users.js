const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('ValidationError'))
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send(err);
    });
};

const getUserById = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail(new Error('notValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'notValidId') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send(err);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .orFail(new Error('ValidationError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send(err);
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
      return res.status(500).send(err);
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

module.exports = {
  getUsers, getUserById, createUser, updateInformationUser, updateAvatarUser,
};
