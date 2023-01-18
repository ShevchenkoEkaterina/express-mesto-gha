const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        return res.status(200).send(cards);
      }
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    })
    .catch((err) => res.status(500).send(err));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => res.status(500).send(err));
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params.cardId;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return card.remove();
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send(err));
};

const putCardLikesById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' });
      }
      return res.status(500).send(err);
    });
};

const deleteCardLikesById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' });
      }
      return res.status(500).send(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
};
