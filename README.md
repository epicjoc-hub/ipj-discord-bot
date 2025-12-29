# Discord Bot - IPJ Los Santos

Bot Discord pentru gestionarea panel-ului și autentificării admin pentru site-ul IPJ Los Santos.

## 🚀 Setup Rapid

1. **Clonează repository-ul:**
   ```bash
   git clone https://github.com/epicjoc-hub/ipj-discord-bot.git
   cd ipj-discord-bot
   ```

2. **Instalează dependencies:**
   ```bash
   npm install
   ```

3. **Creează fișier `.env`:**
   ```env
   BOT_TOKEN=your_bot_token_here
   SITE_URL=http://localhost:3000
   ```

4. **Pornește bot-ul:**
   ```bash
   npm start
   ```

## 📋 Funcționalități

### Comandă `/panel`
Trimite panel-ul cu butoane în canalul configurat.

### Butoane Panel

1. **Setează** - Setează gradul și numele (one-time use)
   - Modal cu input pentru grad și nume
   - Validare grad (trebuie să fie din lista de grade disponibile)
   - Salvare în `data/discord-users.json`

2. **Accesează Panel Admin** - Generează link pentru accesare admin
   - Verifică dacă utilizatorul are role ID `1179052940351246357`
   - Generează token temporar (expiră în 15 minute)
   - Trimite link în mesaj privat

3. **Actualizează Grad** - Actualizează doar gradul
   - Modal cu input pentru grad nou
   - Păstrează numele existent

## ⚙️ Configurare

Editează `config.js` sau folosește variabile de mediu:

- **Bot Token:** Setat în `.env` (BOT_TOKEN)
- **Server ID:** 1162871509275119637
- **Channel ID:** 1455043025817440306
- **Admin Role ID:** 1179052940351246357

## 📚 Grade Disponibile

- AGENT
- AGENT-PRINCIPAL
- AGENT-SEF-ADJUNCT
- AGENT-SEF-PRINCIPAL
- INSPECTOR
- INSPECTOR-PRINCIPAL
- SUB-COMISAR
- COMISAR
- COMISAR-SEF

## 📁 Structură Proiect

```
ipj-discord-bot/
├── index.js              # Entry point
├── config.js             # Configurare
├── commands/
│   └── panel.js          # Comandă panel
├── handlers/
│   └── buttonHandler.js  # Handler butoane
└── utils/
    └── storage.js         # Storage utilities
```

## 🔗 Integrare cu Site

Bot-ul comunică cu site-ul Next.js prin:
- `data/discord-users.json` - Stocare utilizatori
- `data/discord-tokens.json` - Stocare token-uri temporare

**Notă:** Aceste fișiere trebuie să fie accesibile de către ambele aplicații (bot și site).

## 🌐 Hosting 24/7

Vezi `HOSTING-24-7.md` pentru instrucțiuni despre cum să rulezi bot-ul 24/7 pe:
- Railway.app
- Render.com
- VPS cu PM2
- Alte servicii

## 📖 Ghiduri

- `CUM-ADAUGA-BOT.md` - Cum să adaugi bot-ul pe serverul Discord
- `HOSTING-24-7.md` - Cum să rulezi bot-ul 24/7

## ⚠️ Note Importante

- Bot-ul trebuie să ruleze continuu pentru a funcționa
- Token-ul bot-ului este secret - nu-l împărtăși niciodată
- Dacă token-ul este compromis, regenerează-l din Discord Developer Portal
- Verificarea role-ului se face la fiecare accesare admin
