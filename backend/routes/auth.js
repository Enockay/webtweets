const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming User model is defined in '../models/User'
const router = express.Router();

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Assuming user details are available in req.user
    const { username, displayName, profileImageUrl } = req.user;
    // Redirect with user details as query params
    res.redirect(`https://webtweets.vercel.app/Dashboard?username=${username}&displayName=${displayName}&profileImageUrl=${profileImageUrl}`);
  }
);
router.post('/logout', async (req, res) => { 
  try {
    const user = req.body; // Assuming user details are sent in the body
    const query = { username: user.username };

    // Correctly updating the isLive field
    const logoutUser = await User.findOneAndUpdate(query, { isLive: false }, { new: true });
    
    if (!logoutUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    //console.log(logoutUser);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Internal server error in logging out users:", error);
    res.status(500).json({ success: false, message: "Internal server error in logging out users" });
  }
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
  try {
    // If authentication is successful, `req.user` contains authenticated user
   
    res.json({ message: 'Login successful', user: req.user });
    
  } catch (err) {
    console.log(err)
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
    res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
