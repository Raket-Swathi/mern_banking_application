const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bankRoutes = require('./routes/bank');

const app = express();

app.use(cors());
app.use(express.json());

// test root
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// routes
app.use('/auth', authRoutes);
app.use('/bank', bankRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
