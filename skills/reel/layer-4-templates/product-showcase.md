---
name: product-showcase
description: Template for feature highlights and product demonstrations with glassmorphism cards, animated counters, gradient text, and staggered entrance animations
metadata:
  tags: product, showcase, feature, demo, launch, saas, marketing
---

# Product Showcase Template

A polished template for product launches, feature highlights, and marketing demos. Uses the warm Dawn palette with glassmorphism cards, animated stat counters, gradient text headlines, and smooth staggered animations. Ideal for SaaS products, app launches, and feature walkthroughs.

---

## Storyboard

| Scene | Frames | Duration | Description |
|-------|--------|----------|-------------|
| 1 - Hero Shot | 0-224 | 7.5s | Product name and tagline centered on warm gradient backdrop. Gradient text for the product name fades up, tagline follows, and a subtle glow radiates from behind. |
| 2 - Feature 1 | 225-449 | 7.5s | Left-aligned layout. Icon slides in from left, feature title fades up, description text follows. Glassmorphism card holds the content. |
| 3 - Feature 2 | 450-674 | 7.5s | Right-aligned layout (mirrored). Feature card on the right side for visual variety. Different icon and content. |
| 4 - Feature 3 | 675-899 | 7.5s | Centered layout. Full-width glass card with icon above, title, and description. Creates a visual break from the alternating pattern. |
| 5 - Stats / Social Proof | 900-1124 | 7.5s | Three stat counters animate from 0 to their target values. Each counter has a label below it. Numbers use the display type scale for maximum impact. |
| 6 - CTA | 1125-1349 | 7.5s | Gradient background fills the frame. CTA text scales in with bouncy spring. A gradient button pulses with a glow effect. Tagline fades up below. |

---

## Design Tokens

### Colors (Dawn Palette)

Reference: `layer-3-design/color.md` - Dawn palette

```ts
const colors = {
  bg: '#FAFAF5',
  surface: '#FFFFFF',
  text: '#1D1D1F',
  muted: '#86868B',
  accent: '#FF6B35',
  secondary: '#FF9F1C',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)',
};
```

Glass effect tokens:

```ts
const glass = {
  background: 'rgba(255, 255, 255, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
};
```

### Typography

Reference: `layer-3-design/typography.md`

- **Display / Product Name**: Inter 800, 88px, letterSpacing `-0.02em`, lineHeight 1.1
- **Section Titles**: Inter 700, 44px, letterSpacing `-0.01em`, lineHeight 1.3
- **Body**: Inter 400, 26px, lineHeight 1.5
- **Stat Numbers**: Inter 800, 88px (display scale)
- **Labels**: Inter 600, 14px, uppercase, letterSpacing `0.05em`

### Spacing

Reference: `layer-3-design/spacing-layout.md`

- Canvas: 1920x1080 (landscape)
- Safe zone padding: 96px horizontal, 54px vertical
- Card padding: 48px (xl)
- Section spacing: 64px (xxl)
- Element gap: 24px (md)

### Motion

Reference: `layer-3-design/motion-language.md`

- **Content entrances**: `smooth` spring (`{ damping: 200 }`)
- **Background elements**: `gentle` spring (`{ mass: 1, damping: 15, stiffness: 100 }`)
- **CTA button**: `bouncy` spring (`{ mass: 1, damping: 10, stiffness: 200 }`)
- **Stagger delay**: 4 frames between elements
- **Counter animation**: `interpolate` with `[0, 60]` frame range for smooth counting

---

## Full Composition TSX

