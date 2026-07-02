const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const GUILD_ID = '1514219106818326618';
const BOTS_ROLE = '1514237664176635924';

const LOCKED_CATS = {
  football: '1514226235780235416',
  matchday: '1514227202911240264',
  fun:      '1514228112777281558',
  voice:    '1514228475832303716',
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) { console.error('Guild not found'); client.destroy(); return; }

  for (const [name, id] of Object.entries(LOCKED_CATS)) {
    try {
      const cat = guild.channels.cache.get(id);
      await cat.permissionOverwrites.create(BOTS_ROLE, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      }, { reason: 'Grant bot access to locked categories' });
      console.log(`✓ ${cat.name} — bots can now see/send`);

      const children = guild.channels.cache.filter(c => c.parentId === id);
      for (const [, ch] of children) {
        await ch.lockPermissions();
        console.log(`  ✓ Synced #${ch.name}`);
      }
    } catch (e) { console.error(`✗ ${name}: ${e.message}`); }
  }

  console.log('\n✅ Done.');
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
