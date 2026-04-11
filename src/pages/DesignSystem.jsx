import { useState, useEffect } from 'react';
import { Sun, Moon, ChevronRight } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import {
  Button, Input, Textarea, Searchbar, Switch, Checkbox, RadioButton,
  SegmentedControl, CheckboxCard, Pill, Avatar, Tag, Snackbar, Infobar, Card,
} from '../components';
import {
  JournalEntry, StreakCard, ValueCard, DailyPromptCard, QuoteCard,
  ReflectionCard, InsightCard, HaikuCard, AskRosebudCard, KeyThemeCard,
  WeeklyReportLocked, LockedFeatureCard, UpgradeCard, PersonaCard,
  GoalsCard, FeedbackPromptCard, EmotionalLandscapeCard, EntryDraftCard,
  GratitudeChallengeCard, LoadingCard,
} from '../components/cards';

/* ══════════════════════════════════════════════════════════
   NAVIGATION STRUCTURE
   Modeled after Material Design 3 + Shopify Polaris:
   Foundations → Components (grouped by function)
   ══════════════════════════════════════════════════════════ */

const NAV = [
  {
    group: 'Foundations',
    items: [
      { id: 'colors', label: 'Colors' },
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
      { id: 'buttons', label: 'Button' },
      { id: 'button-pill', label: 'Button / Pill' },
    ],
  },
  {
    group: 'Input & Selection',
    items: [
      { id: 'input', label: 'Input' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'searchbar', label: 'Searchbar' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'checkbox-card', label: 'Checkbox Card' },
      { id: 'radio', label: 'Radio Button' },
      { id: 'switch', label: 'Switch' },
      { id: 'segmented', label: 'Segmented Control' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { id: 'snackbar', label: 'Snackbar' },
      { id: 'infobar', label: 'Infobar' },
    ],
  },
  {
    group: 'Display',
    items: [
      { id: 'cards', label: 'Card' },
      { id: 'pills', label: 'Pill' },
      { id: 'tags', label: 'Tag' },
      { id: 'avatars', label: 'Avatar' },
    ],
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

function Section({ id, title, description, children }) {
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

function ComponentSpec({ name, children }) {
  return (
    <div className="p-[24px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
      <p className="text-[12px] leading-[16px] font-[500] text-[var(--color-secondary-text)] uppercase tracking-wider mb-[16px]">{name}</p>
      {children}
    </div>
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
  const [theme, setTheme] = useState('light');
  const [activeSection, setActiveSection] = useState('colors');
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

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <TopNav
        alwaysVisible
        className="bg-[var(--color-background)]/95"
        rightSlot={
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="p-[8px] rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] text-[var(--color-on-surface)] hover:opacity-80 transition-opacity cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        }
      />

      <div className="max-w-[1400px] mx-auto flex">
        {/* ── Sidebar ── */}
        <nav className="hidden lg:block w-[200px] shrink-0 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto border-r border-[var(--color-outline-light)] py-[24px] px-[12px]">
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

          {/* ═══ FOUNDATIONS ═══ */}

          {/* Colors */}
          <Section id="colors" title="Colors" description="The color system defines the core palette used across UI, brand, and marketing. Semantic tokens adapt to light and dark themes.">
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

          {/* Typography */}
          <Section id="typography" title="Typography" description="Circular Std is the primary typeface. Weights: Book (450), Medium (500), Bold (700).">
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
          </Section>

          {/* Spacing */}
          <Section id="spacing" title="Spacing" description="4px modular scale for consistent rhythm. Named by multiplier (1 = 4px).">
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
          </Section>

          {/* Radius */}
          <Section id="radius" title="Radius" description="Consistent corner rounding to create a friendly, approachable visual language.">
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
          </Section>

          {/* Borders */}
          <Section id="borders" title="Borders" description="A limited set of border widths for visual clarity and consistency.">
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

          {/* ═══ ACTIONS ═══ */}

          <Section id="buttons" title="Button" description="5 types × 3 sizes × 3 states × 3 icon modes = 117 variants. Font: 16px/500 Circular Std.">
            <SubSection title="Types">
              <ComponentSpec name="Default state">
                <div className="flex flex-wrap items-center gap-[12px]">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="tertiary">Tertiary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="naked">Naked</Button>
                </div>
              </ComponentSpec>
            </SubSection>
            <SubSection title="Sizes">
              <ComponentSpec name="Primary button at each size">
                <div className="flex flex-wrap items-center gap-[12px]">
                  <Button size="small">Small (36px)</Button>
                  <Button size="regular">Regular (44px)</Button>
                  <Button size="large">Large (48px)</Button>
                </div>
              </ComponentSpec>
            </SubSection>
            <SubSection title="With Icon">
              <ComponentSpec name="Icon variants">
                <div className="flex flex-wrap items-center gap-[12px]">
                  <Button icon={<IconPlus />}>With icon</Button>
                  <Button icon={<IconPlus />} iconOnly aria-label="Add" />
                  <Button variant="secondary" icon={<IconPlus />}>Secondary</Button>
                  <Button variant="naked" icon={<IconPlus />} iconOnly aria-label="More" />
                </div>
              </ComponentSpec>
            </SubSection>
            <SubSection title="States">
              <ComponentSpec name="Disabled state">
                <div className="flex flex-wrap items-center gap-[12px]">
                  <Button disabled>Primary</Button>
                  <Button variant="secondary" disabled>Secondary</Button>
                  <Button variant="tertiary" disabled>Tertiary</Button>
                  <Button variant="destructive" disabled>Destructive</Button>
                  <Button variant="naked" disabled>Naked</Button>
                </div>
              </ComponentSpec>
            </SubSection>
            <SubSection title="Specs">
              <TokenTable
                headers={['Size', 'Height', 'Radius', 'Padding (text)', 'Padding (icon only)']}
                rows={[
                  ['Small', '36px', '8px', '8/24', '8/8'],
                  ['Regular', '44px', '12px', '10/32', '10/10'],
                  ['Large', '48px', '12px', '12/32', '12/12'],
                ]}
              />
            </SubSection>
          </Section>

          <Section id="button-pill" title="Button / Pill" description="Pill-shaped button variant. Radius: 999px, height: 36px.">
            <ComponentSpec name="Pill button states">
              <div className="flex flex-wrap items-center gap-[12px]">
                <Button variant="tertiary" size="small" className="!rounded-full">Pill Default</Button>
                <Button variant="tertiary" size="small" className="!rounded-full" disabled>Pill Disabled</Button>
              </div>
            </ComponentSpec>
          </Section>

          {/* ═══ INPUT & SELECTION ═══ */}

          <Section id="input" title="Input" description="Height: 56px, radius: 12px, padding: 16px. 6 states: Default, Active, Filled, Active Filled, Disabled, Disabled Filled.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <ComponentSpec name="Default">
                <Input placeholder="Placeholder text" />
              </ComponentSpec>
              <ComponentSpec name="With label + helper">
                <Input label="Email" placeholder="you@example.com" helper="We'll never share your email." />
              </ComponentSpec>
              <ComponentSpec name="Error">
                <Input label="Password" placeholder="Enter password" error="This field is required" />
              </ComponentSpec>
              <ComponentSpec name="Disabled">
                <Input label="Name" placeholder="Disabled input" disabled />
              </ComponentSpec>
            </div>
          </Section>

          <Section id="textarea" title="Textarea" description="Min height: 120px, radius: 12px, padding: 16/16/6/16.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <ComponentSpec name="Default">
                <Textarea placeholder="Write something…" />
              </ComponentSpec>
              <ComponentSpec name="With error">
                <Textarea label="Journal Entry" placeholder="Start writing…" error="Entry is too short" />
              </ComponentSpec>
            </div>
          </Section>

          <Section id="searchbar" title="Searchbar" description="Height: 56px, radius: 12px, with search icon. States: Default, Active, Filled, Searching, Disabled.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <ComponentSpec name="Default">
                <Searchbar placeholder="Search entries…" />
              </ComponentSpec>
              <ComponentSpec name="Disabled">
                <Searchbar placeholder="Search…" disabled />
              </ComponentSpec>
            </div>
          </Section>

          <Section id="checkbox" title="Checkbox" description="24×24px. Label font: 14px/450. Item spacing: 12px.">
            <ComponentSpec name="States">
              <div className="flex flex-col gap-[16px]">
                <Checkbox checked={checkboxOn} onChange={setCheckboxOn} label="Accept terms" />
                <Checkbox checked disabled label="Disabled checked" />
                <Checkbox checked={false} disabled label="Disabled unchecked" />
              </div>
            </ComponentSpec>
          </Section>

          <Section id="checkbox-card" title="Checkbox Card" description="Height: 56px, radius: 12px, padding: 16px. Selected state has 1px border.">
            <ComponentSpec name="States">
              <div className="flex flex-col gap-[12px] max-w-[400px]">
                <CheckboxCard checked={cardChecked} onChange={setCardChecked}>Daily journaling</CheckboxCard>
                <CheckboxCard checked={false} onChange={() => {}}>Meditation</CheckboxCard>
                <CheckboxCard disabled>Disabled option</CheckboxCard>
                <CheckboxCard checked disabled>Disabled selected</CheckboxCard>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="radio" title="Radio Button" description="24×24px. Label font: 14px/450.">
            <ComponentSpec name="States">
              <div className="flex flex-col gap-[16px]">
                <RadioButton checked={radio === 'a'} onChange={setRadio} value="a" label="Option A" />
                <RadioButton checked={radio === 'b'} onChange={setRadio} value="b" label="Option B" />
                <RadioButton checked={radio === 'c'} onChange={setRadio} value="c" label="Option C" />
              </div>
            </ComponentSpec>
          </Section>

          <Section id="switch" title="Switch" description="51×30px, radius: 12px. Thumb: 24×24px.">
            <ComponentSpec name="States">
              <div className="flex flex-col gap-[16px]">
                <Switch checked={switchOn} onChange={setSwitchOn} label={switchOn ? 'On' : 'Off'} />
                <Switch checked disabled label="Disabled on" />
                <Switch checked={false} disabled label="Disabled off" />
              </div>
            </ComponentSpec>
          </Section>

          <Section id="segmented" title="Segmented Control" description="Height: 40px, padding: 8/24, border: 1px #C0C0BF. Selected: white bg, unselected: #F0F0F0.">
            <ComponentSpec name="Interactive">
              <SegmentedControl
                segments={[
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                ]}
                value={segment}
                onChange={setSegment}
              />
            </ComponentSpec>
          </Section>

          {/* ═══ FEEDBACK ═══ */}

          <Section id="snackbar" title="Snackbar" description="Black background (#000), white text, radius: 12px, padding: 12px, shadow: 0 4px 16px rgba(0,0,0,0.16). Font: 16px/500.">
            <div className="flex flex-col gap-[12px] max-w-[400px]">
              <ComponentSpec name="Types">
                <div className="flex flex-col gap-[8px]">
                  <Snackbar type="info">This is an info message</Snackbar>
                  <Snackbar type="success">Action completed successfully</Snackbar>
                  <Snackbar type="warning">Please check your input</Snackbar>
                  <Snackbar type="error">Something went wrong</Snackbar>
                </div>
              </ComponentSpec>
            </div>
          </Section>

          <Section id="infobar" title="Infobar" description="White background (#FFF), dark text (#191C1A), radius: 12px, padding: 12px. Font: 12px/450.">
            <div className="flex flex-col gap-[12px] max-w-[500px]">
              <ComponentSpec name="Types">
                <div className="flex flex-col gap-[8px]">
                  <Infobar type="Info">Informational message with more detail.</Infobar>
                  <Infobar type="Success">Your changes have been saved.</Infobar>
                  <Infobar type="Warning">This action cannot be undone.</Infobar>
                  <Infobar type="Error">Failed to load data. Please retry.</Infobar>
                </div>
              </ComponentSpec>
            </div>
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
                <KeyThemeCard themes={['Personal Growth', 'Relationships', 'Self-care', 'Career', 'Mindfulness']} />
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
                <LockedFeatureCard icon="🔒" title="Unlock Ask Rosebud" body="Unlock Rosebud's full potential and gain deeper insight into your journal." />
                <UpgradeCard title="Unlock with Bloom" body="Access premium features and deeper personalized insights." />
                <GratitudeChallengeCard subtitle="Build a daily gratitude habit" ctaLabel="View challenge" daysCompleted={3} />
              </div>
            </SubSection>

            <SubSection title="Loading">
              <div className="max-w-[420px]">
                <LoadingCard progress={0.7} />
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

          <Section id="pills" title="Pill" description="Rounded full (999px), bg: #F8F8F8, text: #000, padding: 8/12, font: 13px/450.">
            <ComponentSpec name="Variants">
              <div className="flex flex-wrap gap-[8px]">
                <Pill>Default pill</Pill>
                <Pill icon={<IconStar />}>With icon</Pill>
                <Pill icon={<span>😊</span>}>Emoji icon</Pill>
                <Pill icon={<IconStar />} iconOnly />
              </div>
            </ComponentSpec>
          </Section>

          <Section id="tags" title="Tag" description="Rounded container for categorization.">
            <ComponentSpec name="Examples">
              <div className="flex flex-wrap gap-[8px]">
                <Tag>Mindfulness</Tag>
                <Tag>Gratitude</Tag>
                <Tag>Reflection</Tag>
                <Tag>Growth</Tag>
                <Tag>Self-care</Tag>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="avatars" title="Avatar" description="Circular. Sizes: 24px (base), or custom sm/md/lg.">
            <ComponentSpec name="Sizes">
              <div className="flex items-center gap-[16px]">
                <Avatar name="Grace H" size="sm" />
                <Avatar name="Grace H" size="md" />
                <Avatar name="Grace H" size="lg" />
              </div>
            </ComponentSpec>
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
                    <img src={new URL(`../icons/${name}.svg`, import.meta.url).href} alt={name} className="w-[20px] h-[20px]" loading="lazy" />
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
        Rosebud Design System &middot; Extracted from Figma &middot; {new Date().getFullYear()}
      </footer>
    </div>
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
