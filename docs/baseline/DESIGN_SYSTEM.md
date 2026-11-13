# Amber Hunter — Design System / Baltic Explorer

**Version:** Visual baseline 1.0  
**Status:** Approved direction and reference screens; exact tokens provisional until accessible implementation review.

## Brand character
Quiet, exploratory and practical. Scandinavian minimalism inspired by the clarity and restraint of ChatGPT, without copying its exact branding. The Baltic coast is felt through neutral sand, fog, muted blue water and subtle warm amber. Not cartoonish, neon, overly decorative or corporate dashboard-heavy.

## Approved reference images
- `design/references/home-light.png`: primary light desktop homepage.
- `design/references/home-evening.png`: atmospheric evening alternative; **not** a commitment to ship full dark mode in MVP.
- `design/references/map-light.png`: light desktop map with left beach list, colored coastline segments and selected beach panel.

Generated images are **concept references**. They include illustrative weather numbers, indices, route conditions and potential map inaccuracies. Never use displayed numeric values as real data. Do not require pixel-perfect reproduction; evaluate hierarchy, layout, density, typography and visual character.

## Light-theme tokens

Define semantic tokens in [tokens.css](../../apps/web/src/styles/tokens.css) with Tailwind v4 `@theme`. Use semantic utilities such as `bg-surface`, `text-muted` and `rounded-card` in templates. The Angular app loads Tailwind through its project-local PostCSS configuration and uses Preflight and the standard Tailwind spacing scale.

| Token suffix | Value | Role |
|---|---|---|
| `canvas` | `#FAFAF8` | Main background |
| `surface` | `#FFFFFF` | Cards and panels |
| `surface-cool` | `#E6EEF0` | Cool secondary surface |
| `surface-warm` | `#F0E9DD` | Warm secondary surface |
| `ink` | `#29383E` | Primary text |
| `muted` | `#52656D` | Secondary text |
| `action` | `#486F7B` | Marine action text |
| `action-strong` | `#223E49` | Emphasized marine action text |
| `amber-accent` | `#C48A36` | Decorative highlights |
| `divider` | `#E6EEF0` | Decorative boundaries |
| `focus` | `#223E49` | Keyboard focus outline |

The placeholder uses ink, muted, action and strong action on white at 12.14:1, 6.10:1, 5.48:1 and 11.33:1, respectively. Default ink on canvas is 11.62:1. The 2px focus outline has 11.33:1 contrast against white and 10.84:1 against canvas. The link is underlined and has a 44px minimum height. The divider is decorative. Reserve a separate semantic system for safety states and pair future safety colors with other cues.

## Typography
- `--font-sans` uses locally hosted [Inter Variable v4.1](https://github.com/rsms/inter/releases/tag/v4.1) with system sans-serif fallbacks. The upright WOFF2 covers weights 100–900. Keep the [SIL Open Font License 1.1](../../apps/web/public/licenses/Inter-OFL.txt) with the distributed font. Chrome verified the English and Russian alphabets and Polish diacritics without fallback.
- Sans-serif with expressive medium/semibold headings; clear UI hierarchy.
- Body baseline approximately 16px / 1.5 line height; small captions 12–14px only when accessible.
- Indicative large heading: 30–36px mobile, 40–48px desktop.
- Use tabular numerals for forecast metrics.

## Layout tokens
- 4px-based spacing: 4, 8, 12, 16, 24, 32, 48px.
- Use `rounded-card` (1rem) and `rounded-control` (0.75rem) for the baseline radii.
- Standard card padding 16–24px; content maximum around 1200px, subject to screen needs.
- Interactive touch targets at least 44×44px.
- Thin borders, almost no drop shadows, moderate density, minimal animation and reduced-motion support.

## MVP screen inventory
1. Home / Forecast: strong daily hero, score, explanations, confidence and safety, recommended beaches, 7-day overview, CTA to map and Academy.
2. Explore Map: MapLibre canvas; coastline colors; beach sidebar; time selector; legend; selected segment/beach detail sheet; safety indicators.
3. Beach Details: optional real photo, wave/wind conditions, hourly intervals, 7-day forecast, confidence, restrictions, directions.
4. Amber Academy: list of practical illustrated guides and articles.
5. Article Reader: legible typographic layout, navigation/related content.
6. Preferences: language PL/EN/RU, region selection and data/source information; notifications later.

## Product-specific components
- Button, Card, Badge, Skeleton, EmptyState.
- ForecastMeter, ConfidenceIndicator, SafetyBanner.
- BeachCard, WeatherMetric, TimeWindow.
- Map overlay / selected-coast BottomSheet.

Use Angular CDK for behavior where relevant, Tailwind for styling and Lucide for thin geometric icons. Avoid installing multiple full UI kits.

## Content and interaction guidelines
- Human-readable: 'Conditions are favorable', not unqualified claims of guaranteed success.
- Show why the index changes and when it was computed.
- If safety status is unsafe/restricted/unknown, avoid an active 'go now' CTA.
- Use photographs primarily on beach detail and Academy article pages.
- Mobile: one-hand access, bottom navigation for Overview / Map / Academy, readable outdoors.
- Desktop: restrained header, balanced panels, map as a central exploration surface.
- States: loading, empty, stale, error, offline, restricted, unsafe, missing geolocation permission.
- Accessibility: keyboard focus, reduced motion, sufficient contrast, labels not color-only, screen-reader context for index and weather values.

## Visual acceptance process
Compare UI PR screenshots against Home Light and Map Light at representative phone, tablet and desktop widths. Review hierarchy and component consistency, not literal AI-generated labels or numeric values. Require Playwright screenshots and accessible smoke tests as soon as the relevant screens exist.
