const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/discord-users.json');
const TOKENS_FILE = path.join(__dirname, '../data/discord-tokens.json');
const CERERI_FILE = path.join(__dirname, '../data/cereri-evenimente.json');
const PROGRAMARI_FILE = path.join(__dirname, '../data/programari-teste.json');
const ANUNTURI_FILE = path.join(__dirname, '../data/anunturi-evenimente.json');
const ANUNTURI_POLITIE_FILE = path.join(__dirname, '../data/anunturi-politie.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize files if they don't exist
const ensureFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
};

ensureFile(USERS_FILE);
ensureFile(TOKENS_FILE);
ensureFile(CERERI_FILE);
ensureFile(PROGRAMARI_FILE);
ensureFile(ANUNTURI_FILE);
ensureFile(ANUNTURI_POLITIE_FILE);

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

// Cereri Evenimente
function readCereri() {
  try {
    const data = fs.readFileSync(CERERI_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cereri file:', error);
    return [];
  }
}

function writeCereri(cereri) {
  try {
    fs.writeFileSync(CERERI_FILE, JSON.stringify(cereri, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing cereri file:', error);
    return false;
  }
}

function addCerere(cerere) {
  try {
    const cereri = readCereri();
    const newCerere = {
      id: Date.now().toString(),
      ...cerere,
      status: cerere.status || 'pending',
      dataCreare: cerere.dataCreare || new Date().toISOString(),
      istoric: [],
    };
    cereri.push(newCerere);
    const written = writeCereri(cereri);
    if (!written) {
      throw new Error('Failed to write cerere to file');
    }
    console.log('Cerere added successfully:', newCerere.id);
    return newCerere;
  } catch (error) {
    console.error('Error in addCerere:', error);
    throw error;
  }
}

function updateCerere(id, updates) {
  const cereri = readCereri();
  const index = cereri.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  cereri[index] = { ...cereri[index], ...updates };
  writeCereri(cereri);
  return cereri[index];
}

// Programari Teste
function readProgramari() {
  try {
    const data = fs.readFileSync(PROGRAMARI_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading programari file:', error);
    return [];
  }
}

function writeProgramari(programari) {
  try {
    fs.writeFileSync(PROGRAMARI_FILE, JSON.stringify(programari, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing programari file:', error);
    return false;
  }
}

function addProgramare(programare) {
  const programari = readProgramari();
  const newProgramare = {
    id: Date.now().toString(),
    ...programare,
    discordTag: programare?.discordTag ? String(programare.discordTag).trim() : undefined,
    status: 'pending',
    dataCreare: new Date().toISOString(),
  };
  programari.push(newProgramare);
  writeProgramari(programari);
  return newProgramare;
}

function updateProgramare(id, updates) {
  const programari = readProgramari();
  const index = programari.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  programari[index] = { ...programari[index], ...updates };
  writeProgramari(programari);
  return programari[index];
}

// Anunturi Evenimente
function readAnunturi() {
  try {
    const data = fs.readFileSync(ANUNTURI_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading anunturi file:', error);
    return [];
  }
}

function writeAnunturi(anunturi) {
  try {
    fs.writeFileSync(ANUNTURI_FILE, JSON.stringify(anunturi, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing anunturi file:', error);
    return false;
  }
}

function addAnunt(anunt) {
  const anunturi = readAnunturi();
  const newAnunt = {
    id: Date.now().toString(),
    ...anunt,
    status: 'aprobat',
  };
  anunturi.push(newAnunt);
  writeAnunturi(anunturi);
  return newAnunt;
}

function updateAnunt(id, updates) {
  const anunturi = readAnunturi();
  const index = anunturi.findIndex(a => a.id === id);
  if (index === -1) return null;
  anunturi[index] = { ...anunturi[index], ...updates };
  writeAnunturi(anunturi);
  return anunturi[index];
}

function deleteAnunt(id) {
  const anunturi = readAnunturi();
  const filtered = anunturi.filter(a => a.id !== id);
  writeAnunturi(filtered);
  return filtered.length < anunturi.length;
}

// Anunturi Poliție
function readAnunturiPolitie() {
  try {
    const data = fs.readFileSync(ANUNTURI_POLITIE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading anunturi politie file:', error);
    return [];
  }
}

function writeAnunturiPolitie(anunturi) {
  try {
    fs.writeFileSync(ANUNTURI_POLITIE_FILE, JSON.stringify(anunturi, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing anunturi politie file:', error);
    return false;
  }
}

function addAnuntPolitie(anunt) {
  const anunturi = readAnunturiPolitie();
  const newAnunt = {
    id: Date.now().toString(),
    ...anunt,
    status: anunt?.status || 'publicat',
  };
  anunturi.push(newAnunt);
  writeAnunturiPolitie(anunturi);
  return newAnunt;
}

function updateAnuntPolitie(id, updates) {
  const anunturi = readAnunturiPolitie();
  const index = anunturi.findIndex(a => a.id === id);
  if (index === -1) return null;
  anunturi[index] = { ...anunturi[index], ...updates };
  writeAnunturiPolitie(anunturi);
  return anunturi[index];
}

function deleteAnuntPolitie(id) {
  const anunturi = readAnunturiPolitie();
  const filtered = anunturi.filter(a => a.id !== id);
  writeAnunturiPolitie(filtered);
  return filtered.length < anunturi.length;
}

module.exports = {
  getUserByDiscordId,
  saveUser,
  updateUserGrad,
  hasUserSet,
  generateToken,
  saveToken,
  verifyToken,
  readCereri,
  writeCereri,
  addCerere,
  updateCerere,
  readProgramari,
  writeProgramari,
  addProgramare,
  updateProgramare,
  readAnunturi,
  writeAnunturi,
  addAnunt,
  updateAnunt,
  deleteAnunt,
  readAnunturiPolitie,
  writeAnunturiPolitie,
  addAnuntPolitie,
  updateAnuntPolitie,
  deleteAnuntPolitie,
};

