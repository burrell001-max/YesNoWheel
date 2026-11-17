# YesNoWheel

A free **Yes or No wheel** and **custom random picker wheel** that runs entirely in the browser.
Static HTML/CSS/vanilla JS, no backend, no build step, ready for GitHub Pages.

Live site (after deploying): https://burrell001-max.github.io/yesnowheel/

## Features

- **Yes/No wheel**: Yes/No or Yes/No/Maybe, 1x to 5x repeated sets, running scoreboard.
- **Custom wheel**: list view (text, image URL/upload, color, weight, hide/show, duplicate, delete, drag to reorder) and text view (`weight, text` per line), shuffle, sort A-Z, search, delete empty, clear all, CSV/TXT/JSON import, CSV/JSON export, Mystery wheel and Mystery result.
- **After each spin**: Normal, Elimination (hide choice / hide all matching) or Accumulation (live leaderboard).
- **Canvas physics**, ticker that reacts to pegs, synthesized tick and fanfare sounds (Web Audio, no audio files), confetti.
- **Settings**: duration 1-15 s, speed, idle rotation, sounds, confetti, dark/light theme, palettes (Vibrant, Pastel, Neon, Monochrome, Custom), page background, center button text/color, title and description, fullscreen presentation mode.
- **Share and embed**: link and `<iframe>` snippet that encode the wheel in the URL hash (no database).
- **10 languages**: EN, ES, FR, DE, PT, IT, JA, KO, ZH, AR (RTL). Detected from the browser, saved in `localStorage`, switchable live, and selectable with `?lang=xx`.
- **Keyboard**: `Space` / `Enter` spin, `Esc` closes dialogs and fullscreen.

## Files

```
yesnowheel/
├── index.html
├── style.css
├── i18n.js
├── app.js
├── robots.txt
├── sitemap.xml
├── README.md
└── .github/workflows/deploy.yml
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository named `yesnowheel` and push all files to the `main` branch.
2. In the repo go to **Settings > Pages**, and under **Build and deployment** set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow from the **Actions** tab). `.github/workflows/deploy.yml` publishes the site.
4. Open `https://<your-username>.github.io/yesnowheel/`.

### Using a different username or domain

The URL `https://burrell001-max.github.io/yesnowheel/` appears in `index.html` (canonical, hreflang, Open Graph, JSON-LD), `robots.txt`, `sitemap.xml` and `BASE_URL` in `app.js`. Find and replace it with your own address.

## Adding a language

Add an entry to `LANGS` and a matching dictionary in `i18n.js`, then add its `hreflang` link in `index.html` and its URL in `sitemap.xml`. Missing keys fall back to English.

## Privacy

Lists, settings, history and language are stored only in your browser's `localStorage`. Nothing is sent to a server. Opening a shared link never overwrites your saved wheel.
