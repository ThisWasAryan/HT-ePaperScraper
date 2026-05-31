# HT-ePaperScraper

A beautiful, premium, open-source static web application for browsing, reading, and downloading Hindustan Times ePaper editions. 

Built with React, TypeScript, and Vite, this project completely bypasses the ads, sign-in walls, and tracking metrics present on the official website by directly hooking into their unauthenticated backend JSON APIs.

## Features

- **Professional Document Viewer:** An immersive, distraction-free reading experience powered by a custom pan-and-zoom engine. Single-click to zoom exactly at your cursor, double-click for larger steps, and smoothly pan across high-resolution pages.
- **True Original Quality:** View the exact high-resolution layouts straight from the publisher's digital press.
- **Historical Access:** Browse past publications and access older editions securely from the archive by selecting supported cities and publication dates.
- **Instant Background Loading:** Aggressive background pre-fetching ensures pages flip instantly as you read.
- **True File Downloading:** Safely download high-resolution JPGs of any page directly to your local device.
- **Premium Editorial Design:** A highly polished, responsive interface built with pristine serif typography and a carefully restrained color palette (featuring both Light and Dark modes).
- **Static & Fast:** A pure static frontend application. No backend required—designed perfectly for static hosting like GitHub Pages.

---

## How It Works

This project used frontend reverse-engineering and UX design. Here is the chronological breakdown of how it was built.

### Phase 0: The Reconnaissance & The CORS Investigation
Before a single line of React was written, the project required heavy reconnaissance. Initial investigations probed the Hindustan Times website architecture to see if a client-side scraper was even possible.

During this investigation, URL formats were mapped out and a crucial **CORS (Cross-Origin Resource Sharing)** analysis was conducted to see if the HT servers would aggressively block external requests from a custom frontend.

**The Golden Discovery (`_tn.jpg`):**
During this initial mapping, the project-defining breakthrough was discovered. The official website was loading low-resolution thumbnail images (suffixed with `_tn.jpg`). By analyzing the CDN structure, we discovered that simply stripping the `_tn` from the URL string unlocked the un-gated, ultra-high-resolution original JPEG files. 

**Example** 

Thumbnail link scraped from site `https://epsfs.hindustantimes.com/HT/2026/05/31/HT_MUMB/HT_MUMB/5_03/dc57c588_03_tn.jpg`

Full Size High Quality image link `https://epsfs.hindustantimes.com/HT/2026/05/31/HT_MUMB/HT_MUMB/5_03/dc57c588_03.jpg`

This initial reconnaissance proved the concept was viable. We didn't need to authenticate, and we didn't need to bypass heavy security. We just needed to build the engine.

## Phase 1: The API Breakthrough
With the image hack secured, the next challenge was figuring out how to get *all* the pages for a specific day without blindly guessing URLs. 

Instead of scraping HTML with a slow backend script, we looked at the Chrome Network tab and found the hidden JSON API endpoint powering their frontend:
`https://epaper.hindustantimes.com/Home/GetAllpages?editionid={editionId}&editiondate={dd/MM/yyyy}`

Sending a simple `GET` request to this URL returned a beautiful JSON array of every single page in the newspaper. By combining this API array with the `_tn.jpg` resolution hack, the backend data pipeline was completely solved.

### Phase 2: The Architecture (100% Client-Side)
Because the API was unauthenticated and the initial CORS investigation showed we wouldn't be blocked, we decided to build the entire scraper as a **Pure Static Web App**. 

*   **Stack:** React, TypeScript, and Vite.
*   **Backend:** None! The user's own browser makes the `fetch()` requests directly to the HT servers.
*   **Hosting:** Because there is no backend database or Node.js server, the app compiles to pure HTML/CSS/JS and is hosted entirely for free on GitHub Pages.
```bash
const response = await fetch(`https://epaper.hindustantimes.com/Home/GetAllpages?editionid=${city.editionId}&editiondate=${dateStr}`);
const data = await response.json();

