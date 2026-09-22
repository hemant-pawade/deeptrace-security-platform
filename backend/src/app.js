const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security and parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Liveness / readiness probe
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'DeepTrace-Security-API', timestamp: new Date().toISOString() });
});

// Primary API Router
app.use('/api', routes);

// 404 Fallback Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    errors: {},
  });
});

// Centralized Error Middleware
app.use(errorHandler);

module.exports = app;
