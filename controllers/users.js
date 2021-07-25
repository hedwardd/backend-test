const bcrypt = require('bcrypt');

const { UserModel } = require('../models/user');
const { isValidEmail, isValidPassword } = require('../utils');

const createUser = (req, res) => {
  // TODO: Add Validation

  const {
    name, email, password, role,
  } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ error: 'Missing required user information.' });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }
  if (!isValidPassword(password)) {
    res.status(400).json({ error: 'Password must be minimum eight characters, at least one upper case letter, one lower case letter, one number and one special character.' });
    return;
  }

  bcrypt.hash(password, 10, (bcryptErr, hashedPassword) => {
    if (bcryptErr) {
      console.error(bcryptErr);

      res.json({ message: 'Error creating new user.' });
    } else {
      const newUser = new UserModel({
        name, email, password: hashedPassword, role,
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

// TODO: Add param handler

const getAllUsers = (req, res) => {
  const {
    _id,
  } = req.params;
  const {
    name, email, role, offset, limit,
  } = req.query;

  const userQuery = {};
  if (name) { userQuery.name = name; }
  if (email) { userQuery.email = email; }
  if (role) { userQuery.role = role; }

  // TODO: Add pagination
  const queryOptions = { limit: 100 };
  if (offset) { queryOptions.skip = parseInt(offset, 10); }
  if (limit) { queryOptions.limit = parseInt(limit, 10); }

  UserModel.find(userQuery, '-__v -password', queryOptions, (err, users) => {
    if (err) {
      console.error(err);
      res.json({ message: 'Error searching for users.' });
    } else {
      res.json({ data: users });
    }
  });
};

const updateUser = (req, res) => {
  // TODO: Add Validation
  // TODO: Add param handler
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'User ID required.' });
    return;
  }
  const {
    name, email, password, role,
  } = req.body;

  const userUpdates = {};
  if (name) { userUpdates.name = name; }
  if (email) { userUpdates.email = email; }
  if (password) { userUpdates.password = password; }
  if (role) { userUpdates.role = role; }

  UserModel.findByIdAndUpdate(
    id,
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
  // TODO: Add param handler
  // TODO: Add Validation
  // TODO: Handle no user to delete
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'User ID required.' });
    return;
  }
  UserModel.findByIdAndDelete(id, (err) => {
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
