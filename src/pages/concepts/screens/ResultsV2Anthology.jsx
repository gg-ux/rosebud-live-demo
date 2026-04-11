/* ═══════════════════════════════════════════════════════════════════════════
   Results V2 — The Anthology
   Three tabs, each with its own visual language:
     Stories — evocative gradient cards + momentary archetypes (editorial)
     People  — portrait cards + quotes + trend arrows (relationships)
     Themes  — big theme pull quote + chips + word shifts (behavioral)
   Inspired by Dimensional's lesson that format is meaning.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import joySvg from '../../../symbols/emotes/joy.svg';
import moodUnimpressedSvg from '../../../symbols/emotes/mood-unimpressed.svg';
import { StoryOfYouTakeover } from './StoryOfYouTakeover';
import { Button } from '../../../components/Button';

/* ══════════════════════════════════════════════════════════
   Data — Ellie's week (Apr 3 – Apr 9, week 5 of 5)
   ══════════════════════════════════════════════════════════ */

// Timeframe dropdown options. Three is enough — week maps to the
// focused week view, month and year both use the longitudinal
// quarter-view content with different date ranges.
const TIMEFRAMES = [
  { id: 'week', label: 'This week', range: 'Apr 3 \u2013 Apr 9' },
  { id: 'month', label: 'This month', range: 'Apr 1 \u2013 Apr 9' },
  { id: 'year', label: 'This year', range: 'Jan 1 \u2013 Apr 9' },
];

// Mood arc for the Themes tab emotional landscape — this week
const MOOD_ARC = [
  { day: 'Fr', label: 'Apr 4', mood: 'anticipating', score: 7 },
  { day: 'Sa', label: 'Apr 5', mood: 'disappointed', score: 4 },
  { day: 'Su', label: 'Apr 6', mood: 'angry', score: 2, key: true },
  { day: 'Mo', label: 'Apr 7', mood: 'joyful', score: 9, key: true },
  { day: 'Tu', label: 'Apr 8', mood: 'calm', score: 7 },
  { day: 'We', label: 'Apr 9', mood: 'frustrated', score: 4 },
];

// Same days, previous period (Mar 28 – Apr 2). Flatter and lower overall.
const PREVIOUS_MOOD_ARC = [
  { day: 'Fr', score: 5 },
  { day: 'Sa', score: 4 },
  { day: 'Su', score: 4 },
  { day: 'Mo', score: 5 },
  { day: 'Tu', score: 5 },
  { day: 'We', score: 4 },
];

// Themes — quiet 2-stop monochrome gradients matching the flat surface
// philosophy of the rest of the page. Each card has a subtle tint in its own
// color family without competing with the neighboring #FAFAFA data cards.
// The full-screen detail overlay uses the richer `detailBgImage` for
// a splashier takeover moment.
const STORIES = [
  {
    id: 'circling',
    eyebrow: 'You kept circling back to',
    title: 'Being seen for who you are, not who you\'re dressed as',
    // Rose family — vibrant card, rich detail
    bgImage: 'linear-gradient(135deg, #FFE2ED 0%, #FFC2D8 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 75% 15%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(135deg, #FFE2ED 0%, #FFC2D8 55%, #FF9EBE 100%)',
    textColor: '#191C1A',
    // Decoration — minimalist Lucide-style icon tinted in a darker
    // variant of the card's own family color, rendered at low opacity.
    icon: 'eye',
    iconColor: '#A40742', // rose-pink-700
    summary: 'This week the same dynamic from mid-March resurfaced: the gap between what you wanted people to see and what they actually saw. On Apr 6 you wrote about Derek kissing you for the cameras, and the language echoed what you wrote on Mar 18 about the press ambush. This time you pushed back.',
  },
  {
    id: 'version',
    eyebrow: 'The version of yourself you showed up as',
    title: 'The reluctant performer',
    // Amber family — vibrant card, rich detail
    bgImage: 'linear-gradient(135deg, #FFEDCF 0%, #FFD68A 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 20% 85%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(160deg, #FFEDCF 0%, #FFD68A 55%, #FFB854 100%)',
    textColor: '#191C1A',
    icon: 'mask',
    iconColor: '#AF730D', // soft-ivory-900
    summary: 'The days you had to be the princess in public were the hardest to write about. You smiled at cameras you didn\'t want to smile at, said &ldquo;I don\'t know&rdquo; eleven times in interviews, and your longest entry this week came right after the Gala, when you could finally stop performing. You also deleted a draft about wanting to quit princess lessons.',
  },
  {
    id: 'word',
    eyebrow: 'A word you used more than any other',
    title: '&ldquo;Real&rdquo;',
    subtext: '11 times this week. 2 times last month.',
    // Sage family — vibrant card, rich detail
    bgImage: 'linear-gradient(135deg, #D7F2E5 0%, #A8E4C4 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 60%), linear-gradient(180deg, #D7F2E5 0%, #A8E4C4 55%, #7AD2A0 100%)',
    textColor: '#191C1A',
    icon: 'quote',
    iconColor: '#235E4D', // sage-green-900
    summary: 'The word &ldquo;real&rdquo; showed up 11 times this week, up from 2 times last month. It\'s almost always paired with Daniel or with silence, and it\'s always the opposite of &ldquo;performing&rdquo; or &ldquo;fake.&rdquo; You only wrote &ldquo;I felt real&rdquo; once, on Monday night after dancing with Daniel. You never used it when describing yourself at the Gala.',
  },
  {
    id: 'avoiding',
    eyebrow: 'What you avoided saying',
    title: 'That you miss your old self',
    // Purple family — vibrant card, rich detail
    bgImage: 'linear-gradient(135deg, #E8E4F5 0%, #C4A8E8 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(145deg, #E8E4F5 0%, #C4A8E8 55%, #9E7FD4 100%)',
    textColor: '#191C1A',
    icon: 'hourglass',
    iconColor: '#4A2F8A', // deep purple
    summary: 'There\'s a sentence you keep almost writing. You started the phrase &ldquo;before this&rdquo; six times this week without finishing it, mentioned Lilly\'s bedroom twice in passing, and deleted &ldquo;I wish&rdquo; three different times. You haven\'t written the words &ldquo;I miss&rdquo; in two weeks. The absence of the sentence is the sentence.',
  },
];

// Momentary archetypes — situational identities
const ARCHETYPES = [
  {
    id: 'performer',
    name: 'The Reluctant Performer',
    trait: 'Cameras on, heart elsewhere',
    pullQuote: '&ldquo;I kept smiling but it wasn\'t for me.&rdquo;',
    entries: 3,
    accent: '#E31665',
  },
  {
    id: 'quiet',
    name: 'The Quiet One',
    trait: 'Who you were with Daniel',
    pullQuote: '&ldquo;Neither of us said a word.&rdquo;',
    entries: 2,
    accent: '#5ABA9D',
  },
  {
    id: 'homesick',
    name: 'The Homesick Observer',
    trait: 'Watching the old life from the new one',
    pullQuote: '&ldquo;Lilly would laugh at all of this.&rdquo;',
    entries: 4,
    accent: '#E4AD51',
  },
];

// People in your story — relationships that mattered this week, paired with
// short interpretive notes. Lives in the Behavioral Highlights area of the
// Themes tab (replaces the old People tab).
// Tone buckets — how this relationship tends to feel in Ellie's entries.
// Colors pulled from the Rosebud design system tokens:
//   rose-pink-400   → draining   (same color used for "down" word shifts below)
//   soft-ivory-600  → mixed      (brand amber)
//   sage-green-500  → nourishing (same color used for "up" word shifts below)
const PEOPLE_TONE = {
  draining:   { color: '#E31665', tint: '#FFE2ED', label: 'Draining' },
  mixed:      { color: '#E4AD51', tint: '#FFEDCF', label: 'Mixed' },
  nourishing: { color: '#5ABA9D', tint: '#C2E6DB', label: 'Nourishing' },
};
const PEOPLE_IN_STORY = [
  {
    name: 'Abuela',
    mentions: 14,
    tone: 'draining',
    breakdown: { draining: 10, mixed: 3, nourishing: 1 },
    note: 'Resisting her expectations.',
    // 12 weeks of history — each entry is that week\u2019s mention count + tone
    history: [
      { week: 'Jan 10', mentions: 5, tone: 'mixed' },
      { week: 'Jan 17', mentions: 7, tone: 'mixed' },
      { week: 'Jan 24', mentions: 6, tone: 'mixed' },
      { week: 'Jan 31', mentions: 8, tone: 'mixed' },
      { week: 'Feb 7',  mentions: 9, tone: 'mixed' },
      { week: 'Feb 14', mentions: 10, tone: 'mixed' },
      { week: 'Feb 21', mentions: 11, tone: 'draining' },
      { week: 'Feb 28', mentions: 10, tone: 'draining' },
      { week: 'Mar 7',  mentions: 12, tone: 'draining' },
      { week: 'Mar 14', mentions: 11, tone: 'draining' },
      { week: 'Mar 21', mentions: 13, tone: 'draining' },
      { week: 'Mar 28', mentions: 14, tone: 'draining' },
    ],
    toneShift: 'Shifted from mixed to draining 6 weeks ago.',
    keyMoments: [
      { date: 'Apr 6', excerpt: 'Abuela dragged me through the press line again. I couldn\u2019t look at her.' },
      { date: 'Mar 21', excerpt: 'She said I was letting the family down. I wanted to scream.' },
      { date: 'Feb 21', excerpt: 'The first time she looked at me like I was a problem to solve.' },
    ],
  },
  {
    name: 'Mom',
    mentions: 12,
    tone: 'mixed',
    breakdown: { draining: 2, mixed: 7, nourishing: 3 },
    note: 'You defend her more than she defends herself.',
    history: [
      { week: 'Jan 10', mentions: 9, tone: 'nourishing' },
      { week: 'Jan 17', mentions: 10, tone: 'nourishing' },
      { week: 'Jan 24', mentions: 11, tone: 'nourishing' },
      { week: 'Jan 31', mentions: 9, tone: 'mixed' },
      { week: 'Feb 7',  mentions: 10, tone: 'mixed' },
      { week: 'Feb 14', mentions: 12, tone: 'mixed' },
      { week: 'Feb 21', mentions: 11, tone: 'mixed' },
      { week: 'Feb 28', mentions: 13, tone: 'mixed' },
      { week: 'Mar 7',  mentions: 11, tone: 'mixed' },
      { week: 'Mar 14', mentions: 12, tone: 'mixed' },
      { week: 'Mar 21', mentions: 10, tone: 'mixed' },
      { week: 'Mar 28', mentions: 12, tone: 'mixed' },
    ],
    toneShift: 'Shifted from nourishing to mixed 8 weeks ago.',
    keyMoments: [
      { date: 'Apr 5', excerpt: 'I watched Mom try to explain the Gala to Abuela and kept losing her words.' },
      { date: 'Mar 14', excerpt: 'I stepped in before Abuela could finish the sentence.' },
      { date: 'Jan 31', excerpt: 'The first time I realized she\u2019s scared too.' },
    ],
  },
  {
    name: 'Zoe',
    mentions: 11,
    tone: 'mixed',
    breakdown: { draining: 2, mixed: 6, nourishing: 3 },
    note: 'Fighting, silence, reconciliation this week.',
    history: [
      { week: 'Jan 10', mentions: 14, tone: 'nourishing' },
      { week: 'Jan 17', mentions: 13, tone: 'nourishing' },
      { week: 'Jan 24', mentions: 12, tone: 'nourishing' },
      { week: 'Jan 31', mentions: 10, tone: 'nourishing' },
      { week: 'Feb 7',  mentions: 9,  tone: 'mixed' },
      { week: 'Feb 14', mentions: 8,  tone: 'mixed' },
      { week: 'Feb 21', mentions: 7,  tone: 'mixed' },
      { week: 'Feb 28', mentions: 5,  tone: 'draining' },
      { week: 'Mar 7',  mentions: 6,  tone: 'draining' },
      { week: 'Mar 14', mentions: 8,  tone: 'mixed' },
      { week: 'Mar 21', mentions: 9,  tone: 'mixed' },
      { week: 'Mar 28', mentions: 11, tone: 'mixed' },
    ],
    toneShift: 'Was nourishing, turned draining, recovering to mixed.',
    keyMoments: [
      { date: 'Apr 8', excerpt: 'We finally talked. She cried first. I did too.' },
      { date: 'Mar 2', excerpt: 'She blocked me on everything. I cried in the bathroom.' },
      { date: 'Feb 28', excerpt: 'The fight I\u2019ve been trying not to have for a month.' },
    ],
  },
  {
    name: 'Priya',
    mentions: 10,
    tone: 'nourishing',
    breakdown: { draining: 0, mixed: 2, nourishing: 8 },
    note: 'Friendship that started when you stopped ranking.',
    history: [
      { week: 'Jan 10', mentions: 1, tone: 'mixed' },
      { week: 'Jan 17', mentions: 2, tone: 'mixed' },
      { week: 'Jan 24', mentions: 2, tone: 'mixed' },
      { week: 'Jan 31', mentions: 3, tone: 'nourishing' },
      { week: 'Feb 7',  mentions: 4, tone: 'nourishing' },
      { week: 'Feb 14', mentions: 5, tone: 'nourishing' },
      { week: 'Feb 21', mentions: 6, tone: 'nourishing' },
      { week: 'Feb 28', mentions: 7, tone: 'nourishing' },
      { week: 'Mar 7',  mentions: 7, tone: 'nourishing' },
      { week: 'Mar 14', mentions: 8, tone: 'nourishing' },
      { week: 'Mar 21', mentions: 9, tone: 'nourishing' },
      { week: 'Mar 28', mentions: 10, tone: 'nourishing' },
    ],
    toneShift: 'Steadily rising. Started mixed, nourishing for 9 weeks.',
    keyMoments: [
      { date: 'Apr 4', excerpt: 'She laughed at the thing I was afraid to say out loud.' },
      { date: 'Mar 14', excerpt: 'I think she\u2019s my actual friend now. Not a ranking.' },
      { date: 'Jan 31', excerpt: 'The first day we walked home together without Zoe.' },
    ],
  },
  {
    name: 'Daniel',
    mentions: 9,
    tone: 'nourishing',
    breakdown: { draining: 0, mixed: 1, nourishing: 8 },
    note: 'Small physical details. Smells like soap.',
    history: [
      { week: 'Jan 10', mentions: 0, tone: 'mixed' },
      { week: 'Jan 17', mentions: 0, tone: 'mixed' },
      { week: 'Jan 24', mentions: 0, tone: 'mixed' },
      { week: 'Jan 31', mentions: 0, tone: 'mixed' },
      { week: 'Feb 7',  mentions: 0, tone: 'mixed' },
      { week: 'Feb 14', mentions: 0, tone: 'mixed' },
      { week: 'Feb 21', mentions: 0, tone: 'mixed' },
      { week: 'Feb 28', mentions: 0, tone: 'mixed' },
      { week: 'Mar 7',  mentions: 1, tone: 'nourishing' },
      { week: 'Mar 14', mentions: 4, tone: 'nourishing' },
      { week: 'Mar 21', mentions: 6, tone: 'nourishing' },
      { week: 'Mar 28', mentions: 9, tone: 'nourishing' },
    ],
    toneShift: 'Arrived 5 weeks ago. Nourishing from the first mention.',
    keyMoments: [
      { date: 'Apr 7', excerpt: 'Neither of us said a word. But the silence felt full.' },
      { date: 'Mar 21', excerpt: 'He smells like soap. I keep writing that down.' },
      { date: 'Mar 7', excerpt: 'I don\u2019t even know why I wrote his name.' },
    ],
  },
  {
    name: 'Derek',
    mentions: 8,
    tone: 'draining',
    breakdown: { draining: 5, mixed: 2, nourishing: 1 },
    note: 'Dramatic words, never small details.',
    history: [
      { week: 'Jan 10', mentions: 0, tone: 'mixed' },
      { week: 'Jan 17', mentions: 0, tone: 'mixed' },
      { week: 'Jan 24', mentions: 0, tone: 'mixed' },
      { week: 'Jan 31', mentions: 0, tone: 'mixed' },
      { week: 'Feb 7',  mentions: 0, tone: 'mixed' },
      { week: 'Feb 14', mentions: 0, tone: 'mixed' },
      { week: 'Feb 21', mentions: 2, tone: 'nourishing' },
      { week: 'Feb 28', mentions: 4, tone: 'nourishing' },
      { week: 'Mar 7',  mentions: 7, tone: 'nourishing' },
      { week: 'Mar 14', mentions: 9, tone: 'mixed' },
      { week: 'Mar 21', mentions: 11, tone: 'draining' },
      { week: 'Mar 28', mentions: 8, tone: 'draining' },
    ],
    toneShift: 'Arrived nourishing, flipped to draining 2 weeks ago.',
    keyMoments: [
      { date: 'Apr 6', excerpt: 'I told him to let go of my hand. Everyone was watching.' },
      { date: 'Mar 21', excerpt: 'He kissed me for the cameras. I felt like a prop.' },
      { date: 'Feb 21', excerpt: 'Derek Thompson asked me out!!!' },
    ],
  },
];

