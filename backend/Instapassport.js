const express = require('express');
const fetch = require('node-fetch');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

passport.use('instagram', new OAuth2Strategy({
  authorizationURL: 'https://api.instagram.com/oauth/authorize',
  tokenURL: 'https://api.instagram.com/oauth/access_token',
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: process.env.INSTAGRAM_CALLBACK_URL || "https://webtweets-dawn-forest-2637.fly.dev/auth/instagram/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const response = await fetch(`https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${accessToken}`);
    const data = await response.json();

    let user = await User.findOne({ 'instagram.username': data.username });

    if (!user) {
      user = new User({
        username: data.username,
        displayName: data.username,
        instagram: {
          username: data.username,
          followers: data.media_count,
          likes: 0,
          profileImageUrl: '' // Placeholder, as Instagram API may not provide profile image directly
        }
      });
    } else {
      user.instagram = {
        username: data.username,
        followers: data.media_count,
        likes: 0,
        profileImageUrl: ''
      };
    }
    user.isLive = true;
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
