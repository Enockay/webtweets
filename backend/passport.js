const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
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
  callbackURL: process.env.TWITTER_CALLBACK_URL || "https://webtweets.fly.dev/auth/twitter/callback"
},
async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ twitterId: profile.id });
    if (!user) {
      user = new User({
        twitterId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        profileImageUrl: profile.photos[0]?.value
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialization and Deserialization of User
passport.serializeUser((user, done) => {
  try{
    console.log(user);
    done(null, user.id);
  }catch(error){
    console.log(error)
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log(user)
    done(null, user);
    console.log("done")
  } catch (err) {
    console.log(err)
    done(err, null);
  }
});

module.exports = passport;
