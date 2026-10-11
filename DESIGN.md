# Design System: HT-ePaperScraper

This document captures the complete design language, UI decisions, UX philosophy, and interaction patterns developed for the HT-ePaperScraper project. This design system ensures a consistent, premium, and reusable architectural pattern for future applications.

---

## Product Philosophy

**Overall design philosophy:** The application functions as a highly premium, distraction-free reading portal. It intentionally distances itself from traditional "SaaS dashboard" aesthetics and leans heavily into "Editorial & Archive" aesthetics.
**Intended user experience:** Users should feel they are interacting with a high-end document viewer or a library archive. The transition from searching to reading must be seamless, prioritizing the actual newspaper content above all else.
**Design goals:** 
1. Maximize screen real-estate for reading.
2. Eliminate unnecessary visual noise, chrome, and empty canvases.
3. Provide intuitive, document-viewer-like controls (pan, zoom, full-screen).
**Visual personality:** Professional, elegant, restrained, and content-first.
**Target audience:** Readers, researchers, and archivists who value high-resolution document fidelity over flashy interface elements.
**Product positioning:** A fast, static, premium utility that strips away the bloat of modern news websites in favor of pure content delivery.

What makes the interface feel professional is its **restraint**. The UI chrome exists only to serve the content, utilizing vast amounts of breathing room when navigating, and aggressively collapsing out of the way when the user begins reading.

---

## Visual Identity

**Branding style:** Minimalist, editorial, and typographically driven.
**Visual tone:** Quiet and authoritative.
**Overall aesthetic:** The aesthetic is heavily "Open-source premium"—lightweight, hyper-fast, and entirely functional, but wrapped in a polished, highly refined visual shell. 
**Key Characteristics:**
- **Reader Focused:** Every decision maximizes the legibility and scale of the target media.
- **Minimalist:** No unnecessary gradients, drop-shadows, or artificial glowing effects.
- **Editorial:** Uses serif typography to evoke the feeling of printed media.

---

## Layout System

**Page structure:** A single-page architecture that flows organically from a hero-driven landing state into a dense grid gallery, and finally immerses the user in a full-screen reader.
**Container widths:** Max-width constraints on the landing experience (`900px`) for readability, transitioning to a fluid, unbounded layout for the gallery and reader to utilize all available monitor space.
**Grid system:** Responsive CSS Grid for the gallery (`minmax(280px, 1fr)`) that naturally reflows without strict breakpoints, maintaining the aspect ratio of newspaper pages.
**Responsive behavior:** The layout behaves elastically on desktop but transitions to stacked, touch-friendly, scroll-driven layouts on mobile.
**Layout Rules:**
- **Desktop:** The header and filter controls sit horizontally at the top, permanently accessible.
- **Mobile:** The layout defers strictly to vertical scrolling. Controls that take up too much vertical space actively collapse or hide when not in use.

Hierarchy is created strictly through typography scale and structural positioning, never through heavy boxing or card nesting. This improves usability by reducing cognitive load; users immediately understand what is a control vs. what is content.

---

## Typography System

**Font choices:**
- **Primary (UI/Data):** `Inter` (or system sans-serif fallback). Used for all functional UI elements, metadata, buttons, and navigation. 
- **Heading (Editorial/Display):** `Playfair Display` (or Georgia/serif fallback). Used exclusively for major titles and branding to invoke a journalistic, newspaper-like feel.

**Typographic Scale:**
- **Landing Hero:** Massive `2.75rem` serif, bold (`700`).
- **Section Titles:** `1.5rem`, semi-bold (`600`).
- **Standard UI:** `1rem` and `0.875rem` for secondary metadata.

**Line heights & Spacing:** Standard `1.5` line height for readability. Paragraph spacing is generous. Navigation styling relies on font-weight and subtle color shifts rather than heavy background fills.

Typography bridges the gap between modern software (Inter) and classic publishing (Playfair Display), creating an instant subliminal connection to the product's purpose.

---

## Color System

The application relies on CSS variables for seamless Light/Dark mode integration.
- **Primary Background (`--bg-color`):** Pure white in light mode, deep charcoal/almost black in dark mode. 
- **Surface Color (`--surface-color`):** Slightly elevated backgrounds for cards and headers (e.g., `#f8fafc` in light, `#1e293b` in dark).
- **Text Primary/Secondary:** High contrast text for primary readability, muted text for metadata (dates, page numbers).
- **Border Colors:** Extremely subtle, low-opacity borders to separate sections without drawing attention.
- **Accent Color (`--accent-color`):** A sharp, professional "Newspaper Blue" (`#2563eb` / `#3b82f6`).

**Usage Guidelines:** Accent colors are used **exclusively** for primary action buttons (like "Load Edition") and active hover states. They are *never* used as large background fills or decorative shapes.

---

## Component Design

### Header & Navigation
- **Purpose:** Branding and global controls (theme toggle).
- **Visual Design:** Minimal horizontal bar, separated by a 1px subtle border.
- **Interaction:** Sticky or hidden based on scroll (on mobile).

### Filter Controls (Selector)
- **Purpose:** Allow users to query the archive.
- **Visual Design:** Clean, native-feeling inputs arrayed horizontally on desktop.
- **Interaction:** On mobile, aggressive auto-collapsing. After a search, it morphs into a compact "Summary Bar" with an "Edit" button to save space.

