const bcrypt = require('bcrypt');

const { UserModel } = require('../models');

const createUser = (req, res) => {
  // TODO: Add Validation
  const {
    name, email, password, permission,
  } = req.body;

  // TODO: Check for existing user first

  bcrypt.hash(password, 10, (bcryptErr, hashedPassword) => {
    if (bcryptErr) {
      console.error(bcryptErr);
      res.json({ message: 'Error creating new user.' });
    } else {
      // TODO: Hash and salt password
      const newUser = new UserModel({
        name, email, password: hashedPassword, permission,
      });

      newUser.save((err) => {
        if (err) {
          console.error(err);
          res.json({ message: 'Error creating new user.' });
        } else {
          res.json({ message: 'User successfully created.' });
        }
      });
    }
  });
};

const getAllUsers = (req, res) => {
  // TODO: Add filtering by params
  const userQuery = {};
  const { name, email, permission } = req.query;
  if (name) { userQuery.name = name; }
  if (email) { userQuery.email = email; }
  if (permission) { userQuery.permission = permission; }

  // TODO: Filter passwords, IDs, etc. from response
  UserModel.find(userQuery, '-__v -password', (err, users) => {
    if (err) {
      console.error(err);
      res.json({ message: 'Error searching for users.' });
    } else {
      res.json({ users });
    }
  });
};

const updateUser = (req, res) => {
  // TODO: If updating email, check for existing user with email first
  // TODO: If updating email, include new email
  // TODO: Add Validation
  const {
    name, email, password, permission,
  } = req.body;

  UserModel.findOneAndUpdate(
    { email },
    { name, password, permission },
    (err) => {
      if (err) {
        console.error(err);
        res.json({ message: 'Error updating user.' });
      } else {
        res.json({ message: 'User successfully updated.' });
      }
    },
  );
};

const deleteUser = (req, res) => {
  // TODO: Add Validation
  const { email } = req.body;
  UserModel.findOneAndDelete({ email }, (err) => {
    if (err) {
      console.error(err);
      res.json({ message: 'Error deleting user.' });
    } else {
      res.json({ message: 'User successfully deleted.' });
    }
  });
};

module.exports = {
  createUser, getAllUsers, updateUser, deleteUser,
};
