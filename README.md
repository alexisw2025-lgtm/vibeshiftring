# Vibe Shift Rings — vibeshiftring.com

React + Vite site for the Vibe Shift Rings collection, part of the
Chai Holistic family.

## Local setup

```
npm install
npm run dev
```

## Deploy (Netlify, same as chaiholistic.com)

1. Push this folder to a new GitHub repo (e.g. `vibeshiftring`).
2. In Netlify: "Add new site" → connect the repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Point vibeshiftring.com's DNS at the new Netlify site.

## Backend

The "Reserve Your Ring" form POSTs to:

  https://web-production-4c84.up.railway.app/ring-order

This endpoint doesn't exist yet — see `backend_ring_order_endpoint.py`
for the FastAPI route to add to your Railway backend (reuses the same
Resend setup as Save My Ritual). Update the `to:` email address in that
file before deploying.

## Structure

- `src/data/rings.js` — the 6 ring designs + custom option, sizing chart
- `src/data/frequencies.js` — the 9 sacred frequencies + skeptic facts
- `src/components/` — Hero, FrequencyDial (interactive), Gallery,
  SizingGuide (with HandIcon), Configurator (Reserve Your Ring), Footer
- `src/index.css` — design tokens (shared palette with chaiholistic.com)
  and all component styles

## Notes

- Selecting a design, frequency, and size anywhere on the page updates
  the order summary in the Reserve section live (shared state in App.jsx).
- No payment is collected — submissions are order *requests* that you
  follow up on directly, same as the trifold paper order form.
