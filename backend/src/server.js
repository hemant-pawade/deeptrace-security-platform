const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`===================================================`);
  console.log(` DEEP TRACE CYBERNETICS — SECURITY MANAGEMENT API `);
  console.log(` Running in [${config.nodeEnv}] mode on port ${config.port} `);
  console.log(` Health check: http://localhost:${config.port}/health `);
  console.log(`===================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
