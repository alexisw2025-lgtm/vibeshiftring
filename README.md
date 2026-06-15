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

## Checkout (real payment via chaiholistic's Shopify store)

Step 5 of the configurator can send the order straight to
chaiholistic.com's Shopify-hosted checkout — same store, real payment,
tax, and shipping — with the ring's colors/frequency/size attached as
order details. This reuses the Shopify integration already built for
chaiholistic.com (`useShopify.js`).

**To turn it on:**

1. In vibeshiftring's Netlify env vars, add the **same** Shopify
   Storefront credentials chaiholistic.com uses:
   ```
   VITE_SHOPIFY_DOMAIN=chai-holistic.myshopify.com
   VITE_SHOPIFY_TOKEN=<chaiholistic's Storefront API token>
   ```
2. In Shopify Admin, create **one product per ring design** (The
   Spiral, The Sage, The Anchor, The Whisper, The Interrupt, The
   Flux) — a single variant each is enough.
3. Copy each variant's ID (Admin → Products → ring → Variants → click
   the variant → ID is in the URL) and paste into
   `src/useShopify.js` → `RING_VARIANT_MAP`:
   ```js
   "The Spiral": "gid://shopify/ProductVariant/1234567890",
   ```

Until a design's variant is mapped, that design falls back to the
email-request flow below (matches chaiholistic's own "Checkout Coming
Soon" pattern).

**Custom Design** never goes through Shopify (no fixed price) — it
always uses the email-request flow, where you set pricing directly
with the customer.

## Email request flow (fallback / Custom Design)

"Request This Ring" POSTs to:

  https://web-production-4c84.up.railway.app/ring-order

**This endpoint does not exist yet** — that's why submitting it
currently errors. See `backend_ring_order_endpoint.py` for the FastAPI
route to add to your Railway backend (reuses the same Resend setup as
Save My Ritual). Update the `to:` email address in that file before
deploying, and add vibeshiftring.com to CORS allowed origins.

Once Shopify checkout is configured for a design, this flow becomes
optional for that design ("Prefer we contact you first?") — but it's
still useful for Custom Design and any rings not yet mapped.

## Structure

- `src/data/rings.js` — the 6 ring designs + custom option, sizing chart
- `src/data/frequencies.js` — the 9 sacred frequencies + skeptic facts
- `src/data/colors.js` — the 8 outer/inner band color options
- `src/useShopify.js` — Shopify Storefront API integration (checkout)
- `src/components/Hero.jsx` — dark hero, CTAs link to #configurator
- `src/components/Configurator.jsx` — the 5-step ordering wizard
- `src/components/StepIndicator.jsx` — step progress dots
- `src/components/steps/` — StepDesign, StepColors, StepFrequency,
  StepSize, StepInfo (one per wizard step)
- `src/components/HandIcon.jsx` — hand illustration in the sizing guide
- `src/index.css` — design tokens and all component styles

## The ordering flow

"Build Your Ring" scrolls to the configurator, which always starts at
Step 1. Steps must be completed in order, gated by a progress
indicator:
- Step 1 — Design: pick one of 6 rings or Custom
- Step 2 — Colors: outer/inner band color, "as shown in photos", or
  "same as outer" (optional for Custom)
- Step 3 — Frequency: interactive dial + "isn't this just plastic?"
  section
- Step 4 — Size: size grid + collapsible at-home sizing guide
- Step 5 — Your info: order summary + Shopify checkout (if configured
  for that design) and/or the email-request form

The Continue button pulses once the current step's selection is made.
