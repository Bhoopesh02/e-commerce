# AURELIA Design System

This document outlines the core design rules, tokens, and aesthetic principles for the AURELIA luxury fashion website.

## 1. Brand Concept & Theme

*   **Aesthetic:** Luxury Haute Couture & Ready-to-Wear. The site operates in an "Editorial Mode" that feels like a dramatic, expressive, rich fashion magazine.
*   **Theme:** Strictly **Light Mode**. There is intentionally no dark mode to maintain a clean, high-end editorial feel.

## 2. The Six-Color Luxury Palette

The application uses a highly controlled 6-color system defined in CSS variables (`src/styles/variables.css`).

| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Diamond** | `#FFFFFF` | Primary app background, cards, and content surfaces. Core neutral. |
| **Black Tie** | `#141414` | Primary text, icons, high-contrast panels, and footer. |
| **Sapphire** | `#244B57` | Primary brand color. Secondary text, major headings, nav accents, secondary buttons. |
| **Golden** | `#C29B4C` | Luxury accent and primary Call-To-Action (CTA) background. |
| **Icy Lake** | `#CAD4D6` | Soft backgrounds, secondary sections, and subtle hover areas. |
| **Silver** | `#E0E0E0` | Standard borders, dividers, and disabled states. |

### Semantic Colors
*   **Success:** `#1E6F5C`
*   **Error:** `#B00020`
*   **Warning:** `#8A641F`
*   **Info:** `#315F70`

## 3. Typography Hierarchy

Fonts are loaded via `@import` in `src/styles/typography.css` and mapped to CSS variables. The system relies on semantic typography tokens.

*   **Display / Editorial:** Uses **Cormorant Garamond** (`var(--font-display)`).
    *   **Usage:** Display text, headings, and editorial content.
    *   **Classes:** `.type-hero`, `.type-display`, `.type-h1`, `.type-h2`, `.type-h3`, `.type-h4`.
*   **Body / UI:** Uses **Plus Jakarta Sans** (`var(--font-body)`).
    *   **Usage:** General paragraphs, UI elements, and data tables.
    *   **Classes:** `.type-body`, `.type-lead`, `.type-caption`, `.type-nav`, `.type-button`.
*   **Luxury Accents:** Uses **Cinzel** (`var(--font-accent)`).
    *   **Usage:** Small accents, labels, and badges.
    *   **Classes:** `.type-eyebrow`, `.type-badge`.

### Text Colors
*   **Primary Headings:** `--text-primary` (Black Tie)
*   **Secondary Text:** `--text-secondary` (Sapphire)
*   **Muted Text:** `--text-muted` (`#667276`)
*   **CTA Text:** Black Tie on Golden background.

## 4. Spacing, Shapes, and Layouts

*   **Containers:** Maximum width is clamped to prevent stretching on ultrawide monitors.
    *   Standard: `.container` (`1440px`)
    *   Narrow (e.g., checkout): `.container-narrow` (`960px`)
*   **Border Radii:** Soft, rounded elements are heavily utilized.
    *   Cards/Surfaces: `16px` (`--radius-md`)
    *   Buttons/Pills: `999px` (`--radius-pill`)
*   **Focus States:** Default browser outlines (blue/orange rings) are stripped (`outline: none`). Keyboard navigation focus uses a 2px offset ring in the **Golden** accent color.

## 5. UI Components & "Glassmorphism"

*   **Admin Panel:** Sections marked with `data-admin="true"` heavily utilize **Glassmorphism**.
    *   Cards use frosted glass effects (`backdrop-filter: blur(16px)`), subtle white gradients, and translucent borders to appear as if floating on the Diamond canvas.
*   **Buttons:**
    *   **Quick Add:** Dark transparent overlays (`rgba(20, 20, 20, 0.86)`) with blur filters. Clicking triggers a subtle radial white flash (ripple effect).
    *   Hovering over icons inside buttons generally initiates a gentle bounce scale-up (`scale(1.18)`).
*   **Scrollbars:** Standard browser scrollbars are hidden and replaced with custom slim (`7px`), rounded silver scrollbars that turn Sapphire on hover.

## 6. Animation & Motion (Micro-interactions)

*   **Timing:** Transitions are grouped into Fast (180ms), Normal (350ms), and Slow (800ms).
*   **Easing:** Custom `--ease-editorial` curve (`cubic-bezier(0.16, 1, 0.3, 1)`). This provides a snappy, spring-like acceleration that slows down gracefully, making the site feel highly responsive and luxurious.
*   **Interactions:** Hovering on cards slightly lifts them on the Y-axis and deepens their drop-shadow (`--shadow-md`) instead of drastically changing colors.
