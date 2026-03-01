---
name: color-system
description: Color palettes, gradients, semantic colors for professional video production
metadata:
  tags: color, palette, gradient, theme, dark-mode, light-mode
---

# Color System

Color is the fastest way to establish mood and professionalism. Reel provides six curated palettes, each tested for video production contrast ratios, gradient compatibility, and emotional tone.

---

## Palette Architecture

Every palette follows the same structure:

```ts
interface ColorPalette {
  bg: string;        // Full-frame background
  surface: string;   // Cards, panels, elevated surfaces
  text: string;      // Primary text (high contrast against bg)
  muted: string;     // Secondary text, labels, captions
  accent: string;    // Primary interactive/highlight color
  secondary: string; // Supporting accent for gradients, badges
  gradient: string;  // Recommended CSS gradient string
}
```

---

## 1. Midnight (Dark Professional)

The default. Trusted by tech companies, SaaS products, and anyone who wants to look serious. Works for keynotes, product launches, and corporate presentations.

```ts
const midnight: ColorPalette = {
  bg: '#0A0A0F',
  surface: '#16161F',
  text: '#F5F5F7',
  muted: '#86868B',
  accent: '#0A84FF',
  secondary: '#5E5CE6',
  gradient: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
};
```

**Usage guidance**: Technology, SaaS, fintech, product demos, corporate videos. The safe choice -- always looks professional.

**Recommended gradients**:
- Primary: `linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)`
- Subtle bg: `linear-gradient(180deg, #0A0A0F 0%, #16161F 100%)`
- Accent glow: `radial-gradient(ellipse at center, rgba(10, 132, 255, 0.15) 0%, transparent 70%)`

---

## 2. Dawn (Warm Light)

A warm, inviting light theme. Works for lifestyle brands, food content, wellness, and anything that needs to feel approachable and optimistic.

```ts
const dawn: ColorPalette = {
  bg: '#FAFAF5',
  surface: '#FFFFFF',
  text: '#1D1D1F',
  muted: '#86868B',
  accent: '#FF6B35',
  secondary: '#FF9F1C',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)',
};
```

**Usage guidance**: Lifestyle, food, wellness, education, warm brand storytelling. Pairs well with photography-heavy compositions.

**Recommended gradients**:
- Primary: `linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)`
- Warm bg: `linear-gradient(180deg, #FAFAF5 0%, #FFF5EB 100%)`
- Sunset: `linear-gradient(135deg, #FF6B35 0%, #E84393 100%)`

---

## 3. Ocean (Cool Tones)

Deep, calming blues and teals. Works for environmental content, data visualization, healthcare, and anything that should feel trustworthy and expansive.

```ts
const ocean: ColorPalette = {
  bg: '#0D1B2A',
  surface: '#1B2838',
  text: '#E0E1DD',
  muted: '#778DA9',
  accent: '#00D4AA',
  secondary: '#0077B6',
  gradient: 'linear-gradient(135deg, #00D4AA 0%, #0077B6 100%)',
};
```

**Usage guidance**: Environmental, data/analytics, healthcare, finance dashboards, trust-building content.

**Recommended gradients**:
- Primary: `linear-gradient(135deg, #00D4AA 0%, #0077B6 100%)`
- Deep sea: `linear-gradient(180deg, #0D1B2A 0%, #1B3A4B 100%)`
- Bioluminescent: `radial-gradient(ellipse at bottom, rgba(0, 212, 170, 0.2) 0%, transparent 60%)`

---

## 4. Blossom (Rose Gold)

Bold pinks and purples on a deep navy canvas. Works for fashion, beauty, creative agencies, and entertainment content.

```ts
const blossom: ColorPalette = {
  bg: '#1A1A2E',
  surface: '#25253E',
  text: '#EAEAEA',
  muted: '#A0A0B0',
  accent: '#E84393',
  secondary: '#FD79A8',
  gradient: 'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)',
};
```

**Usage guidance**: Fashion, beauty, music, entertainment, creative portfolios, event promotion.

