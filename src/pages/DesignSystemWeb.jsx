import { useState, useEffect } from 'react';
import {
  Box, Flex, HStack, VStack, Stack, SimpleGrid, Heading, Text, Button, ButtonGroup,
  IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Textarea,
  FormControl, FormLabel, FormHelperText, Select, Switch, Checkbox, Radio,
  RadioGroup, Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Menu, MenuButton, MenuList, MenuItem, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon, Tag, Badge, Avatar,
  Tooltip, Spinner, Divider, Skeleton, Code, Link as ChakraLink, useColorMode,
  useColorModeValue, useDisclosure, Circle, CircularProgress, CircularProgressLabel,
  ChakraProvider,
} from '@chakra-ui/react';
import {
  Sun, Moon, ChevronRight, Search, Eye, EyeOff, Info, AlertTriangle,
  ChevronDown, ThumbsUp, ThumbsDown, Calendar, MoreHorizontal, ArrowRight,
  X, Check, Pencil, Bell,
} from 'lucide-react';
import { usePageActions } from '../components/Layout';
import chakraTheme from '../theme/index.js';

/* ══════════════════════════════════════════════════════════
   DESIGN SYSTEM (WEB)
   Sourced from Rising-Tide-Org/rosebud-react · apps/web
   Stack: Next.js 15 · Chakra UI 2.5.5 · Emotion · framer-motion
   Theme is ported into /src/theme/ — same colors, semantic tokens,
   and component overrides as the live web app.
   ══════════════════════════════════════════════════════════ */

