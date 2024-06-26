const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  tweetId: { type: String, required: true },
  content: { type: String, required: true },
  amplifiedAt: { type: Date, default: Date.now },
  trends: { type: Number, default: 0 },
  viewers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('AmplifiedTweet', TweetSchema);
