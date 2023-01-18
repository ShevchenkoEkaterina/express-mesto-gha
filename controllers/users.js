const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(200).send(users);
    })
    .catch((err) => res.status(500).send(err));
};

const getUserById = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (user._id !== userId) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send(err));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } return res.status(500).send(err);
    });
};

const updateInformationUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send(err);
    });
};

const updateAvatarUser = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send(err);
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateInformationUser, updateAvatarUser,
};
