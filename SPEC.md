# SPEC: Per-App Grayscale Setting — Petition Site

## Goal
A single-page petition site calling on Apple to add a native per-app grayscale setting to iOS, allowing users to selectively remove color from addictive apps while keeping it for essential ones. The site should feel like it belongs on apple.com — clean, authoritative, and beautiful.

## Non-goals
- Not a full-featured petition platform (no comments, no updates feed)
- Not a mobile app
- Not trying to solve Android (iOS-focused, though the idea applies broadly)

## Architecture sketch
- **Static single-page site** (HTML/CSS/JS)
- **Apple-style design**: SF Pro system font stack, large typography, generous whitespace, dark/light sections
- **Hero**: TikTok screenshot with animated color↔grayscale toggle
- **Serverless API** for petition signatures (Cloudflare Workers + KV, or Vercel API route)
- **Deployable to**: Cloudflare Pages, Vercel, or Netlify

## Page sections (top to bottom)
1. **Hero** — TikTok screenshot toggling color/grayscale + bold headline + subhead
2. **The Problem** — Phone addiction stats, color's role in dopamine loops
3. **Why Global Grayscale Isn't Enough** — You need color for texts, photos, work, maps
4. **The Solution** — Per-app grayscale as a native iOS setting (mockup)
5. **The Research** — Key studies with citations
6. **The Workaround (And Why It's Not Enough)** — Current Shortcuts hack and its problems
7. **Sign the Petition** — Name + email form, live signature count
8. **Share** — Copy link, Twitter/X, share buttons
9. **Footer** — Credits, privacy note

## Tech stack
- Pure HTML/CSS/JS (no framework needed for a single page)
- System font stack targeting SF Pro on Apple devices
- CSS `filter: grayscale(1)` for the hero animation
- Serverless function for form submissions
- KV store or simple database for signatures

## Key design principles (Apple-style)
- SF Pro system font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`
- Large display type (48-80px headlines)
- Tight line-height on headlines (1.05-1.1)
- Generous section padding (100-120px vertical)
- Black text on white, white text on black — alternating sections
- Subtle fade-in animations on scroll
- Minimal color — let the grayscale concept speak

## Public interfaces
- `GET /` — serves the page
- `POST /api/sign` — submit signature `{ name, email }`
- `GET /api/count` — get current signature count

## Repo map
```
/index.html          — the single page
/style.css           — all styles
/script.js           — interactions, form handling, animations
/api/                — serverless function(s) for signatures
/assets/             — hero screenshot, any images
/SPEC.md
/IMPLEMENTATION_NOTES.md
```

## How to run / test
```sh
# Local dev — just open the file or use a simple server
npx serve .

# Or with Python
python3 -m http.server 8000
```

## Acceptance checks
- [ ] Page loads and looks polished on mobile and desktop
- [ ] Hero animation toggles TikTok between color and grayscale smoothly
- [ ] Apple-style typography and spacing throughout
- [ ] Petition form collects name + email
- [ ] Share functionality works
- [ ] Research section cites real studies
- [ ] Argument is clear and compelling
- [ ] Responsive at 375px, 768px, 1200px, 1600px
