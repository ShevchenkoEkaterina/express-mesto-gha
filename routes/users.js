const usersRouter = require('express').Router();
const {
  getUsers, getUserById, updateInformationUser, updateAvatarUser, getOwner,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRouter.get('/', auth, getUsers);
usersRouter.get('/me', auth, getOwner);
usersRouter.get('/:userId', auth, getUserById);
usersRouter.patch('/me', auth, updateInformationUser);
usersRouter.patch('/me/avatar', auth, updateAvatarUser);

module.exports = usersRouter;
