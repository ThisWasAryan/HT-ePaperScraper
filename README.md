# HT-ePaperScraper

A beautiful, premium, open-source static web application for browsing, reading, and downloading Hindustan Times ePaper editions.

## Features

- **Professional Document Viewer:** An immersive, distraction-free reading experience powered by a custom pan-and-zoom engine. Single-click to zoom exactly at your cursor, double-click for larger steps, and smoothly pan across high-resolution pages.
- **True Original Quality:** View the exact high-resolution layouts straight from the publisher's digital press.
- **Historical Access:** Browse past publications and access older editions securely from the archive by selecting supported cities and publication dates.
- **Instant Background Loading:** Aggressive background pre-fetching ensures pages flip instantly as you read.
- **True File Downloading:** Safely download high-resolution JPGs of any page directly to your local device.
- **Premium Editorial Design:** A highly polished, responsive interface built with pristine serif typography and a carefully restrained color palette (featuring both Light and Dark modes).
- **Static & Fast:** A pure static frontend application built with React, Vite, and TypeScript. No backend required—designed perfectly for static hosting like GitHub Pages.

## How It Works

The application operates by programmatically analyzing the public Hindustan Times ePaper structure. By validating the edition date and city code, it dynamically aggregates high-resolution page assets and reading metadata. This structures the newspaper in its exact printed order, completely bypassing the ads, sign-in walls, and heavy tracking metrics present on the official website.

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
The compiled files will be located in the `dist` directory, ready to be deployed to any static host.

## Contributing

Feel free to open a Pull Request to add more supported cities, refine the design system, or improve the reading engine.

*Note: PDF generation (bundling all pages into a single document) is planned for a future release using a backend proxy service, as client-side PDF generation is strictly limited by browser CORS security rules.*

---
Made with ♥ by Aryan Raj
