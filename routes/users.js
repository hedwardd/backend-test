const express = require('express');

const {
  createUser, getAllUsers, updateUser, deleteUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/all', getAllUsers);
router.post('/register', createUser);
router.put('/update', updateUser);
router.delete('/delete', deleteUser);

module.exports = router;
