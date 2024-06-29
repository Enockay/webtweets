const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('./passport'); // Ensure this path is correct
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const badge = require("./routes/Badge");
const app = express();
const schedule = require("./routes/shedulePost");
const secret = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';
const allowedOrigins = ['https://webtweets.vercel.app', 'http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,POST,PUT',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set secure to true in production
}));

app.use(passport.initialize());
app.use(passport.session()); // Initialize passport session

app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/api',  usersRouter);
app.use('/auth', authRoutes);
app.use('/badges', badge);
app.use("/schedules",schedule)

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('successful connection to webtweets Db'))
  .catch(err => console.error('MongoDB connection error:', err));


module.exports = app;
