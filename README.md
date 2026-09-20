# CIPHER — Student Association of Computer Science & Engineering
> Official Web Portal & Student Association Platform | St Joseph Engineering College (SJEC), Mangaluru

Built for the **Build Blazer Hackathon (Phase 2 - Implementation Round)** for the **CIPHER (CSE Association)** track.

---

## 1. Project Overview & Deliverables Checklist

| Requirement | Deliverable Status | Implementation Location |
|---|---|---|
| **5 Mandatory Pages** | Completed | `HomePage`, `AboutPage`, `EventsPage`, `TeamPage`, `JoinPage` (`src/pages/`) |
| **Consistent Branding & Colors** | Completed | Cyberpunk emerald/matrix palette (`#00ff41`, `#050705`, `#c8f7d0`), JetBrains Mono & Inter typography |
| **Clickable Prototype Flow** | Completed | Full bidirectional routing connecting all 5 pages + Component Library + Admin CMS |
| **Component Library Showcase** | Completed | Dedicated showcase page at `/#components` (`src/pages/ComponentLibraryPage.tsx`) |
| **Placeholder Content Pack** | Completed | 31 official assets ingested into `public/` (`leadership/`, `lumiere/`, `promptops/`, `trail/`, `cipher-logo.png`) |
| **Decoupled Data Layer** | Completed | Pure structured JSON in `src/data/` (`events.json`, `leadership.json`, `archive.json`, `domains.json`, `siteConfig.json`) |
| **Safe Input Fields & Security** | Completed | XSS sanitization (`sanitizeInput()`), strict USN & email regex, truncation guard (`src/utils/sanitize.ts`) |
| **Easy Content Updates** | Completed | In-browser Admin CMS (`/#admin`) with live edits, image uploads, and Up/Down position ordering |
| **Zero Emoji Compliance** | Completed | Strictly 0 emojis in code or UI; all icons rendered with vector Lucide SVGs |
| **Custom Tactical Cursor** | Completed | Hardware-synchronized reticle cursor with zero lag, 0.70 lerp, and inspection lens on interactables |

---

## 2. 5 Mandatory Pages Breakdown

1. **Home (`/#home` or `/`)**:
   - Cyberpunk Katakana boot sequence preloader with real-time typewriter progress and skip button.
   - Continuous 60 FPS Simplex noise topographical wireframe contour canvas.
   - Interactive ASCII `CIPHER` hero banner with cursor repulsion physics.
   - Core mission teaser, executive highlights, flagship event showcase, and interactive activity archive.
2. **About (`/#about`)**:
   - CIPHER origins, department affiliation (SJEC CSE), and four strategic pillars: Technical & Development, Cyber Security & Networks, Community & Outreach, and Career & Professional.
   - Interactive mouse-following photo trail showcasing student workshops and hackathons.
   - Department advisory council and faculty mentorship directory.
3. **Events (`/#events`)**:
   - Flagship showcases for **Lumiere** (Annual CSE Gala) and **PromptOps** (AI Prompt Engineering Arena).
   - Category filtering chips (`ALL`, `FLAGSHIP`, `HACKATHON`, `WORKSHOP`) and real-time client-side search.
   - Interactive swipeable Photo Gallery Modal with `01 / 08` pagination counter.
   - Complete historical archive registry of 17 department workshops and symposiums.
4. **Team (`/#team`)**:
   - High-contrast executive portraits with Matrix rain overlays and portfolio spotlights.
   - Modal inspection views for President, Vice President, Secretary, Treasurer, and Joint Treasurer.
   - Complete Student Association Governance Guidelines and annual election charter.
5. **Join & Contact (`/#join`)**:
   - Protected application form for SJEC engineering students.
   - Client-side XSS sanitization, USN format verification (`4SO22CS001`), and local storage persistence.
   - Recruitment FAQ accordion and official department desk contact information.

---

## 3. Additional Value-Added Modules

- **Component Library (`/#components`)**:
  - Live design tokens: button variants (Solid CTA, Ghost, Terminal Outline, Danger), card containers, input states (focused, valid, error), badges, and typography scale.
- **Admin CMS Dashboard (`/#admin`)**:
  - Non-technical club leads can edit event descriptions, upload photos, add leadership members, review submitted applications, and **reorder item positions (Move Up / Move Down)** without touching any code.
- **Easter Egg ROOT ACCESS Terminal (`BackdoorModal`)**:
  - Activated by clicking the command prompt prompt `[ ROOT ACCESS ]` in the archive footer.

---

## 4. Technical Standards & Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with custom cyber tokens and CSS scanline effects
- **Motion & Canvas**: Custom HTML5 Canvas 2D engine for Simplex noise topography & Katakana rain; Framer Motion for modal transitions; Lenis for smooth momentum scrolling
- **Icons**: Lucide React (strictly no emojis)

### Security Baseline
- **Zero Exposed Keys**: Client contains no hardcoded private keys or production secrets.
- **Input Sanitization**: All text input from forms or admin edits passes through `sanitizeInput()` in `src/utils/sanitize.ts`, neutralizing HTML tags, javascript pseudo-protocols, and malicious event attributes.
- **Form Length Clamping**: Prevents memory exhaustion attacks with strict payload limits.

### Content Maintenance for Non-Developers
Non-technical club organizers can modify the website in two ways:
1. **Using the in-browser Admin CMS** at `/#admin` (changes persist in the browser and can be reset anytime).
2. **Editing pure JSON files** in `src/data/`:
   - `src/data/events.json`: Add, edit, or remove club events.
   - `src/data/leadership.json`: Update executive council details.
   - `src/data/archive.json`: Add past workshops.
   - Detailed step-by-step instructions are documented in `src/data/README.md`.

---

## 5. Getting Started Locally

### Prerequisites
- Node.js 18+ and npm

### Installation & Run
```bash
# Clone or open the repository
cd cipher

# Install dependencies
npm install

# Start local development server (runs on http://localhost:3000)
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Deployment Guide

To deploy to **Vercel** or **Netlify**:
```bash
# Using Vercel CLI
npx vercel

# Or push to GitHub and import the repository into Vercel / Netlify dashboard:
# Build Command: npm run build
# Output Directory: dist
```

---

## 7. License & Credits

Organized and maintained by **CIPHER (Student Association of Computer Science & Engineering)**, St Joseph Engineering College, Mangaluru.
Built for the **Build Blazer Hackathon Phase 2**.
