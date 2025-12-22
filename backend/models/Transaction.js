const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  accountId: String,
  type: String,        // deposit / withdraw
  amount: Number,
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