const NAV = [
  {
    group: 'Getting Started',
    items: [{ id: 'how-to-use', label: 'How to use with Claude' }],
  },
  {
    group: 'Foundations',
    items: [
      { id: 'colors', label: 'Colors' },
      { id: 'semantic-tokens', label: 'Semantic Tokens' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'radius', label: 'Radius' },
      { id: 'shadows', label: 'Shadows' },
      { id: 'breakpoints', label: 'Breakpoints' },
      { id: 'z-index', label: 'z-Index' },
      { id: 'grid', label: 'Layout Grid' },
    ],
  },
  {
    group: 'Actions',
    items: [{ id: 'button', label: 'Button' }],
  },
  {
    group: 'Input & Selection',
    items: [
      { id: 'input', label: 'Input' },
      { id: 'email-password', label: 'Email / Password' },
      { id: 'searchinput', label: 'SearchInput' },
      { id: 'promptarea', label: 'PromptArea' },
      { id: 'personalization-textarea', label: 'PersonalizationTextarea' },
      { id: 'selectors', label: 'Selectors' },
      { id: 'checkbox-radio-switch', label: 'Checkbox · Radio · Switch' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { id: 'alertdialog', label: 'AlertDialog' },
      { id: 'toast', label: 'Toast' },
      { id: 'warningcard', label: 'WarningCard' },
      { id: 'helpbubble', label: 'HelpBubble' },
      { id: 'coachmark', label: 'CoachMark' },
    ],
  },
  {
    group: 'Display',
    items: [
      { id: 'panel', label: 'Panel' },
      { id: 'listview', label: 'ListView' },
      { id: 'emptystate', label: 'EmptyPageState' },
      { id: 'smallcaps', label: 'SmallCapsHeading' },
      { id: 'pricingfeature', label: 'PricingFeature' },
      { id: 'thumbvote', label: 'ThumbVote' },
      { id: 'tags-badges-avatar', label: 'Tag · Badge · Avatar' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'menu', label: 'Menu' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'modal', label: 'Modal / Drawer' },
    ],
  },
  {
    group: 'Auth & Install',
    items: [
      { id: 'auth-buttons', label: 'Auth Buttons' },
      { id: 'mobile-install', label: 'Mobile Install' },
    ],
  },
  {
    group: 'Blocks',
    items: [
      { id: 'heading-block', label: 'HeadingBlock' },
      { id: 'goal-block', label: 'GoalBlock' },
      { id: 'objective-block', label: 'ObjectiveBlock' },
    ],
  },
  {
    group: 'Chrome',
    items: [
      { id: 'desktop-nav', label: 'Desktop Navigation' },
      { id: 'tabbar', label: 'Tab Bar (mobile)' },
      { id: 'mobile-navbar', label: 'NavigationBar (mobile)' },
      { id: 'topbar', label: 'TopBar' },
      { id: 'pageheading', label: 'PageHeading' },
      { id: 'pageloading', label: 'PageLoading' },
    ],
  },
  {
    group: 'Patterns',
    items: [
      { id: 'p-onboarding', label: 'Onboarding Hero' },
      { id: 'p-compose', label: 'Compose Container' },
      { id: 'p-auth-form', label: 'Auth Form' },
      { id: 'p-settings', label: 'Settings Section' },
      { id: 'p-pricing', label: 'Pricing Comparison' },
      { id: 'p-paywall', label: 'Feature Upgrade Modal' },
      { id: 'p-splitview', label: 'NavigationSplitView' },
      { id: 'p-banners', label: 'Banners' },
    ],
  },
  {
    group: 'Assets',
    items: [
      { id: 'rb-icons', label: 'Rb* Icons' },
      { id: 'modals-index', label: 'Modals Index' },
    ],
  },
];

/* ── Layout helpers (Tailwind for outer chrome, Chakra for content) ── */

function PageSection({ id, title, description, children }) {
  return (
    <section id={id} className="mb-[64px] scroll-mt-[80px]">
      <h2 className="text-[24px] leading-[32px] font-[700] text-[var(--color-on-background)] mb-[4px]">
        {title}
      </h2>
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

function SubSection({ title, children }) {
  return (
    <div className="mb-[32px]">
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

function Swatch({ name, hex }) {
  return (
    <div className="flex flex-col items-center gap-[6px]">
      <div
        className="w-[56px] h-[56px] rounded-[10px] border border-[var(--color-outline-light)]"
        style={hex ? { backgroundColor: hex } : undefined}
      />
      <span className="text-[12px] leading-[17px] text-[var(--color-on-surface-variant)] text-center max-w-[70px]">{name}</span>
      {hex && <span className="text-[11px] leading-[14px] text-[var(--color-secondary-text)] font-mono">{hex}</span>}
    </div>
  );
}

function ComponentSpec({ name, children }) {
  return (
    <div className="p-[24px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
      <p className="text-[12px] leading-[16px] font-[500] text-[var(--color-secondary-text)] uppercase tracking-wider mb-[16px]">{name}</p>
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

/* ── Smaller Outfit-styled small caps used a lot in examples ── */
function SmallCaps({ children, ...rest }) {
  return (
    <Text fontFamily="Outfit, system-ui, sans-serif" fontSize="12px" fontWeight={500} textTransform="uppercase" letterSpacing="0.06em" color="brandGray.500" {...rest}>
      {children}
    </Text>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════ */

export function DesignSystemWeb() {
  const [theme, setTheme] = useState('light');
  const [activeSection, setActiveSection] = useState('how-to-use');
  const [collapsed, setCollapsed] = useState({});
  const [sidebarSearch, setSidebarSearch] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    <ChakraThemeToggle theme={theme} setTheme={setTheme} />,
    [theme]
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <div className="max-w-[1400px] mx-auto flex">
        {/* ── Sidebar ── */}
        <nav className="hidden lg:block w-[230px] shrink-0 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto border-r border-[var(--color-outline-light)] py-[24px] px-[12px]">
          <div className="mb-[12px]">
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-[10px] py-[6px] rounded-[8px] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)] text-[13px] leading-[18px] font-[450] text-[var(--color-on-surface)] placeholder:text-[var(--color-secondary-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
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
                  className="flex items-center gap-[6px] w-full py-[6px] text-[11px] leading-[14px] font-[700] uppercase tracking-[0.08em] text-[var(--color-secondary-text)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
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
                            block px-[10px] py-[6px] rounded-[8px] text-[13px] leading-[18px] font-[450] transition-colors
                            ${activeSection === item.id
                              ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] font-[500]'
                              : 'text-[var(--color-secondary-text)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)]'
                            }
                          `}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-[32px] lg:px-[48px] py-[48px]">

          {/* Page header */}
          <div className="mb-[40px] pb-[24px] border-b border-[var(--color-outline-light)]">
            <span className="inline-block text-[11px] font-[700] uppercase tracking-[0.08em] text-[var(--color-secondary-text)] mb-[8px]">
              Foundations
            </span>
            <h1 className="text-[36px] leading-[42px] font-[700] tracking-[-0.02em] text-[var(--color-on-background)] mb-[8px]">
              Design System (Web)
            </h1>
            <p className="text-[15px] leading-[22px] font-[450] text-[var(--color-secondary-text)] max-w-[640px]">
              The web design system from <PathTag>Rising-Tide-Org/rosebud-react</PathTag> · <PathTag>apps/web</PathTag>.
              Built on Next.js 15 + Chakra UI 2.5.5. Theme is ported into <PathTag>src/theme/</PathTag> — every component below renders with real Chakra and the real theme.
            </p>
          </div>

          {/* ═══ HOW TO USE ═══ */}

          <PageSection id="how-to-use" title="How to use this page with Claude" description="Copy-paste these prompts when you want Claude to build new web prototypes that match Rosebud's web design system.">
            <Box bg="bgSecondary" rounded="md" border="1px solid" borderColor="border" p={6}>
              <SmallCaps mb={3}>1 · Bootstrap a new prototype page</SmallCaps>
              <Text fontSize="14px" color="textSecondary" mb={3}>
                Drop a new file under <PathTag>src/pages/</PathTag> and add a route in <PathTag>main.jsx</PathTag>. Use this prompt verbatim:
              </Text>
              <CodeBlock>{`Create a new prototype page at src/pages/MyPage.jsx using Chakra UI v2 with the rosebud web theme already wired into ChakraProvider in main.jsx.

Rules:
- Import Chakra components from '@chakra-ui/react'.
- Use semantic tokens for surfaces: bg='bg', color='text', borderColor='border', bg='bgSecondary' for subdued surfaces, bg='bgSelected' for active rows.
- Use brand.500 (#E31665) only for primary actions and the rosebud logo.
- Use bloom.500 (#ECB02D) only for premium/Bloom-tier UI.
- Section labels use the SmallCaps pattern: Text fontFamily='Outfit, system-ui, sans-serif' fontSize='12px' fontWeight={500} textTransform='uppercase' letterSpacing='0.06em' color='brandGray.500'.
- Wrap the page body in <Box bg='bg' color='text' minH='100vh' fontFamily='body'> so theme tokens apply.
- Refer to /design-system-web for visual examples and exact prop signatures of each component.

Then add a Route in src/main.jsx pointing /my-page → MyPage and a sidebar entry in src/components/Sidebar.jsx if needed.`}</CodeBlock>

              <SmallCaps mt={6} mb={3}>2 · Build a specific component or pattern</SmallCaps>
              <Text fontSize="14px" color="textSecondary" mb={3}>When you want one of the patterns shown on this page (paywall modal, settings section, pricing comparison, etc.):</Text>
              <CodeBlock>{`Build the [PATTERN NAME — e.g. "FeatureUpgradeModal paywall"] from /design-system-web in src/pages/MyPage.jsx.

Use Chakra v2 components from the rosebud theme. Match the layout, spacing, typography, and color tokens shown in the reference example exactly. Open /design-system-web in the browser if you need to see it.

If the pattern uses a Chakra component not yet imported in main.jsx, add the import. If it needs an icon, prefer lucide-react (already installed) — the rosebud Rb* icon SVGs are not vendored into this repo.`}</CodeBlock>

              <SmallCaps mt={6} mb={3}>3 · Stay on-system (avoid Tailwind drift)</SmallCaps>
              <Text fontSize="14px" color="textSecondary" mb={3}>This repo also has Tailwind. When working on Chakra prototypes, tell Claude:</Text>
              <CodeBlock>{`Don't use Tailwind classes (className='bg-...') for this page. Style everything with Chakra props (bg, color, p, mt, fontSize, etc.) and theme tokens. Tailwind is only used by the older Tailwind-based pages in this repo.`}</CodeBlock>

              <SmallCaps mt={6} mb={3}>4 · Reference rosebud-react directly</SmallCaps>
              <Text fontSize="14px" color="textSecondary" mb={3}>For component implementations, props, or behavior not covered here:</Text>
              <CodeBlock>{`Read the source for [ComponentName] in Rising-Tide-Org/rosebud-react via gh:
gh api repos/Rising-Tide-Org/rosebud-react/contents/apps/web/src/ui/<path>/<Component>/index.tsx -H "Accept: application/vnd.github.raw"

Use that as the source of truth for prop signatures and behavior.`}</CodeBlock>

              <SmallCaps mt={6} mb={3}>What the theme gives you for free</SmallCaps>
              <Box as="ul" pl={5} fontSize="14px" color="text" sx={{ '& > li': { mb: 1 } }}>
                <li>Color scales: <Code>brand</Code>, <Code>bloom</Code>, <Code>brandGray</Code>, <Code>gold</Code>, <Code>green</Code>, etc. Use as <Code>bg='brand.500'</Code></li>
                <li>Semantic tokens: <Code>bg</Code>, <Code>bgSecondary</Code>, <Code>bgSelected</Code>, <Code>border</Code>, <Code>borderList</Code>, <Code>text</Code>, <Code>icon</Code> — auto-adapt to light/dark</li>
                <li>Component overrides: <Code>Button</Code> variants (primary, solid, panel, secondary, outline, ghost), <Code>Text</Code> variants (secondary, tertiary, highlight), themed <Code>Input</Code>, <Code>Tabs</Code>, <Code>Menu</Code>, <Code>Modal</Code>, <Code>Panel</Code>, <Code>Accordion</Code></li>
                <li>Custom breakpoints: <Code>xs 320 · sm 400 · md 768 · lg 960 · xl 1200</Code></li>
                <li>Fonts: Circular Std (body) + Outfit (display, via Google Fonts)</li>
              </Box>

              <SmallCaps mt={6} mb={3}>What's not yet in the theme</SmallCaps>
              <Text fontSize="14px" color="textSecondary">
                The 63 <Code>Rb*</Code> icon SVGs are not ported — use lucide-react for stand-ins. Custom illustrations and the full <Code>NavigationSplitView</Code> component aren't ported either; reference the rosebud-react source if you need exact behavior.
              </Text>
            </Box>
          </PageSection>

          {/* ═══ FOUNDATIONS ═══ */}

          <PageSection id="colors" title="Colors" description="Brand pink #E31665 anchors the palette. brandGray is the warm neutral. bloom is the premium-tier gold.">
            <SubSection title="Brand">
              <div className="flex flex-wrap gap-[12px]">
                {[['100','#FFE5E5'],['200','#D93B74'],['300','#F36FA1'],['400','#D93B74'],['500','#E31665'],['600','#D6165B'],['900','#2C2A2A']].map(([n,h]) => (
                  <Swatch key={n} name={`brand.${n}`} hex={h} />
                ))}
              </div>
            </SubSection>
            <SubSection title="Bloom (premium tier)">
              <div className="flex flex-wrap gap-[12px]">
                {[['100','#FFEDCF'],['400','#F4B62E'],['500','#ECB02D'],['600','#E2A726'],['900','#AB7A0C']].map(([n,h]) => (
                  <Swatch key={n} name={`bloom.${n}`} hex={h} />
                ))}
              </div>
            </SubSection>
            <SubSection title="brandGray (warm neutral)">
              <div className="flex flex-wrap gap-[12px]">
                {[['50','#FFFAFA'],['100','#F7F5F5'],['200','#EDE4E4'],['300','#DED5D5'],['400','#CCBEBE'],['500','#8B807F'],['600','#7F7676'],['700','#5C5555'],['750','#2E2B2B'],['800','#211F1F'],['900','#0F0E0E']].map(([n,h]) => (
                  <Swatch key={n} name={`brandGray.${n}`} hex={h} />
                ))}
              </div>
            </SubSection>
            <SubSection title="Gold (coach marks, premium accents)">
              <div className="flex flex-wrap gap-[12px]">
                {[['50','#FFF6E8'],['500','#EBBC6F'],['900','#AF730D']].map(([n,h]) => (
                  <Swatch key={n} name={`gold.${n}`} hex={h} />
                ))}
              </div>
            </SubSection>
            <SubSection title="Status">
              <div className="flex flex-wrap gap-[12px]">
                <Swatch name="red.500" hex="#EE584E" />
                <Swatch name="yellow.500" hex="#FEE886" />
                <Swatch name="yellow.900" hex="#D4AD02" />
                <Swatch name="green.500" hex="#5ABA9D" />
                <Swatch name="green.600" hex="#4FA58B" />
                <Swatch name="blue.50" hex="#EAF4FD" />
                <Swatch name="blue.900" hex="#1A365D" />
                <Swatch name="purple.50" hex="#CBBEEA" />
                <Swatch name="purple.800" hex="#311E60" />
              </div>
            </SubSection>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/web/src/styles/theme/colors.ts</PathTag>
            </p>
          </PageSection>

          <PageSection id="semantic-tokens" title="Semantic Tokens" description="Mode-aware aliases used as bg='bg', color='text', etc.">
            <TokenTable
              headers={['Token', 'Light', 'Dark', 'Use']}
              rows={[
                ['bg', 'white', 'brandGray.800', 'Page / surface background'],
                ['bgSecondary', 'brandGray.50', 'brandGray.750', 'Subdued surface'],
                ['bgSelected', 'blue.50', 'brandGray.750', 'Selected list item'],
                ['border', 'brandGray.200', 'brandGray.700', 'Hairline divider'],
                ['borderList', 'brandGray.200', 'brandGray.900', 'List row separator'],
                ['borderSelected', 'blue.500', 'brandGray.600', 'Active selection ring'],
                ['divider', 'brandGray.300', 'brandGray.700', 'Section divider'],
                ['text', 'black.700 (#4F2F2F)', 'white.900 (#EEE)', 'Primary text'],
                ['textSecondary', 'brandGray.500', 'brandGray.500', 'Secondary text'],
                ['icon', 'brandGray.700', 'brandGray.400', 'Default icon color'],
                ['iconHover', 'brandGray.900', 'brandGray.300', 'Icon hover state'],
                ['blue', 'blue.200', 'blue.600', 'Link / info accent'],
              ]}
            />
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/web/src/styles/theme/semanticTokens.ts</PathTag>
            </p>
          </PageSection>

          <PageSection id="typography" title="Typography" description="Two custom families: Circular Std (body) + Outfit (display). Theme.fonts.body = 'Circular Std, system-ui, sans-serif'.">
            <SubSection title="Families (rendered with theme)">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <ComponentSpec name="Circular Std (body)">
                  <Text fontSize="17px" fontWeight={450}>The quick brown fox · 450 Book</Text>
                  <Text fontSize="17px" fontWeight={500} mt={1}>The quick brown fox · 500 Medium</Text>
                  <Text fontSize="17px" fontWeight={700} mt={1}>The quick brown fox · 700 Bold</Text>
                </ComponentSpec>
                <ComponentSpec name="Outfit (display)">
                  <Text fontFamily="Outfit, system-ui, sans-serif" fontSize="21px" fontWeight={400}>Welcome to Rosebud · 400</Text>
                  <Text fontFamily="Outfit, system-ui, sans-serif" fontSize="21px" fontWeight={500} mt={1}>Welcome to Rosebud · 500</Text>
                  <Text fontFamily="Outfit, system-ui, sans-serif" fontSize="21px" fontWeight={700} mt={1}>Welcome to Rosebud · 700</Text>
                </ComponentSpec>
              </SimpleGrid>
            </SubSection>
            <SubSection title="Type scale">
              <TokenTable
                headers={['px', 'Common use']}
                rows={[
                  ['12', 'SmallCapsHeading (Outfit, uppercase, 500)'],
                  ['13', 'Tabs default'],
                  ['14', 'Buttons, FormLabel'],
                  ['15', 'Body small'],
                  ['16 / md', 'Body / heading 16/600'],
                  ['17', 'Tabs, Accordion panels, Markdown h3'],
                  ['19', 'Body large, Markdown h2'],
                  ['20', 'PageHeading desktop'],
                  ['21', 'Markdown h1'],
                  ['24', 'HeadingBlock'],
                  ['30', 'Mid headlines'],
                  ['34', 'Onboarding hero, modal headlines'],
                ]}
              />
            </SubSection>
            <SubSection title="Text variants">
              <ComponentSpec name="default · secondary · tertiary · highlight">
                <Text>Default body text</Text>
                <Text variant="secondary" mt={1}>variant='secondary'</Text>
                <Text variant="tertiary" mt={1}>variant='tertiary'</Text>
                <Text variant="highlight" mt={1}>variant='highlight'</Text>
              </ComponentSpec>
            </SubSection>
          </PageSection>

          <PageSection id="spacing" title="Spacing" description="Chakra default 4px scale + app-specific layout constants.">
            <SubSection title="Layout constants (ui/constants/index.ts)">
              <TokenTable
                headers={['Constant', 'Value', 'Use']}
                rows={[
                  ['kTopBarHeight', '56px', 'Top app bar'],
                  ['kNavBarHeight', '54px', 'Page nav bar (desktop)'],
                  ['kNavBarHeightMobile', '56px', 'Page nav bar (mobile)'],
                  ['kTabBarHeightMobile', '66px', 'Bottom tab bar'],
                  ['kViewPadding', '{ base: 3, sm: 4, md: 6 }', 'Global page gutter'],
                  ['kGlobalLayoutWidth', '1160px', 'Wide layout max-width'],
                  ['kGlobalLayoutWidthNarrow', '480px', 'Narrow column'],
                  ['kMobileIconSize', '20px', 'Default mobile icon'],
                ]}
              />
            </SubSection>
            <HStack align="end" spacing={3} mt={4}>
              {[['1',4],['2',8],['3',12],['4',16],['5',20],['6',24],['8',32],['10',40],['12',48]].map(([name, px]) => (
                <VStack key={name} spacing={1.5}>
                  <Box w={`${px}px`} h={`${px}px`} bg="brand.500" />
                  <Text fontSize="11px" color="textSecondary" fontFamily="mono">{name}</Text>
                </VStack>
              ))}
            </HStack>
          </PageSection>

          <PageSection id="radius" title="Radius" description="Mostly Chakra defaults. Component-level conventions:">
            <TokenTable
              headers={['Token', 'Value', 'Used by']}
              rows={[
                ['sm', '0.125rem (2px)', '—'],
                ['md', '0.375rem (6px)', 'Panel.baseStyle, Modal dialog'],
                ['lg', '0.5rem (8px)', 'Button.baseStyle (default)'],
                ['full', '9999px', 'Avatar, FAB Write button'],
              ]}
            />
            <HStack spacing={4} mt={6}>
              {[['sm', 'sm'], ['md', 'md'], ['lg', 'lg'], ['full', 'full']].map(([name, r]) => (
                <VStack key={name} spacing={1.5}>
                  <Box w="48px" h="48px" bg="bgSecondary" border="1px solid" borderColor="border" rounded={r} />
                  <Text fontSize="11px" color="textSecondary" fontFamily="mono">{name}</Text>
                </VStack>
              ))}
            </HStack>
          </PageSection>

          <PageSection id="shadows" title="Shadows" description="No theme overrides — applied inline at usage sites.">
            <TokenTable
              headers={['Where', 'Value']}
              rows={[
                ['Mobile bottom tab bar', '0px -4px 10px rgba(0,0,0,0.05)'],
                ['ComposeContainer / Onboarding card', '0px 0px 16px rgba(0,0,0,0.05)'],
                ['Floating Write FAB', '0px 4px 12px rgba(0,0,0,0.15)'],
                ['Top bar / nav bar backdrop', 'backdropFilter: blur(7px) saturate(180%)'],
              ]}
            />
            <HStack spacing={6} mt={6}>
              <VStack spacing={1.5}>
                <Box w="80px" h="80px" rounded="lg" bg="white" boxShadow="0px 0px 16px rgba(0,0,0,0.05)" />
                <Text fontSize="11px" color="textSecondary" fontFamily="mono">card</Text>
              </VStack>
              <VStack spacing={1.5}>
                <Box w="80px" h="80px" rounded="full" bg="brand.500" boxShadow="0px 4px 12px rgba(0,0,0,0.15)" />
                <Text fontSize="11px" color="textSecondary" fontFamily="mono">FAB</Text>
              </VStack>
            </HStack>
          </PageSection>

          <PageSection id="breakpoints" title="Breakpoints" description="md (768) is the primary mobile/desktop split via useIsMobile().">
            <TokenTable
              headers={['Token', 'Min width']}
              rows={[
                ['xs', '320px'],
                ['sm', '400px'],
                ['md', '768px (mobile/desktop split)'],
                ['lg', '960px'],
                ['xl', '1200px'],
                ['2xl', '1536px'],
                ['xxl', '2048px'],
              ]}
            />
          </PageSection>

          <PageSection id="z-index" title="z-Index" description="Chakra defaults plus a custom value for pushed sheets.">
            <TokenTable
              headers={['Token', 'Value']}
              rows={[
                ['docked', '10'],
                ['pushed (custom)', '20'],
                ['dropdown', '1000'],
                ['sticky', '1100'],
                ['modal', '1400'],
                ['popover', '1500'],
                ['toast', '1700'],
                ['tooltip', '1800'],
              ]}
            />
          </PageSection>

          <PageSection id="grid" title="Layout Grid" description="No formal column grid — pages are constrained by max-width and gutter.">
            <SubSection title="Wide layout">
              <TokenTable
                headers={['Property', 'Value']}
                rows={[
                  ['max-width', '1160px'],
                  ['gutter', '12 / 16 / 24px (kViewPadding)'],
                  ['alignment', 'Center'],
                ]}
              />
            </SubSection>
            <SubSection title="Narrow layout">
              <TokenTable
                headers={['Property', 'Value']}
                rows={[
                  ['max-width', '480px'],
                  ['ComposeContainer', '640px (md+) / 100% (mobile)'],
                  ['NavigationSplitView sidebar', '360px'],
                ]}
              />
            </SubSection>
          </PageSection>

          {/* ═══ ACTIONS ═══ */}

          <PageSection id="button" title="Button" description="Theme overrides set color: white, rounded: lg. 6 variants + 4 sizes.">
            <SubSection title="Variants (real Chakra)">
              <ComponentSpec name="primary · solid · panel · secondary · outline · ghost">
                <Flex wrap="wrap" gap={3} align="center">
                  <Button variant="primary">primary</Button>
                  <Button>solid (default)</Button>
                  <Button variant="panel">panel</Button>
                  <Button variant="secondary">secondary</Button>
                  <Button variant="outline">outline</Button>
                  <Button variant="ghost">ghost</Button>
                </Flex>
              </ComponentSpec>
            </SubSection>
            <SubSection title="Sizes">
              <ComponentSpec name="sm 32 · md 40 · lg 48">
                <Flex wrap="wrap" gap={3} align="center">
                  <Button variant="primary" size="sm">sm</Button>
                  <Button variant="primary" size="md">md</Button>
                  <Button variant="primary" size="lg">lg</Button>
                  <Button variant="primary" h="60px" px={8} fontSize="19px" rightIcon={<ArrowRight size={20} />}>xl hero CTA</Button>
                </Flex>
              </ComponentSpec>
            </SubSection>
            <SubSection title="States">
              <ComponentSpec name="loading · disabled">
                <Flex wrap="wrap" gap={3} align="center">
                  <Button variant="primary" isLoading loadingText="Saving">Save</Button>
                  <Button variant="primary" isDisabled>Disabled</Button>
                  <Button variant="outline" isDisabled>Disabled outline</Button>
                </Flex>
              </ComponentSpec>
            </SubSection>
            <CodeBlock>{`<Button variant="primary" size="lg" isLoading={loading} width="100%">
  Sign In
</Button>`}</CodeBlock>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/web/src/styles/theme/components/Button.ts</PathTag>
            </p>
          </PageSection>

          {/* ═══ INPUT & SELECTION ═══ */}

          <PageSection id="input" title="Input" description="Theme override sets bg='white'/'bg', focus border brandGray.500/700.">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <ComponentSpec name="Default">
                <Input placeholder="Type something…" />
              </ComponentSpec>
              <ComponentSpec name="Readonly variant">
                <Input variant="readonly" defaultValue="readonly@example.com" isReadOnly />
              </ComponentSpec>
              <ComponentSpec name="With FormControl + label + helper">
                <FormControl>
                  <FormLabel fontSize="14px">Email</FormLabel>
                  <Input type="email" placeholder="you@example.com" />
                  <FormHelperText>We'll never share your email.</FormHelperText>
                </FormControl>
              </ComponentSpec>
              <ComponentSpec name="Disabled">
                <Input placeholder="Disabled" isDisabled />
              </ComponentSpec>
            </SimpleGrid>
          </PageSection>

          <PageSection id="email-password" title="Email & Password Inputs" description="Pre-styled wrappers — EmailInput sets autoComplete + lg size; PasswordInput adds eye toggle.">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <ComponentSpec name="EmailInput">
                <Input type="email" autoComplete="email" size="lg" placeholder="you@example.com" />
              </ComponentSpec>
              <ComponentSpec name="PasswordInput">
                <PasswordInputDemo />
              </ComponentSpec>
            </SimpleGrid>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/web/src/ui/core/EmailInput</PathTag> · <PathTag>apps/web/src/ui/core/PasswordInput</PathTag>
            </p>
          </PageSection>

          <PageSection id="searchinput" title="SearchInput" description="Debounced query, RbSearch left icon, '/' shortcut chip on desktop, clear button when text present, syncs to ?q= URL.">
            <ComponentSpec name="Default state">
              <InputGroup maxW="480px">
                <InputLeftElement pointerEvents="none">
                  <Search size={16} color="#8B807F" />
                </InputLeftElement>
                <Input placeholder="Search entries…" pr="60px" />
                <InputRightElement>
                  <Box as="kbd" px={1.5} py={0.5} rounded="sm" bg="bgSecondary" fontSize="11px" fontFamily="mono" color="brandGray.500">/</Box>
                </InputRightElement>
              </InputGroup>
            </ComponentSpec>
          </PageSection>

          <PageSection id="promptarea" title="PromptArea" description="Composite: relative box + pill label + autosizing textarea body.">
            <ComponentSpec name="PromptArea + PromptAreaLabel + PromptAreaText">
              <Box position="relative">
                <Box display="inline-block" px={2.5} py={1} rounded="md" bg="brandGray.100" fontSize="14px" fontWeight={500} color="brandGray.700" mb={2}>Question 1</Box>
                <Textarea placeholder="What's on your mind?" minH="80px" />
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="personalization-textarea" title="PersonalizationTextarea" description="SmallCapsHeading + tips popover + char counter; turns red over maxInputLength. Min height 140px.">
            <ComponentSpec name="With Tips popover">
              <Flex justify="space-between" align="center" mb={1.5}>
                <SmallCaps>Bio</SmallCaps>
                <ChakraLink fontSize="12px" color="brandGray.500" textDecoration="underline">Tips</ChakraLink>
              </Flex>
              <Textarea placeholder="Tell Rosebud about yourself…" minH="140px" />
              <Text textAlign="right" fontSize="12px" color="brandGray.500" mt={1}>0 / 500</Text>
            </ComponentSpec>
          </PageSection>

          <PageSection id="selectors" title="Selectors" description="Three settings-page selectors built on Chakra Select.">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <ComponentSpec name="LanguageSelector">
                <Select><option>English</option><option>Español</option><option>Français</option></Select>
              </ComponentSpec>
              <ComponentSpec name="ThemeSelector">
                <Select><option>Light</option><option>Dark</option><option>System</option></Select>
              </ComponentSpec>
              <ComponentSpec name="LocalTimeSelector">
                <Select><option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option></Select>
              </ComponentSpec>
            </SimpleGrid>
          </PageSection>

          <PageSection id="checkbox-radio-switch" title="Checkbox · Radio · Switch" description="Chakra primitives — used directly, not customized further.">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <ComponentSpec name="Checkbox">
                <Stack spacing={2}>
                  <Checkbox defaultChecked colorScheme="pink">Daily journaling</Checkbox>
                  <Checkbox colorScheme="pink">Weekly digest</Checkbox>
                  <Checkbox isDisabled>Disabled</Checkbox>
                </Stack>
              </ComponentSpec>
              <ComponentSpec name="Radio">
                <RadioGroup defaultValue="a">
                  <Stack spacing={2}>
                    <Radio value="a" colorScheme="pink">Option A</Radio>
                    <Radio value="b" colorScheme="pink">Option B</Radio>
                    <Radio value="c" colorScheme="pink">Option C</Radio>
                  </Stack>
                </RadioGroup>
              </ComponentSpec>
              <ComponentSpec name="Switch">
                <Stack spacing={3}>
                  <Switch defaultChecked colorScheme="pink" />
                  <Switch colorScheme="pink" />
                  <Switch isDisabled />
                </Stack>
              </ComponentSpec>
            </SimpleGrid>
          </PageSection>

          {/* ═══ FEEDBACK ═══ */}

          <PageSection id="alertdialog" title="AlertDialog" description="Confirmation dialog: title + message + confirm + optional cancel.">
            <ComponentSpec name="Open the dialog">
              <AlertDialogDemo />
            </ComponentSpec>
          </PageSection>

          <PageSection id="toast" title="MakeToast" description="Factory returning a UseToastOptions for a custom dark toast — top, 3s, closable, status icon, optional action.">
            <ComponentSpec name="Status variants (visual)">
              <Stack spacing={2} maxW="360px">
                {[
                  { status: 'success', icon: <Check size={16} color="#5ABA9D" />, text: 'Language updated' },
                  { status: 'error', icon: <X size={16} color="#EE584E" />, text: 'Failed to save' },
                  { status: 'warning', icon: <AlertTriangle size={16} color="#FEE886" />, text: 'Unsaved changes' },
                  { status: 'info', icon: <Info size={16} color="#90CDF4" />, text: 'Press / to search' },
                ].map(t => (
                  <Flex key={t.status} align="center" gap={2.5} px={3} py={2.5} rounded="lg" bg="brandGray.800" color="white">
                    {t.icon}
                    <Text fontSize="14px" flex={1}>{t.text}</Text>
                    <X size={14} style={{ opacity: 0.6, cursor: 'pointer' }} />
                  </Flex>
                ))}
              </Stack>
            </ComponentSpec>
            <CodeBlock>{`toast(MakeToast({ title: 'Language updated', status: 'success' }))`}</CodeBlock>
          </PageSection>

          <PageSection id="warningcard" title="WarningCard" description="Yellow horizontal card: bg yellow.50, border yellow.500, text yellow.900.">
            <ComponentSpec name="Default">
              <Flex align="center" gap={3} p={3} rounded="md" bg="yellow.100" border="1px solid" borderColor="yellow.500">
                <AlertTriangle size={20} color="#D4AD02" style={{ flexShrink: 0 }} />
                <Text fontSize="14px" color="yellow.900">This will cancel your subscription.</Text>
              </Flex>
            </ComponentSpec>
          </PageSection>

          <PageSection id="helpbubble" title="HelpBubble" description="16px info-circle that opens a tooltip on hover/click.">
            <ComponentSpec name="Inline label + bubble">
              <Flex align="center" gap={1.5}>
                <Text fontSize="14px">AI summaries</Text>
                <Tooltip label="Generated from your last 7 entries" hasArrow>
                  <Box as="span" cursor="pointer"><Info size={14} color="#8B807F" /></Box>
                </Tooltip>
              </Flex>
            </ComponentSpec>
          </PageSection>

          <PageSection id="coachmark" title="CoachMark" description="Onboarding popover keyed off a UserFlag. Gold-tinted (gold.50). Auto-fires after delay if all prerequisites are set.">
            <ComponentSpec name="Anchored to a button">
              <Box position="relative" display="inline-block">
                <Button variant="primary">Compose</Button>
                <Box position="absolute" top="48px" left="50%" transform="translateX(-50%)" w="240px" p={3} rounded="md" bg="gold.50" boxShadow="md" color="#494337">
                  <Text fontSize="13px" fontWeight={500} mb={1}>Tap to start writing</Text>
                  <Text fontSize="12px" opacity={0.8}>Your first entry takes about 2 minutes.</Text>
                </Box>
              </Box>
            </ComponentSpec>
          </PageSection>

          {/* ═══ DISPLAY ═══ */}

          <PageSection id="panel" title="Panel" description="Themed card surface. Base: 1px border, white/bg, p=4, rounded md, w=full.">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <ComponentSpec name="Default">
                <Box border="1px solid" borderColor="border" bg="bg" p={4} rounded="md" w="full">
                  <Text>Panel content goes here.</Text>
                </Box>
              </ComponentSpec>
              <ComponentSpec name="variant='hstack'">
                <Flex border="1px solid" borderColor="border" bg="bg" p={4} rounded="md" align="center" gap={3}>
                  <Circle size="32px" bg="brand.100">🌹</Circle>
                  <Text fontSize="14px" flex={1}>Inline horizontal layout</Text>
                  <ChevronRight size={16} color="#8B807F" />
                </Flex>
              </ComponentSpec>
            </SimpleGrid>
          </PageSection>

          <PageSection id="listview" title="ListView" description="Stacked card list with grouping headings and selectable rows.">
            <ComponentSpec name="Master-list pattern">
              <Box bg="bg" border="1px solid" borderColor="border" rounded="md" overflow="hidden" maxW="400px">
                <Box px={4} py={2} borderBottom="1px solid" borderBottomColor="borderList">
                  <SmallCaps>Today</SmallCaps>
                </Box>
                {[
                  { title: 'Morning gratitude', preview: '3 things I appreciated…', selected: true },
                  { title: 'Afternoon check-in', preview: 'Feeling a bit scattered…', selected: false },
                  { title: 'Quick prompt', preview: 'What gave me energy?', selected: false },
                ].map((row, i) => (
                  <Flex
                    key={i}
                    align="center"
                    gap={3}
                    px={4}
                    py={3}
                    borderBottom={i < 2 ? '1px solid' : 'none'}
                    borderBottomColor="borderList"
                    bg={row.selected ? 'bgSelected' : 'transparent'}
                    cursor="pointer"
                    _hover={!row.selected ? { bg: 'bgSecondary' } : {}}
                  >
                    <Box flex={1} minW={0}>
                      <Text fontSize="14px" fontWeight={500} noOfLines={1}>{row.title}</Text>
                      <Text fontSize="13px" color="textSecondary" noOfLines={1}>{row.preview}</Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="emptystate" title="EmptyPageState" description="Empty state inside a Panel: optional icon + header + label + before/after slots.">
            <ComponentSpec name="Default">
              <Box p={8} bg="bg" border="1px solid" borderColor="border" rounded="md" textAlign="center" maxW="400px">
                <Text fontSize="40px" mb={2}>📭</Text>
                <Heading as="h4" fontSize="17px" fontWeight={600} mb={1}>No entries yet</Heading>
                <Text fontSize="14px" color="textSecondary">Write your first journal entry to get started.</Text>
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="smallcaps" title="SmallCapsHeading" description="The system-wide section label: 12px Outfit, uppercase, color tertiary, weight 500.">
            <ComponentSpec name="Examples">
              <Stack spacing={3}>
                {['Features', 'Today', 'Account', 'Reminders'].map(t => (
                  <SmallCaps key={t}>{t}</SmallCaps>
                ))}
              </Stack>
            </ComponentSpec>
          </PageSection>

          <PageSection id="pricingfeature" title="PricingFeature" description="Comparison-table row: feature label + HelpBubble + two 40×40 cells (Premium / Bloom).">
            <ComponentSpec name="Header + 3 feature rows">
              <Box bg="bg" border="1px solid" borderColor="border" rounded="md" overflow="hidden" maxW="480px">
                <Box display="grid" gridTemplateColumns="1fr 64px 64px" alignItems="center" px={4} py={2.5} borderBottom="1px solid" borderBottomColor="borderList">
                  <SmallCaps>Features</SmallCaps>
                  <Text textAlign="center" fontSize="13px" fontWeight={600} color="brand.500">Premium</Text>
                  <Text textAlign="center" fontSize="13px" fontWeight={600} color="bloom.500">Bloom</Text>
                </Box>
                {[
                  ['Daily prompts', true, true],
                  ['Long-term memory', false, true],
                  ['Voice journaling', false, true],
                ].map(([label, prem, bloom], i) => (
                  <Box key={i} display="grid" gridTemplateColumns="1fr 64px 64px" alignItems="center" px={4} py={3} borderBottom={i < 2 ? '1px solid' : 'none'} borderBottomColor="borderList">
                    <Flex align="center" gap={1.5}>
                      <Text fontSize="14px">{label}</Text>
                      <Info size={12} color="#8B807F" />
                    </Flex>
                    <Flex justify="center">
                      <Center32 bg={prem ? 'brand.100' : 'bgSecondary'}>{prem ? <Check size={16} color="#E31665" /> : <Text color="brandGray.400">—</Text>}</Center32>
                    </Flex>
                    <Flex justify="center">
                      <Center32 bg={bloom ? 'bloom.100' : 'bgSecondary'}>{bloom ? <Check size={16} color="#ECB02D" /> : <Text color="brandGray.400">—</Text>}</Center32>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="thumbvote" title="ThumbVote" description="Inline 👍/👎 feedback with debounced analytics + toast.">
            <ComponentSpec name="Both / dislike-only">
              <Flex align="center" gap={4}>
                <HStack spacing={2}>
                  <IconButton variant="ghost" size="sm" icon={<ThumbsUp size={16} />} aria-label="like" />
                  <IconButton variant="ghost" size="sm" icon={<ThumbsDown size={16} />} aria-label="dislike" />
                </HStack>
                <Text fontSize="12px" color="textSecondary">only='dislike'</Text>
                <IconButton variant="ghost" size="sm" icon={<ThumbsDown size={16} />} aria-label="dislike" />
              </Flex>
            </ComponentSpec>
          </PageSection>

          <PageSection id="tags-badges-avatar" title="Tag · Badge · Avatar" description="Stock Chakra primitives, lightly themed.">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <ComponentSpec name="Tag">
                <Flex gap={2} wrap="wrap">
                  <Tag>Mindfulness</Tag>
                  <Tag colorScheme="pink">Bloom</Tag>
                  <Tag colorScheme="green">Active</Tag>
                </Flex>
              </ComponentSpec>
              <ComponentSpec name="Badge (settings)">
                <Flex gap={2} wrap="wrap">
                  <Badge colorScheme="red">Unverified</Badge>
                  <Badge bg="bloom.100" color="bloom.900">Bloom</Badge>
                  <Badge>Staff-only</Badge>
                </Flex>
              </ComponentSpec>
              <ComponentSpec name="Avatar">
                <HStack spacing={3}>
                  <Avatar size="sm" name="Grace Guo" />
                  <Avatar size="md" name="Grace Guo" bg="brand.500" />
                  <Avatar size="lg" name="Grace Guo" />
                </HStack>
              </ComponentSpec>
            </SimpleGrid>
          </PageSection>

          <PageSection id="tabs" title="Tabs" description="Default (text + 2px bottom border on selected) and `toggle` (pill segmented).">
            <SubSection title="Default variant">
              <ComponentSpec name="3 tabs">
                <Tabs>
                  <TabList>
                    <Tab>Journals</Tab>
                    <Tab>Prompts</Tab>
                    <Tab>Saved</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel><Text fontSize="14px" color="textSecondary">Journals tab content</Text></TabPanel>
                    <TabPanel><Text fontSize="14px" color="textSecondary">Prompts tab content</Text></TabPanel>
                    <TabPanel><Text fontSize="14px" color="textSecondary">Saved tab content</Text></TabPanel>
                  </TabPanels>
                </Tabs>
              </ComponentSpec>
            </SubSection>
            <SubSection title="Toggle variant (pill segmented)">
              <ComponentSpec name="Monthly / Yearly">
                <Flex display="inline-flex" rounded="full" bg="gray.100" p={1}>
                  <Button variant="ghost" size="sm" rounded="full" bg="white" boxShadow="sm">Monthly</Button>
                  <Button variant="ghost" size="sm" rounded="full" color="brandGray.500">Yearly</Button>
                </Flex>
              </ComponentSpec>
            </SubSection>
          </PageSection>

          <PageSection id="menu" title="Menu" description="Variants: control (icon button trigger), title (17px on mobile). No shadow.">
            <ComponentSpec name="Open menu">
              <Menu>
                <MenuButton as={Button} variant="outline" rightIcon={<ChevronDown size={14} />}>Options</MenuButton>
                <MenuList>
                  <MenuItem>Edit</MenuItem>
                  <MenuItem>Duplicate</MenuItem>
                  <MenuItem>Move to…</MenuItem>
                  <MenuItem color="red.500">Delete</MenuItem>
                </MenuList>
              </Menu>
            </ComponentSpec>
          </PageSection>

          <PageSection id="accordion" title="Accordion" description="Transparent borderless container, bottom dividers, panel padding 4, fontSize 17px.">
            <ComponentSpec name="Two items">
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex={1} textAlign="left" fontSize="17px">What is Rosebud?</Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>An AI-powered journaling companion that turns daily reflection into pattern recognition.</AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex={1} textAlign="left" fontSize="17px">How does the free tier work?</Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>You get 3 entries per week. Premium and Bloom unlock unlimited entries and deeper insights.</AccordionPanel>
                </AccordionItem>
              </Accordion>
            </ComponentSpec>
          </PageSection>

          <PageSection id="modal" title="Modal / Drawer (DrawerOrModal)" description="Polymorphic adapter: Drawer (bottom) on mobile (<lg), Modal on desktop. All app modals build on this.">
            <ComponentSpec name="Open the modal">
              <ModalDemo />
            </ComponentSpec>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              Used by: <PathTag>SignUpModal</PathTag> · <PathTag>FeatureUpgradeModal</PathTag> · <PathTag>MemoryModal</PathTag> · <PathTag>FeedbackModal</PathTag> · <PathTag>InstallAppModal</PathTag> · <PathTag>NewJournalModal</PathTag> · <PathTag>ReferralModal</PathTag> · <PathTag>WhatsNewModal</PathTag>
            </p>
          </PageSection>

          {/* ═══ AUTH & INSTALL ═══ */}

          <PageSection id="auth-buttons" title="Auth Buttons" description="Outline variant, lg, full-width, vendor icon left.">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <ComponentSpec name="GoogleAuthButton">
                <Button variant="outline" size="lg" w="full" leftIcon={<Box as="span" fontWeight={700}>G</Box>}>
                  Continue with Google
                </Button>
              </ComponentSpec>
              <ComponentSpec name="AppleAuthButton">
                <Button variant="outline" size="lg" w="full" leftIcon={<Box as="span" fontSize="18px"></Box>}>
                  Continue with Apple
                </Button>
              </ComponentSpec>
            </SimpleGrid>
          </PageSection>

          <PageSection id="mobile-install" title="MobileAppInstallButtons" description="Two primary buttons opening TestFlight / Play Store.">
            <ComponentSpec name="Side-by-side">
              <ButtonGroup spacing={3}>
                <Button bg="brandGray.800" color="white" size="lg" _hover={{ bg: 'brandGray.700' }}> App Store</Button>
                <Button bg="brandGray.800" color="white" size="lg" _hover={{ bg: 'brandGray.700' }}> Play Store</Button>
              </ButtonGroup>
            </ComponentSpec>
          </PageSection>

          {/* ═══ BLOCKS ═══ */}

          <PageSection id="heading-block" title="HeadingBlock" description="Inline editable heading textarea (24px, weight 600, autosize, persists on blur).">
            <ComponentSpec name="Editable">
              <Input variant="unstyled" fontSize="24px" fontWeight={600} defaultValue="Run a half marathon" borderBottom="1px solid transparent" _focus={{ borderBottom: '1px solid', borderColor: 'border' }} />
            </ComponentSpec>
          </PageSection>

          <PageSection id="goal-block" title="GoalBlock" description="Animated card: emoji + title + interval Tag + description + Commit button.">
            <ComponentSpec name="Suggested goal (commit state)">
              <Box bg="bg" border="1px solid" borderColor="border" rounded="md" p={5} maxW="420px">
                <HStack align="start" spacing={3}>
                  <Circle size="40px" bg="brand.100" fontSize="20px">💪</Circle>
                  <Box flex={1}>
                    <HStack spacing={2} mb={1}>
                      <Heading as="h4" fontSize="16px" fontWeight={600}>10 push-ups before bed</Heading>
                      <Tag size="sm">Daily</Tag>
                    </HStack>
                    <Text fontSize="14px" color="textSecondary">Build a tiny consistency loop tied to an existing routine.</Text>
                  </Box>
                </HStack>
                <Divider my={4} />
                <Button variant="primary" w="full">Commit</Button>
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="objective-block" title="ObjectiveBlock" description="Card with emoji-in-circle inside green CircularProgress (computed from deadline), Outfit heading, description, deadline + days-left footer.">
            <ComponentSpec name="Default">
              <Box bg="bg" border="1px solid" borderColor="border" rounded="md" p={5} maxW="420px">
                <HStack align="start" spacing={4}>
                  <CircularProgress value={66} color="green.500" trackColor="bgSecondary" size="64px" thickness="6px">
                    <CircularProgressLabel fontSize="24px">🏃</CircularProgressLabel>
                  </CircularProgress>
                  <Box flex={1}>
                    <Heading as="h4" fontFamily="Outfit, system-ui, sans-serif" fontSize="19px" fontWeight={600} mb={0.5}>Half marathon</Heading>
                    <Text fontSize="14px" color="textSecondary" mb={2}>Train consistently to 13.1 miles by spring.</Text>
                    <HStack spacing={2} fontSize="12px" color="brandGray.500">
                      <Calendar size={12} />
                      <Text>April 15</Text>
                      <Text></Text>
                      <Text>42 days left</Text>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </ComponentSpec>
          </PageSection>

          {/* ═══ CHROME ═══ */}

          <PageSection id="desktop-nav" title="DesktopNavigationBar" description="Top bar: logo + tier label, GlobalTabNavigation, primary Write button, gift, hamburger menu.">
            <ComponentSpec name="Schematic">
              <Flex h="56px" align="center" px={4} gap={4} bg="bg" border="1px solid" borderColor="border" rounded="md">
                <Heading fontSize="16px" fontWeight={600} color="brand.500">rosebud</Heading>
                <SmallCaps color="bloom.500">Bloom</SmallCaps>
                <HStack ml="auto" spacing={5} fontSize="14px" color="brandGray.700">
                  <Text color="text" fontWeight={500} borderBottom="2px solid" borderColor="brand.500" pb="18px" mb="-18px">Today</Text>
                  <Text>Explore</Text>
                  <Text>Entries</Text>
                </HStack>
                <Button ml={4} variant="primary" size="sm" leftIcon={<Pencil size={14} />}>Write</Button>
              </Flex>
            </ComponentSpec>
          </PageSection>

          <PageSection id="tabbar" title="GlobalTabNavigation (mobile bottom tab bar)" description="Today · Explore · Write (FAB-style brand.500 circle 66px) · Entries · Settings.">
            <ComponentSpec name="Schematic">
              <Flex position="relative" h="80px" bg="bg" border="1px solid" borderColor="border" rounded="md" align="center" justify="space-around" px={4}>
                {['Today', 'Explore'].map(l => <Text key={l} fontSize="11px" color="textSecondary">{l}</Text>)}
                <Circle size="66px" bg="brand.500" color="white" mt="-20px" boxShadow="0px 4px 12px rgba(0,0,0,0.15)">
                  <Pencil size={24} />
                </Circle>
                {['Entries', 'Settings'].map(l => <Text key={l} fontSize="11px" color="textSecondary">{l}</Text>)}
              </Flex>
            </ComponentSpec>
          </PageSection>

          <PageSection id="mobile-navbar" title="NavigationBar (mobile)" description="Sticky page header (54-56px, blurred glass), centered title, back button if previous view exists.">
            <ComponentSpec name="Schematic">
              <Flex h="56px" align="center" px={4} bg="bg" border="1px solid" borderColor="border" rounded="md" backdropFilter="blur(7px) saturate(180%)">
                <Box transform="rotate(180deg)"><ChevronRight size={18} /></Box>
                <Text flex={1} textAlign="center" fontSize="16px" fontWeight={600}>Settings</Text>
                <MoreHorizontal size={18} />
              </Flex>
            </ComponentSpec>
          </PageSection>

          <PageSection id="topbar" title="TopBar" description="Generic 56px top bar inside modals/Compose: back chevron + title + optional rightAction.">
            <ComponentSpec name="Inside Compose">
              <Flex h="56px" align="center" px={4} bg="bg" border="1px solid" borderColor="border" rounded="md">
                <Box transform="rotate(180deg)"><ChevronRight size={18} /></Box>
                <Text flex={1} textAlign="center" fontSize="16px" fontWeight={600}>New entry</Text>
                <Button variant="ghost" size="sm" color="brand.500">Save</Button>
              </Flex>
            </ComponentSpec>
          </PageSection>

          <PageSection id="pageheading" title="PageHeading" description="Desktop-only (md+) h1, 20px / weight 600.">
            <ComponentSpec name="Default">
              <Heading as="h1" fontSize="20px" fontWeight={600}>Settings</Heading>
            </ComponentSpec>
          </PageSection>

          <PageSection id="pageloading" title="PageLoading" description="Centered Chakra Spinner filling 100vh.">
            <ComponentSpec name="Spinner">
              <Flex align="center" justify="center" h="120px">
                <Spinner size="lg" color="brand.500" thickness="3px" />
              </Flex>
            </ComponentSpec>
          </PageSection>

          {/* ═══ PATTERNS ═══ */}

          <PageSection id="p-onboarding" title="Pattern · Onboarding Hero" description="Full-bleed hero: background, white logo, 34px Outfit headline, 60px white CTA.">
            <ComponentSpec name="Layout">
              <Flex direction="column" align="center" justify="center" textAlign="center" px={6} h="420px" rounded="lg" bgGradient="linear(to-b, brand.100, gold.100)">
                <Heading fontFamily="Outfit, system-ui, sans-serif" fontSize="34px" fontWeight={700} mb={3}>Welcome to Rosebud</Heading>
                <Text fontSize="20px" color="textSecondary" mb={6} maxW="480px">The #1 AI-powered journal for personal growth and mental health</Text>
                <Button h="60px" px={8} bg="white" color="text" fontSize="19px" fontWeight={500} rightIcon={<ArrowRight size={20} />} boxShadow="md" _hover={{ transform: 'translateY(-2px)' }}>Begin your journey</Button>
                <ChakraLink mt={4} fontSize="14px" color="textSecondary" textDecoration="underline">I already have an account</ChakraLink>
              </Flex>
            </ComponentSpec>
            <p className="mt-[12px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/web/src/ui/pages/onboarding/OnboardingCTA</PathTag>
            </p>
          </PageSection>

          <PageSection id="p-compose" title="Pattern · ComposeContainer" description="640px wide on md+, full-bleed on mobile, shadow 0px 0px 16px rgba(0,0,0,0.05), rounded lg, 1px brandGray.300 border.">
            <ComponentSpec name="Schematic">
              <Box mx="auto" w="full" maxW="640px" bg="bg" border="1px solid" borderColor="border" rounded="lg" boxShadow="0px 0px 16px rgba(0,0,0,0.05)" minH="320px">
                <Flex h="56px" align="center" px={4} borderBottom="1px solid" borderBottomColor="borderList">
                  <Box transform="rotate(180deg)"><ChevronRight size={18} /></Box>
                  <Text flex={1} textAlign="center" fontSize="16px" fontWeight={600}>Compose</Text>
                </Flex>
                <Box p={6}>
                  <Text fontSize="14px" color="textSecondary">Compose body — questions, prompts, response inputs.</Text>
                </Box>
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="p-auth-form" title="Pattern · Auth Form" description="VStack of FormLabel + EmailEntry/PasswordEntry, primary submit, GoogleAuthButton + AppleAuthButton.">
            <ComponentSpec name="Sign in">
              <Stack maxW="400px" spacing={3}>
                <FormControl>
                  <FormLabel fontSize="14px">Email</FormLabel>
                  <Input type="email" size="lg" placeholder="you@example.com" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="14px">Password</FormLabel>
                  <PasswordInputDemo />
                </FormControl>
                <Button variant="primary" size="lg" mt={2}>Sign In</Button>
                <Button variant="outline" size="lg" leftIcon={<Box as="span" fontWeight={700}>G</Box>}>Continue with Google</Button>
                <Button variant="outline" size="lg" leftIcon={<Box as="span"></Box>}>Continue with Apple</Button>
              </Stack>
            </ComponentSpec>
          </PageSection>

          <PageSection id="p-settings" title="Pattern · Settings Section" description="Each Section is a Panel with icon + 16/600 title + optional Badge + SectionBody.">
            <ComponentSpec name="One section">
              <Box maxW="480px" bg="bg" border="1px solid" borderColor="border" rounded="md" p={4}>
                <HStack mb={3}>
                  <Box color="brandGray.700"><Bell size={20} /></Box>
                  <Heading as="h4" fontSize="16px" fontWeight={600}>Long-term memory</Heading>
                  <Badge ml="auto" bg="bloom.100" color="bloom.900">Bloom</Badge>
                </HStack>
                <Text fontSize="14px" color="textSecondary">Rosebud remembers context across entries to surface deeper patterns over time.</Text>
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="p-pricing" title="Pattern · Pricing Comparison" description="Vertical PricingFeature rows — header + one row per feature.">
            <Text fontSize="13px" color="textSecondary">See the <ChakraLink href="#pricingfeature" variant="primary">PricingFeature</ChakraLink> example above.</Text>
          </PageSection>

          <PageSection id="p-paywall" title="Pattern · FeatureUpgradeModal (paywall)" description="Top hero band with linear-gradient, Bloom badge, 34px Outfit headline, FeaturesListItem bullets, sticky monthly/yearly toggle + CTA.">
            <ComponentSpec name="Modal layout">
              <Box maxW="420px" mx="auto" bg="bg" border="1px solid" borderColor="border" rounded="lg" overflow="hidden" boxShadow="lg">
                <Box px={6} pt={6} pb={10} bgGradient="linear(to-b, #FFFDF2, gold.100)" position="relative">
                  <Tag bg="green.500" color="white" textTransform="uppercase" fontSize="11px" fontWeight={700} letterSpacing="0.06em" mb={3}>Rosebud Bloom</Tag>
                  <Heading fontFamily="Outfit, system-ui, sans-serif" fontSize="34px" lineHeight="40px" fontWeight={700}>Unlock Bloom</Heading>
                  <Text fontSize="15px" color="textSecondary" mt={2} maxW="260px">Deeper insights, long-term memory, and unlimited journaling.</Text>
                </Box>
                <Box p={6}>
                  <Stack spacing={2.5} fontSize="14px" mb={4}>
                    {['Unlimited entries', 'Long-term memory', 'Voice journaling'].map(t => (
                      <HStack key={t} spacing={2}>
                        <Check size={16} color="#5ABA9D" />
                        <Text>{t}</Text>
                      </HStack>
                    ))}
                  </Stack>
                  <Flex display="inline-flex" rounded="full" bg="gray.100" p={1} mb={4}>
                    <Button variant="ghost" size="sm" rounded="full" fontSize="12px" color="brandGray.500">Monthly</Button>
                    <Button variant="ghost" size="sm" rounded="full" fontSize="12px" bg="white" boxShadow="sm">Yearly · Save 30%</Button>
                  </Flex>
                  <Button variant="primary" size="lg" w="full">Start 7-day free trial</Button>
                  <Text mt={2} fontSize="11px" color="textSecondary" textAlign="center">$X.XX/yr after trial. Cancel anytime.</Text>
                </Box>
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="p-splitview" title="Pattern · NavigationSplitView" description="Two-pane master/detail: 360px sidebar (md+), mobile-stacked. Used by the Journal browser.">
            <ComponentSpec name="Schematic">
              <Box display="grid" gridTemplateColumns="200px 1fr" bg="bg" border="1px solid" borderColor="border" rounded="md" overflow="hidden" h="280px">
                <Box borderRight="1px solid" borderRightColor="borderList">
                  <Box px={3} py={2} borderBottom="1px solid" borderBottomColor="borderList">
                    <SmallCaps>Today</SmallCaps>
                  </Box>
                  {['Morning gratitude', 'Afternoon check-in', 'Quick prompt'].map((t, i) => (
                    <Box key={i} px={3} py={2.5} fontSize="13px" bg={i === 0 ? 'bgSelected' : 'transparent'} fontWeight={i === 0 ? 500 : 400} color={i === 0 ? 'text' : 'textSecondary'}>{t}</Box>
                  ))}
                </Box>
                <Box p={4}>
                  <Heading as="h4" fontSize="17px" fontWeight={600}>Morning gratitude</Heading>
                  <Text fontSize="14px" color="textSecondary" mt={1.5}>Three things I appreciated about the day so far…</Text>
                </Box>
              </Box>
            </ComponentSpec>
          </PageSection>

          <PageSection id="p-banners" title="Pattern · Banners" description="Three top-of-page promo banners.">
            <Stack spacing={2}>
              <Flex px={4} py={2.5} rounded="md" align="center" gap={2} bg="yellow.100" color="yellow.900">
                <AlertTriangle size={16} />
                <Text fontSize="14px">Your subscription is past due. Update payment method.</Text>
                <ChakraLink ml="auto" fontSize="13px" textDecoration="underline">Update</ChakraLink>
              </Flex>
              <Flex px={4} py={2.5} rounded="md" align="center" gap={2} bg="green.500" color="white">
                <Text fontSize="14px">🚀 We're live on Product Hunt today!</Text>
                <ChakraLink ml="auto" fontSize="13px" textDecoration="underline" color="white">Upvote</ChakraLink>
              </Flex>
              <Flex px={4} py={2.5} rounded="md" align="center" gap={2} bg="brandGray.800" color="white">
                <Text fontSize="14px">📱 Get Rosebud on iOS and Android</Text>
                <ChakraLink ml="auto" fontSize="13px" textDecoration="underline" color="white">Install</ChakraLink>
                <X size={14} style={{ opacity: 0.6, cursor: 'pointer' }} />
              </Flex>
            </Stack>
          </PageSection>

          {/* ═══ ASSETS ═══ */}

          <PageSection id="rb-icons" title="Rb* Icons" description="63 custom SVG icons + 5 brand marks in apps/web/src/ui/shared/Icon/index.tsx. Not yet ported into this repo — use lucide-react as a stand-in.">
            <SubSection title="Available names (in rosebud-react)">
              <SimpleGrid columns={{ base: 3, sm: 4, md: 6 }} spacing={2}>
                {[
                  'RbLogo', 'RbPencil', 'RbSun', 'RbExplore', 'RbEntries', 'RbSettings', 'RbSearch',
                  'RbCheckmark', 'RbCross', 'RbHeart', 'RbThumbsUp', 'RbThumbsDown', 'RbBookmark',
                  'RbBookmarkFill', 'RbStarStroke', 'RbStarFill', 'RbMicrophone', 'RbStop', 'RbPause',
                  'RbPlay', 'RbSparkle', 'RbBolt', 'RbMemory', 'RbConnected', 'RbInvite', 'RbExport',
                  'RbTrash', 'RbWarning', 'RbChevronDown', 'RbChevronUp', 'RbCalendarFill',
                  'RbClock', 'RbVerify', 'RbRedo', 'RbRegenerate', 'RbGoDeeper', 'RbManifest',
                  'RbConfig', 'RbSummary', 'RbJournal', 'RbModeFocused', 'RbModeInteractive',
                  'RbCheckmarkCircleFill', 'RbXCircleOutline', 'RbMountain', 'RbRadar',
                  'RbEightPointStar', 'RbVolumeLow', 'RbCallSlash', 'RbPhone', 'RbPhoneCalling',
                  'RbInvincibility', 'RbNotifications', 'RbEllipseVertical', 'RbSend', 'RbShare', 'RbPlus',
                ].map(n => (
                  <Box key={n} px={2.5} py={1.5} rounded="sm" bg="bg" border="1px solid" borderColor="border" fontSize="11px" fontFamily="mono" noOfLines={1}>{n}</Box>
                ))}
              </SimpleGrid>
            </SubSection>
            <SubSection title="Brand marks">
              <HStack spacing={2.5} wrap="wrap">
                {['TwitterIcon', 'DiscordIcon', 'GoogleIcon', 'AppleIcon'].map(n => (
                  <Box key={n} px={2.5} py={1.5} rounded="sm" bg="bg" border="1px solid" borderColor="border" fontSize="11px" fontFamily="mono">{n}</Box>
                ))}
              </HStack>
            </SubSection>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              <PathTag>apps/web/src/ui/shared/Icon/index.tsx</PathTag>
            </p>
          </PageSection>

          <PageSection id="modals-index" title="Modals Index" description="Every modal in apps/web/src/ui/shared/modals — all built on the DrawerOrModal adapter.">
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
              {[
                'AddEditGoal', 'AppLaunchAug6Modal', 'DrawerOrModal', 'FeatureUpgradeModal',
                'FeedbackModal', 'InstallAppModal', 'MemoryModal', 'MicPermissionsModal',
                'MobilePreOrderModal', 'NewJournalModal', 'NotificationPromoModal',
                'ProductSatisfactionSurveyModal', 'PushNotificationModal', 'ReferralModal',
                'SignUpModal', 'WhatsNewModal',
              ].map(n => (
                <Box key={n} px={2.5} py={1.5} rounded="sm" bg="bg" border="1px solid" borderColor="border" fontSize="12px" fontFamily="mono">{n}</Box>
              ))}
            </SimpleGrid>
          </PageSection>

        </main>
      </div>

      <footer className="border-t border-[var(--color-outline-light)] py-[32px] text-center text-[12px] text-[var(--color-secondary-text)]">
        Rosebud Web Design System · Sourced from rosebud-react/apps/web · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

/* ── Small interactive demos ── */

function ChakraThemeToggle({ theme, setTheme }) {
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode(theme);
  }, [theme, setColorMode]);
  return (
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      className="p-[8px] rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] text-[var(--color-on-surface)] hover:opacity-80 transition-opacity cursor-pointer"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function PasswordInputDemo() {
  const [shown, setShown] = useState(false);
  return (
    <InputGroup size="lg">
      <Input type={shown ? 'text' : 'password'} defaultValue="hunter2hunter2" pr="60px" />
      <InputRightElement width="60px">
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={shown ? 'Hide password' : 'Show password'}
          icon={shown ? <EyeOff size={16} /> : <Eye size={16} />}
          onClick={() => setShown(s => !s)}
        />
      </InputRightElement>
    </InputGroup>
  );
}

function AlertDialogDemo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button variant="outline" onClick={onOpen}>Open delete dialog</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="17px" fontWeight={600}>Delete entry?</ModalHeader>
          <ModalBody>
            <Text fontSize="14px" color="textSecondary">This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={2} onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={onClose}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function ModalDemo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button variant="primary" onClick={onOpen}>Open modal</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="19px" fontWeight={600}>Modal title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="15px" color="textSecondary">Modal body content. Drawer-on-mobile slides up from the bottom with the same content.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={2} onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={onClose}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function Center32({ children, bg }) {
  return (
    <Box w="32px" h="32px" rounded="md" bg={bg} display="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
}
