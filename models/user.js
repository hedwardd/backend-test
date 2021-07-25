const mongoose = require('mongoose');

const { Schema } = mongoose;

const ROLE_TYPES = [
  'UNPRIVILEGED',
  'CREATOR',
  'MODERATOR',
  'ADMIN',
];

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ROLE_TYPES,
    required: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel };
