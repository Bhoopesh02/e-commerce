# AURELIA Color System Audit

This document is a comprehensive audit of the color system used in the AURELIA Next.js frontend, updated for the new six-color luxury palette.

## 1. Design Tokens

Defined centrally in `src/styles/variables.css`, these tokens form the foundation of the brand's aesthetic.

| Token | Hex/Value | Location | Role |
| :--- | :--- | :--- | :--- |
| `--color-diamond` | `#FFFFFF` | `variables.css` | Brand Primary Background |
| `--color-silver` | `#E0E0E0` | `variables.css` | Borders, Dividers |
| `--color-icy-lake` | `#CAD4D6` | `variables.css` | Soft Backgrounds, Hover States |
| `--color-golden` | `#C29B4C` | `variables.css` | Luxury Accent, Primary CTA |
| `--color-sapphire` | `#244B57` | `variables.css` | Primary Brand Color (Secondary buttons, headings) |
| `--color-black-tie`| `#141414` | `variables.css` | Primary Text, High-contrast Panels |
| `--color-white` | `#FFFFFF` | `variables.css` | Core Neutral |
| `--color-success` | `#1E6F5C` | `variables.css` | Semantic Success |
| `--color-success-bg` | `#E8F5E9` | `variables.css` | Semantic Success Background |
| `--color-error` | `#B00020` | `variables.css` | Semantic Error |
| `--color-error-bg` | `#FFEBEE` | `variables.css` | Semantic Error Background |
| `--color-warning` | `#8A641F` | `variables.css` | Semantic Warning |
| `--color-warning-bg` | `#F6EEDB` | `variables.css` | Semantic Warning Background |
| `--color-info` | `#315F70` | `variables.css` | Semantic Info |
| `--color-info-bg` | `#E7EFF1` | `variables.css` | Semantic Info Background |
| `--bg-primary` | `var(--color-diamond)` | `variables.css` | Main App Background |
| `--bg-surface` | `var(--color-diamond)` | `variables.css` | Surface / Card Background |
| `--text-primary` | `var(--color-black-tie)` | `variables.css` | Main Body / Heading Text |
| `--text-secondary` | `var(--color-sapphire)` | `variables.css` | Secondary Text |
| `--text-muted` | `#667276` | `variables.css` | Muted Text |
| `--border-color` | `var(--color-silver)` | `variables.css` | Standard Borders |
| `--cta-primary` | `var(--color-sapphire-700)` | `variables.css` | Call to Action Background |
| `--cta-text` | `var(--text-inverse)` | `variables.css` | Call to Action Text |

## 2. Final Palette (Observed across all code)

### Brand / Primary
- **Diamond (`#FFFFFF`)**: Primary background, cards, content surfaces.
- **Silver (`#E0E0E0`)**: Borders, input borders, disabled controls.
- **Icy Lake (`#CAD4D6`)**: Secondary sections, soft backgrounds, hover areas.
- **Golden (`#C29B4C`)**: Luxury accent, primary CTA, active nav indicators.
- **Sapphire (`#244B57`)**: Major headings, nav accents, secondary buttons, links.
- **Black Tie (`#141414`)**: Primary text, icons, footer.

### Overlays
- **Dark Overlay**: `rgba(20, 20, 20, 0.82)` to `0.86` (Black Tie base, used in `SearchOverlay.tsx` and quick-add buttons).
- **Light Overlay**: `rgba(255, 255, 255, 0.85)`
- **Golden Subtle Overlay**: `rgba(194, 155, 76, 0.12)` (Used for active states).
- **Icy Lake Subtle Overlay**: `rgba(202, 212, 214, 0.20)` (Used for borders/soft backgrounds).

## 3. Usage Map

- **`.css` files**: Consistent use of CSS variables for theming and animations.
- **Admin Pages / Tracking Test**: Heavy reliance on CSS variable-backed Tailwind utility classes (`bg-[var(--bg-primary)]`, `text-[var(--text-primary)]`).
- **Storefront Components**: Use inline style values updated to the new token standards.

## 4. Typography Colors

- **Headings**: `--text-primary` (Black Tie) on `--bg-primary` (Diamond).
- **Secondary Text**: `--text-secondary` (Sapphire) on Diamond.
- **Muted Text**: `--text-muted` (`#667276`) on Diamond.
- **Inverse Text (Panels)**: Diamond on Black Tie or Sapphire.

## 5. Dark Mode

**No, dark mode is entirely removed.** AURELIA is a light-only luxury fashion website.

## 6. Accessibility Check (WCAG)

*Contrast ratios evaluated against Diamond (White):*

- **Primary Text (Black Tie) on Diamond**: Passes WCAG AAA
- **Secondary Text (Sapphire) on Diamond**: Passes WCAG AAA
- **Muted Text (`#667276`) on Diamond**: ~5:1 (Pass ✅)
- **CTA Text (Black Tie) on CTA BG (Golden)**: Passes
- **Warning Text (`#8A641F`) on Warning BG (`#F6EEDB`)**: Passes

## 7. Tailwind Config Object (Tailwind v4 @theme)

```css
@theme {
  --color-aurelia-diamond: #FFFFFF;
  --color-aurelia-silver: #E0E0E0;
  --color-aurelia-icy-lake: #CAD4D6;
  --color-aurelia-golden: #C29B4C;
  --color-aurelia-sapphire: #244B57;
  --color-aurelia-black-tie: #141414;
  --color-brand-primary: #244B57;
  --color-brand-accent: #C29B4C;
}
```
