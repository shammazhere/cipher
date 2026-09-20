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

---

## 4. Engineering Architecture & System Pillars

### 1. Custom React Hooks Architecture (`src/hooks/`)
The platform decouples state and side-effects from UI presentation via modular, single-responsibility custom hooks:
- **`useSecureForm`**: Fortress-grade form state management with XSS sanitization, anti-bot honeypot detection (`_honeypot`), SJEC USN pattern verification (`4SO22CS001`), and cooldown rate-limiting.
- **`usePageSEO`**: Dynamic per-route DOM synchronization for `<title>`, `<meta name="description">`, OpenGraph social graphs, Twitter cards, and canonical links.
- **`useInViewAnimation`**: Performance optimizer combining `IntersectionObserver` with the Page Visibility API to suspend 60 FPS animation loops when off-screen or when the browser tab is minimized.
- **`useTrailingCursor`**: Physics-driven dual-ring mouse reticle (Lerp 0.16 + echo ring 0.112) that morphs into an inspection lens over interactive elements without triggering React re-renders.
- **`useAdminCMS`**: Content management coordinator with live in-browser entity filtering, tab routing, item reordering, and one-click JSON export/import.
- **`useAdminAuth`**: Master passkey gatekeeper (`cipher@sjec2026`) with brute-force lockout defense and session state persistence.
- **`useSmoothScroll`**: Inertial momentum scrolling powered by Lenis with exponential deceleration curves and modal scroll locking.

### 2. Security Baseline
- **Strict XSS Sanitization (`src/utils/sanitize.ts`)**: Converts high-risk characters (`&`, `<`, `>`, `"`, `'`, `/`) into HTML character entities to neutralize script injection and payload execution.
- **Anti-Bot Honeypot Defense**: An invisible honeypot field catches automated web scrapers and spam bots, silently rejecting bot submissions.
- **Strict Regex Validation**: Enforces standard SJEC/VTU student IDs (`^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$`) and RFC-compliant student emails.
- **Payload Length Clamping**: Enforces strict character limits on student applications to prevent memory exhaustion.
- **Security Headers**: `X-Content-Type-Options: nosniff` and `referrer: strict-origin-when-cross-origin` prevent MIME sniffing and protect referrer telemetry.
- **Zero Exposed Secrets**: No private API keys or database credentials exist in client bundles.

### 3. Performance Engineering
- **Asset Compression & Modern Formats**: Slashed image payloads from ~24.4 MB to lightweight progressive assets and ultra-efficient WebP siblings (<100 KB per leader portrait, <150 KB per event photo).
- **Adaptive 60 FPS Canvas Rendering**: Simplex noise topography canvas automatically pauses during tab switches and off-screen scrolls, dropping GPU/CPU utilization to zero.
- **Direct DOM Coordinate Transforms**: Cursor coordinates bypass React state cycles and write directly to `style.transform = translate3d(...)` with passive mouse listeners for 120 FPS display fluidity.
- **Route-Based Code Splitting**: Heavy modules (`AdminDashboard`, `AdminAuthGate`, `ComponentLibraryPage`) are code-split with `React.lazy` and `Suspense`, keeping initial public bundle sizes ultra-lean.
- **Manual Vendor Chunking in Vite**: Separate cached chunks for `vendor-react`, `vendor-motion`, `vendor-lenis`, and `vendor-icons`.

### 4. SEO & Meta Tags
- **Dynamic Route Metadata**: Route changes dynamically update document title and description for search crawler indexation.
- **Social Graph Cards**: OpenGraph and Twitter summary cards for rich link unfurling on LinkedIn, WhatsApp, and Discord.
- **Canonical URL Protection**: Maintains canonical link tags preventing duplicate indexation penalties.
- **Rich Schema.org JSON-LD**: Embedded structured data for `EducationalOrganization`, `CollegeOrUniversity` (SJEC), `WebSite`, `BreadcrumbList`, and `Event` schemas for *Lumière* and *PromptOps*.
- **XML Sitemap & Robots.txt**: Structured `sitemap.xml` listing all 5 mandatory routes with change frequencies and priorities.

### 5. Easy Content Updates (Decoupled Data Layer & Admin CMS)
- **100% Decoupled JSON Data (`src/data/`)**:
  - `events.json`: Flagship event metadata, schedules, and photo arrays.
  - `leadership.json`: Executive council portraits, bios, and verified social handles.
  - `archive.json`: Historical catalog of 17+ department workshops and symposiums.
  - `domains.json`: The 4 technical development tracks.
  - `siteConfig.json`: Department metadata, council emails, and social links.
- **In-Browser Admin CMS (`/#admin`)**:
  - Live in-place editing, item position reordering (Move Up / Move Down), and `localStorage` persistence.
  - One-click **Export JSON** to commit changes directly to Git, and **Import JSON** to load updated payloads.
- **Non-Technical Maintenance Manual (`src/data/README.md`)**: Plain-language guide for non-developers on updating photos and JSON files.

### 6. Code Optimization & Quality Standards
- **Zero Emoji Rule**: Exclusively uses clean vector SVG icons via `lucide-react`.
- **Memory Leak Defense**: All event listeners, timers, and `requestAnimationFrame` loops are cleanly unmounted.
- **Strict TypeScript Typing**: Full interface contracts in `src/types/index.ts` eliminate runtime shape defects.
- **CSS GPU Acceleration**: Utilizes `translate3d`, `will-change`, and hardware-accelerated CSS backdrops for 60 FPS transitions.


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
