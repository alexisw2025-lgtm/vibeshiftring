/**
 * useShopify.js — Vibe Shift Rings
 *
 * Ported from chaiholistic.com's Shopify Storefront API integration.
 * Sends the customer to chaiholistic's Shopify-hosted checkout (same
 * store as the tea shop) with the chosen ring in their basket — fully
 * configured with the design, colors, frequency, size, and notes as
 * order line-item attributes (visible to you in Shopify Admin and on
 * the customer's order confirmation).
 *
 * ─── SETUP ────────────────────────────────────────────────
 *
 * 1. Use the SAME Shopify Storefront credentials as chaiholistic.com.
 *    In vibeshiftring's Netlify env vars, add:
 *      VITE_SHOPIFY_DOMAIN=chai-holistic.myshopify.com
 *      VITE_SHOPIFY_TOKEN=<same Storefront API token as chaiholistic>
 *
 * 2. In Shopify Admin, create ONE product per ring design (The Spiral,
 *    The Sage, The Anchor, The Whisper, The Interrupt, The Flux) — a
 *    single variant each is fine. Copy each variant's ID from the URL
 *    (Admin → Products → [ring] → Variants → click variant → ID in URL)
 *    and paste below into RING_VARIANT_MAP as:
 *      "The Spiral": "gid://shopify/ProductVariant/1234567890"
 *
 * 3. Custom Design doesn't have a fixed price, so it isn't sent to
 *    Shopify checkout — it stays on the email-request flow.
 *
 * ─── HOW IT WORKS ────────────────────────────────────────────
 * Add to Basket -> creates/updates a Shopify cart with the ring as a
 * line item, plus attributes for Colors / Frequency / Size / Notes ->
 * redirect to Shopify's hosted checkout (chaiholistic's store, real
 * payment + tax + shipping handled by Shopify).
 */

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || 'YOUR-STORE.myshopify.com';
const SHOPIFY_TOKEN  = import.meta.env.VITE_SHOPIFY_TOKEN  || 'YOUR_STOREFRONT_API_TOKEN';
const STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

// ── RING -> SHOPIFY VARIANT MAP ───────────────────────────
// Fill these in from Shopify Admin (see setup notes above).
export const RING_VARIANT_MAP = {
  "The Spiral":    "gid://shopify/ProductVariant/FILL_IN",
  "The Sage":      "gid://shopify/ProductVariant/FILL_IN",
  "The Anchor":    "gid://shopify/ProductVariant/FILL_IN",
  "The Whisper":   "gid://shopify/ProductVariant/FILL_IN",
  "The Interrupt": "gid://shopify/ProductVariant/FILL_IN",
  "The Flux":      "gid://shopify/ProductVariant/FILL_IN",
};

// ── GRAPHQL ────────────────────────────────────────────────
const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 10) {
    edges {
      node {
        id
        quantity
        attributes { key value }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product { title }
          }
        }
      }
    }
  }
  cost {
    totalAmount { amount currencyCode }
  }
`;

const CREATE_CART = `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const ADD_TO_CART = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

// ── CONFIGURED CHECK ───────────────────────────────────────
export function shopifyIsConfigured() {
  return (
    SHOPIFY_DOMAIN !== 'YOUR-STORE.myshopify.com' &&
    SHOPIFY_TOKEN  !== 'YOUR_STOREFRONT_API_TOKEN' &&
    SHOPIFY_DOMAIN.includes('.myshopify.com')
  );
}

export function ringVariantMapped(designName) {
  const id = RING_VARIANT_MAP[designName];
  return !!id && !id.includes('FILL_IN');
}

// ── STOREFRONT FETCH ───────────────────────────────────────
async function storefrontFetch(query, variables = {}) {
  const res = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// ── CART STATE (module-level singleton) ───────────────────
let _cartId      = null;
let _checkoutUrl = null;
let _listeners   = [];

function notify() {
  _listeners.forEach(fn => fn({ cartId: _cartId, checkoutUrl: _checkoutUrl }));
}

function parseCart(cart) {
  _cartId = cart.id;
  _checkoutUrl = cart.checkoutUrl;
  const userErrors = [];
  notify();
  return userErrors;
}

import { useState, useEffect } from 'react';

export function useShopify() {
  const [state, setState] = useState({ cartId: _cartId, checkoutUrl: _checkoutUrl });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const configured = shopifyIsConfigured();

  useEffect(() => {
    _listeners.push(setState);
    return () => { _listeners = _listeners.filter(fn => fn !== setState); };
  }, []);

  /**
   * Add the chosen ring to the Shopify cart with personalization
   * attributes, then return the checkout URL.
   *
   * @param {string} designName  must match a key in RING_VARIANT_MAP
   * @param {Array<{key,value}>} attributes  e.g. Colors, Frequency, Size, Notes
   */
  async function addRingToCart(designName, attributes = []) {
    const variantId = RING_VARIANT_MAP[designName];
    if (!variantId || variantId.includes('FILL_IN')) {
      setError(`No Shopify variant mapped for "${designName}" yet.`);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const line = { merchandiseId: variantId, quantity: 1, attributes };

      let data;
      if (!_cartId) {
        data = await storefrontFetch(CREATE_CART, { lines: [line] });
        const errs = data.cartCreate.userErrors;
        if (errs?.length) throw new Error(errs[0].message);
        parseCart(data.cartCreate.cart);
      } else {
        data = await storefrontFetch(ADD_TO_CART, { cartId: _cartId, lines: [line] });
        const errs = data.cartLinesAdd.userErrors;
        if (errs?.length) throw new Error(errs[0].message);
        parseCart(data.cartLinesAdd.cart);
      }
      return _checkoutUrl;
    } catch (e) {
      console.error('[useShopify] addRingToCart failed:', e);
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function goToCheckout(url) {
    const target = url || _checkoutUrl;
    if (target) {
      window.location.href = target;
    } else {
      setError('No checkout URL available.');
    }
  }

  return {
    configured,
    loading,
    error,
    checkoutUrl: state.checkoutUrl,
    addRingToCart,
    goToCheckout,
  };
}
