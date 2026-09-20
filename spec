Markdown

# TASK: Pixel-Perfect Build & System Architecture — CIPHER SJEC Portal

You are an expert full-stack engineer and design systems architect. Reconstruct the complete, pixel-for-pixel web application of the CIPHER student association (Department of Computer Science & Engineering, St. Joseph Engineering College) as captured in the source walkthrough, adhering strictly to the Build Blazer 3rd-Year Build Hackathon standards.

---

### 1. Mandatory Technical Constraints & Rules
1. Framework: Astro (v4+) with TypeScript and React islands (`client:load`, `client:visible`).
2. CSS & Styling: Tailwind CSS configured with custom scanline, CRT, glow, and terminal aesthetics.
3. Smooth Scrolling: Lenis smooth scroll initialized on the window root.
4. Static Content Decoupling (Hackathon Rule - 10% Score): All data for events, leadership, domains, and archive must reside strictly in JSON files under `src/data/` (or Astro Content Collections). Zero hardcoded card content in page templates.
5. Form Security & Sanitization (Hackathon Rule - 15% Score): All form input fields (`name`, `email`, `message`) must be strictly sanitized against XSS, input-validated, and handle loading/success states cleanly. No exposed secrets or mock API credentials.
6. Build Quality: The project must compile cleanly with `npm run build` with zero TypeScript errors or missing imports.

---

### 2. Design System & Theme Specifications

- Color Palette:
  * Pure Canvas: `#050807`
  * Card Background: `#0a0f0d`
  * Card Hover: `#0e1613`
  * Terminal Neon Accent: `#00ff66`
  * Secondary Green: `#00cc52`
  * Dim Green / Muted Text: `#6b8a78`
  * Card Border Subtle: `rgba(0, 255, 102, 0.18)`
  * Card Border Highlight: `rgba(0, 255, 102, 0.6)`
- Fonts:
  * Headers, tags, buttons, metrics: `font-mono` ('JetBrains Mono', 'Fira Code', monospace).
  * Long-form descriptive copy: `font-sans` ('Inter', sans-serif).
- Background Texture:
  * Global 24px subtle dot matrix background (`radial-gradient(#00ff66 1px, transparent 1px)`).
  * Subtle horizontal scanlines overlay across cards and modals.

---

### 3. Exhaustive Data Definitions (`src/data/`)

Create the exact JSON files:

#### `src/data/leadership.json`
```json
[
  {
    "id": "nazmin",
    "name": "Nazmin Ziya",
    "role": "TREASURER",
    "image": "[https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80)",
    "github": "[https://github.com](https://github.com)",
    "linkedin": "[https://linkedin.com](https://linkedin.com)"
  },
  {
    "id": "jeslin",
    "name": "Jeslin Ninora",
    "role": "JOINT TREASURER",
    "image": "[https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80)",
    "github": "[https://github.com](https://github.com)",
    "linkedin": "[https://linkedin.com](https://linkedin.com)"
  },
  {
    "id": "elston",
    "name": "Elston Herold Pereira",
    "role": "PRESIDENT",
    "image": "[https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80)",
    "github": "[https://github.com](https://github.com)",
    "linkedin": "[https://linkedin.com](https://linkedin.com)"
  },
  {
    "id": "raynell",
    "name": "Raynell Lewis",
    "role": "VICE PRESIDENT",
    "image": "[https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80)",
    "github": "[https://github.com](https://github.com)",
    "linkedin": "[https://linkedin.com](https://linkedin.com)"
  }
]

src/data/events.json
JSON

[
  {
    "id": "lumiere",
    "tag": "BRANCH GALA",
    "date": "29 OCT 2025",
    "venue": "KALAM AUDITORIUM",
    "title": "Lumière — The Gala",
    "description": "The CSE branch entry programme at Kalam Auditorium, themed 'Where Glam Meets Glow.' Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department through a formal gathering centered on the theme 'Where Glam Meets Glow.' The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop.",
    "galleryCount": "08",
    "images": [
      "[https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80)",
      "[https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80)",
      "[https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80)",
      "[https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80)"
    ]
  },
  {
    "id": "prompt-ops",
    "tag": "COMPETITION",
    "date": "25 MAR 2026",
    "venue": "PROMPT ENGINEERING LAB",
    "title": "PROMPT OPS-2K26",
    "description": "Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Rocha, Ms. Jaishma K, and HOD Dr. Melwyn D'Souza, this technical competition focused on prompt engineering and AI tools (mapped to PO4, PO5, PO8, PO11).\n\nTrack 1 (1st Year) featured invitation generation, logo recreation, and image recreation rounds, with Chinmayee, Chris Royston Monteiro, and Deeksha Ravi Moger taking top honors.\n\nTrack 2 (2nd Year) tested students in JSON conversion, Python code debugging, and a Gemini AI security prompt extraction challenge, with Harimurali KS, Venus Suhani D'Lima, and Venisha Snehal D'Souza securing top positions.",
    "galleryCount": "08",
    "images": [
      "[https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80)",
      "[https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80)",
      "[https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80)"
    ]
  }
]

src/data/archive.json
JSON

[
  { "id": "01", "title": "Applied Machine Learning" },
  { "id": "02", "title": "Industrial Visit" },
  { "id": "03", "title": "LaTeX Tool" },
  { "id": "04", "title": "Robotic Process Automation using UiPath" },
  { "id": "05", "title": "HACKTO Future 20" },
  { "id": "06", "title": "How to Win at the Sport of Programming" },
  { "id": "07", "title": "Introduction to Google Crowdsource" },
  { "id": "08", "title": "Educational Session on GitHub" },
  { "id": "09", "title": "Industrial Visit" },
  { "id": "10", "title": "UDAAN Mock Interview" },
  { "id": "11", "title": "Freshers Onboarding Programme" },
  { "id": "12", "title": "Projects Funded by KSCST" },
  { "id": "13", "title": "Generative AI Tools for Research" },
  { "id": "14", "title": "Introduction to Blockchain: Solidity Workshop" },
  { "id": "15", "title": "Star UML" },
  { "id": "16", "title": "Generative AI: Custom Solutions using OpenAI" },
  { "id": "17", "title": "React.js and Node.js Workshop" }
]

4. Component Construction Checklist

    MatrixBoot.tsx (Preloader):

        Full-screen black background (#050807) with falling Matrix code canvas.

        Text terminal typing effect matching exact lines:
        > establishing connection...
        > authenticating access...
        > decrypting CIPHER_v1.0...
        > loading modules... [========] 100%
        > access granted

        Scramble-text transition flashing Greek/cipher glyphs (Φ, Σ, Ψ, Ω, 1, 0, ?, *) before settling onto CIPHER in glowing neon green.

        Bottom right button: [ SKIP > ] with immediate session dismissal. Store sessionStorage.getItem('boot_seen').

    HeroTopography.tsx (Hero Canvas):

        Sine-wave dynamic topological wireframe running at 60 FPS.

        Giant stylized ASCII/Dot-matrix typography spelling CIPHER.

        Subtext: "Student Association of Computer Science & Engineering".

        Dual cyber buttons: JOIN CIPHER -> (solid green) and EXPLORE EVENTS (transparent green-bordered).

    DomainsGrid.astro:

        Monospace category indicator: // WHAT WE DO and glitch text ^Ω# #+>_ <*{.

        Grid cards:

            Card 1: Technical Skill Building (5 SESSIONS) with </> icon.

            Card 2: Leadership & Governance (3 SESSIONS) with crown icon.

            Card 3: Events & Collaboration (8 SESSIONS) with message/users icon.

            Card 4: Industry Readiness (4 SESSIONS) with rocket icon.

        Hover state: Accent border glow and subtle vertical elevation.

    LeadershipSection.tsx:

        Monospace section header: // GOVERNANCE -> Leadership Structure.

        Card deck of 4 executives: Nazmin Ziya (Treasurer), Jeslin Ninora (Joint Treasurer), Elston Herold Pereira (President), Raynell Lewis (Vice President).

        Visual styling: Monospace role labels, grayscale team headshots, Matrix stream texture overlaid on card backgrounds, GitHub and LinkedIn links.

        Click-to-Spotlight: Clicking a card expands an animated modal showcasing their bio, verified links, and an enlarged image.

    EventGalleryModal.tsx:

        Monospace section header: // ACTIVITIES -> Events & Workshops.

        Showcase cards for Lumière — The Gala and PROMPT OPS-2K26.

        Each card has a VIEW GALLERY ↗ button.

        Gallery Modal:

            Header breadcrumbs: CIPHER // ACTIVITIES // [EVENT NAME].

            Split view: Left column displays event date, auditorium tag, and multi-paragraph event report. Right column displays an interactive photo carousel with frame counters (01 / 08), left/right navigation arrows, and image badges.

    ArchiveGrid.astro & EasterEggBackdoor.tsx:

        3-column dense monospace past-activity grid with external diagonal arrows (↗).

        Hidden Easter egg link below grid: Try this: ! @ # < > - - > a.

        Clicking opens the ROOT ACCESS terminal popup:
        Plaintext

        ROOT ACCESS
        > You found the backdoor. Welcome to the inner circle of CIPHER.
        The real code was inside you all along.
        [ CLOSE CONNECTION ]

    JoinForm.tsx:

        Header with glyph scramble Ψ_-_Σ}-Φ<?_ transitioning to Join the Team.

        Secured form with input sanitization:

            NAME: Text input.

            EMAIL: Email input.

            MESSAGE: Textarea.

            Submit CTA: SEND ->.

        Displays real-time validation feedback, character limits, and success transmission banners.

    Complete 5-Page Astro Architecture:

        Provide clean routes for all 5 required pages:

            src/pages/index.astro (Home)

            src/pages/about.astro (About)

            src/pages/team.astro (Leadership)

            src/pages/events.astro (Events & Gallery)

            src/pages/join.astro (Join / Contact Form)

5. Implementation Execution

Produce all configurations (package.json, astro.config.mjs, tailwind.config.mjs, tsconfig.json), the complete component code, and page templates. Do not abbreviate code with placeholders like // same as above or // implement here. Everything must be production-ready and functional.