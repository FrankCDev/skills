---
name: social-short
description: Vertical 9:16 template for TikTok, Instagram Reels, and YouTube Shorts with bold text, gradient backgrounds, and fast-paced scene timing
metadata:
  tags: social, short, tiktok, reels, shorts, vertical, 9x16, hook
---

# Social Short Template

A fast-paced vertical template optimized for TikTok, Instagram Reels, and YouTube Shorts. Uses the vibrant Aurora palette with bold impact text, gradient backgrounds, and snappy animations. Designed for 9:16 (1080x1920) with safe zone compliance for platform UI overlays.

---

## Storyboard

| Scene | Frames | Duration | Description |
|-------|--------|----------|-------------|
| 1 - Hook | 0-149 | 5s | Bold hook text slams in with scale + opacity impact animation. Full-bleed gradient background. Text centered in the safe zone. This is the attention-grabber. |
| 2 - Point 1 | 150-299 | 5s | First talking point slides in from the left with an icon. Text fades up with stagger. Clean layout with icon on top, text below. |
| 3 - Point 2 | 300-449 | 5s | Second point slides in from the right (mirrored direction for variety). Different icon and content. |
| 4 - Point 3 | 450-599 | 5s | Third point fades up from bottom with a scale-in icon. Different animation for visual rhythm. |
| 5 - Reveal / Punchline | 600-749 | 5s | Punchline text zooms in with elastic spring for maximum impact. Background shifts to a brighter gradient. Large text dominates the frame. |
| 6 - CTA | 750-899 | 5s | "Follow for more" text fades up. Handle/username animates in below with bouncy spring. Subtle gradient background pulsation. |

---

## Design Tokens

### Colors (Aurora Palette)

Reference: `layer-3-design/color.md` - Aurora palette

```ts
const colors = {
  bg: '#0F0C29',
  surface: '#1A1640',
  text: '#F0F0F0',
  muted: '#8B8BA3',
  accent: '#A855F7',
  secondary: '#06B6D4',
  gradient: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
};
```

Background gradients for scene variety:

```ts
const backgrounds = {
  scene1: 'linear-gradient(180deg, #0F0C29 0%, #1A1640 50%, #302B63 100%)',
  scene2: 'linear-gradient(180deg, #0F0C29 0%, #1A1640 100%)',
  scene3: 'linear-gradient(180deg, #1A1640 0%, #0F0C29 100%)',
  scene4: 'linear-gradient(180deg, #0F0C29 0%, #1A1640 100%)',
  scene5: 'linear-gradient(135deg, #302B63 0%, #24243E 50%, #0F0C29 100%)',
  scene6: 'linear-gradient(180deg, #0F0C29 0%, #1A1640 100%)',
};
```

### Typography

Reference: `layer-3-design/typography.md`

- **Hook Text**: Inter 800, 72px, letterSpacing `-0.02em`, lineHeight 1.1 (bold and large for vertical format)
- **Point Titles**: Inter 700, 48px, letterSpacing `-0.01em`, lineHeight 1.2
- **Body**: Inter 400, 28px, lineHeight 1.5
- **Punchline**: Inter 800, 80px, letterSpacing `-0.02em`, lineHeight 1.1
- **CTA**: Inter 700, 40px
- **Handle**: Inter 600, 32px
- **Labels**: Inter 600, 16px, uppercase, letterSpacing `0.05em`

### Spacing & Safe Zones

Reference: `layer-3-design/spacing-layout.md` - Portrait safe zones

```ts
const safeZone = {
  // 9:16 Portrait (1080x1920)
  paddingX: 54,    // 5% of 1080
  paddingY: 96,    // 5% of 1920
  // TikTok-specific safe zones
  topUnsafe: 288,  // top 15% reserved for platform UI
  bottomUnsafe: 384, // bottom 20% reserved for caption/buttons
  // Effective content area
  contentTop: 288,
  contentBottom: 1536, // 1920 - 384
  contentHeight: 1248,  // 1536 - 288
};
```

- Canvas: 1080x1920 (9:16 vertical)
- Horizontal padding: 54px
- Content centered between `topUnsafe` and `bottomUnsafe`
- All critical text stays within the 65% middle zone

### Motion

Reference: `layer-3-design/motion-language.md`

- **Hook text**: `snappy` spring (`{ mass: 1, damping: 20, stiffness: 300 }`) with scale impact
- **Icon entrances**: `bouncy` spring (`{ mass: 1, damping: 10, stiffness: 200 }`)
- **Punchline**: `elastic` spring (`{ mass: 1, damping: 8, stiffness: 150 }`) for maximum drama
- **Point text**: `smooth` spring (`{ damping: 200 }`)
- **CTA**: `bouncy` spring
- **Stagger delay**: 4 frames

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
  bg: '#0F0C29',
  surface: '#1A1640',
  text: '#F0F0F0',
  muted: '#8B8BA3',
  accent: '#A855F7',
  secondary: '#06B6D4',
  gradient: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
};

