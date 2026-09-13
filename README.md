# Wishlist Website

## Files

- `index.html` — public wishlist page
- `admin.html` — developer/admin page
- `css/style.css` — all styling
- `js/data.js` — wishlist data/storage functions
- `js/app.js` — public page behavior
- `js/admin.js` — admin page behavior

## Important

This version is a working front-end prototype. It stores wishlist items and reservations in the browser's `localStorage`.

That means it is **not yet a real multi-user website**: each visitor has their own browser storage, so reservations are not shared between visitors.

For a production version, the next step is replacing `localStorage` with a backend/database and adding proper authentication for the developer page.
