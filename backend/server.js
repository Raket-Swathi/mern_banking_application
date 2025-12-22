const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bankRoutes = require('./routes/bank');

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use('/auth', authRoutes);
app.use('/bank', bankRoutes);

// DB CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/banking')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
