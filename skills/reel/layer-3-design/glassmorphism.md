---
name: glassmorphism
description: Frosted glass effects, material tiers, backdrop-filter patterns, noise textures, and animated glass components for video
metadata:
  tags: glass, blur, backdrop-filter, material, frosted, translucent, noise, dark-light
---

# Glassmorphism & Material Effects

Glassmorphism is the digital equivalent of frosted glass. A translucent surface sits above content, revealing a blurred version of what is behind it. When done well, it communicates depth and hierarchy without visual clutter. When done poorly, it becomes a muddy, unreadable mess. This guide covers the correct recipes.

---

## 1. Glass Card Recipe

The foundation of glassmorphism is four properties working together: a semi-transparent background, a `backdrop-filter` blur, a subtle border, and a shadow. Remove any one and the effect falls apart.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const GlassCardRecipe: React.FC = () => {
  const frame = useCurrentFrame();

  const cardSpring = spring({
    frame,
    fps: 30,
    config: { damping: 200 }, // smooth preset
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* The glass card -- four pillars of glassmorphism */}
      <div
        style={{
          // Pillar 1: Semi-transparent background
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          // Pillar 2: Backdrop blur -- the core glass effect
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          // Pillar 3: Subtle border to define the edge
          border: '1px solid rgba(255, 255, 255, 0.18)',
          // Pillar 4: Shadow for depth separation
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          // Shape
          borderRadius: 24,
          padding: 64,
          maxWidth: 600,
          // Animation
          opacity: cardSpring,
          transform: `translateY(${interpolate(cardSpring, [0, 1], [40, 0])}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Frosted Glass
        </h2>
        <p
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            marginTop: 16,
            lineHeight: 1.5,
          }}
        >
          A translucent surface that reveals a blurred hint of
          what lies beneath.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

### The Four Pillars

| Property | Purpose | Typical Value |
|---|---|---|
| `backgroundColor` | Semi-transparent tint | `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.15)` |
| `backdropFilter` | Blurs content behind the element | `blur(12px)` to `blur(40px)` |
| `border` | Defines the glass edge | `1px solid rgba(255, 255, 255, 0.1)` to `0.2` |
| `boxShadow` | Adds depth separation | `0 8px 32px rgba(0, 0, 0, 0.1)` |

---

## 2. Frosted Panel Component

A reusable glass panel with configurable blur, opacity, and tint color. Use this as the foundation for all glass surfaces in your compositions.

```tsx
import React from 'react';

interface FrostedPanelProps {
  children: React.ReactNode;
  /** Blur intensity in pixels. Default: 24 */
  blur?: number;
  /** Background opacity from 0 to 1. Default: 0.12 */
  opacity?: number;
  /** Tint color applied to the glass surface. Default: 'white' */
  tint?: 'white' | 'black' | 'accent';
  /** Custom accent hex color when tint is 'accent'. Default: '#0A84FF' */
  accentHex?: string;
  /** Border radius in pixels. Default: 24 */
  radius?: number;
  /** Padding in pixels. Default: 48 */
  padding?: number;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

const tintColors: Record<string, { bg: string; border: string }> = {
  white: { bg: '255, 255, 255', border: '255, 255, 255' },
  black: { bg: '0, 0, 0', border: '255, 255, 255' },
};

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const FrostedPanel: React.FC<FrostedPanelProps> = ({
  children,
  blur = 24,
  opacity = 0.12,
  tint = 'white',
  accentHex = '#0A84FF',
  radius = 24,
  padding = 48,
  style = {},
}) => {
  const colors =
    tint === 'accent'
      ? { bg: hexToRgb(accentHex), border: hexToRgb(accentHex) }
      : tintColors[tint];

  return (
    <div
      style={{
        backgroundColor: `rgba(${colors.bg}, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `1px solid rgba(${colors.border}, ${opacity + 0.06})`,
        borderRadius: radius,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        padding,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default FrostedPanel;
```

### Usage

```tsx
import { AbsoluteFill } from 'remotion';

const GlassScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {/* White-tinted glass */}
    <FrostedPanel blur={32} opacity={0.1} tint="white">
      <h2 style={{ fontSize: 40, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
        Clean glass panel
      </h2>
      <p style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)', margin: 0, marginTop: 16 }}>
        Configurable blur, opacity, and tint.
      </p>
    </FrostedPanel>

    {/* Accent-tinted glass */}
    <FrostedPanel blur={20} opacity={0.15} tint="accent" accentHex="#E84393" style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 40, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
        Accent-tinted glass
      </h2>
    </FrostedPanel>
  </AbsoluteFill>
);
```

---

## 3. Material Tiers

Three levels of glass intensity for building visual hierarchy. Thin glass is nearly invisible, regular glass is the default, and thick glass creates a nearly opaque surface. Use thin for large background overlays, regular for cards and panels, and thick for tooltips and focused content.

```ts
export const materialTiers = {
  /** Barely visible. For ambient overlays and large background panels. */
  thin: {
    blur: 12,
    bgOpacity: 0.06,
    borderOpacity: 0.08,
  },
  /** The default. For cards, modals, and content panels. */
  regular: {
    blur: 24,
    bgOpacity: 0.12,
    borderOpacity: 0.18,
  },
  /** Nearly opaque. For tooltips, dropdowns, and focused content. */
  thick: {
    blur: 40,
    bgOpacity: 0.2,
    borderOpacity: 0.25,
  },
} as const;

export type MaterialTier = keyof typeof materialTiers;
```

### Material Tier Showcase

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const materialTiers = {
  thin: { blur: 12, bgOpacity: 0.06, borderOpacity: 0.08 },
  regular: { blur: 24, bgOpacity: 0.12, borderOpacity: 0.18 },
  thick: { blur: 40, bgOpacity: 0.2, borderOpacity: 0.25 },
} as const;

type MaterialTier = keyof typeof materialTiers;

interface MaterialCardProps {
  tier: MaterialTier;
  title: string;
  description: string;
  delay?: number;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  tier,
  title,
  description,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const material = materialTiers[tier];

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { damping: 200 }, // smooth
  });

  return (
    <div
      style={{
        backgroundColor: `rgba(255, 255, 255, ${material.bgOpacity})`,
        backdropFilter: `blur(${material.blur}px)`,
        WebkitBackdropFilter: `blur(${material.blur}px)`,
        border: `1px solid rgba(255, 255, 255, ${material.borderOpacity})`,
        borderRadius: 20,
        padding: 40,
        width: 340,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.5)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
          margin: 0,
        }}
      >
        {tier}
      </p>
      <h3 style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', margin: 0, marginTop: 12 }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: 18,
          color: 'rgba(255, 255, 255, 0.65)',
          margin: 0,
          marginTop: 12,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
};

const MaterialTierShowcase: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(135deg, #E84393 0%, #FD79A8 50%, #A855F7 100%)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div style={{ display: 'flex', gap: 32 }}>
      <MaterialCard
        tier="thin"
        title="Thin"
        description="Subtle overlay for large background areas."
        delay={0}
      />
      <MaterialCard
        tier="regular"
        title="Regular"
        description="The default for cards and content panels."
        delay={6}
      />
      <MaterialCard
        tier="thick"
        title="Thick"
        description="High opacity for focused, readable content."
        delay={12}
      />
    </div>
  </AbsoluteFill>
);
```

---

## 4. Animated Glass

Combining glassmorphism with spring animations creates depth-aware motion. The glass surface can enter with a fade and vertical translation, while the blur intensity animates independently for a focus-pull effect.

### Animated Blur Reveal

The blur ramps from 0 to full simultaneously with the card entrance, creating the illusion of the glass surface materializing.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const AnimatedGlassReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Card entrance -- smooth preset: { damping: 200 }
  const cardProgress = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });

  // Blur ramps from 0 to full alongside the card
  const blurAmount = interpolate(cardProgress, [0, 1], [0, 24]);
  const bgOpacity = interpolate(cardProgress, [0, 1], [0, 0.12]);
  const borderOpacity = interpolate(cardProgress, [0, 1], [0, 0.18]);

  // Content enters after the glass surface settles
  const contentProgress = spring({
    frame: Math.max(0, frame - 8),
    fps: 30,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          borderRadius: 24,
          padding: 64,
          maxWidth: 600,
          opacity: cardProgress,
          transform: `translateY(${interpolate(cardProgress, [0, 1], [40, 0])}px) scale(${interpolate(cardProgress, [0, 1], [0.95, 1])})`,
        }}
      >
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            opacity: contentProgress,
            transform: `translateY(${interpolate(contentProgress, [0, 1], [16, 0])}px)`,
          }}
        >
          Glass materializes
        </h2>
        <p
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            marginTop: 16,
            lineHeight: 1.5,
            opacity: contentProgress,
            transform: `translateY(${interpolate(contentProgress, [0, 1], [16, 0])}px)`,
          }}
        >
          The blur builds as the surface fades in, creating a focus-pull effect.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

### Bouncy Glass Card

Use the `bouncy` spring preset for playful, energetic content. The overshoot on the scale creates a satisfying landing effect.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const BouncyGlassCard: React.FC = () => {
  const frame = useCurrentFrame();

  // bouncy preset: { mass: 1, damping: 10, stiffness: 200 }
  const progress = spring({
    frame,
    fps: 30,
    config: { mass: 1, damping: 10, stiffness: 200 },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 24,
          padding: 48,
          maxWidth: 500,
          transform: `scale(${scale})`,
          opacity: progress,
        }}
      >
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
          Bouncy entrance
        </h2>
        <p style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.65)', margin: 0, marginTop: 12 }}>
          A playful spring overshoot adds energy.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

### Snappy Glass Tooltip

Use the `snappy` preset for small UI elements like tooltips and badges.

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const GlassTooltip: React.FC<{ delay?: number; text: string }> = ({
  delay = 0,
  text,
}) => {
  const frame = useCurrentFrame();

  // snappy preset: { mass: 1, damping: 20, stiffness: 300 }
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { mass: 1, damping: 20, stiffness: 300 },
  });

  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: 12,
        padding: '12px 20px',
        fontSize: 16,
        fontWeight: 500,
        color: '#FFFFFF',
        opacity: progress,
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
      }}
    >
      {text}
    </div>
  );
};
```

---

## 5. Noise Texture Overlay

Real frosted glass has micro-imperfections. Adding a subtle noise texture makes the glass feel physical rather than digital. Use an SVG filter inlined as a data URI for zero external dependencies.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

/**
 * Noise overlay component. Place inside a glass element with position: relative.
 * The SVG feTurbulence generates fine-grained fractal noise.
 * Adjust baseFrequency for grain size (higher = finer grain).
 */
interface NoiseOverlayProps {
  /** Noise opacity from 0 to 1. Default: 0.04 */
  intensity?: number;
  /** Grain fineness. Higher = finer. Default: 0.75 */
  frequency?: number;
}

const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  intensity = 0.04,
  frequency = 0.75,
}) => {
  const noiseSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${intensity}'/%3E%3C/svg%3E")`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: noiseSvg,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 150px',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }}
    />
  );
};

/**
 * Glass card with built-in noise texture.
 */
interface NoisyGlassProps {
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  noiseIntensity?: number;
}

const NoisyGlass: React.FC<NoisyGlassProps> = ({
  children,
  blur = 24,
  opacity = 0.12,
  noiseIntensity = 0.04,
}) => (
  <div
    style={{
      position: 'relative',
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: 24,
      overflow: 'hidden',
    }}
  >
    <NoiseOverlay intensity={noiseIntensity} />
    <div style={{ position: 'relative', padding: 48 }}>
      {children}
    </div>
  </div>
);

// Example scene
const NoisyGlassDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        // Aurora palette background
        background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Decorative orbs for the glass to blur */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.25)',
          filter: 'blur(80px)',
          top: '20%',
          left: '30%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.2)',
          filter: 'blur(60px)',
          bottom: '25%',
          right: '25%',
        }}
      />

      <div
        style={{
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
          maxWidth: 560,
        }}
      >
        <NoisyGlass blur={28} opacity={0.1} noiseIntensity={0.05}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#F0F0F0', margin: 0 }}>
            Texture adds realism
          </h2>
          <p
            style={{
              fontSize: 20,
              color: 'rgba(240, 240, 240, 0.6)',
              margin: 0,
              marginTop: 16,
              lineHeight: 1.5,
            }}
          >
            A subtle noise layer makes digital glass feel physical. The grain
            is barely visible but the brain registers the texture.
          </p>
        </NoisyGlass>
      </div>
    </AbsoluteFill>
  );
};
```

---

## 6. Dark vs Light Glass

Glass behaves differently on dark and light backgrounds. On dark backgrounds, use white-tinted glass with light borders. On light backgrounds, increase the white opacity and use darker borders. Reference the palettes from `color.md`.

### Dark Glass (Midnight, Ocean, Blossom, Aurora palettes)

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const DarkBackgroundGlass: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        // Midnight palette
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Ambient gradient -- glass needs visual content behind it */}
      <div
        style={{
          position: 'absolute',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(10, 132, 255, 0.2) 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          // Dark background: white tint, low opacity
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 24,
          padding: 56,
          maxWidth: 520,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        }}
      >
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#F5F5F7', margin: 0 }}>
          Dark Glass
        </h2>
        <p style={{ fontSize: 20, color: '#86868B', margin: 0, marginTop: 16, lineHeight: 1.5 }}>
          White-tinted translucency on a dark canvas.
          Subtle borders catch just enough light.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

### Light Glass (Dawn palette and light backgrounds)

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const LightBackgroundGlass: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        // Dawn palette
        backgroundColor: '#FAFAF5',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Warm ambient gradient */}
      <div
        style={{
          position: 'absolute',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          // Light background: higher white opacity, darker borders
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 24,
          padding: 56,
          maxWidth: 520,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        }}
      >
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>
          Light Glass
        </h2>
        <p style={{ fontSize: 20, color: '#86868B', margin: 0, marginTop: 16, lineHeight: 1.5 }}>
          Higher white opacity and darker borders keep
          glass visible against light backgrounds.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

### Quick Reference: Dark vs Light Glass

| Property | Dark Background | Light Background |
|---|---|---|
| Background | `rgba(255, 255, 255, 0.06-0.15)` | `rgba(255, 255, 255, 0.5-0.7)` |
| Border | `rgba(255, 255, 255, 0.1-0.2)` | `rgba(0, 0, 0, 0.06-0.12)` |
| Box shadow | `rgba(0, 0, 0, 0.2-0.4)` | `rgba(0, 0, 0, 0.04-0.08)` |
| Text color | `#F5F5F7` (light text) | `#1D1D1F` (dark text) |
| Muted text | `#86868B` | `#86868B` |
| Palettes | Midnight, Ocean, Blossom, Aurora, Mono | Dawn |

