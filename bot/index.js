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
      Routes.applicationGuildCommands(client.user.id, config.GUILD_ID),
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

// --- Minimal HTTP endpoint for token verification (used by the site)
const express = require('express');
const storage = require('./utils/storage');

const app = express();
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  return res.json({ ok: true, bot: client.user ? client.user.tag : null });
});

// Verify token: site can call this server-side to confirm a token and receive the discordId
// Example: GET /verify?token=abcdef
app.get('/verify', (req, res) => {
  // Verify secret header to prevent public abuse
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret) {
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  const providedSecret = req.header('x-verify-secret');
  if (!providedSecret || providedSecret !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }

  const token = req.query.token;
  if (!token) return res.status(400).json({ ok: false, error: 'no_token' });

  const discordId = storage.verifyToken(token);
  if (!discordId) return res.status(401).json({ ok: false, error: 'invalid_or_expired' });

  // Get user data if available
  const user = storage.getUserByDiscordId(discordId);

  return res.json({ 
    ok: true, 
    discordId,
    user: user || null
  });
});

// Get user by Discord ID
// Example: GET /user?discordId=123456789
app.get('/user', (req, res) => {
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret) {
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  const providedSecret = req.header('x-verify-secret');
  if (!providedSecret || providedSecret !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }

  const discordId = req.query.discordId;
  if (!discordId) return res.status(400).json({ ok: false, error: 'no_discordId' });

  const user = storage.getUserByDiscordId(discordId);
  if (!user) return res.status(404).json({ ok: false, error: 'user_not_found' });

  return res.json({ ok: true, user });
});

// Cereri Evenimente endpoints
app.get('/cereri-evenimente', (req, res) => {
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret || req.header('x-verify-secret') !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }
  const cereri = storage.readCereri();
  return res.json(cereri);
});

app.post('/cereri-evenimente', (req, res) => {
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret || req.header('x-verify-secret') !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }
  const cerere = storage.addCerere(req.body);
  return res.json({ success: true, cerere });
});

app.put('/cereri-evenimente/:id', (req, res) => {
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret || req.header('x-verify-secret') !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }
  const cerere = storage.updateCerere(req.params.id, req.body);
  if (!cerere) return res.status(404).json({ ok: false, error: 'not_found' });
  return res.json({ success: true, cerere });
});

// Programari Teste endpoints
app.get('/programari-teste', (req, res) => {
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret || req.header('x-verify-secret') !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }
  const programari = storage.readProgramari();
  return res.json(programari);
});

app.post('/programari-teste', (req, res) => {
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret || req.header('x-verify-secret') !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }
  const programare = storage.addProgramare(req.body);
  return res.json({ success: true, programare });
});

app.put('/programari-teste/:id', (req, res) => {
  const expectedSecret = process.env.VERIFY_SECRET;
  if (!expectedSecret || req.header('x-verify-secret') !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }
  const programare = storage.updateProgramare(req.params.id, req.body);
  if (!programare) return res.status(404).json({ ok: false, error: 'not_found' });
  return res.json({ success: true, programare });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`HTTP server listening on port ${port}`);
});
