const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  platform: { type: String, required: true },
  scheduleTime: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  analytics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('Post', postSchema);
