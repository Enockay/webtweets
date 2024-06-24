const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const session = require('express-session');
require('./passport'); 
require('dotenv').config();
const cors = require('cors');
const secret = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';
const userRoutes = require('./routes/users');
const { ensureAuthenticated } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true
}));

// Configure CORS to allow requests from multiple origins and allow credentials
const allowedOrigins = ['https://webtweets.vercel.app', 'http://localhost:5173', 'http://localhost:5174'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This allows the browser to include credentials in the requests
  methods: 'GET,HEAD,OPTIONS,POST,PUT',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/api', ensureAuthenticated, userRoutes);

const uri = process.env.MONGODB_URI || 'mongodb+srv://myAtlasDBUser:Enockay23@bmgpfws.bfx6ekr.mongodb.net/Webtweets?retryWrites=true&w=majority';
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
