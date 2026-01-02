# Local Development Setup — Bot + Site Together

Cum să dezvolți local cu ambele repo-uri (bot + site) în sincronizare pentru debugging rapid.

## Opțiuni de Setup

### Option 1: Docker Compose (Recomandat)

Rulează ambele servicii izolat în containere cu networking automată.

**Cerințe:**
- Docker & Docker Compose instalate

**Pași:**

1. Clonează repo-ul site dacă nu îl ai:
```bash
cd /path/to/projects
git clone https://github.com/epicjoc-hub/ipj-ls-pr-bzone.git
cd ipj-discord-bot
```

2. Creează `.env` local cu variabilele tale:
```bash
cp .env.example .env
# Edit .env și adaugă:
# BOT_TOKEN=<your_token>
# VERIFY_SECRET=<generated_secret>
# SITE_URL=http://site:3000
# PORT=3000
```

3. Creează `.env.local` în site repo (`../ipj-ls-pr-bzone/.env.local`):
```
VERIFY_SECRET=<same_as_bot>
DISCORD_CLIENT_ID=<your_id>
DISCORD_CLIENT_SECRET=<your_secret>
NEXT_PUBLIC_BOT_API_URL=http://bot:3000
```

4. Rulează docker-compose:
```bash
docker-compose up
```

- Bot rulează pe `http://localhost:3000` (container) + API endpoints
- Site rulează pe `http://localhost:3001` (container)
- Networking între containere e automată

5. Verifică logs:
```bash
docker-compose logs -f bot
docker-compose logs -f site
```

6. Stop serviciile:
```bash
docker-compose down
```

---

### Option 2: Local Manual (Two Terminals)

Rulează ambele proiecte pe mașina locală.

**Pași:**

1. Setup script (clonează și instalează ambele repo-uri):
```bash
bash setup-local-dev.sh
```

2. Terminal 1 — Bot:
```bash
cd /path/to/ipj-discord-bot
npm start
```
Ar trebui să vezi: `Bot conectat ca ...` și `HTTP server listening on port 3000`.

3. Terminal 2 — Site:
```bash
cd /path/to/ipj-ls-pr-bzone
npm run dev
```
Ar trebui să vezi: `> ipj-ls-pr-bzone@... dev`, site pe `http://localhost:3000` (sau `3001` dacă portul e ocupat).

4. Deschide `http://localhost:3000` (sau `3001`) în browser și testează fluxul.

---

## Testing Workflow

Fișierele modificate în repo-uri se reîncarcă automat în ambele cazuri (Docker are volume mounts).

### Test 1: Health Check
```bash
curl http://localhost:3000/health
# Ar trebui: {"ok":true,"bot":"BotName#1234"}
```

### Test 2: Token Verification (Server-side)
```bash
# Din terminal bot:
# 1. Generează un token (manual din storage sau prin interacție Discord)
# 2. Testează /verify endpoint:

curl -H "x-verify-secret: <VERIFY_SECRET>" \
  "http://localhost:3000/verify?token=<generated_token>"
# Ar trebui: {"ok":true,"discordId":"..."}
```

### Test 3: Admin Panel Flow
1. Deschide site pe `http://localhost:3000` (sau 3001)
2. Rulează comanda `/panel` în Discord
3. Click pe buton "Acceseaza Admin"
4. Primești link în DM cu token
5. Click pe link — site apelează `/verify` cu token
6. Dashboard se încarcă cu datele tale

---

## Debugging

### Logs

**Docker Compose:**
```bash
# Toate serviciile:
docker-compose logs -f

# Doar bot:
docker-compose logs -f bot

# Doar site:
docker-compose logs -f site
```

**Manual:**
- Fiecare terminal afișează logs direct

### Restart Service (Docker)

```bash
# Restart bot container
docker-compose restart bot

# Rebuild și restart (dacă ai modificări în Dockerfile logic)
docker-compose up --build bot
```

### Network Issues

Dacă site nu poate accesa bot:
- **Docker**: Verific `docker network ls` și `docker inspect <network_name>`
- **Manual**: Asigură-te că bot rulează pe port 3000 și site e configurat să acceseze `http://localhost:3000`

---

## Environment Variables Summary

### Bot `.env`
```
BOT_TOKEN=<discord_bot_token>
VERIFY_SECRET=<shared_secret>
SITE_URL=http://localhost:3000 (manual) sau http://site:3000 (Docker)
PORT=3000
```

### Site `.env.local`
```
VERIFY_SECRET=<same_as_bot>
DISCORD_CLIENT_ID=<from_dev_portal>
DISCORD_CLIENT_SECRET=<from_dev_portal>
NEXT_PUBLIC_BOT_API_URL=http://localhost:3000 (manual) sau http://bot:3000 (Docker)
```

---

## Deployment

După ce totul merge local:

1. **Bot** → Render (commit și push `main`, auto-deploy)
2. **Site** → Vercel (commit și push, auto-deploy)

Verifică că variabilele de mediu sunt setate în ambele platforme!

---

## Troubleshooting

| Problemă | Cauză | Soluție |
|----------|-------|--------|
| `Cannot reach bot from site` | VERIFY_SECRET nu se potrivește | Verific valorile în ambele `.env` |
| `EADDRINUSE: port 3000 already in use` | Alt proces pe port 3000 | Schimbă PORT în `.env` sau termină procesul |
| `Discord bot token invalid` | Token expirat/resetat | Regenerează token în Developer Portal |
| `Docker build fails` | Dependencies nu se instalează | `docker-compose down -v && docker-compose up --build` |

---