// Quarter-scope version of PEOPLE_IN_STORY — derived from the same list
// but with mentions summed across the 12-week history and tone determined
// by which tone dominates those weeks' mentions. This lets the quarter
// view use the exact same donut + drill-down pattern as the week view
// (same people, same per-person chart, same key moments) without needing
// a parallel hand-authored dataset. The history / toneShift / keyMoments
// fields are preserved so the person detail view still works.
const PEOPLE_IN_STORY_QUARTER = PEOPLE_IN_STORY.map((p) => {
  const totalMentions = p.history.reduce((sum, h) => sum + h.mentions, 0);
  // Sum mentions per tone across all weeks, then pick the dominant one
  // as the person's quarter-level tone.
  const toneCounts = p.history.reduce((acc, h) => {
    acc[h.tone] = (acc[h.tone] || 0) + h.mentions;
    return acc;
  }, {});
  const dominantTone = Object.keys(toneCounts).reduce(
    (a, b) => (toneCounts[a] >= toneCounts[b] ? a : b),
    'mixed',
  );
  return {
    ...p,
    mentions: totalMentions,
    tone: dominantTone,
    breakdown: {
      draining: toneCounts.draining || 0,
      mixed: toneCounts.mixed || 0,
      nourishing: toneCounts.nourishing || 0,
    },
  };
});

// Echoes — moments this week that rhyme with earlier entries.
// Shaped exactly like STORIES so they render through the same swipeable
// card pattern and full-screen takeover treatment. The card gradient is
// a slightly washed version of the matching story family (rose / sage)
// so echoes feel like faded callbacks to the current-week cards above.
const ECHOES = [
  {
    id: 'dragged',
    eyebrow: 'Echoing Mar 18',
    title: 'Being dragged, again',
    subtext: '3 weeks earlier',
    // Rose family — muted card, rich detail
    bgImage: 'linear-gradient(135deg, #FFF5F9 0%, #FFE4EC 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 75% 15%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(135deg, #FFE2ED 0%, #FFC2D8 55%, #FF9EBE 100%)',
    textColor: '#191C1A',
    pastDate: 'Mar 18',
    thisDate: 'Apr 6',
    pastQuote:
      '&ldquo;Sven gave me his handkerchief. It was just like I was a murderer, or a celebrity, or something.&rdquo;',
    thisQuote:
      '&ldquo;I told him to let go of my hand. Everyone was watching. I felt like I was being dragged.&rdquo;',
    summary:
      'Then, Abuela dragged you into a press ambush on Mar 18. This week, Derek kissed you for the cameras and wouldn&rsquo;t let go of your hand at the Gala. Three weeks apart you reached for almost the same word &mdash; &ldquo;dragged&rdquo; &mdash; to describe the same feeling of being taken somewhere you didn&rsquo;t want to go. The difference: this week you pushed back.',
  },
  {
    id: 'real',
    eyebrow: 'Echoing Mar 17',
    title: 'Choosing real over perfect',
    subtext: '3 weeks earlier',
    // Sage family — muted card, rich detail
    bgImage: 'linear-gradient(135deg, #F5FBF7 0%, #E4F0E8 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 60%), linear-gradient(180deg, #D7F2E5 0%, #A8E4C4 55%, #7AD2A0 100%)',
    textColor: '#191C1A',
    pastDate: 'Mar 17',
    thisDate: 'Apr 7',
    pastQuote:
      '&ldquo;Daniel is a real person. Derek is like a movie star. You don&rsquo;t tell movie stars your most embarrassing secrets.&rdquo;',
    thisQuote:
      '&ldquo;I couldn&rsquo;t say which I liked better, talking to Daniel or dancing with him.&rdquo;',
    summary:
      'You wrote about what made Daniel feel &ldquo;real&rdquo; on Mar 17. You used that word 11 more times this week, almost always about him, almost always next to the word &ldquo;quiet.&rdquo; In March you chose it without realizing you were choosing it. This week you chose it knowing exactly what you were saying no to.',
  },
];

/* ══════════════════════════════════════════════════════════
   The Story of You — third-person character study
   The closing section of the Themes tab. A prose reflection
   written in third person, like a literary character sketch
   of the user for the period. Bold uppercase labels create
   safe distance so painful patterns are readable. Week and
   quarter views get different content.
   ══════════════════════════════════════════════════════════ */
const STORY_OF_YOU = {
  name: 'Ellie',
  period: 'This week',
  hook: 'She was stretched thin, kept returning to a word, and walked away from something for the first time.',
  readTime: '2 min read',
  // Audiobook-style prose — single text style, flowing paragraphs, no
  // section labels or bullets. What the user sees in the full-screen
  // takeover and what the audio narrator would read aloud.
  prose: [
    'This week, Ellie was stretched thin. Princess lessons sat heavier than she wanted to admit, and the cameras at the Gala on Sunday took something out of her that she is still getting back.',
    'She kept returning to three things. The gap between being looked at and being seen. How different silence felt with Daniel than with Derek. And whether pushing back on Abuela makes her ungrateful, or just grown.',
    'She was energized by moments where she did not have to perform. Dancing with Daniel in the quiet. Writing long entries late at night. The version of herself that Lilly still remembers.',
    'She was exhausted by the parts of princess life that ask her to be smaller than she is. Being dragged through public attention, again, this time by Derek. The word "real" showed up eleven times in her entries this week, more than any other week on record.',
    'What to watch next: whether the version of herself she showed up as on Monday, the one who walked away from Derek, sticks. Or whether Abuela\u2019s next ask pulls her back into the old shape.',
  ],
  epigraph: '&ldquo;I don&rsquo;t need you. I can get my own publicity.&rdquo;',
  sections: [
    {
      label: 'She was',
      body: 'Stretched thin. Princess lessons sat heavier than she wanted to admit, and the cameras at the Gala on Sunday took something out of her that she&rsquo;s still getting back.',
    },
    {
      label: 'She kept returning to',
      bullets: [
        {
          text: 'The gap between being looked at and being seen.',
          quote: '&ldquo;All I felt was embarrassed. I wasn&rsquo;t getting the warm gushy feeling everyone talks about.&rdquo;',
        },
        {
          text: 'How different silence felt with Daniel than with Derek.',
          quote: '&ldquo;Neither of us said a word. But the silence felt full.&rdquo;',
        },
        {
          text: 'Whether pushing back on Abuela makes her ungrateful or just grown.',
          quote: '&ldquo;I&rsquo;m telling him. I&rsquo;m telling him the truth.&rdquo;',
        },
      ],
    },
    {
      label: 'She was energized by',
      body: 'Moments where she didn&rsquo;t have to perform. Dancing with Daniel in quiet. Writing long entries late at night. The version of herself Lilly remembers.',
      quote: '&ldquo;I couldn&rsquo;t say which I liked better, talking to Daniel or dancing with him.&rdquo;',
    },
    {
      label: 'She was exhausted by',
      body: 'The parts of princess life that ask her to be smaller than she is. Being dragged through public attention, again, this time by Derek. The word &ldquo;real&rdquo; showed up 11 times in her entries, more than any other week on record.',
      quote: '&ldquo;You don&rsquo;t tell movie stars your most embarrassing secrets.&rdquo;',
    },
    {
      label: 'What to watch next week',
      body: 'Whether the version of herself she showed up as on Monday (the one who walked away from Derek) sticks, or whether Abuela&rsquo;s next ask pulls her back into the old shape.',
    },
  ],
};

// Quarter version — zooms out to the 3-month arc instead of one week.
const STORY_OF_YOU_QUARTER = {
  name: 'Ellie',
  period: 'Last 3 months',
  hook: 'She started the quarter furious, let go of a word, found Daniel slowly, and learned a new way to say no.',
  readTime: '4 min read',
  prose: [
    'Ellie started the quarter furious, disoriented, and writing more than she ever had. January entries came fast and late at night, full of the word "before" and barely any commas. She was still grieving the girl she used to be with Lilly, and the announcement had not finished landing yet.',
    'Over the next three months she kept writing toward the same handful of questions. A way to say no that did not require her to be angry first. Whether the rules were a performance she had to learn or a life she had to fit inside. And the difference between being chosen and being seen.',
    'She let go of the word "perfect." It was her highest-frequency adjective in January. By April she had almost stopped reaching for it. In its place came "real," a word that barely existed in her writing three months ago. She stopped saying "I should" three times a day and started saying "I don\u2019t want to" without apologizing for it.',
    'She found Daniel slowly, in his own paragraphs. A version of silence that felt full instead of empty. A way of writing about her mother that was starting to look like watching her. And a Secret Writer voice that only showed up after eleven at night.',
    'What the next chapter is asking: whether the version of herself that walked out of the Gala is the one she keeps, or whether it was a moment. Whether she lets Daniel become a thing she writes about in daylight. Whether she calls Lilly.',
  ],
  epigraph: '&ldquo;I don&rsquo;t want to go. I&rsquo;m not going to make myself want to go. I&rsquo;m just going to go.&rdquo;',
  sections: [
    {
      label: 'She started the quarter',
      body: 'Furious, disoriented, and writing more than she ever had. January entries came fast and late at night, full of the word &ldquo;before&rdquo; and barely any commas. She was still grieving the girl she used to be with Lilly, and the announcement hadn&rsquo;t finished landing yet.',
    },
    {
      label: 'She kept writing toward',
      bullets: [
        {
          text: 'A way to say no that didn&rsquo;t require her to be angry first.',
          quote: '&ldquo;I shouldn&rsquo;t have to yell just to be allowed to not want something.&rdquo;',
        },
        {
          text: 'Whether the rules were a performance she had to learn or a life she had to fit inside.',
          quote: '&ldquo;Carlos says there&rsquo;s a reason for everything. I don&rsquo;t believe him but I want to.&rdquo;',
        },
        {
          text: 'The difference between being chosen and being seen.',
          quote: '&ldquo;Derek chose me for the cameras. Daniel doesn&rsquo;t choose me at all. He just shows up.&rdquo;',
        },
      ],
    },
    {
      label: 'She let go of',
      body: 'The word &ldquo;perfect.&rdquo; It was her highest-frequency adjective in January; by April she had almost stopped reaching for it. In its place came &ldquo;real,&rdquo; a word that barely existed in her writing three months ago. She stopped saying &ldquo;I should&rdquo; three times a day and started saying &ldquo;I don&rsquo;t want to&rdquo; without apologizing for it.',
      quote: '&ldquo;I&rsquo;m not going to make myself want to go. I&rsquo;m just going to go.&rdquo;',
    },
    {
      label: 'She found',
      body: 'Daniel, slowly, in his own paragraphs. A version of silence that felt full instead of empty. A way of writing about her mother that was starting to look like watching her. The Secret Writer voice that only showed up after 11pm.',
    },
    {
      label: 'What the next chapter is asking',
      body: 'Whether the version of herself that walked out of the Gala is the one she keeps, or whether it was a moment. Whether she lets Daniel become a thing she writes about in daylight. Whether she calls Lilly.',
    },
  ],
};

// Themes — recurring topics, word shifts
const THEME_HERO = {
  title: 'Being seen vs. being used',
  frequency: 11,
  period: 'entries',
  pullQuote: '&ldquo;All I felt was embarrassed. I wasn\'t getting the warm gushy feeling everyone talks about.&rdquo;',
};

const THEMES = [
  { emoji: '🪞', label: 'Being seen vs. used', count: 11 },
  { emoji: '🎭', label: 'Performance vs. authenticity', count: 9 },
  { emoji: '⚡', label: 'Authority & pushback', count: 7 },
  { emoji: '🌀', label: 'Loneliness in a crowd', count: 6 },
  { emoji: '💫', label: 'First kisses & first times', count: 5 },
  { emoji: '🎪', label: 'Humor as deflection', count: 5 },
];

// Behavioral Highlights — 2x2 grid of OBSERVATIONS rooted in actual
// writing this week. Deliberately avoids identity-style labels like
// "coping style" or "attachment style" because those require more
// longitudinal data to be defensible and risk assigning the user a
// new personality every week (which feels like AI slop and breaks
// the "building on itself" promise). Each card is either a count,
// an echo, a direct quote, or a continuation — things the system
// can point to in the entries, not things it infers about identity.
// Click → full-screen detail view.
const STYLES = [
  {
    id: 'returning-theme',
    category: 'A theme that keeps returning',
    name: '\u201CFeeling behind\u201D',
    tagline: 'Four weeks in a row now',
    color: '#E31665',
    textColor: '#8A1E3E',
    bgImage:
      'radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(135deg, #FFA8C0 0%, #FFC0A5 55%, #FFD690 100%)',
    detailBg: 'from-[#FFE2ED] via-[#FFF0F6] to-[#FFFFFF]',
    shape: 'triangle',
    detail: 'You&rsquo;ve written about &ldquo;feeling behind&rdquo; in four consecutive weeks now. It started the week after the princess announcement, and every time it reappears, it shows up in entries you wrote between 10pm and midnight. That timing is consistent across all four weeks. Not a mood &mdash; a rhythm. Worth knowing it has a shape.',
  },
  {
    id: 'recurring-question',
    category: 'A question you kept asking yourself',
    name: '\u201CWhy can\u2019t I just say it?\u201D',
    tagline: '4 times this week, 11 this month',
    color: '#D08A00',
    textColor: '#6B3F00',
    bgImage:
      'radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.48) 0%, transparent 55%), linear-gradient(135deg, #FFCE70 0%, #FFB490 55%, #FF9A9A 100%)',
    detailBg: 'from-[#FFEDCF] via-[#FFF6E8] to-[#FFFFFF]',
    shape: 'diamond',
    detail: 'You asked yourself &ldquo;why can&rsquo;t I just say it?&rdquo; or a variation of it four times this week. That&rsquo;s 11 times in the past month, across entries about Lilly, about your mother, about Daniel. The question moves between people but the shape stays the same. You first wrote it on Jan 19. You&rsquo;re still asking it.',
  },
  {
    id: 'time-of-day',
    category: 'When you write, what you write',
    name: 'Before 9am, honest',
    tagline: 'Your earliest entries say the hardest things',
    color: '#2B7A5E',
    textColor: '#191C1A',
    bgImage:
      'radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.48) 0%, transparent 55%), linear-gradient(135deg, #86DCB2 0%, #8ADBD2 55%, #9AC8EA 100%)',
    detailBg: 'from-[#D7F2E5] via-[#F0FFF4] to-[#FFFFFF]',
    shape: 'circle',
    detail: 'Your longest entries this week started between 11pm and 1am &mdash; they run circular, defensive, angry. But the shortest entries, the ones you wrote before 9am, are where the honest things live: &ldquo;I don&rsquo;t actually want this.&rdquo; &ldquo;I miss her.&rdquo; &ldquo;I&rsquo;m scared.&rdquo; Those all came out in under 200 words, in the early morning. The time of day is predicting the kind of entry you&rsquo;ll write.',
  },
  {
    id: 'thread-continuation',
    category: 'A thread from last week',
    name: 'The conversation you said you\u2019d have',
    tagline: 'Written 3 times. Still pending.',
    color: '#7C4DB8',
    textColor: '#3D2063',
    bgImage:
      'radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(135deg, #BFA0E5 0%, #D4ABE0 55%, #ECAED0 100%)',
    detailBg: 'from-[#EDE4F7] via-[#F7F1FC] to-[#FFFFFF]',
    shape: 'star',
    detail: 'Last week you wrote &ldquo;I need to talk to Lilly&rdquo; three times, and on Sunday you wrote &ldquo;I&rsquo;m going to do it this week.&rdquo; This week you wrote three entries that mention Lilly. None of them include a conversation. Not a judgment &mdash; just a thread pulled forward so the plan doesn&rsquo;t get buried. Pick it up when you&rsquo;re ready.',
  },
];

/* ══════════════════════════════════════════════════════════
   QUARTER VIEW DATA — Last 3 months (Jan 10 – Apr 9)
   Parallel data set so the Themes tab can render a longitudinal
   version of the anthology when the user picks "Last 3 months"
   from the timeframe dropdown. Content is narratively shaped
   to Ellie's Jan–Apr arc: the princess announcement, losing
   touch with Lilly, Daniel arriving in March, the Gala week.
   ══════════════════════════════════════════════════════════ */

