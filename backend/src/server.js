require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/database');
const { startSyncScheduler } = require('./services/syncService');
const logger = require('./utils/logger');

const PORT = parseInt(process.env.PORT) || 3000;

const startServer = async () => {
  // Test database connection
  try {
    await pool.query('SELECT NOW()');
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', { error: error.message });
    process.exit(1);
  }

  // Start background scheduler
  if (process.env.NODE_ENV !== 'test') {
    startSyncScheduler();
  }

  const server = app.listen(PORT, () => {
    logger.info(`StudyVerse API server running on port ${PORT}`, {
      port: PORT,
      environment: process.env.NODE_ENV,
      pid: process.pid,
    });
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await pool.end();
        logger.info('Database pool closed');
      } catch (error) {
        logger.error('Error closing database pool', { error: error.message });
      }

      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  return server;
};

startServer();
