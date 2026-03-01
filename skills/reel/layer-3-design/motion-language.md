---
name: motion-language
description: Spring presets, entrance/exit/emphasis animations inspired by Apple motion design
metadata:
  tags: motion, animation, spring, entrance, exit, emphasis, stagger, apple
---

# Motion Language

This is the heart of reel. Motion is what separates a static slideshow from a living composition. Every animation in this system is inspired by Apple's motion design philosophy: motion should feel physical, purposeful, and invisible. When done right, the viewer never notices the animation -- they just feel that the content appeared naturally.

---

## Spring Preset Library

Springs are the foundation of all reel motion. Unlike linear or eased animations, springs simulate real physics -- they have mass, tension, and friction. This makes motion feel natural rather than robotic.

```ts
export const springPresets = {
  /** Soft reveals, subtle entrances. The gentlest motion. */
  gentle: { mass: 1, damping: 15, stiffness: 100 },

  /** No bounce, professional feel. Apple's default. Use this when in doubt. */
  smooth: { damping: 200 },

  /** Quick UI responses. Snaps into place with minimal overshoot. */
  snappy: { mass: 1, damping: 20, stiffness: 300 },

  /** Playful, energetic. Has visible bounce. Use for casual/fun content. */
  bouncy: { mass: 1, damping: 10, stiffness: 200 },

  /** Dramatic, weighty reveals. Feels like something heavy landing. */
  heavy: { mass: 3, damping: 25, stiffness: 150 },

  /** Rubber-band effect. Maximum elasticity. Use very sparingly. */
  elastic: { mass: 1, damping: 8, stiffness: 150 },
} as const;

export type SpringPreset = keyof typeof springPresets;
```

### When to Use Each Preset

| Preset | Use For | Avoid For |
|--------|---------|-----------|
| `gentle` | Background elements, subtle reveals, ambient motion | Headlines, CTAs, anything that needs attention |
| `smooth` | **Everything by default**. Titles, body, cards, images | When you specifically need bounce or energy |
| `snappy` | UI elements, buttons, toggles, quick state changes | Large elements, slow reveals |
| `bouncy` | Playful content, icons, badges, notifications | Corporate, serious, or data-heavy content |
| `heavy` | Hero moments, dramatic number reveals, big statements | Small text, frequent animations |
| `elastic` | Special emphasis, one-time moments, rubber-band pulls | Repeated animations, body text |

---

## Entrance Animations

Each entrance animation is a complete, copy-pasteable function that returns CSS properties for the current frame.

### fadeUp

The default entrance. Content rises from below while fading in. Communicates "new information arriving."

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const FadeUpExample: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 200 }, // smooth preset
  });

  const opacity = progress;
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Fading up into view
    </div>
  );
};
```

### fadeDown

Content descends from above. Communicates "dropping in" or "descending hierarchy."

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const FadeDownExample: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = progress;
  const translateY = interpolate(progress, [0, 1], [-30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Dropping down into view
    </div>
  );
};
```

### scaleIn

Content grows from a smaller size. Communicates "appearing" or "materializing."

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const ScaleInExample: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = progress;
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Scaling into view
    </div>
  );
};
```

### slideFromRight

Content slides in from the right edge. Communicates "arriving from offscreen" or "next item."

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const SlideFromRightExample: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });

  const translateX = interpolate(progress, [0, 1], [200, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Sliding from right
    </div>
  );
};
```

### slideFromLeft

Content slides in from the left edge. Communicates "returning" or "previous context."

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const SlideFromLeftExample: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });

  const translateX = interpolate(progress, [0, 1], [-200, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Sliding from left
    </div>
  );
};
```

### blurIn

Content sharpens from a blurred state. Communicates "coming into focus" or "emerging from the background."

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const BlurInExample: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = progress;
  const blur = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        opacity,
        filter: `blur(${blur}px)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Emerging from blur
    </div>
  );
};
```

### revealUp

Content is clipped from below, revealing upward like a curtain lift. Communicates "unveiling."

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const RevealUpExample: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });

  // clipPath reveals from bottom to top
  const clipBottom = interpolate(progress, [0, 1], [100, 0]);

  return (
    <div
      style={{
        clipPath: `inset(0 0 ${clipBottom}% 0)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Revealing from below
    </div>
  );
};
```

---

## Exit Animations

Exit animations are the reverse of entrances. Use them when content needs to leave the frame cleanly.

### fadeOut

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const FadeOutExample: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const frame = useCurrentFrame();

  // Only animate after exitFrame
  const exitProgress = spring({
    frame: Math.max(0, frame - exitFrame),
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const translateY = interpolate(exitProgress, [0, 1], [0, -20]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#F5F5F7',
      }}
    >
      Fading out upward
    </div>
  );
};
```

