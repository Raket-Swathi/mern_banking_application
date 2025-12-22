const express = require('express');
console.log("✅ bank.js loaded");

const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

const router = express.Router();

// TEST ROUTE
router.get('/test', (req, res) => {
  res.send("BANK ROUTE WORKING");
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

// ✅ GET ALL ACCOUNTS (THIS WAS MISSING / MISPLACED)
router.get('/accounts', async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
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

// TRANSFER
router.post('/transfer', async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  const fromAccount = await Account.findById(fromAccountId);
  const toAccount = await Account.findById(toAccountId);

  if (!fromAccount || !toAccount)
    return res.send("Account not found");

  if (fromAccount.balance < amount)
    return res.send("Insufficient balance");

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  await fromAccount.save();
  await toAccount.save();

  await new Transaction({
    accountId: fromAccount._id,
    type: "transfer-out",
    amount
  }).save();

  await new Transaction({
    accountId: toAccount._id,
    type: "transfer-in",
    amount
  }).save();

  res.send("Transfer successful");
});

// TRANSACTION HISTORY
router.get('/history/:accountId', async (req, res) => {
  const transactions = await Transaction.find({
    accountId: req.params.accountId
  }).sort({ time: -1 });

  res.json(transactions);
});

// ✅ EXPORT MUST BE LAST
module.exports = router;
