const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const SomethingWrongError = require('../errors/not-found-err');
const NotAutorizedError = require('../errors/not-authorized-err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при создании карточки.'));
      }
      return res.send(err.errors.message);
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(new Error('CastError'))
    .then((card) => {
      if (String(card.owner) === ownerId) {
        card.remove();
      }
      return next(new NotAutorizedError('Невозможно удалить чужую карточку.'));
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      return next(err);
    });
};

const putCardLikesById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err) {
        return next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      return next(err);
    });
};

const deleteCardLikesById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err) {
        return next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      return next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
};
