const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Require passport-local module
const bcrypt = require('bcryptjs');
// Assuming User model is defined in '../models/User'
const User = require('../models/User');

// Configure the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Optional: Customize the field name for username, defaults to 'username'
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialization and Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
    console.log(user)
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