**Recommended gradients**:
- Primary: `linear-gradient(135deg, #E84393 0%, #FD79A8 100%)`
- Dusk: `linear-gradient(180deg, #1A1A2E 0%, #2D1B3D 100%)`
- Neon bloom: `radial-gradient(ellipse at center, rgba(232, 67, 147, 0.2) 0%, transparent 60%)`

---

## 5. Mono (Pure B&W)

Maximum contrast, zero distraction. Works for editorial content, typography-focused pieces, high-end brand videos, and when the content itself provides all the color.

```ts
const mono: ColorPalette = {
  bg: '#000000',
  surface: '#111111',
  text: '#FFFFFF',
  muted: '#666666',
  accent: '#FFFFFF',
  secondary: '#999999',
  gradient: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
};
```

**Usage guidance**: Editorial, typography-heavy content, luxury brands, black-and-white photography, minimalist aesthetics.

**Recommended gradients**:
- Subtle depth: `linear-gradient(180deg, #000000 0%, #111111 100%)`
- Spotlight: `radial-gradient(ellipse at center, #1A1A1A 0%, #000000 70%)`
- Film grain feel: combine with noise texture overlay

---

## 6. Aurora (Gradient-Rich)

Vibrant purples and cyans for content that needs energy without chaos. Works for AI/ML, gaming, developer content, and creative tech.

```ts
const aurora: ColorPalette = {
  bg: '#0F0C29',
  surface: '#1A1640',
  text: '#F0F0F0',
  muted: '#8B8BA3',
  accent: '#A855F7',
  secondary: '#06B6D4',
  gradient: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
};
```

**Usage guidance**: AI/ML, developer tools, gaming, creative technology, startup launches, anything that should feel futuristic.

**Recommended gradients**:
- Primary: `linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)`
- Deep cosmos: `linear-gradient(180deg, #0F0C29 0%, #1A1640 50%, #302B63 100%)`
- Nebula: `radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.3) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)`

---

## Complete Palettes Object

Use this in your compositions:

```ts
export const palettes = {
  midnight: {
    bg: '#0A0A0F',
    surface: '#16161F',
    text: '#F5F5F7',
    muted: '#86868B',
    accent: '#0A84FF',
    secondary: '#5E5CE6',
    gradient: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
  },
  dawn: {
    bg: '#FAFAF5',
    surface: '#FFFFFF',
    text: '#1D1D1F',
    muted: '#86868B',
    accent: '#FF6B35',
    secondary: '#FF9F1C',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)',
  },
  ocean: {
    bg: '#0D1B2A',
    surface: '#1B2838',
    text: '#E0E1DD',
    muted: '#778DA9',
    accent: '#00D4AA',
    secondary: '#0077B6',
    gradient: 'linear-gradient(135deg, #00D4AA 0%, #0077B6 100%)',
  },
  blossom: {
    bg: '#1A1A2E',
    surface: '#25253E',
    text: '#EAEAEA',
    muted: '#A0A0B0',
    accent: '#E84393',
    secondary: '#FD79A8',
    gradient: 'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)',
  },
  mono: {
    bg: '#000000',
    surface: '#111111',
    text: '#FFFFFF',
    muted: '#666666',
    accent: '#FFFFFF',
    secondary: '#999999',
    gradient: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
  },
  aurora: {
    bg: '#0F0C29',
    surface: '#1A1640',
    text: '#F0F0F0',
    muted: '#8B8BA3',
    accent: '#A855F7',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
  },
} as const;

export type PaletteName = keyof typeof palettes;
```

---

## Semantic Colors

These are universal across all palettes:

```ts
export const semantic = {
  success: '#34C759',
  warning: '#FF9F0A',
  error: '#FF3B30',
  info: '#0A84FF',
} as const;
```

Use semantic colors sparingly and for their intended meaning:
- **success**: completion indicators, positive metrics, checkmarks
- **warning**: caution states, attention-needed indicators
- **error**: error states, negative metrics, alerts
- **info**: informational callouts, links, interactive elements

---

## Gradient Patterns

### Linear Gradients

