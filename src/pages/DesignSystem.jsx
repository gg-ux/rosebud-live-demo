import { useState, useEffect } from 'react';
import { Sun, Moon, ChevronRight, Atom, Search, X as XIcon, Check, Compass, Plus, Lightbulb, BookOpen, Fingerprint, MessageCircleQuestion, Info, CheckCircle2, TriangleAlert, XCircle, Bell } from 'lucide-react';
import roseLogo from '../branding/logo-icon-color.svg';
import { usePageActions } from '../components/Layout';
import { DesignSystemSwitcher } from '../components/DesignSystemSwitcher';
import { useTheme } from '../hooks/useTheme';
import {
  PaperProvider, Button as PaperButton, TextInput as PaperTextInput,
  Switch as PaperSwitch, Checkbox as PaperCheckbox, RadioButton as PaperRadio,
  Searchbar as PaperSearchbar, Chip as PaperChip, Avatar as PaperAvatar,
  Divider as PaperDivider, ActivityIndicator, ProgressBar,
  Text as PaperText,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { View, Text as RNText, Pressable } from 'react-native';
import { getTheme } from '../native-theme/variants';
// Tailwind Card / Avatar / Tag still used inside the Cards section.
// Other primitives (Button, Input, Switch, etc.) now render via real
// react-native-paper in the Native Primitives section.
import { Avatar, Tag, Card } from '../components';
import {
  JournalEntry, StreakCard, ValueCard, DailyPromptCard, QuoteCard,
  ReflectionCard, InsightCard, HaikuCard, AskRosebudCard, KeyThemeCard,
  WeeklyReportLocked, LockedFeatureCard, UpgradeCard, PersonaCard,
  GoalsCard, FeedbackPromptCard, EmotionalLandscapeCard, EntryDraftCard,
  GratitudeChallengeCard,
} from '../components/cards';

/* ══════════════════════════════════════════════════════════
   NAVIGATION STRUCTURE
   Modeled after Material Design 3 + Shopify Polaris:
   Foundations → Components (grouped by function)
   ══════════════════════════════════════════════════════════ */

// Standard mobile frame width — applied to every full-width component
// (Bottom Sheet, Bottom Nav, Pickers, Snackbar/Infobar/Tooltip, Grouped List,
// Choice Tile) for visual cohesion. Matches iPhone X-15 base width (375).
// Compact components that intentionally stay smaller (Dialog system alert,
// Time Picker wheel) are exempt.
const MOBILE_W = 375;

const NAV = [
  {
    group: 'Getting Started',
    items: [
      { id: 'source', label: 'Source of truth' },
      { id: 'how-to-use', label: 'How to use with Claude' },
    ],
  },
  {
    group: 'Foundations',
    items: [
      { id: 'colors', label: 'Colors' },
      { id: 'md3-tokens', label: 'MD3 Semantic Tokens' },
      { id: 'color-variants', label: 'Primary Color Variants' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'radius', label: 'Radius' },
      { id: 'borders', label: 'Borders' },
      { id: 'shadows', label: 'Shadows' },
      { id: 'grid', label: 'Layout Grid' },
    ],
  },
  {
    group: 'Actions',
    items: [
      { id: 'p-button', label: 'Button', stack: 'rn-paper' },
    ],
  },
  {
    group: 'Input & Selection',
    items: [
      { id: 'p-textinput', label: 'TextInput', stack: 'rn-paper' },
      { id: 'p-textarea', label: 'Textarea', stack: 'rn-paper' },
      { id: 'p-searchbar', label: 'Searchbar', stack: 'rn-paper' },
      { id: 'p-switch', label: 'Switch', stack: 'rn' },
      { id: 'p-checkbox', label: 'Checkbox', stack: 'rn' },
      { id: 'p-radio', label: 'Radio Button', stack: 'rn-paper' },
      { id: 'p-segmented', label: 'Segmented Control', stack: 'rn' },
      { id: 'p-choice-tile', label: 'Choice Tile', stack: 'rn' },
    ],
  },
  {
    group: 'Display',
    items: [
      { id: 'p-chip', label: 'Chip', stack: 'rn-paper' },
      { id: 'p-tag', label: 'Tag', stack: 'rn' },
      { id: 'p-avatar', label: 'Avatar', stack: 'rn-paper' },
      { id: 'p-activity', label: 'Activity Indicator', stack: 'rn-paper' },
      { id: 'p-progress', label: 'Progress Bar', stack: 'rn-paper' },
      { id: 'p-grouped-list', label: 'Grouped List', stack: 'rn' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { id: 'p-snackbar', label: 'Snackbar', stack: 'rn-paper' },
      { id: 'p-infobar', label: 'Infobar', stack: 'rn' },
      { id: 'p-toast', label: 'Toast', stack: 'rn' },
      { id: 'p-tooltip', label: 'Tooltip', stack: 'rn' },
    ],
  },
  {
    group: 'Surfaces & Navigation',
    items: [
      { id: 'bottom-sheet', label: 'Bottom Sheet', stack: 'rn' },
      { id: 'bottom-nav', label: 'Bottom Nav', stack: 'rn' },
      { id: 'p-dialog', label: 'Dialog', stack: 'rn-paper' },
    ],
  },
  {
    group: 'Pickers',
    items: [
      { id: 'p-datepicker', label: 'Date Picker', stack: 'rn' },
      { id: 'p-timepicker', label: 'Time Picker', stack: 'rn' },
      { id: 'p-weekdaypicker', label: 'Weekday Picker', stack: 'rn' },
    ],
  },
  {
    group: 'Cards',
    items: [{ id: 'cards', label: 'Cards' }],
  },
  {
    group: 'Assets',
    items: [
      { id: 'icons', label: 'Icons' },
      { id: 'symbols', label: 'Symbols' },
      { id: 'illustrations', label: 'Illustrations' },
      { id: 'branding', label: 'Branding & Logos' },
    ],
  },
];

/* ── Layout helpers ── */

function Section({ id, title, description, stack, children }) {
  return (
    <section id={id} className="mb-[64px] scroll-mt-[80px]">
      <div className="flex items-center gap-[10px] mb-[4px] flex-wrap">
        <h2 className="text-[24px] leading-[32px] font-[700] text-[var(--color-on-background)]">{title}</h2>
        {stack === 'rn-paper' && <StackChip variant="paper" />}
        {stack === 'rn' && <StackChip variant="rn" />}
      </div>
      {description && (
        <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text)] mb-[24px]">
          {description}
        </p>
      )}
      {!description && <div className="mb-[24px]" />}
      {children}
    </section>
  );
}

function StackChip({ variant = 'paper' }) {
  const isPaper = variant === 'paper';
  const label = isPaper ? 'React Native + Paper' : 'React Native + Paper (Mirror)';
  const tooltip = isPaper ? (
    <>
      Rendered with the actual <code className="font-mono">react-native-paper</code> component + <code className="font-mono">react-native-web</code>, themed from the ported <code className="font-mono">apps/native/src/theme/</code>. Same component code that ships in the iOS/Android app.
    </>
  ) : (
    <>
      A <strong>visual mirror</strong> of Figma + production, built from <code className="font-mono">react-native</code> primitives (View / Pressable / Text) + <code className="font-mono">lucide-react</code> icons, but still themed via the Paper theme + Paper <code className="font-mono">Text</code> for typography. Used when Paper's component is broken in this RNW environment (e.g. <code className="font-mono">Switch</code>, <code className="font-mono">Checkbox</code>) or when production uses a non-Paper package (Bottom Sheet via Modalize, Pickers via datetimepicker).
    </>
  );
  return (
    <span className="relative group inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-full bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)] text-[10px] leading-[13px] font-[600] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] cursor-help">
      <Atom size={10} strokeWidth={2.2} />
      {label}
      <span
        role="tooltip"
        className="absolute top-full left-0 mt-[8px] z-50 w-[300px] px-[12px] py-[10px] rounded-[8px] bg-[var(--color-on-background)] text-[var(--color-background)] text-[12px] leading-[18px] font-[450] normal-case tracking-normal opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
      >
        {tooltip}
      </span>
    </span>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mt-[32px] mb-[16px] first:mt-0">
      <h3 className="text-[17px] leading-[23px] font-[500] text-[var(--color-on-surface-variant)] mb-[16px]">{title}</h3>
      {children}
    </div>
  );
}

function TokenTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-[var(--color-outline-light)]">
      <table className="w-full text-[13px] leading-[18px]">
        <thead>
          <tr className="bg-[var(--color-surface-variant)]">
            {headers.map(h => (
              <th key={h} className="text-left px-[16px] py-[10px] font-[500] text-[var(--color-on-surface-variant)]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-[var(--color-outline-light)]">
              {row.map((cell, j) => (
                <td key={j} className="px-[16px] py-[10px] font-mono text-[var(--color-on-surface)]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Swatch({ name, hex, className }) {
  // Use inline style when a hex is provided. Dynamically-generated
  // Tailwind class names (e.g. `bg-rose-pink-${n}`) don't get picked
  // up by the JIT compiler because it scans source files for literal
  // strings, not runtime-interpolated ones. Inline style sidesteps
  // that entirely and guarantees the swatch renders. className still
  // flows through for semantic-token swatches that use CSS variables.
  return (
    <div className="flex flex-col items-center gap-[6px]">
      <div
        className={`w-[56px] h-[56px] rounded-[10px] border border-[var(--color-outline-light)] ${className || ''}`}
        style={hex ? { backgroundColor: hex } : undefined}
      />
      <span className="text-[12px] leading-[17px] text-[var(--color-on-surface-variant)] text-center max-w-[70px]">{name}</span>
      {hex && <span className="text-[11px] leading-[14px] text-[var(--color-secondary-text)] font-mono">{hex}</span>}
    </div>
  );
}

function ComponentSpec({ name, children, bare = false }) {
  // `bare` drops the surface bg + border so demos that ARE white surfaces
  // themselves (TextInput, Textarea, Searchbar) stay visible against the
  // page bg instead of disappearing into a white-on-white wrapper.
  // Omit `name` to render only the children with no label (useful when one
  // container holds multiple variants that don't need separate captions).
  const wrapperClass = bare
    ? 'pt-[8px]'
    : 'p-[24px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]';
  return (
    <div className={wrapperClass}>
      {name && (
        <p className="text-[12px] leading-[16px] font-[500] text-[var(--color-secondary-text)] uppercase tracking-wider mb-[16px]">{name}</p>
      )}
      {children}
    </div>
  );
}

function PathTag({ children }) {
  return (
    <span className="inline-block text-[11px] leading-[14px] font-mono text-[var(--color-secondary-text)] bg-[var(--color-surface-variant)] px-[6px] py-[2px] rounded-[4px]">
      {children}
    </span>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="mt-[12px] p-[12px] rounded-[8px] bg-[#0F0E0E] text-[#F7F5F5] text-[12px] leading-[18px] font-mono overflow-x-auto whitespace-pre-wrap">
      <code>{children}</code>
    </pre>
  );
}

// Collapsible code-snippet panel under a component demo. `path` is the file in
// rosebud-react where the component lives (or "n/a" for demo-only). `note`
// is a short caption — e.g. "Mirrors apps/native/src/components/Button.tsx"
// or "Add as src/components/Switch.tsx".
function CodeSnippet({ path, note, children }) {
  return (
    <details className="mt-[16px] group">
      <summary className="cursor-pointer text-[13px] leading-[18px] font-[500] text-[var(--color-secondary-text)] hover:text-[var(--color-on-surface)] inline-flex items-center gap-[6px] select-none">
        <ChevronRight size={14} className="transition-transform group-open:rotate-90" />
        Show code
        {path && <span className="font-mono text-[11px] text-[var(--color-secondary-text-on-surface)]">· {path}</span>}
      </summary>
      {note && <p className="mt-[8px] text-[12px] leading-[18px] text-[var(--color-secondary-text)]">{note}</p>}
      <CodeBlock>{children}</CodeBlock>
    </details>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════ */

export function DesignSystem() {
  const [switchOn, setSwitchOn] = useState(false);
  const [checkboxOn, setCheckboxOn] = useState(true);
  const [cardChecked, setCardChecked] = useState(true);
  const [radio, setRadio] = useState('a');
  const [segment, setSegment] = useState('week');
  const [theme, setTheme] = useTheme();
  const [activeSection, setActiveSection] = useState('colors');
  const [collapsed, setCollapsed] = useState({});
  const [sidebarSearch, setSidebarSearch] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  usePageActions(
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      className="p-[8px] rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] text-[var(--color-on-surface)] hover:opacity-80 transition-opacity cursor-pointer"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
    </button>,
    [theme]
  );

  // Paper theme uses the default primary variant (black in light, light gray
  // in dark) — matches what ships in apps/native/src/theme/light.ts. Users
  // can switch to rose/green/blue/orange/purple in the actual app; that
  // option is documented in the "Primary Color Variants" section.
  const paperTheme = getTheme(theme, 'default');

  return (
    <PaperProvider theme={paperTheme} settings={{ icon: () => null }}>
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">

      <div className="max-w-[1400px] mx-auto flex">
        {/* ── Sidebar ── */}
        <nav className="hidden lg:flex flex-col w-[200px] shrink-0 sticky top-[64px] h-[calc(100vh-64px)] border-r border-[var(--color-outline-light)]">
          {/* Sticky top: title (with switcher) + search */}
          <div className="shrink-0 px-[12px] pt-[24px] pb-[12px] border-b border-[var(--color-outline-light)] bg-[var(--color-background)]">
            <DesignSystemSwitcher current="mobile" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search..."
              className="mt-[14px] w-full px-[10px] py-[6px] rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] text-[13px] leading-[18px] font-[450] text-[var(--color-on-surface)] placeholder:text-[var(--color-secondary-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
          {/* Scrollable groups */}
          <div className="flex-1 overflow-y-auto px-[12px] py-[12px] flex flex-col gap-[8px]">
          {NAV.map((group) => {
            const q = sidebarSearch.toLowerCase();
            const filteredItems = q
              ? group.items.filter(i => i.label.toLowerCase().includes(q) || group.group.toLowerCase().includes(q))
              : group.items;
            if (filteredItems.length === 0) return null;
            const isOpen = sidebarSearch || !collapsed[group.group];
            const hasActive = filteredItems.some(i => i.id === activeSection);
            return (
              <div key={group.group} className="mb-[8px]">
                <button
                  onClick={() => setCollapsed(c => ({ ...c, [group.group]: !c[group.group] }))}
                  className="flex items-center gap-[6px] w-full py-[6px] text-[10px] leading-[14px] font-[700] uppercase tracking-[0.1em] text-[var(--color-secondary-text)]/85 hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
                >
                  <ChevronRight
                    size={12}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                  <span>{group.group}</span>
                  {!isOpen && hasActive && (
                    <span className="w-[5px] h-[5px] rounded-full bg-[var(--color-primary)] ml-auto" />
                  )}
                </button>
                {isOpen && (
                  <ul className="space-y-[2px] mt-[4px] ml-[6px]">
                    {filteredItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`
                            flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px] text-[13px] leading-[18px] font-[500] transition-colors
                            ${activeSection === item.id
                              ? 'bg-[var(--color-surface-variant)] text-[var(--color-on-background)] font-[600]'
                              : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)]'
                            }
                          `}
                        >
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.stack === 'rn-paper' && (
                            <Atom
                              size={11}
                              strokeWidth={2.2}
                              className="shrink-0 text-[var(--color-secondary-text)]"
                              aria-label="React Native + Paper"
                            />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          </div>
        </nav>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-[32px] lg:px-[48px] py-[48px]">

          {/* Page header */}
          <div className="mb-[40px] pb-[24px] border-b border-[var(--color-outline-light)]">
            <span className="inline-block text-[11px] font-[700] uppercase tracking-[0.08em] text-[var(--color-secondary-text)] mb-[8px]">
              Foundations
            </span>
            <h1 className="text-[36px] leading-[42px] font-[700] tracking-[-0.02em] text-[var(--color-on-background)] mb-[8px]">
              Design System · Mobile App
            </h1>
            <p className="text-[15px] leading-[22px] font-[450] text-[var(--color-secondary-text)] max-w-[680px]">
              The mobile app design system from <PathTag>Rising-Tide-Org/rosebud-react</PathTag> · <PathTag>apps/native</PathTag>.
              Built on Expo SDK 54 + react-native-paper (MD3 theming). Tokens on this page are backed by the actual native source.
            </p>
          </div>

          {/* ═══ GETTING STARTED ═══ */}

          {/* Source of truth */}
          <Section id="source" title="Source of truth" description="Where these tokens come from in the actual native codebase.">
            <div className="p-[20px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] space-y-[10px]">
              <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">
                <strong>Stack:</strong> Expo SDK 54 + React Native 0.81.5 + react-native-paper 5.12 (MD3 theming).
              </p>
              <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">
                <strong>Theme files (pure data — no native deps, port verbatim):</strong>
              </p>
              <ul className="text-[13px] leading-[22px] text-[var(--color-secondary-text)] list-disc pl-[20px]">
                <li><PathTag>apps/native/src/theme/light.ts</PathTag> · MD3 light theme + Rosebud extensions</li>
                <li><PathTag>apps/native/src/theme/dark.ts</PathTag> · MD3 dark theme</li>
                <li><PathTag>apps/native/src/theme/tokens.ts</PathTag> · <code className="font-mono">space()</code>, <code className="font-mono">radius()</code>, <code className="font-mono">border()</code> helpers</li>
                <li><PathTag>apps/native/src/theme/fonts.ts</PathTag> · MD3 typescale + Circular weights</li>
                <li><PathTag>apps/native/src/theme/variants/</PathTag> · 6 primary color variants (default, rose, green, blue, orange, purple)</li>
                <li><PathTag>apps/native/src/components/</PathTag> · primitive component source</li>
              </ul>
              <p className="text-[13px] text-[var(--color-secondary-text)] pt-[8px]">
                Note: this page predates the native code survey — the brand color scales (Rose Pink 900→50, Sage Green, etc.) below are an extended Figma palette Grace built that doesn't exist as scales in the native code itself. The native app uses raw MD3 colors. Both are documented; treat the brand scales as the design palette and the MD3 tokens as what's actually in production.
              </p>
            </div>
          </Section>

          <Section id="how-to-use" title="How to use this page with Claude" description="Copy-paste these prompts when you want Claude to prototype mobile-app screens that match Rosebud's native design language.">
            <div className="p-[24px] rounded-[12px] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)]">
              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mb-[10px]">1 · Bootstrap a new mobile prototype page</p>
              <p className="text-[14px] leading-[20px] text-[var(--color-secondary-text)] mb-[12px]">
                The native app is React Native + Expo + react-native-paper. This repo has <code className="font-mono">react-native-web</code> wired up so you can render the <em>actual</em> Paper components in the browser. Drop a new file under <PathTag>src/pages/</PathTag>:
              </p>
              <CodeBlock>{`Create a mobile-style prototype page at src/pages/MyMobilePage.jsx using react-native-paper components. The repo has react-native-web set up — these render as real DOM in the browser.

Imports:
import { PaperProvider, Button, TextInput, Switch, Checkbox, RadioButton, Searchbar, Chip, Avatar, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { View, Text } from 'react-native';
import { getTheme } from '../native-theme/variants';
import { PhoneFrame } from '../components/PhoneFrame';

Wrap your page in:
<PaperProvider theme={getTheme('light', 'rose')} settings={{ icon: () => null }}>
  <PhoneFrame>
    <View style={{ flex: 1, padding: 16, backgroundColor: paperTheme.colors.background }}>
      ...your screen here, using Paper components...
    </View>
  </PhoneFrame>
</PaperProvider>

Rules:
- Use Paper components (Button mode='contained' / TextInput mode='outlined' / etc.) — NOT Tailwind classes for primitives. The whole point of the RNW setup is that prototypes look and behave exactly like the native app.
- Use 'react-native' for layout primitives: View, Text, ScrollView, Pressable. (These resolve to react-native-web in the browser.)
- Style via the 'style' prop with theme colors: paperTheme.colors.surface, .onSurface, .primary, etc.
- Pick a primary variant via getTheme(mode, color): 'default' | 'rose' | 'green' | 'blue' | 'orange' | 'purple'. Rose is the brand pink #E31665.
- For typography, reference theme.fonts (configured from MD3 typescale).

Add a Route in src/main.jsx and (optionally) a sidebar entry in src/components/Sidebar.jsx.`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">2 · What does and doesn't work in the browser</p>
              <p className="text-[14px] leading-[20px] text-[var(--color-secondary-text)] mb-[12px]">react-native-web translates RN to DOM, but the native app uses many Expo/RN packages with no web equivalent. When asking Claude to recreate a screen:</p>
              <CodeBlock>{`Build the [SCREEN NAME] from rosebud-react/apps/native using react-native-paper components.

What works in the browser (use freely):
- Paper primitives: Button, TextInput, Switch, Checkbox, RadioButton, Searchbar, Chip, Avatar, ActivityIndicator, ProgressBar, Snackbar, Card, Banner
- RN layout: View, Text, ScrollView, Pressable, Image
- Linear gradients via 'expo-linear-gradient' won't work — use a CSS gradient on a styled View instead

Stub or skip these (they require native modules not available on web):
- @gorhom/bottom-sheet, react-native-keyboard-controller, react-native-pager-view
- expo-blur, expo-haptics, expo-camera, expo-av, expo-local-authentication, expo-notifications
- @shopify/flash-list (use FlatList from RN)
- react-native-vector-icons (we stubbed it; use lucide-react if you need icons)
- Reanimated 3 'springify()' animations and ZoomIn — fragile under RNW; prefer Animated from RN core

If you need an icon, use lucide-react and place it inside <View>, not as a Paper icon prop.`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">3 · Pick the right primary variant</p>
              <CodeBlock>{`Use the [rose | green | blue | orange | purple] primary variant from the native theme via getTheme(mode, color):

const paperTheme = getTheme(theme, 'rose');  // brand pink #E31665
<PaperProvider theme={paperTheme}>...</PaperProvider>

Variant primaries:
- default: black rgb(0,0,0)
- rose:    rgb(227,22,101) #E31665   (the brand pink)
- green:   rgb(29,155,94)
- blue:    rgb(81,132,211)
- orange:  rgb(218,101,90)
- purple:  rgb(140,60,144)`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">4 · Reference the native repo directly</p>
              <CodeBlock>{`Read source from Rising-Tide-Org/rosebud-react via gh:
gh api repos/Rising-Tide-Org/rosebud-react/contents/apps/native/src/<path> -H "Accept: application/vnd.github.raw"

Key paths:
- apps/native/src/theme/light.ts          — MD3 light theme (already ported to src/native-theme/)
- apps/native/src/theme/tokens.ts         — space(), radius(), border() helpers
- apps/native/src/theme/fonts.ts          — Circular font weights + MD3 typescale
- apps/native/src/theme/variants/         — 6 primary color variants
- apps/native/src/components/<Name>/      — primitive component source (Button.tsx, FormTextInput.tsx, Panel/, etc.)`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">Three styling worlds in this repo</p>
              <ul className="text-[14px] leading-[22px] text-[var(--color-on-surface)] list-disc pl-[20px] space-y-[4px]">
                <li><strong>Mobile App pages</strong> (this page) — real react-native-paper via react-native-web. Same library as production.</li>
                <li><strong>Web App pages</strong> (/design-system-web) — real Chakra UI v2 with the rosebud-react web theme.</li>
                <li><strong>Website pages</strong> (/design-system-website) — Tailwind, no framework, marketing/landing style.</li>
              </ul>
              <p className="text-[13px] text-[var(--color-secondary-text)] mt-[8px]">Don't mix stacks on the same page. Pick one per prototype.</p>
            </div>
          </Section>

          {/* ═══ FOUNDATIONS ═══ */}

          {/* Colors */}
          <Section id="colors" title="Colors — Brand Scales (Figma extended palette)" description="The full extended brand palette as documented in Figma. Useful for picking accent shades. The native code only uses a subset of these — see MD3 Semantic Tokens below for what actually ships.">
            <SubSection title="Brand — Rose Pink">
              <div className="flex flex-wrap gap-[12px]">
                {[['900','#630025'],['800','#7E0230'],['700','#A40742'],['600','#C50C51'],['500','#D6165B'],['400','#E31665'],['300','#F47EAC'],['200','#FFBDD6'],['100','#FFD8E7'],['50','#FFE2ED']].map(([n,h]) => (
                  <Swatch key={n} name={n} hex={h} className={`bg-rose-pink-${n}`} />
                ))}
              </div>
            </SubSection>
            <SubSection title="Brand — Sage Green">
              <div className="flex flex-wrap gap-[12px]">
                {[['900','#235E4D'],['800','#36846C'],['700','#479980'],['600','#4FA58B'],['500','#5ABA9D'],['400','#7CC4AF'],['300','#93CCBB'],['200','#AAD5C8'],['100','#C2E6DB'],['50','#F0FFF4']].map(([n,h]) => (
                  <Swatch key={n} name={n} hex={h} className={`bg-sage-green-${n}`} />
                ))}
              </div>
            </SubSection>
            <SubSection title="Brand — Soft Ivory">
              <div className="flex flex-wrap gap-[12px]">
                {[['900','#AF730D'],['800','#D28D1A'],['700','#DD9D34'],['600','#E4AD51'],['500','#EBBC6F'],['400','#F4CC89'],['300','#FAD8A1'],['200','#FFE3B5'],['100','#FFEDCF'],['50','#FFF6E8']].map(([n,h]) => (
                  <Swatch key={n} name={n} hex={h} className={`bg-soft-ivory-${n}`} />
                ))}
              </div>
            </SubSection>
            <SubSection title="Brand — Charcoal Gray">
              <div className="flex flex-wrap gap-[12px]">
                {[['900','#0F0E0E'],['800','#332F2F'],['700','#5C5555'],['600','#7F7676'],['500','#8B807F'],['400','#CCBEBE'],['300','#DED5D5'],['200','#EDE4E4'],['100','#F9F3F3'],['50','#FFFAFA']].map(([n,h]) => (
                  <Swatch key={n} name={n} hex={h} className={`bg-charcoal-gray-${n}`} />
                ))}
              </div>
            </SubSection>
            <SubSection title="Semantic (theme-aware)">
              <div className="flex flex-wrap gap-[12px]">
                <Swatch name="primary" className="bg-[var(--color-primary)]" />
                <Swatch name="secondary" className="bg-[var(--color-secondary)]" />
                <Swatch name="tertiary" className="bg-[var(--color-tertiary)]" />
                <Swatch name="error" className="bg-[var(--color-error)]" />
                <Swatch name="surface" className="bg-[var(--color-surface)]" />
                <Swatch name="background" className="bg-[var(--color-background)] ring-1 ring-[var(--color-outline)]" />
                <Swatch name="outline" className="bg-[var(--color-outline)]" />
                <Swatch name="surfaceVariant" className="bg-[var(--color-surface-variant)]" />
              </div>
            </SubSection>
            <SubSection title="Accent">
              <div className="flex flex-wrap gap-[12px]">
                <Swatch name="blue" hex="#0A84FF" className="bg-accent-blue" />
                <Swatch name="yellow" hex="#FDCF08" className="bg-accent-yellow" />
                <Swatch name="green" className="bg-[var(--color-accent-green)]" />
                <Swatch name="assistant" className="bg-[var(--color-assistant)]" />
              </div>
            </SubSection>
          </Section>

          {/* MD3 Semantic Tokens — actual native source */}
          <Section id="md3-tokens" title="MD3 Semantic Tokens (actual native source)" description="What's actually shipped in apps/native/src/theme/light.ts and dark.ts. The native app uses Material Design 3 tokens via react-native-paper.">
            <SubSection title="Light theme">
              <TokenTable
                headers={['Token', 'rgb()']}
                rows={[
                  ['primary', 'rgb(0, 0, 0)'],
                  ['onPrimary', 'rgb(250, 250, 250)'],
                  ['primaryContainer', 'rgb(151, 247, 183)'],
                  ['secondary', 'rgb(79, 99, 84)'],
                  ['secondaryContainer', 'rgb(255, 255, 255)'],
                  ['tertiary', 'rgb(59, 100, 112)'],
                  ['tertiaryContainer', 'rgb(190, 234, 247)'],
                  ['error', 'rgb(186, 26, 26)'],
                  ['errorContainer', 'rgb(255, 218, 214)'],
                  ['background', 'rgb(240, 240, 240)'],
                  ['onBackground', 'rgb(25, 28, 26)'],
                  ['surface', 'rgb(255, 255, 255)'],
                  ['onSurface', 'rgb(25, 28, 26)'],
                  ['surfaceVariant', 'rgb(220, 229, 219)'],
                  ['onSurfaceVariant', 'rgb(65, 73, 66)'],
                  ['outline', 'rgb(192, 192, 191)'],
                  ['outlineLight', 'rgb(222, 222, 222)'],
                  ['outlineVariant', 'rgb(201, 202, 201)'],
                  ['backdrop', 'rgba(43, 50, 44, 0.4)'],
                ]}
              />
            </SubSection>
            <SubSection title="Rosebud extensions (light)">
              <TokenTable
                headers={['Token', 'rgb()', 'Use']}
                rows={[
                  ['assistant', '#2b6cb0', 'AI assistant accent (cool blue)'],
                  ['backgroundOnSurface', 'rgb(248, 248, 248)', 'Background applied over a surface'],
                  ['secondaryText', 'rgb(109, 108, 106)', 'Subdued body text'],
                  ['secondaryTextOnSurface', 'rgb(139, 130, 139)', 'Subdued text over a surface'],
                  ['blue', 'rgb(10, 132, 255)', 'Status/info accent'],
                  ['yellow', 'rgb(253, 207, 8)', 'Warning accent'],
                  ['green', 'rgb(32, 123, 0)', 'Success accent'],
                  ['softIvory', 'rgba(115, 78, 15, 1)', 'Premium / soft warm accent'],
                  ['sand', 'rgb(255, 243, 228)', 'Warm tinted background (callouts)'],
                  ['surfaceGradient', "['rgba(255,255,255,1)', 'rgba(255,255,255,0)']", 'Top→transparent fade'],
                  ['backgroundGradient', "['rgba(240,240,240,1)', 'rgba(240,240,240,0)']", 'Top→transparent fade'],
                ]}
              />
            </SubSection>
            <SubSection title="Dark theme (deltas from light)">
              <TokenTable
                headers={['Token', 'rgb()']}
                rows={[
                  ['primary', 'rgb(220, 220, 220)'],
                  ['onPrimary', 'rgb(0, 0, 0)'],
                  ['background', 'rgb(10, 12, 10)'],
                  ['onBackground', 'rgb(225, 227, 222)'],
                  ['surface', 'rgb(30, 30, 32)'],
                  ['onSurface', 'rgb(225, 227, 222)'],
                  ['surfaceVariant', 'rgb(65, 73, 66)'],
                  ['outline', 'rgb(65, 73, 66)'],
                  ['outlineLight', 'rgb(50, 50, 52)'],
                  ['assistant', '#63b3ed'],
                  ['secondaryText', 'rgb(100, 108, 106)'],
                  ['green', 'rgb(64, 172, 26)'],
                  ['softIvory', 'rgba(250, 216, 161, 1)'],
                ]}
              />
            </SubSection>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/theme/light.ts</PathTag> · <PathTag>apps/native/src/theme/dark.ts</PathTag>
            </p>
          </Section>

          {/* Primary Color Variants */}
          <Section id="color-variants" title="Primary Color Variants" description="The native app supports 6 primary color variants the user can switch between. The variant only changes primary + onPrimary (and a few surface tints in dark mode); everything else stays the same.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {[
                ['default', '#000000', '#FAFAFA', 'Black — the default neutral'],
                ['rose', '#E31665', '#FFFFFF', 'rgb(227, 22, 101) — the brand pink'],
                ['green', '#1D9B5E', '#FFFFFF', 'rgb(29, 155, 94)'],
                ['blue', '#5184D3', '#FFFFFF', 'rgb(81, 132, 211)'],
                ['orange', '#DA655A', '#FFFFFF', 'rgb(218, 101, 90)'],
                ['purple', '#8C3C90', '#FFFFFF', 'rgb(140, 60, 144)'],
              ].map(([name, primary, onPrimary, desc]) => (
                <div key={name} className="p-[16px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
                  <div className="flex items-center gap-[12px] mb-[10px]">
                    <div className="w-[40px] h-[40px] rounded-[10px]" style={{ backgroundColor: primary }} />
                    <div>
                      <p className="text-[14px] font-[600] text-[var(--color-on-surface)] capitalize">{name}</p>
                      <p className="text-[12px] text-[var(--color-secondary-text)] font-mono">primary {primary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <button className="px-[14px] h-[36px] rounded-[8px] text-[13px] font-[500]" style={{ backgroundColor: primary, color: onPrimary }}>Primary action</button>
                    <span className="text-[12px] text-[var(--color-secondary-text)]">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/theme/variants/</PathTag> · selected via <code className="font-mono">getColors(mode, color)</code> in <PathTag>variants/index.ts</PathTag>
            </p>
          </Section>

          {/* Typography */}
          <Section id="typography" title="Typography" description="Circular Std family with 6 weights (Light, Book 450, BookItalic, Medium 500, Bold 700, Black). Type scale follows MD3 typescale via configureFonts().">
            <div className="overflow-x-auto rounded-[12px] border border-[var(--color-outline-light)]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-surface-variant)]">
                    {['Style', 'Weight', 'Size', 'Line Height', 'Spacing'].map(h => (
                      <th key={h} className="text-left px-[16px] py-[10px] text-[13px] leading-[18px] font-[500] text-[var(--color-on-surface-variant)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Display Large', size: 24, lh: 32, weight: 500, ls: '0.024' },
                    { name: 'Display Medium', size: 22, lh: 30, weight: 500, ls: '0.022' },
                    { name: 'Display Small', size: 20, lh: 28, weight: 500, ls: '0.020' },
                    { name: 'Title Large', size: 17, lh: 23, weight: 500, ls: '0.017' },
                    { name: 'Title Medium', size: 16, lh: 22, weight: 500, ls: '0.016' },
                    { name: 'Title Small', size: 15, lh: 21, weight: 500, ls: '0.015' },
                    { name: 'Body Large', size: 17, lh: 23, weight: 450, ls: '0.017' },
                    { name: 'Body Medium', size: 16, lh: 22, weight: 450, ls: '0.016' },
                    { name: 'Body Small', size: 15, lh: 20, weight: 450, ls: '0.015' },
                    { name: 'Label Large', size: 14, lh: 20, weight: 450, ls: '0.014' },
                    { name: 'Label Medium', size: 13, lh: 18, weight: 450, ls: '0.013' },
                    { name: 'Label Small', size: 12, lh: 17, weight: 450, ls: '0.012' },
                    { name: 'Caption', size: 12, lh: 16, weight: 500, ls: '0.012' },
                    { name: 'Caption Bold', size: 12, lh: 16, weight: 700, ls: '0.012' },
                  ].map((t) => (
                    <tr key={t.name} className="border-t border-[var(--color-outline-light)]">
                      <td className="px-[16px] py-[12px]">
                        <span style={{ fontSize: t.size, lineHeight: `${t.lh}px`, fontWeight: t.weight }} className="text-[var(--color-on-surface)]">
                          {t.name}
                        </span>
                      </td>
                      <td className="px-[16px] py-[12px] text-[13px] font-mono text-[var(--color-on-surface)]">{t.weight}</td>
                      <td className="px-[16px] py-[12px] text-[13px] font-mono text-[var(--color-on-surface)]">{t.size}px</td>
                      <td className="px-[16px] py-[12px] text-[13px] font-mono text-[var(--color-on-surface)]">{t.lh}px</td>
                      <td className="px-[16px] py-[12px] text-[13px] font-mono text-[var(--color-on-surface)]">{t.ls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/theme/fonts.ts</PathTag> · MD3 typescale via <code className="font-mono">configureFonts(fontStyle)</code>
            </p>
          </Section>

          {/* Spacing */}
          <Section id="spacing" title="Spacing" description="4dp grid via the space(n) helper. n × 4 = px. .5 steps allowed; off-grid values warn in __DEV__.">
            <TokenTable
              headers={['Token', 'Value', 'Multiplier']}
              rows={[
                ['1', '4px', '×1'], ['1.5', '6px', '×1.5'], ['2', '8px', '×2'], ['2.5', '10px', '×2.5'],
                ['3', '12px', '×3'], ['3.5', '14px', '×3.5'], ['4', '16px', '×4'], ['4.5', '18px', '×4.5'],
                ['5', '20px', '×5'], ['6', '24px', '×6'], ['7', '28px', '×7'], ['8', '32px', '×8'], ['9', '36px', '×9'],
              ]}
            />
            <SubSection title="Extended (component sizing)">
              <TokenTable
                headers={['Token', 'Value']}
                rows={[
                  ['10', '40px'], ['11', '44px'], ['12', '48px'], ['14', '56px'], ['16', '64px'],
                  ['18', '72px'], ['20', '80px'], ['22', '88px'], ['24', '96px'], ['26', '104px'],
                  ['28', '112px'], ['30', '120px'],
                ]}
              />
            </SubSection>
            <div className="flex items-end gap-[12px] mt-[24px]">
              {[['1',4],['2',8],['3',12],['4',16],['5',20],['6',24],['7',28],['8',32],['9',36]].map(([name, px]) => (
                <div key={name} className="flex flex-col items-center gap-[6px]">
                  <div className="bg-sage-green-500" style={{ width: px, height: px }} />
                  <span className="text-[11px] text-[var(--color-secondary-text)] font-mono">{name}</span>
                </div>
              ))}
            </div>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/theme/tokens.ts</PathTag> · <code className="font-mono">space(n: number)</code> exported helper
            </p>
          </Section>

          {/* Radius */}
          <Section id="radius" title="Radius" description="Key-based scale. Use radius(key) helper. Matches the native source verbatim.">
            <TokenTable
              headers={['Token', 'Value']}
              rows={[
                ['none', '0'], ['xxs', '4px'], ['xs', '6px'], ['sm', '8px'], ['md', '10px'],
                ['lg', '12px'], ['xl', '16px'], ['2xl', '18px'], ['3xl', '24px'], ['full', '999px'],
              ]}
            />
            <div className="flex items-center gap-[16px] mt-[24px]">
              {[['none',0],['xxs',4],['xs',6],['sm',8],['md',10],['lg',12],['xl',16],['2xl',18],['3xl',24],['full',999]].map(([name, r]) => (
                <div key={name} className="flex flex-col items-center gap-[6px]">
                  <div className="w-[48px] h-[48px] bg-[var(--color-surface-variant)] border border-[var(--color-outline)]" style={{ borderRadius: r }} />
                  <span className="text-[11px] text-[var(--color-secondary-text)] font-mono">{name}</span>
                </div>
              ))}
            </div>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/theme/tokens.ts</PathTag> · <code className="font-mono">radius(key: RadiusKey)</code> exported helper
            </p>
          </Section>

          {/* Borders */}
          <Section id="borders" title="Borders" description="Key-based scale. Use border(key) helper. Matches the native source verbatim.">
            <TokenTable
              headers={['Token', 'Value']}
              rows={[['xs', '1px'], ['sm', '2px'], ['md', '4px'], ['lg', '6px'], ['xl', '8px']]}
            />
            <div className="flex items-center gap-[24px] mt-[24px]">
              {[['xs',1],['sm',2],['md',4],['lg',6],['xl',8]].map(([name, w]) => (
                <div key={name} className="flex flex-col items-center gap-[6px]">
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-transparent" style={{ border: `${w}px solid var(--color-outline)` }} />
                  <span className="text-[11px] text-[var(--color-secondary-text)] font-mono">{name} ({w}px)</span>
                </div>
              ))}
            </div>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/theme/tokens.ts</PathTag> · <code className="font-mono">border(key: BorderKey)</code> exported helper
            </p>
          </Section>

          {/* Shadows */}
          <Section id="shadows" title="Shadows" description="Elevation levels for depth and hierarchy.">
            <div className="flex items-center gap-[24px]">
              {[['sm','0 1px 2px'],['md','0 4px 12px'],['lg','0 4px 16px']].map(([name, val]) => (
                <div key={name} className="flex flex-col items-center gap-[6px]">
                  <div className={`w-[80px] h-[80px] rounded-[12px] bg-[var(--color-surface)] shadow-${name}`} />
                  <span className="text-[11px] text-[var(--color-secondary-text)] font-mono">{name}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Layout Grid */}
          <Section id="grid" title="Layout Grid" description="Grid systems for consistent spacing and alignment across screens.">
            <SubSection title="Mobile App (iPhone 16 Pro)">
              <TokenTable
                headers={['Property', 'Value']}
                rows={[
                  ['Viewport', '402 × 874'], ['Columns', '4'], ['Gutter', '12px'],
                  ['Margins', '12px'], ['Column Width', '85.5px'], ['Alignment', 'Stretch'],
                ]}
              />
            </SubSection>
            <SubSection title="Desktop App">
              <TokenTable
                headers={['Property', 'Value']}
                rows={[
                  ['Viewport', '1440 × 1024'], ['Columns', '12'], ['Gutter', '16px'],
                  ['Margins', '0px'], ['Column Width', '72px'], ['Alignment', 'Center'],
                ]}
              />
            </SubSection>
          </Section>

          {/* ═══ ACTIONS (live RN + Paper) ═══ */}

          <Section id="p-button" title="Button" stack="rn-paper" description="react-native-paper Button. 5 modes (contained, outlined, text, elevated, contained-tonal). Default primary variant matches production: black in light, light gray in dark.">
            <ComponentSpec name="Modes">
              <PaperButtonModesDemo />
            </ComponentSpec>
            <SubSection title="Sizes">
              <ComponentSpec name="xs · sm · md · lg (production: 28 / 42 / 48 / 56h)">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <PaperButton mode="contained" style={{ borderRadius: 12 }} contentStyle={{ height: 28, paddingHorizontal: 12 }} labelStyle={{ fontSize: 13, fontWeight: '500' }}>xs</PaperButton>
                  <PaperButton mode="contained" style={{ borderRadius: 12 }} contentStyle={{ height: 42 }} labelStyle={{ fontSize: 14, fontWeight: '500' }}>sm</PaperButton>
                  <PaperButton mode="contained" style={{ borderRadius: 12 }} contentStyle={{ height: 48 }} labelStyle={{ fontSize: 16, fontWeight: '500' }}>md</PaperButton>
                  <PaperButton mode="contained" style={{ borderRadius: 12 }} contentStyle={{ height: 56 }} labelStyle={{ fontSize: 16, fontWeight: '500' }}>lg</PaperButton>
                </View>
              </ComponentSpec>
            </SubSection>
            <SubSection title="States">
              <ComponentSpec name="Loading · Disabled">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <PaperButton mode="contained" loading>Saving</PaperButton>
                  <PaperButton mode="contained" disabled>Disabled</PaperButton>
                  <PaperButton mode="outlined" disabled>Disabled outline</PaperButton>
                </View>
              </ComponentSpec>
            </SubSection>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/components/Button.tsx</PathTag>
            </p>
            <CodeSnippet
              path="apps/native/src/components/Button.tsx"
              note="Wraps Paper's Button. Adds size variants (xs/sm/md/lg → 28/42/48/56h), variant='primary' for explicit primary bg, and destructive prop for error-color labels."
            >{`import Button from 'components/Button'

<Button mode="contained">Save</Button>
<Button mode="outlined">Cancel</Button>
<Button mode="text">Skip</Button>

<Button mode="contained" loading>Saving</Button>
<Button mode="contained" disabled>Disabled</Button>

<Button mode="contained" variant="primary" size="lg">
  Get Bloom
</Button>
<Button mode="text" destructive>Delete entry</Button>`}</CodeSnippet>
          </Section>

          {/* ═══ INPUT & SELECTION (live RN + Paper) ═══ */}

          <Section id="p-textinput" title="TextInput" stack="rn-paper" description="The rosebud FormTextInput wraps Paper's outlined TextInput. 56px height, 12px radius, surface bg, 16px horizontal padding, Body Medium 16/22. Label above the field, outline transparent at rest and outlineLight (#DEDEDE) on focus.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <ComponentSpec name="Default" bare>
                <PaperTextInputDemo label="Email" placeholder="you@example.com" />
              </ComponentSpec>
              <ComponentSpec name="With description" bare>
                <PaperTextInputDemo label="Name" placeholder="Grace" description="Used to personalize prompts." />
              </ComponentSpec>
            </div>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/components/FormTextInput.tsx</PathTag>
            </p>
            <CodeSnippet
              path="apps/native/src/components/FormTextInput.tsx"
              note="Wraps Paper's outlined TextInput. Renders label as a separate Text above the field, transparent rest outline, outlineLight on focus, 56h × 12px radius."
            >{`import FormTextInput from 'components/FormTextInput'

<FormTextInput
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
/>

<FormTextInput
  label="Bio"
  placeholder="Tell us about yourself"
  description="Used to personalize prompts."
  value={bio}
  onChangeText={setBio}
  charLimit={500}
/>`}</CodeSnippet>
          </Section>

          <Section id="p-textarea" title="Textarea" stack="rn-paper" description="Multi-line variant of TextInput with a character counter. Same surface bg + 12px radius + transparent-at-rest outline.">
            <ComponentSpec name="With character limit" bare>
              <PaperTextareaDemo placeholder="Imagine a world where creativity knows no bounds." charLimit={500} />
            </ComponentSpec>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/components/FormTextInput.tsx · multiline</PathTag>
            </p>
            <CodeSnippet
              path="apps/native/src/components/FormTextInput.tsx"
              note="Pass `multiline` + `charLimit` to FormTextInput for the Textarea variant. Char counter renders below the field automatically."
            >{`<FormTextInput
  placeholder="Imagine a world where creativity knows no bounds."
  value={text}
  onChangeText={setText}
  multiline
  charLimit={500}
/>`}</CodeSnippet>
          </Section>

          <Section id="p-searchbar" title="Searchbar" stack="rn-paper" description="react-native-paper Searchbar. Used in entry list and explore.">
            <ComponentSpec name="Default" bare>
              <PaperSearchbarDemo />
            </ComponentSpec>
            <CodeSnippet
              path="react-native-paper · Searchbar"
              note="Paper Searchbar with default magnify icon (production uses MaterialCommunityIcons via react-native-vector-icons; stubbed in this demo, so we pass explicit lucide render fns)."
            >{`import { Searchbar, useTheme } from 'react-native-paper'

const [q, setQ] = useState('')
const t = useTheme()

<Searchbar
  placeholder="Search entries…"
  value={q}
  onChangeText={setQ}
  elevation={0}
  style={{
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.outlineLight,
    borderRadius: 12,
  }}
/>`}</CodeSnippet>
          </Section>

          <Section id="p-switch" title="Switch" stack="rn" description="Custom 51×30 Pressable + View toggle. Paper's MD3 Switch ignores `thumbColor` (paints thumb same color as on-track), so we build it from RN primitives.">
            <ComponentSpec name="On / Off">
              <PaperSwitchDemo />
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/Switch.tsx (new file)"
              note="Drop into rosebud-react as a new file. Uses `useTheme<RBTheme>()` for tokens — same theme that ships in the app."
            >{`import { Pressable, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { RBTheme } from 'theme'

type Props = {
  value: boolean
  onValueChange: (next: boolean) => void
  disabled?: boolean
}

export default function Switch({ value, onValueChange, disabled }: Props) {
  const t = useTheme<RBTheme>()
  const trackBg = value ? t.colors.primary : t.colors.outlineLight
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={{
        width: 51,
        height: 30,
        borderRadius: 999,
        backgroundColor: trackBg,
        padding: 2,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          backgroundColor: t.colors.surface,
          transform: [{ translateX: value ? 21 : 0 }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: value ? 0.05 : 0.08,
          shadowRadius: value ? 2 : 4,
          elevation: 2,
        }}
      />
    </Pressable>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="p-checkbox" title="Checkbox" stack="rn" description="Custom 24×24 Pressable + View + lucide Check. Paper's Checkbox renders the box via `react-native-vector-icons` (stubbed in this repo), so we draw it manually.">
            <ComponentSpec name="With label">
              <PaperCheckboxDemo />
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/Checkbox.tsx (new file)"
              note="On native, swap lucide for `react-native-vector-icons` MaterialCommunityIcons (`check`)."
            >{`import { Pressable, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { Check } from 'lucide-react-native'
import { RBTheme } from 'theme'

type Props = {
  value: boolean
  onValueChange: (next: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Checkbox({ value, onValueChange, label, disabled }: Props) {
  const t = useTheme<RBTheme>()
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: value ? t.colors.primary : t.colors.surface,
          borderWidth: 1,
          borderColor: value ? t.colors.primary : t.colors.secondaryTextOnSurface,
        }}
      >
        {value && <Check size={16} strokeWidth={3} color={t.colors.onPrimary} />}
      </View>
      {label && (
        <Text variant="bodyMedium" style={{ color: t.colors.onSurface }}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="p-radio" title="Radio Button" stack="rn-paper" description="react-native-paper RadioButton.Group with three options.">
            <ComponentSpec name="Group of 3">
              <PaperRadioDemo />
            </ComponentSpec>
            <CodeSnippet
              path="react-native-paper · RadioButton.Group"
              note="Pass `uncheckedColor` so the unchecked stroke uses Figma's secondaryTextOnSurface (#8B828B) instead of Paper's default sage onSurfaceVariant."
            >{`import { RadioButton, Text, useTheme } from 'react-native-paper'
import { View } from 'react-native'

const [v, setV] = useState('a')
const t = useTheme()

<RadioButton.Group value={v} onValueChange={setV}>
  {[['a', 'Option A'], ['b', 'Option B'], ['c', 'Option C']].map(([val, label]) => (
    <View key={val} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <RadioButton value={val} uncheckedColor={t.colors.secondaryTextOnSurface} />
      <Text variant="bodyMedium">{label}</Text>
    </View>
  ))}
</RadioButton.Group>`}</CodeSnippet>
          </Section>

          <Section id="p-segmented" title="Segmented Control" stack="rn" description="Toggle between 2-3 options. Selected segment: surface bg + primary text. Unselected: background bg + secondaryText.">
            <ComponentSpec name="3 segments">
              <SegmentedControlDemo />
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/SegmentedControl.tsx (new file)"
              note="3-segment toggle with rounded outer corners only (10px), shared 1px outline. Selected segment uses surface bg, others use background."
            >{`import { Pressable, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { RBTheme } from 'theme'

type Props<T extends string> = {
  options: { value: T; label: string }[]
  value: T
  onValueChange: (v: T) => void
}

export default function SegmentedControl<T extends string>({ options, value, onValueChange }: Props<T>) {
  const t = useTheme<RBTheme>()
  return (
    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
      {options.map((opt, i) => {
        const isSelected = opt.value === value
        const isFirst = i === 0
        const isLast = i === options.length - 1
        return (
          <Pressable
            key={opt.value}
            onPress={() => onValueChange(opt.value)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: isSelected ? t.colors.surface : t.colors.background,
              borderWidth: 1,
              borderColor: t.colors.outline,
              borderLeftWidth: isFirst ? 1 : 0,
              borderTopLeftRadius: isFirst ? 10 : 0,
              borderBottomLeftRadius: isFirst ? 10 : 0,
              borderTopRightRadius: isLast ? 10 : 0,
              borderBottomRightRadius: isLast ? 10 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                fontWeight: isSelected ? '500' : '450',
                color: isSelected ? t.colors.onSurface : t.colors.secondaryText,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="p-choice-tile" title="Choice Tile" stack="rn" description="Selectable card with label + checkbox on the right. Multi-select pattern (e.g. feedback reasons, onboarding preferences). Default = no border, selected = 1px primary border.">
            <ComponentSpec name="3 options · multi-select">
              <ChoiceTileDemo />
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/ChoiceTile.tsx (new file)"
              note="Reuses the Checkbox component from above. 56h row with 12px radius, primary border on selected state. Use as a controlled list — parent owns the Set of selected values."
            >{`import { Pressable, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { Check } from 'lucide-react-native'
import { RBTheme } from 'theme'

type Props = {
  label: string
  selected: boolean
  onToggle: () => void
  disabled?: boolean
}

export default function ChoiceTile({ label, selected, onToggle, disabled }: Props) {
  const t = useTheme<RBTheme>()
  return (
    <Pressable
      onPress={() => !disabled && onToggle()}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 16,
        height: 56,
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: selected ? t.colors.primary : 'transparent',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        variant="bodyMedium"
        style={{ flex: 1, color: disabled ? t.colors.outline : t.colors.onSurface }}
      >
        {label}
      </Text>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? t.colors.primary : t.colors.surface,
          borderWidth: 1,
          borderColor: selected ? t.colors.primary : t.colors.secondaryTextOnSurface,
        }}
      >
        {selected && <Check size={16} strokeWidth={3} color={t.colors.onPrimary} />}
      </View>
    </Pressable>
  )
}`}</CodeSnippet>
          </Section>

          {/* ═══ DISPLAY (live RN + Paper) ═══ */}

          <Section id="p-chip" title="Chip" stack="rn-paper" description="react-native-paper Chip — the native equivalent of pills/tags.">
            <ComponentSpec name="Default + selected">
              <PaperChipDemo />
            </ComponentSpec>
            <CodeSnippet
              path="react-native-paper · Chip"
              note="Override bg with backgroundOnSurface (#F8F8F8) — Paper's default surfaceVariant is sage in this theme."
            >{`import { Chip, useTheme } from 'react-native-paper'

const t = useTheme()

<Chip
  style={{ backgroundColor: t.colors.backgroundOnSurface }}
  textStyle={{ color: t.colors.onSurface }}
>
  Mindfulness
</Chip>

<Chip
  selected
  style={{ backgroundColor: t.colors.primary }}
  textStyle={{ color: t.colors.onPrimary }}
>
  Selected
</Chip>`}</CodeSnippet>
          </Section>

          <Section id="p-tag" title="Tag" stack="rn" description="Small label chip — different from Chip in that it's compact, non-interactive, and used for emotion/category labels.">
            <ComponentSpec name="Default">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {['Proud', 'Calm', 'Hopeful', 'Curious', 'Grateful'].map((label) => (
                  <View
                    key={label}
                    style={{
                      backgroundColor: 'rgb(248, 248, 248)',
                      borderRadius: 6,
                      paddingHorizontal: 6,
                      paddingVertical: 4,
                      height: 22,
                      justifyContent: 'center',
                    }}
                  >
                    <PaperText
                      variant="bodySmall"
                      style={{ fontSize: 13, lineHeight: 15, color: '#191C1A' }}
                    >
                      {label}
                    </PaperText>
                  </View>
                ))}
              </View>
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/Tag.tsx (new file)"
              note="Smaller and more compact than Chip — used inline in Journal Entry, Reflection, Insight cards for emotion labels."
            >{`import { View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { RBTheme } from 'theme'

export default function Tag({ label }: { label: string }) {
  const t = useTheme<RBTheme>()
  return (
    <View
      style={{
        backgroundColor: t.colors.backgroundOnSurface,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 4,
        height: 22,
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 13, lineHeight: 15, color: t.colors.onSurface }}>
        {label}
      </Text>
    </View>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="p-avatar" title="Avatar" stack="rn-paper" description="react-native-paper Avatar.Text. Three common sizes.">
            <ComponentSpec name="Sizes">
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <PaperAvatar.Text size={32} label="GG" />
                <PaperAvatar.Text size={48} label="GG" />
                <PaperAvatar.Text size={64} label="GG" />
              </View>
            </ComponentSpec>
            <CodeSnippet
              path="react-native-paper · Avatar"
              note="Avatar.Text for initials (default uses primary bg + onPrimary text). Use Avatar.Image when you have a photo URL."
            >{`import { Avatar } from 'react-native-paper'

<Avatar.Text size={32} label="GG" />
<Avatar.Text size={48} label="GG" />
<Avatar.Text size={64} label="GG" />

<Avatar.Image size={48} source={{ uri: photoUrl }} />`}</CodeSnippet>
          </Section>

          <Section id="p-activity" title="Activity Indicator" stack="rn-paper" description="react-native-paper ActivityIndicator (Material spinner).">
            <ComponentSpec name="Sizes">
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" />
                <ActivityIndicator size="large" />
              </View>
            </ComponentSpec>
            <CodeSnippet path="react-native-paper · ActivityIndicator">{`import { ActivityIndicator } from 'react-native-paper'

<ActivityIndicator size="small" />
<ActivityIndicator size="large" />
<ActivityIndicator animating={loading} color={theme.colors.primary} />`}</CodeSnippet>
          </Section>

          <Section id="p-progress" title="Progress Bar" stack="rn-paper" description="react-native-paper ProgressBar. Used in onboarding and weekly report progress.">
            <ComponentSpec name="60% complete">
              <PaperProgressDemo />
            </ComponentSpec>
            <CodeSnippet
              path="react-native-paper · ProgressBar"
              note="Override `style.backgroundColor` to outlineLight — Paper's default track is sage surfaceVariant in this theme."
            >{`import { ProgressBar, useTheme } from 'react-native-paper'

const t = useTheme()

<ProgressBar
  progress={0.6}
  color={t.colors.primary}
  style={{ backgroundColor: t.colors.outlineLight }}
/>`}</CodeSnippet>
          </Section>

          <Section id="p-grouped-list" title="Grouped List" stack="rn" description="Settings-style list of rows in a grouped card. Each row has label on left, optional accessory on right (chevron, label, switch).">
            <ComponentSpec name="Standard rows">
              <GroupedListDemo />
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/GroupedList.tsx (new file)"
              note="Each row: 56h, padding 8/16, separator line in backgroundOnSurface between siblings. Accessory variants: chevron (navigate), label+chevron (selected value), switch (toggle), none (action row). Wraps existing Switch from above."
            >{`import { Pressable, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { ChevronRight } from 'lucide-react-native'
import { RBTheme } from 'theme'
import Switch from './Switch'

type RowAccessory =
  | { kind: 'chevron' }
  | { kind: 'label'; value: string }
  | { kind: 'switch'; value: boolean; onValueChange: (v: boolean) => void }
  | { kind: 'none' }

type Row = {
  label: string
  accessory?: RowAccessory
  onPress?: () => void
}

export function GroupedList({ rows }: { rows: Row[] }) {
  const t = useTheme<RBTheme>()
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {rows.map((row, i) => (
        <Pressable
          key={i}
          onPress={row.onPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 8,
            minHeight: 56,
            borderTopWidth: i > 0 ? 1 : 0,
            borderTopColor: t.colors.backgroundOnSurface,
          }}
        >
          <Text variant="bodyMedium" style={{ color: t.colors.onSurface }}>
            {row.label}
          </Text>
          <Accessory accessory={row.accessory} />
        </Pressable>
      ))}
    </View>
  )
}

function Accessory({ accessory }: { accessory?: RowAccessory }) {
  const t = useTheme<RBTheme>()
  if (!accessory || accessory.kind === 'none') return null
  if (accessory.kind === 'chevron') {
    return <ChevronRight size={20} color={t.colors.secondaryText} />
  }
  if (accessory.kind === 'label') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text variant="bodyMedium" style={{ color: t.colors.secondaryTextOnSurface }}>
          {accessory.value}
        </Text>
        <ChevronRight size={20} color={t.colors.secondaryText} />
      </View>
    )
  }
  if (accessory.kind === 'switch') {
    return <Switch value={accessory.value} onValueChange={accessory.onValueChange} />
  }
  return null
}`}</CodeSnippet>
          </Section>

          {/* ═══ SURFACES & NAVIGATION ═══ */}

          <Section id="bottom-sheet" title="Bottom Sheet" stack="rn" description="Modal sheet that slides up from the bottom. Always uses a symbol from the design system — never an emoji. Single-button variant for confirmations and feature intros; two-button variant for choice flows. Native uses the Modalize package.">
            <ComponentSpec>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                <BottomSheetDemo
                  sticker={<img src={roseLogo} width={56} height={56} alt="" />}
                  title="Bloom with 15% off applied!"
                  body="Your Rosebud Bloom subscription now includes a 15% discount. Enjoy more growth for less."
                  ctaLabel="Enjoy Rosebud"
                />
                <BottomSheetDemo
                  sticker={
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 999,
                        backgroundColor: '#97F7B7',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageCircleQuestion size={36} strokeWidth={1.8} color="#00210F" />
                    </View>
                  }
                  title="Ask Rosebud"
                  body="Personal companions that match your mood and voice to guide your journaling."
                  ctaLabel="Try out"
                  secondaryCtaLabel="Later"
                />
              </div>
            </ComponentSpec>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native uses Modalize</PathTag>
            </p>
            <CodeSnippet
              path="apps/native — Modalize wrapper"
              note="Native uses `react-native-modalize`. The visual layout below is what's inside the sheet — drop into a Modalize children prop, or recreate as a standalone component if Modalize isn't available."
            >{`import { Modalize } from 'react-native-modalize'
import { View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { RBTheme } from 'theme'

type Props = {
  visible: boolean
  onClose: () => void
  sticker: React.ReactNode      // SVG illustration, NOT emoji
  title: string
  body: string
  ctaLabel: string
  secondaryCtaLabel?: string    // when given, renders a 2-button row
  onCta: () => void
  onSecondaryCta?: () => void
}

export default function BottomSheet({ visible, onClose, sticker, title, body, ctaLabel, secondaryCtaLabel, onCta, onSecondaryCta }: Props) {
  const t = useTheme<RBTheme>()
  return (
    <Modalize
      onClose={onClose}
      adjustToContentHeight
      modalStyle={{ backgroundColor: t.colors.background, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      handleStyle={{ backgroundColor: t.colors.outline, width: 36, height: 4, borderRadius: 999 }}
    >
      <View style={{ padding: 32, paddingTop: 24, paddingBottom: 48, gap: 32 }}>
        <View style={{ alignItems: 'center', gap: 24 }}>
          {sticker}
          <View style={{ alignSelf: 'stretch', gap: 12 }}>
            <Text variant="displaySmall" style={{ color: t.colors.onSurface, textAlign: 'center' }}>{title}</Text>
            <Text variant="bodyMedium" style={{ color: t.colors.onSurface, textAlign: 'center' }}>{body}</Text>
          </View>
        </View>
        {secondaryCtaLabel ? (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button mode="outlined" onPress={onSecondaryCta} style={{ flex: 1, borderRadius: 12 }}>{secondaryCtaLabel}</Button>
            <Button mode="contained" onPress={onCta} style={{ flex: 1, borderRadius: 12 }}>{ctaLabel}</Button>
          </View>
        ) : (
          <Button mode="contained" onPress={onCta} style={{ borderRadius: 12 }}>{ctaLabel}</Button>
        )}
      </View>
    </Modalize>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="bottom-nav" title="Bottom Nav" stack="rn" description="Tab bar at the bottom of every screen. Mirrors apps/native AppTabBar.">
            <ComponentSpec name="5 tabs · click to change active · Insights badge">
              <BottomNavDemo />
            </ComponentSpec>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/components/AppTabBar</PathTag>
            </p>
          </Section>

          <Section id="p-dialog" title="Dialog" stack="rn-paper" description="Compact system-alert with icon + title + body + 2 buttons. Surface bg, 10px radius, 320w, 1px outlineLight separator between header and body. Tight padding for an iOS-alert feel.">
            <ComponentSpec name="Confirmation">
              <DialogDemo />
            </ComponentSpec>
            <CodeSnippet
              path="react-native-paper · Dialog (or custom)"
              note="Paper has Dialog/Dialog.Title/Dialog.Content/Dialog.Actions but defaults differ from Figma. The visual below mirrors Figma exactly — wrap in Paper Portal+Modal for the overlay layer."
            >{`import { Portal, Dialog, Button, Text, useTheme } from 'react-native-paper'
import { View } from 'react-native'
import { Bell } from 'lucide-react-native'

export function ConfirmDialog({ visible, onDismiss, onConfirm, title, body, cancelLabel, confirmLabel }) {
  const t = useTheme()
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: t.colors.surface, borderRadius: 10 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24, paddingVertical: 12 }}>
          <Bell size={20} color={t.colors.primary} />
          <Text variant="titleSmall" style={{ flex: 1, color: t.colors.onSurface, fontWeight: '500' }}>
            {title}
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: t.colors.outlineLight }} />
        <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <Text variant="bodySmall" style={{ color: t.colors.onSurface }}>
            {body}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 24, paddingBottom: 24 }}>
          <Button mode="outlined" onPress={onDismiss} style={{ flex: 1, borderRadius: 8 }}>
            {cancelLabel}
          </Button>
          <Button mode="contained" onPress={onConfirm} style={{ flex: 1, borderRadius: 8 }}>
            {confirmLabel}
          </Button>
        </View>
      </Dialog>
    </Portal>
  )
}`}</CodeSnippet>
          </Section>

          {/* ═══ PICKERS ═══ */}

          <Section id="p-datepicker" title="Date Picker" stack="rn" description="Calendar grid for picking a date. Native uses iOS DateTimePicker inside a Modalize bottom sheet.">
            <ComponentSpec name="June · click any day">
              <DatePickerDemo />
            </ComponentSpec>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/components/DatePickerModal.tsx</PathTag>
            </p>
          </Section>

          <Section id="p-timepicker" title="Time Picker" stack="rn" description="iOS-style wheel time picker. Native presents the system DateTimePicker inside a bottom sheet — this is a visual mock of the wheel UI.">
            <ComponentSpec name="9:00 AM">
              <TimePickerDemo />
            </ComponentSpec>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/components/TimePicker.tsx</PathTag>
            </p>
          </Section>

          <Section id="p-weekdaypicker" title="Weekday Picker" stack="rn" description="Horizontal row of 7 days for navigating to a specific day. Selected day = filled circle, days with entries = checkmark, empty = stroke circle.">
            <ComponentSpec name="Click to select · Tu/We have entries · Th is today">
              <WeekdayPickerDemo />
            </ComponentSpec>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/native/src/components/WeekDayPicker.tsx</PathTag>
            </p>
          </Section>

          {/* ═══ FEEDBACK (Snackbar / Toast) ═══ */}

          <Section id="p-snackbar" title="Snackbar" stack="rn-paper" description="Persistent banner with icon + message. 4 types: info / success / warning / error. Bg primary (#000), white text, 12px radius, padding 12, drop shadow.">
            <ComponentSpec name="4 types">
              <View style={{ gap: 8 }}>
                <SnackbarDemo type="info" message="This is information bar. Just piece of info." />
                <SnackbarDemo type="success" message="Success! You performed an action successfully!" />
                <SnackbarDemo type="warning" message="This is warning state, pay attention to what happened." />
                <SnackbarDemo type="error" message="An error occurred. Please try again." />
              </View>
            </ComponentSpec>
            <CodeSnippet
              path="react-native-paper · Snackbar"
              note="Wraps Paper's Snackbar with Rosebud's themed bg + icon mapping. Production uses MaterialCommunityIcons; this demo uses lucide for the same visual."
            >{`import { Snackbar, Text, useTheme } from 'react-native-paper'
import { View } from 'react-native'
import { Info, CheckCircle2, TriangleAlert, XCircle } from 'lucide-react-native'

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: XCircle,
}

export function RBSnackbar({ visible, onDismiss, type = 'info', message }) {
  const t = useTheme()
  const Icon = ICONS[type]
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: t.colors.primary, borderRadius: 12 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon size={20} color={t.colors.onPrimary} strokeWidth={2} />
        <Text style={{ color: t.colors.onPrimary, fontSize: 16, lineHeight: 22 }}>
          {message}
        </Text>
      </View>
    </Snackbar>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="p-infobar" title="Infobar" stack="rn" description="Light banner alert with icon + body. 4 types matching Snackbar but with surface (white) bg + onSurface text — for less interruptive contextual messages.">
            <ComponentSpec name="4 types">
              <View style={{ gap: 8 }}>
                <InfobarDemo type="info" body="Voice transcription is set up. It allows you to capture your speech with clarity and precision." />
                <InfobarDemo type="success" body="Your changes have been saved." />
                <InfobarDemo type="warning" body="Your microphone permission is set to ask each time." />
                <InfobarDemo type="error" body="Transcription can hallucinate and add words during silence. Make sure your mic is on and speak clearly." />
              </View>
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/Infobar.tsx (new file)"
              note="Light variant of Snackbar — surface bg + onSurface text. Use for contextual messages that aren't transient (e.g. inline tips, transcription warnings)."
            >{`import { View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { Info, CheckCircle2, TriangleAlert, XCircle } from 'lucide-react-native'
import { RBTheme } from 'theme'

const ICONS = {
  info: { Icon: Info, color: '#0A84FF' },
  success: { Icon: CheckCircle2, color: '#207B00' },
  warning: { Icon: TriangleAlert, color: '#D97706' },
  error: { Icon: XCircle, color: '#BA1A1A' },
}

type Props = { type: 'info' | 'success' | 'warning' | 'error'; body: string }

export default function Infobar({ type, body }: Props) {
  const t = useTheme<RBTheme>()
  const { Icon, color } = ICONS[type]
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Icon size={20} color={color} strokeWidth={2} />
      <Text variant="bodySmall" style={{ flex: 1, color: t.colors.onSurface, fontSize: 12, lineHeight: 16 }}>
        {body}
      </Text>
    </View>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="p-toast" title="Toast" stack="rn" description="Lighter-weight transient notification — text-only, no icon. Same dark surface as Snackbar but simpler content.">
            <ComponentSpec name="Default">
              <View
                style={{
                  backgroundColor: '#000000',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.16,
                  shadowRadius: 16,
                  elevation: 6,
                  alignSelf: 'flex-start',
                }}
              >
                <PaperText
                  variant="titleMedium"
                  style={{ fontSize: 16, lineHeight: 22, color: '#FFFFFF' }}
                >
                  Success! Your changes have been saved.
                </PaperText>
              </View>
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/Toast.tsx (new file)"
              note="Toasts are typically auto-dismissed after 2-3s. Use a Modal or react-native-toast-message library for the timing layer."
            >{`import { View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { RBTheme } from 'theme'

export default function Toast({ message }: { message: string }) {
  const t = useTheme<RBTheme>()
  return (
    <View
      style={{
        backgroundColor: t.colors.primary,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      <Text style={{ fontSize: 16, lineHeight: 22, color: t.colors.onPrimary }}>
        {message}
      </Text>
    </View>
  )
}`}</CodeSnippet>
          </Section>

          <Section id="p-tooltip" title="Tooltip" stack="rn" description="Coachmark-style tooltip with title + step counter + body + Next button. Used in onboarding tours. Surface bg, 12px radius, drop shadow.">
            <ComponentSpec name="Coachmark · 1 of 6">
              <TooltipDemo
                title="Quick tour"
                step="1 / 6"
                body={'This is your daily space to reflect,\nset intentions, and stay on top of your goals.'}
                ctaLabel="Next"
              />
            </ComponentSpec>
            <CodeSnippet
              path="apps/native/src/components/Coachmark.tsx (new file)"
              note="Use within an onboarding overlay (Modal + dim backdrop). Anchor to a target element with a small caret/triangle pointing down."
            >{`import { View } from 'react-native'
import { Text, Button, useTheme } from 'react-native-paper'
import { RBTheme } from 'theme'

type Props = {
  title: string
  step?: string                // e.g. '1 / 6'
  body: string
  ctaLabel: string
  onNext: () => void
}

export default function Coachmark({ title, step, body, ctaLabel, onNext }: Props) {
  const t = useTheme<RBTheme>()
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        gap: 9,
        alignItems: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      <View style={{ alignSelf: 'stretch', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text variant="titleLarge" style={{ color: t.colors.onSurface }}>{title}</Text>
          {step && <Text variant="labelLarge" style={{ color: t.colors.secondaryText }}>{step}</Text>}
        </View>
        <Text variant="bodySmall" style={{ color: t.colors.onSurface }}>{body}</Text>
      </View>
      <Button mode="text" onPress={onNext} labelStyle={{ fontSize: 16, fontWeight: '500' }}>
        {ctaLabel}
      </Button>
    </View>
  )
}`}</CodeSnippet>
          </Section>

          {/* ═══ DISPLAY ═══ */}

          <Section id="cards" title="Cards" description="Versatile containers grouping content and actions. 47 components across entries, stats, prompts, insights, personas, and more.">
            <SubSection title="Journal Entry">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] max-w-[850px]">
                <JournalEntry
                  emoji="🌻" title="Getting Back To Healthy Routine"
                  body="Today began with the soft glow of dawn filtering through my curtains, casting gentle rays across the room. I started the morning with coffee, savoring the warmth as I watched the world wake up outside the window."
                  time="12:08"
                  emotions={[{ emoji: '😊', label: 'Joy' }, { emoji: '🙏', label: 'Grateful' }]}
                />
                <EntryDraftCard title="Evening reflection" body="Started thinking about what went well today..." time="3 min ago" />
              </div>
            </SubSection>

            <SubSection title="Value Cards">
              <div className="flex flex-wrap gap-[16px]">
                <ValueCard label="Entries" value="272" size="M" className="w-[200px]" />
                <ValueCard label="Streak" value="3" icon="🔥" size="M" className="w-[200px]" />
                <ValueCard label="This week" value="5" size="S" className="w-[160px]" />
                <ValueCard label="Mood avg" value="4.2" icon="😊" size="S" className="w-[160px]" />
              </div>
            </SubSection>

            <SubSection title="Streak">
              <div className="max-w-[420px]">
                <StreakCard count={3} activeDays={3} />
              </div>
            </SubSection>

            <SubSection title="Daily Prompt">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] max-w-[850px]">
                <DailyPromptCard
                  title="What are you grateful for today?"
                  body="Take a moment to reflect on the small things that brought you joy."
                />
                <DailyPromptCard
                  title="How has my emotional state evolved?"
                  body="Over the past week, your emotional state has shown a positive trend."
                  bookmarked
                />
              </div>
            </SubSection>

            <SubSection title="Emotional Landscape">
              <div className="max-w-[420px]">
                <EmotionalLandscapeCard emotions={[
                  { label: 'Joy', value: 8 }, { label: 'Calm', value: 6 }, { label: 'Anxiety', value: 3 },
                  { label: 'Gratitude', value: 7 }, { label: 'Sadness', value: 2 }, { label: 'Hope', value: 5 },
                ]} />
              </div>
            </SubSection>

            <SubSection title="Key Themes">
              <div className="max-w-[420px]">
                <KeyThemeCard
                  subtitle="Personal Growth & Environment"
                  themes={['Personal Growth', 'Relationships', 'Self-care', 'Career', 'Mindfulness']}
                />
              </div>
            </SubSection>

            <SubSection title="Reflection / Insight / Haiku">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                <ReflectionCard
                  body="Daring to set boundaries is about having the courage to love ourselves, even when we risk disappointing others."
                />
                <InsightCard
                  body="Your reflections about setting clear goals show a pattern of growth over the last two weeks."
                />
                <HaikuCard lines={['Morning light breaks through', 'Gentle warmth upon my face', 'A new day begins']} />
              </div>
            </SubSection>

            <SubSection title="Quote">
              <div className="max-w-[420px]">
                <QuoteCard
                  quote="The only way to do great work is to love what you do."
                  author="Steve Jobs"
                />
              </div>
            </SubSection>

            <SubSection title="Ask Rosebud">
              <div className="max-w-[420px]">
                <AskRosebudCard
                  date="June 14"
                  time="12:08"
                  question="How has my emotional state evolved?"
                  answer="Over the past month, your emotional state has shown a pattern of increasing calm and fewer instances of stress."
                />
              </div>
            </SubSection>

            <SubSection title="Goals / To-do">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] max-w-[850px]">
                <GoalsCard type="Todo" title="Daily habits" items={[
                  { label: 'Morning journal entry', done: true },
                  { label: 'Practice gratitude', done: true },
                  { label: 'Evening reflection', done: false },
                  { label: '10 min meditation', done: false },
                ]} />
                <GoalsCard type="Goals" title="This month" items={[
                  { label: 'Write 20 journal entries', done: false },
                  { label: 'Complete gratitude challenge', done: false },
                  { label: 'Try 3 new guided journals', done: true },
                ]} />
              </div>
            </SubSection>

            <SubSection title="Persona Card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                <PersonaCard name="Rosebud" description="Your personal AI journaling companion" type="Default" />
                <PersonaCard name="Mindful Coach" description="Guided meditation and breathing exercises" type="Community" />
                <PersonaCard name="My Custom Guide" description="Personalized prompts for self-discovery" type="Custom" />
              </div>
            </SubSection>

            <SubSection title="Feedback Prompt">
              <div className="max-w-[420px]">
                <FeedbackPromptCard questions={[
                  'What lessons does this teach me about myself?',
                  'How has my emotional state evolved?',
                  'What patterns do I see repeated in my life?',
                ]} />
              </div>
            </SubSection>

            <SubSection title="Locked / Upgrade">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] max-w-[850px]">
                <WeeklyReportLocked />
                <UpgradeCard title="Unlock with Bloom" body="Unlock Rosebud's full potential and gain deeper insight into your patterns." />
                <LockedFeatureCard
                  title="Unlock Ask Rosebud"
                  progress={0.3}
                  footer="Requires at least 1,500 words."
                />
                <GratitudeChallengeCard subtitle="Build a daily gratitude habit" ctaLabel="View challenge" daysCompleted={3} />
              </div>
            </SubSection>

            <SubSection title="Base Card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                <Card>
                  <h4 className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)] mb-[8px]">Card title</h4>
                  <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text)]">
                    Base card container for custom content.
                  </p>
                </Card>
                <Card>
                  <div className="flex items-center gap-[12px] mb-[12px]">
                    <Avatar name="Rosebud AI" size="sm" />
                    <div>
                      <p className="text-[14px] leading-[20px] font-[500] text-[var(--color-on-surface)]">Rosebud AI</p>
                      <p className="text-[12px] leading-[16px] text-[var(--color-secondary-text)]">Just now</p>
                    </div>
                  </div>
                  <p className="text-[15px] leading-[20px] text-[var(--color-on-surface)]">
                    How are you feeling today?
                  </p>
                </Card>
                <Card>
                  <div className="flex flex-wrap gap-[6px] mb-[12px]">
                    <Tag>Gratitude</Tag>
                    <Tag>Daily</Tag>
                  </div>
                  <h4 className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)] mb-[4px]">Daily Prompt</h4>
                  <p className="text-[15px] leading-[20px] text-[var(--color-secondary-text)]">
                    What are three things you&apos;re grateful for?
                  </p>
                </Card>
              </div>
            </SubSection>
          </Section>
          {/* ═══ ASSETS ═══ */}

          <Section id="icons" title="Icons" description="144 UI icons extracted from Figma. All SVGs, optimized for 20×20.">
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-[8px]">
              {[
                'add-friends','ai','ai-fill','arrow-down','arrow-left','arrow-right','arrow-up','article',
                'ask-rosebud','bell','bookmark','bookmark-filled','brain','calendar','checkmark','checkmark-circle',
                'chevron-down','chevron-left','chevron-right','chevron-up','clock','copy','crossmark','delete',
                'download','envelope','error-circle','explore','feather','fire','fire-filled','flag','flower',
                'globe','grid','heart','heart-filled','home','hourglass','image','inbox','info','info-filled',
                'insights-light-bulb','insights-sparkle','lock','long-term-memory','mic','minus','moon',
                'pause-circle','person','person-fill','persona-switch','phone','play-circle','play-filled',
                'plus','popper','proverbs','queue','quote','radio-button-empty','radio-button-full','refresh',
                'remove','reply','scan','search','settings','share','shuffle','sliders','soundwave','speed',
                'star','star-filled','stop-circle','sun','surprise-me-dice','surprise-me-sparkles','target',
                'text-to-image','thumb-down','thumb-down-filled','thumb-up','thumb-up-filled','trophy',
                'volume-0','volume-1','volume-2','warning','warning-triangle','weekly-report','weekly-star',
                'wisdom','write','x-circle',
              ].map((name) => (
                <div key={name} className="group flex flex-col items-center gap-[4px]">
                  <div className="w-[40px] h-[40px] rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex items-center justify-center group-hover:border-[var(--color-outline)] transition-colors">
                    <img src={new URL(`../icons/${name}.svg`, import.meta.url).href} alt={name} className="w-[20px] h-[20px] icon-dark-invert" loading="lazy" />
                  </div>
                  <span className="text-[9px] leading-[12px] text-[var(--color-secondary-text)] text-center truncate w-full">{name}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="symbols" title="Symbols" description="268 illustrated symbols across 14 categories.">
            {[
              ['Emotes', 'emotes', ['joy','anger','fear','love','sadness','surprise','mood-unimpressed','mood-pleasant','mood-meh','heart','hand-wave','muscle']],
              ['Lifestyle & Recreation', 'lifestyle', ['airplane','alarmclock','baby','backpack','bandage','baseketball','beach-ball','bed','bicycle','birthday','birthday-2','broom','calendar','car','celebrate','chef-hat','chess-black','chess-white','chips','chips-bag','cocktail','coffee','cooking','desk-lamp','dessert','engagement-ring','file-cabinet','first-home','fishing-pole','food','gardening','gift-blue','gift-red','gift-yellow','goldfish-bowl','grad-cap-black','grad-cap-blue','grad-cap-purple','grilling','groceries','guitar','hiking-boot','house','ice-cube','key','laundry','leisure','medicine','microscope','moving-1','moving-2','moving-3','newspaper','password','piano','picnic','pregnancy-test','puzzle-piece','red-dice','red-dice-2','romantic-dinner','saxophone','scale','shopping-cart','shower','skateboard','soccer-ball','stethescope','telescope','thermometer','thermometer-2','toothbrush','trash-can','trophy','tv','umbrella','white-dice','white-dice-2','yoga-mat']],
              ['Multimedia & Electronics', 'multimedia', ['battery-full','battery-low','battery-mid','calculator','camera','charging-phone','image','laptop','microphone','music','phone','smartwatch','tablet','tablet-2','tablet-3','tv','video-game-controller','volume','wifi']],
              ['Nature & Landmarks', 'nature', ['apple','autumn-leaf','banana','bird','bridge','cat','cloud-gray','cloud-white','dog','fire','fullmoon','horse','moon','mountain','orange','palm-tree','pathway','pumpkin','rabbit','rain','snowflake','snowflake-2','spring-bloom','sprout','star','sun','tornado','vegetables','water','wind']],
              ['Communication', 'communication', ['chat','email','envelope','negative-talk','negative-thought','question']],
              ['Relationships', 'relationships', ['family','guide','handshake','heart-hands','hug','romance']],
              ['Business & Finance', 'business', ['briefcase','bullseye','chart-up','digital-payment','job-interview','money','office-building','pie-chart','scales','steps','wallet','wallet-2']],
              ['Art & Creativity', 'art', ['book','colors','colorwheel','customjournal','journal','palette','pencil','venn']],
              ['Health & Mind', 'health', ['caduceus','head-refresh','head-star','head-swirl','headache','health','meditation','mood']],
              ['System', 'system', ['ask-rosebud-bolt','ask-rosebud-logo','ask-rosebud-scan','before-after','bell','biometric','biometric-2','chainlink','checkbox','cog','gauge','gauge-2','globe','settingssliders','sliders','terminal','text-input','wrench']],
              ['Misc', 'misc', ['anchor','arrow-down-green','arrow-down-red','brain','broken-chain','compass','explosion','footprint','funeral','funeral-2','greenflag','hourglass-begin','hourglass-end','life-preserver','lightbulb','lightbulb-white','lock','magnifyingglass','not-allowed','reflection','refresh-green','refresh-red','shield','sparkle','stopwatch','swirl','yinyang']],
              ['Social Media', 'social-media', ['discord','facebook','instagram','tiktok','x']],
              ['Transportation', 'transportation', ['gas-station','motorcycle','parking-meter','suitcase','taxi','traffic-light','train','train-2']],
              ['Seasonal', 'seasonal', ['bat','black-cat','candy-cane-green','candy-cane-purple','candy-cane-red','candy-cane-traditional','candy-corn','cauldron','christmas-ornament','christmas-stocking','christmas-tree','christmas-trees-topper','christmas-wreath','dreidel','fireplace','ghost','jack-o-lantern','kinara','magic-wand','menorah','mistletoe','santa-hat','skull','sleigh','snowman','spider','spider-web','tombstone','vampire','witch-hat']],
            ].map(([title, dir, items]) => (
              <SubSection key={dir} title={`${title} (${items.length})`}>
                <div className="flex flex-wrap gap-[10px]">
                  {items.map((name) => (
                    <div key={name} className="flex flex-col items-center gap-[4px]">
                      <div className="w-[44px] h-[44px] rounded-[10px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex items-center justify-center p-[5px]">
                        <img src={new URL(`../symbols/${dir}/${name}.svg`, import.meta.url).href} alt={name} className="w-full h-full object-contain" loading="lazy" />
                      </div>
                      <span className="text-[9px] leading-[12px] text-[var(--color-secondary-text)] text-center max-w-[52px] truncate">{name}</span>
                    </div>
                  ))}
                </div>
              </SubSection>
            ))}
          </Section>

          <Section id="illustrations" title="Illustrations" description="100 illustrations: guided journals, custom journal icons (color + B&W), mood ratings, and achievement badges.">
            <SubSection title="Guided Journals">
              <div className="flex flex-wrap gap-[16px]">
                {['dream','goals','ifs','positive-psychology','gratitude','act','cbt','ipf','boundaries','conversation-prep','communication-breakdown','conflict','morning-intention','reframing','rose-bud-thorn','fathers-day','cfs','pinwheel','weekly-relationship','new-years-compass'].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-[6px]">
                    <div className="w-[72px] h-[72px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex items-center justify-center p-[8px]">
                      <img src={new URL(`../illustrations/${name}.svg`, import.meta.url).href} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <span className="text-[10px] leading-[13px] text-[var(--color-secondary-text)] text-center max-w-[72px]">{name}</span>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="Custom Journal Icons (Color)">
              <div className="flex flex-wrap gap-[16px]">
                {['anchor','arrow','butterfly','chef','compass','dove','dumbbells','eye','feather','heart','hourglass','infinity','key','light-bulb-1','light-bulb-2','lotus','mandala','moon','mountains','phoenix','spirit-catcher','stars','sun','trees','videogame','wave','yin-yang','zap'].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-[6px]">
                    <div className="w-[64px] h-[64px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex items-center justify-center p-[8px]">
                      <img src={new URL(`../illustrations/${name}.svg`, import.meta.url).href} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <span className="text-[10px] leading-[13px] text-[var(--color-secondary-text)] text-center max-w-[64px]">{name}</span>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="Custom Journal Icons (B&W)">
              <div className="flex flex-wrap gap-[16px]">
                {['anchor-bw','arrow-bw','butterfly-bw','chef-bw','compass-bw','dove-bw','dumbbells-bw','eye-bw','feather-bw','heart-bw','hourglass-bw','infinity-bw','key-bw','light-bulb-bw','lotus-bw','mandala-bw','moon-bw','mountains-bw','music-bw','palette-bw','phoenix-bw','spirit-catcher-bw','stars-bw','sun-bw','trees-bw','videogame-bw','wave-bw','yin-yang-bw','zap-bw'].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-[6px]">
                    <div className="w-[64px] h-[64px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex items-center justify-center p-[8px]">
                      <img src={new URL(`../illustrations/${name}.svg`, import.meta.url).href} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <span className="text-[10px] leading-[13px] text-[var(--color-secondary-text)] text-center max-w-[64px]">{name}</span>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="Mood Ratings">
              <div className="flex flex-wrap gap-[16px]">
                {['smiley-1','smiley-2','smiley-3','smiley-4','smiley-5','star-1','star-2','star-3','star-4','star-5','weather-1','weather-2','weather-3','weather-4','weather-5'].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-[6px]">
                    <div className="w-[56px] h-[56px] rounded-[10px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex items-center justify-center p-[6px]">
                      <img src={new URL(`../illustrations/${name}.svg`, import.meta.url).href} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <span className="text-[10px] leading-[13px] text-[var(--color-secondary-text)] text-center">{name}</span>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="Achievement Badges">
              <div className="flex flex-wrap gap-[16px]">
                {['climbers-compass','collectors-curio','devotees-diary-brown-gem','keepers-torch','wordsmiths-quill'].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-[6px]">
                    <div className="w-[72px] h-[72px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex items-center justify-center p-[8px]">
                      <img src={new URL(`../illustrations/${name}.svg`, import.meta.url).href} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <span className="text-[10px] leading-[13px] text-[var(--color-secondary-text)] text-center max-w-[72px]">{name}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          <Section id="branding" title="Branding & Logos" description="Logo variants for different contexts and backgrounds.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {[
                ['logo-icon-color', 'Icon — Color', 'bg-[var(--color-surface)]'],
                ['logo-icon-white', 'Icon — White', 'bg-[#191C1A]'],
                ['logo-icon-green', 'Icon — Green', 'bg-[var(--color-surface)]'],
                ['logo-horizontal-color', 'Horizontal — Color', 'bg-[var(--color-surface)]'],
                ['logo-horizontal-white', 'Horizontal — White', 'bg-[#191C1A]'],
              ].map(([file, label, bg]) => (
                <div key={file} className="flex flex-col gap-[8px]">
                  <div className={`${bg} rounded-[12px] border border-[var(--color-outline-light)] p-[24px] flex items-center justify-center min-h-[100px]`}>
                    <img src={new URL(`../branding/${file}.svg`, import.meta.url).href} alt={label} className="max-h-[64px] object-contain" loading="lazy" />
                  </div>
                  <span className="text-[12px] text-[var(--color-secondary-text)]">{label}</span>
                </div>
              ))}
            </div>
          </Section>

        </main>
      </div>

      <footer className="border-t border-[var(--color-outline-light)] py-[32px] text-center text-[12px] text-[var(--color-secondary-text)]">
        Rosebud Design System &middot; Sourced from rosebud-react/apps/native &middot; {new Date().getFullYear()}
      </footer>
    </div>
    </PaperProvider>
  );
}

/* ── Per-component RN+Paper demo helpers (each holds its own state) ── */

function PaperButtonModesDemo() {
  // Match apps/native/src/components/Button.tsx + Figma:
  // 12px radius, 48px height, label Circular Medium 16/22.
  // Outlined uses outlineVariant (#C9CAC9) — neutral, not sage.
  // Elevated overrides Paper's sage-tinted elevation.level1 with surface.
  const t = usePaperTheme();
  const shared = {
    style: { borderRadius: 12 },
    contentStyle: { height: 48 },
    labelStyle: { fontSize: 16, fontWeight: '500' },
  };
  const outlinedTheme = { colors: { ...t.colors, outline: t.colors.outlineVariant } };
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <PaperButton mode="contained" {...shared}>Contained</PaperButton>
      <PaperButton mode="outlined" theme={outlinedTheme} {...shared}>Outlined</PaperButton>
      <PaperButton mode="text" {...shared}>Text</PaperButton>
      <PaperButton mode="elevated" buttonColor={t.colors.surface} {...shared}>Elevated</PaperButton>
      <PaperButton mode="contained-tonal" {...shared}>Contained-tonal</PaperButton>
    </View>
  );
}

// Matches Figma Input 5597:7818 + apps/native FormTextInput.tsx:
// - bg surface, 12px radius, 56px height (16h × 16h padding),
//   Body Medium W06 (16/22) text
// - At rest: NO outline (Figma 5597:7822). On focus: 1px outlineLight stroke
//   (Figma 5597:7819 active state, fill_4ZCFGJ #DEDEDE)
// - Label above (production FormTextInput pattern), description below in
//   secondaryText (subtle help)
function PaperTextInputDemo({ label, placeholder, description }) {
  const [val, setVal] = useState('');
  const t = usePaperTheme();
  return (
    <View style={{ width: '100%' }}>
      {label && (
        <PaperText
          variant="bodyMedium"
          style={{ color: t.colors.secondaryText, paddingVertical: 8, paddingHorizontal: 4 }}
        >
          {label}
        </PaperText>
      )}
      <PaperTextInput
        mode="outlined"
        placeholder={placeholder}
        value={val}
        onChangeText={setVal}
        style={{ backgroundColor: t.colors.surface }}
        outlineColor="transparent"
        activeOutlineColor={t.colors.outlineLight}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        contentStyle={{ borderRadius: 12, paddingHorizontal: 16, paddingVertical: 0 }}
        outlineStyle={{ borderWidth: 1, borderRadius: 12 }}
        placeholderTextColor={t.colors.secondaryTextOnSurface || t.colors.secondaryText}
        cursorColor={t.colors.primary}
      />
      {description && (
        <PaperText
          variant="bodySmall"
          style={{ color: t.colors.secondaryText, paddingTop: 8, paddingHorizontal: 4 }}
        >
          {description}
        </PaperText>
      )}
    </View>
  );
}

// Matches Figma Textarea 5597:7834:
// - bg surface, 12px radius, 120px height, padding 16px 16px 6px (top/sides
//   16, bottom 6 to leave room for the char counter row inside the field)
// - Body Medium W06 (16/22) text
// - At rest: no outline. On focus: 1px outlineLight stroke.
function PaperTextareaDemo({ placeholder, charLimit = 500 }) {
  const [val, setVal] = useState('');
  const t = usePaperTheme();
  return (
    <View style={{ width: '100%' }}>
      <PaperTextInput
        mode="outlined"
        placeholder={placeholder}
        value={val}
        onChangeText={(v) => setVal(v.slice(0, charLimit))}
        multiline
        numberOfLines={4}
        style={{ backgroundColor: t.colors.surface, minHeight: 120 }}
        outlineColor="transparent"
        activeOutlineColor={t.colors.outlineLight}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        contentStyle={{ borderRadius: 12, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 }}
        outlineStyle={{ borderWidth: 1, borderRadius: 12 }}
        placeholderTextColor={t.colors.secondaryTextOnSurface || t.colors.secondaryText}
        cursorColor={t.colors.primary}
      />
      <PaperText
        variant="labelMedium"
        style={{
          alignSelf: 'flex-end',
          paddingTop: 6,
          paddingRight: 4,
          color: t.colors.secondaryText,
        }}
      >
        {val.length} / {charLimit}
      </PaperText>
    </View>
  );
}

function PaperSearchbarDemo() {
  const [q, setQ] = useState('');
  const t = usePaperTheme();
  // Paper's default 'magnify' icon won't render because we stub
  // react-native-vector-icons. Provide lucide icons explicitly.
  return (
    <PaperSearchbar
      placeholder="Search entries…"
      value={q}
      onChangeText={setQ}
      elevation={0}
      icon={({ color, size }) => <Search size={size || 20} color={color || t.colors.onSurface} />}
      clearIcon={({ color, size }) => <XIcon size={size || 18} color={color || t.colors.onSurface} />}
      style={{ backgroundColor: t.colors.surface, borderWidth: 1, borderColor: t.colors.outlineLight, borderRadius: 12 }}
      inputStyle={{ color: t.colors.onSurface }}
      placeholderTextColor={t.colors.secondaryTextOnSurface || t.colors.secondaryText}
    />
  );
}

function PaperSwitchDemo() {
  const [on, setOn] = useState(true);
  const t = usePaperTheme();
  // Paper's MD3 Switch overrides our thumbColor with theme-derived values
  // (the thumb ends up the same color as the on track — invisible). Build a
  // custom toggle matching Figma 5597:6993: 51×30 track, 26×26 thumb, 999px
  // radius, surface thumb in both states with subtle shadow.
  const trackBg = on ? t.colors.primary : t.colors.outlineLight;
  return (
    <Pressable
      onPress={() => setOn(!on)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      style={{
        width: 51,
        height: 30,
        borderRadius: 999,
        backgroundColor: trackBg,
        padding: 2,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          backgroundColor: t.colors.surface,
          transform: [{ translateX: on ? 21 : 0 }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: on ? 0.05 : 0.08,
          shadowRadius: on ? 2 : 4,
          elevation: 2,
        }}
      />
    </Pressable>
  );
}

function PaperCheckboxDemo() {
  const [on, setOn] = useState(true);
  const t = usePaperTheme();
  // Paper's Checkbox renders the box via react-native-vector-icons, which is
  // stubbed in this repo (Rolldown can't parse its JSX). Build the visual
  // ourselves: 24×24, 6px radius, 1px stroke #8B828B unchecked, primary
  // bg + lucide Check when checked. Matches Figma component 5597:6953.
  return (
    <Pressable
      onPress={() => setOn(!on)}
      style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: on ? t.colors.primary : t.colors.surface,
          borderWidth: 1,
          borderColor: on ? t.colors.primary : t.colors.secondaryTextOnSurface,
        }}
      >
        {on && <Check size={16} strokeWidth={3} color={t.colors.onPrimary} />}
      </View>
      <PaperText variant="bodyMedium" style={{ color: t.colors.onSurface }}>Daily journaling</PaperText>
    </Pressable>
  );
}

function PaperRadioDemo() {
  const [v, setV] = useState('a');
  const t = usePaperTheme();
  return (
    <PaperRadio.Group value={v} onValueChange={setV}>
      {[['a', 'Option A'], ['b', 'Option B'], ['c', 'Option C']].map(([val, label]) => (
        <View key={val} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <PaperRadio value={val} uncheckedColor={t.colors.secondaryTextOnSurface} />
          <PaperText variant="bodyMedium" style={{ color: t.colors.onSurface }}>{label}</PaperText>
        </View>
      ))}
    </PaperRadio.Group>
  );
}

// Figma Pill: bg #F8F8F8 (= backgroundOnSurface token), 999px radius, black text.
// Paper's default Chip uses surfaceVariant which is sage in this theme.
function PaperChipDemo() {
  const t = usePaperTheme();
  const chipStyle = { backgroundColor: t.colors.backgroundOnSurface };
  const chipText = { color: t.colors.onSurface };
  const selectedStyle = { backgroundColor: t.colors.primary };
  const selectedText = { color: t.colors.onPrimary };
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <PaperChip style={chipStyle} textStyle={chipText}>Mindfulness</PaperChip>
      <PaperChip style={chipStyle} textStyle={chipText}>Gratitude</PaperChip>
      <PaperChip selected style={selectedStyle} textStyle={selectedText}>Selected</PaperChip>
    </View>
  );
}

// Paper ProgressBar's default track is surfaceVariant (sage). Override with
// outlineLight for a neutral track that matches Figma's gray pattern.
function PaperProgressDemo() {
  const t = usePaperTheme();
  return <ProgressBar progress={0.6} style={{ backgroundColor: t.colors.outlineLight }} />;
}

// Static mock of Figma 5753:9739 (Bottom Sheet, Type=Info / Type=Upgrade /
// Type=Choice). 16px top corners, background bg, 24px content gap, 32px
// between content + button, padding 24px 32px 48px. Top shadow per
// effect_26EKCT (0px -8px 24px rgba(0,0,0,0.08)). Drag handle bar added
// (standard pattern, Figma's "header" SVG includes it).
//
// Sticker is an SVG illustration (Rosebud logo, fingerprint, chat bubble) —
// rendered directly without a circle wrapper to match Figma. Pass an optional
// `secondaryCtaLabel` to render a 2-button row (secondary outlined + primary).
function BottomSheetDemo({ title, body, ctaLabel, secondaryCtaLabel, sticker }) {
  const t = usePaperTheme();
  const sharedBtn = {
    style: { borderRadius: 12, flex: 1 },
    contentStyle: { height: 48 },
    labelStyle: { fontSize: 16, fontWeight: '500' },
  };
  const outlinedTheme = { colors: { ...t.colors, outline: t.colors.outlineVariant } };
  return (
    <View
      style={{
        width: '100%',
        maxWidth: MOBILE_W,
        alignSelf: 'center',
        backgroundColor: t.colors.background,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        overflow: 'hidden',
      }}
    >
      <View style={{ paddingTop: 12, paddingBottom: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            backgroundColor: t.colors.outline,
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, gap: 24 }}>
        <View style={{ alignItems: 'center', gap: 20 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {sticker}
          </View>
          <View style={{ alignSelf: 'stretch', gap: 12 }}>
            <PaperText
              variant="displaySmall"
              style={{ color: t.colors.onSurface, textAlign: 'center' }}
            >
              {title}
            </PaperText>
            <PaperText
              variant="bodyMedium"
              style={{ color: t.colors.onSurface, textAlign: 'center' }}
            >
              {body}
            </PaperText>
          </View>
        </View>
        {secondaryCtaLabel ? (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <PaperButton mode="outlined" theme={outlinedTheme} {...sharedBtn}>
              {secondaryCtaLabel}
            </PaperButton>
            <PaperButton mode="contained" {...sharedBtn}>{ctaLabel}</PaperButton>
          </View>
        ) : (
          <PaperButton mode="contained" {...sharedBtn} style={{ borderRadius: 12 }}>
            {ctaLabel}
          </PaperButton>
        )}
      </View>
    </View>
  );
}

// Static mock of Figma Grouped List + Grouped List Item (5599:6404 / 5599:6269).
// Card with surface bg, 12px radius. Each row 56h, padding 8/16, separator
// line in backgroundOnSurface (#F8F8F8) between rows. Accessory variants:
// chevron, label+chevron, switch.
function GroupedListDemo() {
  const t = usePaperTheme();
  const [notif, setNotif] = useState(true);
  const [hap, setHap] = useState(false);
  const rows = [
    { label: 'Account', accessory: { kind: 'chevron' } },
    { label: 'Week begins', accessory: { kind: 'label', value: 'Monday' } },
    { label: 'Theme', accessory: { kind: 'label', value: 'Auto' } },
    { label: 'Notifications', accessory: { kind: 'switch', value: notif, onValueChange: setNotif } },
    { label: 'Haptics', accessory: { kind: 'switch', value: hap, onValueChange: setHap } },
  ];
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
        maxWidth: MOBILE_W,
      }}
    >
      {rows.map((row, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 8,
            minHeight: 56,
            borderTopWidth: i > 0 ? 1 : 0,
            borderTopColor: t.colors.backgroundOnSurface,
          }}
        >
          <PaperText variant="bodyMedium" style={{ color: t.colors.onSurface }}>
            {row.label}
          </PaperText>
          {row.accessory.kind === 'chevron' && (
            <ChevronRight size={20} color={t.colors.secondaryText} />
          )}
          {row.accessory.kind === 'label' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <PaperText variant="bodyMedium" style={{ color: t.colors.secondaryTextOnSurface }}>
                {row.accessory.value}
              </PaperText>
              <ChevronRight size={20} color={t.colors.secondaryText} />
            </View>
          )}
          {row.accessory.kind === 'switch' && (
            <Pressable
              onPress={() => row.accessory.onValueChange(!row.accessory.value)}
              accessibilityRole="switch"
              accessibilityState={{ checked: row.accessory.value }}
              style={{
                width: 51,
                height: 30,
                borderRadius: 999,
                backgroundColor: row.accessory.value ? t.colors.primary : t.colors.outlineLight,
                padding: 2,
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  backgroundColor: t.colors.surface,
                  transform: [{ translateX: row.accessory.value ? 21 : 0 }],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: row.accessory.value ? 0.05 : 0.08,
                  shadowRadius: row.accessory.value ? 2 : 4,
                  elevation: 2,
                }}
              />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

// Static mock of Figma Dialog 6338:5641 — system-alert style.
// Compact 280w (iOS-alert feel), centered content, tight padding. bg surface,
// 10px radius, 1px outlineLight separator between header and body.
function DialogDemo() {
  const t = usePaperTheme();
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 10,
        width: '100%',
        maxWidth: 320,
        paddingTop: 10,
        paddingBottom: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 2,
        }}
      >
        <Bell size={16} color={t.colors.onSurface} strokeWidth={2} />
        <PaperText
          variant="labelLarge"
          style={{ flex: 1, color: t.colors.onSurface, fontWeight: '500' }}
        >
          A Quick Note
        </PaperText>
        <XIcon size={16} color={t.colors.secondaryText} strokeWidth={2} />
      </View>
      <View style={{ height: 1, backgroundColor: t.colors.outlineLight }} />
      <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
        <PaperText variant="bodySmall" style={{ color: t.colors.onSurface }}>
          Rosebud is an AI thinking partner designed to help you reflect, not a
          replacement for a therapist or mental health professional.
        </PaperText>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, marginTop: 2 }}>
        <PaperButton
          mode="outlined"
          theme={{ colors: { ...t.colors, outline: t.colors.outlineVariant } }}
          style={{ flex: 1, borderRadius: 8 }}
          contentStyle={{ height: 36 }}
          labelStyle={{ fontSize: 14, fontWeight: '500' }}
        >
          Go Back
        </PaperButton>
        <PaperButton
          mode="contained"
          style={{ flex: 1, borderRadius: 8 }}
          contentStyle={{ height: 36 }}
          labelStyle={{ fontSize: 14, fontWeight: '500' }}
        >
          I Understand
        </PaperButton>
      </View>
    </View>
  );
}

// Static interactive mock of Figma Checkbox Card / Choice Tile 5514:3492.
// Row layout: label on left + 24×24 checkbox on right, gap 12, padding 16,
// 56h, 12px radius, surface bg. Default: transparent border. Selected: 1px
// primary border. Common feedback / multi-select pattern.
function ChoiceTileDemo() {
  const t = usePaperTheme();
  const [selected, setSelected] = useState(new Set(['inaccurate']));
  const toggle = (v) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };
  const options = [
    { value: 'inaccurate', label: 'Summary was inaccurate' },
    { value: 'tone', label: 'Tone felt off' },
    { value: 'incomplete', label: 'Missed important context' },
  ];
  return (
    <View style={{ gap: 8, width: '100%', maxWidth: MOBILE_W }}>
      {options.map(({ value, label }) => {
        const isSelected = selected.has(value);
        return (
          <Pressable
            key={value}
            onPress={() => toggle(value)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: 16,
              height: 56,
              backgroundColor: t.colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isSelected ? t.colors.primary : 'transparent',
            }}
          >
            <PaperText variant="bodyMedium" style={{ flex: 1, color: t.colors.onSurface }}>
              {label}
            </PaperText>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? t.colors.primary : t.colors.surface,
                borderWidth: 1,
                borderColor: isSelected ? t.colors.primary : t.colors.secondaryTextOnSurface,
              }}
            >
              {isSelected && <Check size={16} strokeWidth={3} color={t.colors.onPrimary} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// Static mock of Figma Infobar 5600:5934 — light variant of Snackbar.
// surface bg, 12px radius, padding 12, row gap 12. Icon colored per type
// (info=blue, success=green, warning=orange, error=red), body Caption (12/16)
// in onSurface. Width hugs content; in production typically 370 wide.
function InfobarDemo({ type, body }) {
  const t = usePaperTheme();
  const ICONS = {
    info: { Icon: Info, color: t.colors.blue || '#0A84FF' },
    success: { Icon: CheckCircle2, color: t.colors.green || '#207B00' },
    warning: { Icon: TriangleAlert, color: '#D97706' },
    error: { Icon: XCircle, color: t.colors.error || '#BA1A1A' },
  };
  const { Icon, color } = ICONS[type];
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        alignSelf: 'flex-start',
        maxWidth: MOBILE_W,
      }}
    >
      <Icon size={20} color={color} strokeWidth={2} />
      <PaperText
        variant="bodySmall"
        style={{ flex: 1, color: t.colors.onSurface, fontSize: 12, lineHeight: 16 }}
      >
        {body}
      </PaperText>
    </View>
  );
}

// Static mock of Figma Coachmark 4606:3925.
// Surface bg, 12px radius, padding 12 24, gap 9, alignItems flex-end (Next
// button right-aligned), drop shadow effect_QDECBX (0px 4px 24px @ 12%).
function TooltipDemo({ title, step, body, ctaLabel }) {
  const t = usePaperTheme();
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        gap: 9,
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
        maxWidth: MOBILE_W,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      <View style={{ alignSelf: 'stretch', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <PaperText variant="titleLarge" style={{ color: t.colors.onSurface }}>
            {title}
          </PaperText>
          {step && (
            <PaperText variant="labelLarge" style={{ color: t.colors.secondaryText }}>
              {step}
            </PaperText>
          )}
        </View>
        <PaperText variant="bodySmall" style={{ color: t.colors.onSurface }}>
          {body}
        </PaperText>
      </View>
      <PaperButton
        mode="text"
        labelStyle={{ fontSize: 16, fontWeight: '500', color: t.colors.onSurface }}
      >
        {ctaLabel}
      </PaperButton>
    </View>
  );
}

// Static mock of Figma Snackbar 4366:321 — 4 types (info/success/warning/error).
// All variants share the same shape: bg primary (#000), 12px radius, padding 12,
// row content with icon + Title Medium (16/22) text in onPrimary. Drop shadow
// per effect_H4D9JU. Icon color matches surface (white) on the dark bg.
function SnackbarDemo({ type, message }) {
  const t = usePaperTheme();
  const ICONS = { info: Info, success: CheckCircle2, warning: TriangleAlert, error: XCircle };
  const Icon = ICONS[type];
  return (
    <View
      style={{
        backgroundColor: t.colors.primary,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 6,
        alignSelf: 'flex-start',
      }}
    >
      <Icon size={20} color={t.colors.onPrimary} strokeWidth={2} />
      <PaperText
        variant="titleMedium"
        style={{ color: t.colors.onPrimary, fontSize: 16, lineHeight: 22 }}
      >
        {message}
      </PaperText>
    </View>
  );
}

// Static interactive mock of Figma Segmented Control 5597:6870.
// Selected segment: surface bg + onSurface label medium. Unselected: background
// bg (sage-free #F0F0F0) + secondaryText label. Outer corners 10px, shared 1px
// outline border. Label is Label Large (14/20 Circular Std).
function SegmentedControlDemo() {
  const [v, setV] = useState('week');
  const t = usePaperTheme();
  const options = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];
  return (
    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
      {options.map((opt, i) => {
        const isSelected = opt.value === v;
        const isFirst = i === 0;
        const isLast = i === options.length - 1;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setV(opt.value)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: isSelected ? t.colors.surface : t.colors.background,
              borderWidth: 1,
              borderColor: t.colors.outline,
              borderLeftWidth: isFirst ? 1 : 0,
              borderTopLeftRadius: isFirst ? 10 : 0,
              borderBottomLeftRadius: isFirst ? 10 : 0,
              borderTopRightRadius: isLast ? 10 : 0,
              borderBottomRightRadius: isLast ? 10 : 0,
            }}
          >
            <PaperText
              variant="labelLarge"
              style={{
                fontWeight: isSelected ? '500' : '450',
                color: isSelected ? t.colors.onSurface : t.colors.secondaryText,
              }}
            >
              {opt.label}
            </PaperText>
          </Pressable>
        );
      })}
    </View>
  );
}

// Static mock of Figma 4477:6778 Calendar component.
// - Outer: surface bg, 12px radius, 16px padding, 15px gap, width 396
// - Header row (Mo Tu We Th Fr Sa Su): Label Large in secondaryText
// - Day cell: 36×36, 12px radius — out-of-month opacity 0.5, selected = primary bg + onPrimary text
function DatePickerDemo() {
  const t = usePaperTheme();
  const [selected, setSelected] = useState({ row: 1, col: 1 });
  const labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  // June 2024 starts on Saturday; week 1 = May 26-Jun 2 (Mo-Su layout)
  const cells = [
    [26, 27, 28, 29, 30, 31, 1, true],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
    [30, 1, 2, 3, 4, 5, 6, false],
  ];
  // Mark out-of-month cells: row 0 days 1-6 are May (out), col 6 day=1 is in.
  // Row 5 col 0 = Jun 30 (in), 1-6 = July (out).
  const isOutOfMonth = (rowIdx, colIdx) => {
    if (rowIdx === 0) return colIdx < 6;
    if (rowIdx === 5) return colIdx > 0;
    return false;
  };
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        padding: 16,
        gap: 15,
        width: '100%',
        maxWidth: MOBILE_W,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {labels.map((d) => (
          <View key={d} style={{ width: 36, alignItems: 'center' }}>
            <PaperText
              variant="labelLarge"
              style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: t.colors.secondaryText }}
            >
              {d}
            </PaperText>
          </View>
        ))}
      </View>
      <View style={{ gap: 6 }}>
        {cells.map((row, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {row.slice(0, 7).map((day, colIdx) => {
              const out = isOutOfMonth(rowIdx, colIdx);
              const isSelected = selected.row === rowIdx && selected.col === colIdx;
              return (
                <Pressable
                  key={colIdx}
                  onPress={() => setSelected({ row: rowIdx, col: colIdx })}
                  style={({ hovered }) => ({
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected
                      ? t.colors.primary
                      : hovered
                      ? t.colors.backgroundOnSurface
                      : 'transparent',
                  })}
                >
                  <PaperText
                    variant="titleMedium"
                    style={{
                      fontSize: 16,
                      lineHeight: 22,
                      fontWeight: '500',
                      color: isSelected ? t.colors.onPrimary : t.colors.secondaryText,
                      opacity: out ? 0.5 : 1,
                    }}
                  >
                    {day}
                  </PaperText>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

// Static mock of iOS-style wheel Time Picker.
// 3 columns (hour, minute, AM/PM), 5 visible rows, center row selected (full
// opacity + primary color), surrounding rows fade with opacity. Center has a
// subtle pill highlight matching iOS wheel pickers.
function TimePickerDemo() {
  const t = usePaperTheme();
  const ROW_H = 36;
  const hours = ['7', '8', '9', '10', '11'];
  const minutes = ['58', '59', '00', '01', '02'];
  const periods = ['', 'AM', 'PM', '', ''];
  const center = 2;
  const fades = [0.25, 0.5, 1, 0.5, 0.25];
  const Column = ({ items, paddingRight = 0, paddingLeft = 0 }) => (
    <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingRight, paddingLeft }}>
      {items.map((v, i) => (
        <View key={i} style={{ height: ROW_H, justifyContent: 'center' }}>
          <PaperText
            variant="displaySmall"
            style={{
              fontSize: 22,
              lineHeight: 28,
              fontWeight: i === center ? '500' : '400',
              color: t.colors.onSurface,
              opacity: fades[i],
              minWidth: 30,
              textAlign: 'center',
            }}
          >
            {v}
          </PaperText>
        </View>
      ))}
    </View>
  );
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: 12,
        padding: 12,
        width: '100%',
        maxWidth: 320,
        alignSelf: 'flex-start',
        position: 'relative',
        height: ROW_H * 5 + 24,
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          top: 12 + ROW_H * center,
          height: ROW_H,
          borderRadius: 8,
          backgroundColor: t.colors.backgroundOnSurface,
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Column items={hours} />
        <Column items={minutes} />
        <Column items={periods} />
      </View>
    </View>
  );
}

// Static mock of Figma Week Days 5599:27211 + apps/native WeekDayPicker.
// 7 columns (Sa Su Mo Tu We Th Fr in startOfWeek order). Each column: day
// letter (Body Small in secondaryTextOnSurface) above a 28×28 status circle.
// Selected day: primary fill + onPrimary text. Day with entry: filled
// checkmark-circle. Empty: stroke circle. Today: thicker stroke.
function WeekdayPickerDemo() {
  const t = usePaperTheme();
  const [selectedDay, setSelectedDay] = useState('Mo');
  const dayMeta = {
    Sa: 'empty', Su: 'empty', Mo: 'empty', Tu: 'entry',
    We: 'entry', Th: 'today', Fr: 'empty',
  };
  const days = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'].map((label) => ({
    label,
    state: label === selectedDay ? 'selected' : dayMeta[label],
  }));
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: MOBILE_W,
      }}
    >
      {days.map(({ label, state }) => {
        const isSelected = state === 'selected';
        const hasEntry = state === 'entry';
        const isToday = state === 'today';
        return (
          <Pressable
            key={label}
            onPress={() => setSelectedDay(label)}
            style={({ hovered }) => ({
              alignItems: 'center',
              gap: 6,
              width: 32,
              opacity: hovered && !isSelected ? 0.7 : 1,
            })}
          >
            <PaperText
              variant="bodySmall"
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontWeight: '450',
                color: t.colors.secondaryTextOnSurface,
              }}
            >
              {label}
            </PaperText>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected || hasEntry ? t.colors.primary : 'transparent',
                borderWidth: isSelected || hasEntry ? 0 : isToday ? 2 : 1.5,
                borderColor: t.colors.onSurface,
              }}
            >
              {hasEntry && <Check size={14} strokeWidth={3} color={t.colors.onPrimary} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// Static mock of Figma 5600:6198 (Main Nav Bar / navigation/main-navigation).
// - Outer: surface bg, height 86, padding 0px 24px 27px, top shadow
//   0px -8px 32px rgba(0,0,0,0.08), gap 10 (between row and bottom safe area)
// - Tab buttons: column, gap 3, width 44, icon 22×22, label Label Small
//   (12/17 Circular Std Book), active fill primary, inactive fill outline
// - Compose FAB: 56×56, 24px radius (squircle), primary bg, white plus icon
// - Insights tab: black 18px notification badge with white "1" caption
// - Tab order (Figma): Today / Explore / [FAB compose] / Insights / History
function BottomNavDemo() {
  const t = usePaperTheme();
  const [activeTab, setActiveTab] = useState('today');
  const tabs = [
    { name: 'today', label: 'Today', Icon: Sun },
    { name: 'explore', label: 'Explore', Icon: Compass },
    { name: 'compose', label: '', Icon: Plus, fab: true },
    { name: 'insights', label: 'Insights', Icon: Lightbulb, badge: 1 },
    { name: 'history', label: 'History', Icon: BookOpen },
  ].map((tab) => ({ ...tab, active: tab.name === activeTab }));
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        // Production has 86h with a 27px iOS safe-area inset at the bottom.
        // On web there's no safe area, so we render the visible portion only:
        // 64h with a small bottom inset that keeps the FAB bottom aligned with
        // the label baseline.
        height: 64,
        paddingTop: 8,
        paddingHorizontal: 24,
        paddingBottom: 8,
        justifyContent: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.08,
        shadowRadius: 32,
        elevation: 8,
        maxWidth: MOBILE_W,
        alignSelf: 'center',
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {tabs.map(({ name, label, Icon, active, fab, badge }) => {
          if (fab) {
            // FAB bottom aligns with the label baseline of sibling tabs. The
            // 56×56 button is taller than the 41h tab buttons (icon + 3 + label),
            // so it naturally extends ~15px above the nav-bar top edge.
            // translateY 0 puts its bottom at the same flex-end baseline.
            return (
              <Pressable
                key={name}
                onPress={() => setActiveTab(name)}
                style={({ hovered, pressed }) => ({
                  width: 56,
                  height: 56,
                  borderRadius: 24,
                  backgroundColor: t.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 6,
                  opacity: pressed ? 0.85 : hovered ? 0.92 : 1,
                })}
              >
                <Icon size={22} color={t.colors.onPrimary} strokeWidth={2.5} />
              </Pressable>
            );
          }
          const color = active ? t.colors.primary : t.colors.outline;
          return (
            <Pressable
              key={name}
              onPress={() => setActiveTab(name)}
              style={({ hovered }) => ({
                alignItems: 'center',
                gap: 3,
                width: 44,
                opacity: hovered && !active ? 0.7 : 1,
              })}
            >
              <View>
                <Icon size={22} color={color} strokeWidth={2} />
                {badge != null && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -8,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: t.colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 5,
                    }}
                  >
                    <PaperText
                      variant="labelSmall"
                      style={{
                        fontSize: 11,
                        lineHeight: 14,
                        fontWeight: '700',
                        color: t.colors.onPrimary,
                      }}
                    >
                      {badge}
                    </PaperText>
                  </View>
                )}
              </View>
              <PaperText
                variant="labelSmall"
                style={{
                  fontSize: 12,
                  lineHeight: 17,
                  fontWeight: '450',
                  color,
                  textAlign: 'center',
                }}
              >
                {label}
              </PaperText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* ── Inline icons for demos ── */

function IconPlus() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
