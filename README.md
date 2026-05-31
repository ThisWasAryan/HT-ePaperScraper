# HT ePaper ScraperLOL

A beautiful, premium, open-source static web application for browsing, reading, and downloading Hindustan Times ePaper editions.

## Features

- **Edition Discovery:** Browse daily ePaper editions by selecting a supported city and publication date.
- **Premium Gallery:** A responsive, dark-mode-first gallery grid that pre-loads high-quality page thumbnails.
- **Immersive Reader:** A full-screen distraction-free reading experience with Zoom, Fullscreen, and rapid background page pre-fetching.
- **Individual Page Downloads:** Download high-resolution JPGs of any page directly to your device.
- **Static & Fast:** Pure static frontend React application (Vite + React + TypeScript), designed perfectly for GitHub Pages deployment.

## How it works

The application functions by directly scraping the Hindustan Times ePaper public URLs. It seamlessly validates the edition date and city code, extracting the page images and reading metadata to organize the newspaper in its exact printed order. It completely bypasses all the clunky ads, sign-in popups, and tracking metrics present on the official website, giving you the pure newspaper.

## Setup & Local Development

This project requires Node.js and NPM.

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd EPaperScraping
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

To build the static files for production (e.g., GitHub Pages):

```bash
npm run build
```
The optimized files will be located in the `dist` directory.

## Contributing

Feel free to open a Pull Request to add more supported cities or improve the reader functionality. 

*Note: PDF generation is planned for MVP v2 using a backend proxy service, as client-side PDF generation is limited by browser security rules.*
