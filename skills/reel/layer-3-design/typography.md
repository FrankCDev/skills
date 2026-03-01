---
name: typography
description: Font stacks, type scale, weight pairing, and multilingual text for video
metadata:
  tags: typography, fonts, type-scale, font-weight, text, cjk
---

# Typography

Video typography follows different rules than web typography. Text is scanned, not read. It appears for seconds, not minutes. Everything must be larger, bolder, and more generously spaced than you think.

---

## Recommended Font Stacks

### Display / Headlines: Inter (700-800)

The workhorse. Inter has excellent readability at all sizes, beautiful numerals, and wide language support. Use weight 700-800 for headlines.

```tsx
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

// Use in style
const headlineStyle: React.CSSProperties = {
  fontFamily,
  fontWeight: 700,
  fontSize: 64,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
};
```

### Alternative Display: Geist (700)

A modern sans-serif from Vercel. Slightly more geometric than Inter, with excellent legibility.

```tsx
// Geist is not on Google Fonts -- load via @fontsource or local file
// If using Google Fonts, Inter is the closest match
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();
```

### Body: Inter (400-500)

Same family as headlines for consistency. Weight 400 for body, 500 for emphasized body text.

```tsx
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

const bodyStyle: React.CSSProperties = {
  fontFamily,
  fontWeight: 400,
  fontSize: 24,
  lineHeight: 1.5,
  letterSpacing: '0em',
};
```

### Monospace / Code: JetBrains Mono

For code snippets, terminal output, and technical data.

```tsx
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: monoFamily } = loadMono();

const codeStyle: React.CSSProperties = {
  fontFamily: monoFamily,
  fontWeight: 400,
  fontSize: 22,
  lineHeight: 1.6,
  letterSpacing: '0em',
};
```

### Chinese (CJK): Noto Sans SC

For Chinese text content. Load only the weights you need to minimize bundle size.

```tsx
import { loadFont as loadChinese } from '@remotion/google-fonts/NotoSansSC';

const { fontFamily: chineseFamily } = loadChinese();

const chineseStyle: React.CSSProperties = {
  fontFamily: chineseFamily,
  fontWeight: 400,
  fontSize: 28,
  lineHeight: 1.6,
};
```

**Subset guidance**: Noto Sans SC is a large font. When possible:
- Load only the weights you use (400, 700)
- Use `text` parameter in loadFont to subset to specific characters if supported
- For short text (titles, labels), consider pre-subsetting

---

## Type Scale (Video-Optimized)

Video text must be significantly larger than web text. A viewer is typically 3-10 feet from a screen, and text appears for only a few seconds.

```ts
export const typeScale = {
  display: {
    fontSize: 88,     // 80-96px range -- hero text, big numbers
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h1: {
    fontSize: 60,     // 56-64px range -- scene titles
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: 44,     // 40-48px range -- section headers
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: 34,     // 32-36px range -- subtitles
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0em',
  },
  body: {
    fontSize: 26,     // 24-28px range -- paragraph text
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  caption: {
    fontSize: 18,     // 16-20px range -- labels, timestamps
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  code: {
    fontSize: 22,     // 20-24px range -- code snippets
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0em',
  },
  label: {
    fontSize: 14,     // 12-16px range -- uppercase small labels
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
} as const;
```

---

## Weight Pairing Rules

Weight contrast creates hierarchy just like size contrast. Follow these pairings:

| Element | Weight | Purpose |
|---------|--------|---------|
| Display headlines | 800 (ExtraBold) | Maximum visual impact |
| Section titles | 700 (Bold) | Strong but not overpowering |
| Subheadings | 600 (SemiBold) | Clear hierarchy step down |
| Body text | 400 (Regular) | Comfortable reading |
| Captions/labels | 500 (Medium) | Slightly emphasized small text |
| Light accents | 300 (Light) | Elegant, understated |

**The golden rule**: Never use adjacent weights together (e.g., 400 and 500 are too similar). Jump at least 200 units: 400 body + 700 heading, or 300 caption + 600 subheading.

```tsx
// CORRECT: Strong weight contrast
<h1 style={{ fontWeight: 700, fontSize: 60 }}>Bold Headline</h1>
<p style={{ fontWeight: 400, fontSize: 26 }}>Regular body text</p>

// INCORRECT: Weak weight contrast
<h1 style={{ fontWeight: 500, fontSize: 60 }}>Medium Headline</h1>
<p style={{ fontWeight: 400, fontSize: 26 }}>Regular body text -- too similar</p>
```

---

## Line Height

Video line heights are different from web. Text is scanned quickly, so lines need more breathing room.

