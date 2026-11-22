# YesNoWheel GitHub Repo Fix Pack

1. Replace `sitemap.xml` in your repo root with the included `sitemap.xml`.
2. Update `<head>` in `index.html` using `index-head-snippet.html` (ensures clean viewport, title tag ~53 chars, meta description ~133 chars, canonical, and social tags).
3. Append `responsive-fix.css` to the bottom of `style.css` to resolve mobile overflow and touch-target sizing checks.
4. Add `index-links-snippet.html` into a relevant section/footer on `index.html` to provide an authoritative outbound link alongside internal tool links.
5. Delete duplicate/archive clutter files from `YesNoWheel-main`:
   - `index (1).html` through `index (11).html`
   - `YesNoWheel-flat.zip`