const backgrounds = {
  cosmos: 'linear-gradient(180deg, #0F0C29 0%, #1A1640 50%, #302B63 100%)',
  deep: 'linear-gradient(180deg, #0F0C29 0%, #1A1640 100%)',
  reverse: 'linear-gradient(180deg, #1A1640 0%, #0F0C29 100%)',
  bright: 'linear-gradient(135deg, #302B63 0%, #24243E 50%, #0F0C29 100%)',
};

const springPresets = {
  gentle: { mass: 1, damping: 15, stiffness: 100 },
  smooth: { damping: 200 },
  snappy: { mass: 1, damping: 20, stiffness: 300 },
  bouncy: { mass: 1, damping: 10, stiffness: 200 },
  heavy: { mass: 3, damping: 25, stiffness: 150 },
  elastic: { mass: 1, damping: 8, stiffness: 150 },
} as const;

const STAGGER = 4;

// Safe zones for TikTok/Reels/Shorts
const SAFE = {
  paddingX: 54,
  topUnsafe: 288,     // top 15%
  bottomUnsafe: 384,   // bottom 20%
  contentTop: 288,
  contentBottom: 1536,
};

// ---------------------------------------------------------------------------
// Content configuration - EDIT THESE to customise
// ---------------------------------------------------------------------------
const CONTENT = {
  hook: '5 Things Every\nDeveloper Should\nKnow in 2025',
  points: [
    { icon: '\uD83D\uDE80', title: 'AI-Assisted Coding', body: 'Copilot and Claude Code are changing how we write software.' },
    { icon: '\u26A1', title: 'Edge Computing', body: 'Deploy closer to your users for sub-50ms response times.' },
    { icon: '\uD83D\uDD12', title: 'Zero Trust Security', body: 'Never trust, always verify. Every request is authenticated.' },
  ],
  punchline: 'The future is\nalready here.',
  cta: 'Follow for more',
  handle: '@yourhandle',
};

// ---------------------------------------------------------------------------
// Utility: fade-up animation
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
// Shared: Safe content wrapper
// ---------------------------------------------------------------------------
const SafeContent: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style = {} }) => (
  <div
    style={{
      position: 'absolute',
      top: SAFE.contentTop,
      bottom: 1920 - SAFE.contentBottom,
      left: SAFE.paddingX,
      right: SAFE.paddingX,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Shared: Gradient text for Aurora
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
// Scene 1: Hook
// ---------------------------------------------------------------------------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Impact entrance: scale from large + fade in
  const impactProgress = spring({
    frame,
    fps,
    config: springPresets.snappy,
  });
  const scale = interpolate(impactProgress, [0, 1], [1.3, 1]);
  const opacity = impactProgress;

  // Nebula glow behind text
  const glowProgress = spring({
    frame,
    fps,
    config: springPresets.gentle,
  });
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.3]);

  return (
    <AbsoluteFill style={{ background: backgrounds.cosmos }}>
      {/* Nebula glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(168, 85, 247, ${glowOpacity}) 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(6, 182, 212, ${glowOpacity * 0.7}) 0%, transparent 60%)`,
        }}
      />

      <SafeContent>
        <h1
          style={{
            fontFamily,
            fontSize: 72,
            fontWeight: 800,
            color: colors.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            margin: 0,
            whiteSpace: 'pre-line',
            opacity,
            transform: `scale(${scale})`,
          }}
        >
          {CONTENT.hook}
        </h1>
      </SafeContent>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: Point 1 (Slide from Left)
// ---------------------------------------------------------------------------
const Point1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const point = CONTENT.points[0];

  const iconProgress = spring({
    frame,
    fps,
    config: springPresets.bouncy,
  });
  const iconX = interpolate(iconProgress, [0, 1], [-120, 0]);
  const iconScale = interpolate(iconProgress, [0, 1], [0.5, 1]);

  const titleAnim = useFadeUp(8);
  const bodyAnim = useFadeUp(14);

  return (
    <AbsoluteFill style={{ background: backgrounds.deep }}>
      <SafeContent>
        {/* Icon */}
        <div
          style={{
            fontSize: 80,
            opacity: iconProgress,
            transform: `translateX(${iconX}px) scale(${iconScale})`,
            marginBottom: 32,
          }}
        >
          {point.icon}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            margin: 0,
            ...titleAnim,
          }}
        >
          <GradientText>{point.title}</GradientText>
        </h2>

        {/* Body */}
        <p
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 400,
            color: colors.muted,
            lineHeight: 1.5,
            textAlign: 'center',
            margin: 0,
            marginTop: 24,
            maxWidth: 800,
            ...bodyAnim,
          }}
        >
          {point.body}
        </p>
      </SafeContent>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Point 2 (Slide from Right)
