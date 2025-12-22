const express = require('express');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

const router = express.Router();

// TEST
router.get('/test', (req, res) => {
  res.send("BANK ROUTE WORKING");
});

// GET ALL ACCOUNTS  ✅ ADD THIS
router.get('/accounts', async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

// CREATE ACCOUNT
router.post('/create', async (req, res) => {
  const account = new Account({
    name: req.body.name,
    balance: req.body.balance
  });
  await account.save();
  res.send("Account created successfully");
});

// DEPOSIT
router.post('/deposit', async (req, res) => {
  const account = await Account.findById(req.body.accountId);
  if (!account) return res.send("Account not found");

  account.balance += req.body.amount;
  await account.save();

  await new Transaction({
    accountId: account._id,
    type: "deposit",
    amount: req.body.amount
  }).save();

  res.send("Deposit successful");
});

// WITHDRAW
router.post('/withdraw', async (req, res) => {
  const account = await Account.findById(req.body.accountId);
  if (!account) return res.send("Account not found");

  if (account.balance < req.body.amount)
    return res.send("Insufficient balance");

  account.balance -= req.body.amount;
  await account.save();

  await new Transaction({
    accountId: account._id,
    type: "withdraw",
    amount: req.body.amount
  }).save();

  res.send("Withdraw successful");
});

// TRANSACTION HISTORY
router.get('/history/:accountId', async (req, res) => {
  const transactions = await Transaction.find({
    accountId: req.params.accountId
  }).sort({ time: -1 });

  res.json(transactions);
});

module.exports = router;
