# Vercel Deployment — Monorepo Site

Cum să deploy-ezi Web Admin Panel-ul pe Vercel cu structura de monorepo (bot/ + site/).

## Automatic Setup (Recommended)

Vercel va detecta `vercel.json` din rădăcina repo-ului și va configura serviciul automat să deploy-eze din `site/`.

### Pași:

1. **Connectează repo-ul la Vercel**
   - Mergi pe https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Selectează repo: `epicjoc-hub/ipj-discord-bot`
   - Framework: auto-detect (Next.js) sau selectează manual
   - Vercel va detecta automat `vercel.json` din rădăcină

2. **Verifică configurația**
   - Root Directory: `site/`
   - Build Command: `npm install && npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install` (auto)

3. **Adaugă Environment Variables** (Settings → Environment Variables)
   - `VERIFY_SECRET` = shared secret cu bot (Secret)
   - `DISCORD_CLIENT_ID` = dari Discord Developer Portal
   - `DISCORD_CLIENT_SECRET` = dari Discord Developer Portal (Secret)
   - `NEXT_PUBLIC_BOT_API_URL` = https://ipj-bot.onrender.com (replace with actual bot URL)

4. **Deploy**
   - Click "Deploy"
   - Vercel va porni build și deploy din `site/`
   - Logs → verifică: build successful, deployed to vercel.com

---

## Manual Setup (Dacă Vercel nu detectează json)

Dacă trebuie să setezi manual în UI Vercel:

1. New Project
2. Selectează repo
3. Configurare Override:
   - **Root Directory**: `site`
   - **Framework**: Next.js (dacă e Next.js, sau auto-detect)
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `.next`
4. Add Environment Variables (ca mai sus)
5. Deploy

---

## Environment Variables Mapping

Dacă folosești Vercel "Referenced Environment Variables" (folosind `@`):

```json
{
  "env": {
    "VERIFY_SECRET": "@verify_secret",
    "DISCORD_CLIENT_ID": "@discord_client_id",
    ...
  }
}
```

Else, setezi direct în Vercel dashboard:

| Env Var | Value | Type |
|---------|-------|------|
| `VERIFY_SECRET` | shared secret | Encrypted |
| `DISCORD_CLIENT_ID` | from Discord Dev Portal | Regular |
| `DISCORD_CLIENT_SECRET` | from Discord Dev Portal | Encrypted |
| `NEXT_PUBLIC_BOT_API_URL` | https://bot.onrender.com | Regular |

---

## Troubleshooting

| Problemă | Cauză | Soluție |
|----------|-------|--------|
| `site: no such file or directory` | Vercel caută root default | Verify `vercel.json` e la rădăcină cu `"root": "site"` |
| `npm ERR! 404 ... not found` | Dependențe lipsă în `site/package.json` | Check `site/package.json`, run `npm install` local |
| `VERIFY_SECRET undefined` | Env var nu e setat | Adaugă în Vercel Settings → Environment |
| `Bot API unreachable` | URL greșit la bot | Verify `NEXT_PUBLIC_BOT_API_URL` = https://bot-service.onrender.com |

---

## Verificări Post-Deploy

```bash
# Site accessible
curl https://<your-site>.vercel.app

# Health check (should respond with site content)
curl https://<your-site>.vercel.app/api/health

# Env vars loaded (check logs)
# Vercel shows build logs with env vars configuration
```

---

## Sincronizare cu Bot (Render)

Trebuie ca:
1. **VERIFY_SECRET** să fie același în:
   - Render (bot): `BOT_TOKEN`, `VERIFY_SECRET`, `SITE_URL`, `PORT`
   - Vercel (site): `VERIFY_SECRET`, `DISCORD_CLIENT_*`, `NEXT_PUBLIC_BOT_API_URL`

2. **URLs să fie corecte**:
   - Bot URL pe Render: https://ipj-bot.onrender.com (example)
   - Site URL pe Vercel: https://ipj-site.vercel.app (example)
   - `SITE_URL` în bot trebuie să pointeze la site Vercel
   - `NEXT_PUBLIC_BOT_API_URL` în site trebuie să pointeze la bot Render

3. **Test end-to-end**:
   - User deschide site-ul (Vercel)
   - Click admin button → apelează bot API (Render)
   - Bot apelează site API pentru verificare token
   - Success = ambele comunică corect

---

## Notes

- Monorepo structură: `/site` e root directory pentru Vercel
- Bot-ul deploy-ează separat (Render, cu `/bot`)
- `VERIFY_SECRET` trebuie setat în ambele: Render (bot) + Vercel (site)
- Auto-deploy: la fiecare push pe `main`, Vercel re-deploy-ează automat din `site/`
- Preview deployments: Vercel crează preview URL-uri pentru PR-uri

---

Pentru suport local, vezi [LOCAL-DEV-SETUP.md](LOCAL-DEV-SETUP.md)  
Pentru bot Render, vezi [RENDER-DEPLOY.md](RENDER-DEPLOY.md)
