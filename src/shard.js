const { ShardingManager } = require('discord.js');
const path = require('path');
const config = require('./config');
const log = require('./utils/logger');

const manager = new ShardingManager(path.join(__dirname, 'index.js'), {
  token: config.discord.token,
  totalShards: 'auto',
});

manager.on('shardCreate', (shard) => {
  log.info(`Shard ${shard.id} launched`);
  shard.on('death', () => log.warn(`Shard ${shard.id} died`));
  shard.on('reconnecting', () => log.info(`Shard ${shard.id} reconnecting`));
});

manager.spawn().catch((err) => {
  log.error('Shard manager failed:', err.message);
  process.exit(1);
});
