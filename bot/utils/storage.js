const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/discord-users.json');
const TOKENS_FILE = path.join(__dirname, '../data/discord-tokens.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify([], null, 2));
}

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

function readTokens() {
  try {
    const data = fs.readFileSync(TOKENS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tokens file:', error);
    return [];
  }
}

function writeTokens(tokens) {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing tokens file:', error);
    return false;
  }
}

function getUserByDiscordId(discordId) {
  const users = readUsers();
  return users.find(u => u.discordId === discordId);
}

function saveUser(discordId, grad, nume) {
  const users = readUsers();
  const existingIndex = users.findIndex(u => u.discordId === discordId);
  
  const userData = {
    discordId,
    grad,
    nume,
    setatLa: existingIndex >= 0 ? users[existingIndex].setatLa : new Date().toISOString(),
    actualizatLa: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    users[existingIndex] = userData;
  } else {
    users.push(userData);
  }

  return writeUsers(users);
}

function updateUserGrad(discordId, grad) {
  const users = readUsers();
  const user = users.find(u => u.discordId === discordId);
  
  if (!user) {
    return false;
  }

  user.grad = grad;
  user.actualizatLa = new Date().toISOString();
  
  return writeUsers(users);
}

function hasUserSet(discordId) {
  const user = getUserByDiscordId(discordId);
  return !!user;
}

function generateToken() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

function saveToken(discordId, token) {
  const tokens = readTokens();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  tokens.push({
    discordId,
    token,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString()
  });

  return writeTokens(tokens);
}

function verifyToken(token) {
  const tokens = readTokens();
  const now = new Date();
  
  // Remove expired tokens
  const validTokens = tokens.filter(t => new Date(t.expiresAt) > now);
  writeTokens(validTokens);

  const tokenData = validTokens.find(t => t.token === token);
  return tokenData ? tokenData.discordId : null;
}

module.exports = {
  getUserByDiscordId,
  saveUser,
  updateUserGrad,
  hasUserSet,
  generateToken,
  saveToken,
  verifyToken
};

