const store = require('../database/store');
const { response } = require('../utils/embed');
const { colors } = require('../utils/constants');
const { generateCard } = require('../utils/welcomeCard');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const { guild } = member;

    const channelId = store.getConfig(guild.id, 'goodbye_channel');
    const message = store.getConfig(guild.id, 'goodbye_message');
    if (!channelId || !message) return;

    const channel = guild.channels.cache.get(channelId);
    if (!channel) return;

    const formatted = message
      .replace(/{user}/gi, member.user.tag)
      .replace(/{user\.tag}/gi, member.user.tag)
      .replace(/{server}/gi, guild.name)
      .replace(/{membercount}/gi, guild.memberCount.toString());

    const embed = response({ client: member.client, description: formatted, color: colors.muted })
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }));

    const useCard = store.getConfig(guild.id, 'goodbye_card');
    if (useCard) {
      const card = await generateCard(member, 'goodbye').catch(() => null);
      await channel.send({ embeds: [embed], files: card ? [card] : [] }).catch(() => {});
    } else {
      await channel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