### scaleOut

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const ScaleOutExample: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const frame = useCurrentFrame();

  const exitProgress = spring({
    frame: Math.max(0, frame - exitFrame),
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const scale = interpolate(exitProgress, [0, 1], [1, 0.8]);

  return (
    <div style={{ opacity, transform: `scale(${scale})`, fontSize: 56, fontWeight: 700, color: '#F5F5F7' }}>
      Scaling out
    </div>
  );
};
```

### slideToLeft

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const SlideToLeftExample: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const frame = useCurrentFrame();

  const exitProgress = spring({
    frame: Math.max(0, frame - exitFrame),
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const translateX = interpolate(exitProgress, [0, 1], [0, -200]);

  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)`, fontSize: 56, fontWeight: 700, color: '#F5F5F7' }}>
      Sliding to left
    </div>
  );
};
```

### slideToRight

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const SlideToRightExample: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const frame = useCurrentFrame();

  const exitProgress = spring({
    frame: Math.max(0, frame - exitFrame),
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const translateX = interpolate(exitProgress, [0, 1], [0, 200]);

  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)`, fontSize: 56, fontWeight: 700, color: '#F5F5F7' }}>
      Sliding to right
    </div>
  );
};
```

### blurOut

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const BlurOutExample: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const frame = useCurrentFrame();

  const exitProgress = spring({
    frame: Math.max(0, frame - exitFrame),
    fps: 30,
    config: { damping: 200 },
  });

  const opacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const blur = interpolate(exitProgress, [0, 1], [0, 20]);

  return (
    <div style={{ opacity, filter: `blur(${blur}px)`, fontSize: 56, fontWeight: 700, color: '#F5F5F7' }}>
      Blurring out
    </div>
  );
};
```

---

## Emphasis Animations

Emphasis animations draw attention to existing elements without removing or adding them.

### pulse

A subtle scale pulse that draws the eye. Use for highlighting key metrics or important moments.

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const PulseExample: React.FC<{ pulseFrame: number }> = ({ pulseFrame }) => {
  const frame = useCurrentFrame();

  // Two-phase: scale up, then back down
  const pulseProgress = spring({
    frame: Math.max(0, frame - pulseFrame),
    fps: 30,
    config: { mass: 1, damping: 10, stiffness: 200 }, // bouncy for overshoot
  });

  // Scale goes 1 -> 1.05 -> settles at 1 (spring overshoot creates the pulse)
  const scale = interpolate(pulseProgress, [0, 1], [1, 1.05]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        fontSize: 80,
        fontWeight: 800,
        color: '#F5F5F7',
        transformOrigin: 'center',
      }}
    >
      $2.4B
    </div>
  );
};
```

### shake

A horizontal oscillation for attention or error states.

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

const ShakeExample: React.FC<{ shakeFrame: number }> = ({ shakeFrame }) => {
  const frame = useCurrentFrame();

  const elapsed = frame - shakeFrame;
  if (elapsed < 0) {
    return <div style={{ fontSize: 56, fontWeight: 700, color: '#FF3B30' }}>Error occurred</div>;
  }

  // Damped sine wave for natural shake
  const intensity = Math.max(0, 1 - elapsed / 15); // decay over 15 frames
  const shake = Math.sin(elapsed * 1.5) * 8 * intensity;

  return (
    <div
      style={{
        transform: `translateX(${shake}px)`,
        fontSize: 56,
        fontWeight: 700,
        color: '#FF3B30',
      }}
    >
      Error occurred
    </div>
  );
};
```

### glow

An expanding box-shadow that creates a halo effect.

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

