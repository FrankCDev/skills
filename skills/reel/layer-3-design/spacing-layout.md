---
name: spacing-layout
description: Grid system, safe zones, aspect ratios, and layout patterns for video
metadata:
  tags: spacing, layout, grid, safe-zone, aspect-ratio, padding
---

# Spacing & Layout

Video layout is not web layout. There are no scrollbars, no fold, no responsive breakpoints. You have exactly one fixed canvas, viewed for a fixed duration. Every pixel matters. This guide ensures consistent, professional spacing across all compositions.

---

## The 8px Grid System

All spacing values must be multiples of 8. This constraint creates visual rhythm -- elements feel aligned even when they are not directly related.

```ts
export const spacing = {
  xxs: 4,    // Exception: half-unit for hairline gaps only
  xs: 8,     // Minimum spacing between related elements
  sm: 16,    // Tight spacing within a group
  md: 24,    // Standard spacing between elements
  lg: 32,    // Spacing between groups
  xl: 48,    // Section separation
  xxl: 64,   // Major section breaks
  xxxl: 80,  // Large whitespace blocks
  huge: 96,  // Safe zone padding for 1080p
  max: 128,  // Maximum section separation
} as const;
```

**Rule**: When choosing a spacing value, start with `md` (24) as the default and adjust from there. If two elements feel too close, go up one step. If they feel too far apart, go down one step.

---

## Safe Zones

Social platforms crop video edges. Media players add overlays near edges. Always keep critical content within safe zones.

```ts
export const safeZones = {
  // 16:9 Landscape (1920x1080)
  landscape: {
    width: 1920,
    height: 1080,
    paddingX: 96,    // 5% of 1920
    paddingY: 54,    // 5% of 1080
    safeArea: {
      left: 96,
      right: 1824,   // 1920 - 96
      top: 54,
      bottom: 1026,  // 1080 - 54
      width: 1728,   // 1920 - 192
      height: 972,   // 1080 - 108
    },
  },

  // 9:16 Portrait / Vertical (1080x1920)
  portrait: {
    width: 1080,
    height: 1920,
    paddingX: 54,    // 5% of 1080
    paddingY: 96,    // 5% of 1920
    safeArea: {
      left: 54,
      right: 1026,
      top: 96,
      bottom: 1824,
      width: 972,
      height: 1728,
    },
  },

  // 1:1 Square (1080x1080)
  square: {
    width: 1080,
    height: 1080,
    paddingX: 54,    // 5% of 1080
    paddingY: 54,    // 5% of 1080
    safeArea: {
      left: 54,
      right: 1026,
      top: 54,
      bottom: 1026,
      width: 972,
      height: 972,
    },
  },
} as const;
```

### Safe Zone Component

```tsx
import { AbsoluteFill } from 'remotion';

interface SafeAreaProps {
  children: React.ReactNode;
  aspect?: 'landscape' | 'portrait' | 'square';
}

const SafeArea: React.FC<SafeAreaProps> = ({ children, aspect = 'landscape' }) => {
  const zones = safeZones[aspect];

  return (
    <AbsoluteFill
      style={{
        padding: `${zones.paddingY}px ${zones.paddingX}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Usage
const MyScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
    <SafeArea aspect="landscape">
      <h1 style={{ color: '#F5F5F7', fontSize: 64 }}>
        Content stays within safe bounds
      </h1>
    </SafeArea>
  </AbsoluteFill>
);
```

---

## Aspect Ratio Layouts

### 16:9 Landscape (1920x1080)

The most common format. Best for YouTube, presentations, and widescreen content. Horizontal space allows side-by-side layouts.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

// Two-column layout for landscape
const LandscapeLayout: React.FC = () => {
  const frame = useCurrentFrame();

  const leftSpring = spring({ frame, fps: 30, config: { damping: 200 } });
  const rightSpring = spring({
    frame: Math.max(0, frame - 10),
    fps: 30,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <div
        style={{
          display: 'flex',
          height: '100%',
          padding: 96, // safe zone
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Left column: Text content */}
        <div
          style={{
            flex: 1,
            opacity: leftSpring,
            transform: `translateY(${interpolate(leftSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#0A84FF',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              margin: 0,
            }}
          >
            Feature Highlight
          </p>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#F5F5F7',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              marginTop: 16,
            }}
          >
            Split Layout
          </h1>
          <p
            style={{
              fontSize: 24,
              color: '#86868B',
              lineHeight: 1.5,
              margin: 0,
              marginTop: 24,
              maxWidth: 500,
            }}
          >
            Left column for text, right column for visuals.
            The natural reading flow guides the eye from left to right.
          </p>
        </div>

        {/* Right column: Visual content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: rightSpring,
            transform: `scale(${interpolate(rightSpring, [0, 1], [0.9, 1])})`,
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '4/3',
              backgroundColor: '#16161F',
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 48,
            }}
          >
            {/* Image or visual content goes here */}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

### 9:16 Portrait / Vertical (1080x1920)

