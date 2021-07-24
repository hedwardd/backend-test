const mongoose = require('mongoose');

const { Schema } = mongoose;

const PERMISSION_TYPES = [
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
  permission: {
    type: String,
    enum: PERMISSION_TYPES,
    required: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
