const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Local Strategy for email and password login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      user.isLive = true;
      await user.save();
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Twitter Strategy Configuration
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL || "https://webtweets-dawn-forest-2637.fly.dev/auth/twitter/callback"
},
async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ twitterId: profile.id });
    if (!user) {
      // Check for email if available and prompt for linking if necessary
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link Twitter to existing user with the same email
          user.twitterId = profile.id;
          user.twitter = {
            username:profile.username,
            followers: profile._json.followers_count,
            likes: profile._json.favourites_count,
            profileImageUrl:profile.photos[0]?.value,
          };
        } else {
          // Create a new user
          user = new User({
            twitterId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            profileImageUrl: profile.photos[0]?.value,
            email,
            twitter: {
              username:profile.username,
              followers: profile._json.followers_count,
              likes: profile._json.favourites_count,
              profileImageUrl:profile.photos[0]?.value,
            }
          });
        }
      } else {
        // Create a new user without email linking
        user = new User({
          twitterId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          profileImageUrl: profile.photos[0]?.value,
          twitter: {
            username:profile.username,
            followers: profile._json.followers_count,
            likes: profile._json.favourites_count,
            profileImageUrl:profile.photos[0]?.value,
          }
        });
      }
    } else {
      // Update existing user's Twitter details
      user.twitter = {
        username:profile.username,
        followers: profile._json.followers_count,
        likes: profile._json.favourites_count,
        profileImageUrl:profile.photos[0]?.value,
      };
    }
    user.isLive = true;
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// TikTok Strategy Configuration using OAuth2
passport.use('tiktok', new OAuth2Strategy({
  authorizationURL: 'https://open-api.tiktok.com/platform/oauth/connect/',
  tokenURL: 'https://open-api.tiktok.com/oauth/access_token/',
  clientID: process.env.TIKTOK_CLIENT_ID,
  clientSecret: process.env.TIKTOK_CLIENT_SECRET,
  callbackURL: process.env.TIKTOK_CALLBACK_URL || "https://webtweets-dawn-forest-2637.fly.dev/auth/tiktok/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const response = await fetch('https://open-api.tiktok.com/oauth/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();

    let user = await User.findOne({ 'tiktok.username': data.data.display_name });

    if (!user) {
      // Check for email if available and prompt for linking if necessary
      const email = data.data.email;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link TikTok to existing user with the same email
          user.tiktok = {
            username: data.data.display_name,
            followers: data.data.followers_count,
            likes: data.data.total_favorited,
            profileImageUrl: data.data.avatar
          };
        } else {
          // Create a new user
          user = new User({
            username: data.data.display_name,
            displayName: data.data.display_name,
            profileImageUrl: data.data.avatar,
            email,
            tiktok: {
              username: data.data.display_name,
              followers: data.data.followers_count,
              likes: data.data.total_favorited,
              profileImageUrl: data.data.avatar
            }
          });
        }
      } else {
        // Create a new user without email linking
        user = new User({
          username: data.data.display_name,
          displayName: data.data.display_name,
          profileImageUrl: data.data.avatar,
          tiktok: {
            username: data.data.display_name,
            followers: data.data.followers_count,
            likes: data.data.total_favorited,
            profileImageUrl: data.data.avatar
          }
        });
      }
    } else {
      // Update existing user's TikTok details
      user.tiktok = {
        username: data.data.display_name,
        followers: data.data.followers_count,
        likes: data.data.total_favorited,
        profileImageUrl: data.data.avatar
      };
    }
    user.isLive = true;
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

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

// Serialization and Deserialization of User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
