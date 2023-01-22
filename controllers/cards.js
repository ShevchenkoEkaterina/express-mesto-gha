const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const SomethingWrongError = require('../errors/not-found-err');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new SomethingWrongError('Переданы некорректные данные при создании карточки.');
      }
      return res.status(200).send(card);
    })
    .catch(next);
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new SomethingWrongError('Переданы некорректные данные при создании карточки.');
      }
      return res.status(200).send(card);
    })
    .catch(next);
};

const deleteCardById = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(new Error('CastError'))
    .then((card) => {
      if (card.owner === ownerId) {
        card.remove();
        res.status(200).send(card);
      }
      throw new SomethingWrongError('Невозможно удалить чужую карточку.');
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      return next(err);
    });
};

const putCardLikesById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .orFail(new Error('CastError'))
    .then((card) => {
      if (!card) {
        throw new SomethingWrongError('Переданы некорректные данные для постановки/снятии лайка.');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return next(err);
    });
};

const deleteCardLikesById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .orFail(new Error('CastError'))
    .then((card) => {
      if (!card) {
        throw new SomethingWrongError('Переданы некорректные данные для постановки/снятии лайка.');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
};
