# Live Demo

React + Vite app. Serves as a prototyping environment for all three Rosebud surfaces — mobile app (React Native via RNW), web app (Chakra), and marketing website (Tailwind).

## Stack
- React 19 + Vite
- Tailwind CSS v4 (marketing/website pages)
- Chakra UI v2.5.5 + Emotion (web app prototype pages)
- react-native-web 0.21 + react-native-paper 5.12 (mobile app prototype pages)
- No backend yet — add as needed

## Commands
- `npm run dev` — start dev server (localhost:5173)
- `npm run build` — production build

## Three styling worlds in this repo

**Don't mix stacks on the same page.** Pick one per prototype.

### Tailwind pages
- `src/pages/Dashboard.jsx`, `DesignSystemWebsite.jsx`, etc.
- Use `className="..."` for everything.
- Theme tokens via CSS variables in `src/tokens.css` (`var(--color-primary)`, etc.).

### Chakra pages (rosebud-react/apps/web prototypes)
- `src/pages/DesignSystemWeb.jsx` is the live reference.
- Theme ported from `Rising-Tide-Org/rosebud-react/apps/web/src/styles/theme/` into `src/theme/`.
- `<ChakraProvider>` mounted in `src/main.jsx` with `resetCSS={false}` and `disableGlobalStyle={true}` so it does NOT bleed into Tailwind pages.
- Style with Chakra props (`bg`, `color`, `p`, `fontSize`) and theme tokens (`bg`, `text`, `brand.500`, etc.).

### React Native pages (rosebud-react/apps/native prototypes)
- `src/pages/DesignSystem.jsx` is the live reference, with the "Native Primitives (live Paper)" section showing real RN components.
- Theme ported from `apps/native/src/theme/` into `src/native-theme/` (colors, tokens, fonts, variants).
- Render with `react-native-paper` v5.12 components — wrap each page in `<PaperProvider theme={getTheme(mode, color)} settings={{ icon: () => null }}>`.
- Use `View` / `Text` / `ScrollView` / `Pressable` from `react-native` (Vite aliases to `react-native-web`).
- `react-native-vector-icons` is stubbed (Rolldown can't parse its JSX). For icons, use `lucide-react` instead.
- Anything using native modules (gesture handlers, expo-blur, Reanimated `springify`, expo-haptics, etc.) won't render — see /design-system "How to use with Claude" for the full list.

## Creating a new prototype page

Pick the stack based on which surface you're prototyping. Each design-system page has a "How to use with Claude" prompt cookbook with copy-paste prompts:

- **Web app prototype** → see `/design-system-web` cookbook
- **Mobile app prototype** → see `/design-system` cookbook
- **Marketing/website prototype** → see `/design-system-website` cookbook

For component implementations not documented, read source from `Rising-Tide-Org/rosebud-react` directly:
```
gh api repos/Rising-Tide-Org/rosebud-react/contents/apps/<web|native>/src/<path> -H "Accept: application/vnd.github.raw"
```

## Conventions
- Functional components, hooks only
- One styling system per page (Tailwind OR Chakra)
- Keep it simple — this is a live coding/prototyping environment
