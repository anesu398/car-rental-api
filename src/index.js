const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.get('/', (req, res) => {
  res.send('Car Rental API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
