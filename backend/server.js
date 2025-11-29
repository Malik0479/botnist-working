const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');
// const paymentRoutes = require('./routes/paymentRoutes'); (If you created this)

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);      // <--- NEW AUTH ROUTES
app.use('/api/user', userRoutes);
app.use('/api/scrape', scrapeRoutes);
// app.use('/api/payments', paymentRoutes);

// Health Check
app.get('/', (req, res) => res.json({ message: 'Botnist Backend Online' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});