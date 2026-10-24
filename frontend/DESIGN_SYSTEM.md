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
* **Minimum Sizing & Formats:**
  * Desktop header: `24px` height (`text-2xl` tracking-widest).
  * Mobile header: `18px` height (`text-lg` tracking-widest).
  * Monogram / Favicon: `A` in Cinzel with sharp serifs.
  * **Monumental Brand Stage (Footer Colophon):** Responsive full-width spaced glyphs (`A U R E L I A`) in **Cormorant Garamond**, font-weight `350`, `letter-spacing: -0.01em`, `transform: scaleY(1.04)`. Displayed dynamically across the container width (`justify-content: space-between`), sized at `clamp(3.2rem, 15.6vw, 15.8rem)` on desktop and `clamp(2.4rem, 15.2vw, 4.8rem)` on mobile. Serves as the high-fashion editorial punctuation at the base of every page.

---

## 3. Color

The platform uses a strict Six-Color Luxury Palette backed by CSS custom properties in `src/styles/variables.css`:

### 3.1 The Six-Color Luxury Palette
| Token | Hex Value | CSS Variable | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Diamond** | `#FFFFFF` | `var(--color-diamond)` | Primary application canvas, content cards, crisp surfaces, gallery-white editorial footer |
| **Black Tie** | `#141414` | `var(--color-black-tie)` | Primary typography, high-contrast editorial blocks, monumental brand stage glyphs |
| **Sapphire** | `#244B57` | `var(--color-sapphire-700)` | Primary brand color, headings, navigation accents, secondary buttons |
| **Golden** | `#C29B4C` | `var(--color-golden-500)` | Luxury accent, primary Call-To-Action (CTA) background, badges |
| **Icy Lake** | `#CAD4D6` | `var(--color-icy-lake-300)` | Soft muted backgrounds, secondary sections, subtle hover fills |
| **Silver** | `#E0E0E0` | `var(--color-neutral-200)` | Architectural borders, hairline dividers (`#EAEAEA` in footer), disabled states |

> **Note on Footer Canvas:** The storefront footer is strictly Gallery-White (`background-color: #FFFFFF` with a top hairline border `1px solid #EAEAEA`). Inverted dark/black tie footer blocks are deprecated to maintain seamless editorial print lightness.

### 3.2 Semantic Feedback Palette
* **Success:** `#1E6F5C` (`var(--color-success)`) / Background: `#E8F5E9` (Used in newsletter inscription confirmation)
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
| **Display / Editorial** | Cormorant Garamond | `'Cormorant Garamond', Garamond, Didot, serif` | Hero banners, section headers, product titles, footer discovery eyebrow (italic), monumental brand stage (`.type-hero`, `.type-h1`) |
| **Body / UI** | Plus Jakarta Sans | `'Plus Jakarta Sans', system-ui, sans-serif` | Product descriptions, UI buttons, forms, tables, body copy, footer navigation links & addresses |
| **Luxury Accents** | Cinzel | `'Cinzel', 'Trajan Pro', Georgia, serif` | Category eyebrows, pill tags, badges, premium numbers (`.type-eyebrow`) |

### Type Scale Rules
* **Hero Display:** `clamp(2.75rem, 6vw, 5.5rem)`, line-height `1.05`, tracking `-0.02em`
* **H1 / Section Titles:** `clamp(2rem, 4vw, 3.25rem)`, line-height `1.15`, Cormorant Garamond
* **H2 / Subheadings:** `clamp(1.5rem, 2.5vw, 2.25rem)`, line-height `1.25`, Cormorant Garamond
* **Editorial Eyebrow / Italic Accent:** `1.18rem`, font-style `italic`, line-height `1.2`, Cormorant Garamond (e.g. *Discover the Atelier*)
* **Body Regular:** `1rem (16px)`, line-height `1.6`, Plus Jakarta Sans
* **Body Small / Captions:** `0.875rem (14px)`, line-height `1.5`, Plus Jakarta Sans
* **Eyebrow / Badges:** `0.75rem (12px)`, uppercase, tracking `0.18em` to `0.25em`, Cinzel
* **Navigation / Colophon Headings:** `0.8rem` to `0.84rem`, uppercase, tracking `0.08em` to `0.09em`, font-weight `600`, Plus Jakarta Sans
* **Monumental Brand Stage:** `clamp(3.2rem, 15.6vw, 15.8rem)` (Desktop) / `clamp(2.4rem, 15.2vw, 4.8rem)` (Mobile), weight `350`, line-height `0.82` - `0.9`, Cormorant Garamond
* **Colophon Copyright / Hallmark:** `0.65rem` to `0.68rem`, uppercase, tracking `0.08em`, color `#767676`

