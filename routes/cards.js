const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCardById);
cardsRouter.put('/cards/:cardId/likes', putCardLikesById);
cardsRouter.delete('/cards/:cardId/likes', deleteCardLikesById);

module.exports = cardsRouter;