```tsx
import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// ---------------------------------------------------------------------------
// Font loading
// ---------------------------------------------------------------------------
const { fontFamily } = loadFont();

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const colors = {
  bg: '#FAFAF5',
  surface: '#FFFFFF',
  text: '#1D1D1F',
  muted: '#86868B',
  accent: '#FF6B35',
  secondary: '#FF9F1C',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)',
  warmBg: 'linear-gradient(180deg, #FAFAF5 0%, #FFF5EB 100%)',
};

const springPresets = {
  gentle: { mass: 1, damping: 15, stiffness: 100 },
  smooth: { damping: 200 },
  snappy: { mass: 1, damping: 20, stiffness: 300 },
  bouncy: { mass: 1, damping: 10, stiffness: 200 },
  heavy: { mass: 3, damping: 25, stiffness: 150 },
} as const;

const STAGGER = 4;

// ---------------------------------------------------------------------------
// Content configuration - EDIT THESE to customise
// ---------------------------------------------------------------------------
const CONTENT = {
  productName: 'FlowBoard',
  tagline: 'Project management that flows with your team.',
  features: [
    {
      icon: '\u26A1',
      title: 'Blazing Fast Workflows',
      description:
        'Automate repetitive tasks and let your team focus on what matters. Setup takes minutes, not days.',
    },
    {
      icon: '\uD83D\uDD12',
      title: 'Enterprise-Grade Security',
      description:
        'SOC 2 compliant with end-to-end encryption. Your data stays yours, always.',
    },
    {
      icon: '\uD83C\uDF0D',
      title: 'Built for Global Teams',
      description:
        'Real-time collaboration across time zones with smart notifications that respect your focus time.',
    },
  ],
  stats: [
    { value: 50000, suffix: '+', label: 'Active Teams' },
    { value: 99.9, suffix: '%', label: 'Uptime SLA' },
    { value: 4.9, suffix: '/5', label: 'User Rating' },
  ],
  ctaText: 'Start Free Trial',
  ctaSubtext: 'No credit card required',
};

// ---------------------------------------------------------------------------
// Utility: reusable fade-up
// ---------------------------------------------------------------------------
const useFadeUp = (delay: number, preset: keyof typeof springPresets = 'smooth') => {
  const frame = useCurrentFrame();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: springPresets[preset],
  });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
  };
};

// ---------------------------------------------------------------------------
// Shared: Glass Card
// ---------------------------------------------------------------------------
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style = {} }) => (
  <div
    style={{
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 24,
      padding: 48,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Shared: Gradient Text
// ---------------------------------------------------------------------------
const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style = {} }) => (
  <span
    style={{
      background: colors.gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      ...style,
    }}
  >
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// Scene 1: Hero Shot
// ---------------------------------------------------------------------------
const HeroShot: React.FC = () => {
  const frame = useCurrentFrame();

  const glowProgress = spring({
    frame,
    fps: 30,
    config: springPresets.gentle,
  });
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.2]);

  const nameAnim = useFadeUp(0);
  const taglineAnim = useFadeUp(10);
  const barAnim = useFadeUp(20);

  return (
    <AbsoluteFill
      style={{
        background: colors.warmBg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Warm radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 107, 53, ${glowOpacity}) 0%, transparent 70%)`,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1, padding: 96 }}>
        {/* Product name with gradient text */}
        <h1
          style={{
            fontFamily,
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            ...nameAnim,
          }}
        >
          <GradientText>{CONTENT.productName}</GradientText>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily,
            fontSize: 34,
            fontWeight: 400,
            color: colors.muted,
            lineHeight: 1.3,
            margin: 0,
            marginTop: 24,
            maxWidth: 700,
            ...taglineAnim,
          }}
        >
          {CONTENT.tagline}
        </p>

        {/* Accent bar */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            margin: '40px auto 0',
            ...barAnim,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: Feature 1 (Left Layout)
// ---------------------------------------------------------------------------
const Feature1: React.FC = () => {
  const frame = useCurrentFrame();
  const feature = CONTENT.features[0];

  const iconProgress = spring({
    frame,
    fps: 30,
    config: springPresets.smooth,
  });
  const iconX = interpolate(iconProgress, [0, 1], [-60, 0]);

  const titleAnim = useFadeUp(8);
  const descAnim = useFadeUp(16);

  return (
    <AbsoluteFill
      style={{
        background: colors.warmBg,
        padding: 96,
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
        {/* Left: Feature card */}
        <GlassCard style={{ flex: 1, maxWidth: 800 }}>
          {/* Icon */}
          <div
            style={{
              fontSize: 56,
              opacity: iconProgress,
              transform: `translateX(${iconX}px)`,
              marginBottom: 24,
            }}
          >
            {feature.icon}
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily,
              fontSize: 44,
              fontWeight: 700,
              color: colors.text,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              margin: 0,
              ...titleAnim,
            }}
          >
            {feature.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily,
              fontSize: 26,
              fontWeight: 400,
              color: colors.muted,
              lineHeight: 1.5,
              margin: 0,
              marginTop: 16,
              maxWidth: 550,
              ...descAnim,
            }}
          >
            {feature.description}
          </p>
        </GlassCard>

        {/* Right: Decorative element */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: 48,
              background: colors.gradient,
              opacity: interpolate(iconProgress, [0, 1], [0, 0.15]),
              transform: `scale(${interpolate(iconProgress, [0, 1], [0.8, 1])})`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Feature 2 (Right Layout)
// ---------------------------------------------------------------------------
const Feature2: React.FC = () => {
  const frame = useCurrentFrame();
  const feature = CONTENT.features[1];

  const iconProgress = spring({
    frame,
    fps: 30,
    config: springPresets.smooth,
  });
  const iconX = interpolate(iconProgress, [0, 1], [60, 0]);

  const titleAnim = useFadeUp(8);
  const descAnim = useFadeUp(16);

  return (
    <AbsoluteFill
      style={{
        background: colors.warmBg,
        padding: 96,
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
        {/* Left: Decorative element */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF9F1C 0%, #FF6B35 100%)',
              opacity: interpolate(iconProgress, [0, 1], [0, 0.15]),
              transform: `scale(${interpolate(iconProgress, [0, 1], [0.8, 1])})`,
            }}
          />
        </div>

        {/* Right: Feature card */}
        <GlassCard style={{ flex: 1, maxWidth: 800 }}>
          <div
            style={{
              fontSize: 56,
              opacity: iconProgress,
              transform: `translateX(${iconX}px)`,
              marginBottom: 24,
            }}
          >
            {feature.icon}
          </div>
          <h2
            style={{
              fontFamily,
              fontSize: 44,
              fontWeight: 700,
              color: colors.text,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              margin: 0,
              ...titleAnim,
            }}
          >
            {feature.title}
          </h2>
          <p
            style={{
              fontFamily,
              fontSize: 26,
              fontWeight: 400,
              color: colors.muted,
              lineHeight: 1.5,
              margin: 0,
              marginTop: 16,
              maxWidth: 550,
              ...descAnim,
            }}
          >
            {feature.description}
          </p>
        </GlassCard>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Feature 3 (Centered Layout)
// ---------------------------------------------------------------------------
const Feature3: React.FC = () => {
  const feature = CONTENT.features[2];

  const iconAnim = useFadeUp(0);
  const titleAnim = useFadeUp(8);
  const descAnim = useFadeUp(16);

  return (
    <AbsoluteFill
      style={{
        background: colors.warmBg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      <GlassCard style={{ maxWidth: 900, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24, ...iconAnim }}>
          {feature.icon}
        </div>
        <h2
          style={{
            fontFamily,
            fontSize: 44,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            margin: 0,
            ...titleAnim,
          }}
        >
          {feature.title}
        </h2>
        <p
          style={{
            fontFamily,
            fontSize: 26,
            fontWeight: 400,
            color: colors.muted,
            lineHeight: 1.5,
            margin: 0,
            marginTop: 16,
            maxWidth: 650,
            marginLeft: 'auto',
            marginRight: 'auto',
            ...descAnim,
          }}
        >
          {feature.description}
        </p>
      </GlassCard>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Stats / Social Proof
// ---------------------------------------------------------------------------
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const COUNTER_DURATION = 60; // frames to count from 0 to target

  return (
    <AbsoluteFill
      style={{
        background: colors.warmBg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      {/* Section label */}
      <p
        style={{
          fontFamily,
          fontSize: 14,
          fontWeight: 600,
          color: colors.accent,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
          margin: 0,
          marginBottom: 64,
          ...useFadeUp(0),
        }}
      >
        Trusted by thousands
      </p>

      <div style={{ display: 'flex', gap: 80, justifyContent: 'center' }}>
        {CONTENT.stats.map((stat, index) => {
          const delay = 8 + index * STAGGER * 2;
          const cardProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: springPresets.smooth,
          });
          const cardY = interpolate(cardProgress, [0, 1], [40, 0]);

          // Counter animation
          const counterFrame = Math.max(0, frame - delay - 10);
          const counterProgress = Math.min(1, counterFrame / COUNTER_DURATION);
          // Ease-out for deceleration effect
          const easedProgress = 1 - Math.pow(1 - counterProgress, 3);
          const currentValue = stat.value * easedProgress;

          // Format: integers show no decimal, floats show one decimal
          const displayValue =
            stat.value % 1 === 0
              ? Math.round(currentValue).toLocaleString()
              : currentValue.toFixed(1);

          return (
            <div
              key={index}
              style={{
                textAlign: 'center',
                opacity: cardProgress,
                transform: `translateY(${cardY}px)`,
              }}
            >
              <p
                style={{
                  fontFamily,
                  fontSize: 88,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                <GradientText>
                  {displayValue}
                  {stat.suffix}
                </GradientText>
              </p>
              <p
                style={{
                  fontFamily,
                  fontSize: 22,
                  fontWeight: 500,
                  color: colors.muted,
                  margin: 0,
                  marginTop: 12,
                }}
              >
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: CTA
// ---------------------------------------------------------------------------
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgProgress = spring({
    frame,
    fps,
    config: springPresets.gentle,
  });

  const ctaProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: springPresets.bouncy,
  });
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.8, 1]);

  // Glow pulse on the CTA button
  const glowSize = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [20, 40]
  );
  const glowOpacity = interpolate(ctaProgress, [0, 1], [0, 0.4]);

  const subAnim = useFadeUp(24);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, rgba(255, 107, 53, ${interpolate(bgProgress, [0, 1], [0, 0.08])}) 0%, rgba(255, 159, 28, ${interpolate(bgProgress, [0, 1], [0, 0.06])}) 100%)`,
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Product name */}
        <h1
          style={{
            fontFamily,
            fontSize: 60,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: 48,
            ...useFadeUp(0),
          }}
        >
          Ready to try{' '}
          <GradientText>{CONTENT.productName}</GradientText>?
        </h1>

        {/* CTA Button */}
        <div
          style={{
            display: 'inline-block',
            padding: '20px 64px',
            background: colors.gradient,
            borderRadius: 16,
            opacity: ctaProgress,
            transform: `scale(${ctaScale})`,
            boxShadow: `0 0 ${glowSize}px rgba(255, 107, 53, ${glowOpacity})`,
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: 28,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            {CONTENT.ctaText}
          </span>
        </div>

        {/* Subtext */}
        <p
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 400,
            color: colors.muted,
            marginTop: 24,
            ...subAnim,
          }}
        >
          {CONTENT.ctaSubtext}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------
export const ProductShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Sequence from={0} durationInFrames={225} name="Hero Shot">
        <HeroShot />
      </Sequence>

      <Sequence from={225} durationInFrames={225} name="Feature 1">
        <Feature1 />
      </Sequence>

      <Sequence from={450} durationInFrames={225} name="Feature 2">
        <Feature2 />
      </Sequence>

      <Sequence from={675} durationInFrames={225} name="Feature 3">
        <Feature3 />
      </Sequence>

      <Sequence from={900} durationInFrames={225} name="Stats">
        <StatsScene />
      </Sequence>

      <Sequence from={1125} durationInFrames={225} name="CTA">
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Remotion registration
// ---------------------------------------------------------------------------
export const ProductShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="ProductShowcase"
      component={ProductShowcase}
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

---

## Customization Guide

### Changing the product

Edit the `CONTENT` object:

| Field | What to change |
|-------|---------------|
| `CONTENT.productName` | Your product or brand name |
| `CONTENT.tagline` | One-line value proposition |
| `CONTENT.features[n].icon` | Emoji or unicode icon for each feature |
| `CONTENT.features[n].title` | Feature heading (keep under 5 words) |
| `CONTENT.features[n].description` | Feature description (1-2 sentences) |
| `CONTENT.stats[n].value` | Numeric value (integers or floats) |
| `CONTENT.stats[n].suffix` | Text after number (e.g., "+", "%", "/5") |
| `CONTENT.stats[n].label` | Label below the stat |
| `CONTENT.ctaText` | Button label |
| `CONTENT.ctaSubtext` | Small text below CTA button |

### Changing the color palette

Replace the `colors` object with any palette from `layer-3-design/color.md`. For a dark tech look, use Midnight:

```ts
const colors = {
  bg: '#0A0A0F',
  surface: '#16161F',
  text: '#F5F5F7',
  muted: '#86868B',
  accent: '#0A84FF',
  secondary: '#5E5CE6',
  gradient: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
  warmBg: 'linear-gradient(180deg, #0A0A0F 0%, #16161F 100%)',
};
```

When switching to a dark palette, update the `GlassCard` background:

```ts
backgroundColor: 'rgba(255, 255, 255, 0.08)', // lighter glass on dark bg
border: '1px solid rgba(255, 255, 255, 0.12)',
```

### Adjusting the glass effect

The `GlassCard` component uses `backdropFilter: 'blur(20px)'`. Adjust the blur radius to control frosting intensity:
- `blur(10px)` - subtle frosting
- `blur(20px)` - standard glass effect
- `blur(40px)` - heavy frosting

### Changing stat counter speed

The `COUNTER_DURATION` constant controls how many frames the counter takes to reach its target. At 30fps:
- 30 frames = 1 second (fast)
- 60 frames = 2 seconds (default)
- 90 frames = 3 seconds (slow, dramatic)

### Adding or removing features

The template supports any number of features. To add a fourth feature:
1. Add a new entry to `CONTENT.features`
2. Create a new `Feature4` component following the existing patterns
3. Add a new `<Sequence>` in the main composition
4. Adjust `from` values and total `durationInFrames` accordingly

### Scene timing

Each scene is 225 frames (7.5 seconds). To adjust:
- Update `durationInFrames` on each `<Sequence>`
- Update `from` values so scenes are contiguous
- Update total `durationInFrames` in `<Composition>` to match the sum

### Spring presets

All spring presets reference `layer-3-design/motion-language.md`:
- `smooth` - default for all content (no bounce)
- `gentle` - background glows, ambient elements
- `bouncy` - CTA buttons, playful interactions
- `snappy` - quick state changes
- `heavy` - dramatic number reveals
