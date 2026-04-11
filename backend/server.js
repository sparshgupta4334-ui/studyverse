'use strict';

require('dotenv').config();

const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const { initFirebase } = require('./src/config/firebase');
const { connectRedis } = require('./src/config/redis');
const logger = require('./src/utils/logger');

// ── DB schema bootstrap ───────────────────────────────────────────────────────
const User        = require('./src/models/User');
const Customer    = require('./src/models/Customer');
const Transaction = require('./src/models/Transaction');
const Payment     = require('./src/models/Payment');
const Reminder    = require('./src/models/Reminder');

const PORT = parseInt(process.env.PORT || '3000', 10);

const bootstrap = async () => {
  // 1. Verify DB connectivity
  await testConnection();

  // 2. Run table migrations (idempotent CREATE TABLE IF NOT EXISTS)
  logger.info('Running database migrations...');
  await User.createTable();
  await Customer.createTable();
  await Transaction.createTable();
  await Payment.createTable();
  await Reminder.createTable();
  logger.info('Database migrations complete');

  // 3. Firebase Admin SDK
  initFirebase();

  // 4. Redis (optional)
  const redisClient = connectRedis();
  if (redisClient) {
    try {
      await redisClient.connect();
    } catch {
      logger.warn('Redis connect failed – continuing without cache');
    }
  }
};

const startServer = async () => {
  try {
    await bootstrap();

    const server = app.listen(PORT, () => {
      logger.info(`Khata API server running`, {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        pid: process.pid,
      });
    });

    // ── Graceful shutdown ─────────────────────────────────────────────────────
    const shutdown = (signal) => {
      logger.info(`Received ${signal} – shutting down gracefully`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force exit after 10s if connections are still open
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled promise rejection', { reason: String(reason) });
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught exception', { message: err.message, stack: err.stack });
      process.exit(1);
    });

    return server;
  } catch (err) {
    logger.error('Failed to start server', { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

startServer();