For Instagram Reels, TikTok, YouTube Shorts. Vertical space forces stacked layouts with bold text at top.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

// Stacked layout for portrait
const PortraitLayout: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeUp = (delay: number) => {
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps: 30,
      config: { damping: 200 },
    });
    return {
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '96px 54px', // portrait safe zones
        }}
      >
        {/* Top section: Big text (40% of space) */}
        <div style={{ flex: 2, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#F5F5F7',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              ...fadeUp(0),
            }}
          >
            Vertical{'\n'}Content{'\n'}First
          </h1>
          <p
            style={{
              fontSize: 24,
              color: '#86868B',
              margin: 0,
              marginTop: 24,
              lineHeight: 1.5,
              ...fadeUp(8),
            }}
          >
            Bold headlines at the top where eyes land first.
          </p>
        </div>

        {/* Bottom section: Visual (60% of space) */}
        <div
          style={{
            flex: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...fadeUp(16),
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#16161F',
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Image or visual content */}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

### 1:1 Square (1080x1080)

For Instagram feed, LinkedIn. Centered compositions with generous padding work best.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

// Centered layout for square
const SquareLayout: React.FC = () => {
  const frame = useCurrentFrame();

  const s = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 80, // generous padding
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            opacity: s,
            transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#0A84FF',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              margin: 0,
            }}
          >
            Did you know?
          </p>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#F5F5F7',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              margin: 0,
              marginTop: 24,
              maxWidth: 700,
            }}
          >
            Square formats demand centered, punchy content
          </h1>
          <p
            style={{
              fontSize: 22,
              color: '#86868B',
              margin: 0,
              marginTop: 32,
              lineHeight: 1.5,
              maxWidth: 600,
            }}
          >
            Keep it short. Keep it centered. Less is more in a square frame.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

## Rule of Thirds

Divide the frame into a 3x3 grid. Place key elements at the intersections of grid lines for naturally balanced compositions.

```tsx
import { AbsoluteFill } from 'remotion';

// Rule-of-thirds grid overlay for development
const ThirdsGrid: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {/* Vertical lines at 1/3 and 2/3 */}
    <div
      style={{
        position: 'absolute',
        left: '33.33%',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '66.66%',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      }}
    />
    {/* Horizontal lines at 1/3 and 2/3 */}
    <div
      style={{
        position: 'absolute',
        top: '33.33%',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '66.66%',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      }}
    />
  </AbsoluteFill>
);

// Positioning content at thirds intersections
const ThirdsLayout: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
    {/* Title at top-left third intersection */}
    <div
      style={{
        position: 'absolute',
        left: '10%',
        top: '25%',
        maxWidth: '45%',
      }}
    >
      <h1 style={{ fontSize: 56, fontWeight: 700, color: '#F5F5F7', margin: 0, lineHeight: 1.1 }}>
        Place key elements at intersections
      </h1>
      <p style={{ fontSize: 24, color: '#86868B', marginTop: 16 }}>
        The rule of thirds creates natural visual balance.
      </p>
    </div>

    {/* Visual at bottom-right third */}
    <div
      style={{
        position: 'absolute',
        right: '10%',
        bottom: '15%',
        width: '35%',
        aspectRatio: '1',
        backgroundColor: '#16161F',
        borderRadius: 24,
      }}
    />

    {/* Development overlay -- remove in production */}
    {/* <ThirdsGrid /> */}
  </AbsoluteFill>
);
```

---

## Breathing Room

**The 60% rule**: No more than 60% of the frame should be filled with content. The remaining 40% is whitespace that gives the composition room to breathe.

```tsx
import { AbsoluteFill } from 'remotion';

// CORRECT: Content occupies ~55% of the frame
const BreathingRoom: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: '#0A0A0F',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 96,
    }}
  >
    <div style={{ maxWidth: 800, textAlign: 'center' }}>
      <h1 style={{ fontSize: 64, fontWeight: 700, color: '#F5F5F7', margin: 0, lineHeight: 1.1 }}>
        Room to breathe
      </h1>
      <p style={{ fontSize: 24, color: '#86868B', marginTop: 24, lineHeight: 1.5 }}>
        Generous whitespace makes content feel premium and easy to scan.
      </p>
    </div>
    {/* ~45% of the frame is empty space -- this is correct */}
  </AbsoluteFill>
);

// INCORRECT: Frame is packed with content
const NoBreathe: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: '#0A0A0F',
      padding: 24, // too little padding
    }}
  >
    <div>
      <h1 style={{ fontSize: 48, color: '#F5F5F7', margin: 0 }}>Too Much Content</h1>
      <p style={{ fontSize: 20, color: '#86868B', margin: '8px 0' }}>Line 1 of body text</p>
      <p style={{ fontSize: 20, color: '#86868B', margin: '8px 0' }}>Line 2 of body text</p>
      <p style={{ fontSize: 20, color: '#86868B', margin: '8px 0' }}>Line 3 of body text</p>
      <p style={{ fontSize: 20, color: '#86868B', margin: '8px 0' }}>Line 4 of body text</p>
      <ul style={{ fontSize: 18, color: '#86868B' }}>
        <li>Bullet 1</li><li>Bullet 2</li><li>Bullet 3</li>
        <li>Bullet 4</li><li>Bullet 5</li><li>Bullet 6</li>
      </ul>
      <p style={{ fontSize: 16, color: '#86868B' }}>Footer text and more content crammed in</p>
    </div>
    {/* ~90% of frame is filled -- this is a wall of text */}
  </AbsoluteFill>
);
```

