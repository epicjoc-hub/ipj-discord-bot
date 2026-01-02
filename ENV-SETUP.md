# Environment Variables Setup

## Local Development (bot/)

Crea fișier `bot/.env`:

```env
# Discord Bot
BOT_TOKEN=your_actual_bot_token_from_discord_developer_portal
VERIFY_SECRET=your_secure_random_secret_key_min_32_chars
SITE_URL=http://localhost:3001
PORT=3000
```

**Unde găsești valorile:**

| Variable | Unde | Cum |
|----------|------|-----|
| `BOT_TOKEN` | [Discord Developer Portal](https://discord.com/developers/applications) | Selectează app → Token → Copy → cere regenerare dacă nu ai |
| `VERIFY_SECRET` | Tu generi | Genereaza random string sigur (min 32 char): `openssl rand -hex 32` |
| `SITE_URL` | Local: `http://localhost:3001` | Production: `https://ipj-site.vercel.app` |
| `PORT` | Default: `3000` | Port pe care rulează bot-ul local |

---

## Production — Render (Bot)

🔗 https://dashboard.render.com → Settings → Environment

```
BOT_TOKEN = <copie din .env local> [ENCRYPTED]
VERIFY_SECRET = <același ca la Vercel> [ENCRYPTED]
SITE_URL = https://ipj-site.vercel.app [REGULAR]
PORT = 3000 [REGULAR, optional]
```

**⚠️ IMPORTANT:**
- `BOT_TOKEN` și `VERIFY_SECRET` trebuie marcate ca **ENCRYPTED** în Render
- `VERIFY_SECRET` trebuie **EXACT ACELAȘI** la bot și site!

---

## Production — Vercel (Site)

🔗 https://vercel.com → Project Settings → Environment Variables

```
VERIFY_SECRET = <același ca la Render> [ENCRYPTED]
DISCORD_CLIENT_ID = <din Discord Dev Portal> [REGULAR]
DISCORD_CLIENT_SECRET = <din Discord Dev Portal> [ENCRYPTED]
NEXT_PUBLIC_BOT_API_URL = https://ipj-bot.onrender.com [REGULAR]
```

**Unde găsești:**

| Variable | Unde | Cum |
|----------|------|-----|
| `VERIFY_SECRET` | Tu generi (local) | **TREBUIE EGAL cu cel de la Render!** |
| `DISCORD_CLIENT_ID` | [Dev Portal](https://discord.com/developers/applications) → OAuth2 | Copie OAuth2 Client ID |
| `DISCORD_CLIENT_SECRET` | [Dev Portal](https://discord.com/developers/applications) → OAuth2 | Copie Client Secret (keep encrypted!) |
| `NEXT_PUBLIC_BOT_API_URL` | Render Bot URL | https://<your-service>.onrender.com |

---

## Discord Developer Portal Setup

1. Mergi la https://discord.com/developers/applications
2. Selectează/crea application
3. **General Information tab:**
   - Copiază `CLIENT ID` → `DISCORD_CLIENT_ID`
   - Copie `CLIENT SECRET` → `DISCORD_CLIENT_SECRET` (keep safe!)

4. **Bot tab:**
   - Apasă "Reset Token" 
   - Copie token-ul → `BOT_TOKEN` (local `.env`)
   - Enable: `Server Members Intent`, `Message Content Intent`

5. **OAuth2 tab:**
   - Redirects: `https://ipj-site.vercel.app/api/auth/callback` (adaugă pentru production)
   - Scopes: `identify`, `email`, `guilds`

---

## .gitignore — Nu commitui secrets!

Fișierele cu variables locale **TREBUIE** în `.gitignore`:

```gitignore
# Environment
.env
.env.local
.env.*.local
.env.production.local
```

✅ **Deja configurate** în repo-ul ăsta.

---

## Verificare Environment

### Local (Terminal)

```bash
cd /workspaces/ipj-discord-bot/bot
cat .env | grep -v "^#"  # Afișează variables (fără comments)
```

### Render Logs

```bash
# Verifică că environment e setat corect
curl https://<your-bot>.onrender.com/health
# Expected: {"ok":true,"bot":"BotName#0000"}
```

### Vercel Logs

```bash
# Din Vercel dashboard → Deployments → Select latest → Functions
# Verifică că VERIFY_SECRET e loaded
```

---

## Checklist — Pre-Deploy

- [ ] `BOT_TOKEN` regenerat din Discord Developer Portal
- [ ] `VERIFY_SECRET` generat (min 32 char random)
- [ ] `VERIFY_SECRET` **EGAL** în Render și Vercel
- [ ] `SITE_URL` pointing to Vercel deployment
- [ ] `NEXT_PUBLIC_BOT_API_URL` pointing to Render bot service
- [ ] `DISCORD_CLIENT_ID` și `DISCORD_CLIENT_SECRET` din Dev Portal
- [ ] `.env` files **NU** sunt commituite (în `.gitignore`)
- [ ] Secrets marcate ca **ENCRYPTED** în Render/Vercel

---

## Troubleshooting

**Q: Bot ne-conectează - `invalid token`**
- A: Regenerează `BOT_TOKEN` în Discord Dev Portal

**Q: Vercel e-n error cu `VERIFY_SECRET undefined`**
- A: Setează în Vercel → Environment Variables (nu în `.env`)

**Q: `/verify` endpoint returnează 403**
- A: `VERIFY_SECRET` diferit între bot și site - trebuie EGAL!

**Q: Site nu se conectează la bot**
- A: `NEXT_PUBLIC_BOT_API_URL` trebuie URL-ul corect al bot-ului Render

**Q: Local development nu merge cu Docker**
- A: Verific `.env` în `bot/` folder și `docker-compose.yml` volume mounts

