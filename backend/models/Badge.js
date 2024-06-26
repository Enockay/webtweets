const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  user: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  token: { type: String, required: true }
});

const Badge = mongoose.model('Badge', badgeSchema);
module.exports = Badge;