### Colored Glass on Dark Background

Accent-tinted glass for interactive or branded elements. Use the accent color from the active palette.

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const AccentGlass: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: '#0A84FF',
          filter: 'blur(80px)',
          opacity: 0.4,
        }}
      />
      <div
        style={{
          // Midnight accent: #0A84FF tint
          backgroundColor: 'rgba(10, 132, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(10, 132, 255, 0.25)',
          borderRadius: 24,
          padding: 48,
          maxWidth: 440,
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
        }}
      >
        <h3 style={{ fontSize: 28, fontWeight: 700, color: '#F5F5F7', margin: 0 }}>
          Accent Glass
        </h3>
        <p style={{ fontSize: 18, color: 'rgba(245, 245, 247, 0.6)', margin: 0, marginTop: 12, lineHeight: 1.5 }}>
          Tinted with the palette accent color for interactive highlights.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

---

## 7. Performance Notes

`backdrop-filter` is GPU-intensive. It forces the browser to composite the layers behind the element, blur them, and composite again. In the Remotion render pipeline (frame-by-frame), this is tolerable. In the Remotion Studio preview, heavy blur can cause dropped frames.

### Guidelines

1. **Limit glass layers**: Do not stack more than 2-3 glass elements on top of each other. Each layer forces a separate composite pass.

