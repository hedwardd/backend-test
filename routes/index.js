const express = require('express');

const {
  createUser, getAllUsers, updateUser, deleteUser,
} = require('../controllers/users');

const usersRouter = express.Router();
usersRouter.get('/:_id?', getAllUsers);
usersRouter.post('/', createUser);
usersRouter.patch('/:_id?', updateUser);
usersRouter.delete('/:_id?', deleteUser);

const baseRouter = express.Router();

baseRouter.use('/users', usersRouter);

module.exports = baseRouter;
