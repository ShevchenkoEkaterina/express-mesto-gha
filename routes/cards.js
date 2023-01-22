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
    link: Joi.string().required(),
    owner: Joi.required(),
  }),
}), createCard);
cardsRouter.delete('/:cardId', auth, deleteCardById);
cardsRouter.put('/:cardId/likes', auth, putCardLikesById);
cardsRouter.delete('/:cardId/likes', auth, deleteCardLikesById);

module.exports = cardsRouter;
