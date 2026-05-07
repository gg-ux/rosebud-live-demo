# Mobile App Design System — Figma Audit (WIP)

Track the audit of `src/pages/DesignSystem.jsx` against the Mobile App page in
the Rosebud Figma file.

- **Figma file:** https://www.figma.com/design/DybhAvDdUTWFHOEoSdmAFH/Rosebud-Design-System?node-id=4202-752
- **Live page:** http://localhost:5173/design-system (or rosebud-live-demo.vercel.app/design-system)
- **Source split:** visual look from Figma; component implementation from `Rising-Tide-Org/rosebud-react/apps/native/src/components/<Name>.tsx` (via `gh api ... -H "Accept: application/vnd.github.raw"`).
- **Note:** parts of the Figma file are outdated. Where Figma contradicts a category that doesn't exist in Figma (e.g. "Primary Color Variants"), keep the page as is.

## Status

| Area | Status |
|---|---|
| Button (5 modes + states) | DONE |
| TextInput | DONE (already mirrored FormTextInput) |
| Searchbar | DONE |
| Switch | DONE (custom Pressable, see gotcha #2) |
| Checkbox | DONE (custom Pressable + lucide, see gotcha #1) |
| RadioButton | DONE |
| Chip / Pill | DONE |
| Avatar | DONE (default Paper Avatar.Text kept) |
| ActivityIndicator | DONE |
| ProgressBar | DONE |
| Form Fields — Textarea | DONE |
| Form Fields — Dropdown | TODO (optional) |
| Bottom Sheet | DONE |
| Bottom Navigation | DONE (matches Figma Main Nav Bar 5600:6198) |
| Date Picker | DONE (Figma Calendar 4477:6778) |
| Time Picker | DONE (iOS wheel mock — TimePicker.tsx native) |
| Weekday Picker | DONE (Figma Week Days 5599:27211 + WeekDayPicker.tsx native) |
| Cards — Locked / Upgrade | DONE |
| Cards — Reflection / Insight / Haiku (sage → surface bg + label color fix) | DONE |
| Cards — StreakCard (🔥 emoji → minimal stroke + checkmark per Figma 19996) | DONE |
| Cards — QuoteCard (italic → not italic, label UPPERCASE, author 16/30 not tiny — per Figma style_GX7L14 + style_B7BLO7) | DONE |
| Cards — GoalsCard (rounded-square checkbox → 22×22 stroke circle, items with separator lines, label-left/status-right per Figma layout_TUH1PW) | DONE |
| Cards — JournalEntry (body 16/22 → Body Large 17/23, gap 12 → 14, emotions in secondaryTextOnSurface) | DONE |
| Cards — KeyThemeCard (title shrunk to 16/22, added Display Medium subtitle slot, tags swapped sage rounded-full → backgroundOnSurface 6px per Figma layout_KQEYN9) | DONE |
| Cards — AskRosebudCard (added date+time on header right, "Ask" label in secondaryTextOnSurface, body Body Large 17/23 per Figma 5752:8364) | DONE |
| Cards — EntryDraftCard ("Draft" 14/20 → 11/16 UPPERCASE per Figma style_E09EK9, body 15/20 → 16/22 Body Medium W06 in onSurface, radius 10 → 12) | DONE |
| Cards — GratitudeChallengeCard (subtitle color secondaryText → secondaryTextOnSurface per Figma fill_US1HIN, CTA full-width 12px radius matching Locked/Upgrade) | DONE |
| Cards — ValueCard, DailyPromptCard, PersonaCard, FeedbackPromptCard, LoadingCard | DONE (visual review — already matched Figma well; no fixes needed) |
| Cards — EmotionalLandscapeCard | SKIP (Figma uses tag chips concept, current is bar chart — different presentation, not a fix) |
| Bottom Sheet — sticker variant + 2-button variant | DONE (Rosebud SVG logo for Bloom, Fingerprint for Biometric, green chat-bubble sticker for Ask Rosebud Choice variant with Later/Try out buttons) |
| Demo fonts — Checkbox, Radio, TextInput label/desc, Textarea counter | DONE (RNText → PaperText so all pick up Circular Std font stack consistently) |

## Components added from Figma sweep

| Component | Figma node | Status |
|---|---|---|
| Snackbar (4 types: info/success/warning/error) | 4366:321 | DONE — bg primary, 12px radius, padding 12, lucide icons, drop shadow |
| Toast | 4479:2193 | DONE — text-only dark surface variant |
| Tag (compact label chip) | 4343:1262 | DONE — 22h, 6px radius, backgroundOnSurface bg, Body XSmall |
| Segmented Control (3 segments) | 5597:6870 | DONE — selected: surface bg, others: background bg, 10px outer corners |
| Grouped List (settings rows) | 5599:6404 / 5599:6269 | DONE — 56h rows, accessories: chevron / label+chevron / switch, 1px backgroundOnSurface separators |
| Dialog (modal alert) | 6338:5641 | DONE — 393w, 10px radius, bell icon + title + close X header, 1px outlineLight separator, body, 2-button footer (Go Back outlined / I Understand contained) |
| Infobar (4 types) | 5600:5934 | DONE — light variant of Snackbar: surface bg + onSurface text + colored type icons (blue/green/orange/red) |
| Tooltip (Coachmark) | 4606:3925 | DONE — surface card with title + step counter + body + Next button, 4px/24% drop shadow |
| Choice Tile (Checkbox Card) | 5514:3492 | DONE — 56h row with label + 24×24 checkbox right, default = transparent border, selected = 1px primary border |

## All Figma sweep components complete ✓

## Plan to resume

### 1. Form Fields — Dropdown (optional, ~10 min)
- Figma: `Dropdown` (4360:1607) and `Dropdown Field` (4381:693).
- Naked variant has no fill, just text + chevron-down (`fill_HH5RBY` = transparent), 12px radius. Selected text in primary color, otherwise secondaryText.
- Add a Dropdown row to the Textarea section if needed.

### 2. Cards polish — remaining (~30-45 min)
- Cards Figma frame: `5599:10053`. Many child components.
- Already done: WeeklyReportLocked, UpgradeCard, LockedFeatureCard (with progress mode), ReflectionCard, InsightCard, HaikuCard.
- **Approach for each remaining card**: open the page, take a screenshot of just that section, compare to Figma frame for that card, fix radius / padding / typography / colors / token usage in `src/components/cards/<Name>.jsx`, then update call-site props in `DesignSystem.jsx` if needed.
- Cards likely needing attention (eyeball-call them as we go):
  - **JournalEntry** — Figma uses Title Large (17/23) for title with emoji, Body Large for body, "share-fill" icon corner. Current emoji is 22px which may be too big.
  - **StreakCard** — Figma has 7-day row with stroke 999px circles for empty days and `checkmark-circle` icons for completed. Current uses 🔥 emoji which is informal vs the Figma minimalism.
  - **ValueCard** — Figma 21282 / 21881 — number is Display Large, label Label Large in secondaryText. Current may be good already.
  - **DailyPromptCard** — Figma Daily Prompt 23362: just title (Title Large, centered) + an svg "Frame 16" decoration, no body text. Current has both title and body.
  - **QuoteCard** — Figma 22868: "Quote" label + italic quote + "— Author". Current looks similar; verify proportions (currently aspect-square may be too big).
  - **AskRosebudCard** — Figma 23983.
  - **EmotionalLandscapeCard / KeyThemeCard / GoalsCard / PersonaCard / FeedbackPromptCard** — verify each.

## Token mapping principles (do not invent colors)

- Solid surfaces (buttons, switch tracks): `primary` / `onPrimary` (flips cleanly across light/dark)
- Card / input backgrounds: `surface` (white in light, dark in dark — NOT `surfaceVariant` which is sage)
- Subtle highlights, hover, dividers: `surface-variant`
- Borders: `outline` (medium gray) or `outline-light` (subtle)
- Text: `onSurface` / `onBackground` / `secondary-text` / `secondary-text-on-surface`
- Status (error red, success green): explicit `error`/`green` tokens
- Brand pink `#E31665`: only for the rose primary variant, NOT default
- Default primary variant is BLACK (apps/native default), not rose

## Figma fill ↔ token cheatsheet

| Figma fill | Hex | Token |
|---|---|---|
| `fill_5OAD2N` | `#FFFFFF` | `surface` |
| `fill_4ZCFGJ` | `#DEDEDE` | `outlineLight` |
| `fill_8YGL99` | `#000000` | `primary` (light) |
| `fill_9GAXAI` | `#191C1A` | `onBackground` (light) |
| `fill_26VMH1` | `#FAFAFA` | `onPrimary` (light) |
| `fill_SE8WEQ` | `#6D6C6A` | `secondaryText` |
| `fill_US1HIN` | `#8B828B` | `secondaryTextOnSurface` |
| `fill_X68BJ2` | `#F8F8F8` | `backgroundOnSurface` |
| `fill_JQI4UC` | `#C9CAC9` | `outlineVariant` |
| `fill_34CTJ0` | `#C0C0BF` | `outline` |
| `fill_HH5RBY` | (empty) | transparent |

## Gotchas (saved to user memory too)

1. **Paper `<Checkbox>` renders nothing** — its box is drawn via `react-native-vector-icons`, which is stubbed in this repo (Rolldown can't parse its JSX). Build a custom one with `Pressable` + `View` + lucide `Check`. Figma 24×24, 6px radius, 1px stroke `secondaryTextOnSurface` unchecked, `primary` bg + white check checked.
2. **Paper `<Switch>` ignores `thumbColor` in MD3 mode** — derives the thumb from the `color` prop, painting it the same as the track when on (invisible black-on-black). Build a custom toggle with `Pressable` + `View` matching Figma 5597:6993: 51×30 track, 26×26 thumb, surface (white) thumb in both states.
3. **Paper Searchbar / icons:** `react-native-vector-icons` is stubbed, so any Paper icon prop needs an explicit lucide icon render function.
4. **Paper Button `mode="elevated"`:** needs `buttonColor={t.colors.surface}` to avoid sage tint.
5. **Native theme `surfaceVariant` is sage** (`#DCE5DB` light / `#414942` dark). Figma shows neutral inputs/searchbars — override with `surface`, not `surfaceVariant`.

## How to resume

1. Open the live page: `npm run dev` then visit `/design-system` on the Mobile App switcher.
2. Read this file for current status and next tasks.
3. Pick a TODO row and dig in. Use this prompt template:

```
Continue the Mobile App Design System Figma audit (see MOBILE-DS-AUDIT.md).
Pick up at: <TASK>.
Source-of-truth split + token mapping principles + recent learnings: in that doc.
For component implementations, read source via:
gh api repos/Rising-Tide-Org/rosebud-react/contents/apps/native/src/components/<Name>.tsx -H "Accept: application/vnd.github.raw"
Don't push to prod until I've reviewed.
```
