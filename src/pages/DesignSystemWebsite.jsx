import { useState, useEffect } from 'react';
import { Sun, Moon, ChevronRight, ChevronDown, Star, ArrowRight, Menu as MenuIcon, X } from 'lucide-react';
import { usePageActions } from '../components/Layout';
import { DesignSystemSwitcher } from '../components/DesignSystemSwitcher';

/* ══════════════════════════════════════════════════════════
   DESIGN SYSTEM (WEBSITE)
   Sourced from https://www.rosebud.app — the Webflow-built
   marketing site. Tailwind-rendered approximations of the
   tokens, components, and section patterns.
   ══════════════════════════════════════════════════════════ */

/* Tokens — repeated inline as a quick-reference cheat sheet */
const TOK = {
  crimson: '#D6165B',
  rose: '#EB0F63',
  coral: '#E2556E',
  teal: '#17826F',
  mint: '#36846C',
  mintFooter: '#E3EFED',
  mintTint: 'rgba(23,130,111,0.12)',
  white: '#FFFFFF',
  snow: '#F9F3F3',
  cardGray: '#F7F7F8',
  sectionBlue: '#EFF3F6',
  text: '#1A1B1F',
  heading: '#1B211A',
  textMuted: 'rgba(0,0,0,0.64)',
  fontDisplay: 'Outfit, system-ui, sans-serif',
  fontBody: 'Montserrat, system-ui, sans-serif',
  fontButton: 'Circular Std, system-ui, sans-serif',
};

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
      { id: 'brand', label: 'Brand & Tone' },
      { id: 'colors', label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'type-scale', label: 'Type Scale' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'radius', label: 'Radius' },
      { id: 'shadows', label: 'Shadows (none)' },
      { id: 'grid', label: 'Layout Grid' },
    ],
  },
  {
    group: 'Components',
    items: [
      { id: 'cta-primary', label: 'Primary CTA' },
      { id: 'cta-secondary', label: 'Secondary CTAs' },
      { id: 'pills', label: 'Pills & Badges' },
      { id: 'feature-card', label: 'Feature Card' },
      { id: 'pricing-card', label: 'Pricing Card' },
      { id: 'testimonial', label: 'Testimonial Bubble' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'press-strip', label: 'Press Logo Strip' },
      { id: 'top-nav', label: 'Top Navigation' },
      { id: 'footer', label: 'Footer' },
    ],
  },
  {
    group: 'Section Patterns',
    items: [
      { id: 'p-hero', label: 'Hero (photo + sage overlay)' },
      { id: 'p-press', label: 'Press Logo Strip' },
      { id: 'p-feature-grid', label: '3-Column Feature Grid' },
      { id: 'p-three-step', label: 'Write / Analyze / Take Action' },
      { id: 'p-quote', label: 'Big Quote Section' },
      { id: 'p-testimonial-wall', label: 'Testimonial Wall' },
      { id: 'p-stats', label: 'Stats / Report Grid' },
      { id: 'p-reviews', label: 'Reviews' },
      { id: 'p-pricing-section', label: 'Pricing Section' },
      { id: 'p-science-accordion', label: 'Science Accordion' },
      { id: 'p-final-cta', label: 'Final CTA Block' },
    ],
  },
  {
    group: 'Distinctive Treatments',
    items: [{ id: 'treatments', label: 'What makes it feel like Rosebud' }],
  },
];

/* ── Layout helpers ── */