// ---------------------------------------------------------------------------
const Point2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const point = CONTENT.points[1];

  const iconProgress = spring({
    frame,
    fps,
    config: springPresets.bouncy,
  });
  const iconX = interpolate(iconProgress, [0, 1], [120, 0]);
  const iconScale = interpolate(iconProgress, [0, 1], [0.5, 1]);

  const titleAnim = useFadeUp(8);
  const bodyAnim = useFadeUp(14);

  return (
    <AbsoluteFill style={{ background: backgrounds.reverse }}>
      <SafeContent>
        <div
          style={{
            fontSize: 80,
            opacity: iconProgress,
            transform: `translateX(${iconX}px) scale(${iconScale})`,
            marginBottom: 32,
          }}
        >
          {point.icon}
        </div>

        <h2
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            margin: 0,
            ...titleAnim,
          }}
        >
          <GradientText>{point.title}</GradientText>
        </h2>

        <p
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 400,
            color: colors.muted,
            lineHeight: 1.5,
            textAlign: 'center',
            margin: 0,
            marginTop: 24,
            maxWidth: 800,
            ...bodyAnim,
          }}
        >
          {point.body}
        </p>
      </SafeContent>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Point 3 (Scale In from Bottom)
// ---------------------------------------------------------------------------
const Point3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const point = CONTENT.points[2];

  const iconProgress = spring({
    frame,
    fps,
    config: springPresets.bouncy,
  });
  const iconScale = interpolate(iconProgress, [0, 1], [0, 1]);
  const iconY = interpolate(iconProgress, [0, 1], [60, 0]);

  const titleAnim = useFadeUp(8);
  const bodyAnim = useFadeUp(14);

  return (
    <AbsoluteFill style={{ background: backgrounds.deep }}>
      <SafeContent>
        <div
          style={{
            fontSize: 80,
            opacity: iconProgress,
            transform: `translateY(${iconY}px) scale(${iconScale})`,
            marginBottom: 32,
          }}
        >
          {point.icon}
        </div>

        <h2
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            margin: 0,
            ...titleAnim,
          }}
        >
          <GradientText>{point.title}</GradientText>
        </h2>

        <p
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 400,
            color: colors.muted,
            lineHeight: 1.5,
            textAlign: 'center',
            margin: 0,
            marginTop: 24,
            maxWidth: 800,
            ...bodyAnim,
          }}
        >
          {point.body}
        </p>
      </SafeContent>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Reveal / Punchline
