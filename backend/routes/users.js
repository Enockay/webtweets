const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const { ensureAuthenticated } = require('../middleware/auth');

// Fetch user data
router.get('/user', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch live users
router.get('/live-users', ensureAuthenticated, async (req, res) => {
  try {
    const liveUsers = await User.find({ isLive: true }).select('username profileImageUrl');
    res.json(liveUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch past tweets
router.get('/past-tweets', ensureAuthenticated, async (req, res) => {
  try {
    const pastTweets = await Tweet.find({}).sort({ createdAt: -1 });
    res.json(pastTweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Suggest a tweet
router.post('/tweets/suggest', ensureAuthenticated, async (req, res) => {
  try {
    const { tweet } = req.body;
    const newTweet = new Tweet({
      content: tweet,
      suggestedBy: req.user.id
    });
    await newTweet.save();
    res.status(201).json(newTweet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
