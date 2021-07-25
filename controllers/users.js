const bcrypt = require('bcrypt');

const { UserModel, ROLE_TYPES } = require('../models/user');
const { isValidEmail, isValidPassword } = require('../utils');

const createUser = (req, res) => {
  const {
    name, email, password, role,
  } = req.body;

  if (!(name && email && password && role)) {
    res.status(400).json({ error: 'Missing required fields.' });
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

  if (!ROLE_TYPES.includes(role)) {
    res.status(400).json({ error: 'Invalid role.' });
    return;
  }

  UserModel.findOne({ email }, async (errFindingUser, foundUser) => {
    if (errFindingUser) {
      console.error(errFindingUser);
      res.status(500).json({ error: 'There was an error checking for existing user.' });
      return;
    }

    if (foundUser) {
      res.status(404).json({ error: 'A user with that email already exists.' });
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
  });
};

const getAllUsers = (req, res) => {
  const {
    name, email, role, offset, limit,
  } = req.query;

  const userQuery = {};

  if (name) { userQuery.name = name; }
  if (email) { userQuery.email = email; }
  if (role) {
    if (!ROLE_TYPES.includes(role)) {
      res.status(400).json({ error: 'Invalid role.' });
      return;
    }
    userQuery.role = role;
  }

  const queryOptions = { limit: 100 }; // Default limit === 100

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

  if (role && !ROLE_TYPES.includes(role)) {
    res.status(400).json({ error: 'Invalid role.' });
    return;
  }

  UserModel.findById(id, async (errFindingUser, foundUser) => {
    if (errFindingUser) {
      console.error(errFindingUser);
      res.status(500).json({ message: 'Error searching for user.' });
      return;
    } if (!foundUser) {
      res.status(404).json({ error: 'No user with that ID found.' });
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
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'User ID required.' });
    return;
  }

  UserModel.findById(id, (errFindingUser, foundUser) => {
    if (errFindingUser) {
      console.error(errFindingUser);
      res.status(500).json({ message: 'Error searching for user.' });
      return;
    } if (!foundUser) {
      res.status(404).json({ error: 'No user with that ID found.' });
      return;
    }

    UserModel.findByIdAndDelete(id, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting user.' });
        return;
      }

      res.json({ message: 'User successfully deleted.' });
    });
  });
};

module.exports = {
  createUser, getAllUsers, updateUser, deleteUser,
};
