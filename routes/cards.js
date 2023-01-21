const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCardById, putCardLikesById, deleteCardLikesById,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

cardsRouter.get('/cards', auth, getCards);
cardsRouter.post('/cards', auth, createCard);
cardsRouter.delete('/cards/:cardId', auth, deleteCardById);
cardsRouter.put('/cards/:cardId/likes', auth, putCardLikesById);
cardsRouter.delete('/cards/:cardId/likes', auth, deleteCardLikesById);

module.exports = cardsRouter;
