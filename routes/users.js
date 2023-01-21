const usersRouter = require('express').Router();
const {
  getUsers, getUserById, updateInformationUser, updateAvatarUser, getOwner,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRouter.get('/users', auth, getUsers);
usersRouter.get('/users/:userId', auth, getUserById);
usersRouter.get('/users/me', auth, getOwner);
usersRouter.patch('/users/me', auth, updateInformationUser);
usersRouter.patch('/users/me/avatar', auth, updateAvatarUser);

module.exports = usersRouter;
