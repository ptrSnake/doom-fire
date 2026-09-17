# FIRE

A low-res Doom-style fire effect rendered on an HTML `<canvas>`, with pixel-by-pixel manipulation.

The classic "Doom fire" algorithm simulates heat that only flows upward from a
source row seeded at the bottom. Every frame each pixel's heat is copied to the
row above with a random horizontal drift and a small random decay, so the flame
wiggles and cools down as it rises. The heat value indexes a 37-color palette
going from black, through fire tones, up to white.

## Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`).

## Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build         |

## Structure

- `src/main.ts` — canvas setup, the `setPixel`/`render` functions and the animation loop
- `src/fire.ts` — the `Fire` class (buffer, seeding, simulation step, palette)
- `src/style.css` — fullscreen pixelated canvas styling
