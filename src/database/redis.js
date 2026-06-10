const Redis = require('ioredis');
const config = require('../config');
const log = require('../utils/logger');

let redis = null;

try {
  redis = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
  });

  redis.on('connect', () => log.info('Redis connected'));
  redis.on('error', (err) => log.warn('Redis unavailable:', err.message));
  redis.connect().catch(() => {});
} catch {
  log.warn('Redis not configured — running without cache');
}

module.exports = redis;
