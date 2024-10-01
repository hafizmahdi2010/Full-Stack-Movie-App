const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/movieApp");

const commentsSchema = new mongoose.Schema({
  commentBy: String,
  comment: String,
  username: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// Change here: 'comments' should be an array of commentsSchema
const movieSchema = new mongoose.Schema({
  title: String,
  desc: String,
  img: String,
  video: String,
  comments: [commentsSchema], // An array of comments
  date: {
    type: Date,
    default: Date.now
  }
});

const movieModel = mongoose.model("movie", movieSchema);

module.exports = movieModel;
