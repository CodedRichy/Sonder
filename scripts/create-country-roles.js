const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const GUILD_ID = process.argv[2];
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const countries = [
  { name: '🇧🇷 Brazil',       color: 0x009C3B },
  { name: '🇦🇷 Argentina',    color: 0x75AADB },
  { name: '🇵🇹 Portugal',     color: 0x006600 },
  { name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England',      color: 0xCF081F },
  { name: '🇩🇪 Germany',      color: 0x000000 },
  { name: '🇳🇱 Netherlands',  color: 0xFF6600 },
  { name: '🇫🇷 France',       color: 0x002395 },
  { name: '🇧🇪 Belgium',      color: 0xED2939 },
  { name: '🇪🇸 Spain',        color: 0xAA151B },
];

client.once('ready', async () => {
  if (!GUILD_ID) {
    console.log('Available guilds:');
    client.guilds.cache.forEach(g => console.log(`  ${g.id}  ${g.name}`));
    console.log('\nUsage: node scripts/create-country-roles.js <guild-id>');
    client.destroy();
    return;
  }

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error(`Guild ${GUILD_ID} not found`);
    client.destroy();
    return;
  }

  console.log(`Creating roles in: ${guild.name}`);
  for (const country of countries) {
    try {
      const role = await guild.roles.create({
        name: country.name,
        color: country.color,
        mentionable: true,
        reason: 'FIFA World Cup 2026 country roles',
      });
      console.log(`✓ Created: ${role.name}`);
    } catch (err) {
      console.error(`✗ Failed: ${country.name} — ${err.message}`);
    }
  }

  console.log('Done.');
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
