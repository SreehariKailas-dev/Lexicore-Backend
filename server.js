/**
 * LexiCore AI – Project Review Tool
 * Version: 1.2.0
 * Release Date: 21-Aug-2025
 * Description: Main backend entry point for LexiCore AI – serves APIs for frontend (hosted separately).
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUploadRoute = require('./routes/fileUploadRoute');
const reviewRoute = require('./routes/reviewRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/upload', fileUploadRoute);
app.use('/api/review', reviewRoute);

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

