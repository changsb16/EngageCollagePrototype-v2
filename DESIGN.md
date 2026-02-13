# Design Documentation: Engage Image Collage Prototype

## Overview

An interactive React prototype demonstrating a smart image collage system with locked aspect ratios and automatic orientation detection. This prototype explores layout strategies for displaying 1-7 images in a consistent, visually appealing format inspired by social media feed designs.

**Live Demo:** [View on GitHub Pages](https://changsb16.github.io/EngageCollagePrototype-v2/)

---

## Design System

### Locked Aspect Ratios

The collage uses predefined aspect ratios to ensure visual consistency across all layouts:

| Type | Aspect Ratio | Use Case |
|------|--------------|----------|
| **Hero Portrait** | 4:5 | Primary image when portrait-oriented |
| **Hero Landscape** | 3:2 | Primary image when landscape-oriented |
| **Secondary** | 4:3 | All supporting images |
| **Square** | 1:1 | Two-image layouts (landscape hero only) |

**Rationale:** Locked aspect ratios prevent awkward gaps and ensure a polished, consistent feed appearance regardless of original image dimensions.

---

## Orientation Detection

### Automatic Detection (Local Images)

For local images in `public/photos/`, the system automatically detects orientation from the image's natural dimensions:

```typescript
const heroIsPortrait = heroItem.height > heroItem.width;
```

- **Portrait:** height > width → Use 4:5 hero + 4:3 secondaries
- **Landscape:** height ≤ width → Use 3:2 hero + 4:3 secondaries

### Manual Assignment (Unsplash Images)

For demo purposes with Unsplash API images, orientation is randomly assigned on rotation since we're generating images dynamically.

---

## Layout Strategies

### 1 Image
- **Portrait:** Single 4:5 tile
- **Landscape:** Single 3:2 tile

### 2 Images
- **Portrait Hero:** Two 4:5 tiles side-by-side (1fr 1fr grid)
- **Landscape Hero:** Two 1:1 tiles side-by-side (1fr 1fr grid)

### 3 Images (Portrait Hero)
```
┌─────────┬───┐
│         │ 2 │
│    1    │   │
│  (4:5)  │   │
│         │ 3 │
└─────────┴───┘
```

**Facebook/LinkedIn-style flexible height approach:**
- Hero: Left column, 66% width, 4:5 locked aspect ratio
- 2 Secondaries: Right column, each at **50% height** (no locked aspect ratio)
- Positioning: `justifyContent: "space-between"` with no gap
- Result: Top secondary aligns with hero top, bottom secondary aligns with hero bottom

**Why flexible height for 3 images?**
- Prevents empty white space at the bottom
- Matches how Facebook and LinkedIn handle 3-image layouts
- Ensures perfect top/bottom alignment regardless of image dimensions
- Images use `object-fit: cover` to fill their container while maintaining proper cropping

### 4+ Images (Portrait Hero)
```
┌─────────┬───┐
│         │ 2 │
│    1    ├───┤
│  (4:5)  │ 3 │
│         ├───┤
│         │ 4 │
└─────────┴───┘
```

- Hero: Left column, 66% width, 4:5 locked aspect ratio
- 3 Secondaries: Right column, stacked vertically, 4:3 locked aspect ratio each
- Positioning: `justifyContent: "space-between"` with no gap
- Result: Secondaries evenly distributed (top, middle, bottom)

### 3-4+ Images (Landscape Hero)
```
┌───────────────┐
│       1       │
│     (3:2)     │
├─────┬─────┬───┤
│  2  │  3  │ 4 │
└─────┴─────┴───┘
```

- Hero: Top row, full width, 3:2 aspect ratio
- Secondaries: Bottom row, horizontal grid, 4:3 aspect ratio each

### 5+ Images
Shows first 4 images with "+N more" overlay on the last visible tile (Engage-style).

---

## Implementation Details

### Image Cropping
All images use **center cropping** to fit aspect ratios:
- **Unsplash API:** `fit=crop&crop=center` parameters
- **CSS:** `object-fit: cover` + `object-position: center`

### Click-to-Preview
Clicking any image opens a full-screen modal with:
- Dark overlay (rgba(0, 0, 0, 0.9))
- Close button (top-right)
- Centered image (max 90% viewport)
- Click outside to close

### Responsive Width
- Default: 600px
- Adjustable: 320px - 900px via slider
- Test breakpoints: 375px (mobile), 414px (large mobile), 768px (tablet)

---

## Design Decisions & Trade-offs

### Why Locked Aspect Ratios?
**Problem:** Variable aspect ratios create awkward gaps and inconsistent layouts.

**Solution:** Lock to specific ratios and use center cropping.

**Trade-off:** Some image content may be cropped. Center cropping minimizes impact on most photos (faces, objects typically centered).

### Why 4:5 for Portrait Hero?
- Common portrait ratio (Instagram, Pinterest)
- Not too tall (avoids 9:16 extreme)
- Balances well with 4:3 secondaries

### Why 3:2 for Landscape Hero?
- Standard landscape ratio (DSLR cameras)
- Not too wide (avoids 16:9 extreme)
- Works well with horizontal secondary grid

### Why 4:3 for Secondary Images (When Used)?
- Versatile ratio that works for both portrait and landscape secondaries
- Used for 4+ image layouts to maintain consistency
- Creates visual balance without extreme proportions

**Exception:** For 3-image layouts with portrait hero, secondaries use flexible height (50% each) instead of locked aspect ratios to ensure perfect alignment with the hero and eliminate empty space

### Portrait Hero Width: 66%
- Gives hero prominence without overwhelming secondaries
- Tested range: 66-70% (settled on 66% as default)
- Provides enough space for 3 secondary images to breathe

---

## Technical Architecture

### Component Hierarchy
- **App.tsx:** Demo harness with controls, generates MediaItem arrays
- **EngagePostCard.tsx:** Card wrapper (header, body, media, reactions)
- **EngageImageCollage.tsx:** Core collage logic with orientation-aware layouts

### Key Functions
- `isPortrait(item)`: Detects orientation from width/height metadata
- `Tile()`: Renders individual image with locked aspect ratio
- Layout branches: Conditional rendering based on image count + orientation

### State Management
- `photoOffset`: Cycles through different images on rotation
- `forceOrientation`: Manual override for Unsplash (null for local auto-detect)
- `previewItem`: Controls modal preview state

---

## Testing Scenarios

The prototype includes controls to test:
- **Image count:** 1, 2, 3, 4, 7 images (+ overlay)
- **Photo sets:** People (faces), Mixed (objects/scenes), Local (your own photos)
- **Container width:** 320-900px responsive testing
- **Missing metadata:** Fallback behavior when width/height unavailable

---

## Future Considerations

### Smart Cropping
Currently uses center cropping. Future enhancement could use:
- Face detection for portraits
- Focal point detection for objects/scenes
- Would reduce content loss from cropping

### Dynamic Gap Sizing
Current gap: 6px fixed. Could adjust based on:
- Container width (smaller gaps on mobile)
- Image count (tighter spacing with more images)

### Accessibility
- Add keyboard navigation for image preview
- Improve screen reader support for overlays
- Consider reduced motion preferences

---

## Usage

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
```

Add your own images to `public/photos/` to test with local photos. The system will automatically detect their orientation and apply appropriate aspect ratios.
