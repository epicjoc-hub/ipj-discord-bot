# 🚀 Cum să rulezi bot-ul 24/7

## Opțiuni de hosting:

### 1. Railway.app (Recomandat - Gratuit pentru început)

**Pași:**
1. Mergi pe: https://railway.app
2. Sign up cu GitHub
3. Click pe "New Project"
4. Selectează "Deploy from GitHub repo"
5. Selectează repository-ul tău (`ipj-ls-pr-bzone`)
6. Railway va detecta automat folderul `discord-bot`
7. În "Variables", adaugă:
   - `BOT_TOKEN` = token-ul tău Discord
   - `SITE_URL` = URL-ul site-ului tău
8. Click "Deploy"
9. Bot-ul va rula 24/7! ✅

**Cost:** Gratuit pentru $5 credit/lună (suficient pentru un bot Discord)

---

### 2. Render.com (Gratuit)

**Pași:**
1. Mergi pe: https://render.com
2. Sign up cu GitHub
3. Click "New" → "Web Service"
4. Conectează repository-ul GitHub
5. Setări:
   - **Name:** `ipj-discord-bot`
   - **Root Directory:** `discord-bot`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
6. În "Environment Variables", adaugă:
   - `BOT_TOKEN` = token-ul tău
   - `SITE_URL` = URL-ul site-ului
7. Click "Create Web Service"
8. Bot-ul va rula 24/7! ✅

**Cost:** Gratuit (bot-ul se oprește după 15 min inactivitate, dar se repornește automat)

---

### 3. Replit (Gratuit)

**Pași:**
1. Mergi pe: https://replit.com
2. Sign up
3. Click "Create Repl"
4. Selectează "Node.js"
5. Upload fișierele din `discord-bot/`
6. În "Secrets" (🔒), adaugă:
   - `BOT_TOKEN` = token-ul tău
   - `SITE_URL` = URL-ul site-ului
7. Click "Run"
8. Pentru 24/7, folosește "Always On" (necesită Replit Hacker plan - $7/lună)

**Cost:** Gratuit (dar se oprește când nu e activ) sau $7/lună pentru "Always On"

---

### 4. VPS (DigitalOcean, AWS, etc.)

**Pași:**
1. Creează un VPS (cel mai ieftin: $5/lună)
2. Conectează-te prin SSH
3. Instalează Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clonează repository-ul:
   ```bash
   git clone https://github.com/epicjoc-hub/ipj-ls-pr-bzone.git
   cd ipj-ls-pr-bzone/discord-bot
   ```
5. Instalează dependencies:
   ```bash
   npm install
   ```
6. Creează `.env`:
   ```bash
   nano .env
   # Adaugă:
   BOT_TOKEN=tokenul_tau
   SITE_URL=url_site
   ```
7. Instalează PM2 (pentru a rula 24/7):
   ```bash
   npm install -g pm2
   pm2 start index.js --name discord-bot
   pm2 save
   pm2 startup
   ```
8. Bot-ul va rula 24/7! ✅

**Cost:** $5-10/lună

---

### 5. Heroku (Nu mai e gratuit, dar funcționează)

**Pași:**
1. Mergi pe: https://heroku.com
2. Sign up
3. Instalează Heroku CLI
4. În terminal:
   ```bash
   cd discord-bot
   heroku login
   heroku create ipj-discord-bot
   heroku config:set BOT_TOKEN=tokenul_tau
   heroku config:set SITE_URL=url_site
   git push heroku main
   ```
5. Bot-ul va rula 24/7! ✅

**Cost:** $7/lună (nu mai e gratuit)

---

## 🎯 Recomandarea mea:

**Pentru început:** Railway.app sau Render.com (gratuit)
**Pentru producție:** VPS cu PM2 ($5/lună) sau Railway ($5 credit/lună)

---

## 📝 Notă importantă:

Indiferent de serviciu, asigură-te că:
- ✅ Token-ul bot-ului este în variabilele de mediu (nu în cod!)
- ✅ Bot-ul are permisiunile necesare pe Discord
- ✅ Bot-ul este adăugat pe serverul Discord
- ✅ Log-urile sunt monitorizate pentru erori

---

## 🔧 Verificare că bot-ul rulează:

1. Mergi pe Discord
2. Verifică că bot-ul este online (verde în lista de membri)
3. Testează comanda `/panel` în canal

