const express = require('express');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// ✅ AUTH MIDDLEWARE (same as before)
const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// ✅ FULL CRUD FOR ACCOUNTS
router.get('/accounts', auth, async (req, res) => {
  // READ - Get all user accounts
  const accounts = await Account.find({ userId: req.userId });
  res.json(accounts);
});

router.post('/accounts', auth, async (req, res) => {
  // CREATE - New account
  const account = new Account({
    userId: req.userId,
    accountNumber: `ACC${Date.now()}`,
    balance: 0
  });
  await account.save();
  res.json({ message: 'Account created', accountId: account._id });
});

router.put('/accounts/:id', auth, async (req, res) => {
  // UPDATE - Update account balance
  const { balance } = req.body;
  const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
  if (!account) return res.status(404).json({ error: 'Account not found' });
  
  account.balance = balance;
  await account.save();
  res.json({ message: 'Account updated', balance: account.balance });
});

router.delete('/accounts/:id', auth, async (req, res) => {
  // DELETE - Delete account
  const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
  if (!account) return res.status(404).json({ error: 'Account not found' });
  
  await Account.deleteOne({ _id: req.params.id });
  res.json({ message: 'Account deleted' });
});

// ✅ DEPOSIT (UPDATE + CREATE transaction)
router.post('/deposit', auth, async (req, res) => {
  const { accountId, amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const account = await Account.findOne({ _id: accountId, userId: req.userId });
  if (!account) return res.status(404).json({ error: 'Account not found' });

  account.balance += amount;
  await account.save();

  await new Transaction({
    userId: req.userId,
    accountId: account._id,
    type: 'deposit',
    amount
  }).save();

  res.json({ message: 'Deposit successful', balance: account.balance });
});

// ✅ WITHDRAW (UPDATE + CREATE transaction)
router.post('/withdraw', auth, async (req, res) => {
  const { accountId, amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const account = await Account.findOne({ _id: accountId, userId: req.userId });
  if (!account) return res.status(404).json({ error: 'Account not found' });

  if (account.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  account.balance -= amount;
  await account.save();

  await new Transaction({
    userId: req.userId,
    accountId: account._id,
    type: 'withdraw',
    amount
  }).save();

  res.json({ message: 'Withdraw successful', balance: account.balance });
});

// ✅ READ Transactions
router.get('/history/:accountId', auth, async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.accountId,
    userId: req.userId
  });
  if (!account) return res.status(404).json({ error: 'Account not found' });

  const txns = await Transaction.find({ accountId: account._id }).sort({ createdAt: -1 });
  res.json(txns);
});

module.exports = router;
