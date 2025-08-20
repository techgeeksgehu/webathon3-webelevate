# Nirvana Tech Fest 2025 – Frontend

A modern, responsive, multi-page site for Nirvana 2.0 built with HTML, CSS, and vanilla JavaScript. Includes an animated landing page, dynamic event detail template, rolling carousels, on-scroll animations, and dark/light theme support.

## Quick start
- Open `landing.html` to view the animated splash page (recommended entry).
- Open `index.html` for the Home page.
- Open `events.html` to browse events.
- Open `event-detail.html?event=hackathon` (replace the query) to view a specific event.

Tip: Use a local web server (e.g., VS Code Live Server) for best results with relative assets.

## Project structure
```
WEBATHON3/
  ├─ landing.html        # Animated splash (constellation, video wall, banner)
  ├─ index.html          # Home (hero, about, highlights, poster carousel, gallery)
  ├─ events.html         # Event listings (school/college/outdoor)
  ├─ event-detail.html   # Dynamic event template (populated by JS)
  ├─ style.css           # Theme, layout, animations, components
  ├─ script.js           # Interactivity, dynamic event loading, carousels
  └─ New folder/         # Local assets (logos, posters, gallery images)
```

## Assets
Place your images in `New folder/`.
- Logo: `white.svg` (dark mode), `color.svg` (light mode)
- Landing banner: `banner.png`
- Posters/Gallery: any images; defaults are read from `script.js` arrays and can be overridden with optional manifests below.

Optional manifests (if present, they override arrays):
- `New folder/posters.json`
- `New folder/gallery.json`

Example content:
```json
{ "images": [
  "New folder/TechFest_A4.png",
  "New folder/Nirvana Tech Fest.png"
] }
```

## Events – how data is wired
Event definitions live in `script.js` under `const EVENTS`. Each entry has:
- `title`, `description`, `date`, `time`, `venue`
- `image` (also used as the event-detail hero background)
- `rules` (array) and `eligibility`

Link to an event with: `event-detail.html?event=<key>` (e.g., `?event=hackathon`).

To add a new event:
1. Add an object to `EVENTS` in `script.js` with a unique key.
2. Add a card in `events.html` linking to `event-detail.html?event=<key>`.

## Carousels & animations
- Poster carousel: built on `#posterCarousel` using `POSTER_IMAGES` (or `New folder/posters.json`).
- Gallery: static grid with parallax/ken-burns hover and event-aware labels.
- On-scroll animations: `reveal` class handled by IntersectionObserver in `script.js`.

## Theme (dark/light)
Click the moon/sun in the navbar to toggle. The preference persists via `localStorage`. Logos auto-switch between `white.svg` and `color.svg`.

## Customize
- Edit colors, radii, and shadows in `:root` CSS variables in `style.css`.
- Swap fonts in the Google Fonts link inside HTML `<head>`.
- Adjust carousel timing in `buildCarousel(..., intervalMs)` in `script.js`.

## Deployment
Any static host works (GitHub Pages, Netlify, Vercel, S3, etc.).
- Set the entry to `landing.html` (or `index.html` if you prefer).
- Ensure the `New folder/` assets are uploaded with the same paths.

## Notes
- No backend required; the participation form is non-submitting by default.
- For accessibility, images include `alt` text; interactive elements have `aria-` labels.

## License
Internal/educational use. Replace or append your preferred license text.
