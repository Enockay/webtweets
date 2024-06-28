const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming User model is defined in '../models/User'
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';

// Generate a JWT token

// Twitter routes
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: '10h' });
  res.redirect(`https://webtweets.vercel.app/Dashboard?token=${token}`);
});

// TikTok routes
router.get('/tiktok', passport.authenticate('tiktok'));

router.get('/tiktok/callback', passport.authenticate('tiktok', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: '10h' });
  res.redirect(`https://webtweets.vercel.app/Dashboard?token=${token}`);
});

// Instagram routes
router.get('/instagram', passport.authenticate('instagram'));

router.get('/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: '10h' });
  res.redirect(`https://webtweets.vercel.app/Dashboard?token=${token}`);
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    const user = req.body;
    const query = { username: user.username };

    const logoutUser = await User.findOneAndUpdate(query, { isLive: false }, { new: true });

    if (!logoutUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Internal server error in logging out users:', error);
    res.status(500).json({ success: false, message: 'Internal server error in logging out users' });
  }
});

// Login route
router.post('/login', passport.authenticate('local'), async (req, res) => {
  try {
    const token = jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: '10h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    const token = jwt.sign({ user: newUser }, JWT_SECRET, { expiresIn: '10h' });
    res.status(201).json({ message: 'Signup successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
