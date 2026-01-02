# IPJ Los Santos — Monorepo (Bot + Site)

Full-stack repository pentru IPJ Los Santos Discord bot + admin panel web site.

```
ipj-full-stack/
├── bot/                     # Discord Bot (Node.js + Express)
│   ├── index.js            # Main bot entrypoint with /verify endpoint
│   ├── config.js           # Configuration (token, guild ID, etc)
│   ├── package.json        # Bot dependencies
│   ├── commands/           # Slash commands
│   ├── handlers/           # Event handlers
│   ├── utils/              # Utilities (storage, etc)
│   ├── render.yaml         # Render deployment manifest
│   ├── HOSTING-RENDER.md   # Render deployment guide
│   └── .env.example        # Environment variables template
│
├── site/                   # Web Admin Panel (Next.js / React)
│   ├── package.json        # Site dependencies
│   ├── pages/              # Next.js pages
│   ├── public/             # Static files
│   └── .env.local.example  # Environment variables template
│
├── docker-compose.yml      # Local dev with Docker
├── setup-local-dev.sh      # Setup script
├── LOCAL-DEV-SETUP.md      # Local development guide
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/epicjoc-hub/ipj-discord-bot.git
cd ipj-discord-bot

# Setup both bot and site
bash setup-local-dev.sh
```

### 2. Configure Environment

**Bot** (`bot/.env`):
```env
BOT_TOKEN=your_discord_bot_token
VERIFY_SECRET=generate_with_openssl_rand_hex_32
SITE_URL=http://localhost:3000
PORT=3000
```

**Site** (`site/.env.local`):
```env
VERIFY_SECRET=same_as_bot
DISCORD_CLIENT_ID=from_discord_dev_portal
DISCORD_CLIENT_SECRET=from_discord_dev_portal
NEXT_PUBLIC_BOT_API_URL=http://localhost:3000
```

### 3. Start Services

**Option A — Docker Compose** (Recommended):
```bash
docker-compose up
```

**Option B — Manual** (Two terminals):
```bash
# Terminal 1 (Bot)
cd bot && npm install && npm start

# Terminal 2 (Site)
cd site && npm install && npm run dev
```

### 4. Test

- Bot API: http://localhost:3000/health
- Site: http://localhost:3001
- Discord: `/panel` command triggers admin flow

---

## 📋 Architecture

### Token Verification Flow

1. **Discord Bot** generates secure token
2. **User receives** link: `https://site.com/admin?token=<token>`
3. **Site calls** `GET https://bot:3000/verify?token=<token>` with `x-verify-secret` header
4. **Bot responds** with `discordId` if token valid
5. **Site grants** access to admin panel

### Deployment

**Bot (Render)**
- Service: Web Service
- Manifest: `bot/render.yaml`
- Env vars: `BOT_TOKEN`, `VERIFY_SECRET`, `SITE_URL`, `PORT`

**Site (Vercel / Any platform)**
- Framework: Next.js (likely) or React
- Env vars: `VERIFY_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `NEXT_PUBLIC_BOT_API_URL`

---

## 📖 Documentation

- [Local Dev Setup](LOCAL-DEV-SETUP.md) — Docker, manual, troubleshooting
- [Bot Deployment (Render)](bot/HOSTING-RENDER.md) — Token verification endpoint, secrets
- [Bot Readme](bot/README.md) — Bot features, commands, configuration

---

## 🔗 Repositories

- **Bot**: This repo (bot/) — https://github.com/epicjoc-hub/ipj-discord-bot
- **Site**: Submodule or separate — https://github.com/epicjoc-hub/ipj-ls-pr-bzone

---

## 🛠 Development Tips

### Shared Environment Variables

Maintain parity between deployments:
- `VERIFY_SECRET` must match in bot (Render) and site (Vercel)
- Update together, test locally first with `docker-compose up`

### Debugging

```bash
# View logs
docker-compose logs -f bot
docker-compose logs -f site

# Restart service
docker-compose restart bot

# Interactive shell
docker-compose exec bot sh
```

### Atomic Changes

Since it's a monorepo:
- Bot + site changes can be committed together
- Both deploy atomically if configured (e.g., GitHub Actions on push)
- No sync issues between repos

---

## ⚠️ Important Notes

- **VERIFY_SECRET** must be strong (use `openssl rand -hex 32`)
- **BOT_TOKEN** is secret — never commit or expose
- Token expiry: 15 minutes (configurable in `bot/utils/storage.js`)
- Local dev uses same structure as production (Docker)

---

## 📝 Contributing

1. Clone this monorepo
2. Make changes in `bot/` or `site/`
3. Test locally: `docker-compose up`
4. Commit & push to `main`
5. Render (bot) and Vercel (site) auto-deploy

---

For detailed guides, see [LOCAL-DEV-SETUP.md](LOCAL-DEV-SETUP.md) or individual README files.
