const bcrypt = require('bcrypt');

const { UserModel } = require('../models');

const createUser = (req, res) => {
  // TODO: Add Validation
  const {
    name, email, password, permission,
  } = req.body;

  bcrypt.hash(password, 10, (bcryptErr, hashedPassword) => {
    if (bcryptErr) {
      console.error(bcryptErr);

      res.json({ message: 'Error creating new user.' });
    } else {
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
  // TODO: Add pagination
  const userQuery = {};
  const { name, email, permission } = req.query;
  if (name) { userQuery.name = name; }
  if (email) { userQuery.email = email; }
  if (permission) { userQuery.permission = permission; }

  UserModel.find(userQuery, '-__v -password -_id', (err, users) => {
    if (err) {
      console.error(err);
      res.json({ message: 'Error searching for users.' });
    } else {
      res.json({ users });
    }
  });
};

const updateUser = (req, res) => {
  // TODO: Add Validation
  const {
    name, email, password, permission, updatedEmail,
  } = req.body;

  const userUpdates = {};
  if (name) { userUpdates.name = name; }
  if (email) { userUpdates.email = email; }
  if (password) { userUpdates.password = password; }
  if (permission) { userUpdates.permission = permission; }
  if (updatedEmail) { userUpdates.email = updatedEmail; }

  UserModel.findOneAndUpdate(
    { email },
    userUpdates,
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
  // TODO: Handle no user to delete
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
