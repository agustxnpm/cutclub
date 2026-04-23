# Design System Specification: Dark Barber Editorial

## 1. Overview & Creative North Star
**The Creative North Star: "The Modern Atelier"**
This design system moves beyond the "SaaS dashboard" trope, drawing inspiration from the tactile, high-contrast environment of a premium barbershop. It is defined by **Atmospheric Depth** and **Editorial Precision**. Instead of a rigid grid of boxes, we treat the UI as a curated publication—utilizing expansive negative space, oversized typography, and intentional asymmetry to guide the user’s eye. 

The aesthetic is "Low-Light, High-Focus." We reject the generic "flat" dark mode in favor of a layered, tonal experience where importance is signaled through light-bleed and surface-shifts rather than structural lines.

---

## 2. Colors & Surface Logic

### The Palette
The core of this system is the contrast between deep obsidian blacks and a singular, sharp "Electric Cobalt" (`primary`).

*   **Primary (Electric Cobalt):** `#b2c5ff` (Primary) / `#0048B3` (Brand Core). Use sparingly—only for the absolute "North Star" action on a screen.
*   **Neutral Foundation:**
    *   `background`: `#0e0e0e` (The Canvas)
    *   `surface`: `#0e0e0e` (Base Layer)
    *   `surface-container-low`: `#131313` (Secondary regions)
    *   `surface-container-high`: `#1f2020` (Elevated cards)
*   **Typography:**
    *   `on-surface`: `#e7e5e4` (Text Primary)
    *   `on-surface-variant`: `#acabaa` (Text Secondary / Muted)

### The "No-Line" Rule
Traditional 1px solid borders are prohibited for sectioning content. Boundaries must be defined through **Background Color Shifts**. 
*   *Implementation:* Place a `surface-container-low` section directly against the `background`. The slight tonal shift (from `#0e0e0e` to `#131313`) creates a sophisticated, "borderless" containment.

### Glass & Gradient Logic
To prevent the dark mode from feeling "heavy," utilize glassmorphism for floating navigation and modals.
*   **The Signature Halo:** For primary CTAs, apply a subtle radial gradient behind the element: `primary` at 10% opacity fading to 0%. This creates a "discrete halo" effect that mimics a spotlight in a dark room.

---

## 3. Typography
We utilize a pairing of **Epilogue** (Display/Headlines) and **Inter** (UI/Body) to create an editorial feel.

*   **Display (Epilogue):** Set with tight letter-spacing (-0.02em). These are the "headlines of the magazine." Use `display-lg` (3.5rem) for hero headers to command immediate authority.
*   **Headline (Epilogue):** Used for section starts. High weight (Bold/700) is required to maintain hierarchy against the dark background.
*   **Body (Inter):** Clean, high-readability sans-serif. Use `body-md` (0.875rem) as the standard. For secondary information, use `body-sm` but never drop below `medium` weight (500) to ensure accessibility in dark mode.
*   **Labels (Inter):** Always uppercase with increased letter-spacing (+0.05em) when used for categories or small metadata.

---

## 4. Elevation & Depth

### The Layering Principle
Hierarchy is achieved by stacking "Tiers." 
1.  **Tier 0 (The Floor):** `surface-container-lowest` (#000000) - used for deep backgrounds or inset areas.
2.  **Tier 1 (The Page):** `surface` (#0e0e0e) - the main content area.
3.  **Tier 2 (The Card):** `surface-container-high` (#1f2020) - for interactive elements or grouped content.

### Ambient Shadows
Shadows must be felt, not seen.
*   **Token:** `Shadow-Ambient`
*   **Specs:** `0px 24px 48px rgba(0, 0, 0, 0.5)`
*   Avoid grey shadows. If a shadow sits on a surface with a blue tint, the shadow should be a deeper version of that tint to maintain color harmony.

### The "Ghost Border"
If a container requires a border (e.g., input fields), use the `outline-variant` (#484848) at **20% opacity**. This creates a "glint" on the edge rather than a visible cage.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary_container` (#0040a1) with `on_primary_container` text. Roundedness: `md` (0.75rem).
*   **Secondary:** Ghost style. No background, `Ghost Border` (20% opacity outline), with `on_surface` text.
*   **Tertiary:** Text only. `Inter Bold`, uppercase, 0.05em tracking.

### Cards
*   **Rule:** No dividers. Separate content using `Spacing 6` (2rem) or by nesting a `surface-container-highest` box inside a `surface-container-low` background.
*   **Corner Radius:** Consistently use `lg` (1rem) for outer cards and `md` (0.75rem) for inner elements to create a nested "harmonic" look.

### Input Fields
*   **Style:** Minimalist. Background: `surface-container-lowest`. Bottom border only (Ghost Border style) until focused. Upon focus, the border transitions to a subtle `primary` glow.

### The "Service Chip"
*   Specific to the barber context: A small, pill-shaped `secondary_container` element used for status or categories. Use `label-md` typography.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Push a headline to the far left and the body text to a 60% width column to create an editorial feel.
*   **Do** embrace negative space. If a screen feels "busy," increase the spacing between sections to `Spacing 12` or `16`.
*   **Do** use `primary` color as a "surgical strike"—only for the most important interactive element on the screen.

### Don't:
*   **Don't** use pure white (#FFFFFF) for body text; it causes "halation" (glowing effect) on dark backgrounds. Use `on_surface` (#e7e5e4).
*   **Don't** use 1px solid dividers to separate list items. Use a 12px vertical gap instead.
*   **Don't** use circular buttons (FABs). Stick to the `md` (0.75rem) or `lg` (1rem) roundedness scale to maintain the sophisticated, modern architectural look.
*   **Don't** use "Drop Shadows" on flat surfaces. Depth should come from tonal shifts in the background color first. Only use shadows for floating modals or menus.