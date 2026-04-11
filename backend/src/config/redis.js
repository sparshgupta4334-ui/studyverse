'use strict';

const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = () => {
  if (process.env.REDIS_ENABLED !== 'true') {
    logger.info('Redis disabled via REDIS_ENABLED flag – skipping connection');
    return null;
  }

  const client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    lazyConnect: true,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 5) {
        logger.error('Redis max reconnection attempts reached');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  });

  client.on('connect', () => logger.info('Redis client connected'));
  client.on('ready', () => logger.info('Redis client ready'));
  client.on('error', (err) => logger.error('Redis error', { error: err.message }));
  client.on('close', () => logger.warn('Redis connection closed'));

  redisClient = client;
  return client;
};

const getRedis = () => redisClient;

/**
 * Safe get/set helpers that fall back gracefully when Redis is unavailable.
 */
const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const cacheSet = async (key, value, ttlSeconds = 300) => {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Cache errors are non-fatal
  }
};

const cacheDel = async (key) => {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch {
    // Cache errors are non-fatal
  }
};

module.exports = { connectRedis, getRedis, cacheGet, cacheSet, cacheDel };
