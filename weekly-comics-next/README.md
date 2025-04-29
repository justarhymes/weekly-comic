# Weekly Comics Frontend

Frontend for the Weekly Comics platform. Built with Next.js using the App Router, TailwindCSS, and framer-motion for modern UX and animations.

---

## Setup

### 1. Navigate to the frontend directory
```bash
cd weekly-comics-next
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run the development server
```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Features

- Browse weekly comic releases
- Blurred image placeholders for smooth loading
- Fade-up and staggered animations
- Accessible and responsive design
- SEO enhancements (dynamic metadata)

---

## Notes

- Comic images use Next.js `<Image>` with dynamic `blurDataURL`.
- Animations use `framer-motion` with viewport triggering.
- Accessibility and semantic HTML are prioritized.
- Built with performance and polish in mind.

