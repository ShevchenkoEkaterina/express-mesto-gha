const usersRouter = require('express').Router();
const { getUsers, createUser } = require('../controllers/users');

usersRouter.get('/users', getUsers)
// usersRouter.get('/users/:userId', getUserById)
usersRouter.post('/users', createUser)
// usersRouter.patch('/users/me', updateInformationUser)
// usersRouter.patch('/users/me/avatar', updateAvatarUser)

module.exports = usersRouter;