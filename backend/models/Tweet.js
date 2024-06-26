const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  suggestedBy: {
    type: String,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
