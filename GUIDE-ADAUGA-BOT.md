# Ghid: Cum să adaugi bot-ul pe serverul Discord

## Pas 1: Obține Client ID-ul bot-ului

1. Mergi pe [Discord Developer Portal](https://discord.com/developers/applications)
2. Loghează-te cu contul tău Discord
3. Selectează aplicația bot-ului tău (sau creează una nouă dacă nu există)
4. În secțiunea **"General Information"**, copiază **"Application ID"** (Client ID)

## Pas 2: Generează link-ul de invitație

Înlocuiește `YOUR_CLIENT_ID` cu Client ID-ul copiat mai sus în următorul link:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274877906944&scope=bot%20applications.commands
```

**Permisiuni incluse:**
- ✅ Send Messages
- ✅ Embed Links
- ✅ Read Message History
- ✅ Use Slash Commands
- ✅ Use External Emojis
- ✅ Manage Messages

## Pas 3: Adaugă bot-ul pe server

1. Deschide link-ul generat în browser
2. Selectează serverul tău Discord (IPJ Los Santos)
3. Click pe **"Authorize"**
4. Completează verificarea CAPTCHA dacă este necesară
5. Bot-ul va apărea în lista de membri (offline până când îl pornești)

## Pas 4: Verifică permisiunile bot-ului

1. Mergi în **Server Settings** → **Roles**
2. Găsește rolul bot-ului (de obicei are același nume ca aplicația)
3. Asigură-te că bot-ul are acces la:
   - Canalul unde vrei să trimiți panel-ul (Channel ID: 1455043025817440306)
   - Permisiunea de a trimite mesaje
   - Permisiunea de a folosi slash commands

## Pas 5: Pornește bot-ul

1. Deschide terminalul în folderul `discord-bot`
2. Rulează:
   ```bash
   npm install
   npm start
   ```
3. Ar trebui să vezi mesajul: `Bot conectat ca [Nume Bot]!`

## Pas 6: Testează bot-ul

1. Mergi în canalul configurat (Channel ID: 1455043025817440306)
2. Scrie `/panel` și apasă Enter
3. Bot-ul ar trebui să trimită panel-ul cu butoane

## Verificare Role Admin

Pentru ca butonul "Accesează Panel Admin" să funcționeze:

1. Mergi în **Server Settings** → **Roles**
2. Găsește role-ul cu ID-ul: `1179052940351246357`
3. Asigură-te că utilizatorii care trebuie să aibă acces admin au acest role

## Troubleshooting

### Bot-ul nu răspunde la comenzi
- Verifică că bot-ul este online (verde în lista de membri)
- Verifică că ai permisiunea de a folosi slash commands în canal
- Verifică că token-ul din `.env` este corect

### Bot-ul nu poate trimite mesaje
- Verifică permisiunile bot-ului în canal
- Verifică că canalul nu are restricții pentru bot-uri

### Link-ul de invitație nu funcționează
- Verifică că ai copiat corect Client ID-ul
- Verifică că ai permisiunea de a adăuga bot-uri pe server (trebuie să fii Owner sau să ai permisiunea "Manage Server")

## Note Importante

- Bot-ul trebuie să ruleze continuu pentru a funcționa (folosește un serviciu de hosting sau PM2 pentru a-l rula în background)
- Token-ul bot-ului este secret - nu-l împărtăși niciodată
- Dacă token-ul este compromis, regenerează-l din Discord Developer Portal