---

# System

## 5. Layout & Spacing

### 5.1 Container Widths
* **Standard Page Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px clamp)
* **Wide Hero / Editorial Strip:** `max-w-[1440px] mx-auto px-4 sm:px-8`
* **Editorial Footer Container:** `max-w-[1360px] mx-auto` with safe-area padding: `padding-left: max(20px, env(safe-area-inset-left, 0px))`
* **Narrow Checkout / Auth Container:** `max-w-xl mx-auto px-4` (640px clamp) or `max-w-4xl` for account tables

### 5.2 Vertical Section Rhythm
* Standard section padding: `py-16 sm:py-20 lg:py-24`
* Footer section padding: `padding-top: clamp(40px, 6vw, 76px); padding-bottom: clamp(24px, 4vw, 36px);`
* Compact / nested groups: `py-8 sm:py-12`
* Component internal spacing: base-4 scale (`p-4`, `p-6`, `p-8`)

### 5.3 Footer Architectural Layout
* **Desktop (>= 768px):**
  1. *Top Discovery Strip:* Italic serif eyebrow (*Discover the Atelier*) paired with an inline flex sub-navigation row (`Ready-to-Wear`, `Haute Couture Silks`, `Atelier Chronicle`, `New Editions`).
  2. *Editorial 3-Column Asymmetric Grid:* `1.4fr 1fr 1fr` ratio:
     - **Column 1 (`footer-col-newsletter`):** Max width `440px`. Features *The Private Ledger* headline, description, editorial underline subscription input, and the physical Flagship Atelier & Salons address with concierge telephone and email.
     - **Column 2 (`The House`):** Heritage links (House Story, Artisanal Craftsmanship, Material Care, Private Salons, Editorial & Press).
     - **Column 3 (`Customer Care`):** Concierge links (Client Concierge Desk, Help Centre, White-Glove Shipping, Returns, Consignment Tracking, Privacy Policy, Terms).
  3. *Bottom Monumental Brand Stage:* Edge-to-edge spaced letterforms (`A U R E L I A`) in Cormorant Garamond followed by the copyright stamp.
* **Mobile (< 768px):**
  1. *Stacked Newsletter Block:* Private ledger subscription headline and underline input.
  2. *Collapsible Accordions:* Single-axis disclosure accordions for `THE HOUSE & ATELIER` and `CUSTOMER CARE` with 180° rotating chevrons and CSS slide-fade transitions.
  3. *Flagship Address Block:* Formatted address, telephone, and email links with touch targets >= 44px.
  4. *Responsive Brand Stage:* Spaced letterforms scaled responsively via viewport clamps.

---

## 6. Shape & Elevation

### 6.1 Border Radii
* `rounded-full`: Pill buttons, action tags, avatar frames, filter chips
* `rounded-xl` (`16px`): Primary product cards, modal surfaces, floating panels
* `rounded-lg` (`12px`): Dropdown menus, standard boxed input fields, notification toasts
* `rounded-md` (`8px`): Sub-badges, color swatches, inline tooltips
* *Minimalist Editorial Lines:* 0px radius with hairline borders (`1px solid #141414` or `1px solid #EAEAEA`) for editorial underline inputs, accordion items, and the footer container border.

