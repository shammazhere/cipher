# CIPHER Content & Photo Management Guide (For Organizers)

Welcome to the CIPHER website data directory! This folder holds all the text, team photos, and events displayed on the site.

---

### How to update photos:
1. Place your new image in the `public/` directory:
   - For leadership team members: put images into `public/leadership/` (e.g. `public/leadership/new_president.png`).
   - For event galleries: put images into `public/lumiere/` or `public/promptops/` or create a new folder under `public/`.
2. Open `src/data/leadership.json` or `src/data/events.json`.
3. Update the `"image"` or `"images"` path to point to your new file (e.g. `"/leadership/new_president.png"`).
4. You can also make these edits directly on the live website using the built-in **Admin Dashboard** (`/admin`) without touching code!

---

### File Overview:
- `leadership.json`: Names, roles, portrait photos, bios, and LinkedIn/GitHub profiles of the executive board.
- `events.json`: Featured flagship events (like Lumière and Prompt Ops), dates, venues, full writeups, and photo gallery arrays.
- `archive.json`: Numbered list of all past workshops, industrial visits, and links to SJEC portal reports.
- `domains.json`: The 4 main pillars (Technical Skill Building, Leadership, Events, Industry Readiness).
- `siteConfig.json`: Association description, college tagline, email, and social media links.
