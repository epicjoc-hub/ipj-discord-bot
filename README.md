# Discord Bot - IPJ Los Santos

Bot Discord pentru gestionarea panel-ului și autentificării admin pentru site-ul IPJ Los Santos.

> **⚠️ Monorepo Structure** — Bot și Site sunt în același repo: `bot/` și `site/`  
> Pentru development local: [LOCAL-DEV-SETUP.md](LOCAL-DEV-SETUP.md)  
> Pentru deploy pe Render: [RENDER-DEPLOY.md](RENDER-DEPLOY.md)

## 📁 Structură

```
ipj-discord-bot/     (monorepo)
├── bot/             ← Discord Bot (Node.js + Express)
├── site/            ← Web Admin Panel (Next.js, submodule)
├── docker-compose.yml
└── setup-local-dev.sh
```

## 🚀 Setup Rapid (Bot Standalone)

1. **Clonează repository-ul:**
   ```bash
   git clone --recurse-submodules https://github.com/epicjoc-hub/ipj-discord-bot.git
   cd ipj-discord-bot/bot
   ```

2. **Instalează dependencies:**
   ```bash
   npm install
   ```

3. **Creează fișier `.env`:**
   ```bash
   cp .env.example .env
   # Edit .env și adaugă BOT_TOKEN
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

Bot-ul poate fi deploy-at pe Render, Railway, VPS, etc.

**Render (Recommended):** Vezi [RENDER-DEPLOY.md](RENDER-DEPLOY.md) — structura monorepo cu `cd bot && npm install`

## 📖 Ghiduri

- [MONOREPO.md](MONOREPO.md) - Overview structurii bot + site
- [LOCAL-DEV-SETUP.md](LOCAL-DEV-SETUP.md) - Ruleaza local cu Docker Compose (bot + site)
- **Deployment**:
  - [RENDER-DEPLOY.md](RENDER-DEPLOY.md) - Deploy bot pe Render (monorepo)
  - [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md) - Deploy site pe Vercel (monorepo)
- `bot/HOSTING-RENDER.md` - Details despre `/verify` endpoint și VERIFY_SECRET

## 🔗 Repository-uri Conexe

- **Site Web (IPJ Admin Panel):** https://github.com/epicjoc-hub/ipj-ls-pr-bzone
  - Token verification endpoint: `GET /verify?token=X` (cu header `x-verify-secret`)
  - Port: 3001 (local) sau Vercel (production)

## ⚠️ Note Importante

- Bot-ul trebuie să ruleze continuu pentru a funcționa
- Token-ul bot-ului este secret - nu-l împărtăși niciodată
- Dacă token-ul este compromis, regenerează-l din Discord Developer Portal
- `VERIFY_SECRET` trebuie să fie același în bot (Render) și site (Vercel) pentru token verification
- Verificarea role-ului se face la fiecare accesare admin