```ts
// Standard diagonal -- most versatile
const diagonal = 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)';

// Top-to-bottom -- subtle background depth
const vertical = 'linear-gradient(180deg, #0A0A0F 0%, #16161F 100%)';

// Left-to-right -- horizontal progress/flow
const horizontal = 'linear-gradient(90deg, #0A84FF 0%, #5E5CE6 100%)';
```

### Radial Gradients

```ts
// Centered glow -- spotlight effect
const spotlight = 'radial-gradient(ellipse at center, rgba(10, 132, 255, 0.15) 0%, transparent 70%)';

// Bottom glow -- ground lighting
const groundGlow = 'radial-gradient(ellipse at bottom, rgba(10, 132, 255, 0.2) 0%, transparent 60%)';

// Corner accent -- subtle directional light
const cornerLight = 'radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.2) 0%, transparent 50%)';
```

### Gradient Text

```tsx
// Gradient text effect
const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    {children}
  </span>
);
```

---

## Opacity Rules

### Overlays
```ts
// Dark overlay on images/video -- legible text
const darkOverlay = 'rgba(0, 0, 0, 0.6)';   // minimum for text legibility
const heavyOverlay = 'rgba(0, 0, 0, 0.8)';   // strong dimming

// Light overlay
const lightOverlay = 'rgba(255, 255, 255, 0.6)';
```

### Glass Effects
```ts
// Frosted glass backgrounds
const lightGlass = 'rgba(255, 255, 255, 0.1)';   // subtle, dark bg
const mediumGlass = 'rgba(255, 255, 255, 0.15)';  // cards on dark bg
const darkGlass = 'rgba(0, 0, 0, 0.3)';           // dark glass card
const coloredGlass = 'rgba(10, 132, 255, 0.1)';   // accent-tinted glass
```

### Borders
```ts
// Subtle borders for glass elements
const subtleBorder = 'rgba(255, 255, 255, 0.1)';
const visibleBorder = 'rgba(255, 255, 255, 0.2)';
const accentBorder = 'rgba(10, 132, 255, 0.3)';
```

---

## Usage Example: Themed Composition

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const palettes = {
  midnight: {
    bg: '#0A0A0F', surface: '#16161F', text: '#F5F5F7',
    muted: '#86868B', accent: '#0A84FF', secondary: '#5E5CE6',
    gradient: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
  },
  // ... other palettes
} as const;

type PaletteName = keyof typeof palettes;

interface ThemedCardProps {
  palette: PaletteName;
  title: string;
  subtitle: string;
}

const ThemedCard: React.FC<ThemedCardProps> = ({ palette: paletteName, title, subtitle }) => {
  const frame = useCurrentFrame();
  const colors = palettes[paletteName];

  const cardSpring = spring({ frame, fps: 30, config: { damping: 200 } });
  const cardY = interpolate(cardSpring, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Subtle radial glow behind the card */}
      <div
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          background: `radial-gradient(ellipse at center, ${colors.accent}15 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 64,
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          maxWidth: 600,
          opacity: cardSpring,
          transform: `translateY(${cardY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 24,
            color: colors.muted,
            margin: 0,
            marginTop: 16,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
        <div
          style={{
            marginTop: 32,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            width: 80,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
```

---

## Quick Reference

| Token | Midnight | Dawn | Ocean | Blossom | Mono | Aurora |
|-------|----------|------|-------|---------|------|--------|
| bg | `#0A0A0F` | `#FAFAF5` | `#0D1B2A` | `#1A1A2E` | `#000000` | `#0F0C29` |
| surface | `#16161F` | `#FFFFFF` | `#1B2838` | `#25253E` | `#111111` | `#1A1640` |
| text | `#F5F5F7` | `#1D1D1F` | `#E0E1DD` | `#EAEAEA` | `#FFFFFF` | `#F0F0F0` |
| muted | `#86868B` | `#86868B` | `#778DA9` | `#A0A0B0` | `#666666` | `#8B8BA3` |
| accent | `#0A84FF` | `#FF6B35` | `#00D4AA` | `#E84393` | `#FFFFFF` | `#A855F7` |
| secondary | `#5E5CE6` | `#FF9F1C` | `#0077B6` | `#FD79A8` | `#999999` | `#06B6D4` |
