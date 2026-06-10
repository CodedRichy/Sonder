const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

async function paginate(interaction, pages, { timeout = 120000 } = {}) {
  if (!pages.length) return;
  if (pages.length === 1) {
    const opts = { embeds: [pages[0]] };
    return interaction.deferred || interaction.replied
      ? interaction.editReply(opts)
      : interaction.reply(opts);
  }

  let page = 0;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('page_first').setEmoji('⏮').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('page_prev').setEmoji('◀').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('page_count').setLabel(`1/${pages.length}`).setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId('page_next').setEmoji('▶').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('page_last').setEmoji('⏭').setStyle(ButtonStyle.Secondary),
  );

  const opts = { embeds: [pages[0]], components: [row] };
  const msg = interaction.deferred || interaction.replied
    ? await interaction.editReply(opts)
    : await interaction.reply({ ...opts, fetchReply: true });

  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (i) => i.user.id === (interaction.user || interaction.author).id,
    time: timeout,
  });

  collector.on('collect', async (i) => {
    if (i.customId === 'page_first') page = 0;
    else if (i.customId === 'page_prev') page = page > 0 ? page - 1 : pages.length - 1;
    else if (i.customId === 'page_next') page = page < pages.length - 1 ? page + 1 : 0;
    else if (i.customId === 'page_last') page = pages.length - 1;

    row.components[2].setLabel(`${page + 1}/${pages.length}`);
    await i.update({ embeds: [pages[page]], components: [row] });
  });

  collector.on('end', () => {
    row.components.forEach((b) => b.setDisabled(true));
    msg.edit({ components: [row] }).catch(() => {});
  });
}

module.exports = { paginate };
