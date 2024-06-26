const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const User = require('../models/User');
const jwt = require("jsonwebtoken");

router.post('/purchase', async (req, res) => {
  const { phoneNumber, duration, description, price, user } = req.body;
  const JWT_SECRET = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg='
  // Generate a JWT token
  const generateToken = jwt.sign({ duration:duration, username:user }, JWT_SECRET, { expiresIn: duration });

  try {
    // Create a new Badge object
    const badge = new Badge({
      user,
      name: duration,
      duration,
      description,
      price,
      token: generateToken 
    });

    // Save the badge first
    await badge.save();
   
    // Find the user by username
    const newUser = await User.findOne({ username: user });
    if (!newUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the badge ID to the user's badges array
    newUser.badges.push(badge._id);

    // Save the user
    await newUser.save();

    res.status(200).json({success:true, message: 'Badge purchased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/get', async (req, res) => {
  const { user , badgeIds } = req.body;
 
  try {
    const badges = await Badge.find({user});
    res.status(200).json(badges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
