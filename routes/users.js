const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateInformationUser, updateAvatarUser, getOwner,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRouter.get('/', auth, getUsers);
usersRouter.get('/me', auth, getOwner);
usersRouter.get('/:userId', auth, getUserById);
usersRouter.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateInformationUser);
usersRouter.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), updateAvatarUser);

module.exports = usersRouter;