// Arc-shaped stories — these are NOT this week's moments, they
// are the 3-month threads that have been running for weeks.
const QUARTER_STORIES = [
  {
    id: 'lilly',
    eyebrow: 'The thread that is fading',
    title: 'The girl you used to be with Lilly',
    subtext: '147 mentions in Jan · 12 in Apr',
    bgImage: 'linear-gradient(135deg, #F7F1FC 0%, #E8DDF5 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(145deg, #E8E4F5 0%, #C4A8E8 55%, #9E7FD4 100%)',
    textColor: '#191C1A',
    // Hourglass — time slipping, what's being lost to distance
    icon: 'hourglass',
    iconColor: '#4A2F8A',
    summary:
      'Lilly was the most-named person in your entries through January. By mid-February you mentioned her half as often. By April it&rsquo;s 12 times, and most of those are in past tense. You stopped writing &ldquo;I told Lilly&rdquo; and started writing &ldquo;Lilly would&rsquo;ve said.&rdquo; That shift happened the week after the princess announcement, and it hasn&rsquo;t reversed. Worth knowing that the distance you&rsquo;re describing has a shape.',
  },
  {
    id: 'rules',
    eyebrow: 'The thread that has become the spine',
    title: 'Learning the rules you don&rsquo;t believe in',
    subtext: '47 entries touch this in 3 months',
    bgImage: 'linear-gradient(135deg, #FFF6E8 0%, #FFE8C8 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 20% 85%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(160deg, #FFEDCF 0%, #FFD68A 55%, #FFB854 100%)',
    textColor: '#191C1A',
    // Mask — performing a role that isn't yours, the "princess" self
    icon: 'mask',
    iconColor: '#AF730D',
    summary:
      'Princess lessons started the first week of February and have shown up in 47 entries since. At first you wrote about them the way you&rsquo;d write about a punishment (short, angry, lots of &ldquo;they made me&rdquo;). By March the entries got longer and more curious — you started noticing how Carlos the tutor actually explains things, started asking why the rules exist. By April the word &ldquo;rules&rdquo; is almost always paired with &ldquo;don&rsquo;t make sense&rdquo; rather than &ldquo;I have to.&rdquo; You&rsquo;re not accepting them. You&rsquo;re just stopping pretending they&rsquo;re self-evident.',
  },
  {
    id: 'daniel',
    eyebrow: 'The thread that arrived',
    title: 'Daniel, slowly',
    subtext: 'First mention Mar 14 · 31 since',
    bgImage: 'linear-gradient(135deg, #F0FFF4 0%, #DBF2E4 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 60%), linear-gradient(180deg, #D7F2E5 0%, #A8E4C4 55%, #7AD2A0 100%)',
    textColor: '#191C1A',
    // Moon — quiet arrival, something new and soft in the periphery
    icon: 'moon',
    iconColor: '#235E4D',
    summary:
      'You didn&rsquo;t mention Daniel once in January or February. He shows up on March 14 — half a sentence, as a name in a list. By late March he has his own paragraphs. In April he has his own entries. You describe him in physical details almost nobody else gets: how he smells, what his hands look like, the exact cadence of the pauses in his speech. Every other person in your journal gets named for what they do. Daniel gets named for what he is.',
  },
  {
    id: 'word',
    eyebrow: 'The word that won',
    title: '&ldquo;Real&rdquo; replaced &ldquo;perfect&rdquo;',
    subtext: 'Jan: perfect 34× · Apr: real 24×',
    bgImage: 'linear-gradient(135deg, #FFF0F6 0%, #FFDCE8 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 75% 15%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(135deg, #FFE2ED 0%, #FFC2D8 55%, #FF9EBE 100%)',
    textColor: '#191C1A',
    // Quote — language shift, a word that replaced another
    icon: 'quote',
    iconColor: '#A40742',
    summary:
      'In January you used the word &ldquo;perfect&rdquo; 34 times. It was your highest-frequency adjective for the whole month. By April you&rsquo;ve used it 7 times total, and half of those are about things you&rsquo;re rejecting. In its place is &ldquo;real&rdquo; — a word that appeared twice in January, climbing every week, now at 24 mentions in just the past nine days. You didn&rsquo;t announce the swap. You didn&rsquo;t even notice it. It&rsquo;s the quietest decision you&rsquo;ve made all quarter, and it&rsquo;s maybe the biggest.',
  },
];

// Chapter markers — the 3 months broken into monthly chapters,
// like a table of contents for the period. This is a NEW section
// that only makes sense at the longitudinal view.
const QUARTER_CHAPTERS = [
  {
    id: 'jan',
    label: 'Jan 10 – Jan 31',
    title: 'The announcement and the unraveling',
    headline:
      'You wrote more entries this month than any previous month on record, most of them late at night, most of them angry. The word &ldquo;before&rdquo; appeared 41 times.',
    stat: { value: '38', label: 'entries' },
  },
  {
    id: 'feb',
    label: 'Feb 1 – Feb 28',
    title: 'Learning the rules',
    headline:
      'You started saying yes to things you would&rsquo;ve said no to in January. Your entries got shorter. You mentioned Lilly half as often, and started mentioning Carlos, your etiquette tutor.',
    stat: { value: '29', label: 'entries' },
  },
  {
    id: 'mar',
    label: 'Mar 1 – Mar 31',
    title: 'Pushing back',
    headline:
      'Derek arrives. Daniel arrives. The word &ldquo;real&rdquo; shows up for the first time. The press ambush on Mar 18 is the longest single entry you&rsquo;ve written in 2026.',
    stat: { value: '34', label: 'entries' },
  },
  {
    id: 'apr',
    label: 'Apr 1 – Apr 9',
    title: 'Finding the shape',
    headline:
      'The Gala. The dance. The first time you walked away from something instead of through it. This week is the highest weekly mood average of the quarter.',
    stat: { value: '11', label: 'entries' },
    current: true,
  },
];

// Weekly mood averages across the 12-week period. Key inflection
// points get stickers; everything else is a quiet dot.
const QUARTER_MOOD_ARC = [
  { day: 'Jan 10', label: 'Jan 10', mood: 'frustrated', score: 3.5 },
  { day: 'Jan 17', label: 'Jan 17', mood: 'angry', score: 2.8, key: true },
  { day: 'Jan 24', label: 'Jan 24', mood: 'disappointed', score: 3.2 },
  { day: 'Jan 31', label: 'Jan 31', mood: 'frustrated', score: 4.0 },
  { day: 'Feb 7',  label: 'Feb 7',  mood: 'calm',         score: 4.5 },
  { day: 'Feb 14', label: 'Feb 14', mood: 'calm',         score: 4.2 },
  { day: 'Feb 21', label: 'Feb 21', mood: 'calm',         score: 5.1 },
  { day: 'Feb 28', label: 'Feb 28', mood: 'anticipating', score: 5.5 },
  { day: 'Mar 7',  label: 'Mar 7',  mood: 'frustrated',   score: 4.8 },
  { day: 'Mar 14', label: 'Mar 14', mood: 'joyful',       score: 5.4, key: true },
  { day: 'Mar 21', label: 'Mar 21', mood: 'angry',        score: 4.3 },
  { day: 'Mar 28', label: 'Mar 28', mood: 'calm',         score: 5.8 },
  { day: 'Apr 4',  label: 'Apr 4',  mood: 'joyful',       score: 6.2, key: true },
];

// Previous quarter for comparison (Oct 10 – Jan 9) — flatter, lower overall.
const QUARTER_PREVIOUS_MOOD_ARC = [
  { score: 5.2 }, { score: 5.0 }, { score: 5.3 }, { score: 5.1 },
  { score: 4.9 }, { score: 5.2 }, { score: 5.4 }, { score: 5.1 },
  { score: 4.8 }, { score: 5.0 }, { score: 4.7 }, { score: 4.5 },
  { score: 4.2 },
];

// Dominant identities over 3 months. Different mix than the week view —
// longer-running identities rise, momentary ones drop away.
const QUARTER_STYLES = [
  {
    id: 'apprentice',
    category: 'Most-worn identity',
    name: 'The Apprentice',
    tagline: 'Learning a life you didn\u2019t pick',
    color: '#E4AD51',
    shape: 'star',
    detail:
      'For 34 out of 86 entries this quarter you wrote from the position of someone being instructed. Princess lessons, protocol, the right way to hold a teacup. In January these entries were short and angry. By March they got longer and more curious.',
  },
  {
    id: 'homesick',
    category: 'The observer',
    name: 'The Homesick One',
    tagline: 'Watching your old life from the new one',
    color: '#9E7FD4',
    shape: 'eye',
    detail:
      'Twenty-two entries this quarter mention a specific object, smell, or room from your life with Lilly. You rarely say you miss it. You describe it.',
  },
  {
    id: 'heir',
    category: 'Emerging',
    name: 'The Reluctant Heir',
    tagline: 'Starting to imagine it might be yours',
    color: '#5ABA9D',
    shape: 'crown',
    detail:
      'Eighteen entries, mostly in March and April, where you describe a decision you&rsquo;d have to make as the princess and don&rsquo;t immediately reject it. This voice didn&rsquo;t exist in January.',
  },
  {
    id: 'writer',
    category: 'New voice',
    name: 'The Secret Writer',
    tagline: 'Long entries, late at night, for no one',
    color: '#E31665',
    shape: 'pen',
    detail:
      'Your entries after 11pm have gotten 3.2x longer since February. You never mention them in daytime entries. This voice shows up only when you&rsquo;re alone.',
  },
];

// People in your story — restructured around arrival/persistence
// rather than tone, because arrival only becomes visible over months.
const QUARTER_PEOPLE_GROUPS = [
  {
    id: 'persistent',
    label: 'At the center the whole time',
    color: '#E4AD51',
    people: [
      { name: 'Abuela', detail: '127 mentions · almost every entry' },
      { name: 'Mom',    detail: '94 mentions · you defend her more than she defends herself' },
    ],
  },
  {
    id: 'fading',
    label: 'Fading',
    color: '#9E7FD4',
    people: [
      { name: 'Lilly',         detail: '147 in Jan \u2192 12 in Apr · past tense now' },
      { name: 'Zoe',           detail: '58 in Jan \u2192 18 in Apr · you talk about her less, to her less' },
      { name: 'Grandpa Trevor',detail: '22 in Jan \u2192 3 in Apr · mostly logistics now' },
    ],
  },
  {
    id: 'arrived',
    label: 'Arrived mid-quarter',
    color: '#5ABA9D',
    people: [
      { name: 'Carlos', detail: 'First mention Feb 3 · 22 since · your etiquette tutor' },
      { name: 'Daniel', detail: 'First mention Mar 14 · 31 since · his own paragraphs now' },
      { name: 'Derek',  detail: 'First mention Mar 4 · 28 since · spiked in March, declining' },
    ],
  },
];

// Language has shifted — concept-level deltas over 3 months.
// This is NOT a frequency list (that was Word Shifts, which got cut).
// This is "how you talk about X has changed." The then vs. now is
// reconstructed from actual entries.
const QUARTER_LANGUAGE_SHIFTS = [
  {
    id: 'perfect-real',
    concept: 'What counts as a good day',
    before: '&ldquo;Today was fine. I got through princess lessons without crying.&rdquo;',
    beforeDate: 'Jan 22',
    after: '&ldquo;I spent forty-five minutes talking to Daniel about nothing. That was the whole day. That was enough.&rdquo;',
    afterDate: 'Apr 7',
  },
  {
    id: 'should-want',
    concept: 'How you ask yourself to do things',
    before: '&ldquo;I should be grateful. I should be better at this. I should stop crying about it.&rdquo;',
    beforeDate: 'Jan 14',
    after: '&ldquo;I don&rsquo;t want to go. I&rsquo;m not going to make myself want to go. I&rsquo;m just going to go.&rdquo;',
    afterDate: 'Apr 2',
  },
  {
    id: 'mom',
    concept: 'How you describe Mom',
    before: '&ldquo;Mom is being impossible again. She won&rsquo;t even let me finish a sentence.&rdquo;',
    beforeDate: 'Jan 11',
    after: '&ldquo;I watched Mom try to explain the Gala to Abuela and she kept losing her words. I wanted to reach over and finish them for her.&rdquo;',
    afterDate: 'Apr 5',
  },
];

// ══════════════════════════════════════════════════════════
// Signals — tracked data (sleep, meds, period, exercise)
// ══════════════════════════════════════════════════════════

const CORRELATIONS = [
  {
    id: 'meds-sleep',
    eyebrow: 'Correlation found',
    headline: 'On days you skipped meds, you slept 2 hours less.',
    detail: 'Two low-sleep nights this week both followed missed allergy doses. The third missed dose lined up with a day you wrote &ldquo;my head\'s pounding.&rdquo;',
    // Card visuals — gradient family + decorative icon, same pattern
    // as STORIES so the correlations carousel matches the themes row.
    bgImage: 'linear-gradient(135deg, #FFE2ED 0%, #FFC2D8 100%)',
    textColor: '#191C1A',
    icon: 'moon',
    iconColor: '#A40742',
    chart: {
      days: ['Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We'],
      primary: { label: 'Sleep hours', color: '#6B8BC4', values: [7, 6, 8, 5, 7, 4, 6], max: 10 },
      secondary: { label: 'Meds taken', color: '#E4AD51', values: [1, 1, 1, 0, 1, 0, 1], max: 1 },
    },
    deeper: {
      framework: 'Habit-sleep cascade',
      frameworkTag: 'from CBT-I',
      insight: 'Small missed routines compound faster than most people realize. A single skipped dose can shift a sleep window by 30\u201360 minutes; two in a week can cut two hours or more. Your body treats a missed dose as a disruption signal, which raises cortisol at night. This isn\u2019t about willpower \u2014 it\u2019s about a nervous system trying to compensate for something it expected.',
      prompts: [
        'What gets in the way of the dose on the days you skip it?',
        'What does &ldquo;head pounding&rdquo; feel like in your body versus your mind?',
        'Is there a different time of day or anchor (morning coffee, brushing teeth) that might make the routine more automatic?',
      ],
    },
  },
  {
    id: 'sleep-writing',
    eyebrow: 'Correlation found',
    headline: 'Your longest entries follow your lowest-sleep nights.',
    detail: 'After 5 hours on Sunday you wrote 2,083 words. After 4 hours on Tuesday, you wrote 2,400. Low sleep seems to pull more out of you onto the page.',
    bgImage: 'linear-gradient(135deg, #FFEDCF 0%, #FFD68A 100%)',
    textColor: '#191C1A',
    icon: 'quote',
    iconColor: '#AF730D',
    chart: {
      days: ['Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We'],
      primary: { label: 'Words written', color: '#E31665', values: [1200, 1500, 900, 2083, 1600, 2400, 1700], max: 3000 },
      secondary: { label: 'Sleep hours', color: '#6B8BC4', values: [7, 6, 8, 5, 7, 4, 6], max: 10 },
    },
    deeper: {
      framework: 'Writing as processing',
      frameworkTag: 'from Narrative therapy',
      insight: 'Sleep-deprived minds often write more, not less. When the usual filters are down, more comes up \u2014 and writing becomes a way to metabolize what the nervous system is holding. This pattern is well-documented: poor sleep increases amygdala activity, which surfaces more emotional material, which finds a channel through language. Your longest entries might be the nights your body needed somewhere to put the overflow.',
      prompts: [
        'What changes in your writing after a low-sleep night?',
        'If the entry is the &ldquo;overflow,&rdquo; what is it protecting you from holding during the day?',
        'Is there a version of this processing that could happen before bed instead of after?',
      ],
    },
  },
  {
    id: 'warmth-exercise',
    eyebrow: 'Correlation found',
    headline: 'Warm-person entries were followed by exercise days.',
    detail: 'Every entry mentioning Daniel, Priya, or Lilly was followed by a 20+ minute movement day. Distant-person entries were followed by rest days.',
    bgImage: 'linear-gradient(135deg, #D7F2E5 0%, #A8E4C4 100%)',
    textColor: '#191C1A',
    icon: 'eye',
    iconColor: '#235E4D',
    chart: {
      days: ['Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We'],
      primary: { label: 'Exercise min', color: '#5ABA9D', values: [0, 30, 45, 0, 20, 0, 15], max: 60 },
      secondary: { label: 'Warm mentions', color: '#E4AD51', values: [0, 2, 3, 0, 1, 0, 1], max: 4 },
    },
    deeper: {
      framework: 'Behavioral activation',
      frameworkTag: 'from CBT',
      insight: 'The causality might run both ways: feeling warmly toward people makes movement easier, and movement makes it easier to feel connected. Psychologists call this a positive feedback loop. What\u2019s notable isn\u2019t that exercise happens after warm entries \u2014 it\u2019s that the absence of warm mentions reliably predicts rest days. Your body may be using felt connection as fuel.',
      prompts: [
        'Which person\u2019s presence in your writing reliably lifts your energy?',
        'What would it look like to schedule movement after seeing someone warm, instead of planning it in isolation?',
        'Is there a distant-person pattern you could soften by moving first?',
      ],
    },
  },
];

const WEEK_DAYS = ['Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We'];

const SLEEP_LOG = [
  { day: 'Th', date: 'Apr 3', hours: 7 },
  { day: 'Fr', date: 'Apr 4', hours: 6 },
  { day: 'Sa', date: 'Apr 5', hours: 8 },
  { day: 'Su', date: 'Apr 6', hours: 5 },
  { day: 'Mo', date: 'Apr 7', hours: 7 },
  { day: 'Tu', date: 'Apr 8', hours: 4, low: true },
  { day: 'We', date: 'Apr 9', hours: 6 },
];

const MEDS_LOG = [
  { day: 'Th', date: 'Apr 3', taken: true },
  { day: 'Fr', date: 'Apr 4', taken: true },
  { day: 'Sa', date: 'Apr 5', taken: true },
  { day: 'Su', date: 'Apr 6', taken: false },
  { day: 'Mo', date: 'Apr 7', taken: true },
  { day: 'Tu', date: 'Apr 8', taken: false },
  { day: 'We', date: 'Apr 9', taken: true },
];

const PERIOD_LOG = [
  { day: 'Th', date: 'Apr 3', flow: 'none' },
  { day: 'Fr', date: 'Apr 4', flow: 'none' },
  { day: 'Sa', date: 'Apr 5', flow: 'none' },
  { day: 'Su', date: 'Apr 6', flow: 'none' },
  { day: 'Mo', date: 'Apr 7', flow: 'none' },
  { day: 'Tu', date: 'Apr 8', flow: 'light' },
  { day: 'We', date: 'Apr 9', flow: 'light' },
];

