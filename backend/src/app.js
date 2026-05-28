const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routes/api');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // For development, allow requests from any origin (e.g. localhost:8080)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AURA API is healthy and running.'
  });
});

// API Routes
app.use('/api', apiRouter);

// Serve frontend index.html for any non-API route
app.get('*', (req, res, next) => {
  // If it starts with /api, let it fall through to the 404 handler
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error Details]:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'An internal server error occurred.'
  });
});

module.exports = app;
