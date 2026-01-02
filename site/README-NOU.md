# Site Relații Publice - Inspectoratul de Poliție Județean Los Santos

Site modern de Relații Publice cu design îmbunătățit, dark/light theme, animații și funcționalități avansate.

## 🚀 Funcționalități Noi

### Design & UI
- ✅ **Dark/Light Theme** - Toggle pentru schimbarea temei cu persistență
- ✅ **Animații** - Animații smooth cu Framer Motion
- ✅ **Design Modern** - Grafică îmbunătățită cu gradient-uri și shadow effects
- ✅ **Responsive** - Funcționează perfect pe toate dispozitivele

### Pagini Noi
- ✅ **Conducere** - Prezentare echipă de conducere (editabil din admin)
- ✅ **Anunțuri Evenimente** - Listă anunțuri evenimente aprobate
- ✅ **Anunțuri Poliție** - Comunicate, Urgente, Raport Săptămânal
- ✅ **Cerere Eveniment** - Formular complet cu workflow de aprobare
- ✅ **Ghid-uri** - Ghiduri cu link-uri Google Docs și programare teste

### Sistem Cereri Evenimente
- ✅ Formular complet cu validare
- ✅ Workflow aprobare/respingere din admin
- ✅ Istoric complet al tuturor cererilor
- ✅ Notificări Discord automate
- ✅ Generare email în format specificat

### Sistem Programare Teste
- ✅ Formular programare pentru ghiduri
- ✅ Calendar picker în admin
- ✅ Programare cu data, oră și detalii
- ✅ Notificări Discord automate

### Admin Panel Extins
- ✅ Autentificare cu username/password
- ✅ Dashboard cu statistici
- ✅ Gestionare Conducere
- ✅ Gestionare Anunțuri (Evenimente & Poliție)
- ✅ Gestionare Cereri Evenimente (aprobare/respingere)
- ✅ Gestionare Programări Teste (cu calendar)
- ✅ Gestionare Știri, Echipă, Galerie, FAQ

## 📋 Structură Navigare

1. **Acasă** - Pagină principală cu informații generale
2. **Conducere** - Prezentare echipă de conducere
3. **Anunțuri Evenimente** - Evenimente aprobate
4. **Anunțuri Poliție** - Comunicate, Urgente, Raport Săptămânal
5. **Cerere Eveniment** - Formular cerere eveniment
6. **Ghid-uri** - Ghiduri și programare teste
7. **Admin** - Panou de administrare

## 🔐 Admin Panel

### Acces
- URL: `/admin`
- Username: `admin`
- Parolă: `admin123` sau `ipj2024`

### Secțiuni Admin
- **Dashboard** - Overview și statistici
- **Conducere** - Editare conducere
- **Anunțuri Evenimente** - CRUD anunțuri
- **Anunțuri Poliție** - CRUD cu categorii
- **Cereri Evenimente** - Aprobare/Respingere + Istoric
- **Programări Teste** - Calendar + Programare
- **Știri, Echipă, Galerie, FAQ** - Gestionare conținut

## 🔧 Configurare

### Environment Variables

Creează fișierul `.env.local`:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Discord Webhook

1. Mergi pe serverul tău Discord
2. Settings → Integrations → Webhooks
3. Creează un webhook nou
4. Copiază URL-ul și adaugă-l în `.env.local`

## 📝 Formulare

### Cerere Eveniment
- Informații Organizator (Nume, Prenume, Telefon, Discord)
- Informații Eveniment (Tip, Data, Ora, Participanți, Necesități, Descriere)
- Validare completă
- Trimite către admin pentru aprobare

### Programare Teste
- Nume, Prenume, Email, Telefon
- Tip test (Port-Armă / Licență Tractări)
- Trimite către admin pentru programare

## 🎨 Design System

### Culori
- **Primary**: `#1e3a8a` (Albastru poliție)
- **Accent**: `#fbbf24` (Auriu)
- **Background**: Variabil (light/dark)
- **Text**: Variabil (light/dark)

### Animații
- Framer Motion pentru transitions
- Hover effects
- Page transitions
- Loading states

## 📦 Dependențe

- `next` - Framework
- `react` - UI Library
- `framer-motion` - Animații
- `next-themes` - Dark/Light theme
- `react-hook-form` - Form management
- `zod` - Validare
- `react-datepicker` - Calendar picker
- `@headlessui/react` - UI Components
- `@heroicons/react` - Icons

## 🚀 Deploy

### Vercel (Recomandat)

1. Push codul pe GitHub
2. Conectează repository-ul la Vercel
3. Adaugă environment variable `DISCORD_WEBHOOK_URL`
4. Deploy automat!

Site-ul va fi live la: `https://ipj-ls-pr-bzone.vercel.app`

## 📧 Format Email Discord

Email-urile generate pentru Discord urmează formatul:

```
📧 MODEL E-MAIL
📤 Expeditor: relatiipublice@ipjbz.ro
📅 Data: {data}
📎 Către: {nume}@{bzone.ro}
📌 Subiect: APROBARE / RESPINGERE CERERE EVENIMENT
-------------------------------------------------------------
Mesaj: {mesaj}
-------------------------------------------------------------
Cu stimă,
{grad} {nume}
Biroul Relații Publice
```

## 🆘 Suport

Pentru probleme sau întrebări, contactează echipa de dezvoltare.

---

**Dezvoltat cu ❤️ pentru IPJ Los Santos**

