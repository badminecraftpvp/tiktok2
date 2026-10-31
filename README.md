# Pulse: installable social PWA

Vanilla HTML/CSS/JS. No build step, no dependencies, no CDN, so it works fully offline after the first load.

## Files
| File | Purpose |
|---|---|
| `index.html` | App shell, iOS meta tags, touch icon, manifest link |
| `style.css` | Mobile-first UI, dark mode, safe-area insets |
| `app.js` | Feed, stories, comments, compose, explore, activity, profile, install prompt |
| `manifest.json` | Standalone display mode, icons (any + maskable), shortcut |
| `sw.js` | Service worker: precache, offline shell, stale-while-revalidate |
| `icons/` | 180, 192, 512 and maskable 512 PNGs (regenerate with `python3 make_icons.py`) |

## Test locally
```
cd pulse-pwa
python3 -m http.server 8080
```
Open http://localhost:8080. Service workers work on `localhost` without HTTPS. To test on a phone, you need a real HTTPS URL (deploy below, or use a tunnel such as `cloudflared tunnel --url http://localhost:8080`).

## Deploy (HTTPS is required)
Upload the **contents** of this folder (not the folder itself) so `index.html` sits at the root.
- **Netlify**: drag the folder onto app.netlify.com/drop.
- **Cloudflare Pages**: create a project, upload the folder, no build command.
- **Vercel**: `npx vercel --prod` inside the folder (framework: Other, no build).
- **GitHub Pages**: push to a repo, Settings > Pages > deploy from branch. Works from a sub-path because all URLs are relative.
- **Firebase Hosting / S3 + CloudFront**: any static host with HTTPS works.

Recommended headers: `Cache-Control: no-cache` for `sw.js` and `index.html`, and `Content-Type: application/manifest+json` for `manifest.json` (most hosts do this automatically).

## Install
- **iOS (Safari 16.4+)**: open the site in Safari > Share > **Add to Home Screen**. It launches full-screen with no browser bars. iOS has no install prompt; the app shows a hint banner instead. Other iOS browsers can also add to Home Screen on recent iOS.
- **Android (Chrome, Edge, Samsung Internet)**: use the **Install app** button in the header, or the browser menu > Install app. The Android back button closes sheets and stories.
- **Desktop Chrome/Edge**: install icon in the address bar.

## Verify
Chrome DevTools > Application: check Manifest (no errors, installable) and Service Workers (activated). Run Lighthouse > PWA. Toggle "Offline" and reload to confirm the shell loads.

## Shipping updates
Change `VERSION` in `sw.js` (e.g. `pulse-v2`) on every deploy. Old caches are deleted and the new worker takes control on the next load.

## Notes
- Data (posts, likes, comments, photos) is stored in the browser's `localStorage`. Photos are downscaled to 900px. Swap `save()`/`S` in `app.js` for API calls to connect a real backend.
- The header is intentionally dark in both themes so the iOS status bar (white text, `black-translucent`) stays readable under the Dynamic Island.
- Live notifications are simulated every ~22 seconds. Real push needs a backend plus the Push API (iOS 16.4+, installed apps only).
