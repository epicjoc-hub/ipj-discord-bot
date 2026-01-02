const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../config');
const storage = require('../utils/storage');

async function handle(interaction) {
  const { customId } = interaction;

  if (customId === 'seteaza') {
    await handleSeteaza(interaction);
  } else if (customId === 'acceseaza_admin') {
    await handleAcceseazaAdmin(interaction);
  } else if (customId === 'actualizeaza_grad') {
    await handleActualizeazaGrad(interaction);
  }
}

async function handleSeteaza(interaction) {
  // Verifică dacă utilizatorul a setat deja
  if (storage.hasUserSet(interaction.user.id)) {
    await interaction.reply({
      content: '❌ Ai setat deja gradul și numele! Folosește butonul "Actualizează Grad" pentru a le modifica.',
      ephemeral: true
    });
    return;
  }

  // Creează modal cu input pentru grad și nume
  const modal = new ModalBuilder()
    .setCustomId('modal_seteaza')
    .setTitle('Setează Grad și Nume');

  const gradInput = new TextInputBuilder()
    .setCustomId('grad_input')
    .setLabel('Grad')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ex: AGENT')
    .setRequired(true)
    .setMinLength(2)
    .setMaxLength(50);

  const numeInput = new TextInputBuilder()
    .setCustomId('nume_input')
    .setLabel('Nume complet')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Introduceți numele complet')
    .setRequired(true)
    .setMinLength(2)
    .setMaxLength(100);

  const gradRow = new ActionRowBuilder().addComponents(gradInput);
  const numeRow = new ActionRowBuilder().addComponents(numeInput);

  modal.addComponents(gradRow, numeRow);

  await interaction.showModal(modal);
}

async function handleAcceseazaAdmin(interaction) {
  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const hasRole = member.roles.cache.has(config.ADMIN_ROLE_ID);

    if (!hasRole) {
      await interaction.reply({
        content: '❌ Nu ai permisiuni pentru a accesa panoul de administrare!',
        ephemeral: true
      });
      return;
    }

    // Generează token
    const token = storage.generateToken();
    storage.saveToken(interaction.user.id, token);

    const siteUrl = config.SITE_URL || '';
    // Normalize site URL to avoid duplicate paths like /admin/admin
    let baseUrl = siteUrl.replace(/\/+$|\s+$/g, '');
    if (baseUrl.endsWith('/admin')) baseUrl = baseUrl.replace(/\/admin$/, '');
    if (baseUrl === '') baseUrl = 'https://ipj-ls-pr-bzone.vercel.app';
    const adminLink = `${baseUrl}/admin?token=${token}`;

    // Trimite mesaj privat
    try {
      await interaction.user.send({
        content: `🔐 **Link pentru accesare Admin Panel**\n\n` +
                 `Click pe link-ul de mai jos pentru a accesa panoul de administrare:\n` +
                 `${adminLink}\n\n` +
                 `⚠️ **Atenție:** Link-ul expiră în 15 minute!`
      });

      await interaction.reply({
        content: '✅ Link-ul pentru accesare admin a fost trimis în mesaj privat!',
        ephemeral: true
      });
    } catch (error) {
      console.error('Error sending DM:', error);
      await interaction.reply({
        content: `❌ Nu am putut trimite mesaj privat. Asigură-te că ai DM-urile activate.\n\n` +
                 `Link-ul tău: ${adminLink}\n` +
                 `⚠️ **Atenție:** Link-ul expiră în 15 minute!`,
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('Error in handleAcceseazaAdmin:', error);
    await interaction.reply({
      content: '❌ A apărut o eroare. Te rugăm să încerci din nou.',
      ephemeral: true
    });
  }
}

async function handleActualizeazaGrad(interaction) {
  // Verifică dacă utilizatorul a setat deja
  if (!storage.hasUserSet(interaction.user.id)) {
    await interaction.reply({
      content: '❌ Trebuie să-ți setezi mai întâi gradul și numele folosind butonul "Setează"!',
      ephemeral: true
    });
    return;
  }

  const user = storage.getUserByDiscordId(interaction.user.id);

  // Creează modal cu input pentru grad
  const modal = new ModalBuilder()
    .setCustomId('modal_actualizeaza_grad')
    .setTitle('Actualizează Grad');

  const gradInput = new TextInputBuilder()
    .setCustomId('grad_input_update')
    .setLabel('Grad nou')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ex: AGENT')
    .setValue(user.grad)
    .setRequired(true)
    .setMinLength(2)
    .setMaxLength(50);

  const gradRow = new ActionRowBuilder().addComponents(gradInput);
  modal.addComponents(gradRow);

  await interaction.showModal(modal);
}

async function handleModal(interaction) {
  const { customId } = interaction;

  if (customId === 'modal_seteaza') {
    await handleModalSeteaza(interaction);
  } else if (customId === 'modal_actualizeaza_grad') {
    await handleModalActualizeazaGrad(interaction);
  }
}

async function handleModalSeteaza(interaction) {
  const grad = interaction.fields.getTextInputValue('grad_input');
  const nume = interaction.fields.getTextInputValue('nume_input');

  if (!grad || !nume) {
    await interaction.reply({
      content: '❌ Te rugăm să completezi toate câmpurile!',
      ephemeral: true
    });
    return;
  }

  // Verifică dacă gradul este valid
  const gradUpper = grad.toUpperCase().trim();
  if (!config.GRADES.includes(gradUpper)) {
    await interaction.reply({
      content: `❌ Grad invalid! Grade disponibile: ${config.GRADES.join(', ')}`,
      ephemeral: true
    });
    return;
  }

  const success = storage.saveUser(interaction.user.id, gradUpper, nume.trim());

  if (success) {
    await interaction.reply({
      content: `✅ Grad și nume setate cu succes!\n\n` +
               `**Grad:** ${gradUpper}\n` +
               `**Nume:** ${nume.trim()}`,
      ephemeral: true
    });
  } else {
    await interaction.reply({
      content: '❌ A apărut o eroare la salvarea datelor. Te rugăm să încerci din nou.',
      ephemeral: true
    });
  }
}

async function handleModalActualizeazaGrad(interaction) {
  const grad = interaction.fields.getTextInputValue('grad_input_update');

  if (!grad) {
    await interaction.reply({
      content: '❌ Te rugăm să introduci un grad!',
      ephemeral: true
    });
    return;
  }

  // Verifică dacă gradul este valid
  const gradUpper = grad.toUpperCase().trim();
  if (!config.GRADES.includes(gradUpper)) {
    await interaction.reply({
      content: `❌ Grad invalid! Grade disponibile: ${config.GRADES.join(', ')}`,
      ephemeral: true
    });
    return;
  }

  const success = storage.updateUserGrad(interaction.user.id, gradUpper);

  if (success) {
    const user = storage.getUserByDiscordId(interaction.user.id);
    await interaction.reply({
      content: `✅ Grad actualizat cu succes!\n\n` +
               `**Grad nou:** ${gradUpper}\n` +
               `**Nume:** ${user.nume}`,
      ephemeral: true
    });
  } else {
    await interaction.reply({
      content: '❌ A apărut o eroare la actualizarea gradului. Te rugăm să încerci din nou.',
      ephemeral: true
    });
  }
}

module.exports = {
  handle,
  handleModal
};

