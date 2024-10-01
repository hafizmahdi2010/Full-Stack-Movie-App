const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/movieApp");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBlock: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;