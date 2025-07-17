// shared/models/Task.js
const mongoose = require("mongoose");

// Mongoose User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
module.exports = mongoose.model("User", UserSchema);