const EXERCISE_LOG = [
  { day: 'Th', date: 'Apr 3', minutes: 0 },
  { day: 'Fr', date: 'Apr 4', minutes: 30 },
  { day: 'Sa', date: 'Apr 5', minutes: 45 },
  { day: 'Su', date: 'Apr 6', minutes: 0 },
  { day: 'Mo', date: 'Apr 7', minutes: 20 },
  { day: 'Tu', date: 'Apr 8', minutes: 0 },
  { day: 'We', date: 'Apr 9', minutes: 15 },
];

// ══════════════════════════════════════════════════════════
// Challenges — gentle things for the user to sit with
// ══════════════════════════════════════════════════════════
const CHALLENGES = [
  {
    id: 'contradiction',
    type: 'A contradiction worth noticing',
    title: 'Your feelings about Derek flipped in 8 days',
    accent: '#E31665',
    gradient: 'from-[#FFE2ED] via-[#FFF0F6] to-[#FFFFFF]',
    textColor: '#A40742',
    body: 'On Mar 29 you wrote &ldquo;Derek Thompson asked me out!!!&rdquo; On Apr 6: &ldquo;I have no intention of doing anything with Derek, ever again.&rdquo; Both felt completely true in the moment. Worth sitting with what shifted.',
    // Go-Deeper payload — therapy-framed insight + reflection prompts.
    // Used on the full-screen takeover when the user taps "Go Deeper."
    // The framework name anchors the insight in a recognized approach
    // so the content doesn't feel like generic AI output.
    deeper: {
      framework: 'Emotional re-evaluation',
      frameworkTag: 'from CBT',
      insight: 'Contradictory feelings about the same person aren\u2019t a sign you\u2019re confused \u2014 they\u2019re a sign you were processing something in real time. Psychologists call this emotional re-evaluation, and it\u2019s how we integrate new information. Both the excitement on Mar 29 and the clarity on Apr 6 contain something true. The work isn\u2019t to pick one. It\u2019s to understand what shifted between them.',
      prompts: [
        'What new information arrived between Mar 29 and Apr 6?',
        'What did the Mar 29 excitement need from Derek that the Apr 6 clarity doesn\u2019t?',
        'Are there other relationships where you\u2019ve felt this same kind of shift?',
      ],
    },
  },
  {
    id: 'avoidance',
    type: 'Something you haven\'t written about',
    title: 'Your dad, only in logistics',
    accent: '#E4AD51',
    gradient: 'from-[#FFEDCF] via-[#FFF6E8] to-[#FFFFFF]',
    textColor: '#7A4F00',
    body: 'You\'ve mentioned your dad 17 times in the last month, but only in logistics (he said yes, he said no, he called). You haven\'t written about how you feel about him.',
    deeper: {
      framework: 'Emotional distancing',
      frameworkTag: 'from IFS',
      insight: 'Writing about someone only in logistics is a form of emotional distancing \u2014 the facts stay safe, the feelings stay out of reach. This is often how we protect ourselves when a relationship is complicated or unresolved. Seventeen mentions suggests he\u2019s on your mind. The absence of feeling language suggests you\u2019re not ready (or not yet willing) to name what\u2019s there.',
      prompts: [
        'What\u2019s the first word that comes to mind when you picture your dad right now?',
        'If you could say one thing to him that you haven\u2019t, what would it be?',
        'What would feel different about writing about him with feelings attached?',
      ],
    },
  },
  {
    id: 'selftalk',
    type: 'A word you use on yourself',
    title: '&ldquo;Stupid&rdquo; showed up 6 times',
    accent: '#E4AD51',
    gradient: 'from-[#FFF6E8] via-[#FFFCF3] to-[#FFFFFF]',
    textColor: '#7A4F00',
    body: 'The most common adjective when you describe yourself this month is &ldquo;stupid.&rdquo; It came up 6 times, always right before you did something assertive.',
    deeper: {
      framework: 'Self-talk patterns',
      frameworkTag: 'from CBT',
      insight: 'Calling yourself &ldquo;stupid&rdquo; right before acting assertively is a familiar protective move \u2014 a way of softening your own confidence before someone else can take it down a peg. It\u2019s often learned in environments where directness wasn\u2019t welcome. The word isn\u2019t describing you. It\u2019s buying you permission to do the thing anyway.',
      prompts: [
        'Whose voice do you hear when you say &ldquo;stupid&rdquo; about yourself?',
        'What would the same thought sound like without the minimizing word in front of it?',
        'When was the first time you remember calling yourself stupid?',
      ],
    },
  },
  {
    id: 'loop',
    type: 'A thought you keep returning to',
    title: 'The princess thing',
    accent: '#5ABA9D',
    gradient: 'from-[#D7F2E5] via-[#F0FFF4] to-[#FFFFFF]',
    textColor: '#191C1A',
    body: 'Third time you\'ve written &ldquo;I\'m never going to figure this princess thing out&rdquo; in similar language. You may be circling what acceptance actually looks like.',
    deeper: {
      framework: 'Rumination patterns',
      frameworkTag: 'from ACT',
      insight: 'Returning to the same sentence in similar language is what therapists call a cognitive loop. It\u2019s not stuckness \u2014 it\u2019s the mind trying to process something it hasn\u2019t fully understood yet. The fact that the sentence is identical is telling: you\u2019re circling an edge you haven\u2019t crossed. Acceptance rarely arrives through force. It usually arrives through repeated touch.',
      prompts: [
        'What would it mean to &ldquo;figure out&rdquo; the princess thing?',
        'If you already knew this was something you couldn\u2019t figure out, what would change?',
        'What\u2019s the smallest version of acceptance that would still be true?',
      ],
    },
  },
];

/* ══════════════════════════════════════════════════════════
   Shared bits
   ══════════════════════════════════════════════════════════ */

