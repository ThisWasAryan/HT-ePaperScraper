# HT-ePaperScraper

A beautiful, premium, open-source web application for browsing, reading, and downloading Hindustan Times ePaper editions.

Built with React, TypeScript, and Vite, this project bypasses ads, paywalls, and tracking metrics by routing requests through a lightweight edge proxy server directly to Hindustan Times' unauthenticated internal Next.js backend JSON APIs.

> **Sister Project:** Following this project's development, we extended our security research to Dainik Jagran's ePaper platform, uncovering and leveraging a distinct security vulnerability. The resulting project shares this repository's interface and is available here: [Jagran ePaper Scraping](https://github.com/ThisWasAryan/Jagran-ePaperScraping).

[A Demonstration/Tutorial Video](https://youtu.be/PvuIr3bYZrU) *last updated on 01/06/2026*

## Features

- **Professional Document Viewer:** An immersive, distraction-free reading experience powered by a custom pan-and-zoom engine. Single-click to zoom exactly at your cursor, double-click for larger steps, and smoothly pan across high-resolution pages.
- **True Original Quality:** View the exact high-resolution layouts straight from the publisher's digital press in native WebP format.
- **Historical Access:** Browse past publications and access older editions securely from the archive across 72 regional editions and publication dates.
- **Instant Background Loading:** Aggressive background pre-fetching ensures pages flip instantly as you read.
- **Proactive Availability Verification:** Automatically checks and filters out empty or unpublished regional editions on selected dates.
- **True File Downloading:** Safely download high-resolution images of any page directly to your local device with clean, numbered filenames.
- **Premium Editorial Design:** A highly polished, responsive interface built with pristine serif typography and a carefully restrained color palette (featuring both Light and Dark modes).
- **Server/Proxy Architecture:** Utilizes edge proxy rewrites on Vercel and a local development proxy server with IPv4 fallback to guarantee 100% reliable, zero-CORS communication with the upstream API.


> **Live Deployment:** [https://ht-epaperscraper.vercel.app/](https://ht-epaperscraper.vercel.app/)

---
<img width="1920" height="1080" alt="DemoHT1" src="https://github.com/user-attachments/assets/e28f0628-d367-4881-bf81-6fdcd6f6a748" />

*Web viewer interface showing access to all available cities and editions, demonstrating the platform's complete newspaper navigation capabilities.*

<img width="1920" height="1080" alt="DemoHT2" src="https://github.com/user-attachments/assets/f8bf1844-0f27-4d0c-830d-3b426c74cd89" />

*Individual page viewer with high resolution image rendering and zoom capability, allowing users to view or download the highest quality page available.*

---

## How It Works

This project used frontend reverse-engineering and UX design. Here is the chronological breakdown of how it was built.

### Phase 0: The Reconnaissance & The CORS Investigation
Before a single line of React was written, the project required heavy reconnaissance. Initial investigations probed the Hindustan Times website architecture to see if a client-side scraper was even possible.

During this investigation, URL formats were mapped out and a crucial **CORS (Cross-Origin Resource Sharing)** analysis was conducted to see if the HT servers would aggressively block external requests from a custom frontend.

**The Golden Discovery (`_tn.jpg`):**
During this initial mapping, the project-defining breakthrough was discovered. The official website was loading low-resolution thumbnail images (suffixed with `_tn.jpg`). By analyzing the CDN structure, we discovered that simply stripping the `_tn` from the URL string unlocked the un-gated, ultra-high-resolution original JPEG files.

This initial reconnaissance proved the concept was viable. We didn't need to authenticate, and we didn't need to bypass heavy security. We just needed to build the engine.

### Phase 1: The API Breakthrough
With the image hack secured, the next challenge was figuring out how to get *all* the pages for a specific day without blindly guessing URLs.

Instead of scraping HTML with a slow backend script, we looked at the Chrome Network tab and found the hidden JSON API endpoint powering their frontend:
`https://epaper.hindustantimes.com/Home/GetAllpages?editionid={editionId}&editiondate={dd/MM/yyyy}`

Sending a simple `GET` request to this URL returned a beautiful JSON array of every single page in the newspaper. By combining this API array with the `_tn.jpg` resolution hack, the backend data pipeline was completely solved.

### Phase 2: The Original Client-Side Architecture & Its Evolution
Initially, under Hindustan Times' legacy ASP.NET MVC backend, the API had permissive policies that allowed pure client-side `fetch()` requests directly from the user's browser without requiring any intermediary backend server.

However, as the publisher migrated to a modern Next.js infrastructure (see Phase 7), cross-origin restrictions were introduced. Today, a lightweight server or edge proxy is required to broker communication between the frontend and the upstream API.

### Phase 3: The UI Pivot (Dashboard to Editorial)
Once the data was flowing, the initial UI looked like a generic "SaaS Dashboard." It had big control panels, empty white space, and glowing buttons.

We completely stripped the UI down to an **Editorial / Archive aesthetic**:
1. **Typography:** We switched to `Playfair Display` (a classic Serif font) for all headers to evoke a journalistic feel, while keeping `Inter` for the UI buttons.
2. **Color Palette:** We removed generic gradients. We implemented a strict Light/Dark mode with subtle borders and a single "Newspaper Blue" (`#2563eb`) accent color.
3. **The Gallery:** The pages were laid out in a responsive CSS Grid that naturally reflows to fit any monitor.

### Phase 4: Building the "Immersive Reader"
The biggest technical hurdle in the frontend was the reading experience. Standard HTML `<img>` tags aren't good enough for reading tiny newspaper print.

We integrated `react-zoom-pan-pinch` to build a custom document viewer, writing custom logic to make it behave like a professional PDF reader:
* **Cursor-Targeted Zoom:** We wrote a math function so that when you click on a specific headline, the image scales and translates exactly to your mouse coordinates (`e.clientX`, `e.clientY`).
* **Background Pre-fetching:** To make page-flipping instant, we added a hidden `<div>` that automatically loads the *next 3* high-res images in the background while you are reading the current page.

### Phase 5: The Mobile UX Masterclass
The desktop version was perfect, but the mobile version felt cramped. We executed a massive "Mobile UX Refinement Pass" focusing on maximizing screen real-estate:
1. **Killing Nested Scrolls:** We ripped out `100vh` locks and let the native `<body>` tag handle all scrolling, unlocking smooth, native momentum scrolling.
2. **The Smart Sticky Header:** When you scroll *down* to read, the top navigation bar completely slides off the screen. The second you flick your thumb *up*, it instantly drops back down.
3. **The Auto-Collapsing Filter:** The giant dropdowns instantly collapse into a sleek, 1-inch summary bar (e.g., "Delhi Edition - May 31") when you load an edition.
4. **Touch-Optimized Reader:** Inside the reader, we removed all padding so the newspaper touches the glass edges. The "Next/Prev" arrows were enlarged and anchored flush to the edges.

### Phase 6: True File Downloading
We couldn't just use `<a href="image.jpg" download>` because modern browsers will often just open the image in a new tab instead of saving it. To force a download, we wrote a function that fetches the image as a raw `Blob`, creates a temporary object URL in browser memory, generates an invisible link, clicks it, and then destroys the link.

### Phase 7: The Next.js Overhaul & Why a Server is Needed Now
When Hindustan Times decommissioned their legacy backend in favor of a modern **Next.js (Turbopack)** infrastructure, two critical things changed:
- The old endpoints were retired in favor of `/api/get-all-pages?editioncode={code}&editiondate={date}`.
- **CORS Enforcement:** The new Next.js internal API does not set `Access-Control-Allow-Origin: *` headers for third-party browser origins. Direct browser requests from static websites (e.g., GitHub Pages) fail with CORS errors.

To solve this, a proxy server is now used:
1. **Local Development Proxy:** Vite's development server (`npm run dev`) includes a built-in reverse proxy in `vite.config.ts` using Node's HTTPS agent configured with IPv4 (`family: 4`) to bypass both local network IPv6 routing hiccups and CORS restrictions.
2. **Production Edge Proxy on Vercel:** In production, Vercel's edge network proxies `/api/*` requests via `vercel.json` rewrites directly to `epaper.hindustantimes.com` server-side, eliminating browser CORS issues without needing to maintain dedicated server infrastructure.
3. **First-Class High-Res WebP:** Mapped native `HrImageUrl` and `HighResolution` WebP assets directly from the payload, bypassing the need for lossy image conversions.
4. **Expanded Edition Directory:** Updated the catalog to **72 editions** with authentic region and edition codes.
5. **Proactive Edition Availability:** Added parallel scanning and caching so only editions containing published pages on the selected date appear in the dropdown.

---

## Setup & Local Development

This project requires **Node.js** (v18+) and **NPM**.

> **Note:** A running server is required. Because the publisher's API blocks cross-origin browser requests, you cannot simply open the built `dist/index.html` static file directly. Always run `npm run dev` locally to utilize Vite's internal API proxy.

1. Clone the repository:
   ```bash
   git clone https://github.com/ThisWasAryan/HT-ePaperScraper.git
   cd HT-ePaperScraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The app will run locally at `http://localhost:5173/`.

## Deployment to Vercel (Recommended)

Deploying to **Vercel** is the official hosting method for this project. Vercel automatically runs serverless edge rewrites configured in `vercel.json`, fulfilling the server requirement and eliminating browser CORS restrictions:

1. Push your changes to your GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `HT-ePaperScraper` repository.
4. Vercel automatically detects the Vite framework with:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**.

The included `vercel.json` automatically routes `/api/get-all-pages` to `https://epaper.hindustantimes.com/api/get-all-pages` via Vercel Edge Rewrites with clean single-page app fallback routing (`/(.*) -> /index.html`).

## Production Build

To build the optimized static assets locally:

```bash
npm run build
```
The compiled files will be located in the `dist` directory.

## Disclaimer

This project is an independent viewer and is not affiliated with, endorsed by, or associated with Hindustan Times or any of its parent organizations.

**HT-ePaperScraper does not host, store, redistribute, modify, or republish newspaper pages on its own servers.** The application merely provides access to publicly available resources that are already accessible through the official publisher infrastructure.

All newspaper pages are loaded directly from their original source URLs at the time of viewing. **No copyrighted content is permanently stored, mirrored, or redistributed by this project.**

If you are a copyright holder and believe any aspect of this project infringes upon your rights, please open an issue or contact the project maintainer so the matter can be reviewed promptly.

*This project is intended solely for educational, research, archival exploration, and personal reading purposes.*

---
Made with ♥ by Aryan Raj
