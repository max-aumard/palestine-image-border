# Palestine Image Border

## Project Overview

Web application that adds a Palestine flag-colored circular border to profile pictures, similar to LinkedIn's "Open to Work" frame. The border displays the four colors of the Palestinian flag (black, white, green, red) arranged around the user's photo.

**100% client-side** — no images are uploaded or stored on any server. All processing happens in the browser using the Canvas API.

## Architecture

```
palestine-image-border/
├── index.html          # Single-page application
├── css/
│   └── style.css       # Styles (responsive, mobile-first)
├── js/
│   ├── app.js          # Main app logic, UI orchestration
│   ├── canvas.js       # Canvas rendering, border drawing
│   └── crop.js         # Image cropping integration (Cropper.js)
├── assets/
│   └── preview.png     # OG image / preview for social sharing
├── CLAUDE.md
├── LICENSE             # MIT
└── README.md
```

## Tech Stack

- **HTML/CSS/JS vanilla** — no framework, no build step
- **Canvas API** — for drawing the Palestine flag border and compositing the image
- **Cropper.js** (CDN) — lightweight client-side image cropping library
- **GitHub Pages** — free static hosting, zero server cost

## Flag Border Layout

The Palestine flag colors are arranged around the circular frame as follows:

```
        ┌─── BLACK ───┐
       /                \
  RED │                  │ BLACK
      │                  │
  RED │      PHOTO       │ WHITE
      │                  │
  RED │                  │ WHITE
       \                /
        └─── GREEN ───┘
```

Colors (exact values):
- Black: `#000000`
- White: `#FFFFFF`
- Green: `#009736`
- Red: `#D50032` (or `#CE1126`)

The border is drawn as 4 arc segments on a Canvas, each filled with the corresponding flag color.

## Key Features

1. **Image Upload** — drag & drop or file picker (client-side FileReader)
2. **Crop Tool** — interactive crop with aspect ratio lock (1:1), powered by Cropper.js
3. **Frame Shape** — toggle between circle and square frame
4. **Border Width** — adjustable border thickness
5. **Preview** — real-time canvas preview
6. **Download** — export as PNG via `canvas.toDataURL()`

## Development

### Run locally

No build step needed. Just serve the files:

```bash
# Any static server works
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`

### Code Conventions

- Vanilla JS (ES6+), no TypeScript, no bundler
- No external dependencies except Cropper.js (loaded via CDN)
- All image processing uses Canvas API (`CanvasRenderingContext2D`)
- Mobile-first responsive CSS
- French + English UI (i18n later, start with English)
- Accessible: proper alt texts, keyboard navigation, ARIA labels

### Canvas Drawing Logic

The core rendering pipeline in `canvas.js`:

1. Create offscreen canvas at target resolution (e.g., 1000x1000)
2. Draw the 4 colored arc segments (the flag border)
3. Clip a circle (or rounded rect for square mode) in the center
4. Draw the cropped user image into the clipped area
5. Export to PNG for download

Arc segments for the flag (clockwise from top):
- **Black**: from -90° to 0° (top to right-top)
- **White**: from 0° to 90° (right-top to bottom-right)
- **Green**: from 90° to 180° (bottom to left-bottom)
- **Red**: from 180° to 270° (left to top-left)

### Privacy

- Zero server-side processing
- No analytics, no cookies, no tracking
- Images never leave the user's browser
- All computation is done client-side via Canvas API

## Roadmap

### Phase 1 — MVP (Core functionality)
- [ ] Project scaffolding (index.html, css/, js/)
- [ ] Image upload (file picker + drag & drop)
- [ ] Canvas rendering: draw Palestine flag border (4 colored arcs)
- [ ] Circular clipping of user photo inside the border
- [ ] Download button (PNG export)
- [ ] Basic responsive CSS

### Phase 2 — Crop & Customize
- [ ] Integrate Cropper.js for image cropping (1:1 ratio)
- [ ] Border width slider
- [ ] Toggle circle vs square frame
- [ ] Real-time preview updates

### Phase 3 — Polish & Ship
- [ ] Mobile optimization and touch support
- [ ] OG meta tags + social preview image
- [ ] GitHub Pages deployment
- [ ] README with screenshots
- [ ] Share button (Web Share API)

### Phase 4 — Nice to have
- [ ] Multiple flag styles (different color arrangements)
- [ ] Custom text overlay (e.g., "Free Palestine")
- [ ] PWA support (offline usage)
- [ ] i18n (French, Arabic, English)
