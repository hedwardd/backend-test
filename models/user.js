const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // TODO: Make unique
  password: { type: String, required: true },
  role: { type: String, required: true }, // TODO: Review possibility of enum
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
