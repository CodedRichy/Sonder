const { ShardingManager } = require('discord.js');
const path = require('path');
require('dotenv').config();

const manager = new ShardingManager(path.join(__dirname, 'src', 'index.js'), {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
});

manager.on('shardCreate', (shard) => {
  console.log(`[Shard ${shard.id}] Launched`);
  shard.on('death', () => console.log(`[Shard ${shard.id}] Died, restarting...`));
  shard.on('error', (err) => console.error(`[Shard ${shard.id}] Error:`, err.message));
});

manager.spawn().catch(console.error);