function Header({ timeframe, onTimeframeChange, dropdownOpen, setDropdownOpen, adaptive = false, adaptiveSubtitle }) {
  const active = TIMEFRAMES.find((t) => t.id === timeframe) || TIMEFRAMES[0];
  return (
    <div className="relative flex items-start justify-between gap-[12px] px-[16px] pt-[12px] pb-[4px]">
      <div className="min-w-0">
        <h1 className="text-[22px] leading-[28px] font-[700] text-[#191C1A] tracking-[-0.01em]">
          Patterns
        </h1>
        {adaptive ? (
          /* Adaptive mode — no dropdown. The system has already chosen
             the period based on how long the user has been journaling.
             Show the choice as a statement, not a control. The subtitle
             now carries a "since [date]" reference itself, so the
             separate range suffix (e.g. "· Jan 1 – Apr 9") is dropped
             in adaptive mode to avoid two date references on one line. */
          <div className="flex items-center gap-[6px] mt-[3px]">
            <span className="text-[11px] leading-[14px] font-[500] italic text-[#6D6C6A]">
              {adaptiveSubtitle || active.label}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-[6px] mt-[3px]">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-[4px] text-[11px] leading-[14px] font-[600] text-[#191C1A] hover:text-[#E31665] transition-colors"
            >
              {active.label}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-[11px] h-[11px] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <span className="text-[11px] leading-[14px] font-[450] text-[#8B828B]">
              &middot; {active.range}
            </span>
          </div>
        )}
      </div>
      <button
        className="shrink-0 w-[36px] h-[36px] rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] flex items-center justify-center transition-colors"
        title="Edit pattern preferences"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>

      {/* Timeframe dropdown menu */}
      {dropdownOpen && (
        <div className="absolute left-[16px] top-[58px] z-20 min-w-[200px] bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#F0F0F0] overflow-hidden">
          {TIMEFRAMES.map((tf) => {
            const isActive = tf.id === timeframe;
            return (
              <button
                key={tf.id}
                onClick={() => {
                  onTimeframeChange(tf.id);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-[14px] py-[10px] flex items-center justify-between gap-[12px] transition-colors ${
                  isActive ? 'bg-[#FFF0F6]' : 'hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-[13px] leading-[17px] ${isActive ? 'font-[700] text-[#191C1A]' : 'font-[500] text-[#191C1A]'}`}>
                    {tf.label}
                  </span>
                  <span className="text-[10px] leading-[13px] font-[450] text-[#8B828B]">{tf.range}</span>
                </div>
                {isActive && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E31665" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] shrink-0">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TabBar({ activeTab, onChange }) {
  const tabs = [
    { id: 'themes', label: 'Themes' },
    { id: 'trackers', label: 'Tracked' },
    { id: 'challenge', label: 'Challenge' },
  ];
  return (
    <div className="flex bg-[#F0F0F0] rounded-[10px] p-[3px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-[7px] rounded-[8px] text-[11px] leading-[15px] font-[500] transition-all ${
              isActive
                ? 'bg-white text-[#191C1A] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#8B828B]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PEOPLE IN YOUR STORY — donut + tone legend (scalable)
   The inline summary only shows the donut and a three-row
   tone legend, which stays exactly the same height whether
   there are 6 people or 60. Tap the whole card to open a
   full-screen takeover with the complete people list.
   ══════════════════════════════════════════════════════════ */
function PeopleInStory({ onOpen, people = PEOPLE_IN_STORY }) {
  const toneOrder = ['draining', 'mixed', 'nourishing'];

  // Aggregate mentions per tone for the donut slices. Uses the `people`
  // prop so the same component renders both the week view (default
  // PEOPLE_IN_STORY) and the quarter view (PEOPLE_IN_STORY_QUARTER).
  const totalsByTone = toneOrder.reduce((acc, key) => {
    acc[key] = people.filter((p) => p.tone === key).reduce(
      (sum, p) => sum + p.mentions,
      0
    );
    return acc;
  }, {});
  const totalMentions = Object.values(totalsByTone).reduce((a, b) => a + b, 0);
  const totalPeople = people.length;

  // Donut geometry — progress-ring style. pathLength=100 normalizes
  // the circle to 100 units so we can think in percentages. Slim
  // rounded strokes (previously 8, now 5) so the chart reads as a
  // refined diagram rather than a chunky progress ring. Thinner
  // caps also mean we need a smaller visible gap between segments.
  const R = 38;
  const PATH_LEN = 100;
  const GAP = 3;
  let cumulative = 0;
  const segments = toneOrder.map((key) => {
    const value = totalsByTone[key] || 0;
    const pct = (value / totalMentions) * PATH_LEN;
    const seg = {
      key,
      color: PEOPLE_TONE[key].color,
      length: Math.max(pct - GAP, 0.001),
      offset: cumulative,
    };
    cumulative += pct;
    return seg;
  });

  return (
    <div className="flex flex-col gap-[10px]">
      <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
        People in your story
      </span>
      <button
        onClick={onOpen}
        className="bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors rounded-[16px] p-[16px] flex items-center gap-[14px] text-left w-full"
      >
        {/* Donut — progress-ring style, rounded caps, visible gaps */}
        <div className="shrink-0 relative w-[124px] h-[124px]">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background track — slightly lighter than before so it
                recedes behind the tone segments instead of competing */}
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="#F0F0F0"
              strokeWidth="5"
            />
            {segments.map((s) => (
              <circle
                key={s.key}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="5"
                strokeLinecap="round"
                pathLength={PATH_LEN}
                strokeDasharray={`${s.length} ${PATH_LEN - s.length}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] leading-[28px] font-[700] text-[#191C1A] tracking-[-0.02em]">
              {totalPeople}
            </span>
            <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] mt-[2px]">
              people
            </span>
          </div>
        </div>

        {/* Tone legend — neutral title-case text, only the dot is colored */}
        <div className="flex-1 min-w-0 flex flex-col gap-[10px]">
          {toneOrder.map((toneKey) => {
            const tone = PEOPLE_TONE[toneKey];
            const count = totalsByTone[toneKey] || 0;
            const pct = Math.round((count / totalMentions) * 100);
            return (
              <div key={toneKey} className="flex items-center gap-[8px]">
                <span
                  className="shrink-0 w-[8px] h-[8px] rounded-full"
                  style={{ backgroundColor: tone.color }}
                />
                <span className="text-[14px] leading-[18px] font-[700] text-[#191C1A] tracking-[-0.01em]">
                  {tone.label}
                </span>
                <span className="text-[12px] leading-[16px] font-[500] text-[#8B828B] ml-auto">
                  {pct}%
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-[4px] pt-[2px]">
            <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B]">
              See full list
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="#8B828B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   The Story of You — compact card
   A short teaser card that sits at the bottom of the Themes
   tab. Tapping opens the full-screen audiobook-style prose
   takeover (rendered in the main component).
   ══════════════════════════════════════════════════════════ */
export function StoryOfYouCard({ study, onOpen }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
        The Story of You
      </span>
      <button
        onClick={onOpen}
        className="w-full text-left rounded-[16px] p-[16px] bg-gradient-to-br from-[#FFF6E8] via-[#FFFBF2] to-[#FFFFFF] flex items-center gap-[14px] hover:scale-[1.005] transition-transform cursor-pointer border border-[#F0E8D8]"
      >
        {/* Audiobook-style cover — stylized book with user's name as the title */}
        <div className="shrink-0 w-[72px] h-[98px] rounded-[5px] bg-gradient-to-br from-[#E0A039] via-[#C58423] to-[#8D5C0A] shadow-[0_6px_14px_rgba(141,92,10,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] relative overflow-hidden flex flex-col items-center justify-between py-[10px] px-[8px]">
          {/* Book spine — vertical rule on the left */}
          <div className="absolute left-[3px] top-[6px] bottom-[6px] w-[1.5px] bg-white/20" />

          {/* Top: tiny series mark */}
          <span className="text-[6px] leading-[7px] font-[700] tracking-[0.14em] uppercase text-white/70">
            Rosebud
          </span>

          {/* Middle: the name as the book title */}
          <div className="flex flex-col items-center gap-[4px] text-center">
            <span className="text-[16px] leading-[18px] font-[700] tracking-[0.02em] text-white">
              {study.name}
            </span>
            {/* Small flourish */}
            <span className="block w-[18px] h-[1px] bg-white/40" />
          </div>

          {/* Bottom: period as the subtitle. Rendered as an empty
              spacer when no period is provided so the title stays
              vertically centered (justify-between balance). */}
          {study.period ? (
            <span className="text-[7px] leading-[9px] font-[500] italic text-white/80 text-center">
              {study.period}
            </span>
          ) : (
            <span className="text-[7px] leading-[9px] text-transparent select-none">&nbsp;</span>
          )}
        </div>

        {/* Right — metadata + hook + CTA */}
        <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
          <span className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase text-[#AF730D]">
            {study.readTime}
          </span>
          <h3 className="text-[14px] leading-[19px] font-[700] text-[#191C1A] tracking-[-0.005em] line-clamp-2 overflow-hidden">
            {study.hook}
          </h3>
          <span className="inline-flex items-center gap-[5px] text-[11px] leading-[14px] font-[600] text-[#AF730D] mt-[2px]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[11px] h-[11px]">
              <path d="M8 5v14l11-7z" />
            </svg>
            Read or listen
          </span>
        </div>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Story icon — minimalist Lucide-style decoration for the
   story cards. Rendered huge and tilted so the edges crop
   off the card. currentColor so it inherits textColor.
   ══════════════════════════════════════════════════════════ */
function StoryIcon({ name, className }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.4',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': 'true',
  };
  switch (name) {
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...common}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case 'mask':
      // Lucide venetian-mask — reads as a theater / masquerade mask
      return (
        <svg {...common}>
          <path d="M18 11c-1.5 0-2.5.5-3 2" />
          <path d="M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z" />
          <path d="M6 11c1.5 0 2.5.5 3 2" />
        </svg>
      );
    case 'quote':
      return (
        <svg {...common}>
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    case 'hourglass':
      // Lucide hourglass — time slipping, what's being lost
      return (
        <svg {...common}>
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      );
    default:
      return null;
  }
}

/* ══════════════════════════════════════════════════════════
   THEMES TAB — top theme hero + gradient story cards +
   archetypes + other themes list + word shifts
   ══════════════════════════════════════════════════════════ */
function ThemesTab({ onOpenStory, onOpenStyle, onOpenEcho, onOpenStoryOfYou, onOpenPeople }) {
  return (
    <div className="flex flex-col gap-[24px]">
      {/* Horizontal scroll — bold gradient story cards */}
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
            Themes
          </span>
          <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">Swipe &rarr;</span>
        </div>
        <div className="-mx-[16px] px-[16px] overflow-x-auto">
          <div className="flex gap-[10px] w-max pb-[4px]">
            {STORIES.map((s) => (
              <button
                key={s.id}
                onClick={() => onOpenStory(s.id)}
                style={{ backgroundImage: s.bgImage }}
                className="relative overflow-hidden shrink-0 w-[200px] h-[220px] rounded-[18px] p-[16px] flex flex-col justify-end text-left hover:scale-[1.01] transition-transform cursor-pointer"
              >
                {/* Decorative minimalist icon — huge, tilted, edges cropping.
                    Tinted in a darker variant of the card's own family color. */}
                {s.icon && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-[44px] -left-[44px] w-[180px] h-[180px] opacity-15 -rotate-[14deg]"
                    style={{ color: s.iconColor || s.textColor }}
                  >
                    <StoryIcon name={s.icon} className="w-full h-full" />
                  </div>
                )}
                <span
                  className="relative text-[10px] leading-[13px] font-[600] tracking-[0.06em] uppercase block mb-[8px] opacity-70"
                  style={{ color: s.textColor }}
                >
                  {s.eyebrow}
                </span>
                <span
                  className="relative text-[19px] leading-[24px] font-[700] tracking-[-0.01em] block"
                  style={{ color: s.textColor }}
                  dangerouslySetInnerHTML={{ __html: s.title }}
                />
                {s.subtext && (
                  <span
                    className="relative text-[11px] leading-[14px] font-[500] block mt-[6px] opacity-70"
                    style={{ color: s.textColor }}
                  >
                    {s.subtext}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emotional arc — wavy mood curve with stickers + comparison to last week */}
      <div className="flex flex-col gap-[10px]">
        {(() => {
          const thisAvg =
            MOOD_ARC.reduce((s, d) => s + d.score, 0) / MOOD_ARC.length;
          const prevAvg =
            PREVIOUS_MOOD_ARC.reduce((s, d) => s + d.score, 0) / PREVIOUS_MOOD_ARC.length;
          const delta = +(thisAvg - prevAvg).toFixed(1);
          const up = delta >= 0;
          return (
            <div className="flex items-center justify-between">
              <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                Emotional arc
              </span>
              <span
                className={`inline-flex items-center gap-[4px] pl-[7px] pr-[9px] py-[3px] rounded-full text-[10px] leading-[13px] font-[700] ${
                  up ? 'bg-[#F0FFF4] text-[#235E4D]' : 'bg-[#FFE2ED] text-[#A40742]'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[11px] h-[11px]"
                >
                  {up ? (
                    <>
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </>
                  ) : (
                    <>
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </>
                  )}
                </svg>
                {up ? '+' : ''}
                {delta} vs last week
              </span>
            </div>
          );
        })()}
        <EmotionalLandscapeChart />
      </div>

      {/* People in your story — donut + tone legend, tap for full list.
          Moved above Behavioral Highlights so the relational context
          lands before the observation cards (who → then what patterns). */}
      <PeopleInStory onOpen={onOpenPeople} />

      {/* Behavioral Highlights — 2x2 grid of observation-based cards */}
      <div className="flex flex-col gap-[10px]">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          Behavioral Highlights
        </span>
        <div className="grid grid-cols-2 gap-[10px]">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => onOpenStyle(s.id)}
              className="text-left rounded-[16px] bg-[#FAFAFA] p-[14px] flex flex-col gap-[8px] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              {/* Icon shape */}
              <div className="flex items-center justify-between">
                <svg viewBox="0 0 44 44" className="w-[32px] h-[32px]">
                  {s.shape === 'triangle' && (
                    <path d="M22 9 L36 34 L8 34 Z" fill="none" stroke={s.color} strokeWidth="2.2" strokeLinejoin="round" />
                  )}
                  {s.shape === 'diamond' && (
                    <path d="M22 8 L36 22 L22 36 L8 22 Z" fill="none" stroke={s.color} strokeWidth="2.2" strokeLinejoin="round" />
                  )}
                  {s.shape === 'circle' && (
                    <circle cx="22" cy="22" r="14" fill="none" stroke={s.color} strokeWidth="2.2" />
                  )}
                  {s.shape === 'star' && (
                    <path
                      d="M22 8 L25 18 L35 18 L27 24 L30 34 L22 28 L14 34 L17 24 L9 18 L19 18 Z"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                  )}
                  <circle cx="22" cy="22" r="2.5" fill={s.color} />
                </svg>
              </div>
              {/* Card body — no eyebrow at this level. The category label
                  was wrapping to 2 lines in the 2x2 grid and crowding the
                  name + tagline. It still lives on the style object and
                  shows up on the full-screen detail view, where the extra
                  width gives it room to breathe. */}
              <div className="flex flex-col gap-[3px]">
                <span className="text-[14px] leading-[18px] font-[700] text-[#191C1A] tracking-[-0.01em]">
                  {s.name}
                </span>
                <span className="text-[11px] leading-[15px] font-[450] text-[#6D6C6A]">
                  {s.tagline}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Echoes — minimal list. Just the thread title and date span per
          row, separated by hairline dividers. Tap any row to open the
          full-screen takeover with the quotes and interpretive prose. */}
      <div className="flex flex-col gap-[6px]">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          Echoes from earlier
        </span>
        <div className="flex flex-col">
          {ECHOES.map((e, i) => (
            <button
              key={e.id}
              onClick={() => onOpenEcho(e.id)}
              className={`text-left py-[14px] flex items-center justify-between gap-[12px] hover:opacity-70 transition-opacity ${
                i > 0 ? 'border-t border-[#F0F0F0]' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <h3
                  className="text-[15px] leading-[20px] font-[700] text-[#191C1A] tracking-[-0.005em]"
                  dangerouslySetInnerHTML={{ __html: e.title }}
                />
                <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] block mt-[3px]">
                  {e.pastDate} &rarr; {e.thisDate} &middot; {e.subtext}
                </span>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B828B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[14px] h-[14px] shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   THEMES TAB — QUARTER VIEW
   Longitudinal version of the Themes tab. Rendered when the
   timeframe dropdown is set to "Last 3 months". Shares the
   anthology voice (gradient story cards, editorial eyebrows,
   Behavioral Highlights 2x2) but adds sections that only make
   sense over months: chapter markers, people arriving/fading,
   concept-level language shifts.
   ══════════════════════════════════════════════════════════ */
function ThemesTabQuarter({ onOpenStory, onOpenStyle, onOpenStoryOfYou, onOpenPeople, onOpenEcho }) {
  // Emotional arc scope — user can toggle between viewing the full
  // journaling history ("all"), the last month, or the last week.
  // Replaces the old "vs prior quarter" delta pill, which didn't fit
  // the cumulative-words framing of the adaptive subtitle.
  const [arcScope, setArcScope] = useState('all');
  const arcData =
    arcScope === 'week'
      ? MOOD_ARC
      : arcScope === 'month'
      ? QUARTER_MOOD_ARC.slice(-4)
      : QUARTER_MOOD_ARC;
  const arcLabelEvery = arcScope === 'all' ? 3 : 1;
  return (
    <div className="flex flex-col gap-[24px]">
      {/* Hero stat strip — quiet glance for the quarter */}
      <div className="grid grid-cols-3 gap-[12px] pt-[2px] pb-[10px] border-b border-[#F0F0F0]">
        {[
          { value: '112', label: 'Entries' },
          { value: '87k', label: 'Words' },
          { value: '13', label: 'Weeks' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[24px] leading-[28px] font-[700] text-[#191C1A] tracking-[-0.02em]">
              {s.value}
            </span>
            <span className="text-[9px] leading-[12px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] mt-[2px]">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Story cards — reframed as 3-month arcs, same swipeable pattern */}
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
            Themes
          </span>
          <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">Swipe &rarr;</span>
        </div>
        <div className="-mx-[16px] px-[16px] overflow-x-auto">
          <div className="flex gap-[10px] w-max pb-[4px]">
            {QUARTER_STORIES.map((s) => (
              <button
                key={s.id}
                onClick={() => onOpenStory(s.id)}
                style={{ backgroundImage: s.bgImage }}
                className="relative overflow-hidden shrink-0 w-[220px] h-[240px] rounded-[18px] p-[16px] flex flex-col justify-end text-left hover:scale-[1.01] transition-transform cursor-pointer"
              >
                {/* Decorative minimalist icon — huge, tilted, edges
                    cropping, tinted in a darker variant of the card's
                    own family color. Matches the week themes treatment
                    so both card collections share a visual language. */}
                {s.icon && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-[44px] -left-[44px] w-[180px] h-[180px] opacity-15 -rotate-[14deg]"
                    style={{ color: s.iconColor || s.textColor }}
                  >
                    <StoryIcon name={s.icon} className="w-full h-full" />
                  </div>
                )}
                <span
                  className="relative text-[10px] leading-[13px] font-[600] tracking-[0.06em] uppercase block mb-[8px] opacity-70"
                  style={{ color: s.textColor }}
                >
                  {s.eyebrow}
                </span>
                <span
                  className="relative text-[19px] leading-[24px] font-[700] tracking-[-0.01em] block"
                  style={{ color: s.textColor }}
                  dangerouslySetInnerHTML={{ __html: s.title }}
                />
                {s.subtext && (
                  <span
                    className="relative text-[11px] leading-[14px] font-[500] block mt-[6px] opacity-70"
                    style={{ color: s.textColor }}
                  >
                    {s.subtext}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter markers — refined timeline. Reverse-chronological
          order (most recent first) so the "you are here" chapter sits
          at the top where the eye lands first, with prior chapters
          cascading below in order. Capped at 4 visible rows with a
          "See all" link underneath — future-proofs the layout once
          there are more chapters than fit comfortably. Past chapters
          get hollow outline dots ("you passed through"), the current
          chapter gets a filled rose dot ("you are here"). */}
      <div className="relative pl-[22px]">
        {/* Vertical rail — 1px, very light gray, recedes behind the
            dots so the eye focuses on the content, not the structure */}
        <div className="absolute left-[3.5px] top-[6px] bottom-[6px] w-[1px] bg-[#EDEDED]" />
        <div className="flex flex-col gap-[22px]">
          {[...QUARTER_CHAPTERS].reverse().slice(0, 4).map((c) => (
            <div key={c.id} className="relative">
              {/* Small timeline node sitting on the rail — absolute
                  positioned so it overlays the rail at the content
                  baseline (not pushed inline by flex gap) */}
              <div
                className={`absolute left-[-22px] top-[5px] w-[8px] h-[8px] rounded-full ${
                  c.current
                    ? 'bg-[#E31665]'
                    : 'bg-white border border-[#C0C0BF]'
                }`}
              />
              <div className="flex items-baseline justify-between gap-[8px] mb-[3px]">
                <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                  {c.label}
                </span>
                <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B] shrink-0">
                  {c.stat.value} {c.stat.label}
                </span>
              </div>
              <h3
                className="text-[15px] leading-[20px] font-[700] text-[#191C1A] tracking-[-0.005em] mb-[4px]"
                dangerouslySetInnerHTML={{ __html: c.title }}
              />
              <p
                className="text-[12px] leading-[18px] font-[450] text-[#6D6C6A]"
                dangerouslySetInnerHTML={{ __html: c.headline }}
              />
            </div>
          ))}
        </div>
        {/* See all link — sits under the rail and visually extends it
            so the timeline doesn't feel truncated. Shows when there are
            more than 4 chapters (future-proof: currently there are 4,
            so this renders based on the underlying data length). */}
        {QUARTER_CHAPTERS.length > 4 && (
          <button
            type="button"
            className="mt-[16px] text-[12px] leading-[16px] font-[600] text-[#191C1A] hover:opacity-70 transition-opacity flex items-center gap-[4px] cursor-pointer"
          >
            See all chapters
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>

      {/* Emotional arc — segmented control lets the user re-scope
          the chart across their whole journaling history. No more
          "vs prior quarter" delta — comparison to a prior period
          doesn't land in a cumulative-words framing. */}
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
            Emotional arc
          </span>
          <div className="inline-flex rounded-[8px] border border-[#EDEDED] bg-[#FAFAFA] p-[2px]">
            {[
              { id: 'all', label: 'All time' },
              { id: 'month', label: 'Month' },
              { id: 'week', label: 'Week' },
            ].map((t) => {
              const isActive = arcScope === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setArcScope(t.id)}
                  className={`px-[10px] py-[3px] rounded-[6px] text-[10px] leading-[13px] font-[600] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#191C1A] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'bg-transparent text-[#8B828B] hover:text-[#191C1A]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Empty previousData — no dashed prior-period line since the
            comparison concept is replaced by the time-scope toggle. */}
        <EmotionalLandscapeChart
          key={arcScope}
          data={arcData}
          previousData={[]}
          labelEvery={arcLabelEvery}
        />
      </div>

      {/* Behavioral Highlights — different archetypes over 3 months */}
      <div className="flex flex-col gap-[10px]">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          Who you&rsquo;ve been writing as
        </span>
        <div className="grid grid-cols-2 gap-[10px]">
          {QUARTER_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => onOpenStyle(s.id)}
              className="text-left rounded-[16px] bg-[#FAFAFA] p-[14px] flex flex-col gap-[8px] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}22` }}
                >
                  <span
                    className="w-[10px] h-[10px] rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#C0C0BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              <div className="flex flex-col gap-[3px]">
                <span
                  className="text-[9px] leading-[12px] font-[700] tracking-[0.08em] uppercase"
                  style={{ color: s.color }}
                >
                  {s.category}
                </span>
                <span className="text-[14px] leading-[18px] font-[700] text-[#191C1A] tracking-[-0.01em]">
                  {s.name}
                </span>
                <span className="text-[11px] leading-[15px] font-[450] text-[#6D6C6A]">
                  {s.tagline}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* People in your story — same donut + drill-down component as the
          week view, just fed the quarter-scoped dataset. Tapping opens
          the full-sheet takeover with per-person history charts, tone
          shifts, and key moments — identical pattern across week and
          quarter so the navigation stays consistent. */}
      <PeopleInStory people={PEOPLE_IN_STORY_QUARTER} onOpen={onOpenPeople} />

      {/* Language has shifted — concept-level deltas with entry examples */}
      <div className="flex flex-col gap-[10px]">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          How your language has shifted
        </span>
        <div className="flex flex-col gap-[10px]">
          {QUARTER_LANGUAGE_SHIFTS.map((s) => (
            <div key={s.id} className="bg-[#FAFAFA] rounded-[16px] p-[16px] flex flex-col gap-[10px]">
              <span className="text-[11px] leading-[14px] font-[700] tracking-[0.05em] uppercase text-[#191C1A]">
                {s.concept}
              </span>

              {/* Before quote */}
              <div>
                <span className="text-[9px] leading-[12px] font-[700] tracking-[0.08em] uppercase text-[#8B828B] block mb-[4px]">
                  {s.beforeDate}
                </span>
                <p
                  className="text-[13px] leading-[20px] font-[450] italic text-[#8B828B]"
                  dangerouslySetInnerHTML={{ __html: s.before }}
                />
              </div>

              {/* Arrow divider */}
              <div className="flex items-center gap-[8px]">
                <div className="flex-1 h-px bg-[#EDEDED]" />
                <svg viewBox="0 0 24 24" fill="none" stroke="#C0C0BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
                <div className="flex-1 h-px bg-[#EDEDED]" />
              </div>

              {/* After quote */}
              <div>
                <span className="text-[9px] leading-[12px] font-[700] tracking-[0.08em] uppercase text-[#191C1A] block mb-[4px]">
                  {s.afterDate}
                </span>
                <p
                  className="text-[13px] leading-[20px] font-[450] italic text-[#191C1A]"
                  dangerouslySetInnerHTML={{ __html: s.after }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Echoes from earlier — same component used on the week view.
          Shows moments in recent entries that rhyme with things the
          user wrote much earlier. Especially powerful in the quarter /
          year view since there's more history to pull from. */}
      <div className="flex flex-col gap-[6px]">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          Echoes from earlier
        </span>
        <div className="flex flex-col">
          {ECHOES.map((e, i) => (
            <button
              key={e.id}
              onClick={() => onOpenEcho(e.id)}
              className={`text-left py-[14px] flex items-center justify-between gap-[12px] hover:opacity-70 transition-opacity ${
                i > 0 ? 'border-t border-[#F0F0F0]' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <h3
                  className="text-[15px] leading-[20px] font-[700] text-[#191C1A] tracking-[-0.005em]"
                  dangerouslySetInnerHTML={{ __html: e.title }}
                />
                <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] block mt-[3px]">
                  {e.pastDate} &rarr; {e.thisDate} &middot; {e.subtext}
                </span>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B828B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[14px] h-[14px] shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SIGNALS TAB — tracked data (sleep, meds, period, exercise)
   Each tracker gets its own visual format. High-level pattern
   hero at the top matches the anthology style.
   ══════════════════════════════════════════════════════════ */

// Small 3-dot menu button used for per-tracker edit affordance
function TrackerMenu() {
  return (
    <button
      className="w-[24px] h-[24px] rounded-full hover:bg-[#F0F0F0] flex items-center justify-center transition-colors"
      title="Edit or remove"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="#8B828B" strokeWidth="2" strokeLinecap="round" className="w-[14px] h-[14px]">
        <circle cx="12" cy="12" r="1" fill="#8B828B" />
        <circle cx="19" cy="12" r="1" fill="#8B828B" />
        <circle cx="5" cy="12" r="1" fill="#8B828B" />
      </svg>
    </button>
  );
}

// Shared tracker section shell — eyebrow icon, title, summary stat, menu, body
function TrackerSection({ icon, color, title, summary, children }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-center gap-[10px]">
        <div
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center text-[15px]"
          style={{ backgroundColor: `${color}1A` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-[6px]">
            <span className="text-[14px] leading-[18px] font-[700] text-[#191C1A]">{title}</span>
          </div>
          <span className="text-[11px] leading-[14px] font-[450] text-[#8B828B]">{summary}</span>
        </div>
        <TrackerMenu />
      </div>
      {children}
    </div>
  );
}

// Emotional landscape — smooth mood arc with design-system sticker emotes
// at inflection points (same stickers as V1 Patterns hero chart)
const EMOTION_COLORS = {
  angry: '#E31665',
  frustrated: '#F47FA8',
  disappointed: '#E4AD51',
  anticipating: '#7CC4AF',
  calm: '#5ABA9D',
  joyful: '#5ABA9D',
};

// Pick a sticker based on mood score: low scores get mood-unimpressed,
// high scores get joy (matching the V1 hero chart's global min/max pattern)
const moodSticker = (score) => {
  if (score >= 7) return joySvg;
  if (score <= 3) return moodUnimpressedSvg;
  return null;
};

function EmotionalLandscapeChart({
  data = MOOD_ARC,
  previousData = PREVIOUS_MOOD_ARC,
  thisLabel = 'This week',
  previousLabel = 'Last week',
  labelEvery = 1,
} = {}) {
  const w = 308;
  const h = 160;
  const padX = 14;
  const padTop = 42;
  const padBot = 34;
  const plotH = h - padTop - padBot;
  const maxScore = 10;
  const stepX = (w - padX * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + plotH - (d.score / maxScore) * plotH,
    ...d,
  }));
  const previousPoints = previousData.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + plotH - (d.score / maxScore) * plotH,
    ...d,
  }));

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${padTop + plotH} L ${points[0].x},${padTop + plotH} Z`;
  const previousLine = smoothPath(previousPoints);

  return (
    <div className="bg-[#FAFAFA] rounded-[16px] px-[8px] pt-[12px] pb-[6px]">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id="landscapeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E31665" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E31665" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Previous period — muted dashed line, drawn first so it sits behind */}
        <path
          d={previousLine}
          fill="none"
          stroke="#C0C0BF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
        />
        {/* This period — rose line + gradient area */}
        <path d={areaPath} fill="url(#landscapeGrad)" />
        <path d={linePath} fill="none" stroke="#E31665" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => {
          const sticker = p.key ? moodSticker(p.score) : null;
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.key ? 5 : 3}
                fill={EMOTION_COLORS[p.mood] || '#E31665'}
                stroke="#FAFAFA"
                strokeWidth="2.5"
              />
              {sticker && (
                <image
                  href={sticker}
                  x={p.x - 12}
                  y={p.y - 12}
                  width="24"
                  height="24"
                />
              )}
            </g>
          );
        })}
        {points.map((p, i) => {
          // Skip labels based on labelEvery so 12-week views stay legible
          if (i % labelEvery !== 0 && i !== points.length - 1) return null;
          return (
            <text key={`lbl-${i}`} x={p.x} y={h - 16} textAnchor="middle" fontSize="9" fontWeight="500" fill="#8B828B">
              {p.day}
            </text>
          );
        })}
      </svg>
      {/* Legend — only rendered when there's a previous period to
          compare against. The quarter view now passes previousData={[]}
          for all three scopes (all / month / week), so the legend
          hides and the chart stands alone. The week view still passes
          PREVIOUS_MOOD_ARC so the "this week / last week" legend
          continues to render there. */}
      {previousData && previousData.length > 0 && (
        <div className="flex items-center justify-center gap-[18px] pt-[4px]">
          <div className="flex items-center gap-[6px]">
            <span className="w-[14px] h-[2.5px] rounded-full bg-[#E31665]" />
            <span className="text-[11px] leading-[14px] font-[600] text-[#191C1A]">{thisLabel}</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span
              className="w-[14px] h-0 border-t-[2.5px] border-dashed"
              style={{ borderColor: '#C0C0BF' }}
            />
            <span className="text-[11px] leading-[14px] font-[600] text-[#8B828B]">{previousLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Smooth Catmull-Rom-to-Bezier path generator — makes the line curvy without harsh edges
function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function SleepViz() {
  const w = 296;
  const h = 96;
  const padX = 16;
  const padTop = 22;
  const padBot = 20;
  const plotH = h - padTop - padBot;
  const maxHours = 10;
  const stepX = (w - padX * 2) / (SLEEP_LOG.length - 1);

  const points = SLEEP_LOG.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + plotH - (d.hours / maxHours) * plotH,
    ...d,
  }));

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${padTop + plotH} L ${points[0].x},${padTop + plotH} Z`;

  return (
    <div className="bg-[#FAFAFA] rounded-[16px] p-[14px]">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B8BC4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6B8BC4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sleepGrad)" />
        <path d={linePath} fill="none" stroke="#6B8BC4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.low ? 4.5 : 3} fill={p.low ? '#E31665' : '#6B8BC4'} stroke="#FAFAFA" strokeWidth="2" />
            {p.low && (
              <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill="#E31665">
                {p.hours}h
              </text>
            )}
          </g>
        ))}
        {points.map((p, i) => (
          <text key={`lbl-${i}`} x={p.x} y={h - 4} textAnchor="middle" fontSize="9" fontWeight="500" fill="#8B828B">
            {p.day}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MedsViz() {
  return (
    <div className="bg-[#FAFAFA] rounded-[16px] p-[14px]">
      <div className="grid grid-cols-7 gap-[6px]">
        {MEDS_LOG.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-[6px]">
            <div
              className={`w-full aspect-square rounded-[10px] flex items-center justify-center ${
                d.taken ? 'bg-[#5ABA9D] text-white' : 'bg-white border border-dashed border-[#E4AD51] text-[#E4AD51]'
              }`}
            >
              {d.taken ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-[12px] h-[12px]">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>
            <span className="text-[9px] leading-[12px] font-[500] text-[#8B828B]">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeriodViz() {
  const flowColor = (flow) => {
    if (flow === 'heavy') return '#E31665';
    if (flow === 'medium') return '#F47FA8';
    if (flow === 'light') return '#FCC7D9';
    return '#F0F0F0';
  };
  return (
    <div className="bg-[#FAFAFA] rounded-[16px] p-[14px]">
      <div className="flex items-center justify-between gap-[4px]">
        {PERIOD_LOG.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-[6px] flex-1">
            <div
              className="w-full h-[36px] rounded-[10px] border border-[#00000008]"
              style={{ backgroundColor: flowColor(d.flow) }}
            />
            <span className="text-[9px] leading-[12px] font-[500] text-[#8B828B]">{d.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-[12px] mt-[10px] pt-[10px] border-t border-[#F0F0F0]">
        {[
          { label: 'None', color: '#F0F0F0' },
          { label: 'Light', color: '#FCC7D9' },
          { label: 'Medium', color: '#F47FA8' },
          { label: 'Heavy', color: '#E31665' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-[4px]">
            <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[9px] leading-[12px] font-[500] text-[#8B828B]">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExerciseViz() {
  const w = 296;
  const h = 96;
  const padX = 16;
  const padTop = 22;
  const padBot = 20;
  const plotH = h - padTop - padBot;
  const maxMin = 60;
  const stepX = (w - padX * 2) / (EXERCISE_LOG.length - 1);

  const points = EXERCISE_LOG.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + plotH - (d.minutes / maxMin) * plotH,
    ...d,
  }));

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${padTop + plotH} L ${points[0].x},${padTop + plotH} Z`;

  return (
    <div className="bg-[#FAFAFA] rounded-[16px] p-[14px]">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id="exerciseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ABA9D" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#5ABA9D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#exerciseGrad)" />
        <path d={linePath} fill="none" stroke="#5ABA9D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.minutes > 0 ? 3 : 2.5}
              fill={p.minutes > 0 ? '#5ABA9D' : '#C0C0BF'}
              stroke="#FAFAFA"
              strokeWidth="2"
            />
            {p.minutes > 0 && (
              <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill="#235E4D">
                {p.minutes}
              </text>
            )}
          </g>
        ))}
        {points.map((p, i) => (
          <text key={`lbl-${i}`} x={p.x} y={h - 4} textAnchor="middle" fontSize="9" fontWeight="500" fill="#8B828B">
            {p.day}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Dual-line correlation chart for the detail overlay
function CorrelationChart({ chart }) {
  const w = 320;
  const h = 180;
  const padX = 16;
  const padTop = 20;
  const padBot = 26;
  const plotH = h - padTop - padBot;
  const stepX = (w - padX * 2) / (chart.days.length - 1);

  const toPoints = (series) =>
    series.values.map((v, i) => ({
      x: padX + i * stepX,
      y: padTop + plotH - (v / series.max) * plotH,
      value: v,
    }));

  const primaryPoints = toPoints(chart.primary);
  const secondaryPoints = toPoints(chart.secondary);
  const primaryLine = smoothPath(primaryPoints);
  const primaryArea = `${primaryLine} L ${primaryPoints[primaryPoints.length - 1].x},${padTop + plotH} L ${primaryPoints[0].x},${padTop + plotH} Z`;
  const secondaryLine = smoothPath(secondaryPoints);

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Legend */}
      <div className="flex items-center justify-center gap-[16px]">
        <div className="flex items-center gap-[6px]">
          <span className="w-[14px] h-[2.5px] rounded-full" style={{ backgroundColor: chart.primary.color }} />
          <span className="text-[11px] leading-[14px] font-[600] text-[#191C1A]">{chart.primary.label}</span>
        </div>
        <div className="flex items-center gap-[6px]">
          <span
            className="w-[14px] h-0 border-t-[2.5px] border-dashed"
            style={{ borderColor: chart.secondary.color }}
          />
          <span className="text-[11px] leading-[14px] font-[600] text-[#191C1A]">{chart.secondary.label}</span>
        </div>
      </div>
      {/* Chart */}
      <div className="bg-white/60 backdrop-blur-sm rounded-[16px] px-[8px] py-[12px]">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
          <defs>
            <linearGradient id="corrPrimaryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chart.primary.color} stopOpacity="0.24" />
              <stop offset="100%" stopColor={chart.primary.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Primary line + area */}
          <path d={primaryArea} fill="url(#corrPrimaryGrad)" />
          <path
            d={primaryLine}
            fill="none"
            stroke={chart.primary.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Secondary line — dashed */}
          <path
            d={secondaryLine}
            fill="none"
            stroke={chart.secondary.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 4"
          />
          {/* Primary dots */}
          {primaryPoints.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={chart.primary.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          ))}
          {/* Secondary dots */}
          {secondaryPoints.map((p, i) => (
            <circle
              key={`s-${i}`}
              cx={p.x}
              cy={p.y}
              r={3}
              fill={chart.secondary.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          ))}
          {/* Day labels */}
          {chart.days.map((day, i) => (
            <text
              key={`lbl-${i}`}
              x={padX + i * stepX}
              y={h - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="#8B828B"
            >
              {day}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// Horizontal carousel of correlation cards — same pattern as the
// week themes row on the Themes tab. Each card is a gradient-backed
// tile with a huge tilted decorative icon and an eyebrow/headline/
// subtext stack pinned to the bottom. Tap opens that correlation's
// individual takeover (no stories progress bar, no tap-zone swiping,
// no "1 of N" label — each card opens its own surface cleanly).
function CorrelationsCarousel({ onOpenCorrelation }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          Correlations
        </span>
        <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">
          Swipe &rarr;
        </span>
      </div>
      <div className="-mx-[16px] px-[16px] overflow-x-auto">
        <div className="flex gap-[10px] w-max pb-[4px]">
          {CORRELATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpenCorrelation(c.id)}
              style={{ backgroundImage: c.bgImage }}
              className="relative overflow-hidden shrink-0 w-[220px] h-[240px] rounded-[18px] p-[16px] flex flex-col justify-end text-left hover:scale-[1.01] transition-transform cursor-pointer"
            >
              {/* Decorative icon — huge, tilted, cropped off the top-left */}
              {c.icon && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[44px] -left-[44px] w-[180px] h-[180px] opacity-15 -rotate-[14deg]"
                  style={{ color: c.iconColor || c.textColor }}
                >
                  <StoryIcon name={c.icon} className="w-full h-full" />
                </div>
              )}
              <span
                className="relative text-[10px] leading-[13px] font-[600] tracking-[0.06em] uppercase block mb-[8px] opacity-70"
                style={{ color: c.textColor }}
              >
                {c.eyebrow}
              </span>
              <span
                className="relative text-[19px] leading-[24px] font-[700] tracking-[-0.01em] block"
                style={{ color: c.textColor }}
                dangerouslySetInnerHTML={{ __html: c.headline }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrackersTab({ onOpenCorrelation }) {
  const sleepAvg = (SLEEP_LOG.reduce((sum, d) => sum + d.hours, 0) / SLEEP_LOG.length).toFixed(1);
  const medsTaken = MEDS_LOG.filter((d) => d.taken).length;
  const periodDays = PERIOD_LOG.filter((d) => d.flow !== 'none').length;
  const exerciseTotal = EXERCISE_LOG.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Horizontal carousel of correlation cards — each card opens
          its own takeover with chart + prose + Go Deeper flow. */}
      <CorrelationsCarousel onOpenCorrelation={onOpenCorrelation} />

      {/* Section header */}
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          Your logs this week
        </span>
        <button className="text-[10px] leading-[13px] font-[600] tracking-[0.04em] uppercase text-[#E31665]">
          + Add tracker
        </button>
      </div>

      {/* Sleep */}
      <TrackerSection
        icon="🌙"
        color="#6B8BC4"
        title="Sleep"
        summary={`Avg ${sleepAvg}h · shortest 4h on Tue`}
      >
        <SleepViz />
      </TrackerSection>

      {/* Exercise */}
      <TrackerSection
        icon="🏃"
        color="#5ABA9D"
        title="Exercise"
        summary={`${exerciseTotal} min total · 4 active days`}
      >
        <ExerciseViz />
      </TrackerSection>

      {/* Meds */}
      <TrackerSection
        icon="💊"
        color="#E4AD51"
        title="Allergy meds"
        summary={`${medsTaken} of 7 taken · missed Sun and Tue`}
      >
        <MedsViz />
      </TrackerSection>

      {/* Period */}
      <TrackerSection
        icon="🩸"
        color="#E31665"
        title="Period"
        summary={`${periodDays} days tracked · started Tue, light`}
      >
        <PeriodViz />
      </TrackerSection>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHALLENGE TAB — gentle things Sage wants the user to notice,
   using the therapist-style collapsible cards adapted for the
   journaler's perspective.
   ══════════════════════════════════════════════════════════ */
// Short-form challenge type labels for the uppercase eyebrow
const CHALLENGE_TYPE_LABEL = {
  contradiction: 'Contradiction',
  avoidance: 'Avoidance',
  selftalk: 'Self-talk',
  loop: 'Recurring loop',
};

function ChallengeTab({ onOpenChallenge }) {
  return (
    <div className="flex flex-col gap-[10px]">
      {/* Flat diagnostic cards — whole card is tappable, opens the
          Go Deeper takeover with therapy-backed reflection prompts. */}
      <div className="flex flex-col gap-[10px]">
        {CHALLENGES.map((c) => (
          <button
            key={c.id}
            onClick={() => onOpenChallenge(c.id)}
            className="text-left bg-[#FAFAFA] rounded-[16px] p-[16px] flex flex-col gap-[10px] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
          >
            {/* Warning icon + uppercase type */}
            <div className="flex items-center gap-[6px]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={c.accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[14px] h-[14px]"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-[10px] leading-[13px] font-[700] tracking-[0.1em] uppercase text-[#8B828B]">
                {CHALLENGE_TYPE_LABEL[c.id] || c.type}
              </span>
            </div>

            {/* Full body text always visible */}
            <p
              className="text-[14px] leading-[21px] font-[450] text-[#191C1A]"
              dangerouslySetInnerHTML={{ __html: c.body }}
            />

            {/* Explore affordance — visual hint that the card is tappable.
                The whole card is the click target; this is just a cue. */}
            <span className="self-start inline-flex items-center gap-[5px] text-[12px] leading-[15px] font-[600] text-[#E31665] mt-[2px]">
              Go deeper
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN — tab dispatcher + story detail overlay
   ══════════════════════════════════════════════════════════ */
// Helper that renders a takeover overlay either inline (when no portal
// target is supplied) or portaled into PhoneFrame's rounded screen div
// (so the backdrop covers the status bar at top and the home indicator
// area at the bottom — full bleed). The takeover already uses
// `absolute inset-0` which is correct for both targets: inline, it
// covers ResultsV2Anthology's bounded root; portaled, it covers the
// full phone screen.
function Takeover({ portalContainer, children }) {
  if (portalContainer) return createPortal(children, portalContainer);
  return children;
}

export function ResultsV2Anthology({ onDetailOpenChange, adaptive = false, tenure = 'week', portalContainer } = {}) {
  const [activeTab, setActiveTab] = useState('themes');
  const [activeStoryId, setActiveStoryId] = useState(null);
  const [activeCorrelationId, setActiveCorrelationId] = useState(null);
  const [activeStyleId, setActiveStyleId] = useState(null);
  const [activeEchoId, setActiveEchoId] = useState(null);
  const [activeStoryOfYouKey, setActiveStoryOfYouKey] = useState(null);
  // peopleOpen is now a scope string ('week' | 'quarter') or null.
  // Tracking which scope the takeover is showing lets us pick the
  // right dataset (PEOPLE_IN_STORY vs PEOPLE_IN_STORY_QUARTER) so the
  // quarter donut opens into a quarter-scoped list/drill-down.
  const [peopleOpen, setPeopleOpen] = useState(null);
  const [activePersonName, setActivePersonName] = useState(null);
  const peopleData =
    peopleOpen === 'quarter' ? PEOPLE_IN_STORY_QUARTER : PEOPLE_IN_STORY;
  const activePerson = activePersonName
    ? peopleData.find((p) => p.name === activePersonName)
    : null;
  // Challenge takeover state — activeChallengeId is the card the user
  // tapped, challengeView is whether they've also tapped "Go Deeper"
  // to progress to the therapy-framed insight / paywall view.
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [challengeView, setChallengeView] = useState('summary');
  const activeChallenge = activeChallengeId
    ? CHALLENGES.find((c) => c.id === activeChallengeId)
    : null;
  // Correlation takeover also has a two-state flow: the initial
  // correlation summary + chart, and a "deeper" therapy-framed view
  // reached via a Go Deeper button. Reset to 'summary' whenever a
  // different correlation is selected so swiping forward doesn't
  // strand you in the deeper view of the previous correlation.
  const [correlationView, setCorrelationView] = useState('summary');
  const [timeframeState, setTimeframeState] = useState('week');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // In adaptive mode the parent supplies the tenure and the component
  // locks the timeframe internally. In classic mode the user picks.
  const timeframe = adaptive ? tenure : timeframeState;
  const setTimeframe = adaptive ? () => {} : setTimeframeState;

  // Adaptive subtitle — framed around cumulative words written, not
  // the time window. The start date stays constant across all three
  // tenure views because the user has ONE real first-entry date;
  // only the cumulative total grows as they accumulate more writing.
  // Numbers are plausible-but-mock (a real build would sum
  // entries.wordCount and pull the first-entry timestamp).
  const adaptiveSubtitle = !adaptive
    ? undefined
    : tenure === 'week'
    ? '3,232 words journaled since Apr 2026'
    : tenure === 'month'
    ? '14,867 words journaled since Apr 2026'
    : '87,203 words journaled since Apr 2026';
  // Stories and styles have parallel quarter data sets — try both.
  const activeStory =
    STORIES.find((s) => s.id === activeStoryId) ||
    QUARTER_STORIES.find((s) => s.id === activeStoryId);
  const activeCorrelation = CORRELATIONS.find((c) => c.id === activeCorrelationId);
  const activeStyle =
    STYLES.find((s) => s.id === activeStyleId) ||
    QUARTER_STYLES.find((s) => s.id === activeStyleId);
  const activeEcho = ECHOES.find((e) => e.id === activeEchoId);
  const activeStoryOfYou =
    activeStoryOfYouKey === 'week'
      ? STORY_OF_YOU
      : activeStoryOfYouKey === 'quarter'
      ? STORY_OF_YOU_QUARTER
      : null;

  // Tell the parent (Concepts.jsx) whenever any full-page detail is open so
  // it can hide the phone nav bar for an edge-to-edge takeover.
  // peopleOpen is a scope string when open, so coerce to boolean.
  const anyDetailOpen = Boolean(
    activeStory || activeCorrelation || activeStyle || activeEcho || activeStoryOfYou || peopleOpen !== null || activeChallenge
  );
  useEffect(() => {
    onDetailOpenChange?.(anyDetailOpen);
  }, [anyDetailOpen, onDetailOpenChange]);

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      <div className="shrink-0">
        <Header
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          adaptive={adaptive}
          adaptiveSubtitle={adaptiveSubtitle}
        />
      </div>
      <div className="shrink-0 px-[16px] pt-[6px]">
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-[16px] pt-[16px] pb-[32px]">
        {activeTab === 'themes' && (
          // Week uses the focused weekly view. Month and year both use
          // the longitudinal quarter-view content (same underlying
          // narrative shape — chapter markers, people arriving/fading,
          // language shifts) since the visual treatment is the same.
          timeframe === 'week' ? (
            <ThemesTab
              onOpenStory={setActiveStoryId}
              onOpenStyle={setActiveStyleId}
              onOpenEcho={setActiveEchoId}
              onOpenStoryOfYou={setActiveStoryOfYouKey}
              onOpenPeople={() => setPeopleOpen('week')}
            />
          ) : (
            <ThemesTabQuarter
              onOpenStory={setActiveStoryId}
              onOpenStyle={setActiveStyleId}
              onOpenStoryOfYou={setActiveStoryOfYouKey}
              onOpenPeople={() => setPeopleOpen('quarter')}
              onOpenEcho={setActiveEchoId}
            />
          )
        )}
        {activeTab === 'trackers' && <TrackersTab onOpenCorrelation={setActiveCorrelationId} />}
        {activeTab === 'challenge' && (
          <ChallengeTab
            onOpenChallenge={(id) => {
              setActiveChallengeId(id);
              setChallengeView('summary');
            }}
          />
        )}
      </div>

      {/* ══════════ STORY DETAIL — full-screen takeover ══════════ */}
      {activeStory && (
        <Takeover portalContainer={portalContainer}>
        <div
          className="absolute inset-0 z-40 flex flex-col"
          style={{ backgroundImage: activeStory.detailBgImage || activeStory.bgImage }}
        >
          {/* Top bar: close */}
          <div className="shrink-0 flex items-center justify-end px-[16px] pt-[16px] pb-[12px]">
            <button
              onClick={() => setActiveStoryId(null)}
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              style={{ color: activeStory.textColor }}
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto px-[24px] pb-[16px] flex flex-col">
            <div className="mb-[32px]">
              <span
                className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase block mb-[12px] opacity-70"
                style={{ color: activeStory.textColor }}
              >
                {activeStory.eyebrow}
              </span>
              <h1
                className="text-[28px] leading-[34px] font-[700] tracking-[-0.01em]"
                style={{ color: activeStory.textColor }}
                dangerouslySetInnerHTML={{ __html: activeStory.title }}
              />
              {activeStory.subtext && (
                <span
                  className="text-[13px] leading-[18px] font-[500] block mt-[8px] opacity-70"
                  style={{ color: activeStory.textColor }}
                >
                  {activeStory.subtext}
                </span>
              )}
            </div>

            <p
              className="text-[16px] leading-[26px] font-[450]"
              style={{ color: activeStory.textColor }}
              dangerouslySetInnerHTML={{ __html: activeStory.summary }}
            />
          </div>

          {/* Footer actions */}
          <div className="shrink-0 flex items-center justify-between px-[20px] pt-[12px] pb-[20px]">
            <button
              className="inline-flex items-center gap-[6px] text-[12px] leading-[15px] font-[600]"
              style={{ color: activeStory.textColor, opacity: 0.8 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
              Rate
            </button>
            <div className="flex items-center gap-[10px]">
              <button
                className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-white/30 backdrop-blur-sm text-[12px] leading-[15px] font-[600]"
                style={{ color: activeStory.textColor }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Save
              </button>
              <button
                className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-white/30 backdrop-blur-sm text-[12px] leading-[15px] font-[600]"
                style={{ color: activeStory.textColor }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
        </Takeover>
      )}

      {/* ══════════ ECHO DETAIL — light, neutral full-screen takeover ══════════ */}
      {activeEcho && (
        <Takeover portalContainer={portalContainer}>
        <div className="absolute inset-0 z-40 flex flex-col bg-[#FAFAF8]">
          {/* Top bar: close */}
          <div className="shrink-0 flex items-center justify-end px-[16px] pt-[16px] pb-[12px]">
            <button
              onClick={() => setActiveEchoId(null)}
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#191C1A]"
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto px-[24px] pb-[16px] flex flex-col">
            <div className="mb-[28px]">
              <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase block mb-[12px] text-[#E31665]">
                {activeEcho.eyebrow}
              </span>
              <h1
                className="text-[28px] leading-[34px] font-[700] tracking-[-0.01em] text-[#191C1A]"
                dangerouslySetInnerHTML={{ __html: activeEcho.title }}
              />
              {activeEcho.subtext && (
                <span className="text-[13px] leading-[18px] font-[500] block mt-[8px] text-[#8B828B]">
                  {activeEcho.subtext}
                </span>
              )}
            </div>

            {/* Past quote — dimmer, like a memory */}
            <div className="mb-[20px]">
              <span className="text-[10px] leading-[13px] font-[700] tracking-[0.1em] uppercase block mb-[8px] text-[#8B828B]">
                {activeEcho.pastDate} &middot; then
              </span>
              <p
                className="text-[15px] leading-[23px] font-[450] text-[#6D6C6A]"
                dangerouslySetInnerHTML={{ __html: activeEcho.pastQuote }}
              />
            </div>

            {/* This week's quote — brighter, the present moment */}
            <div className="mb-[24px]">
              <span className="text-[10px] leading-[13px] font-[700] tracking-[0.1em] uppercase block mb-[8px] text-[#E31665]">
                {activeEcho.thisDate} &middot; this week
              </span>
              <p
                className="text-[15px] leading-[23px] font-[450] text-[#191C1A]"
                dangerouslySetInnerHTML={{ __html: activeEcho.thisQuote }}
              />
            </div>

            {/* Interpretive prose */}
            <p
              className="text-[16px] leading-[26px] font-[450] text-[#191C1A]"
              dangerouslySetInnerHTML={{ __html: activeEcho.summary }}
            />
          </div>

          {/* Footer actions */}
          <div className="shrink-0 flex items-center justify-between px-[20px] pt-[12px] pb-[20px] border-t border-[#F0F0F0]">
            <button className="inline-flex items-center gap-[6px] text-[12px] leading-[15px] font-[600] text-[#8B828B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
              Rate
            </button>
            <div className="flex items-center gap-[10px]">
              <button className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] text-[12px] leading-[15px] font-[600] text-[#191C1A] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Save
              </button>
              <button className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] text-[12px] leading-[15px] font-[600] text-[#191C1A] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                </svg>
                Read both
              </button>
            </div>
          </div>
        </div>
        </Takeover>
      )}

      {/* ══════════ STORY OF YOU — audiobook-style prose takeover ══════════
          Single text style, flowing paragraphs, generous line-height.
          Audio button in the footer toggles a visual playing state. */}
      {activeStoryOfYou && (
        <StoryOfYouTakeover
          story={activeStoryOfYou}
          onClose={() => setActiveStoryOfYouKey(null)}
          portalContainer={portalContainer}
        />
      )}

      {/* ══════════ CHALLENGE DETAIL — full-screen takeover ══════════
          Two-state surface: the "summary" view shows the challenge's
          diagnostic content with a Go Deeper CTA, and the "deeper"
          view shows a therapy-framed insight + reflection prompts
          behind a subtle Rosebud Bloom paywall. Gradient background
          carries the card's family color through to the takeover so
          the two feel linked visually. */}
      {activeChallenge && (
        <Takeover portalContainer={portalContainer}>
        <div
          className={`absolute inset-0 z-40 flex flex-col bg-gradient-to-b ${activeChallenge.gradient}`}
        >
          {/* Top bar — back (when drilled in), close */}
          <div className="shrink-0 flex items-center justify-between px-[16px] pt-[16px] pb-[12px] gap-[8px]">
            {challengeView === 'deeper' ? (
              <button
                onClick={() => setChallengeView('summary')}
                className="shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#191C1A]"
                title="Back"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            ) : (
              <div className="w-[36px]" />
            )}
            <button
              onClick={() => {
                setActiveChallengeId(null);
                setChallengeView('summary');
              }}
              className="shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#191C1A]"
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── SUMMARY view — challenge diagnostic + Go Deeper CTA ── */}
          {challengeView === 'summary' && (
            <div className="flex-1 min-h-0 overflow-y-auto px-[24px] pb-[24px] flex flex-col gap-[20px]">
              {/* Category eyebrow with warning icon */}
              <div className="flex items-center gap-[6px]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={activeChallenge.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[14px] h-[14px]"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span
                  className="text-[10px] leading-[13px] font-[700] tracking-[0.1em] uppercase"
                  style={{ color: activeChallenge.accent }}
                >
                  {CHALLENGE_TYPE_LABEL[activeChallenge.id] || activeChallenge.type}
                </span>
              </div>

              {/* Large title */}
              <h1
                className="text-[26px] leading-[32px] font-[700] text-[#191C1A] tracking-[-0.01em]"
                dangerouslySetInnerHTML={{ __html: activeChallenge.title }}
              />

              {/* Full body */}
              <p
                className="text-[16px] leading-[24px] font-[450] text-[#191C1A]"
                dangerouslySetInnerHTML={{ __html: activeChallenge.body }}
              />

              <div className="flex-1" />

              {/* Go Deeper CTA — design-system primary button */}
              <Button
                variant="primary"
                size="large"
                className="w-full"
                onClick={() => setChallengeView('deeper')}
              >
                Go deeper
              </Button>
            </div>
          )}

          {/* ── DEEPER view — therapy-framed insight + prompts + paywall ── */}
          {challengeView === 'deeper' && (
            <div className="flex-1 min-h-0 overflow-y-auto px-[24px] pb-[24px] flex flex-col gap-[20px]">
              {/* Framework eyebrow — anchors the insight in a recognized
                  therapeutic approach (CBT, ACT, IFS) so the content
                  doesn't feel like generic AI output. */}
              <div className="flex items-center gap-[6px]">
                <span
                  className="text-[10px] leading-[13px] font-[700] tracking-[0.1em] uppercase"
                  style={{ color: activeChallenge.accent }}
                >
                  {activeChallenge.deeper.framework}
                </span>
                <span className="text-[10px] leading-[13px] font-[500] tracking-[0.04em] uppercase text-[#8B828B]">
                  &middot; {activeChallenge.deeper.frameworkTag}
                </span>
              </div>

              {/* Insight paragraph — therapy-framed explanation */}
              <p
                className="text-[15px] leading-[23px] font-[450] text-[#191C1A]"
                dangerouslySetInnerHTML={{ __html: activeChallenge.deeper.insight }}
              />

              {/* Reflection prompts — each as its own card so they read
                  as a set of distinct things to sit with, not a list */}
              <div className="flex flex-col gap-[10px]">
                <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                  Sit with these
                </span>
                {activeChallenge.deeper.prompts.map((p, i) => (
                  <div
                    key={i}
                    className="bg-white/60 border border-black/5 rounded-[14px] px-[14px] py-[12px] flex items-start gap-[10px]"
                  >
                    <span
                      className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] leading-[10px] font-[700] text-white mt-[1px]"
                      style={{ backgroundColor: activeChallenge.accent }}
                    >
                      {i + 1}
                    </span>
                    <p
                      className="text-[14px] leading-[21px] font-[450] text-[#191C1A]"
                      dangerouslySetInnerHTML={{ __html: p }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex-1" />

              {/* Rosebud Bloom paywall — soft upsell block. The takeover
                  still shows the insight above it (so the user sees the
                  value), but more personalized reflection flows sit
                  behind the upgrade. */}
              <div className="rounded-[16px] bg-[#191C1A] p-[18px] flex flex-col gap-[10px]">
                <div className="flex items-center gap-[6px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E4AD51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase text-[#E4AD51]">
                    Rosebud Bloom
                  </span>
                </div>
                <p className="text-[14px] leading-[20px] font-[450] text-white/90">
                  Unlock therapist-designed reflection flows tailored to your entries. Continue this conversation with Rosebud, track your progress, and get follow-up prompts as new patterns emerge.
                </p>
                <Button
                  variant="primary"
                  size="large"
                  className="w-full mt-[4px] !bg-white !text-[#191C1A]"
                >
                  Try Rosebud Bloom free
                </Button>
              </div>
            </div>
          )}
        </div>
        </Takeover>
      )}

      {/* ══════════ PEOPLE DETAIL — full list takeover ══════════
          Horizontal tone legend at the top, then every person shown
          as a name-over-thin-colored-bar row with mention count on
          the right. Sorted by mentions descending across all people.
          Scales to any number of people since the summary is fixed. */}
      {peopleOpen !== null && (() => {
        // Use the scope-aware dataset: PEOPLE_IN_STORY for the week
        // takeover, PEOPLE_IN_STORY_QUARTER for the quarter takeover.
        const maxMentions = Math.max(...peopleData.map((p) => p.mentions));
        const sorted = [...peopleData].sort((a, b) => b.mentions - a.mentions);
        const periodLabel =
          peopleOpen === 'quarter' ? 'this quarter' : 'this week';
        return (
        <Takeover portalContainer={portalContainer}>
        <div className="absolute inset-0 z-40 flex flex-col bg-[#FAFAF8]">
          {/* Top bar — back (when drilled in), title, close */}
          <div className="shrink-0 flex items-center justify-between px-[16px] pt-[16px] pb-[12px] gap-[8px]">
            {activePerson ? (
              <button
                onClick={() => setActivePersonName(null)}
                className="shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#191C1A]"
                title="Back"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            ) : (
              <div className="min-w-0">
                <span className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase text-[#8B828B] block">
                  People in your story
                </span>
                <span className="text-[18px] leading-[24px] font-[700] text-[#191C1A] tracking-[-0.01em] block mt-[2px]">
                  {peopleData.length} people {periodLabel}
                </span>
              </div>
            )}
            <button
              onClick={() => {
                setPeopleOpen(null);
                setActivePersonName(null);
              }}
              className="shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#191C1A]"
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── PERSON DETAIL ── */}
          {activePerson ? (
            (() => {
              const tone = PEOPLE_TONE[activePerson.tone];
              const history = activePerson.history || [];
              const maxHist = Math.max(...history.map((h) => h.mentions), 1);
              return (
                <div className="flex-1 min-h-0 overflow-y-auto px-[20px] pb-[24px] flex flex-col gap-[18px]">
                  {/* Name + current tone pill */}
                  <div className="flex flex-col gap-[6px]">
                    <h1 className="text-[28px] leading-[32px] font-[700] text-[#191C1A] tracking-[-0.01em]">
                      {activePerson.name}
                    </h1>
                    <div className="flex items-center gap-[8px]">
                      <span
                        className="inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-full text-[10px] leading-[13px] font-[700] tracking-[0.06em] uppercase"
                        style={{ backgroundColor: `${tone.color}22`, color: tone.color }}
                      >
                        <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: tone.color }} />
                        {tone.label}
                      </span>
                      <span className="text-[12px] leading-[15px] font-[500] text-[#8B828B]">
                        {activePerson.mentions} mentions {periodLabel}
                      </span>
                    </div>
                    <p className="text-[13px] leading-[19px] font-[450] text-[#6D6C6A] mt-[2px]">
                      {activePerson.note}
                    </p>
                  </div>

                  {/* Mention trend chart — 12 bars, each colored by that week's tone */}
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                        12 weeks of mentions
                      </span>
                      <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">
                        Jan 10 &mdash; Mar 28
                      </span>
                    </div>
                    <div className="bg-[#FAFAFA] rounded-[12px] p-[14px]">
                      {/* Wavy line chart — smooth Catmull-Rom bezier path.
                          The stroke uses a horizontal gradient that stops
                          at each week\u2019s x-position in that week\u2019s tone
                          color, so the line visibly transitions color
                          wherever the tone transitions (e.g. sage → pink
                          for nourishing → draining). The area fill below
                          uses the same gradient at low opacity. */}
                      {(() => {
                        const w = 296;
                        const h = 80;
                        const padX = 6;
                        const padTop = 8;
                        const padBot = 6;
                        const plotH = h - padTop - padBot;
                        const stepX = (w - padX * 2) / Math.max(history.length - 1, 1);
                        const points = history.map((d, i) => ({
                          x: padX + i * stepX,
                          y: padTop + plotH - (d.mentions / maxHist) * plotH,
                          ...d,
                        }));
                        const linePath = smoothPath(points);
                        const lastX = points[points.length - 1].x;
                        const firstX = points[0].x;
                        const areaPath = `${linePath} L ${lastX},${padTop + plotH} L ${firstX},${padTop + plotH} Z`;

                        // Build gradient stops — one per week, positioned
                        // at that week's x-%, colored by that week's tone.
                        // SVG blends linearly between adjacent stops so
                        // tone transitions show as smooth color shifts.
                        const gradStops = points.map((p, i) => {
                          const pct = ((p.x - padX) / (w - padX * 2)) * 100;
                          const color = PEOPLE_TONE[p.tone]?.color || '#C0C0BF';
                          return { offset: pct, color };
                        });
                        const safeName = activePerson.name.replace(/\s+/g, '-');
                        const strokeGradId = `personStroke-${safeName}`;
                        const fillGradId = `personFill-${safeName}`;

                        return (
                          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
                            <defs>
                              {/* Horizontal gradient for the stroke —
                                  colors match per-week tone */}
                              <linearGradient id={strokeGradId} x1="0" y1="0" x2="1" y2="0">
                                {gradStops.map((s, i) => (
                                  <stop key={i} offset={`${s.offset}%`} stopColor={s.color} />
                                ))}
                              </linearGradient>
                              {/* Same gradient but faded, for the area fill */}
                              <linearGradient id={fillGradId} x1="0" y1="0" x2="1" y2="0">
                                {gradStops.map((s, i) => (
                                  <stop key={i} offset={`${s.offset}%`} stopColor={s.color} stopOpacity="0.18" />
                                ))}
                              </linearGradient>
                            </defs>
                            {/* Soft tone-colored fill under the curve */}
                            <path d={areaPath} fill={`url(#${fillGradId})`} />
                            {/* Gradient-stroked wavy line */}
                            <path
                              d={linePath}
                              fill="none"
                              stroke={`url(#${strokeGradId})`}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Weekly dots colored by that week's tone */}
                            {points.map((p, i) => {
                              const dotColor = PEOPLE_TONE[p.tone]?.color || '#C0C0BF';
                              const isLast = i === points.length - 1;
                              return (
                                <circle
                                  key={i}
                                  cx={p.x}
                                  cy={p.y}
                                  r={isLast ? 3.5 : 2.25}
                                  fill={dotColor}
                                  stroke="#FAFAFA"
                                  strokeWidth="1.5"
                                />
                              );
                            })}
                          </svg>
                        );
                      })()}
                      {/* Axis labels — first and last weeks */}
                      <div className="flex items-center justify-between mt-[6px]">
                        <span className="text-[9px] leading-[12px] font-[500] text-[#8B828B]">
                          {history[0]?.week}
                        </span>
                        <span className="text-[9px] leading-[12px] font-[500] text-[#8B828B]">
                          this week
                        </span>
                      </div>
                    </div>
                    {activePerson.toneShift && (
                      <p className="text-[12px] leading-[18px] font-[450] text-[#6D6C6A]">
                        {activePerson.toneShift}
                      </p>
                    )}
                  </div>

                  {/* Key moments — pull quotes */}
                  {activePerson.keyMoments && activePerson.keyMoments.length > 0 && (
                    <div className="flex flex-col gap-[10px]">
                      <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                        Key moments
                      </span>
                      <div className="flex flex-col gap-[10px]">
                        {activePerson.keyMoments.map((m, i) => (
                          <div key={i} className="bg-[#FAFAFA] rounded-[12px] p-[14px] flex flex-col gap-[4px]">
                            <span className="text-[9px] leading-[12px] font-[700] tracking-[0.1em] uppercase text-[#8B828B]">
                              {m.date}
                            </span>
                            <p className="text-[13px] leading-[19px] font-[450] text-[#191C1A]">
                              &ldquo;{m.excerpt}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <>
              {/* Horizontal tone legend — repeated from the inline card */}
              <div className="shrink-0 px-[20px] pb-[16px]">
                <div className="flex items-center gap-[16px] flex-wrap">
                  {['draining', 'mixed', 'nourishing'].map((toneKey) => {
                    const tone = PEOPLE_TONE[toneKey];
                    return (
                      <div key={toneKey} className="flex items-center gap-[6px]">
                        <span
                          className="w-[8px] h-[8px] rounded-full"
                          style={{ backgroundColor: tone.color }}
                        />
                        <span className="text-[11px] leading-[14px] font-[500] text-[#191C1A]">
                          {tone.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable list — each row tappable into per-person trends */}
              <div className="flex-1 min-h-0 overflow-y-auto px-[20px] pb-[24px] flex flex-col gap-[18px]">
                {sorted.map((p) => {
                  const tone = PEOPLE_TONE[p.tone];
                  return (
                    <button
                      key={p.name}
                      onClick={() => setActivePersonName(p.name)}
                      className="flex flex-col gap-[5px] text-left hover:opacity-70 transition-opacity"
                    >
                      <div className="flex items-baseline justify-between gap-[8px]">
                        <span className="text-[15px] leading-[20px] font-[700] text-[#191C1A] inline-flex items-center gap-[6px]">
                          {p.name}
                          <svg viewBox="0 0 24 24" fill="none" stroke="#C0C0BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                        <span className="text-[12px] leading-[15px] font-[600] text-[#8B828B]">
                          {p.mentions} mentions
                        </span>
                      </div>
                      {/* Stacked tone-breakdown bar — shows how the week's
                          mentions split across draining / mixed / nourishing
                          instead of collapsing everything to a single tone.
                          Segments sit left-to-right in consistent order so
                          the bar creates a visual emotional gradient across
                          the row at a glance. */}
                      <div className="w-full h-[4px] rounded-full bg-[#EDEDED] overflow-hidden flex">
                        {['draining', 'mixed', 'nourishing'].map((toneKey) => {
                          const count = p.breakdown?.[toneKey] || 0;
                          if (count === 0) return null;
                          return (
                            <div
                              key={toneKey}
                              className="h-full"
                              style={{
                                width: `${(count / maxMentions) * 100}%`,
                                backgroundColor: PEOPLE_TONE[toneKey].color,
                              }}
                            />
                          );
                        })}
                      </div>
                      <p className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A] mt-[2px]">
                        {p.note}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
        </Takeover>
        );
      })()}

      {/* ══════════ CORRELATION DETAIL — per-card takeover ══════════
          Each correlation opens its own takeover (no stories-style
          pagination). Two views inside: summary + "Go Deeper" therapy
          framing. Background gradient is pulled from the card's own
          family color so the takeover feels linked to the card. */}
      {activeCorrelation && (
        <Takeover portalContainer={portalContainer}>
        <div
          className="absolute inset-0 z-40 flex flex-col"
          style={{ backgroundImage: activeCorrelation.bgImage }}
        >
          {/* Top bar — back (in deeper view) + close */}
          <div className="shrink-0 flex items-center justify-between px-[16px] pt-[16px] pb-[8px]">
            {correlationView === 'deeper' ? (
              <button
                onClick={() => setCorrelationView('summary')}
                className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                style={{ color: activeCorrelation.textColor }}
                title="Back"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            ) : (
              <div className="w-[36px]" />
            )}
            <button
              onClick={() => {
                setActiveCorrelationId(null);
                setCorrelationView('summary');
              }}
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              style={{ color: activeCorrelation.textColor }}
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── SUMMARY view — correlation chart + prose + Go Deeper ── */}
          {correlationView === 'summary' && (
            <div className="flex-1 min-h-0 overflow-y-auto px-[20px] pb-[16px] flex flex-col gap-[20px]">
              <div className="flex items-center gap-[6px]">
                <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: activeCorrelation.iconColor }} />
                <span
                  className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase"
                  style={{ color: activeCorrelation.iconColor }}
                >
                  {activeCorrelation.eyebrow}
                </span>
              </div>
              <h1
                className="text-[24px] leading-[30px] font-[700] tracking-[-0.01em]"
                style={{ color: activeCorrelation.textColor }}
              >
                {activeCorrelation.headline}
              </h1>

              {/* Dual-series chart */}
              <CorrelationChart chart={activeCorrelation.chart} />

              {/* Prose detail */}
              <p
                className="text-[14px] leading-[22px] font-[450] opacity-70"
                style={{ color: activeCorrelation.textColor }}
                dangerouslySetInnerHTML={{ __html: activeCorrelation.detail }}
              />
            </div>
          )}

          {/* ── DEEPER view — therapy framing + prompts + Bloom paywall ── */}
          {correlationView === 'deeper' && (
            <div className="flex-1 min-h-0 overflow-y-auto px-[20px] pb-[16px] flex flex-col gap-[20px]">
              <div className="flex items-center gap-[6px]">
                <span className="text-[10px] leading-[13px] font-[700] tracking-[0.1em] uppercase text-[#A40742]">
                  {activeCorrelation.deeper.framework}
                </span>
                <span className="text-[10px] leading-[13px] font-[500] tracking-[0.04em] uppercase text-[#A40742] opacity-60">
                  &middot; {activeCorrelation.deeper.frameworkTag}
                </span>
              </div>

              {/* Insight paragraph */}
              <p
                className="text-[15px] leading-[23px] font-[450] text-[#191C1A]"
                dangerouslySetInnerHTML={{ __html: activeCorrelation.deeper.insight }}
              />

              {/* Reflection prompts */}
              <div className="flex flex-col gap-[10px]">
                <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#A40742] opacity-70">
                  Sit with these
                </span>
                {activeCorrelation.deeper.prompts.map((p, i) => (
                  <div
                    key={i}
                    className="bg-white/60 border border-black/5 rounded-[14px] px-[14px] py-[12px] flex items-start gap-[10px]"
                  >
                    <span className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] leading-[10px] font-[700] text-white mt-[1px] bg-[#E31665]">
                      {i + 1}
                    </span>
                    <p
                      className="text-[14px] leading-[21px] font-[450] text-[#191C1A]"
                      dangerouslySetInnerHTML={{ __html: p }}
                    />
                  </div>
                ))}
              </div>

              {/* Rosebud Bloom paywall — same pattern as the challenge
                  takeover. Value (insight + prompts) renders above, the
                  upsell sits below so users see what they'd be unlocking. */}
              <div className="rounded-[16px] bg-[#191C1A] p-[18px] flex flex-col gap-[10px]">
                <div className="flex items-center gap-[6px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E4AD51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase text-[#E4AD51]">
                    Rosebud Bloom
                  </span>
                </div>
                <p className="text-[14px] leading-[20px] font-[450] text-white/90">
                  Unlock therapist-designed reflection flows tailored to your entries. Continue this conversation with Rosebud, track your progress, and get follow-up prompts as new patterns emerge.
                </p>
                <Button
                  variant="primary"
                  size="large"
                  className="w-full mt-[4px] !bg-white !text-[#191C1A]"
                >
                  Try Rosebud Bloom free
                </Button>
              </div>
            </div>
          )}

          {/* Footer — primary Go Deeper CTA on the summary view only.
              Replaces the old Rate / Save / Share triad so the user has
              one clear next action. The deeper view's paywall sits inside
              the scrollable body instead, so the footer is empty there. */}
          {correlationView === 'summary' && (
            <div className="shrink-0 px-[20px] pt-[8px] pb-[20px]">
              <Button
                variant="primary"
                size="large"
                className="w-full"
                onClick={() => setCorrelationView('deeper')}
              >
                Go deeper
              </Button>
            </div>
          )}
        </div>
        </Takeover>
      )}

      {/* ══════════ STYLE DETAIL — full-screen takeover ══════════ */}
      {activeStyle && (
        <Takeover portalContainer={portalContainer}>
        <div
          className="absolute inset-0 z-40 flex flex-col"
          style={{ backgroundImage: activeStyle.bgImage }}
        >
          {/* Top bar: close */}
          <div className="shrink-0 flex items-center justify-end px-[16px] pt-[16px] pb-[12px]">
            <button
              onClick={() => setActiveStyleId(null)}
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              style={{ color: activeStyle.textColor }}
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto px-[24px] pb-[16px] flex flex-col gap-[20px]">
            {/* Big illustration shape */}
            <div className="flex justify-start pt-[4px]">
              <svg viewBox="0 0 88 88" className="w-[72px] h-[72px]">
                {activeStyle.shape === 'triangle' && (
                  <path d="M44 14 L76 72 L12 72 Z" fill="none" stroke={activeStyle.color} strokeWidth="3" strokeLinejoin="round" />
                )}
                {activeStyle.shape === 'diamond' && (
                  <path d="M44 10 L78 44 L44 78 L10 44 Z" fill="none" stroke={activeStyle.color} strokeWidth="3" strokeLinejoin="round" />
                )}
                {activeStyle.shape === 'circle' && (
                  <circle cx="44" cy="44" r="32" fill="none" stroke={activeStyle.color} strokeWidth="3" />
                )}
                {activeStyle.shape === 'star' && (
                  <path
                    d="M44 10 L52 36 L78 36 L57 52 L65 78 L44 62 L23 78 L31 52 L10 36 L36 36 Z"
                    fill="none"
                    stroke={activeStyle.color}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                )}
                <circle cx="44" cy="44" r="4" fill={activeStyle.color} />
              </svg>
            </div>

            {/* Eyebrow + title + tagline */}
            <div>
              <span
                className="text-[11px] leading-[14px] font-[700] tracking-[0.08em] uppercase block mb-[10px]"
                style={{ color: activeStyle.color }}
              >
                {activeStyle.category}
              </span>
              <h1
                className="text-[28px] leading-[34px] font-[700] tracking-[-0.01em]"
                style={{ color: activeStyle.textColor }}
              >
                {activeStyle.name}
              </h1>
              <p
                className="text-[14px] leading-[22px] font-[500] italic mt-[6px] opacity-80"
                style={{ color: activeStyle.textColor }}
              >
                {activeStyle.tagline}
              </p>
            </div>

            {/* Long detail prose */}
            <p
              className="text-[15px] leading-[24px] font-[450]"
              style={{ color: activeStyle.textColor }}
              dangerouslySetInnerHTML={{ __html: activeStyle.detail }}
            />
          </div>

          {/* Footer actions */}
          <div className="shrink-0 flex items-center justify-between px-[20px] pt-[12px] pb-[20px]">
            <button
              className="inline-flex items-center gap-[6px] text-[12px] leading-[15px] font-[600] opacity-80"
              style={{ color: activeStyle.textColor }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
              Rate
            </button>
            <div className="flex items-center gap-[10px]">
              <button
                className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-white/60 backdrop-blur-sm text-[12px] leading-[15px] font-[600]"
                style={{ color: activeStyle.textColor }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Save
              </button>
              <button
                className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-white/60 backdrop-blur-sm text-[12px] leading-[15px] font-[600]"
                style={{ color: activeStyle.textColor }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
        </Takeover>
      )}
    </div>
  );
}
