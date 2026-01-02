# 🚀 Deployment Pas cu Pas - Render (Bot) + Vercel (Site)

---

## ⚠️ **PRE-DEPLOYMENT CHECKLIST**

Înainte de orice, asigură-te că ai:

```bash
# 1. Discord Developer Portal - App creat
https://discord.com/developers/applications

# 2. Render Account
https://dashboard.render.com

# 3. Vercel Account
https://vercel.com

# 4. GitHub Repo
https://github.com/epicjoc-hub/ipj-discord-bot (cu main branch)
```

---

# 🤖 PART 1: RENDER DEPLOYMENT (BOT)

## Pasul 1: Pregătire Discord Bot Token

### ✅ Deschide Discord Developer Portal
1. Mergi la: https://discord.com/developers/applications
2. Click pe aplicația ta (sau creează una nouă)
3. Click **"Bot"** tab din left sidebar

### ✅ Copiază Token-ul
1. Sub **TOKEN** section, click **"Reset Token"** (dacă e necesar)
2. Click **"Copy"**
3. **SALVEAZĂ TOKEN undeva sigur** (o să-l trebuiești în Render)

### ✅ Configurează Intents (IMPORTANT!)
1. Scroll la **GATEWAY INTENTS**
2. Enable:
   - ✅ **Server Members Intent** (pentru a citi membrii)
   - ✅ **Message Content Intent** (pentru a citi mesajele)
3. Click **"Save Changes"**

---

## Pasul 2: Setup Render (Bot)

### ✅ Mergi la Render
1. https://dashboard.render.com
2. Click **"New"** → **"Web Service"**

### ✅ Conectează GitHub Repo
1. Under **"Connect a repository"**, click **"Connect"**
2. Selectează: `epicjoc-hub/ipj-discord-bot`
3. Autorizează Render să acceseze repo-ul tău

### ✅ Configurare Service

Completeaza cu aceste valori:

```
Name: ipj_discord_bot
Environment: Node
Branch: main
Root Directory: (lasă gol)
Build Command: cd bot && npm install
Start Command: cd bot && npm start
Plan: Free (sau Paid, după preferință)
```

Click **"Create Web Service"** (nu deploy încă!)

---

## Pasul 3: Adaugă Environment Variables în Render

Render ar trebui să te trimită la pagina de configurare. Dacă nu:

1. Click pe serviciul creat (`ipj_discord_bot`)
2. Click **"Settings"** din top
3. Scroll la **"Environment"**
4. Click **"Add Environment Variable"** și completeaza:

```
KEY: BOT_TOKEN
VALUE: <COPIAZĂ TOKEN-ul din Discord Dev Portal>
[Mark as Secret] ✅
```

Adaugă și restul:

| KEY | VALUE | Secret? |
|-----|-------|---------|
| `BOT_TOKEN` | `<token din Discord>` | ✅ YES |
| `VERIFY_SECRET` | `<genereaza: openssl rand -hex 32>` | ✅ YES |
| `SITE_URL` | `https://ipj-ls-pr-bzone.vercel.app` | ❌ NO |
| `PORT` | `3000` | ❌ NO |

### ✅ Pentru VERIFY_SECRET, genereaza random string:

**LOCAL (în terminal):**
```bash
openssl rand -hex 32
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

**Copy output și paste-aza în Render ca VERIFY_SECRET**

Click **"Save"** după fiecare variabilă.

---

## Pasul 4: Deploy Bot pe Render

1. Click **"Deploy"** (top right)
2. Asteaptă ~2-3 minute pentru build
3. Verific logs - ar trebui să vezi:
   ```
   Bot connected as YourBotName#0000
   HTTP server listening on port 3000
   ```

✅ **Bot e LIVE!** Noteaza URL-ul: `https://ipj_discord_bot.onrender.com`

---

# 🌐 PART 2: VERCEL DEPLOYMENT (SITE)

## Pasul 5: Discord OAuth2 Setup

### ✅ Deschide Discord Dev Portal (din nou)
1. https://discord.com/developers/applications
2. Selectează applicația
3. Click **"OAuth2"** tab

### ✅ Configurează Redirects
1. Sub **"Redirects"**, click **"Add Redirect"**
2. Adaugă această valoare:
   ```
   https://ipj-ls-pr-bzone.vercel.app/api/auth/callback
   ```
   *(Înlocuiește ipj-ls-pr-bzone cu domeniul tău dacă e diferit)*
3. Click **"Save Changes"**

