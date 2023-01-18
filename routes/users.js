const usersRouter = require('express').Router();
const { getUsers, getUserById, createUser, updateInformationUser, updateAvatarUser } = require('../controllers/users.js');

usersRouter.get('/users', getUsers)
usersRouter.get('/users/:userId', getUserById)
usersRouter.post('/users', createUser)
usersRouter.patch('/users/me', updateInformationUser)
usersRouter.patch('/users/me/avatar', updateAvatarUser)

module.exports = usersRouter;