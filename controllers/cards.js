const { card } = require('../models/card.js');

const getCards = (req, res) => {
  card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((cards) => res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' }))
    .catch((cards) => res.status(500).send(err))
}

const createCard = (req, res) => {
  const { name, link} = req.body;
    card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card)
    })
    .catch((cards) => res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' }))
    .catch((cards) => res.status(500).send(err))
}

const deleteCardById = (req, res) => {
  card.findById({ id: req.params.id})
  .then((cards) => {
    if (card) {
      res.status(200).send(card)
    } else {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' })
    }
  })
}

const putCardLikesById = (req, res) => {
  return card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },)
  .then((card) => {
    if (card) {
      res.status(200).send(card)
    } else {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' })
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
    }
  })
  .catch((err) => res.status(500).send(err))
}

const deleteCardLikesById = (req, res) => {
  return card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (card) {
      res.status(200).send(card)
    } else {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' })
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
    }
  })
  .catch((err) => res.status(500).send(err))
}

module.exports = { getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById }