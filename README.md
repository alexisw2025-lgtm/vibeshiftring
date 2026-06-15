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

The "Reserve Your Ring" form (step 5 of the configurator) POSTs to:

  https://web-production-4c84.up.railway.app/ring-order

This endpoint doesn't exist yet — see `backend_ring_order_endpoint.py`
for the FastAPI route to add to your Railway backend (reuses the same
Resend setup as Save My Ritual). Update the `to:` email address in that
file before deploying. The payload now also includes a `colors` field
(either "As shown in photos" or `{outer, inner}`).

## Structure

- `src/data/rings.js` — the 6 ring designs + custom option, sizing chart
- `src/data/frequencies.js` — the 9 sacred frequencies + skeptic facts
- `src/data/colors.js` — the 8 outer/inner band color options
- `src/components/Hero.jsx` — hero section, CTAs both link to #configurator
- `src/components/Configurator.jsx` — the 5-step ordering wizard (shell:
  step state, gating, navigation)
- `src/components/StepIndicator.jsx` — step progress dots
- `src/components/steps/` — StepDesign, StepColors, StepFrequency,
  StepSize, StepInfo (one per wizard step)
- `src/components/HandIcon.jsx` — hand illustration used in the sizing guide
- `src/index.css` — design tokens (shared palette with chaiholistic.com)
  and all component styles

## The ordering flow

"Build Your Ring" (in the nav and hero) scrolls to the configurator,
which always starts at Step 1. Steps must be completed in order:
- Step 1 — Design: pick one of 6 rings or Custom
- Step 2 — Colors: outer/inner band color, "as shown in photos", or
  "same as outer" (for Custom, this step is optional — colors can be
  described in notes instead)
- Step 3 — Frequency: the interactive dial (9 sacred frequencies) +
  the "isn't this just plastic?" skeptic section
- Step 4 — Size: size grid + collapsible at-home sizing guide
- Step 5 — Your info: full order summary + contact form + submit

The "Continue" button is disabled until the current step's selection
is complete. The step-indicator dots let you jump back to a completed
step, but not ahead to one you haven't reached yet.

No payment is collected — submissions are order *requests* that you
follow up on directly, same as the trifold paper order form.
