const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  twitterId: {
    type: String,
    unique: true,
    sparse: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  profileImageUrl: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  hashtags: [
    {
      type: String
    }
  ],
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isLive: {
    type: Boolean,
    default: false
  },
  tiktok: {
    username: String,
    followers: Number,
    likes: Number,
    profileImageUrl: String
  },
  instagram: {
    username: String,
    followers: Number,
    likes: Number,
    profileImageUrl: String
  },
  twitter: {
    username: String,
    followers: Number,
    likes: Number,
    profileImageUrl: String
  }
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
