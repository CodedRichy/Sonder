const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
require('dotenv').config();

const GUILD_ID = '1514219106818326618';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const ROLE_IDS = {
  everyone:     '1514219106818326618',
  firstTeam:    '1514232705615921262',
  muted:        '1514303070383640578',
  manager:      '1514230478272729178',
  asstManager:  '1514232313020682330',
  kitMan:       '1514232541400530965',
  bots:         '1514237664176635924',
};

const CATEGORY_IDS = {
  info:      '1514219107875295332',
  football:  '1514226235780235416',
  matchday:  '1514227202911240264',
  fun:       '1514228112777281558',
  voice:     '1514228475832303716',
  staff:     '1514229327997440111',
};

const COUNTRY_ROLES = [
  { id: '1514295276540657694', color: 0x009C3B }, // Brazil
  { id: '1514295282278338770', color: 0x75AADB }, // Argentina
  { id: '1514295285608616036', color: 0x006600 }, // Portugal
  { id: '1514295288271995062', color: 0xCF081F }, // England
  { id: '1514295291266994287', color: 0xDD0000 }, // Germany (was 0x000000, Discord clamps black)
  { id: '1514295293720395980', color: 0xFF6600 }, // Netherlands
  { id: '1514295297034027109', color: 0x002395 }, // France
  { id: '1514295300804710470', color: 0xED2939 }, // Belgium
  { id: '1514295303367295016', color: 0xAA151B }, // Spain
];

client.once('ready', async () => {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) { console.error('Guild not found'); client.destroy(); return; }
  console.log(`Working on: ${guild.name}\n`);

  // 1. Fix country role colors
  console.log('--- Fixing country role colors ---');
  for (const cr of COUNTRY_ROLES) {
    try {
      const role = guild.roles.cache.get(cr.id);
      await role.setColor(cr.color, 'Fix clamped colors');
      console.log(`✓ ${role.name} → #${cr.color.toString(16).padStart(6, '0')}`);
    } catch (e) { console.error(`✗ ${cr.id}: ${e.message}`); }
  }

  // 2. Move muted role above country roles (position 12, above bots)
  console.log('\n--- Moving muted role ---');
  try {
    const muted = guild.roles.cache.get(ROLE_IDS.muted);
    await muted.setPosition(12, { reason: 'Move above country roles' });
    console.log(`✓ muted moved to position ~12`);
  } catch (e) { console.error(`✗ muted move: ${e.message}`); }

  // 3. Create #verify channel in info category
  console.log('\n--- Creating #verify channel ---');
  let verifyChannel;
  try {
    const existing = guild.channels.cache.find(c => c.name === 'verify' && c.parentId === CATEGORY_IDS.info);
    if (existing) {
      verifyChannel = existing;
      console.log('✓ #verify already exists');
    } else {
      verifyChannel = await guild.channels.create({
        name: 'verify',
        type: ChannelType.GuildText,
        parent: CATEGORY_IDS.info,
        permissionOverwrites: [
          { id: ROLE_IDS.everyone, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
          { id: ROLE_IDS.firstTeam, deny: [PermissionFlagsBits.ViewChannel] },
          { id: ROLE_IDS.muted, deny: [PermissionFlagsBits.SendMessages] },
        ],
        reason: 'Verification channel',
      });
      console.log(`✓ Created #verify (${verifyChannel.id})`);
    }
  } catch (e) { console.error(`✗ verify channel: ${e.message}`); }

  // 4. Lock categories — @everyone denied, First Team granted
  console.log('\n--- Locking categories ---');
  const lockedCats = ['football', 'matchday', 'fun', 'voice'];
  for (const catName of lockedCats) {
    try {
      const cat = guild.channels.cache.get(CATEGORY_IDS[catName]);
      await cat.permissionOverwrites.set([
        { id: ROLE_IDS.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: ROLE_IDS.firstTeam, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] },
        { id: ROLE_IDS.muted, deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Speak, PermissionFlagsBits.AddReactions] },
      ], { reason: 'Permission lockdown' });
      console.log(`✓ Locked ${cat.name}`);
    } catch (e) { console.error(`✗ ${catName}: ${e.message}`); }
  }

  // 5. Staff-only category
  console.log('\n--- Staff-only category ---');
  try {
    const staff = guild.channels.cache.get(CATEGORY_IDS.staff);
    await staff.permissionOverwrites.set([
      { id: ROLE_IDS.everyone, deny: [PermissionFlagsBits.ViewChannel] },
      { id: ROLE_IDS.manager, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages] },
      { id: ROLE_IDS.asstManager, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages] },
      { id: ROLE_IDS.kitMan, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      { id: ROLE_IDS.bots, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
    ], { reason: 'Staff-only lockdown' });
    console.log(`✓ Locked staff category`);
  } catch (e) { console.error(`✗ staff: ${e.message}`); }

  // 6. Info category — read-only for everyone
  console.log('\n--- Info category (read-only) ---');
  try {
    const info = guild.channels.cache.get(CATEGORY_IDS.info);
    await info.permissionOverwrites.set([
      { id: ROLE_IDS.everyone, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory], deny: [PermissionFlagsBits.SendMessages] },
      { id: ROLE_IDS.muted, deny: [PermissionFlagsBits.SendMessages] },
    ], { reason: 'Info read-only' });
    console.log(`✓ Info set to read-only`);
  } catch (e) { console.error(`✗ info: ${e.message}`); }

  // 7. Sync children with category perms
  console.log('\n--- Syncing child channels ---');
  const allCats = [...lockedCats, 'staff', 'info'];
  for (const catName of allCats) {
    const cat = guild.channels.cache.get(CATEGORY_IDS[catName]);
    const children = guild.channels.cache.filter(c => c.parentId === cat.id && c.id !== verifyChannel?.id);
    for (const [, ch] of children) {
      try {
        await ch.lockPermissions();
        console.log(`  ✓ Synced #${ch.name}`);
      } catch (e) { console.error(`  ✗ #${ch.name}: ${e.message}`); }
    }
  }

  console.log('\n✅ Done.');
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
