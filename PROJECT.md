# Rosebud Design System — Project Workflow

## Overview

Built a complete, production-quality design system from a Figma file using **Claude Code** and **React**. The goal: demonstrate how AI-assisted tooling can extract, tokenize, and componentize an entire design system in a single session — from Figma source of truth to a live, browsable component library.

**Stack:** React 19 + Vite + Tailwind CSS v4  
**Live URL:** `site.com/design-system`  
**Source Figma:** [Rosebud Design System](https://www.figma.com/design/93EWrOSd9mjVsTyEbsPeJB/Rosebud-Design-System--Copy-)

---

## Workflow Timeline

### Phase 1: Figma Data Extraction
- Connected to the **Figma REST API** using a personal access token (stored securely in `~/.figma_token`)
- Downloaded the full 37MB Figma file JSON via `GET /v1/files/{id}`
- Parsed every page programmatically with Python:
  - **Color Palette** — extracted 45+ semantic token pairs (light/dark), 4 brand scales (10 shades each), accent colors
  - **Text Styles** — 15 primary type styles with exact font, size, weight, line-height, letter-spacing
  - **Grids & Layouts** — full 4px modular spacing scale (25 tokens), 10-step radius scale, 5-step border widths, mobile + desktop grid specs
  - **Components** — 35+ component sets with all variant properties, per-state colors, padding, radius, height

### Phase 2: Design Token Creation
- Created `src/tokens.css` with all tokens as CSS custom properties inside Tailwind v4's `@theme` block
- **Theme-aware architecture:** static brand tokens in `@theme`, semantic tokens via `:root` / `[data-theme="light"]` / `[data-theme="dark"]` CSS custom properties
- Tokens map 1:1 to the Figma spec — spacing uses the same numeric naming (1 = 4px, 2 = 8px, etc.)

### Phase 3: Font Setup
- Identified **Circular Std** as the primary typeface from Figma metadata (weights: 450 Book, 500 Medium, 700 Bold)
- Copied local font files (`.ttf`) into `src/fonts/`
- Set up `@font-face` declarations for each weight with proper `font-display: swap`

### Phase 4: Component Build
- Built **15 base UI components**, each matching exact Figma specs:
  - **Button** — 5 types × 3 sizes × 3 states × 3 icon modes (117 variants), with hardcoded per-state colors from Figma
  - **Input** — 56px height, 12px radius, 6 states (Default, Active, Filled, Active Filled, Disabled, Disabled Filled)
  - **Textarea** — 120px min-height, asymmetric padding (16/16/6/16)
  - **Searchbar** — with integrated search icon
  - **Switch** — 51×30px, 12px radius, 24px thumb
  - **Checkbox** — 24×24px with label
  - **RadioButton** — 24×24px with label
  - **SegmentedControl** — 40px height, selected/unselected states
  - **CheckboxCard** — 56px, selected border ring
  - **Snackbar** — black bg (#000), white text, drop shadow, 4 icon types
  - **Infobar** — white bg (#FFF), dark text, colored status icons
  - **Pill** — full radius, #F8F8F8, 13px/450
  - **Tag** — rounded, surface-variant bg
  - **Avatar** — 3 sizes, initials fallback
  - **Card** — 12px radius, surface bg, outline border

- Built **20 card-type components** from detailed Figma component specs:
  - JournalEntry, EntryDraft, ValueCard (S/M), StreakCard, DailyPromptCard, EmotionalLandscapeCard, KeyThemeCard, ReflectionCard, InsightCard, HaikuCard, QuoteCard, AskRosebudCard, GoalsCard, PersonaCard, FeedbackPromptCard, WeeklyReportLocked, LockedFeatureCard, UpgradeCard, GratitudeChallengeCard, LoadingCard

### Phase 5: Asset Extraction
- Launched **3 parallel agents** to export SVGs via the Figma image export API:
  - **Icons:** 144 SVGs → `src/icons/` + React component index
  - **Symbols:** 268 SVGs across 14 categories → `src/symbols/`
  - **Illustrations:** 100 SVGs (journals, custom icons, moods, badges) → `src/illustrations/`
  - **Branding:** 5 logo variants → `src/branding/`
- **Total: 517 SVG assets** extracted and organized

### Phase 6: Design System Page
- Installed **React Router** for `/design-system` route
- Built a full component library page with:
  - **Sticky sidebar navigation** organized by Material Design 3 / Shopify Polaris hybrid structure:
    - Foundations: Colors, Typography, Spacing, Radius, Borders, Shadows, Layout Grid
    - Actions: Button, Button/Pill
    - Input & Selection: Input, Textarea, Searchbar, Checkbox, CheckboxCard, Radio, Switch, Segmented
    - Feedback: Snackbar, Infobar
    - Display: Card (20 sub-types), Pill, Tag, Avatar
    - Assets: Icons, Symbols, Illustrations, Branding
  - **Collapsible accordion groups** with active section indicator
  - **Dark/Light theme toggle** with Lucide Sun/Moon icons
  - **IntersectionObserver** for scroll-tracking active section
  - **Token spec tables** alongside visual previews
  - **Interactive component demos** (switches, checkboxes, radios, segmented controls)
  - **Complete asset gallery** with all 517 SVGs browsable

### Phase 7: Quality Audit
- Ran a comprehensive **Figma design system audit** agent that parsed every page
- Cross-referenced extracted values against the Color Palette Audit v1.2 page for updated specs
- Fixed broken components (Card, Tag, Avatar were using non-resolving Tailwind utilities)
- Updated light theme color values to match audit corrections

---

## Key Techniques Demonstrated

### AI-Powered Extraction
- Used Claude Code to **programmatically parse a 37MB Figma JSON file** — no manual inspection
- Extracted design tokens, component specs, and asset metadata automatically
- Launched parallel agents for concurrent SVG export (icons, symbols, illustrations, branding)

### Figma API Integration
- Authenticated via personal access token (stored securely, never exposed in conversation)
- Used `GET /v1/files/{id}` for full file data
- Used `GET /v1/images/{id}?ids=...&format=svg` for SVG export with batched node IDs
- Parsed variant properties from COMPONENT_SET nodes to understand all states

### Design System Architecture
- **Token-first approach** — all values flow from CSS custom properties, not hardcoded
- **Theme-aware** — semantic tokens swap via `data-theme` attribute, brand colors are invariant
- **Figma-accurate** — component specs match exact pixel values from Figma (heights, padding, radius, colors per state)
- **Organized by function** — sidebar follows industry best practice (Material + Polaris hybrid)

### Tools Used
- **Claude Code** — orchestration, code generation, Figma API integration, parallel agent dispatch
- **Figma REST API** — data extraction and SVG export
- **React 19 + Vite** — component framework
- **Tailwind CSS v4** — utility styling with `@theme` token integration
- **Lucide React** — icon library for UI chrome
- **React Router** — client-side routing

---

## File Structure

```
src/
├── tokens.css                    # All design tokens (theme-aware)
├── index.css                     # Global styles + font-face
├── fonts/                        # Circular Std (Medium, Bold, Italic)
├── components/
│   ├── index.js                  # Barrel export for base components
│   ├── Button.jsx                # 117-variant button
│   ├── Input.jsx                 # 6-state input field
│   ├── Textarea.jsx              # 5-state textarea
│   ├── Searchbar.jsx             # Search input with icon
│   ├── Switch.jsx                # Toggle switch
│   ├── Checkbox.jsx              # Checkbox with label
│   ├── RadioButton.jsx           # Radio with label
│   ├── SegmentedControl.jsx      # Tab-like segmented selector
│   ├── CheckboxCard.jsx          # Selectable card
│   ├── Snackbar.jsx              # Toast notification (4 types)
│   ├── Infobar.jsx               # Inline banner (4 types)
│   ├── Pill.jsx                  # Rounded tag with icon
│   ├── Tag.jsx                   # Label tag
│   ├── Avatar.jsx                # User avatar (3 sizes)
│   ├── Card.jsx                  # Base card container
│   └── cards/
│       ├── index.js              # Barrel export for card components
│       ├── JournalEntry.jsx      # Journal entry card
│       ├── EntryDraftCard.jsx    # Draft entry
│       ├── ValueCard.jsx         # Stat display (S/M)
│       ├── StreakCard.jsx        # Streak tracker
│       ├── DailyPromptCard.jsx   # Prompt with bookmark
│       ├── EmotionalLandscapeCard.jsx  # Bar chart
│       ├── KeyThemeCard.jsx      # Theme tags
│       ├── ReflectionCard.jsx    # AI reflection
│       ├── InsightCard.jsx       # AI insight
│       ├── HaikuCard.jsx         # AI haiku
│       ├── QuoteCard.jsx         # Inspirational quote
│       ├── AskRosebudCard.jsx    # Q&A card
│       ├── GoalsCard.jsx         # Todo/goals list
│       ├── PersonaCard.jsx       # AI persona (6 types)
│       ├── FeedbackPromptCard.jsx # Discovery questions
│       ├── WeeklyReportLocked.jsx # Locked report
│       ├── LockedFeatureCard.jsx  # Upsell
│       ├── UpgradeCard.jsx       # Upgrade CTA
│       ├── GratitudeChallengeCard.jsx # Challenge progress
│       └── LoadingCard.jsx       # Loading state
├── icons/                        # 144 UI icon SVGs + React index
├── symbols/                      # 268 illustrated symbols (14 categories)
├── illustrations/                # 100 illustration SVGs
├── branding/                     # 5 logo variants
└── pages/
    └── DesignSystem.jsx          # Full design system showcase page
```

---

## Stats

| Metric | Count |
|--------|-------|
| Design tokens | 150+ (spacing, radius, border, color, typography) |
| Theme color pairs | 45+ (light/dark) |
| Brand color shades | 40 (4 scales × 10) |
| Base components | 15 |
| Card components | 20 |
| SVG assets | 517 (icons + symbols + illustrations + branding) |
| Typography styles | 15 primary + 12 additional |
| Figma pages parsed | 17 |
