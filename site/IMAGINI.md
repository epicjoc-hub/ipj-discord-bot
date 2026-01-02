# 📸 Ghid pentru Imagini

## Structura Folderelor

Creează următoarele foldere în `public/images/`:

```
public/
└── images/
    ├── news/              # Imagini pentru știri
    ├── officers/          # Fotografii ofițeri
    └── gallery/           # Imagini pentru galerie
```

## Imagini Necesare

### Pentru Știri (`public/images/news/`)

Conform `data/news.json`, ai nevoie de:
- `campanie-securitate.jpg`
- `recrutare.jpg`
- `parteneriat.jpg`

### Pentru Echipă (`public/images/officers/`)

Conform `data/officers.json`, ai nevoie de:
- `popescu.jpg`
- `ionescu.jpg`
- `georgescu.jpg`
- `dumitrescu.jpg`

### Pentru Galerie (`public/images/gallery/`)

Conform `data/gallery.json`, ai nevoie de:
- `event1.jpg`
- `event2.jpg`
- `community1.jpg`
- `team1.jpg`
- `workshop1.jpg`
- `school1.jpg`

## Opțiuni pentru Imagini

### Opțiunea 1: Imagini Reale

1. Folosește fotografii reale ale evenimentelor și echipei
2. Optimizează imaginile înainte de upload:
   - Dimensiune recomandată: max 1920x1080px
   - Format: JPG sau WebP
   - Calitate: 80-85% (pentru JPG)
3. Folosește tool-uri online pentru optimizare:
   - [TinyPNG](https://tinypng.com)
   - [Squoosh](https://squoosh.app)

### Opțiunea 2: Imagini Placeholder (Pentru Testare)

Poți folosi servicii de placeholder images:

1. **Placeholder.com**
   - URL: `https://via.placeholder.com/800x600/1e3a8a/ffffff?text=IPJ+Los+Santos`
   - Modifică în JSON temporar pentru testare

2. **Unsplash** (Imagini gratuite)
   - Mergi pe [unsplash.com](https://unsplash.com)
   - Caută: "police", "security", "team"
   - Download imagini gratuite
   - Adaugă în folderul corespunzător

3. **Pexels** (Imagini gratuite)
   - Mergi pe [pexels.com](https://pexels.com)
   - Caută imagini relevante
   - Download și adaugă în proiect

### Opțiunea 3: Generare Automată (Pentru Development)

Poți folosi un script pentru a genera imagini placeholder:

```bash
# Instalează ImageMagick (dacă nu ai)
# Apoi rulează:
mkdir -p public/images/news public/images/officers public/images/gallery

# Generează imagini placeholder (exemplu pentru Windows cu PowerShell)
# Sau folosește un tool online
```

## Dimensiuni Recomandate

- **Știri**: 1200x675px (16:9)
- **Ofițeri**: 800x800px (1:1 - pătrat)
- **Galerie**: 1200x800px (3:2) sau păstrează proporțiile originale

## Format Recomandat

- **JPG** pentru fotografii (mai mic, bună calitate)
- **WebP** pentru optimizare maximă (suportat de Next.js)
- **PNG** doar dacă ai nevoie de transparență

## Next.js Image Optimization

Next.js optimizează automat imaginile când folosești componenta `<Image>`. Asigură-te că:

1. Folosești componenta `Image` din `next/image`
2. Specifici `width` și `height` sau `fill` pentru responsive
3. Folosești `sizes` pentru responsive images

## Exemplu de Utilizare

În componente, imaginile sunt deja configurate corect:

```tsx
<Image
  src="/images/news/campanie-securitate.jpg"
  alt="Campanie securitate"
  width={1200}
  height={675}
  className="object-cover"
/>
```

## Verificare

După ce adaugi imaginile:

1. Verifică că path-urile din JSON corespund cu locația fișierelor
2. Testează local: `npm run dev`
3. Verifică că imaginile se încarcă corect
4. Optimizează dimensiunile dacă e necesar

## Cloud Storage (Opțional)

Pentru multe imagini, consideră:

- **Cloudinary** (gratuit până la 25GB)
- **Vercel Blob Storage**
- **AWS S3**

Apoi folosește URL-urile complete în JSON în loc de path-uri locale.

---

**Notă**: În versiunea actuală, dacă o imagine lipsește, vei vedea o eroare în consolă. Adaugă imaginile sau folosește placeholder-uri pentru testare.