2. **Use `willChange`**: Add `willChange: 'transform'` to glass elements that are also animated, hinting the browser to promote them to their own compositing layer.

```tsx
<div
  style={{
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    willChange: 'transform', // GPU compositing hint
  }}
/>
```

3. **Reduce blur radius when possible**: `blur(12px)` is significantly cheaper than `blur(40px)`. Use the `thin` material tier for large panels where subtlety is acceptable.

4. **Prefer static blur with animated opacity**: A static `blur(24px)` that fades in via container `opacity` is cheaper than interpolating the blur value from `blur(0px)` to `blur(24px)` every frame.

5. **Always include the WebKit prefix**:

```tsx
style={{
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)', // Required for some environments
}}
```

6. **Avoid glass over `<OffthreadVideo>`**: Blurring a moving video behind glass is extremely expensive. If necessary, reduce the blur radius to 8-12px.

7. **Avoid nesting glass elements**: A glass card inside another glass card creates double blur. If you need nested elevation, use opacity differences without additional blur on the inner element.

---

## 8. Anti-Patterns

### Too much blur

Blur values above 40px destroy background detail, making the glass effect pointless. The background should be recognizable, just softened.

```tsx
// ANTI-PATTERN: Blur so high the background is invisible
<div style={{ backdropFilter: 'blur(80px)', backgroundColor: 'rgba(255,255,255,0.2)' }}>
  {/* Looks like a solid white panel, not glass */}
</div>
```