### ✅ Copiază Client ID & Secret
1. **CLIENT ID** - copia din OAuth2 tab
2. **CLIENT SECRET** - copia din OAuth2 tab
3. **SALVEAZĂ ambele** (o să-le trebuiești în Vercel)

---

## Pasul 6: Setup Vercel (Site)

### ✅ Mergi la Vercel
1. https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**

### ✅ Import Repository
1. Click **"Import GitHub Repository"**
2. Paste repo URL: `https://github.com/epicjoc-hub/ipj-discord-bot`
3. Click **"Import"**

### ✅ Configurare Build
Vercel ar trebui să detecteze `vercel.json`. Verifica:

```
Root Directory: site/
Framework Preset: Next.js
Build Command: cd site && npm install && npm run build
Output Directory: site/.next
```

**☝️ IMPORTANT:** Dacă Vercel nu detectează corect, schimbă:
- Build Command: `cd site && npm install && npm run build`
- Output Directory: `site/.next`

Click **"Continue"** (nu deploy încă!)

---

## Pasul 7: Adaugă Environment Variables în Vercel

Vercel va cere Environment Variables. Completeaza:

| Key | Value | Type |
|-----|-------|------|
| `VERIFY_SECRET` | `<EXACT SAME ca în Render!>` | Encrypted |
| `DISCORD_CLIENT_ID` | `<din Discord OAuth2>` | Regular |
| `DISCORD_CLIENT_SECRET` | `<din Discord OAuth2>` | Encrypted |
| `NEXT_PUBLIC_BOT_API_URL` | `https://ipj_discord_bot.onrender.com` | Regular |

### ⚠️ **CRITICAL: VERIFY_SECRET trebuie EXACT ACELAȘI în Render și Vercel!**

Click **"Deploy"**

---

## Pasul 8: Verifica Deployment

### ✅ Bot (Render)
```bash
# Test health endpoint
curl https://ipj_discord_bot.onrender.com/health

# Response ar trebui să fie:
# {"ok":true,"bot":"BotName#0000"}
```

### ✅ Site (Vercel)
1. Mergi la: `https://ipj-ls-pr-bzone.vercel.app` (sau subdomain-ul tău)
2. Site ar trebui să se încărce
3. Apasă butonul "Login with Discord"
4. Verify token flow funcționează

---

# ✅ FINAL CHECKLIST

```
DISCORD DEVELOPER PORTAL:
☐ Bot token copiat
☐ Server Members Intent: ON
☐ Message Content Intent: ON
☐ OAuth2 Client ID copiat
☐ OAuth2 Client Secret copiat
☐ Redirect URI adaugat: https://ipj-ls-pr-bzone.vercel.app/api/auth/callback

RENDER (Bot):
☐ Service creat: ipj_discord_bot
☐ BOT_TOKEN setat (Secret ✅)
☐ VERIFY_SECRET setat (Secret ✅)
☐ SITE_URL = https://ipj-ls-pr-bzone.vercel.app
☐ PORT = 3000
☐ Deploy successful
☐ /health endpoint responsive

VERCEL (Site):
☐ Repo importat
☐ Root Directory: site/
☐ Build Command: cd site && npm install && npm run build
☐ VERIFY_SECRET setat (SAME ca Render!)
☐ DISCORD_CLIENT_ID setat
☐ DISCORD_CLIENT_SECRET setat (Encrypted)
☐ NEXT_PUBLIC_BOT_API_URL = https://ipj_discord_bot.onrender.com
☐ Deploy successful
☐ Site accessible și login funcționează

INTEGRATION TEST:
☐ Bot /panel command works
☐ Token generat și valid
☐ Site primește token
☐ User poate login
```

---

# 🆘 TROUBLESHOOTING

| Problemă | Soluție |
|----------|---------|
| Bot nu se conectează | Check BOT_TOKEN în Render; regenerează dacă necesar |
| Render build fails | Check logs; asigură-te că render.yaml e corect |
| Vercel build fails | Check `site/package.json` și Next.js config |
| `/verify` returnează 403 | VERIFY_SECRET diferit între Render și Vercel |
| Site nu se conectează la bot | NEXT_PUBLIC_BOT_API_URL gresit; verifica URL Render |
| Login doesn't work | Redirect URI nu e adaugat în Discord OAuth2 |

---

## 🎉 **Asta-i! Acum ai bot pe Render și site pe Vercel!**

Orice update pe GitHub main branch va trigger automat deploys pe ambe platforme.

**Avezi nevoie de ajutor la vreun pas?** 👇

