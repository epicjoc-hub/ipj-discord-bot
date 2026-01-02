# Configurare Variabile de Mediu în Vercel

## Variabile necesare pentru site (Vercel)

Accesează Vercel Dashboard → Proiectul tău → Settings → Environment Variables

Adaugă următoarele variabile:

### 1. BOT_API_URL
- **Valoare:** `https://ipj-discord-bot.onrender.com`
- **Descriere:** URL-ul bot-ului Discord hosted pe Render
- **Environment:** Production, Preview, Development

### 2. VERIFY_SECRET
- **Valoare:** Același secret ca cel din Render (găsește în Render → Environment)
- **Descriere:** Secret pentru autentificarea cererilor între site și bot
- **Environment:** Production, Preview, Development

### 3. NEXTAUTH_URL (dacă folosești NextAuth)
- **Valoare:** `https://ipjls-bzone.vercel.app`
- **Descriere:** URL-ul site-ului
- **Environment:** Production

### 4. NEXTAUTH_SECRET (dacă folosești NextAuth)
- **Valoare:** Generează cu: `openssl rand -base64 32`
- **Descriere:** Secret pentru NextAuth
- **Environment:** Production, Preview, Development

## După configurare:

1. Redeploy proiectul în Vercel pentru a aplica noile variabile
2. Testează formularul de cerere eveniment
3. Verifică logurile în Vercel → Deployment → Function Logs

## Debugging:

Dacă primești eroare "Server misconfigured":
- Verifică că BOT_API_URL și VERIFY_SECRET sunt setate în Vercel
- Verifică că valorile sunt corecte (fără spații sau caractere ascunse)
- Asigură-te că VERIFY_SECRET din Vercel este identic cu cel din Render

Dacă primești eroare "Eroare la crearea cererii":
- Verifică că bot-ul rulează pe Render
- Verifică că BOT_API_URL este accesibil public
- Verifică logurile din Render pentru erori
