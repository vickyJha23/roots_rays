# Roots & Rays Organic

Single-page storefront for a small organic pantry brand. React 19, Vite 8, TypeScript, Three.js for the hero, GSAP for motion, Lenis for scrolling.

## Run it

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + production bundle in dist/
pnpm preview    # serve the production build
pnpm lint
```

## How it's put together

```
src/
  App.tsx              page composition, bag/toast/modal state, preloader gate
  index.css            tokens, type scale, grain, buttons
  data/products.ts     the six pouches
  lib/gsap.ts          plugin registration (ScrollTrigger, SplitText, DrawSVG)
  lib/scroll.ts        Lenis smooth scroll + scrollTo/lock helpers
  lib/motion.ts        reduced-motion / fine-pointer checks
  three/HeroScene.ts   the WebGL hero (vanilla three, no R3F)
  components/          one folder-free component per section, CSS alongside
```

### The hero scene

The packaging photos are JPEGs on white. Rather than cutting them out, the scene clears to the page's cream and draws everything with **multiply blending**, so white sinks into the paper the same way `mix-blend-mode: multiply` does in the CSS fallback. Behind the pouches is a shader-drawn sun: FBM noise for the edge, faint rotating spokes, animated grain. Each pouch is a plane with a vertex bulge so it reads as a pouch rather than a card. Mouse position tilts the group; a scrubbed ScrollTrigger drifts the pouches apart as you scroll.

Rendering stops when the hero is off screen or the tab is hidden. If WebGL is unavailable the hero falls back to two blended `<img>` tags.

### Motion

- Preloader draws the logo strokes (DrawSVG) once per session, then lifts.
- Hero heading uses SplitText line masks; the split is reverted after the intro so the heading reflows normally on resize.
- Marquee speed follows scroll velocity.
- Product cards batch-reveal; the middle column is scrubbed slower for a staggered grid.
- Buttons are magnetic on fine pointers only.
- `prefers-reduced-motion` turns all of this off and renders a static page.

### Bag and ordering

`src/hooks/useCart.ts` keeps the bag in a reducer and mirrors it to `localStorage`, so it survives a refresh. The drawer (`CartDrawer.tsx`) handles quantities, removal and the subtotal, and hands the order off to WhatsApp as a prefilled message listing every line. There is no payment step; the conversation finishes on WhatsApp.

### Before going live

Edit `src/data/brand.ts`:

- `instagram` — the real handle (no @)
- `whatsapp` — the business number in international format, digits only

Replace the placeholder `price` values in `src/data/products.ts` with the real price list (INR).

## Notes

- The contact form and the "Ask us" helper are front-end only. Nothing is sent anywhere. WhatsApp and Instagram links open in a new tab.
- Fonts: Fraunces (display) and Instrument Sans (text) from Google Fonts, loaded in `index.html`.
