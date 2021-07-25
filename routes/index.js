const express = require('express');

const {
  createUser, getAllUsers, updateUser, deleteUser,
} = require('../controllers/users');

const usersRouter = express.Router();
usersRouter.get('/:id?', getAllUsers);
usersRouter.post('/:id?', createUser);
usersRouter.patch('/:id?', updateUser);
usersRouter.delete('/:id?', deleteUser);

const baseRouter = express.Router();

baseRouter.use('/users', usersRouter);

module.exports = baseRouter;