---

## Z-Pattern Reading Flow

For information-heavy frames, arrange content following the Z-pattern: top-left to top-right, then diagonally to bottom-left, then across to bottom-right.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const ZPatternLayout: React.FC = () => {
  const frame = useCurrentFrame();

  const animate = (delay: number) => {
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps: 30,
      config: { damping: 200 },
    });
    return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)` };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F', padding: 96 }}>
      {/* Z-Point 1: Top-left -- Logo / Brand (eye starts here) */}
      <div style={{ position: 'absolute', top: 64, left: 96, ...animate(0) }}>
        <p style={{ fontSize: 18, fontWeight: 600, color: '#0A84FF', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
          Acme Corp
        </p>
      </div>

      {/* Z-Point 2: Top-right -- Supporting info */}
      <div style={{ position: 'absolute', top: 64, right: 96, ...animate(4) }}>
        <p style={{ fontSize: 16, color: '#86868B', margin: 0 }}>
          Q4 2025 Report
        </p>
      </div>

      {/* Z-Point 3: Center -- Main content (diagonal eye sweep) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', ...animate(8) }}>
          <h1 style={{ fontSize: 72, fontWeight: 700, color: '#F5F5F7', margin: 0, lineHeight: 1.1 }}>
            Revenue up 47%
          </h1>
          <p style={{ fontSize: 28, color: '#86868B', marginTop: 16 }}>
            Our strongest quarter yet
          </p>
        </div>
      </div>

      {/* Z-Point 4: Bottom-left -- Detail */}
      <div style={{ position: 'absolute', bottom: 64, left: 96, ...animate(16) }}>
        <p style={{ fontSize: 16, color: '#86868B', margin: 0 }}>
          $2.4B ARR
        </p>
      </div>

      {/* Z-Point 5: Bottom-right -- CTA (eye ends here) */}
      <div style={{ position: 'absolute', bottom: 64, right: 96, ...animate(20) }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#0A84FF' }}>
          Read the full report
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

---

## AbsoluteFill Layout Patterns

### Centered Content

```tsx
<AbsoluteFill
  style={{
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <div style={{ textAlign: 'center', maxWidth: 800 }}>
    {/* Content */}
  </div>
</AbsoluteFill>
```

### Flex Column (Top-Aligned)

```tsx
<AbsoluteFill
  style={{
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 96,
  }}
>
  <h1>Title</h1>
  <p>Body</p>
</AbsoluteFill>
```

### Flex Column (Bottom-Aligned -- good for captions)

```tsx
<AbsoluteFill
  style={{
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 96,
  }}
>
  <h1>Title at bottom</h1>
  <p>Works great for lower-third layouts</p>
</AbsoluteFill>
```

### Split Horizontal (Two Columns)

```tsx
<AbsoluteFill style={{ flexDirection: 'row' }}>
  <div style={{ flex: 1, padding: 64 }}>
    {/* Left content */}
  </div>
  <div style={{ flex: 1, padding: 64 }}>
    {/* Right content */}
  </div>
</AbsoluteFill>
```

### Layered (Stacked AbsoluteFills)

```tsx
<AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
  {/* Layer 1: Background visual */}
  <AbsoluteFill style={{ opacity: 0.3 }}>
    {/* Background image or gradient */}
  </AbsoluteFill>

  {/* Layer 2: Overlay gradient */}
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 15, 0.9) 100%)',
    }}
  />

  {/* Layer 3: Content */}
  <AbsoluteFill
    style={{
      justifyContent: 'flex-end',
      padding: 96,
    }}
  >
    <h1 style={{ color: '#F5F5F7', fontSize: 56 }}>Layered composition</h1>
  </AbsoluteFill>
</AbsoluteFill>
```

---

## Spacing Constants (Complete)

```ts
export const layout = {
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
    xxxl: 80,
    huge: 96,
    max: 128,
  },

  safeZone: {
    landscape: { x: 96, y: 54 },
    portrait: { x: 54, y: 96 },
    square: { x: 54, y: 54 },
  },

  canvas: {
    landscape: { width: 1920, height: 1080 },
    portrait: { width: 1080, height: 1920 },
    square: { width: 1080, height: 1080 },
  },

  maxContentWidth: {
    landscape: 1200,  // ~62% of 1920
    portrait: 900,    // ~83% of 1080
    square: 800,      // ~74% of 1080
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },
} as const;
```
