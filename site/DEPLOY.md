# 🚀 Ghid Complet de Deploy - Site IPJ Los Santos

## Deploy Gratuit pe Vercel (Recomandat)

### Pasul 1: Pregătire Cod pe GitHub

1. **Creează cont GitHub** (dacă nu ai deja)
   - Mergi pe [github.com](https://github.com)
   - Sign up gratuit

2. **Creează un repository nou**
   - Click pe "+" → "New repository"
   - Nume: `ipj-los-santos-pr` (sau alt nume)
   - Public sau Private (ambele funcționează)
   - **NU** bifea "Initialize with README" (avem deja README)
   - Click "Create repository"

3. **Încarcă codul în GitHub**

   Deschide PowerShell/CMD în folderul proiectului și rulează:

   ```powershell
   # Inițializează Git (dacă nu e deja)
   git init

   # Adaugă toate fișierele
   git add .

   # Creează primul commit
   git commit -m "Initial commit - Site IPJ Los Santos"

   # Conectează la repository-ul tău GitHub
   # Înlocuiește USERNAME cu username-ul tău GitHub
   git remote add origin https://github.com/USERNAME/ipj-los-santos-pr.git

   # Încarcă codul
   git branch -M main
   git push -u origin main
   ```

   **Notă**: Dacă e prima dată, GitHub te va întreba să te autentifici.

### Pasul 2: Deploy pe Vercel

1. **Creează cont Vercel**
   - Mergi pe [vercel.com](https://vercel.com)
   - Click "Sign Up"
   - Alege "Continue with GitHub" (cel mai ușor)

2. **Conectează GitHub**
   - Vercel va cere permisiuni pentru GitHub
   - Autorizează accesul

3. **Creează proiect nou**
   - Click pe "Add New..." → "Project"
   - Selectează repository-ul `ipj-los-santos-pr`
   - Click "Import"

4. **Configurare proiect**
   - Vercel detectează automat Next.js
   - Framework Preset: **Next.js** (ar trebui să fie deja selectat)
   - Root Directory: `./` (lasă default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Deploy!**
   - Click "Deploy"
   - Așteaptă 1-2 minute
   - Site-ul va fi live!

6. **Obține URL-ul**
   - După deploy, vei primi un URL: `ipj-los-santos-pr.vercel.app`
   - Poți accesa site-ul imediat!

### Pasul 3: Actualizări Automate

De acum înainte, **orice modificare** pe care o faci:

1. Editează codul local
2. Commit și push pe GitHub:
   ```powershell
   git add .
   git commit -m "Descriere modificări"
   git push
   ```
3. Vercel va redeploya automat site-ul în 1-2 minute!

## 🔐 Configurare Admin Panel

### Schimbare Parolă

1. Deschide `app/admin/page.tsx`
2. Găsește linia:
   ```typescript
   if (password === 'admin123' || password === 'ipj2024') {
   ```
3. Schimbă parola:
   ```typescript
   if (password === 'PAROLA_TA_NOUA') {
   ```
4. Commit și push pe GitHub
5. Vercel va actualiza automat

### Parolă Mai Sigură (Opțional)

Pentru securitate mai bună, poți folosi variabile de mediu:

1. În Vercel Dashboard → Settings → Environment Variables
2. Adaugă: `ADMIN_PASSWORD` = `parola_ta`
3. În cod, folosește `process.env.ADMIN_PASSWORD`

## 🌐 Domeniu Personalizat (Opțional)

### Pasul 1: Cumpără Domeniu

- Cumpără un domeniu de la:
  - [Namecheap](https://namecheap.com)
  - [GoDaddy](https://godaddy.com)
  - [Google Domains](https://domains.google)

### Pasul 2: Configurează în Vercel

1. În Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Introdu domeniul (ex: `ipj-los-santos.ro`)
4. Urmează instrucțiunile pentru DNS

### Pasul 3: Configurare DNS

În panoul de control al domeniului, adaugă:

**Tip A Record:**
- Name: `@` sau domeniul tău
- Value: IP-ul de la Vercel (va fi afișat în instrucțiuni)

**Sau CNAME:**
- Name: `@` sau `www`
- Value: `cname.vercel-dns.com`

După 24-48 de ore, domeniul va funcționa!

## 📧 Configurare Formular Contact

### Opțiunea 1: Resend (Recomandat - Gratuit până la 3000 emailuri/lună)

1. Creează cont pe [resend.com](https://resend.com)
2. Obține API key
3. Creează `app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  try {
    await resend.emails.send({
      from: 'contact@ipj-los-santos.ro',
      to: 'destinatar@email.com',
      subject: `Contact: ${subject}`,
      html: `
        <h2>Mesaj nou de la ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subiect:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la trimitere' }, { status: 500 });
  }
}
```

4. Adaugă în Vercel Environment Variables:
   - `RESEND_API_KEY` = API key-ul tău

5. Actualizează `components/ContactForm.tsx` să folosească API-ul

### Opțiunea 2: EmailJS (Gratuit)

1. Creează cont pe [emailjs.com](https://emailjs.com)
2. Configurează template
3. Folosește SDK-ul EmailJS în formular

## 🖼️ Adăugare Imagini

### Metoda 1: Direct în Repository

1. Adaugă imagini în `public/images/`
2. Commit și push pe GitHub
3. Folosește path-ul: `/images/nume-folder/nume-imagine.jpg`

### Metoda 2: Cloud Storage (Recomandat pentru multe imagini)

1. **Cloudinary** (gratuit până la 25GB)
   - Creează cont pe [cloudinary.com](https://cloudinary.com)
   - Upload imagini
   - Folosește URL-urile în JSON

2. **Vercel Blob Storage**
   - Integrat cu Vercel
   - Perfect pentru Next.js

## 📊 Analytics (Opțional)

### Vercel Analytics (Gratuit)

1. În Vercel Dashboard → Project → Analytics
2. Activează Vercel Analytics
3. Adaugă în `app/layout.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   // În componentă
   <Analytics />
   ```

### Google Analytics

1. Creează cont Google Analytics
2. Obține Tracking ID
3. Adaugă în `app/layout.tsx`

## ✅ Checklist Pre-Deploy

- [ ] Toate dependențele instalate (`npm install`)
- [ ] Site-ul rulează local (`npm run dev`)
- [ ] Build reușit (`npm run build`)
- [ ] Parola admin schimbată
- [ ] Imagini adăugate (sau path-uri corecte)
- [ ] Informații de contact actualizate
- [ ] Cod încărcat pe GitHub
- [ ] Deploy pe Vercel reușit

## 🆘 Probleme Comune

### Build Fails pe Vercel

- Verifică că toate dependențele sunt în `package.json`
- Verifică erorile în Vercel logs
- Testează build local: `npm run build`

### Imagini Nu Se Încarcă

- Verifică că sunt în `public/images/`
- Verifică path-urile în JSON (trebuie să înceapă cu `/`)
- Verifică că imaginile sunt commit-uite pe GitHub

### Admin Panel Nu Funcționează

- Șterge cache-ul browserului
- Verifică că ești autentificat
- Verifică consola browser pentru erori

## 📞 Suport

Pentru probleme sau întrebări:
- Verifică [Vercel Documentation](https://vercel.com/docs)
- Verifică [Next.js Documentation](https://nextjs.org/docs)
- Contactează echipa de dezvoltare

---

**Succes cu deploy-ul! 🎉**

