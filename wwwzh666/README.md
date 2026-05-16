# Google Antigravity Animation Replica

This submission recreates the landing-page animation language of `https://antigravity.google/` for `oriengy/coding-exam` question 2.

## Tech Stack

- TypeScript
- Vite
- Three.js for WebGL particle systems
- GSAP + ScrollTrigger for scroll scrub, staged entrances, and cursor motion
- Plain CSS for responsive layout and visual system tokens

The source page uses Angular, GSAP/ScrollTrigger, canvas/WebGL particles, custom cursor behavior, hero video, and Poisson-style particle distribution. This implementation keeps the runtime lightweight by using Vite directly instead of recreating the Angular app shell.

## Directory Structure

- `code/` - runnable Vite application.
- `prompt/` - PNG evidence of the prompt and implementation request.
- `screenshot/` - desktop, hover, scroll, download, and mobile verification screenshots.
- `README.md` - this implementation summary.

## Run Locally

```bash
cd code
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build And Verification

```bash
cd code
npm run build
npm run screenshot
npm run prompt:evidence
```

`npm run build` runs TypeScript checking and creates a production Vite build. `npm run screenshot` starts or reuses a local Vite server and captures the screenshots in `screenshot/`.

## Animation Notes

- The hero uses a Three.js `Points` shader with Poisson disk sampling, ring targets, pointer repulsion, and a soft sprite fragment shader.
- Typed headers animate per character while preserving word wrapping.
- GSAP timelines drive the intro, section reveals, bouncing symbol rail, video hover cursor, and download/footer entrance states.
- Public Antigravity assets required for the experience are stored locally under `code/public/assets/`, including logo, cursor, textures, icons, and the hero video.

## Screenshot Set

- `01-desktop-hero.png` - desktop first viewport.
- `02-scroll-video.png` - scroll state before the video module.
- `03-video-hover-cursor.png` - custom cursor over the video.
- `04-use-cases-solutions.png` - use-case and solution particle cards.
- `05-download-section.png` - dark download panel and particles.
- `06-mobile-hero.png` - mobile first viewport.