```ts
export const lineHeights = {
  display: 1.1,   // Tight for display -- big text needs less gap
  heading: 1.2,   // Slightly open for multi-line headings
  subheading: 1.3, // Comfortable for subtitles
  body: 1.5,      // Generous for readability
  code: 1.6,      // Extra space for code legibility
  loose: 1.8,     // Very open -- special cases only
} as const;
```

**Why larger than web**: On the web, users control their reading pace. In video, text appears and disappears on a timer. Generous line height helps the eye parse text faster during the limited display time.

---

## Letter Spacing

```ts
export const letterSpacing = {
  tight: '-0.02em',    // Display text -- large text looks better tighter
  normal: '0em',       // Body text -- no adjustment needed
  wide: '0.02em',      // Small text -- slightly open for legibility
  caps: '0.05em',      // Uppercase labels -- ALWAYS add spacing to caps
  extraWide: '0.1em',  // Special emphasis -- use sparingly
} as const;
```

**Critical rule**: ALWAYS add positive letter-spacing to uppercase text. Without it, caps look cramped and hard to read.

```tsx
// CORRECT: Uppercase with added spacing
<span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 14, fontWeight: 600 }}>
  CHAPTER 01
</span>

// INCORRECT: Uppercase with no spacing
<span style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 600 }}>
  CHAPTER 01  {/* Looks cramped */}
</span>
```

---

## Complete Font Loading Example

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

// Load fonts
const { fontFamily: interFamily } = loadFont();
const { fontFamily: monoFamily } = loadMono();

// Type scale as reusable styles
const type = {
  display: {
    fontFamily: interFamily,
    fontSize: 88,
    fontWeight: 800 as const,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h1: {
    fontFamily: interFamily,
    fontSize: 60,
    fontWeight: 700 as const,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: interFamily,
    fontSize: 44,
    fontWeight: 600 as const,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: interFamily,
    fontSize: 34,
    fontWeight: 600 as const,
    lineHeight: 1.3,
    letterSpacing: '0em',
  },
  body: {
    fontFamily: interFamily,
    fontSize: 26,
    fontWeight: 400 as const,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  caption: {
    fontFamily: interFamily,
    fontSize: 18,
    fontWeight: 500 as const,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  code: {
    fontFamily: monoFamily,
    fontSize: 22,
    fontWeight: 400 as const,
    lineHeight: 1.6,
    letterSpacing: '0em',
  },
  label: {
    fontFamily: interFamily,
    fontSize: 14,
    fontWeight: 600 as const,
    lineHeight: 1.2,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
};

// Example usage in a composition
const TypographyShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeUp = (startFrame: number) => {
    const progress = spring({
      frame: Math.max(0, frame - startFrame),
      fps: 30,
      config: { damping: 200 },
    });
    return {
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        padding: 96,
        justifyContent: 'center',
      }}
    >
      {/* Label */}
      <p
        style={{
          ...type.label,
          color: '#0A84FF',
          margin: 0,
          ...fadeUp(0),
        }}
      >
        Introducing
      </p>

      {/* Display headline */}
      <h1
        style={{
          ...type.display,
          color: '#F5F5F7',
          margin: 0,
          marginTop: 16,
          ...fadeUp(6),
        }}
      >
        Reel Engine
      </h1>

      {/* Subtitle */}
      <p
        style={{
          ...type.h3,
          color: '#86868B',
          margin: 0,
          marginTop: 16,
          ...fadeUp(12),
        }}
      >
        Professional video, powered by code
      </p>

      {/* Body */}
      <p
        style={{
          ...type.body,
          color: '#86868B',
          margin: 0,
          marginTop: 48,
          maxWidth: 700,
          ...fadeUp(20),
        }}
      >
        Build stunning video compositions with TypeScript. Use the same
        design system for every project. Ship faster.
      </p>

      {/* Code sample */}
      <div
        style={{
          marginTop: 40,
          backgroundColor: '#16161F',
          borderRadius: 12,
          padding: 24,
          ...fadeUp(28),
        }}
      >
        <code style={{ ...type.code, color: '#0A84FF' }}>
          {'npx create-video@latest my-reel'}
        </code>
      </div>
    </AbsoluteFill>
  );
};
```

---

## Text Anti-Patterns

| Anti-Pattern | Rule |
|---|---|
| Font size under 16px | Unreadable on most screens at viewing distance |
| More than 2 typefaces | Use one family (Inter) with weight variation |
| No letter-spacing on caps | Always add 0.05em+ to uppercase text |
| Body text with lineHeight 1.0 | Minimum 1.4 for body in video |
| Centered body paragraphs | Left-align paragraphs longer than 2 lines |
| Justified text | Never justify in video -- ragged right is always better |
| Text without color contrast | Minimum 4.5:1 contrast ratio |
