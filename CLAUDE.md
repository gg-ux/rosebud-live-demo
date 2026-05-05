# Live Demo

React + Vite + Tailwind app for live collaboration. Also serves as a **Chakra UI prototyping environment** for Rosebud's web design system.

## Stack
- React 19 + Vite
- Tailwind CSS v4 (older pages)
- Chakra UI v2.5.5 + Emotion (newer Chakra prototype pages)
- No backend yet — add as needed

## Commands
- `npm run dev` — start dev server (localhost:5173)
- `npm run build` — production build

## Two styling worlds in this repo

**Don't mix them on the same page.** Each page is either Tailwind or Chakra, not both.

### Tailwind pages (older)
- `src/pages/DesignSystem.jsx`, `Dashboard.jsx`, `LivingDesignSystem.jsx`, etc.
- Use `className="..."` for everything.
- Theme tokens via CSS variables in `src/tokens.css` (`var(--color-primary)`, etc.).

### Chakra pages (newer — for rosebud-react/apps/web prototypes)
- `src/pages/DesignSystemWeb.jsx` is the live reference.
- Theme is ported from `Rising-Tide-Org/rosebud-react/apps/web/src/styles/theme/` into `src/theme/` (colors, semantic tokens, all 13 component overrides).
- `<ChakraProvider>` is mounted in `src/main.jsx` with `resetCSS={false}` and `disableGlobalStyle={true}` so it does NOT bleed into Tailwind pages.
- Style with Chakra props (`bg`, `color`, `p`, `mt`, `fontSize`) and theme tokens (`bg`, `text`, `brand.500`, `bgSecondary`, `border`, etc.) — not Tailwind classes.

## Creating a new Chakra prototype page

1. Create `src/pages/MyPage.jsx`. Import from `@chakra-ui/react`.
2. Wrap the page body in `<Box bg="bg" color="text" minH="100vh" fontFamily="body">` so theme tokens apply (we don't use the global body styles).
3. Use `brand.500` (#E31665) for primary actions, `bloom.500` for premium UI, semantic tokens (`bg`, `bgSecondary`, `border`) for surfaces, the `SmallCaps` pattern for section labels.
4. Add a route in `src/main.jsx` and (optionally) a sidebar entry in `src/components/Sidebar.jsx`.
5. Reference `/design-system-web` (live in dev) for component examples and exact prop signatures.

For component implementations not yet documented, read source from `Rising-Tide-Org/rosebud-react` directly:
```
gh api repos/Rising-Tide-Org/rosebud-react/contents/apps/web/src/ui/<path>/<Component>/index.tsx -H "Accept: application/vnd.github.raw"
```

## Conventions
- Functional components, hooks only
- One styling system per page (Tailwind OR Chakra)
- Keep it simple — this is a live coding/prototyping environment