// ---------------------------------------------------------------------------
const Punchline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Elastic zoom for maximum impact
  const zoomProgress = spring({
    frame,
    fps,
    config: springPresets.elastic,
  });
  const scale = interpolate(zoomProgress, [0, 1], [0.3, 1]);
  const opacity = interpolate(zoomProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Background glow intensifies
  const glowOpacity = interpolate(zoomProgress, [0, 1], [0, 0.35]);

  return (
    <AbsoluteFill style={{ background: backgrounds.bright }}>
      {/* Intense glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(168, 85, 247, ${glowOpacity}) 0%, rgba(6, 182, 212, ${glowOpacity * 0.5}) 50%, transparent 70%)`,
        }}
      />

      <SafeContent>
        <h1
          style={{
            fontFamily,
            fontSize: 80,
            fontWeight: 800,
            color: colors.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            margin: 0,
            whiteSpace: 'pre-line',
            opacity,
            transform: `scale(${scale})`,
          }}
        >
          {CONTENT.punchline}
        </h1>
      </SafeContent>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: CTA
// ---------------------------------------------------------------------------
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaAnim = useFadeUp(0);

  const handleProgress = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: springPresets.bouncy,
  });
  const handleScale = interpolate(handleProgress, [0, 1], [0.8, 1]);

  // Subtle background pulse
  const pulseOpacity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.05, 0.15]
  );

  return (
    <AbsoluteFill style={{ background: backgrounds.deep }}>
      {/* Pulsing glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(168, 85, 247, ${pulseOpacity}) 0%, transparent 60%)`,
        }}
      />

      <SafeContent>
        {/* CTA text */}
        <p
          style={{
            fontFamily,
            fontSize: 40,
            fontWeight: 700,
            color: colors.text,
            textAlign: 'center',
            margin: 0,
            ...ctaAnim,
          }}
        >
          {CONTENT.cta}
        </p>

        {/* Handle with gradient */}
        <div
          style={{
            marginTop: 32,
            opacity: handleProgress,
            transform: `scale(${handleScale})`,
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: 36,
              fontWeight: 800,
              textAlign: 'center',
              margin: 0,
            }}
          >
            <GradientText>{CONTENT.handle}</GradientText>
          </p>
        </div>

        {/* Accent divider */}
        <div
          style={{
            width: 64,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            marginTop: 40,
            ...useFadeUp(20),
          }}
        />
      </SafeContent>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------
export const SocialShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Sequence from={0} durationInFrames={150} name="Hook">
        <Hook />
      </Sequence>

      <Sequence from={150} durationInFrames={150} name="Point 1">
        <Point1 />
      </Sequence>

      <Sequence from={300} durationInFrames={150} name="Point 2">
        <Point2 />
      </Sequence>

      <Sequence from={450} durationInFrames={150} name="Point 3">
        <Point3 />
      </Sequence>

      <Sequence from={600} durationInFrames={150} name="Punchline">
        <Punchline />
      </Sequence>

      <Sequence from={750} durationInFrames={150} name="CTA">
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Remotion registration
// ---------------------------------------------------------------------------
export const SocialShortComposition: React.FC = () => {
  return (
    <Composition
      id="SocialShort"
      component={SocialShort}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
```

---

## Customization Guide

### Changing the content

Edit the `CONTENT` object:

| Field | What to change |
|-------|---------------|
| `CONTENT.hook` | The attention-grabbing opening text. Use `\n` for line breaks. Keep it under 10 words per line. |
| `CONTENT.points[n].icon` | Emoji for each talking point |
| `CONTENT.points[n].title` | Short title (2-4 words) |
| `CONTENT.points[n].body` | One-sentence explanation |
| `CONTENT.punchline` | The reveal or key takeaway. Use `\n` for line breaks. |
| `CONTENT.cta` | Call-to-action text (e.g., "Follow for more", "Like and share") |
| `CONTENT.handle` | Your social media handle |

### Adding or removing points

The template supports any number of points:
- To add a point: add to `CONTENT.points`, create a new `PointN` component, add a `<Sequence>`
- To remove a point: remove from `CONTENT.points`, remove the component and `<Sequence>`
- Adjust total `durationInFrames` (150 frames per scene)

### Changing the color palette

Replace the `colors` object with any palette from `layer-3-design/color.md`. For a fashion/beauty look, use Blossom:

```ts
const colors = {
  bg: '#1A1A2E',
  surface: '#25253E',
  text: '#EAEAEA',
  muted: '#A0A0B0',
  accent: '#E84393',
  secondary: '#FD79A8',
  gradient: 'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)',
};
```

Update the `backgrounds` object gradients to match the new palette.

### Safe zone compliance

The `SafeContent` component positions content between `contentTop` (15% from top) and `contentBottom` (20% from bottom). This avoids:
- **Top 15%**: TikTok username, following button, share icons
- **Bottom 20%**: Caption area, music ticker, interaction buttons

To adjust safe zones for different platforms:

```ts
const SAFE = {
  topUnsafe: 192,     // 10% from top (less aggressive)
  bottomUnsafe: 288,   // 15% from bottom
  contentTop: 192,
  contentBottom: 1632,
};
```

### Scene timing

Each scene is exactly 150 frames (5 seconds) for a total of 30 seconds. Social shorts should be fast-paced. Guidelines:
- **TikTok**: 15-60 seconds. 30 seconds is the sweet spot.
- **Instagram Reels**: Up to 90 seconds. 15-30 seconds performs best.
- **YouTube Shorts**: Under 60 seconds. 30-45 seconds works well.

To make it faster (20 seconds total):
- Change each scene to 100 frames
- Update total `durationInFrames` to 600

### Spring presets for different moods

The template uses energetic springs for social content. To adjust the mood:
- **More professional**: Replace `bouncy` and `elastic` with `smooth` and `snappy`
- **More playful**: Keep `elastic` and increase `bouncy` usage
- **More dramatic**: Use `heavy` for punchline reveals

### Font sizing for vertical format

Vertical video text should be larger than landscape. The hook uses 72px and the punchline uses 80px. When customizing:
- Hook text: 64-80px (must grab attention)
- Point titles: 44-52px
- Body text: 24-32px
- CTA: 36-44px
- Handle: 32-40px

Never go below 24px on vertical format -- text becomes unreadable on mobile.

### Background gradient variety

Each scene uses a slightly different gradient from the `backgrounds` object to create visual rhythm without jarring transitions. The gradients all stay within the Aurora palette for consistency. Swap or modify these to create your preferred atmosphere.