### Reader Controls
- **Purpose:** Facilitate document navigation and manipulation.
- **Visual Design:** Floating, semi-transparent pill-shaped overlays or corner-anchored icon buttons.
- **Interaction:** Navigation arrows live on the extreme edges of the screen to prevent obscuring text.

### Empty / Loading States
- **Purpose:** Communicate background work seamlessly.
- **Visual Design:** Centered, serif-titled loading screens with subtle spinner animations. No jarring screen flashes.

---

## Reader Experience

The Reader is the core of the application. It acts more like a high-end PDF viewer than a standard web page.

- **Reader Layout:** Fixed, `100vw/100vh` overlay. The document is centered, and controls float on top.
- **Zoom Behavior:** Desktop users expect document-viewer logic. A single click zooms directly into the cursor's coordinate. Double click provides larger zoom steps. Panning works naturally.
- **Navigation Patterns:** Invisible background pre-fetching ensures that hitting the "Next" arrow results in an instant page flip.
- **Fullscreen Behavior:** Native browser fullscreen API integration strips away the OS and Browser chrome for total immersion.
- **Content Prioritization:** The image is the only thing that matters. Controls are pushed to the absolute edges or bottom.

---

## Mobile Design Philosophy

Mobile design fundamentally shifts from a "dashboard" to a "native app" feel.

- **Scroll Behavior:** Uses native `<body>` momentum scrolling. Absolutely no nested `overflow-y` containers which cause "scroll traps" on iOS/Android.
- **Space Management:** Vertical space is fiercely protected. The filter panel collapses into a single-line summary after use.
- **Smart Sticky Header:** The top navigation disappears when scrolling down to browse the gallery, giving 100% of the screen to the content. It instantly reappears upon scrolling up.
- **Touch Interactions:** Touch targets inside the reader are drastically enlarged. Navigation arrows are moved perfectly flush to the screen edges.

---

## Interaction Design

- **Hover States:** Buttons slightly fade (`opacity: 0.8`); Gallery cards gently scale up (`scale: 1.03`) to indicate interactivity without moving surrounding layout elements.
- **Active/Focus States:** Form inputs receive a crisp accent-colored border when focused.
- **Transitions:** Global `0.2s` cubic-bezier transitions for background and text colors to make dark-mode toggling feel smooth and expensive.
- **Animation Philosophy:** Animations are functional, never decorative. We use scale transitions for hover, and translate transitions for the sticky header sliding in/out. We intentionally avoid bouncy, elastic, or overly dramatic animations that feel cheap or distracting.

---

## Spacing System

**Vertical Rhythm & Spacing:**
- **Margins & Padding:** `2rem` is the standard block spacing on desktop, scaled down to `1rem` or `0.5rem` on mobile.
- **Component Spacing:** Elements that belong together use tight gaps (`0.5rem`), while separate functional zones are divided by heavy whitespace (`2rem` to `4rem`).
- **Philosophy:** Whitespace is used as the primary structural tool instead of drawing boxes or borders around everything.

---

## Design Rules

Future implementations must strictly adhere to the following rules:

1. **Content is King:** Never introduce UI chrome that steals space from the primary content.
2. **No Dashboard Aesthetics:** Avoid lateral sidebars, massive empty canvas spaces, and heavy "admin-panel" box-shadows.
3. **Respect Vertical Space:** On mobile, interfaces must automatically collapse or hide out of the way when the user transitions from "searching" to "reading".
4. **Use Typography for Hierarchy:** Differentiate sections by changing font weight, family, or size, rather than putting things in distinct colored boxes.
5. **Serif for Soul, Sans for Function:** Reserve serif fonts strictly for titles, branding, and editorial touchpoints.
6. **Native Scrolling Always:** Never nest `overflow-y: auto` inside main content containers; allow the browser body to handle scroll routing.
7. **Restrain Accent Colors:** Use accent colors only to draw the eye to the single most important action on the screen.

---

## How To Replicate This Design In Future Projects

**Reusable Design Blueprint:**

To successfully implement this design language in a completely different application (e.g., an eBook reader, a photo archive, or a research database), follow this blueprint:

1. **Typography Base:** Install one clean, modern Sans-Serif (e.g., `Inter`) and one traditional Serif (e.g., `Playfair Display`). Map all `<p>`, `<button>`, and `<input>` elements to the Sans-Serif. Map all `<h1>`, `<h2>`, and major branding to the Serif.
2. **Color Palette Initialization:** Define a CSS variable system with a pure background (`#ffffff` / `#0f172a`), a subtly offset surface (`#f8fafc` / `#1e293b`), high-contrast text, muted secondary text, and *one* single vibrant accent color. Do not add supplementary colors.
3. **Remove the Boxes:** Strip all borders, backgrounds, and drop-shadows from standard content sections. Let whitespace dictate where sections begin and end.
4. **Build the "Compact Mode" Hook:** For any complex search or filter area, build a mechanism that turns a massive form into a single-line summary string once the search executes.
5. **Smart Scroll Header:** Always implement a scroll-direction listener (`window.scrollY`). Hide top-level navigation when `deltaY > 0`, show it when `deltaY < 0`.
6. **The Overlay Reader Paradigm:** When inspecting a specific item (image, document, text), do not open it inline. Mount a fixed, full-screen overlay that overtakes the entire viewport, mapping closing actions to the `Escape` key and outside clicks. Provide native-feeling zoom and pan capabilities tied directly to cursor coordinates.
