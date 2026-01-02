# Site Relații Publice - Inspectoratul de Poliție Județean Los Santos

Site modern de Relații Publice construit cu Next.js, TypeScript și Tailwind CSS.

## 🚀 Caracteristici

- **Design modern și responsive** - Funcționează perfect pe toate dispozitivele
- **Secțiuni complete**: Știri, Echipă, Galerie, Contact, FAQ
- **Admin Panel integrat** - Editare ușoară a conținutului fără cunoștințe tehnice
- **Optimizat pentru SEO** - Găsire ușoară în motoarele de căutare
- **Performanță ridicată** - Next.js cu optimizări automate

## 📋 Cerințe

- Node.js 18+ 
- npm sau yarn

## 🛠️ Instalare

1. Clonează repository-ul sau navighează în folderul proiectului:
```bash
cd ipj-los-santos-pr
```

2. Instalează dependențele:
```bash
npm install
```

3. Pornește serverul de dezvoltare:
```bash
npm run dev
```

4. Deschide [http://localhost:3000](http://localhost:3000) în browser

## 📁 Structura Proiectului

```
ipj-los-santos-pr/
├── app/                    # Pagini Next.js (App Router)
│   ├── admin/              # Admin Panel
│   ├── stiri/              # Secțiunea știri
│   ├── echipa/             # Secțiunea echipă
│   ├── galerie/            # Galerie foto
│   ├── contact/            # Pagina de contact
│   └── faq/                # Întrebări frecvente
├── components/             # Componente React reutilizabile
├── data/                   # Fișiere JSON cu conținut
│   ├── news.json          # Știri
│   ├── officers.json      # Echipă
│   ├── gallery.json       # Galerie
│   └── faq.json           # FAQ
└── public/                 # Fișiere statice (imagini, etc.)
```

## 🔐 Admin Panel

Pentru a accesa Admin Panel-ul:

1. Navighează la `/admin`
2. Parola implicită: `admin123` sau `ipj2024`
3. După autentificare, vei avea acces la:
   - Editare știri
   - Gestionare echipă
   - Editare galerie
   - Gestionare FAQ

**⚠️ Important**: Schimbă parola în producție! Editează `app/admin/page.tsx` și folosește o metodă de autentificare mai sigură.

## 🌐 Deploy pe Vercel (Gratuit)

### Pasul 1: Pregătire Cod

1. Creează un cont pe [GitHub](https://github.com) (gratuit)
2. Creează un repository nou
3. Încarcă codul:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/ipj-los-santos-pr.git
git push -u origin main
```

### Pasul 2: Deploy pe Vercel

1. Creează cont pe [Vercel](https://vercel.com) (gratuit)
2. Click pe "New Project"
3. Conectează repository-ul GitHub
4. Vercel detectează automat Next.js
5. Click "Deploy"

Site-ul va fi live în câteva minute la un URL de tip: `ipj-los-santos-pr.vercel.app`

### Pasul 3: Actualizări Automate

La fiecare push pe GitHub, Vercel va redeploya automat site-ul!

## 📝 Editare Conținut

### Metoda 1: Admin Panel (Recomandat)

1. Accesează `/admin` pe site-ul live
2. Autentifică-te
3. Editează conținutul direct din browser
4. Salvează modificările

**Notă**: În versiunea actuală, modificările din Admin Panel sunt temporare (doar în browser). Pentru salvare permanentă, vezi Metoda 2.

### Metoda 2: Editare Directă în GitHub

1. Mergi pe repository-ul GitHub
2. Navighează la `data/news.json` (sau alt fișier JSON)
3. Click "Edit" (iconița creion)
4. Editează conținutul
5. Commit changes
6. Vercel va redeploya automat site-ul

### Metoda 3: Local Development

1. Clonează repository-ul local
2. Editează fișierele JSON din `data/`
3. Commit și push pe GitHub
4. Vercel redeployează automat

## 🖼️ Adăugare Imagini

1. Adaugă imaginile în folderul `public/images/`
2. Structură recomandată:
   ```
   public/
   ├── images/
   │   ├── news/          # Imagini pentru știri
   │   ├── officers/      # Fotografii ofițeri
   │   └── gallery/       # Imagini galerie
   ```

3. Folosește path-ul relativ în JSON: `/images/news/nume-imagine.jpg`

## 🔧 Configurare Domeniu Personalizat (Opțional)

1. În Vercel Dashboard, mergi la Settings → Domains
2. Adaugă domeniul tău (ex: `ipj-los-santos.ro`)
3. Urmează instrucțiunile pentru configurare DNS

## 📧 Formular de Contact

Formularul de contact este funcțional, dar în versiunea actuală doar loghează datele în consolă. Pentru funcționalitate completă:

1. Configurează un serviciu de email (SendGrid, Resend, etc.)
2. Creează un API route în `app/api/contact/route.ts`
3. Conectează formularul la API

## 🎨 Personalizare

### Culori

Culorile pot fi modificate în:
- `app/globals.css` - variabile CSS
- Componentele individuale - clase Tailwind

Culori curente:
- Albastru poliție: `#1e3a8a`
- Auriu: `#fbbf24`

### Fonturi

Fontul poate fi schimbat în `app/layout.tsx` (Inter este folosit acum).

## 🐛 Troubleshooting

### Eroare la build
```bash
npm run build
```
Verifică erorile și corectează-le.

### Imagini nu se încarcă
- Verifică că imaginile sunt în `public/images/`
- Verifică path-urile în fișierele JSON

### Admin Panel nu funcționează
- Verifică că ești autentificat (sessionStorage)
- Șterge cache-ul browserului

## 📚 Resurse

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 📄 Licență

Acest proiect este creat pentru Inspectoratul de Poliție Județean Los Santos.

## 🆘 Suport

Pentru întrebări sau probleme, contactează echipa de dezvoltare.

---

**Dezvoltat cu ❤️ pentru IPJ Los Santos**