const pages = data.map((page) => {
    // Implementing the breakthrough: strip '_tn' to get the high-res file!
    const fullResUrl = page.TnImageUrl.replace('_tn.jpg', '.jpg');
    
    return {
        pageNumber: parseInt(page.PageNo),
        title: page.NewsProPageTitle,
        thumbnailUrl: page.TnImageUrl,
        fullResUrl: fullResUrl
    };
});
``` 

### Phase 3: The UI Pivot (Dashboard to Editorial)
Once the data was flowing, the initial UI looked like a generic "SaaS Dashboard." It had big control panels, empty white space, and glowing buttons. 

We completely stripped the UI down to an **Editorial / Archive aesthetic**:
1.  **Typography:** We switched to `Playfair Display` (a classic Serif font) for all headers to evoke a journalistic feel, while keeping `Inter` for the UI buttons.
2.  **Color Palette:** We removed generic gradients. We implemented a strict Light/Dark mode with subtle borders and a single "Newspaper Blue" (`#2563eb`) accent color.
3.  **The Gallery:** The pages were laid out in a responsive CSS Grid that naturally reflows to fit any monitor.

### Phase 4: Building the "Immersive Reader"
The biggest technical hurdle in the frontend was the reading experience. Standard HTML `<img>` tags aren't good enough for reading tiny newspaper print.

We integrated `react-zoom-pan-pinch` to build a custom document viewer, writing custom logic to make it behave like a professional PDF reader:
*   **Cursor-Targeted Zoom:** We wrote a math function so that when you click on a specific headline, the image scales and translates exactly to your mouse coordinates (`e.clientX`, `e.clientY`).
*   **Background Pre-fetching:** To make page-flipping instant, we added a hidden `<div>` that automatically loads the *next 3* high-res images in the background while you are reading the current page.

### Phase 5: The Mobile UX Masterclass
The desktop version was perfect, but the mobile version felt cramped. We executed a massive "Mobile UX Refinement Pass" focusing on maximizing screen real-estate.

1.  **Killing Nested Scrolls:** We ripped out `100vh` locks and let the native `<body>` tag handle all scrolling, unlocking smooth, native momentum scrolling.
2.  **The Smart Sticky Header:** When you scroll *down* to read, the top navigation bar completely slides off the screen. The second you flick your thumb *up*, it instantly drops back down.
3.  **The Auto-Collapsing Filter:** The giant dropdowns instantly collapse into a sleek, 1-inch summary bar (e.g., "Delhi Edition - May 31") when you load an edition.
4.  **Touch-Optimized Reader:** Inside the reader, we removed all padding so the newspaper touches the glass edges. The "Next/Prev" arrows were enlarged and anchored perfectly flush to the edges.

### Phase 6: True File Downloading
We couldn't just use `<a href="image.jpg" download>` because modern browsers will often just open the image in a new tab instead of saving it. To force a download, we wrote a function that fetches the image as a raw `Blob`, creates a temporary object URL in browser memory, generates an invisible link, clicks it, and then destroys the link.

## Conclusion
By relying on API reverse-engineering rather than HTML scraping, we bypassed the need for a backend server entirely. By meticulously focusing on CSS architecture, typography, and scroll mechanics, we turned a raw JSON feed into a premium, app-like reading experience that is hosted entirely for free.

---

## Setup & Local Development

This project requires Node.js and NPM.

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

## Production Build

To build the static optimized files for production:

```bash
npm run build
```
The compiled files will be located in the `dist` directory, ready to be deployed to any static host like Vercel, Netlify, or GitHub Pages.

## Disclaimer

This project is an independent viewer and is not affiliated with, endorsed by, or associated with Hindustan Times or any of its parent organizations.

**HT-ePaperScraper does not host, store, redistribute, modify, or republish newspaper pages on its own servers.** The application merely provides access to publicly available resources that are already accessible through the official publisher infrastructure.

All newspaper pages are loaded directly from their original source URLs at the time of viewing. **No copyrighted content is permanently stored, mirrored, or redistributed by this project.**

If you are a copyright holder and believe any aspect of this project infringes upon your rights, please open an issue or contact the project maintainer so the matter can be reviewed promptly.

*This project is intended solely for educational, research, archival exploration, and personal reading purposes.*

---
Made with ♥ by Aryan Raj
