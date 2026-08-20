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

## 🧪 Testing

### Unit Tests

Unit tests are located in the `src/__tests__` directory and utilize Jest. To run these tests:

```bash
npm run test:unit
```

This command executes all unit tests without initiating Playwright tests.

### End-to-End (E2E) Tests

E2E tests are situated in the `e2e/` directory and employ Playwright. To execute these tests:

```bash
npx playwright test
```

To run a specific E2E test file:

```bash
npx playwright test e2e/comic-detail.spec.ts
```

### Test Artifacts

Running Playwright tests generates artifacts in the `test-results/` directory, including `.last-run.json`. To prevent these artifacts from being committed to the repository, ensure the following entry exists in your `.gitignore` file:

```gitignore
test-results/
```

This addition helps maintain a clean repository by excluding test artifacts from version control.


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

