const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('REGISTER BODY:', req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashed });
    await user.save();

    const account = new Account({
      userId: user._id,
      accountNumber: `ACC${Date.now()}`,
      balance: 0
    });
    await account.save();

    return res.json({ message: 'Registration successful. Please login.' });
  } catch (err) {
    console.error('REGISTER ERROR:', err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    return res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;