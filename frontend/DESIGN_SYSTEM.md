# AURELIA Atelier Design System

> Comprehensive specification, token reference, and architectural standards for the AURELIA luxury fashion platform.

---

## Table of Contents

- [Foundations](#foundations)
  - [1. Brand Essence](#1-brand-essence)
  - [2. Logo & Identity](#2-logo--identity)
  - [3. Color](#3-color)
  - [4. Typography](#4-typography)
- [System](#system)
  - [5. Layout & Spacing](#5-layout--spacing)
  - [6. Shape & Elevation](#6-shape--elevation)
  - [7. Motion](#7-motion)
  - [8. Z-Index Ladder](#8-z-index-ladder)
- [Application](#application)
  - [9. Components](#9-components)
  - [10. Architecture](#10-architecture)
  - [11. Language & A11y](#11-language--a11y)
- [Governance](#governance)
  - [12. Transition Guidance](#12-transition-guidance)
  - [13. Quick Reference](#13-quick-reference)

---

# Foundations

## 1. Brand Essence
* **Aesthetic Philosophy:** Luxury Haute Couture & Ready-to-Wear editorial experience. The interface operates in an **Editorial Mode** that evokes the dramatic, rich, bespoke typography of luxury fashion publications (Vogue, Harper's Bazaar, Architectural Digest).
* **Tone:** Regal, restrained, confident, precise. Generous whitespace, razor-sharp alignment, and deliberate restraint rather than sensory overload.
* **Light-First Commitment:** Strictly **Light Mode**. There is intentionally no dark mode toggle for the customer storefront in order to maintain a pristine, gallery-white editorial feel. High-contrast panels (Black Tie) provide intentional dramatic punctuation.

---

## 2. Logo & Identity
* **Wordmark:** Typeset in uppercase **Cormorant Garamond** (or Cinzel for micro-badging), tracking `0.25em` to `0.3em` (`tracking-[0.28em]`).
* **Clearspace:** A minimum breathing room equivalent to the height of the letter "A" must surround the wordmark at all times.
* **Minimum Sizing:**
  * Desktop header: `24px` height (`text-2xl` tracking-widest).
  * Mobile header: `18px` height (`text-lg` tracking-widest).
  * Monogram / Favicon: `A` in Cinzel with sharp serifs.

---

## 3. Color

The platform uses a strict Six-Color Luxury Palette backed by CSS custom properties in `src/styles/variables.css`:

### 3.1 The Six-Color Luxury Palette
| Token | Hex Value | CSS Variable | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Diamond** | `#FFFFFF` | `var(--color-diamond)` | Primary application canvas, content cards, crisp surfaces |
| **Black Tie** | `#141414` | `var(--color-black-tie)` | Primary typography, high-contrast editorial blocks, footer |
| **Sapphire** | `#244B57` | `var(--color-sapphire-700)` | Primary brand color, headings, navigation accents, secondary buttons |
| **Golden** | `#C29B4C` | `var(--color-golden-500)` | Luxury accent, primary Call-To-Action (CTA) background, badges |
| **Icy Lake** | `#CAD4D6` | `var(--color-icy-lake-300)` | Soft muted backgrounds, secondary sections, subtle hover fills |
| **Silver** | `#E0E0E0` | `var(--color-neutral-200)` | Architectural borders, hairline dividers, disabled states |

### 3.2 Semantic Feedback Palette
* **Success:** `#1E6F5C` (`var(--color-success)`) / Background: `#E8F5E9`
* **Error:** `#B00020` (`var(--color-error)`) / Background: `#FFEBEE`
* **Warning:** `#8A641F` (`var(--color-warning)`) / Background: `#F6EEDB`
* **Info:** `#315F70` (`var(--color-info)`) / Background: `#E7EFF1`

### 3.3 Semantic Color Tokens
```css
--bg-primary: var(--color-diamond);
--bg-surface: var(--color-neutral-50);
--bg-subtle: var(--color-sapphire-50);
--bg-accent: var(--color-golden-50);

--text-primary: var(--color-black-tie);
--text-secondary: var(--color-sapphire-700);
--text-muted: #667276;
--text-inverse: var(--color-diamond);

--border-color: var(--color-neutral-200);
--cta-primary: var(--color-sapphire-700);
--cta-secondary: var(--color-golden-500);
```

---

## 4. Typography

Loaded via Google Fonts (`Cormorant Garamond`, `Plus Jakarta Sans`, and `Cinzel`) and managed in `src/styles/typography.css`.

| Role | Family | Font Stack | Typical Usage |
| :--- | :--- | :--- | :--- |
| **Display / Editorial** | Cormorant Garamond | `'Cormorant Garamond', Garamond, Didot, serif` | Hero banners, section headers, product titles (`.type-hero`, `.type-h1`) |
| **Body / UI** | Plus Jakarta Sans | `'Plus Jakarta Sans', system-ui, sans-serif` | Product descriptions, UI buttons, forms, tables, body copy |
| **Luxury Accents** | Cinzel | `'Cinzel', 'Trajan Pro', Georgia, serif` | Category eyebrows, pill tags, badges, premium numbers (`.type-eyebrow`) |

### Type Scale Rules
* **Hero Display:** `clamp(2.75rem, 6vw, 5.5rem)`, line-height `1.05`, tracking `-0.02em`
* **H1 / Section Titles:** `clamp(2rem, 4vw, 3.25rem)`, line-height `1.15`, Cormorant Garamond
* **H2 / Subheadings:** `clamp(1.5rem, 2.5vw, 2.25rem)`, line-height `1.25`, Cormorant Garamond
* **Body Regular:** `1rem (16px)`, line-height `1.6`, Plus Jakarta Sans
* **Body Small / Captions:** `0.875rem (14px)`, line-height `1.5`, Plus Jakarta Sans
* **Eyebrow / Badges:** `0.75rem (12px)`, uppercase, tracking `0.18em` to `0.25em`, Cinzel

---

# System

## 5. Layout & Spacing

### 5.1 Container Widths
* **Standard Page Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px clamp)
* **Wide Hero / Editorial Strip:** `max-w-[1440px] mx-auto px-4 sm:px-8`
* **Narrow Checkout / Auth Container:** `max-w-xl mx-auto px-4` (640px clamp) or `max-w-4xl` for account tables

### 5.2 Vertical Section Rhythm
* Standard section padding: `py-16 sm:py-20 lg:py-24`
* Compact / nested groups: `py-8 sm:py-12`
* Component internal spacing: base-4 scale (`p-4`, `p-6`, `p-8`)

---

## 6. Shape & Elevation

### 6.1 Border Radii
* `rounded-full`: Pill buttons, action tags, avatar frames, filter chips
* `rounded-xl` (`16px`): Primary product cards, modal surfaces, floating panels
* `rounded-lg` (`12px`): Dropdown menus, input fields, notification toasts
* `rounded-md` (`8px`): Sub-badges, color swatches, inline tooltips
* *Avoid:* Bare un-curved borders where cards meet, or arbitrary ad-hoc values like `rounded-[23px]`.

### 6.2 Shadows & Glassmorphism
* **Subtle Elevation (`--shadow-sm`):** `0 2px 8px -2px rgba(20, 20, 20, 0.05)`
* **Card Rest Elevation (`--shadow-md`):** `0 8px 24px -4px rgba(20, 20, 20, 0.08)`
* **Floating / Modal (`--shadow-xl`):** `0 20px 48px -12px rgba(20, 20, 20, 0.16)`
* **Editorial Glass:** `backdrop-blur-md bg-white/80 border border-white/20 shadow-lg`

---

## 7. Motion

Micro-interactions must feel deliberate, silky, and editorial rather than bouncy or gamified.

* **Curve:** `--ease-editorial: cubic-bezier(0.16, 1, 0.3, 1)`
* **Durations:**
  * Fast / Micro: `150ms – 200ms` (hover states, button clicks)
  * Normal / Transitions: `300ms – 350ms` (slide-outs, accordions, modals)
  * Slow / Editorial: `600ms – 800ms` (page hero fades, stagger reveals)
* **Rule:** Animate only hardware-accelerated properties (`transform`, `opacity`). Never transition `all` or layout-triggering properties (`width`, `height`, `margin`).

---

## 8. Z-Index Ladder

Enforce strict stacking context hierarchy across overlays, menus, and content:

```
┌──────────────────────────────────────────────┐
│ 1000  Modal & Alert Dialogs                 │
├──────────────────────────────────────────────┤
│ 900   Cart Drawer / Mobile Navigation Drawer │
├──────────────────────────────────────────────┤
│ 500   Backdrop Overlays                      │
├──────────────────────────────────────────────┤
│ 100   Sticky / Floating Header Navbar        │
├──────────────────────────────────────────────┤
│ 50    Sticky Filters / Sub-navigation        │
├──────────────────────────────────────────────┤
│ 10    Badges, Floating Action Buttons        │
├──────────────────────────────────────────────┤
│ 1     Relative positioned cards              │
├──────────────────────────────────────────────┤
│ 0     Base Document Flow                     │
└──────────────────────────────────────────────┘
```

---

# Application

## 9. Components

Every component must support the 4 standard interaction states: **Default**, **Hover / Focus**, **Active / Loading**, and **Disabled**.

* **Buttons (`src/components/ui/Button.tsx`):**
  * Primary: Sapphire background (`#244B57`), white text, hover lift.
  * Luxury Accent: Golden background (`#C29B4C`), Black Tie text, gleaming subtle scale.
  * Outline: Silver border (`#E0E0E0`), transparent background, Sapphire text.
  * Ghost / Text: Underline animated on hover with `--ease-editorial`.
* **Inputs & Form Controls:**
  * Standard: `border-neutral-200 bg-white focus:border-sapphire-700 focus:ring-1 focus:ring-sapphire-700`.
* **Badges:**
  * Golden Luxury: `bg-[var(--color-golden-50)] text-[var(--color-golden-800)] border-golden-200`.
  * New Arrival: `bg-[var(--color-sapphire-50)] text-[var(--color-sapphire-800)]`.

---

## 10. Architecture

* **Layered Separation of Concerns:**
  * `src/components/ui/` - Dumb, reusable primitive UI components.
  * `src/components/layout/` - Shell structures (Navbars, Footers, Drawers).
  * `src/components/views/` - Composed full-page or section views.
  * `src/lib/` - Business logic, API clients, constants, utilities.
  * `src/styles/` - Global design tokens (`variables.css`, `typography.css`, `animations.css`).
* **Icons:** Exclusively use `lucide-react` paired with shared icon wrappers. Do not introduce arbitrary new icon packages.

---

## 11. Language & Accessibility (A11y)

* **Contrast Standard:** Body text and headings must meet **WCAG AAA** (`>= 7:1`) against Diamond (`#FFFFFF`).
* **Focus States:** Never leave outline default blue. Use crisp 2px offset focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-golden-500)]`).
* **Interactive Targets:** Minimum touch target size of `44px x 44px` on mobile viewports.
* **Semantic HTML:** All pages must have exactly one `<h1>`, followed by hierarchical `<h2>` through `<h6>`.

---

# Governance

## 12. Transition Guidance

* **Deprecations:**
  * Raw hex values like `#301045`, `#18181b`, or arbitrary purple/slate tints in components.
  * Bespoke padding utilities (e.g. `py-[73px]`).
  * Dark mode utility hacks (`dark:bg-black`).
* **Replacement Strategy:**
  * Replace ad-hoc colors with CSS variable tokens (`var(--color-sapphire-700)`, `var(--text-primary)`).
  * Standardize section containers to `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

---

## 13. Quick Reference

> The one-table cheat sheet for every pull request.

| FOLLOW | AVOID |
| :--- | :--- |
| `text-[var(--color-primary)]` or `text-[var(--text-primary)]` | Inline `#301045` or new purples |
| `text-[var(--color-black-tie)]` or `text-slate-900` | `text-gray-900`, `text-[#18181b]` |
| `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Ad-hoc container widths |
| `py-16 sm:py-20 lg:py-24` | Bespoke padding stacks |
| `rounded-full / xl / lg / md` | Bare rounded, `2xl`, `3xl` |
| `transition-transform duration-300 ease-out` | `transition-all duration-400` |
| `lucide-react + shared/Icons` | New `react-icons` imports |
