require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
const paymentRouter = require('./routes/payments');
app.use('/api/payments', paymentRouter);

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Health check
app.get('/', (req, res) => {
  res.send('ECX Store API is running');
});

// Error middleware MUST come after routes
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
  });
  
  server.on('error', (err) => {
    console.error('Server failed to start:', err.message);
    process.exit(1);
  });