### 6.2 Shadows & Elevation
* **Subtle Elevation (`--shadow-sm`):** `0 2px 8px -2px rgba(20, 20, 20, 0.05)`
* **Card Rest Elevation (`--shadow-md`):** `0 8px 24px -4px rgba(20, 20, 20, 0.08)`
* **Floating / Modal (`--shadow-xl`):** `0 20px 48px -12px rgba(20, 20, 20, 0.16)`
* **Editorial Glass:** `backdrop-blur-md bg-white/80 border border-white/20 shadow-lg`
* **Editorial Print / Zero Elevation:** The footer relies entirely on razor-sharp architectural borders (`1px solid #EAEAEA`) and whitespace with no drop shadow, preserving the high-fashion editorial print feel.

---

## 7. Motion

Micro-interactions must feel deliberate, silky, and editorial rather than bouncy or gamified.

* **Curve:** `--ease-editorial: cubic-bezier(0.16, 1, 0.3, 1)`
* **Durations:**
  * Fast / Micro: `150ms – 200ms` (hover states, link color transitions, arrow nudges)
  * Normal / Transitions: `200ms – 350ms` (accordion collapse/expand, drawer reveals, modals)
  * Slow / Editorial: `600ms – 800ms` (page hero fades, stagger reveals)
* **Functional Transitions:**
  * **Submit Arrow Shift:** `transform: translateX(4px)` with opacity reduction on newsletter submit hover.
  * **Accordion Chevron Rotation:** `transform: rotate(180deg)` over `220ms ease`.
  * **Accordion Content Reveal:** Subtle vertical fade `@keyframes accordionFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`.
  * **Brand Stage Hover:** `opacity: 0.85` over `250ms ease`.

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
│ 10    Footer Container / Badges / FABs       │
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

### 9.1 Buttons (`src/components/ui/Button.tsx`)
* **Primary:** Sapphire background (`#244B57`), white text, hover lift.
* **Luxury Accent:** Golden background (`#C29B4C`), Black Tie text, gleaming subtle scale.
* **Outline:** Silver border (`#E0E0E0`), transparent background, Sapphire text.
* **Ghost / Text:** Underline animated on hover with `--ease-editorial`.
* **Micro Arrow Submit Button (`.footer-submit-arrow-btn`):** Transparent background, borderless, Black Tie stroke, right arrow nudge on hover.

### 9.2 Inputs & Form Controls
* **Standard Boxed Input:** `border-neutral-200 bg-white focus:border-sapphire-700 focus:ring-1 focus:ring-sapphire-700 rounded-lg`.
* **Editorial Underline Input (`.footer-underline-input-wrapper`):**
  * Borderless input with a pure baseline border (`border-bottom: 1px solid #141414`), transparent background, and no border-radius.
  * Active/Focus state expands border weight to `1.5px`.
  * Inline submit action button docked to the right edge.
  * Placeholder typeset in light weight (`#8C8C8C`).

### 9.3 Badges (`src/components/ui/Badge.tsx`)
* **Golden Luxury:** `bg-[var(--color-golden-50)] text-[var(--color-golden-800)] border-golden-200`.
* **New Arrival:** `bg-[var(--color-sapphire-50)] text-[var(--color-sapphire-800)]`.

### 9.4 Navigation Shells (`src/components/navigation/`)
* **Storefront Header (`Navbar.tsx`):** Sticky blur header with category navigation, currency selector, search trigger, and cart badge.
* **Editorial Colophon (`Footer.tsx`):**
  * Gallery-white background `#FFFFFF` with `#EAEAEA` top boundary.
  * Desktop Discovery Strip + 3-column asymmetric layout (`1.4fr 1fr 1fr`).
  * Mobile accordion pattern for progressive disclosure of secondary information.
  * Full-width monumental brand wordmark stage with edge-to-edge glyph distribution.
  * Integrated Private Ledger newsletter subscription with instant feedback.

