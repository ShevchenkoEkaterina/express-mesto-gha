const Card = require('../models/card');
const error = require('../middlewares/error');

const getCards = (req, res) => {
  Card.find({})
    .orFail(new Error('ValidationError'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send(error);
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .orFail(new Error('ValidationError'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send(error);
    });
};

const deleteCardById = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(new Error('notValidId'))
    .then((card) => {
      if (card.owner === ownerId) {
        res.status(200).send(card);
      }
      return res.status(400).send({ message: 'Невозможно удалить чужую карточку' });
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(500).send(error);
    });
};

const putCardLikesById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notValidId'))
    .orFail(new Error('ValidationError'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'notValidId') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' });
      }
      return res.status(500).send(error);
    });
};

const deleteCardLikesById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notValidId'))
    .orFail(new Error('ValidationError'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'notValidId') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' });
      }
      return res.status(500).send(error);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
};
