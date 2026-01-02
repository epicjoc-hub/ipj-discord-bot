Pași rapizi pentru deploy pe Render

1. Conectează-ți contul GitHub la Render și importă repository-ul `epicjoc-hub/ipj-discord-bot`.
2. Alege tipul serviciului: "Web Service" — botul expune un endpoint HTTP pentru verificarea token-urilor (`/verify`).
3. Setări recomandate în UI (sau folosește `render.yaml` din repo):
   - Branch: `main`
   - Build command: `npm install`
   - Start command: `npm start`
   - Port: setează `PORT` (ex: `3000`) dacă e necesar
4. Adaugă variabile de mediu (Settings → Environment):
   - `BOT_TOKEN` = token-ul botului tău (secret)
   - `SITE_URL` = (opțional) URL pentru panel
   - `PORT` = `3000` (sau lasă default)
      - `VERIFY_SECRET` = un secret comun între site și bot (ex: generează un string lung)
5. Activează `Auto Deploy` ca să se redeploy-eze la push.
6. Deploy — Render va rula `npm start` (folosește `index.js` din repository). După deploy, poți verifica endpoint-ul:

   - `GET https://<your-service>.onrender.com/health`
   - `GET https://<your-service>.onrender.com/verify?token=<token>` (folosit de site pentru a valida token-urile generate de bot)

   Securizează apelul `/verify` cu headerul `x-verify-secret`:

   Exemplu server-side (site) — adaugă header când apelezi botul:

   ```javascript
   // Node fetch example
   const res = await fetch(`https://<your-bot>.onrender.com/verify?token=${encodeURIComponent(token)}`, {
      headers: {
         'x-verify-secret': process.env.VERIFY_SECRET
      }
   });
   const data = await res.json();
   ```

   Setează același `VERIFY_SECRET` în Render (serviciul bot) și în hosting-ul site-ului (Vercel/Render) ca variabilă de mediu, astfel încât doar site-ul tău să poată verifica token-urile.

Notes:
- Dacă preferi control total, poți folosi un `Dockerfile` în loc de configurarea Node.
- Monitorizează logs în dashboard-ul Render pentru erori la pornire.