```tsx
// CORRECT: Moderate blur preserves background detail
<div style={{ backdropFilter: 'blur(24px)', backgroundColor: 'rgba(255,255,255,0.12)' }}>
  {/* Background is softened but recognizable */}
</div>
```

### No border

Without a border, the glass edge is invisible and the panel floats ambiguously.

```tsx
// ANTI-PATTERN: No border -- glass edge is undefined
<div
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(24px)',
    borderRadius: 24,
    // No border defined
  }}
/>
```

```tsx
// CORRECT: Subtle border defines the glass boundary
<div
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
  }}
/>
```

### Wrong z-order

Glass must sit above the content it is blurring. `backdrop-filter` only blurs layers behind the element in the stacking context.

```tsx
// ANTI-PATTERN: Content layer is above the glass -- glass has nothing to blur
<AbsoluteFill>
  <div style={{ position: 'absolute', zIndex: 2, backdropFilter: 'blur(24px)' }}>
    Glass card
  </div>
  <div style={{ position: 'absolute', zIndex: 3 }}>
    This content is ABOVE the glass -- glass cannot blur it
  </div>
</AbsoluteFill>
```

```tsx
// CORRECT: Glass sits above the content it blurs
<AbsoluteFill>
  <div style={{ position: 'absolute', zIndex: 1 }}>
    Background content (gets blurred)
  </div>
  <div
    style={{
      position: 'absolute',
      zIndex: 2,
      backdropFilter: 'blur(24px)',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    }}
  >
    Glass card (above background)
  </div>
</AbsoluteFill>
```

