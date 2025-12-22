const express = require('express');
const User = require('../models/User');

const router = express.Router();

// TEST ROUTE
router.get('/test', (req, res) => {
  res.send("Auth route working");
});

// REGISTER
router.post('/register', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  await user.save();
  res.send("User registered successfully");
});

// LOGIN
router.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password
  });

  if (user) {
    res.send("Login successful");
  } else {
    res.send("Invalid username or password");
  }
});

module.exports = router;
