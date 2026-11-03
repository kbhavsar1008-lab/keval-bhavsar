# Keval Satish Bhavsar — Portfolio

A static one-page portfolio built with HTML, CSS and jQuery. No build step is needed.

## Files
```
index.html                 All page content (edit text here)
css/style.css              Styles. Colours and fonts are set at the top in :root
js/main.js                 jQuery interactions
js/jquery-3.7.1.min.js     jQuery, included locally (no CDN needed)
assets/Keval_Satish_Bhavsar_Resume.pdf   The file the Resume button downloads
assets/keval-photo.webp / .png           Hero portrait with the background removed
```

## Run locally
Open `index.html` in a browser.

## What the jQuery does
- Light/dark theme toggle, remembered for each visitor. It defaults to the visitor's system setting.
- Mobile hamburger menu. It closes on Escape, on a click outside it, or when a link is picked.
- Smooth scrolling that allows for the sticky header.
- Highlights the current section's link in the nav as you scroll.
- Adds a shadow to the header on scroll and shows a floating back-to-top button.
- Fades sections in as they scroll into view.
- Counts up the hero stats.
- Fills in the current year in the footer.
- Respects the visitor's reduced-motion setting.

## Before publishing
1. Search the files for `[` to find the remaining placeholders. These are project years, role lines, the certification year and the education details.
2. Replace `YOUR-DOMAIN.com` in the `<head>` of `index.html`.
3. Add `assets/og-image.jpg`, a 1200×630 image used when the link is shared on LinkedIn.
4. To change your photo, replace both keval-photo files with a cutout that has a transparent background and the same proportions.
5. To update your resume, replace the PDF in `assets/` and keep the same file name.

## Free hosting
- **GitHub Pages:** push this folder to a repository and turn on Pages under Settings → Pages.
- **Netlify:** drag the folder onto app.netlify.com/drop.
- **Vercel:** import the repository.