### Missing WebKit prefix

Some rendering environments require the prefixed property. Always include both.

```tsx
// ANTI-PATTERN: Missing prefix
<div style={{ backdropFilter: 'blur(24px)' }} />
```

```tsx
// CORRECT: Both prefixed and standard
<div style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }} />
```

### Glass on flat solid backgrounds

`backdrop-filter` has no visible effect on a uniform solid color. Glass only works when there is something visually interesting behind it.

```tsx
// ANTI-PATTERN: Glass on flat solid -- blur is invisible
<AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
  <div style={{ backdropFilter: 'blur(24px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
    {/* Looks like a slightly lighter rectangle, not glass */}
  </div>
</AbsoluteFill>
```

```tsx
// CORRECT: Add visual interest behind the glass
<AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
  <div
    style={{
      position: 'absolute',
      width: '60%',
      height: '60%',
      top: '20%',
      left: '20%',
      background: 'radial-gradient(ellipse, rgba(10, 132, 255, 0.3) 0%, transparent 70%)',
    }}
  />
  <div style={{ backdropFilter: 'blur(24px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
    {/* Now the blur has content to work with */}
  </div>
</AbsoluteFill>
```

### Mixing glass variants carelessly

Do not combine dark glass and light glass in the same composition. Pick one variant that matches your background and use it consistently.

```tsx
// ANTI-PATTERN: Mixed glass variants in the same scene
<>
  <div style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>Light glass card</div>
  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>Dark glass card next to it</div>
</>
```

```tsx
// CORRECT: Consistent glass treatment throughout the scene
<>
  <div style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>Glass card 1</div>
  <div style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>Glass card 2 (slightly more opaque for hierarchy)</div>
</>
```