const GlowExample: React.FC<{ glowFrame: number }> = ({ glowFrame }) => {
  const frame = useCurrentFrame();

  const glowProgress = spring({
    frame: Math.max(0, frame - glowFrame),
    fps: 30,
    config: { damping: 200 },
  });

  const shadowSize = interpolate(glowProgress, [0, 1], [0, 40]);
  const shadowOpacity = interpolate(glowProgress, [0, 1], [0, 0.4]);

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '24px 48px',
        backgroundColor: '#0A84FF',
        borderRadius: 16,
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 600,
        boxShadow: `0 0 ${shadowSize}px rgba(10, 132, 255, ${shadowOpacity})`,
      }}
    >
      Get Started
    </div>
  );
};
```

### colorShift

A smooth background color transition for state changes.

```tsx
import { useCurrentFrame, spring, interpolate, interpolateColors } from 'remotion';

const ColorShiftExample: React.FC<{ shiftFrame: number }> = ({ shiftFrame }) => {
  const frame = useCurrentFrame();

  const shiftProgress = spring({
    frame: Math.max(0, frame - shiftFrame),
    fps: 30,
    config: { damping: 200 },
  });

  const bgColor = interpolateColors(
    shiftProgress,
    [0, 1],
    ['#16161F', '#0A84FF']
  );

  const textColor = interpolateColors(
    shiftProgress,
    [0, 1],
    ['#86868B', '#FFFFFF']
  );

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '24px 48px',
        backgroundColor: bgColor,
        borderRadius: 16,
        color: textColor,
        fontSize: 24,
        fontWeight: 600,
        transition: 'none', // springs handle the transition
      }}
    >
      Status: Active
    </div>
  );
};
```

---

## Stagger Pattern

Stagger is the secret weapon of professional motion design. Instead of all elements appearing at once, each enters with a small delay after the previous one. This creates a cascade effect that guides the eye through content in the intended reading order.

### The Formula

```
delay = index * staggerDelay
```

- **staggerDelay**: 3-5 frames at 30fps (100-167ms). Apple's standard is approximately 80ms (~2.4 frames at 30fps).
- For reel, we use **4 frames** (133ms) as the default stagger.

### Complete Stagger Example

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const STAGGER_DELAY = 4; // frames between each element

interface StaggerListProps {
  items: string[];
}

const StaggerList: React.FC<StaggerListProps> = ({ items }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        padding: 96,
      }}
    >
      {/* Title enters first */}
      {(() => {
        const titleProgress = spring({
          frame,
          fps: 30,
          config: { damping: 200 },
        });
        return (
          <h2
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: '#F5F5F7',
              margin: 0,
              marginBottom: 48,
              opacity: titleProgress,
              transform: `translateY(${interpolate(titleProgress, [0, 1], [24, 0])}px)`,
            }}
          >
            Key Features
          </h2>
        );
      })()}

      {/* Each item staggers in after the title */}
      {items.map((item, index) => {
        const itemDelay = 8 + index * STAGGER_DELAY; // 8 frames after title, then stagger
        const itemProgress = spring({
          frame: Math.max(0, frame - itemDelay),
          fps: 30,
          config: { damping: 200 },
        });

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
              opacity: itemProgress,
              transform: `translateY(${interpolate(itemProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#0A84FF',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 28, color: '#F5F5F7', fontWeight: 400 }}>
              {item}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Usage
const MyScene: React.FC = () => (
  <StaggerList
    items={[
      'Spring-based physics animations',
      'Six curated color palettes',
      'Video-optimized type scale',
      'Apple-inspired motion language',
    ]}
  />
);
```

---

## Orchestration Pattern

For complex scenes with many elements, define a timeline object that maps each element to its start frame. This makes timing adjustments trivial and keeps the code organized.

### Timeline Object

```ts
// Define timing for every element in the scene
const timeline = {
  label: 0,       // "Chapter 01" label enters first
  title: 6,       // Main title follows
  subtitle: 14,   // Subtitle after title lands
  divider: 22,    // Decorative line
  body: 28,       // Body text
  badge: 36,      // Supporting badge
  cta: 48,        // Call to action enters last
} as const;
```

### Complete Orchestration Example

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

// Timeline -- single source of truth for all timing
const timeline = {
  label: 0,
  title: 6,
  subtitle: 14,
  divider: 22,
  body: 28,
  cta: 48,
} as const;

// Reusable animation helper
const useEntrance = (startFrame: number) => {
  const frame = useCurrentFrame();
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

const OrchestratedScene: React.FC = () => {
  const labelAnim = useEntrance(timeline.label);
  const titleAnim = useEntrance(timeline.title);
  const subtitleAnim = useEntrance(timeline.subtitle);
  const bodyAnim = useEntrance(timeline.body);
  const ctaAnim = useEntrance(timeline.cta);

  const frame = useCurrentFrame();
  const dividerProgress = spring({
    frame: Math.max(0, frame - timeline.divider),
    fps: 30,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        padding: 96,
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#0A84FF',
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
          margin: 0,
          ...labelAnim,
        }}
      >
        Chapter 01
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#F5F5F7',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: 0,
          marginTop: 16,
          ...titleAnim,
        }}
      >
        The Foundation
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: '#A1A1A6',
          margin: 0,
          marginTop: 12,
          ...subtitleAnim,
        }}
      >
        Building blocks of great design
      </p>

      {/* Animated divider line */}
      <div
        style={{
          width: 80,
          height: 3,
          backgroundColor: '#0A84FF',
          borderRadius: 2,
          marginTop: 40,
          transform: `scaleX(${dividerProgress})`,
          transformOrigin: 'left',
        }}
      />

      {/* Body */}
      <p
        style={{
          fontSize: 24,
          color: '#86868B',
          lineHeight: 1.5,
          margin: 0,
          marginTop: 32,
          maxWidth: 600,
          ...bodyAnim,
        }}
      >
        Every great composition starts with a solid foundation. Master these
        principles and everything else falls into place.
      </p>

      {/* CTA */}
      <div style={{ marginTop: 48, ...ctaAnim }}>
        <span
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 600,
            borderRadius: 12,
          }}
        >
          Explore the system
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

---

## Reusable Animate Component

A higher-order component pattern that encapsulates entrance animations into a simple, declarative API.

```tsx
import React from 'react';
import { useCurrentFrame, spring, interpolate } from 'remotion';

const springPresets = {
  gentle: { mass: 1, damping: 15, stiffness: 100 },
  smooth: { damping: 200 },
  snappy: { mass: 1, damping: 20, stiffness: 300 },
  bouncy: { mass: 1, damping: 10, stiffness: 200 },
  heavy: { mass: 3, damping: 25, stiffness: 150 },
  elastic: { mass: 1, damping: 8, stiffness: 150 },
} as const;

type EntranceType =
  | 'fadeUp'
  | 'fadeDown'
  | 'scaleIn'
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'blurIn'
  | 'revealUp';

type SpringPresetName = keyof typeof springPresets;

interface AnimateProps {
  children: React.ReactNode;
  entrance?: EntranceType;
  delay?: number;
  preset?: SpringPresetName;
  style?: React.CSSProperties;
}

const Animate: React.FC<AnimateProps> = ({
  children,
  entrance = 'fadeUp',
  delay = 0,
  preset = 'smooth',
  style = {},
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: springPresets[preset],
  });

  const getEntranceStyle = (): React.CSSProperties => {
    switch (entrance) {
      case 'fadeUp':
        return {
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        };
      case 'fadeDown':
        return {
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [-30, 0])}px)`,
        };
      case 'scaleIn':
        return {
          opacity: progress,
          transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
        };
      case 'slideFromRight':
        return {
          opacity: progress,
          transform: `translateX(${interpolate(progress, [0, 1], [200, 0])}px)`,
        };
      case 'slideFromLeft':
        return {
          opacity: progress,
          transform: `translateX(${interpolate(progress, [0, 1], [-200, 0])}px)`,
        };
      case 'blurIn':
        return {
          opacity: progress,
          filter: `blur(${interpolate(progress, [0, 1], [20, 0])}px)`,
        };
      case 'revealUp':
        return {
          clipPath: `inset(0 0 ${interpolate(progress, [0, 1], [100, 0])}% 0)`,
        };
      default:
        return { opacity: progress };
    }
  };

  return (
    <div style={{ ...getEntranceStyle(), ...style }}>
      {children}
    </div>
  );
};

export default Animate;
```

### Usage

```tsx
import { AbsoluteFill } from 'remotion';

const MyScene: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: '#0A0A0F',
      justifyContent: 'center',
      padding: 96,
    }}
  >
    <Animate entrance="fadeUp" delay={0}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#0A84FF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        New Release
      </p>
    </Animate>

    <Animate entrance="fadeUp" delay={6}>
      <h1 style={{ fontSize: 64, fontWeight: 700, color: '#F5F5F7', marginTop: 16, lineHeight: 1.1 }}>
        Reel 2.0
      </h1>
    </Animate>

    <Animate entrance="fadeUp" delay={12}>
      <p style={{ fontSize: 28, color: '#86868B', marginTop: 16 }}>
        Everything is new. Everything is better.
      </p>
    </Animate>

    <Animate entrance="scaleIn" delay={24} preset="bouncy">
      <div
        style={{
          marginTop: 48,
          display: 'inline-block',
          padding: '16px 40px',
          backgroundColor: '#0A84FF',
          borderRadius: 12,
          color: '#FFF',
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        Try it now
      </div>
    </Animate>
  </AbsoluteFill>
);
```

---

## Combined Entrance + Exit Pattern

For scenes where content must both appear and disappear within a fixed duration.

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

interface UseEntranceExitOptions {
  enterFrame?: number;
  exitFrame: number;
  preset?: keyof typeof springPresets;
}

const useEntranceExit = ({ enterFrame = 0, exitFrame, preset = 'smooth' }: UseEntranceExitOptions) => {
  const frame = useCurrentFrame();

  // Entrance spring
  const enterProgress = spring({
    frame: Math.max(0, frame - enterFrame),
    fps: 30,
    config: springPresets[preset],
  });

  // Exit spring
  const exitProgress = spring({
    frame: Math.max(0, frame - exitFrame),
    fps: 30,
    config: springPresets[preset],
  });

  // Combined: fade up on enter, fade out on exit
  const opacity = enterProgress * (1 - exitProgress);
  const translateY = interpolate(enterProgress, [0, 1], [30, 0]) + interpolate(exitProgress, [0, 1], [0, -20]);

  return {
    opacity,
    transform: `translateY(${translateY}px)`,
  };
};

// Usage
const TemporaryMessage: React.FC = () => {
  const style = useEntranceExit({
    enterFrame: 0,
    exitFrame: 60, // exits after 2 seconds at 30fps
  });

  return (
    <div style={{ ...style, fontSize: 56, fontWeight: 700, color: '#F5F5F7' }}>
      This appears and disappears
    </div>
  );
};
```

---

## Motion Dos and Don'ts

| Do | Don't |
|---|---|
| Use `smooth` preset as the default | Default to `bouncy` or `elastic` |
| Stagger elements in reading order | Animate everything simultaneously |
| Keep translate distances small (20-40px) | Fly elements from 500px away |
| Use springs for all physics-based motion | Use `interpolate` with linear easing for motion |
| Match exit animation to entrance | Use a different exit style than entrance |
| Let animations complete before starting exits | Overlap entrance and exit animations |
| Use the same stagger delay throughout a scene | Mix different stagger timings |
| Animate properties that are GPU-composited (transform, opacity) | Animate width, height, top, left, margin |

---

## Performance Notes

1. **GPU-friendly properties**: Always animate `transform` and `opacity`. These are composited on the GPU and render at 60fps. Avoid animating `width`, `height`, `margin`, `padding`, `top`, `left`, or `font-size`.

2. **will-change**: For elements with `filter: blur()` or `backdrop-filter`, add `willChange: 'transform'` to hint the browser to promote the element to its own compositing layer.

3. **Spring computation**: `spring()` is computed per-frame and is lightweight. Hundreds of springs in a single composition are fine.

4. **Avoid re-renders**: If using `spring()` in a loop (like a stagger list), compute all values in the parent and pass them as props to child components, rather than having each child call `useCurrentFrame()`.
