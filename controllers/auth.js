const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { UserModel } = require('../models/user');
const { isValidEmail, isValidPassword } = require('../utils');

const { JWT_SECRET } = process.env;

const logInUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }
  if (!password) {
    res.status(400).json({ error: 'Password is required.' });
    return;
  }

  UserModel.findOne({ email }, (errFindingUser, foundUser) => {
    if (errFindingUser) {
      console.error(errFindingUser);
      res.status(500).json({ error: 'There was an error checking for user.' });
      return;
    }

    if (!foundUser) {
      res.status(404).json({ error: 'There was no user with that email found.' });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      foundUser.password,
    );

    if (!passwordIsValid) {
      res.status(401).send({
        accessToken: null,
        message: 'Invalid Password',
      });
      return;
    }

    const token = jwt.sign({ id: foundUser._id }, JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).json({
      id: foundUser._id,
      email: foundUser.email,
      accessToken: token,
    });
  });
};

module.exports = { logInUser };
