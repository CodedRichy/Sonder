const snipe = require('../database/snipe');
const store = require('../database/store');
const { response } = require('../utils/embed');
const { colors } = require('../utils/constants');

module.exports = {
  name: 'messageUpdate',
  execute(oldMessage, newMessage) {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    snipe.addEdited(oldMessage.channel.id, oldMessage, newMessage);

    const logCh = store.getConfig(oldMessage.guild.id, 'log_channel');
    if (!logCh || (store.getConfig(oldMessage.guild.id, 'log_message_edit') === false)) return;
    const ch = oldMessage.guild.channels.cache.get(logCh);
    if (!ch) return;

    const embed = response({ client: oldMessage.client, description: `**Message edited in** ${oldMessage.channel} [Jump](${newMessage.url})\n**Author** ${oldMessage.author.tag}\n\n**Before**\n${oldMessage.content?.slice(0, 500) || '*empty*'}\n\n**After**\n${newMessage.content?.slice(0, 500) || '*empty*'}`, color: colors.warning })
      .setFooter({ text: `ID: ${oldMessage.id}` })
      .setTimestamp();
    ch.send({ embeds: [embed] }).catch(() => {});
  },
};
