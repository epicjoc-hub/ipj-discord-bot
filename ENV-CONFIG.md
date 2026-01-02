# Environment Variables Configuration Guide

## Bot Configuration (Render)

Setează următoarele variabile de mediu în Render pentru bot:

### Required Variables
- **BOT_TOKEN**: Token-ul Discord bot-ului tău
- **SITE_URL**: `https://ipjls-bzone.vercel.app`
- **VERIFY_SECRET**: `0e8ae1ee1c69fcfe416671c9fa64e023fb0d5f19d4e3a0e4d384c746c3ee8e42`
- **PORT**: `3000` (sau portul configurat în Render)

### Steps in Render Dashboard
1. Mergi la dashboard-ul Render → selectează serviciul bot
2. Environment → Add Environment Variable
3. Adaugă fiecare variabilă cu valorile de mai sus
4. Deploy serviciul după adăugare

---

## Site Configuration (Vercel)

Setează următoarele variabile de mediu în Vercel pentru site:

### Required Variables
- **BOT_API_URL**: URL-ul bot-ului tău din Render (ex: `https://ipj-discord-bot.onrender.com`)
- **VERIFY_SECRET**: `0e8ae1ee1c69fcfe416671c9fa64e023fb0d5f19d4e3a0e4d384c746c3ee8e42` (același ca la bot!)
- **NEXT_PUBLIC_API_URL**: `https://ipjls-bzone.vercel.app`

### Steps in Vercel Dashboard
1. Mergi la dashboard-ul Vercel → selectează proiectul
2. Settings → Environment Variables
3. Adaugă fiecare variabilă:
   - Key: numele variabilei
   - Value: valoarea
   - Environment: Production, Preview, Development (selectează toate)
4. Redeploy proiectul după adăugare

---

## Security Note

⚠️ **IMPORTANT**: `VERIFY_SECRET` trebuie să fie IDENTIC în ambele platforme (Render și Vercel) pentru ca autentificarea să funcționeze. Aceasta este cheia secretă care autentifică comunicarea între bot și site.

Dacă vrei să schimbi secret-ul, generează unul nou cu:
```bash
openssl rand -hex 32
```

---

## Testing Local Development

Pentru dezvoltare locală, creează un fișier `.env` în root-ul proiectului cu variabilele din `.env.example` și actualizează cu valorile tale.

### Bot (.env in /bot)
```
BOT_TOKEN=your_token
SITE_URL=http://localhost:3001
VERIFY_SECRET=0e8ae1ee1c69fcfe416671c9fa64e023fb0d5f19d4e3a0e4d384c746c3ee8e42
PORT=3000
```

### Site (.env.local in /site)
```
BOT_API_URL=http://localhost:3000
VERIFY_SECRET=0e8ae1ee1c69fcfe416671c9fa64e023fb0d5f19d4e3a0e4d384c746c3ee8e42
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Verification

După configurare, testează autentificarea:

1. În Discord, folosește comanda `/panel`
2. Click pe "Accesează Panel Admin"
3. Vei primi un link în DM
4. Click pe link - ar trebui să fii autentificat și redirecționat la `/admin/dashboard`

Dacă primești eroare "Token invalid sau expirat", verifică că:
- `BOT_API_URL` în Vercel pointează corect la bot-ul din Render
- `VERIFY_SECRET` este identic în ambele platforme
- Bot-ul este pornit și accesibil (verifică `/health` endpoint)