---

## 10. Architecture

* **Layered Separation of Concerns:**
  * `src/components/ui/` - Dumb, reusable primitive UI components (Buttons, Badges, Drawers, Inputs).
  * `src/components/navigation/` - Global shell navigation (`Navbar.tsx`, `Footer.tsx`).
  * `src/components/views/` - Composed full-page or section views.
  * `src/lib/` - Business logic, API clients, constants, utilities.
  * `src/styles/` - Global design tokens (`variables.css`, `typography.css`, `animations.css`, `globals.css`).
* **Icons:** Exclusively use `lucide-react` paired with shared icon wrappers (`ChevronRight`, `ChevronDown`, `Check`). Do not introduce arbitrary new icon packages.

---

## 11. Language & Accessibility (A11y)

* **Contrast Standard:** Body text and headings must meet **WCAG AAA** (`>= 7:1`) against Diamond (`#FFFFFF`). Muted footer text (`#666666` and `#555555`) meets **WCAG AA** (`>= 4.5:1`) against `#FFFFFF`.
* **Focus States:** Never leave outline default browser blue. Use clean dashed or ring focus treatments (`outline: 1px dashed #141414; outline-offset: 2px;` or `focus-visible:ring-2`).
* **Accordion A11y:** Mobile accordion triggers use native `<button type="button">`, dynamic `aria-expanded={isOpen}`, and reference panel IDs via `aria-controls`.
* **Interactive Targets:** Minimum touch target size of `44px x 44px` on mobile viewports for accordion triggers, contact telephone/email links, and submit arrows.
* **Semantic HTML:** All pages must have exactly one `<h1>`, followed by hierarchical `<h2>` through `<h6>`. The footer uses semantic `<footer role="contentinfo">`.

---

# Governance

## 12. Transition Guidance

* **Deprecations:**
  * Inverted heavy dark/black footer blocks (e.g. `bg-[#141414]` or `bg-slate-900` for footer background).
  * Raw hex values like `#301045`, `#18181b`, or arbitrary purple/slate tints in components.
  * Heavy boxed email inputs inside the luxury footer.
  * Bespoke padding utilities (e.g. `py-[73px]`).
  * Dark mode utility hacks (`dark:bg-black`).
* **Replacement Strategy:**
  * Replace heavy dark footer styles with the unified Gallery-White Editorial Footer (`.almada-editorial-footer`).
  * Use the Editorial Underline Input pattern for minimalist subscription and bespoke intake forms.
  * Standardize section containers to `max-w-7xl` or `max-w-[1360px]` for editorial spreads.

---

## 13. Quick Reference

> The one-table cheat sheet for every pull request.

| FOLLOW | AVOID |
| :--- | :--- |
| `text-[var(--color-primary)]` or `text-[var(--text-primary)]` | Inline `#301045` or new purples |
| `text-[var(--color-black-tie)]` or `text-slate-900` | `text-gray-900`, `text-[#18181b]` |
| `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Ad-hoc container widths |
| `max-w-[1360px]` with safe-area padding for footers | Fixed px width footers |
| Gallery-white editorial footer (`#FFFFFF` + `#EAEAEA` border) | Heavy black tie / dark inverted footer blocks |
| Editorial Underline Input (`border-b-1`, transparent) | Bulky pill/box inputs in editorial sections |
| Monumental Brand Stage (`A U R E L I A` spaced glyphs) | Generic small footer logo text |
| Mobile Accordion disclosure (`aria-expanded`) | Endless uncollapsed mobile footer link lists |
| `py-16 sm:py-20 lg:py-24` | Bespoke padding stacks |
| `rounded-full / xl / lg / md` | Bare rounded, `2xl`, `3xl` |
| `transition-transform duration-300 ease-out` | `transition-all duration-400` |
| `lucide-react + shared/Icons` | New `react-icons` imports |
