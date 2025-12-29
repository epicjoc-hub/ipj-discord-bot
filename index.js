const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, REST, Routes } = require('discord.js');
const config = require('./config');
const buttonHandler = require('./handlers/buttonHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', async () => {
  console.log(`Bot conectat ca ${client.user.tag}!`);
  
  // Register slash commands
  const commands = [
    new SlashCommandBuilder()
      .setName('panel')
      .setDescription('Trimite panel-ul IPJ Los Santos în canal')
      .toJSON()
  ];

  const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

  try {
    console.log('Înregistrare comenzi slash...');
    console.log('GUILD_ID:', config.GUILD_ID);
    console.log('Comenzi de înregistrat:', JSON.stringify(commands));
    const result = await rest.put(
      Routes.guildCommands(config.GUILD_ID),
      { body: commands }
    );
    console.log('Comenzi slash înregistrate cu succes!', JSON.stringify(result));
  } catch (error) {
    console.error('Eroare la înregistrarea comenzilor:', error);
    if (error?.stack) console.error(error.stack);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'panel') {
      const panelCommand = require('./commands/panel');
      await panelCommand.execute(interaction);
    }
  } else if (interaction.isButton()) {
    await buttonHandler.handle(interaction);
  } else if (interaction.isModalSubmit()) {
    await buttonHandler.handleModal(interaction);
  }
});

client.login(config.BOT_TOKEN);
