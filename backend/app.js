const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth');
require('./passport'); 
require('dotenv').config();
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors());

app.use('/auth', authRoutes);

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
