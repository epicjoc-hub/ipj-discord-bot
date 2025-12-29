# 🚀 Cum să adaugi bot-ul pe serverul Discord

## 📋 Pași rapizi:

### 1️⃣ Obține Client ID-ul bot-ului

1. Mergi pe: https://discord.com/developers/applications
2. Loghează-te cu contul tău Discord
3. Click pe aplicația bot-ului tău (sau creează una nouă dacă nu există)
4. În stânga, click pe **"General Information"**
5. Copiază **"Application ID"** (Client ID) - este un număr lung

### 2️⃣ Generează link-ul de invitație

Înlocuiește `YOUR_CLIENT_ID` cu numărul copiat mai sus:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274877906944&scope=bot%20applications.commands
```

**Sau folosește acest link direct** (după ce ai Client ID-ul):
- Deschide: https://discordapi.com/permissions.html#274877906944
- Introdu Client ID-ul
- Click pe "Generate OAuth2 URL"
- Copiază link-ul generat

### 3️⃣ Adaugă bot-ul pe server

1. Deschide link-ul generat în browser
2. Selectează serverul tău Discord (IPJ Los Santos - ID: 1162871509275119637)
3. Click pe **"Authorize"**
4. Completează verificarea dacă este necesară
5. ✅ Bot-ul este acum pe server!

### 4️⃣ Verifică permisiunile

1. Mergi în **Server Settings** → **Roles**
2. Găsește rolul bot-ului
3. Asigură-te că bot-ul are acces la:
   - Canalul: `1455043025817440306`
   - Permisiunea de a trimite mesaje
   - Permisiunea de a folosi slash commands

### 5️⃣ Pornește bot-ul

În terminal, rulează:
```bash
cd discord-bot
npm install
npm start
```

Ar trebui să vezi: `Bot conectat ca [Nume Bot]!`

### 6️⃣ Testează

În canalul Discord, scrie:
```
/panel
```

Bot-ul ar trebui să trimită panel-ul cu butoane! 🎉

---

## 🔧 Dacă nu ai aplicație creată:

1. Mergi pe: https://discord.com/developers/applications
2. Click pe **"New Application"**
3. Dă un nume (ex: "IPJ Los Santos Bot")
4. Click pe **"Bot"** în meniul din stânga
5. Click pe **"Add Bot"**
6. Click pe **"Reset Token"** și copiază token-ul
7. Pune token-ul în `discord-bot/.env`:
   ```
   BOT_TOKEN=tokenul_tau_aici
   ```
8. Înapoi la **"General Information"** și copiază **Application ID**
9. Urmează pașii de mai sus pentru a genera link-ul de invitație

---

## ⚠️ Important:

- Bot-ul trebuie să ruleze continuu (folosește un serviciu de hosting sau PM2)
- Token-ul este secret - nu-l împărtăși!
- Dacă token-ul este compromis, regenerează-l din Discord Developer Portal

---

## 🆘 Probleme comune:

**Bot-ul nu răspunde:**
- Verifică că este online (verde în lista de membri)
- Verifică că token-ul din `.env` este corect
- Verifică că ai permisiunea de a folosi slash commands

**Nu pot adăuga bot-ul:**
- Trebuie să fii Owner sau să ai permisiunea "Manage Server"
- Verifică că ai selectat serverul corect

