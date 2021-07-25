const bcrypt = require('bcrypt');

const { UserModel } = require('../models/user');
const { isValidEmail, isValidPassword } = require('../utils');

const createUser = async (req, res) => {
  // TODO: Add Validation

  const {
    name, email, password, role,
  } = req.body;

  if (!(name && email && password && role)) {
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

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    name, email, password: hashedPassword, role,
  });

  newUser.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating new user.' });
    } else {
      res.json({ message: 'User successfully created.' });
    }
  });
};

const getAllUsers = (req, res) => {
  const {
    name, email, role, offset, limit,
  } = req.query;

  const userQuery = {};
  if (name) { userQuery.name = name; }
  if (email) { userQuery.email = email; }
  if (role) { userQuery.role = role; }

  const queryOptions = { limit: 100 };
  if (offset) {
    queryOptions.skip = parseInt(offset, 10);
    if (Number.isNaN(queryOptions.skip)) {
      res.status(400).json({ error: 'Invalid offset.' });
      return;
    }
  }
  if (limit) {
    queryOptions.limit = parseInt(limit, 10);
    if (Number.isNaN(queryOptions.limit)) {
      res.status(400).json({ error: 'Invalid limit.' });
      return;
    }
  }

  UserModel.find(userQuery, '-__v -password', queryOptions, (err, users) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error searching for users.' });
    } else {
      res.json({ data: users });
    }
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, password, role,
  } = req.body;

  if (!id) {
    res.status(400).json({ error: 'User ID required.' });
    return;
  }
  if (!(name || email || password || role)) {
    res.status(400).json({ error: 'No field to update.' });
    return;
  }
  if (email && !isValidEmail(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }
  if (password && !isValidPassword(password)) {
    res.status(400).json({ error: 'Password must be minimum eight characters, at least one upper case letter, one lower case letter, one number and one special character.' });
    return;
  }

  const userUpdates = {};
  if (name) { userUpdates.name = name; }
  if (email) { userUpdates.email = email; }
  if (role) { userUpdates.role = role; }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    userUpdates.password = hashedPassword;
  }

  UserModel.findByIdAndUpdate(
    id,
    userUpdates,
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user.' });
      } else {
        res.json({ message: 'User successfully updated.' });
      }
    },
  );
};

const deleteUser = (req, res) => {
  // TODO: Handle no user to delete
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'User ID required.' });
    return;
  }
  UserModel.findByIdAndDelete(id, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting user.' });
    } else {
      res.json({ message: 'User successfully deleted.' });
    }
  });
};

module.exports = {
  createUser, getAllUsers, updateUser, deleteUser,
};
