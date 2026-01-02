# Render Deployment — Monorepo Structure

Cum să deploy-ezi Discord Bot-ul pe Render cu structura de monorepo (bot/ + site/).

## Automatic Setup (Recommended)

Render va detecta `render.yaml` din rădăcina repo-ului și va configura serviciul automat.

### Pași:

1. **Connectează repo-ul la Render**
   - Mergi pe https://dashboard.render.com
   - Click "New" → "Web Service"
   - Selectează repo: `epicjoc-hub/ipj-discord-bot`
   - Branch: `main`
   - Render va detecta automat `render.yaml` din rădăcină

2. **Verifică configurația**
   - Build Command: `cd bot && npm install`
   - Start Command: `cd bot && npm start`
   - Environment: Node
   - Port: se va citi din `.env` (PORT=3000)

3. **Adaugă Environment Variables** (Settings → Environment)
   - `BOT_TOKEN` = Discord bot token (Secret)
   - `VERIFY_SECRET` = shared secret cu site (Secret)
   - `SITE_URL` = https://ipj-site.vercel.app (replace with actual)
   - `PORT` = 3000 (optional, default)

4. **Deploy**
   - Click "Create Web Service"
   - Render va porni build și deploy
   - Logs → verifică: `Bot conectat ca ...` și `HTTP server listening on port 3000`

---

## Manual Setup (Dacă Render nu detectează yaml)

Dacă trebuie să setezi manual în UI:

1. New Web Service
2. Configure:
   - **Build Command**: `cd bot && npm install`
   - **Start Command**: `cd bot && npm start`
   - **Environment**: Node
3. Add Secrets (ca mai sus)
4. Deploy

---

## Troubleshooting

| Problemă | Cauză | Soluție |
|----------|-------|--------|
| `npm: command not found` | Build command nu merge | Verifică: `cd bot && npm install` (cu `cd`) |
| `Can't find module 'dotenv'` | node_modules nu e instalat | Render rulează `npm install` automat; check logs |
| `Bot token invalid` | Token expirat sau greșit | Regenerează token în Discord Dev Portal, update secret |
| `Port already in use` | Altă instanță rulează | Render auto-restarts; check if service crashed |

---

## Verificări Post-Deploy

```bash
# Health check
curl https://<your-service>.onrender.com/health
# Response: {"ok":true,"bot":"BotName#1234"}

# Token verification (server-side)
curl -H "x-verify-secret: <YOUR_SECRET>" \
  "https://<your-service>.onrender.com/verify?token=<token>"
# Response: {"ok":true,"discordId":"..."}
```

---

## Notes

- Monorepo structură: `/bot` e working directory pentru Render
- Site-ul deploy-ează separat (Vercel, cu `/site`)
- `VERIFY_SECRET` trebuie setat în ambele: Render (bot) + Vercel (site)
- Auto-deploy: la fiecare push pe `main`, Render re-deploy-ează automat

---

Pentru suport local, vezi [LOCAL-DEV-SETUP.md](../LOCAL-DEV-SETUP.md)
