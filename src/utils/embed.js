const { EmbedBuilder } = require('discord.js');
const { colors } = require('./constants');

function brand(client) {
  return {
    text: 'sonder',
    iconURL: client?.user?.displayAvatarURL?.() || undefined,
  };
}

function base(client, color) {
  return new EmbedBuilder()
    .setColor(color || colors.primary)
    .setFooter(brand(client))
    .setTimestamp();
}

function modAction({ client, action, color, target, moderator, reason, duration, extra }) {
  const embed = base(client, color)
    .setAuthor({
      name: action.toUpperCase(),
      iconURL: target.displayAvatarURL?.(),
    })
    .setThumbnail(target.displayAvatarURL?.({ size: 256 }) || null);

  const lines = [
    `**Member** ${target.tag || target.user?.tag} \`${target.id}\``,
    `**Moderator** ${moderator.tag} \`${moderator.id}\``,
    `**Reason** ${reason || 'No reason provided'}`,
  ];

  if (duration) lines.push(`**Duration** ${duration}`);
  if (extra) lines.push(`**Details** ${extra}`);

  embed.setDescription(lines.join('\n'));
  return embed;
}

function dmNotice({ guild, action, reason, color, duration }) {
  const lines = [`You have been **${action}** in **${guild.name}**`];
  if (duration) lines.push(`**Duration** ${duration}`);
  lines.push(`**Reason** ${reason || 'No reason provided'}`);

  return new EmbedBuilder()
    .setColor(color)
    .setDescription(lines.join('\n'))
    .setFooter(brand(guild.client))
    .setTimestamp();
}

function response({ client, description, color }) {
  return base(client, color || colors.primary).setDescription(description);
}

module.exports = { base, modAction, dmNotice, response, brand };