function Section({ id, title, description, children }) {
  return (
    <section id={id} className="mb-[64px] scroll-mt-[80px]">
      <h2 className="text-[24px] leading-[32px] font-[700] text-[var(--color-on-background)] mb-[4px]">{title}</h2>
      {description && <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text)] mb-[24px]">{description}</p>}
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
            {headers.map(h => <th key={h} className="text-left px-[16px] py-[10px] font-[500] text-[var(--color-on-surface-variant)]">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-[var(--color-outline-light)]">
              {row.map((cell, j) => <td key={j} className="px-[16px] py-[10px] font-mono text-[var(--color-on-surface)]">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Swatch({ name, hex, alpha }) {
  const display = alpha || hex;
  return (
    <div className="flex flex-col items-center gap-[6px]">
      <div className="w-[64px] h-[64px] rounded-[10px] border border-[var(--color-outline-light)]" style={{ backgroundColor: display }} />
      <span className="text-[12px] leading-[15px] text-[var(--color-on-surface-variant)] text-center max-w-[88px]">{name}</span>
      <span className="text-[11px] leading-[14px] text-[var(--color-secondary-text)] font-mono">{hex}</span>
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
  return <span className="inline-block text-[11px] leading-[14px] font-mono text-[var(--color-secondary-text)] bg-[var(--color-surface-variant)] px-[6px] py-[2px] rounded-[4px]">{children}</span>;
}

function CodeBlock({ children }) {
  return (
    <pre className="mt-[12px] p-[12px] rounded-[8px] bg-[#0F0E0E] text-[#F7F5F5] text-[12px] leading-[18px] font-mono overflow-x-auto whitespace-pre-wrap">
      <code>{children}</code>
    </pre>
  );
}

/* ── Reusable visual primitives matching the marketing site ── */

function PrimaryCTA({ children = 'Start Free Trial', size = 'md' }) {
  const styles = size === 'lg'
    ? { height: 46, padding: '9px 32px', fontSize: 16, borderRadius: 24 }
    : { height: 40, padding: '0 24px', fontSize: 14.4, borderRadius: 41 };
  return (
    <button
      className="inline-flex items-center justify-center font-[500] text-white hover:opacity-90 transition-opacity"
      style={{ ...styles, fontFamily: TOK.fontButton, backgroundColor: TOK.crimson }}
    >
      {children}
    </button>
  );
}

function OutlineCTA({ children = 'Login' }) {
  return (
    <button
      className="inline-flex items-center justify-center font-[500] hover:opacity-80 transition-opacity"
      style={{
        height: 40, padding: '0 24px', fontSize: 14.4, borderRadius: 41,
        fontFamily: TOK.fontButton, backgroundColor: '#FFFFFF', color: '#000',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {children}
    </button>
  );
}

function TealCTA({ children = 'Get in touch' }) {
  return (
    <button
      className="inline-flex items-center justify-center text-white hover:opacity-90 transition-opacity"
      style={{
        height: 46, padding: '9px 32px', fontSize: 16, borderRadius: 24,
        fontFamily: TOK.fontButton, backgroundColor: TOK.teal,
      }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════ */

export function DesignSystemWebsite() {
  const [theme, setTheme] = useState('light');
  const [activeSection, setActiveSection] = useState('how-to-use');
  const [collapsed, setCollapsed] = useState({});
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [openAccordion, setOpenAccordion] = useState(0);

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
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
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

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <div className="max-w-[1400px] mx-auto flex">
        {/* ── Sidebar ── */}
        <nav className="hidden lg:flex flex-col w-[230px] shrink-0 sticky top-[64px] h-[calc(100vh-64px)] border-r border-[var(--color-outline-light)]">
          <div className="shrink-0 px-[12px] pt-[24px] pb-[12px] border-b border-[var(--color-outline-light)] bg-[var(--color-background)]">
            <DesignSystemSwitcher current="website" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search..."
              className="mt-[14px] w-full px-[10px] py-[6px] rounded-[8px] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)] text-[13px] leading-[18px] font-[450] text-[var(--color-on-surface)] placeholder:text-[var(--color-secondary-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
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
                  <ChevronRight size={12} className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                  <span>{group.group}</span>
                  {!isOpen && hasActive && <span className="w-[5px] h-[5px] rounded-full bg-[var(--color-primary)] ml-auto" />}
                </button>
                {isOpen && (
                  <ul className="space-y-[2px] mt-[4px] ml-[6px]">
                    {filteredItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block px-[10px] py-[6px] rounded-[8px] text-[13px] leading-[18px] font-[500] transition-colors ${
                            activeSection === item.id
                              ? 'bg-[var(--color-background)] text-[var(--color-on-background)] font-[600]'
                              : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)]'
                          }`}
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
              Design System · Website
            </h1>
            <p className="text-[15px] leading-[22px] font-[450] text-[var(--color-secondary-text)] max-w-[680px]">
              The marketing website at <PathTag>www.rosebud.app</PathTag>. Built on Webflow — three font families (Outfit, Montserrat, Circular), warm photographic heroes with a sage gradient overlay, no shadows, 24-px universal card radius, crimson <Code inline>#D6165B</Code> CTAs disciplined to primary actions only.
            </p>
          </div>

          {/* ═══ GETTING STARTED ═══ */}

          <Section id="source" title="Source of truth" description="Where the tokens and patterns on this page come from.">
            <div className="p-[20px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] space-y-[10px]">
              <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">
                <strong>Stack:</strong> Webflow-built marketing site at <PathTag>www.rosebud.app</PathTag>. No JS framework — static HTML/CSS with Webflow IX2 for animations.
              </p>
              <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">
                <strong>How tokens were extracted:</strong>
              </p>
              <ul className="text-[13px] leading-[22px] text-[var(--color-secondary-text)] list-disc pl-[20px]">
                <li>Webflow <code className="font-mono">:root</code> custom properties (color names + hex values)</li>
                <li>Computed styles pulled via headless Chromium on key sections (homepage, /science, /blog)</li>
                <li>Type scale measured at 1440 viewport — sizes, weights, line-heights, letter-spacing</li>
                <li>Spacing rhythm verified across multiple section types</li>
              </ul>
              <p className="text-[13px] text-[var(--color-secondary-text)] pt-[8px]">
                Components on this page are Tailwind approximations because rosebud.app isn't built on a shared component library — it's Webflow-authored. The fastest way to prototype a new marketing page is Tailwind + the documented tokens, which is what the cookbook below recommends. To verify a specific layout that's not shown here, open the live site in <code className="font-mono">/browse</code>.
              </p>
            </div>
          </Section>

          <Section id="how-to-use" title="How to use this page with Claude" description="Copy-paste these prompts when you want Claude to build a marketing page or landing-style prototype that matches Rosebud.app's design language.">
            <div className="p-[24px] rounded-[12px] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)]">
              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mb-[10px]">1 · Bootstrap a new marketing page</p>
              <p className="text-[14px] leading-[20px] text-[var(--color-secondary-text)] mb-[12px]">
                Marketing pages don't share a JS framework with the web app. Use Tailwind (already installed in this repo). Drop a new file under <PathTag>src/pages/</PathTag> and add a route in <PathTag>main.jsx</PathTag>:
              </p>
              <CodeBlock>{`Create a new marketing-style prototype page at src/pages/MyPage.jsx using Tailwind CSS. Match the rosebud.app design language documented in /design-system-website.

Rules:
- Use Tailwind utility classes for everything. Do NOT import from @chakra-ui/react — Chakra is for the web app prototypes (/design-system-web), not marketing.
- Three font families:
  • Outfit (display + headlines + body on marketing): font-[400/500/600/700]
  • Montserrat (default body / nav / footer): font-[400]
  • Circular Std (CTA button labels only): font-[500]
- Color discipline:
  • Crimson #D6165B is reserved for primary CTAs and the active nav link only.
  • Teal #17826F is for secondary actions (Get in touch), success accents, testimonial bubbles, accent borders.
  • Base palette is white + warm gray (#F7F7F8 cards) + green-black text (#1B211A heading, #1A1B1F body, rgba(0,0,0,0.64) muted).
  • Footer uses pale mint #E3EFED.
- Type scale (1440 viewport):
  • Hero h1: Outfit 59.2px / 700, line-height 67.2, letter-spacing -0.5
  • Section h2: Outfit 54.4px / 600, line-height 56, letter-spacing -1.44 (this tight ls is the signature)
  • Sub-headlines: Outfit 32px / 500, lh 56, ls -1
  • Card title: Outfit 24/700
  • Lead paragraph: Outfit 20/400, color rgba(0,0,0,0.64)
  • Body: Montserrat 16/400, line-height 28
  • Button: Circular Std 14.4/500
- Spacing: 8-px multiples (8/16/24/32/40/48/64). Section vertical padding 64px. Page horizontal padding 40px. Container max-width 1328px. Card gap 24px.
- Radius: cards 24px, button pill 41px (small) / 24px (large), capsule badge 100px, small chip 9px. NEVER add box-shadows — depth comes from background color contrast and photography.
- Hero photos get a sage gradient overlay: linear-gradient(rgb(106,143,141), rgba(106,143,141,0) 64%) over the photo.

Add a Route in src/main.jsx pointing /my-page → MyPage and a sidebar entry in src/components/Sidebar.jsx if desired.`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">2 · Build a specific section pattern</p>
              <p className="text-[14px] leading-[20px] text-[var(--color-secondary-text)] mb-[12px]">When you want one of the patterns shown on this page (hero, pricing comparison, testimonial wall, FAQ accordion, etc.):</p>
              <CodeBlock>{`Build the [PATTERN NAME — e.g. "3-column feature grid"] from /design-system-website in src/pages/MyPage.jsx.

Use Tailwind. Match the layout, spacing, typography, and color tokens shown in the reference example exactly. The full token cheat sheet is on /design-system-website under "Colors", "Typography", and "Spacing".

If the pattern needs an icon, use lucide-react (already installed). If it needs a photo, use a placeholder Unsplash URL or a solid background tinted to match the brand (sage #6A8F8D or warm gradient).`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">3 · Avoid common drift</p>
              <CodeBlock>{`Don't add box-shadows on this page — rosebud.app has zero shadows. Don't introduce new accent colors beyond the documented palette. Don't use Chakra imports. Keep the letter-spacing tightening (-1.44px on big section heads, -0.5 on h1) — this is the signature display feel.`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">4 · Reference the live site</p>
              <CodeBlock>{`Open https://www.rosebud.app/ in /browse if you need to verify a specific layout or section that isn't shown here. The site is Webflow-built — you can extract computed styles for any element.`}</CodeBlock>

              <p className="text-[12px] font-[500] uppercase tracking-[0.06em] text-[var(--color-secondary-text)] mt-[24px] mb-[10px]">Three styling worlds in this repo</p>
              <ul className="text-[14px] leading-[22px] text-[var(--color-on-surface)] list-disc pl-[20px] space-y-[4px]">
                <li><strong>Mobile App pages</strong> (/design-system) — Tailwind approximations of React Native components.</li>
                <li><strong>Web App pages</strong> (/design-system-web) — real Chakra UI v2 with the rosebud-react theme.</li>
                <li><strong>Website pages</strong> (this page) — Tailwind, no framework, marketing/landing style.</li>
              </ul>
              <p className="text-[13px] text-[var(--color-secondary-text)] mt-[8px]">Don't mix them on the same page. Pick one stack per prototype.</p>
            </div>
          </Section>

          {/* ═══ FOUNDATIONS ═══ */}

          <Section id="brand" title="Brand & Tone" description="Warm, calm, optimistic, slightly clinical-credible. Sits next to Calm/Headspace but with a sharper editorial typographic identity.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <ComponentSpec name="Vibe">
                <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">Lifestyle photography of people in nature (fields, lakes, mountains). Aspirational personal-growth — not therapy-clinical, not playful-consumer. Mature wellness with editorial type.</p>
              </ComponentSpec>
              <ComponentSpec name="Voice">
                <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">Confident and warm. Headlines are short, declarative, second-person: <em>"Live with clarity."</em> · <em>"Reach your goals."</em> · <em>"Accelerate your personal growth."</em> Body copy is plain-spoken.</p>
              </ComponentSpec>
              <ComponentSpec name="Trust signals">
                <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">Microsoft, Meta, Y Combinator, Berkeley, MIT, NYU logos · Fast Company / Mashable / KTLA quotes · "Trusted by 100K+ people" · HIPAA Aligned badge in footer.</p>
              </ComponentSpec>
              <ComponentSpec name="Primary action">
                <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)]">Download-driven. Every page has App Store + Google Play badges and "Start Free Trial" CTAs that route to <PathTag>rosebud.onelink.me</PathTag>. No email capture.</p>
              </ComponentSpec>
            </div>
          </Section>

          <Section id="colors" title="Colors" description="Disciplined palette: crimson for primary, teal for secondary/accent, warm grays + green-black text. Very low chroma overall.">
            <SubSection title="Brand">
              <div className="flex flex-wrap gap-[16px]">
                <Swatch name="crimson (primary CTA)" hex="#D6165B" />
                <Swatch name="rose" hex="#EB0F63" />
                <Swatch name="coral" hex="#E2556E" />
                <Swatch name="teal (secondary)" hex="#17826F" />
                <Swatch name="mint (Hiring pill)" hex="#36846C" />
              </div>
            </SubSection>
            <SubSection title="Surfaces">
              <div className="flex flex-wrap gap-[16px]">
                <Swatch name="white" hex="#FFFFFF" />
                <Swatch name="snow" hex="#F9F3F3" />
                <Swatch name="card-gray (Monthly pricing, feature cards)" hex="#F7F7F8" />
                <Swatch name="section-blue (Science studies bg)" hex="#EFF3F6" />
                <Swatch name="mint-50 (Footer bg)" hex="#E3EFED" />
                <Swatch name="mint-12 (Annual pricing card)" hex="#1A8270" alpha="rgba(23,130,111,0.12)" />
              </div>
            </SubSection>
            <SubSection title="Text">
              <div className="flex flex-wrap gap-[16px]">
                <Swatch name="text (body)" hex="#1A1B1F" />
                <Swatch name="heading (green-black)" hex="#1B211A" />
                <Swatch name="text-muted (64% black)" hex="#000" alpha="rgba(0,0,0,0.64)" />
              </div>
            </SubSection>
            <SubSection title="Photographic overlay">
              <div className="flex flex-wrap gap-[16px]">
                <Swatch name="hero overlay (dusty sage, fades to transparent at 64%)" hex="#6A8F8D" />
              </div>
            </SubSection>
            <p className="mt-[16px] text-[12px] text-[var(--color-secondary-text)]">
              Source: Webflow <PathTag>:root</PathTag> custom properties + computed styles from www.rosebud.app
            </p>
          </Section>

          <Section id="typography" title="Typography" description="Three families across the marketing site. Outfit handles display + body, Montserrat is the system fallback, Circular is button-only.">
            <SubSection title="Families">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                <ComponentSpec name="Outfit · display + body">
                  <p style={{ fontFamily: TOK.fontDisplay, fontSize: 28, fontWeight: 700, color: TOK.heading }}>Live with clarity.</p>
                  <p style={{ fontFamily: TOK.fontDisplay, fontSize: 16, fontWeight: 400, color: TOK.text }} className="mt-[8px]">All marketing headlines, lead paragraphs, card titles.</p>
                </ComponentSpec>
                <ComponentSpec name="Montserrat · default body">
                  <p style={{ fontFamily: TOK.fontBody, fontSize: 16, fontWeight: 400, color: TOK.text }}>Default body, navigation, footer text. The system fallback.</p>
                </ComponentSpec>
                <ComponentSpec name="Circular Std · buttons only">
                  <PrimaryCTA>Start Free Trial</PrimaryCTA>
                  <p style={{ fontFamily: TOK.fontBody, fontSize: 13, color: TOK.textMuted }} className="mt-[8px]">Reserved for CTA labels — gives buttons a snappier, tighter feel than the Outfit headlines.</p>
                </ComponentSpec>
              </div>
            </SubSection>
            <p className="mt-[8px] text-[12px] text-[var(--color-secondary-text)]">
              Bonus: <strong>Droid Serif</strong> 26/700 is used on the blog only for article titles — clearly an older Webflow template that wasn't re-themed.
            </p>
          </Section>

          <Section id="type-scale" title="Type Scale" description="At 1440 viewport. The signature detail: -1.44px letter-spacing on 54px section heads.">
            <TokenTable
              headers={['Role', 'Family', 'Size', 'Weight', 'Line-height', 'Letter-spacing']}
              rows={[
                ['Hero h1', 'Outfit', '59.2px', '700', '67.2px', '-0.5px'],
                ['Section h2', 'Outfit', '54.4px', '600', '56px', '-1.44px ⭐'],
                ['Sub-display', 'Outfit', '54.4px', '600', '48px (tight)', 'normal'],
                ['Large h3', 'Outfit', '32px', '500', '56px', '-1px'],
                ['Science h2', 'Outfit', '32px', '600', '40px', '-0.48px'],
                ['Card title', 'Outfit', '24px', '700', '32px', 'normal'],
                ['Lead paragraph', 'Outfit', '20px', '400', '28px', 'normal · color rgba(0,0,0,0.64)'],
                ['Pricing tier', 'Montserrat', '18px', '400', '—', '—'],
                ['Pricing price', 'Outfit', '32px', 'bold', '—', '—'],
                ['Body / nav / footer', 'Montserrat', '16px', '400', '28px', 'normal'],
                ['Button label', 'Circular', '14.4 / 16px', '500 / 400', '20 / 28px', '—'],
                ['Pill (SAVE 30%)', 'Outfit', '12px', 'bold uppercase', '—', '—'],
              ]}
            />
            <SubSection title="Live samples">
              <div className="space-y-[16px] mt-[16px] p-[24px] bg-white rounded-[12px] border border-[var(--color-outline-light)]">
                <div style={{ fontFamily: TOK.fontDisplay, fontSize: 59.2, fontWeight: 700, lineHeight: '67.2px', letterSpacing: '-0.5px', color: TOK.heading }}>Accelerate your growth</div>
                <div style={{ fontFamily: TOK.fontDisplay, fontSize: 54.4, fontWeight: 600, lineHeight: '56px', letterSpacing: '-1.44px', color: TOK.heading }}>Live with clarity.</div>
                <div style={{ fontFamily: TOK.fontDisplay, fontSize: 32, fontWeight: 500, lineHeight: '56px', letterSpacing: '-1px', color: TOK.heading }}>Loved by personal growth advocates worldwide</div>
                <div style={{ fontFamily: TOK.fontDisplay, fontSize: 24, fontWeight: 700, lineHeight: '32px', color: TOK.heading }}>Connect the dots</div>
                <div style={{ fontFamily: TOK.fontDisplay, fontSize: 20, fontWeight: 400, lineHeight: '28px', color: TOK.textMuted }}>The world's best AI journal — turning daily reflection into pattern recognition.</div>
                <div style={{ fontFamily: TOK.fontBody, fontSize: 16, fontWeight: 400, lineHeight: '28px', color: TOK.text }}>Default body text in Montserrat. Used in nav, footer, and most prose blocks.</div>
              </div>
            </SubSection>
          </Section>

          <Section id="spacing" title="Spacing" description="8-px multiples throughout. Section vertical padding 64px. Page horizontal padding 40px.">
            <TokenTable
              headers={['Token', 'Value', 'Use']}
              rows={[
                ['Page horizontal padding', '40px sides', '.padding-global'],
                ['Container max-width', '1328px (16px side margins)', '.container-large'],
                ['Section vertical padding', '64px top', '.padding-section'],
                ['Card padding (feature)', '32px top + sides (bottom 0 — image bleeds)', ''],
                ['Card padding (pricing)', '40px all sides', ''],
                ['Card padding (testimonial)', '24px all sides', ''],
                ['Card grid gap', '24px', ''],
                ['Pill padding (small)', '8px 12px', '"SAVE 30%"'],
                ['Button padding (nav CTA)', '0 24px, height 40px', ''],
                ['Button padding (large CTA)', '9px 32px, height 46px', '"Get in touch"'],
              ]}
            />
            <div className="flex items-end gap-[12px] mt-[24px]">
              {[8, 16, 24, 32, 40, 48, 64].map(px => (
                <div key={px} className="flex flex-col items-center gap-[6px]">
                  <div style={{ width: px, height: px, backgroundColor: TOK.crimson }} />
                  <span className="text-[11px] text-[var(--color-secondary-text)] font-mono">{px}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="radius" title="Radius" description="Cards = 24, capsules = 41-100 (full pill), small chips = 9. The asymmetric 24/24/27 is testimonial-only.">
            <TokenTable
              headers={['Token', 'Value', 'Used by']}
              rows={[
                ['card', '24px', 'feature, testimonial wrapper, pricing'],
                ['testimonial bubble', '24/24/27px (asymmetric)', 'chat-bubble notch effect'],
                ['button-pill (small)', '41px', 'nav buttons (full pill)'],
                ['cta-large', '24px', 'large body CTAs ("Get in touch")'],
                ['capsule', '100px', 'badges ("SAVE 30%")'],
                ['chip', '9px', 'small chips ("Hiring")'],
                ['blog thumbnail', '6px', '/blog only'],
              ]}
            />
            <div className="flex items-center gap-[16px] mt-[24px]">
              {[['card 24', 24], ['cta 24', 24], ['button 41', 41], ['capsule 100', 100], ['chip 9', 9]].map(([name, r]) => (
                <div key={name} className="flex flex-col items-center gap-[6px]">
                  <div className="w-[64px] h-[40px] bg-[var(--color-surface-variant)] border border-[var(--color-outline)]" style={{ borderRadius: r }} />
                  <span className="text-[11px] text-[var(--color-secondary-text)] font-mono">{name}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-[6px]">
                <div className="w-[64px] h-[40px] bg-[var(--color-surface-variant)] border border-[var(--color-outline)]" style={{ borderRadius: '24px 24px 27px 24px' }} />
                <span className="text-[11px] text-[var(--color-secondary-text)] font-mono">testimonial 24/24/27</span>
              </div>
            </div>
          </Section>

          <Section id="shadows" title="Shadows" description="There are no box-shadows on rosebud.app. Depth comes from background-color contrast (cards on white, tinted teal on white) and photography.">
            <ComponentSpec name="No shadows — depth via color contrast">
              <div className="flex gap-[16px]">
                <div className="w-[160px] h-[100px] rounded-[24px]" style={{ backgroundColor: TOK.cardGray }} />
                <div className="w-[160px] h-[100px] rounded-[24px] border" style={{ backgroundColor: TOK.mintTint, borderColor: TOK.teal }} />
              </div>
              <p className="text-[12px] text-[var(--color-secondary-text)] mt-[12px]">Card on white = #F7F7F8. Featured card = tinted teal on white with 1px teal border.</p>
            </ComponentSpec>
          </Section>

          <Section id="grid" title="Layout Grid" description="No formal column grid — pages are constrained by max-width and gutter.">
            <TokenTable
              headers={['Property', 'Value']}
              rows={[
                ['Body width cap', '1440px (no max-width on body — content scales)'],
                ['Inner content container', '1328px (.container-large)'],
                ['Outer page padding', '40px sides (.padding-global)'],
                ['Effective gutter at 1440', '40px outer + 16px container = 56px to content'],
                ['Hero subhead max-width', '580px'],
                ['Section heading max-width', '680px'],
              ]}
            />
          </Section>

          {/* ═══ COMPONENTS ═══ */}

          <Section id="cta-primary" title="Primary CTA" description='Crimson #D6165B pill. Used on every "Start Free Trial" button. Two sizes: 40-px nav pill and 46-px body CTA.'>
            <ComponentSpec name="Sizes">
              <div className="flex flex-wrap items-center gap-[16px]">
                <PrimaryCTA>Start Free Trial</PrimaryCTA>
                <PrimaryCTA size="lg">Try Rosebud Free</PrimaryCTA>
              </div>
              <p className="text-[12px] text-[var(--color-secondary-text)] mt-[12px]">
                Small (nav): height 40, padding 0 24, fontSize 14.4, radius 41 (full pill).<br />
                Large (body): height 46, padding 9 32, fontSize 16, radius 24 (rounded but not pill).
              </p>
            </ComponentSpec>
          </Section>

          <Section id="cta-secondary" title="Secondary CTAs" description="Two flavors: outline pill (Login) and solid teal (Get in touch).">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <ComponentSpec name="Outline pill">
                <OutlineCTA>Login</OutlineCTA>
                <p className="text-[12px] text-[var(--color-secondary-text)] mt-[12px]">Black text on white, 1px solid rgba(0,0,0,0.1) border, full pill.</p>
              </ComponentSpec>
              <ComponentSpec name="Solid teal CTA">
                <TealCTA>Get in touch</TealCTA>
                <p className="text-[12px] text-[var(--color-secondary-text)] mt-[12px]">White on teal #17826F, radius 24 (rounded but not pill). Used for "Get in touch" / "Build the Future with Us" final CTA blocks.</p>
              </ComponentSpec>
            </div>
          </Section>

          <Section id="pills" title="Pills & Badges" description='Three pill flavors: chip (Hiring), capsule (SAVE 30%), and link-style ("Read the study").'>
            <ComponentSpec name="Chip · capsule · inline link">
              <div className="flex flex-wrap items-center gap-[16px]">
                <span style={{ backgroundColor: TOK.mint, color: '#000', borderRadius: 9, padding: '0 8px', fontFamily: TOK.fontBody, fontSize: 16 }}>Hiring</span>
                <span style={{ backgroundColor: TOK.teal, color: '#FFF', borderRadius: 100, padding: '8px 12px', fontFamily: TOK.fontDisplay, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>SAVE 30%</span>
                <a className="underline" style={{ fontFamily: TOK.fontBody, fontSize: 14, color: TOK.text }} href="#">Read the study</a>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="feature-card" title="Feature Card" description='Background #F7F7F8, radius 24, padding 32/32/0 — image bleeds to bottom edge.'>
            <ComponentSpec name="With illustration bleed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                {[
                  { title: 'Connect the dots', body: 'Spot patterns across weeks of journaling.' },
                  { title: 'Write', body: 'Voice-to-text or freeform — Rosebud meets you where you are.' },
                ].map(c => (
                  <div key={c.title} style={{ backgroundColor: TOK.cardGray, borderRadius: 24, padding: '32px 32px 0' }}>
                    <h4 style={{ fontFamily: TOK.fontDisplay, fontSize: 24, fontWeight: 700, lineHeight: '32px', color: TOK.heading }}>{c.title}</h4>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 20, fontWeight: 400, lineHeight: '28px', color: TOK.textMuted }} className="mt-[8px]">{c.body}</p>
                    <div className="mt-[24px] h-[120px] rounded-t-[16px] flex items-center justify-center text-[40px]" style={{ backgroundColor: '#E8E2E2' }}>📱</div>
                  </div>
                ))}
              </div>
            </ComponentSpec>
          </Section>

          <Section id="pricing-card" title="Pricing Card" description="Two-card layout. Featured (Annual) gets tinted teal background + 1px teal border + SAVE 30% badge half-overlapping the top.">
            <ComponentSpec name="Monthly + Annual">
              <div className="flex flex-wrap gap-[24px] justify-center">
                <div style={{ width: 314, height: 286, backgroundColor: TOK.cardGray, borderRadius: 24, padding: 40, textAlign: 'center' }} className="flex flex-col items-center justify-between">
                  <p style={{ fontFamily: TOK.fontBody, fontSize: 18 }}>Monthly</p>
                  <p style={{ fontFamily: TOK.fontDisplay, fontSize: 32, fontWeight: 700, color: TOK.heading }}>$12.99/mo</p>
                  <PrimaryCTA>Start Free Trial</PrimaryCTA>
                </div>
                <div style={{ width: 314, height: 286, backgroundColor: TOK.mintTint, border: `1px solid ${TOK.teal}`, borderRadius: 24, padding: 40, textAlign: 'center', position: 'relative' }} className="flex flex-col items-center justify-between">
                  <span style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', backgroundColor: TOK.teal, color: '#FFF', borderRadius: 100, padding: '8px 12px', fontFamily: TOK.fontDisplay, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>SAVE 30%</span>
                  <p style={{ fontFamily: TOK.fontBody, fontSize: 18 }}>Annual</p>
                  <div>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 32, fontWeight: 700, color: TOK.heading }}>$8.99/mo</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 13, color: TOK.textMuted }}>
                      <span style={{ textDecoration: 'line-through' }}>$155.99/yr</span> · $107.99/yr
                    </p>
                  </div>
                  <PrimaryCTA>Start Free Trial</PrimaryCTA>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="testimonial" title="Testimonial Bubble" description='Solid teal #17826F, white text, radius 24/24/27 (asymmetric to mimic chat-bubble notch toward avatar).'>
            <ComponentSpec name="Two variants">
              <div className="flex flex-wrap items-end gap-[40px]">
                <div className="flex items-end gap-[12px]">
                  <div style={{ width: 280, padding: 24, backgroundColor: TOK.teal, color: '#FFF', borderRadius: '24px 24px 27px 24px' }}>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 18, fontWeight: 600, marginBottom: 6 }}>This is pure gold.</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 13, opacity: 0.85 }}>Micha Tomoff, Positive Psychologist</p>
                  </div>
                  <div className="w-[64px] h-[64px] rounded-full bg-[#E8E2E2] flex items-center justify-center text-[24px]">👤</div>
                </div>
                <div className="flex items-end gap-[12px]">
                  <div className="w-[64px] h-[64px] rounded-full bg-[#E8E2E2] flex items-center justify-center text-[24px]">👤</div>
                  <div style={{ width: 280, padding: 24, backgroundColor: TOK.teal, color: '#FFF', borderRadius: '24px 24px 24px 27px' }}>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 18, fontWeight: 600, marginBottom: 6 }}>I rely on Rosebud daily.</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 13, opacity: 0.85 }}>Dr. Sarah Lin, Therapist</p>
                  </div>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="accordion" title="Accordion (Science page)" description="White card, leaf icon + bold question on the left, chevron right. Expanded shows body + 'Read the study' link.">
            <ComponentSpec name="Three rows">
              <div className="rounded-[24px] bg-white border border-[var(--color-outline-light)] overflow-hidden max-w-[600px]">
                {[
                  { q: 'Reduced anxiety', a: 'Journaling for 15 minutes daily reduced GAD-7 anxiety scores by 38% in a 4-week study.' },
                  { q: 'Reduced symptoms of depression', a: 'Expressive writing improved PHQ-9 depression scores by 24% in randomized controlled trials.' },
                  { q: 'Improved sleep quality', a: 'Pre-bed journaling reduced sleep onset latency by 9 minutes on average.' },
                ].map((row, i) => (
                  <div key={i} className="border-b last:border-b-0" style={{ borderColor: '#EDE4E4' }}>
                    <button onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)} className="w-full flex items-center justify-between px-[24px] py-[20px] text-left">
                      <div className="flex items-center gap-[12px]">
                        <span style={{ color: TOK.teal }}>🌿</span>
                        <span style={{ fontFamily: TOK.fontDisplay, fontSize: 18, fontWeight: 600, color: TOK.heading }}>{row.q}</span>
                      </div>
                      <ChevronDown size={18} className={`transition-transform ${openAccordion === i ? 'rotate-180' : ''}`} style={{ color: TOK.text }} />
                    </button>
                    {openAccordion === i && (
                      <div className="px-[24px] pb-[20px]">
                        <p style={{ fontFamily: TOK.fontDisplay, fontSize: 16, color: TOK.textMuted, lineHeight: '24px' }}>{row.a}</p>
                        <a href="#" className="underline mt-[8px] inline-block" style={{ fontFamily: TOK.fontBody, fontSize: 14, color: TOK.text }}>Read the study</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ComponentSpec>
          </Section>

          <Section id="press-strip" title="Press Logo Strip" description="Centered headline + horizontal marquee of monochrome press logos with gradient fade-mask edges.">
            <ComponentSpec name="Layout">
              <div className="text-center py-[32px]">
                <h3 style={{ fontFamily: TOK.fontDisplay, fontSize: 32, fontWeight: 500, lineHeight: '40px', letterSpacing: '-0.5px', color: TOK.heading }}>Loved by personal growth advocates worldwide</h3>
                <div className="relative mt-[24px] overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[80px] z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent)' }} />
                  <div className="absolute right-0 top-0 bottom-0 w-[80px] z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white, transparent)' }} />
                  <div className="flex items-center justify-around gap-[40px] py-[16px] text-[#888] text-[15px] font-[600] tracking-[0.06em]">
                    {['MICROSOFT', 'META', 'Y COMBINATOR', 'BERKELEY', 'MIT', 'NYU'].map(l => <span key={l}>{l}</span>)}
                  </div>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="top-nav" title="Top Navigation" description="White, 1440-wide, internal width 1328. Logo + Hiring pill (left) · 5 nav links centered · Login + Start Free Trial (right). Active link is crimson.">
            <ComponentSpec name="Schematic">
              <div className="flex items-center px-[40px] py-[12px] bg-white border border-[var(--color-outline-light)] rounded-[12px] overflow-x-auto">
                <div className="flex items-center gap-[12px]">
                  <span style={{ fontFamily: TOK.fontDisplay, fontSize: 22, fontWeight: 700, color: TOK.crimson }}>♥ rosebud</span>
                  <span style={{ backgroundColor: TOK.mint, color: '#000', borderRadius: 9, padding: '0 8px', fontFamily: TOK.fontBody, fontSize: 14 }}>Hiring</span>
                </div>
                <div className="flex items-center gap-[24px] mx-auto" style={{ fontFamily: TOK.fontBody, fontSize: 16 }}>
                  <a style={{ color: TOK.crimson }}>Features</a>
                  <a style={{ color: '#000' }}>Reviews</a>
                  <a style={{ color: '#000' }}>Pricing</a>
                  <a style={{ color: '#000' }}>Science</a>
                  <a style={{ color: '#000' }}>Blog</a>
                </div>
                <div className="flex items-center gap-[10px]">
                  <OutlineCTA>Login</OutlineCTA>
                  <PrimaryCTA>Start Free Trial</PrimaryCTA>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="footer" title="Footer" description="Pale mint #E3EFED bg. Two rows: logo + link group, then social + HIPAA badge + copyright.">
            <ComponentSpec name="Schematic">
              <div className="px-[40px] py-[40px] rounded-[12px]" style={{ backgroundColor: TOK.mintFooter }}>
                <div className="flex items-center justify-between mb-[24px]">
                  <span style={{ fontFamily: TOK.fontDisplay, fontSize: 22, fontWeight: 700, color: TOK.crimson }}>♥ rosebud</span>
                  <div className="flex items-center gap-[24px]" style={{ fontFamily: TOK.fontBody, fontSize: 14 }}>
                    {['Join our team', 'About us', 'Contact Us', 'Terms of Service', 'Privacy Policy'].map(l => <a key={l} href="#" style={{ color: '#000' }}>{l}</a>)}
                  </div>
                </div>
                <div className="flex items-center justify-between" style={{ fontFamily: TOK.fontBody, fontSize: 13 }}>
                  <div className="flex items-center gap-[12px]">
                    <span style={{ color: '#000' }}>Follow us on</span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <span style={{ color: TOK.teal, fontWeight: 600 }}>HIPAA Aligned</span>
                    <span style={{ color: TOK.textMuted }}>© {new Date().getFullYear()} Rosebud</span>
                  </div>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          {/* ═══ SECTION PATTERNS ═══ */}

          <Section id="p-hero" title="Pattern · Hero (photo + sage overlay)" description="Full-bleed photo background with the signature sage gradient overlay (top-down, fades to transparent at 64%).">
            <ComponentSpec name="Hero schematic">
              <div className="relative h-[420px] rounded-[12px] overflow-hidden flex flex-col items-center justify-center text-center px-[40px]" style={{
                background: `linear-gradient(rgb(106,143,141), rgba(106,143,141,0) 64%), linear-gradient(135deg, #C9B68A, #E8C593)`,
              }}>
                <h1 style={{ fontFamily: TOK.fontDisplay, fontSize: 52, fontWeight: 700, lineHeight: '60px', letterSpacing: '-0.5px', color: '#FFF', maxWidth: 720 }}>
                  The world's best AI journal
                </h1>
                <p style={{ fontFamily: TOK.fontDisplay, fontSize: 19, fontWeight: 400, lineHeight: '28px', color: '#FFF', maxWidth: 580 }} className="mt-[16px]">
                  Accelerate your personal growth with conversational AI that actually remembers.
                </p>
                <div className="flex gap-[12px] mt-[24px]">
                  <button className="px-[20px] py-[10px] rounded-[8px] bg-black text-white text-[13px]"> App Store</button>
                  <button className="px-[20px] py-[10px] rounded-[8px] bg-black text-white text-[13px]"> Google Play</button>
                </div>
                <div className="mt-[16px] flex items-center gap-[6px]" style={{ color: '#FFF', fontFamily: TOK.fontBody, fontSize: 13 }}>
                  <Star size={12} fill="#FFD700" color="#FFD700" /> <span>4.9 · Trusted by 100K+ people</span>
                </div>
              </div>
              <p className="text-[12px] text-[var(--color-secondary-text)] mt-[12px]">
                Background: <code className="font-mono">linear-gradient(rgb(106,143,141), rgba(106,143,141,0) 64%), url(photo)</code>. Hero is image-led; copy overlaid centered.
              </p>
            </ComponentSpec>
          </Section>

          <Section id="p-press" title="Pattern · Press Logo Strip" description="Centered h3 (Outfit 32/500) + marquee strip below with edge gradient masks. White bg, ~64px vertical padding.">
            <p className="text-[13px] text-[var(--color-secondary-text)]">See <a href="#press-strip" className="underline">Press Logo Strip</a> component above.</p>
          </Section>

          <Section id="p-feature-grid" title="Pattern · 3-Column Feature Grid" description="3 × 2 = 6 cards, gap 24px. Asymmetric — large cards with phone mockups, smaller with icon + short copy.">
            <ComponentSpec name="6-up grid">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-[24px]">
                {[
                  { t: 'Connect the dots', b: 'Spot patterns across weeks.', tall: true },
                  { t: 'Write', b: 'Voice or text.', tall: false },
                  { t: 'Analyze', b: 'AI-summarized insights.', tall: false },
                  { t: 'Take action', b: 'Tiny commitments that stick.', tall: true },
                  { t: 'Stay private', b: 'Your data, encrypted.', tall: false },
                  { t: 'Build streaks', b: 'Daily check-ins, gently.', tall: false },
                ].map(c => (
                  <div key={c.t} style={{ backgroundColor: TOK.cardGray, borderRadius: 24, padding: '32px 32px 0' }} className={c.tall ? 'row-span-1 md:row-span-1' : ''}>
                    <h4 style={{ fontFamily: TOK.fontDisplay, fontSize: 24, fontWeight: 700, lineHeight: '32px', color: TOK.heading }}>{c.t}</h4>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 16, fontWeight: 400, color: TOK.textMuted }} className="mt-[8px]">{c.b}</p>
                    <div className={`mt-[24px] rounded-t-[16px] flex items-center justify-center text-[28px] ${c.tall ? 'h-[140px]' : 'h-[80px]'}`} style={{ backgroundColor: '#E8E2E2' }}>📱</div>
                  </div>
                ))}
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-three-step" title="Pattern · Write / Analyze / Take Action" description="Three cards in a row, each with card title (Outfit 24/700). 24px gap, 64px section padding.">
            <ComponentSpec name="3-step">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                {[
                  { t: 'Write', b: 'Open the app, start where you are.' },
                  { t: 'Analyze', b: 'Rosebud surfaces patterns and themes.' },
                  { t: 'Take action', b: 'Set tiny commitments and follow through.' },
                ].map(c => (
                  <div key={c.t} style={{ backgroundColor: TOK.cardGray, borderRadius: 24, padding: 32 }}>
                    <h4 style={{ fontFamily: TOK.fontDisplay, fontSize: 24, fontWeight: 700, lineHeight: '32px', color: TOK.heading }}>{c.t}</h4>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 18, fontWeight: 400, color: TOK.textMuted }} className="mt-[8px]">{c.b}</p>
                  </div>
                ))}
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-quote" title='Pattern · Big Quote Section ("Live with clarity.")' description="Full-width photographic background. White display headline (Outfit 54.4/600) top-left + pull-quote in white with em-dash attribution.">
            <ComponentSpec name="Quote section">
              <div className="relative rounded-[12px] overflow-hidden p-[40px] flex flex-col justify-between" style={{
                minHeight: 360,
                background: `linear-gradient(135deg, #4A6068, #2C3E45)`,
              }}>
                <h2 style={{ fontFamily: TOK.fontDisplay, fontSize: 54.4, fontWeight: 600, lineHeight: '56px', letterSpacing: '-1.44px', color: '#FFF' }}>Live with clarity.</h2>
                <div>
                  <p style={{ fontFamily: TOK.fontDisplay, fontSize: 22, fontStyle: 'italic', lineHeight: '32px', color: '#FFF' }} className="max-w-[600px]">
                    "I was able to break free from the loop I'd been stuck in for years."
                  </p>
                  <p style={{ fontFamily: TOK.fontBody, fontSize: 14, color: '#FFF', opacity: 0.85 }} className="mt-[12px]">— Annie S., Premium Subscriber</p>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-testimonial-wall" title='Pattern · Testimonial Wall ("Trusted by Professionals")' description="Centered phone mockup with 4 floating teal quote bubbles at corners (asymmetric radius), each paired with an avatar.">
            <ComponentSpec name="Wall layout">
              <div className="relative h-[440px] flex items-center justify-center">
                <div className="absolute top-0 left-0 flex items-end gap-[8px]">
                  <div style={{ width: 220, padding: 16, backgroundColor: TOK.teal, color: '#FFF', borderRadius: '24px 24px 27px 24px' }}>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 14, fontWeight: 600 }}>Pure gold.</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 11, opacity: 0.85 }}>Micha T., Psychologist</p>
                  </div>
                  <div className="w-[40px] h-[40px] rounded-full bg-[#E8E2E2] mb-[12px]" />
                </div>
                <div className="absolute top-0 right-0 flex items-end gap-[8px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#E8E2E2] mb-[12px]" />
                  <div style={{ width: 220, padding: 16, backgroundColor: TOK.teal, color: '#FFF', borderRadius: '24px 24px 24px 27px' }}>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 14, fontWeight: 600 }}>I rely on it daily.</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 11, opacity: 0.85 }}>Dr. Sarah Lin</p>
                  </div>
                </div>
                <div className="w-[160px] h-[320px] rounded-[28px] bg-[#1B211A] flex items-center justify-center text-[40px] text-white border-[6px] border-[#1B211A]">📱</div>
                <div className="absolute bottom-0 left-0 flex items-end gap-[8px]">
                  <div style={{ width: 220, padding: 16, backgroundColor: TOK.teal, color: '#FFF', borderRadius: '24px 24px 27px 24px' }}>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 14, fontWeight: 600 }}>Game-changer.</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 11, opacity: 0.85 }}>Ravi P., Coach</p>
                  </div>
                  <div className="w-[40px] h-[40px] rounded-full bg-[#E8E2E2] mb-[12px]" />
                </div>
                <div className="absolute bottom-0 right-0 flex items-end gap-[8px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#E8E2E2] mb-[12px]" />
                  <div style={{ width: 220, padding: 16, backgroundColor: TOK.teal, color: '#FFF', borderRadius: '24px 24px 24px 27px' }}>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 14, fontWeight: 600 }}>Better than therapy homework.</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 11, opacity: 0.85 }}>Anna M.</p>
                  </div>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-stats" title='Pattern · Stats / Report Grid ("What a Week with Rosebud Can Do")' description='Headline + sub + 3×2 grid of stat cards: category + percentage. From 1,300-user survey.'>
            <ComponentSpec name="6-up stat grid">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-[24px]">
                {[['Depression', '64%'], ['Grief', '49%'], ['Anxiety', '60%'], ['ADHD', '47%'], ['Anger', '54%'], ['Loneliness', '42%']].map(([cat, pct]) => (
                  <div key={cat} style={{ backgroundColor: TOK.cardGray, borderRadius: 24, padding: 32 }} className="text-center">
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 48, fontWeight: 700, color: TOK.teal, lineHeight: '52px' }}>{pct}</p>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 18, fontWeight: 500, color: TOK.heading }} className="mt-[8px]">{cat}</p>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 13, color: TOK.textMuted }} className="mt-[4px]">report improvement</p>
                  </div>
                ))}
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-reviews" title='Pattern · Reviews ("Real stories, real results")' description='Headline + sub + ★ rating row + TrustPilot widget + "Try Rosebud free" pink CTA.'>
            <ComponentSpec name="Reviews layout">
              <div className="text-center py-[40px]">
                <h2 style={{ fontFamily: TOK.fontDisplay, fontSize: 40, fontWeight: 600, lineHeight: '48px', letterSpacing: '-1px', color: TOK.heading }}>Real stories, real results</h2>
                <p style={{ fontFamily: TOK.fontDisplay, fontSize: 18, color: TOK.textMuted }} className="mt-[12px]">From people who've made Rosebud part of their daily practice.</p>
                <div className="flex items-center justify-center gap-[8px] mt-[16px]" style={{ fontFamily: TOK.fontBody, fontSize: 14 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
                  <span>4.73 · 5,311 ratings · Trusted by 150K+ users</span>
                </div>
                <div className="mt-[24px] py-[40px] rounded-[12px] bg-[var(--color-surface-variant)] text-[14px] text-[var(--color-secondary-text)]">[ TrustPilot widget ]</div>
                <a href="#" className="block mt-[12px] underline" style={{ fontFamily: TOK.fontBody, fontSize: 14, color: TOK.text }}>Read our reviews on TrustPilot</a>
                <div className="mt-[24px]">
                  <PrimaryCTA size="lg">Try Rosebud free</PrimaryCTA>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-pricing-section" title='Pattern · Pricing Section' description="Centered headline + lead + 2 pricing cards + 'Student and disability discounts available' link.">
            <ComponentSpec name="Pricing section">
              <div className="text-center py-[40px]">
                <h2 style={{ fontFamily: TOK.fontDisplay, fontSize: 54.4, fontWeight: 600, lineHeight: '56px', letterSpacing: '-1.44px', color: TOK.heading }}>An affordable path to a better you</h2>
                <p style={{ fontFamily: TOK.fontDisplay, fontSize: 20, color: TOK.textMuted, maxWidth: 580 }} className="mx-auto mt-[16px]">Less than your favorite coffee subscription. Free trial, no commitment.</p>
                <div className="mt-[40px] flex flex-wrap justify-center gap-[24px]">
                  <div style={{ width: 280, height: 240, backgroundColor: TOK.cardGray, borderRadius: 24, padding: 32, textAlign: 'center' }} className="flex flex-col items-center justify-between">
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 18 }}>Monthly</p>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 32, fontWeight: 700, color: TOK.heading }}>$12.99/mo</p>
                    <PrimaryCTA>Start Free Trial</PrimaryCTA>
                  </div>
                  <div style={{ width: 280, height: 240, backgroundColor: TOK.mintTint, border: `1px solid ${TOK.teal}`, borderRadius: 24, padding: 32, textAlign: 'center', position: 'relative' }} className="flex flex-col items-center justify-between">
                    <span style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', backgroundColor: TOK.teal, color: '#FFF', borderRadius: 100, padding: '6px 12px', fontFamily: TOK.fontDisplay, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>SAVE 30%</span>
                    <p style={{ fontFamily: TOK.fontBody, fontSize: 18 }}>Annual</p>
                    <p style={{ fontFamily: TOK.fontDisplay, fontSize: 32, fontWeight: 700, color: TOK.heading }}>$8.99/mo</p>
                    <PrimaryCTA>Start Free Trial</PrimaryCTA>
                  </div>
                </div>
                <a href="#" className="block mt-[16px] underline" style={{ fontFamily: TOK.fontBody, fontSize: 13, color: TOK.text }}>Student and disability discounts available</a>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-science-accordion" title="Pattern · Science Accordion" description="Cool gray-blue #EFF3F6 background, centered headline (Outfit 32/600, ls -0.48), centered subhead, vertical accordion of white cards with leaf icons.">
            <ComponentSpec name="Section layout">
              <div className="rounded-[12px] py-[40px] px-[24px] text-center" style={{ backgroundColor: TOK.sectionBlue }}>
                <h2 style={{ fontFamily: TOK.fontDisplay, fontSize: 32, fontWeight: 600, lineHeight: '40px', letterSpacing: '-0.48px', color: TOK.heading }}>The positive effects of journaling are well studied</h2>
                <p style={{ fontFamily: TOK.fontDisplay, fontSize: 16, color: TOK.textMuted, maxWidth: 560 }} className="mx-auto mt-[8px]">Decades of peer-reviewed research back up what users tell us.</p>
                <p className="text-[12px] text-[var(--color-secondary-text)] mt-[16px]">(Accordion rows render here — see <a href="#accordion" className="underline">Accordion</a> component above.)</p>
              </div>
            </ComponentSpec>
          </Section>

          <Section id="p-final-cta" title='Pattern · Final CTA Block ("Build the Future with Us")' description='Centered headline + paragraph + solid teal "Get in touch" CTA.'>
            <ComponentSpec name="Final CTA">
              <div className="text-center py-[60px] px-[24px]">
                <h2 style={{ fontFamily: TOK.fontDisplay, fontSize: 54.4, fontWeight: 600, lineHeight: '56px', letterSpacing: '-1.44px', color: TOK.heading }}>Build the Future with Us</h2>
                <p style={{ fontFamily: TOK.fontDisplay, fontSize: 20, color: TOK.textMuted, maxWidth: 580 }} className="mx-auto mt-[16px]">We're hiring across engineering, design, and clinical research.</p>
                <div className="mt-[24px]">
                  <TealCTA>Get in touch</TealCTA>
                </div>
              </div>
            </ComponentSpec>
          </Section>

          {/* ═══ TREATMENTS ═══ */}

          <Section id="treatments" title="What makes it feel like Rosebud" description="The handful of distinctive details that, removed, would make it feel like any other wellness app marketing site.">
            <div className="space-y-[12px]">
              {[
                ['Sage gradient overlay on photographic heroes', 'linear-gradient(rgb(106,143,141), rgba(106,143,141,0) 64%) over the photo. Calm, naturalistic, slightly faded film feel.'],
                ['Zero box-shadows', 'Depth comes purely from background-color contrast (#F7F7F8 cards on white, tinted teal on white) and from photography.'],
                ['24-px universal card radius', 'Plus the distinctive 24/24/27 asymmetric radius on testimonial bubbles (mimicking a chat-bubble notch toward the avatar).'],
                ['Tight letter-spacing on display sizes', '-1.44px on 54-px section heads is the most distinctive type detail. The -0.5 / -1 / -1.44 ratchet across sizes is intentional.'],
                ['Color discipline', 'Crimson #D6165B is reserved for primary CTAs and the active nav link only. Teal #17826F is for secondary actions, success/accent, testimonial bubbles. Base palette is otherwise white + warm gray + green-black text — very low chroma overall.'],
                ['Font pairing: Outfit + Circular', 'Outfit handles all headlines and body. Circular is button-only — its tighter character widths make CTAs feel snappier than the Outfit headlines around them.'],
                ['Marquee logo strips with edge gradient masks', 'For press logos. White → transparent fade on left and right edges sells the "more behind the scroll" feel without scrolling.'],
                ['Phone mockups everywhere', 'Almost every feature/demo card frames the product in a realistic iPhone with custom UI mockups inside (chat bubbles, weekly chart, voice waveform).'],
              ].map(([title, body]) => (
                <div key={title} className="p-[16px] rounded-[8px] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)]">
                  <p className="text-[14px] font-[600] text-[var(--color-on-surface)]">{title}</p>
                  <p className="text-[13px] text-[var(--color-secondary-text)] mt-[4px]">{body}</p>
                </div>
              ))}
            </div>
          </Section>

        </main>
      </div>

      <footer className="border-t border-[var(--color-outline-light)] py-[32px] text-center text-[12px] text-[var(--color-secondary-text)]">
        Rosebud Website Design System · Sourced from www.rosebud.app · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

/* Tiny inline Code helper used in the page header */
function Code({ children }) {
  return <code className="font-mono text-[var(--color-on-surface)] bg-[var(--color-surface-variant)] px-[4px] py-[1px] rounded-[3px]">{children}</code>;
}
