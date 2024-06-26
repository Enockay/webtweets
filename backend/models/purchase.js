const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  badgeToken: {
    type: String,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
