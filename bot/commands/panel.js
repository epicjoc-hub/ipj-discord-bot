const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('Panel IPJ Los Santos')
    .setDescription(
      'Bun venit la Panel-ul Inspectoratului de Poliție Județean Los Santos!\n\n' +
      '**Butoane disponibile:**\n' +
      '🔧 **Setează** - Setează-ți gradul și numele (one-time)\n' +
      '🔐 **Accesează Panel Admin** - Accesează panoul de administrare (necesită permisiuni)\n' +
      '🔄 **Actualizează Grad** - Actualizează-ți gradul\n\n' +
      'Folosește butoanele de mai jos pentru a interacționa cu panel-ul.'
    )
    .setColor(0x1e3a8a)
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('seteaza')
        .setLabel('Setează')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🔧'),
      new ButtonBuilder()
        .setCustomId('acceseaza_admin')
        .setLabel('Accesează Panel Admin')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔐'),
      new ButtonBuilder()
        .setCustomId('actualizeaza_grad')
        .setLabel('Actualizează Grad')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔄')
    );

  await interaction.reply({ embeds: [embed], components: [row] });
}

module.exports = { execute };

