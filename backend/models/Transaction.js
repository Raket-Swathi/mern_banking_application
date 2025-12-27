const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    type: {
      type: String,
      enum: ['deposit', 'withdraw', 'transfer-in', 'transfer-out'],
      required: true
    },
    amount: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
