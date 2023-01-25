const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

cardsRouter.get('/', auth, getCards);
cardsRouter.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(w{3}\.)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }),
}), createCard);
cardsRouter.delete('/:cardId', auth, celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), deleteCardById);
cardsRouter.put('/:cardId/likes', auth, celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), putCardLikesById);
cardsRouter.delete('/:cardId/likes', auth, celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), deleteCardLikesById);

module.exports = cardsRouter;
