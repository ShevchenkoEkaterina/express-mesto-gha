const { user } = require('../models/user.js');

const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((users) => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }))
 //    .catch((users) => res.status(500).send(err))
}

// const getUserById = (req, res) => {
//   return user.findOne({ id: req.params.id})
//   .then((users) => {
//     if (user) {
//       res.status(200).send(user)
 //    } else {
//       res.status(400).send({ message: 'Пользователь по указанному _id не найден.' })
//     }
//   })
 //  .catch((users) => res.status(500).send(err))
// }

const createUser = (req, res) => {
  user.create({ name: req.body.name, about: req.body.about, avatar: req.body.avatar })
  .then((user) => {
    if (user) {
      res.status(200).send(user)
    } else {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' })
    }
  })
  .catch((user) => res.status(500).send(err))
}

// const updateInformationUser = (req, res) => {
//   const userId = req.user._id;
//   const { name, about} = req.body;
//     return user.findByIdAndUpdate(userId, { name, about })
//     .then((user) => {
//       return res.status(200).send(user)
//     })
//     .catch((users) => res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' }))
 //    .catch((users) => res.status(404).send({ message: 'Пользователь с указанным _id не найден.' }))
//     .catch((users) => res.status(500).send(err))

// const updateAvatarUser = (req, res) => {
//     const userId = req.user._id;
//   const { avatar} = req.body;
//     return user.findByIdAndUpdate(userId, { avatar })
//     .then((user) => {
//       return res.status(200).send(user)
 //    })
 //    .catch((users) => res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' }))
//     .catch((users) => res.status(404).send({ message: 'Пользователь с указанным _id не найден.' }))
 //    .catch((users) => res.status(500).send(err))
// }


module.exports = { getUsers, createUser }