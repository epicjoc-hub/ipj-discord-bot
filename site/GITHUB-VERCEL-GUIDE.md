# 🚀 Ghid Pas cu Pas: GitHub + Vercel

## Pasul 1: Configurează Git (OBLIGATORIU)

Rulează aceste comenzi în PowerShell (înlocuiește cu datele tale):

```powershell
cd C:\Users\Admin\ipj-los-santos-pr

# Configurează Git cu numele tău
& "C:\Program Files\Git\bin\git.exe" config --global user.name "Numele Tau"

# Configurează Git cu email-ul tău (folosește email-ul de la GitHub)
& "C:\Program Files\Git\bin\git.exe" config --global user.email "email@example.com"
```

**Sau** dacă vrei să folosești doar pentru acest proiect (fără --global):

```powershell
& "C:\Program Files\Git\bin\git.exe" config user.name "Numele Tau"
& "C:\Program Files\Git\bin\git.exe" config user.email "email@example.com"
```

## Pasul 2: Creează Repository pe GitHub

1. **Mergi pe [github.com](https://github.com)** și autentifică-te (sau creează cont dacă nu ai)

2. **Creează un repository nou:**
   - Click pe **"+"** (colțul dreapta sus) → **"New repository"**
   - **Repository name**: `ipj-los-santos-pr` (sau alt nume)
   - **Description**: "Site Relații Publice IPJ Los Santos"
   - **Public** sau **Private** (ambele funcționează)
   - **NU** bifea "Add a README file" (avem deja)
   - **NU** bifea "Add .gitignore" (avem deja)
   - **NU** bifea "Choose a license"
   - Click **"Create repository"**

3. **Copiază URL-ul repository-ului:**
   - Va arăta așa: `https://github.com/username/ipj-los-santos-pr.git`
   - **COPIAZĂ-L** - îl vei folosi în pasul următor

## Pasul 3: Conectează Proiectul la GitHub

După ce ai configurat Git (Pasul 1), rulează:

```powershell
cd C:\Users\Admin\ipj-los-santos-pr

# Adaugă toate fișierele
& "C:\Program Files\Git\bin\git.exe" add .

# Creează primul commit
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit - Site IPJ Los Santos"

# Conectează la repository-ul tău GitHub
# ÎNLOCUIEȘTE cu URL-ul tău real de la GitHub!
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/username/ipj-los-santos-pr.git

# Setează branch-ul principal
& "C:\Program Files\Git\bin\git.exe" branch -M main

# Încarcă codul pe GitHub
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

**Notă**: La `push`, GitHub te va întreba să te autentifici. Poți folosi:
- **Personal Access Token** (recomandat)
- Sau **GitHub Desktop** (mai ușor pentru începători)

## Pasul 4: Creează Personal Access Token (dacă e necesar)

Dacă GitHub cere autentificare:

1. Mergi pe GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token"**
3. Bifează **"repo"** (toate permisiunile repo)
4. Click **"Generate token"**
5. **COPIAZĂ token-ul** (nu-l vei mai vedea!)
6. Când Git cere parolă, folosește token-ul în loc de parolă

## Pasul 5: Deploy pe Vercel

### Opțiunea A: Prin Interfață Web (Recomandat - Cel mai ușor)

1. **Mergi pe [vercel.com](https://vercel.com)**
   - Click **"Sign Up"**
   - Alege **"Continue with GitHub"** (cel mai ușor)

2. **Autorizează Vercel:**
   - Vercel va cere permisiuni pentru GitHub
   - Click **"Authorize"**

3. **Importă proiectul:**
   - Click pe **"Add New..."** → **"Project"**
   - Vei vedea lista de repository-uri GitHub
   - Găsește **"ipj-los-santos-pr"**
   - Click **"Import"**

4. **Configurare proiect:**
   - **Framework Preset**: Next.js (ar trebui să fie deja detectat)
   - **Root Directory**: `./` (lasă default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
   - Click **"Deploy"**

5. **Așteaptă deploy-ul:**
   - Vercel va construi site-ul (1-2 minute)
   - Vei vedea progresul în timp real

6. **Obține URL-ul:**
   - După deploy, vei primi un URL: `ipj-los-santos-pr.vercel.app`
   - **Site-ul tău este LIVE!** 🎉

### Opțiunea B: Prin Vercel CLI

```powershell
cd C:\Users\Admin\ipj-los-santos-pr

# Login în Vercel
npx vercel login

# Deploy
npx vercel

# Urmează instrucțiunile:
# - Set up and deploy? Y
# - Which scope? (selectează contul tău)
# - Link to existing project? N
# - Project name? ipj-los-santos-pr
# - Directory? ./
# - Override settings? N
```

## Pasul 6: Actualizări Automate

De acum înainte, **orice modificare**:

1. Editează codul local
2. Commit și push:
   ```powershell
   cd C:\Users\Admin\ipj-los-santos-pr
   & "C:\Program Files\Git\bin\git.exe" add .
   & "C:\Program Files\Git\bin\git.exe" commit -m "Descriere modificări"
   & "C:\Program Files\Git\bin\git.exe" push
   ```
3. **Vercel va redeploya automat** în 1-2 minute!

## 🔐 Admin Panel

După deploy, accesează:
- **Site**: `https://ipj-los-santos-pr.vercel.app`
- **Admin**: `https://ipj-los-santos-pr.vercel.app/admin`
- **Parolă**: `admin123` sau `ipj2024`

**IMPORTANT**: Schimbă parola în producție! (vezi `app/admin/page.tsx`)

## ✅ Checklist

- [ ] Git configurat (nume + email)
- [ ] Repository creat pe GitHub
- [ ] Cod încărcat pe GitHub
- [ ] Cont Vercel creat
- [ ] Proiect conectat la Vercel
- [ ] Deploy reușit
- [ ] Site-ul funcționează
- [ ] Admin Panel accesibil

## 🆘 Probleme?

### Git nu funcționează
- Verifică că Git este instalat: `& "C:\Program Files\Git\bin\git.exe" --version`
- Dacă nu, reinstalează Git: https://git-scm.com/download/win

### Push eșuează
- Verifică că ai Personal Access Token
- Sau folosește GitHub Desktop (mai ușor)

### Vercel nu găsește repository-ul
- Verifică că ai autorizat Vercel să acceseze GitHub
- Verifică că repository-ul este public sau că ai dat acces Vercel-ului

### Build eșuează pe Vercel
- Verifică logs-urile în Vercel Dashboard
- Testează build local: `npm run build`

---

**Succes! 🚀**

