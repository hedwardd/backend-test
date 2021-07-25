const express = require('express');

const {
  createUser, getAllUsers, updateUser, deleteUser,
} = require('../controllers/users');
const { logInUser } = require('../controllers/auth');

const usersRouter = express.Router();
usersRouter.get('/:id?', getAllUsers);
usersRouter.post('/:id?', createUser);
usersRouter.patch('/:id?', updateUser);
usersRouter.delete('/:id?', deleteUser);

const authRouter = express.Router();
authRouter.post('/login', logInUser);

const baseRouter = express.Router();

baseRouter.use('/users', usersRouter);
baseRouter.use('/auth', authRouter);

module.exports = baseRouter;
