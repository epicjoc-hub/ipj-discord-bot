# 📝 Instrucțiuni Manuale - GitHub + Vercel

## PASUL 1: Configurează Git (O singură dată)

Deschide PowerShell și rulează:

```powershell
& "C:\Program Files\Git\bin\git.exe" config --global user.name "Numele Tau"
& "C:\Program Files\Git\bin\git.exe" config --global user.email "email@example.com"
```

**Înlocuiește:**
- `"Numele Tau"` cu numele tău real
- `"email@example.com"` cu email-ul tău de la GitHub

---

## PASUL 2: Creează Repository pe GitHub

1. Mergi pe **github.com** și autentifică-te
2. Click pe **"+"** (colțul dreapta sus) → **"New repository"**
3. **Repository name**: `ipj-los-santos-pr`
4. **NU** bifea nimic (nici README, nici .gitignore, nici license)
5. Click **"Create repository"**
6. **COPIAZĂ URL-ul** (va arăta: `https://github.com/username/ipj-los-santos-pr.git`)

---

## PASUL 3: Încarcă Codul pe GitHub

Deschide PowerShell în folderul proiectului și rulează:

```powershell
cd C:\Users\Admin\ipj-los-santos-pr

# Adaugă toate fișierele
& "C:\Program Files\Git\bin\git.exe" add .

# Creează commit
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit"

# Conectează la GitHub (ÎNLOCUIEȘTE cu URL-ul tău!)
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/username/ipj-los-santos-pr.git

# Setează branch principal
& "C:\Program Files\Git\bin\git.exe" branch -M main

# Încarcă pe GitHub
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

**La `push`, GitHub va cere autentificare:**
- Dacă ai 2FA activat, folosește un **Personal Access Token** (vezi mai jos)
- Dacă nu, folosește parola ta GitHub

---

## PASUL 4: Personal Access Token (dacă e necesar)

Dacă GitHub cere token:

1. Mergi pe GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. **Note**: "Vercel Deploy"
4. Bifează **"repo"** (toate permisiunile)
5. Click **"Generate token"**
6. **COPIAZĂ token-ul** (nu-l vei mai vedea!)
7. Când Git cere parolă, **folosește token-ul** în loc de parolă

---

## PASUL 5: Deploy pe Vercel

1. Mergi pe **vercel.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Autorizează Vercel să acceseze GitHub
4. Click **"Add New..."** → **"Project"**
5. Găsește **"ipj-los-santos-pr"** în listă
6. Click **"Import"**
7. Lasă toate setările default (Next.js este detectat automat)
8. Click **"Deploy"**
9. Așteaptă 1-2 minute
10. **GATA!** Site-ul tău este live la: `https://ipj-los-santos-pr.vercel.app`

---

## Actualizări Viitoare

Când vrei să actualizezi site-ul:

```powershell
cd C:\Users\Admin\ipj-los-santos-pr

# Adaugă modificările
& "C:\Program Files\Git\bin\git.exe" add .

# Creează commit
& "C:\Program Files\Git\bin\git.exe" commit -m "Descriere modificări"

# Încarcă pe GitHub
& "C:\Program Files\Git\bin\git.exe" push
```

Vercel va redeploya automat în 1-2 minute!

---

## Admin Panel

După deploy, accesează:
- **Site**: `https://ipj-los-santos-pr.vercel.app`
- **Admin**: `https://ipj-los-santos-pr.vercel.app/admin`
- **Parolă**: `admin123` sau `ipj2024`

---

**Gata! Asta e tot! 🎉**

