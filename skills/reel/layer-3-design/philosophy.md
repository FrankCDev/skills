---
name: design-philosophy
description: Core design principles inspired by Apple aesthetics with modern flourishes
metadata:
  tags: design, philosophy, principles, apple, aesthetics
---

# Design Philosophy

Reel follows a design philosophy inspired by Apple's visual language: clarity, deference, and depth. Every pixel earns its place. Every motion has a reason. The result is video that feels premium, confident, and unmistakably modern.

---

## The Four Principles

### 1. Restraint

**Less is more. Every element must earn its place in the frame.**

The most common mistake in video design is adding too much. A composition with three well-placed elements will always outperform one with twelve competing for attention. Before adding anything, ask: "Does removing this hurt the message?"

**Correct -- clean hero with essential elements only:**

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const RestainedHero: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = spring({ frame, fps: 30, config: { damping: 200 } });
  const translateY = interpolate(opacity, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#F5F5F7',
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          One powerful idea.
        </h1>
        <p
          style={{
            color: '#86868B',
            fontSize: 28,
            fontWeight: 400,
            marginTop: 24,
            lineHeight: 1.4,
          }}
        >
          Nothing more. Nothing less.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

**Incorrect -- cluttered frame with competing elements:**

```tsx
// ANTI-PATTERN: Too many elements fighting for attention
const ClutteredHero: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        // Multiple background layers add visual noise
        background: 'linear-gradient(135deg, #FF6B35, #E84393, #0A84FF, #34C759)',
        padding: 40,
      }}
    >
      {/* Badge in corner */}
      <div style={{ position: 'absolute', top: 20, left: 20, background: 'red', padding: '4px 12px', borderRadius: 20, color: 'white', fontSize: 14 }}>
        NEW!
      </div>
      {/* Another badge */}
      <div style={{ position: 'absolute', top: 20, right: 20, background: 'gold', padding: '4px 12px', borderRadius: 20, color: 'black', fontSize: 14 }}>
        HOT
      </div>
      {/* Title -- too many styles */}
      <h1 style={{ fontSize: 48, color: 'white', textShadow: '2px 2px 4px black, 0 0 20px rgba(255,0,0,0.5)', fontWeight: 900, textDecoration: 'underline' }}>
        AMAZING PRODUCT!!!
      </h1>
      {/* Subtitle in a different font weight and color */}
      <h2 style={{ fontSize: 32, color: 'yellow', fontStyle: 'italic' }}>
        You won't believe this deal!
      </h2>
      {/* Multiple CTAs */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ background: 'red', color: 'white', padding: '12px 24px', fontSize: 20 }}>BUY NOW</button>
        <button style={{ background: 'green', color: 'white', padding: '12px 24px', fontSize: 20 }}>LEARN MORE</button>
        <button style={{ background: 'blue', color: 'white', padding: '12px 24px', fontSize: 20 }}>SUBSCRIBE</button>
      </div>
      {/* Decorative elements that add nothing */}
      <div style={{ position: 'absolute', bottom: 20, fontSize: 12, color: 'white' }}>
        * Terms apply * Limited offer * Act now * Don't miss out
      </div>
    </AbsoluteFill>
  );
};
```

---

### 2. Hierarchy

**Clear visual priority through size, weight, and spacing. The viewer's eye should know exactly where to go first, second, third.**

Hierarchy is achieved through contrast in scale (big vs small), weight (bold vs regular), color (bright vs muted), and whitespace (generous gaps between groups signal separation).

**Correct -- clear visual hierarchy with distinct levels:**

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const ClearHierarchy: React.FC = () => {
  const frame = useCurrentFrame();

  const titleSpring = spring({ frame, fps: 30, config: { damping: 200 } });
  const subtitleSpring = spring({ frame: Math.max(0, frame - 8), fps: 30, config: { damping: 200 } });
  const bodySpring = spring({ frame: Math.max(0, frame - 16), fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        padding: 96,
        justifyContent: 'center',
      }}
    >
      {/* Level 1: Display -- largest, boldest, brightest */}
      <h1
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: '#F5F5F7',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: 0,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        2.4 Billion
      </h1>

      {/* Level 2: Subheading -- medium size, medium weight, slightly muted */}
      <p
        style={{
          fontSize: 36,
          fontWeight: 500,
          color: '#A1A1A6',
          lineHeight: 1.3,
          margin: 0,
          marginTop: 16,
          opacity: subtitleSpring,
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        Active devices worldwide
      </p>

      {/* Level 3: Body -- smallest, lightest, most muted */}
      <p
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: '#86868B',
          lineHeight: 1.5,
          margin: 0,
          marginTop: 48, // extra space separates this group
          maxWidth: 600,
          opacity: bodySpring,
          transform: `translateY(${interpolate(bodySpring, [0, 1], [20, 0])}px)`,
        }}
      >
        An ecosystem that grows stronger every year, with privacy
        and performance at its core.
      </p>
    </AbsoluteFill>
  );
};
```

**Incorrect -- everything the same size and weight (no hierarchy):**

```tsx
// ANTI-PATTERN: No visual hierarchy -- everything competes equally
const FlatHierarchy: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        padding: 96,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* All text is the same size, weight, and color */}
      <p style={{ fontSize: 32, fontWeight: 500, color: '#F5F5F7', margin: 8 }}>
        2.4 Billion
      </p>
      <p style={{ fontSize: 32, fontWeight: 500, color: '#F5F5F7', margin: 8 }}>
        Active devices worldwide
      </p>
      <p style={{ fontSize: 32, fontWeight: 500, color: '#F5F5F7', margin: 8 }}>
        An ecosystem that grows stronger every year
      </p>
      {/* The viewer has no idea what to read first */}
    </AbsoluteFill>
  );
};
```

---

### 3. Flow

**Motion has purpose. No decorative animation. Everything moves because it communicates.**

Apple's animations are not ornamental -- they guide the eye, reveal content in reading order, and communicate spatial relationships. A fade-up says "here is new information." A scale-in says "this is appearing." A slide says "this came from over there." Random spinning, bouncing, or wobbling says nothing.

**Correct -- purposeful entrance revealing information in reading order:**

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const PurposefulMotion: React.FC = () => {
  const frame = useCurrentFrame();

  // Staggered entrance: title first, then subtitle, then CTA
  // Each element fades up, simulating content "rising into place"
  const elements = [
    { startFrame: 0, label: 'title' },
    { startFrame: 8, label: 'subtitle' },
    { startFrame: 20, label: 'cta' },
  ];

  const getAnimation = (startFrame: number) => {
    const progress = spring({
      frame: Math.max(0, frame - startFrame),
      fps: 30,
      config: { damping: 200 },
    });
    return {
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        padding: 96,
      }}
    >
      <h1 style={{ fontSize: 64, fontWeight: 700, color: '#F5F5F7', margin: 0, ...getAnimation(0) }}>
        Introducing Reel
      </h1>
      <p style={{ fontSize: 28, color: '#86868B', marginTop: 16, ...getAnimation(8) }}>
        Professional video, powered by code.
      </p>
      <div style={{ marginTop: 48, ...getAnimation(20) }}>
        <span
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            backgroundColor: '#0A84FF',
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 600,
            borderRadius: 12,
          }}
        >
          Get Started
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

**Incorrect -- decorative animation with no communicative purpose:**

```tsx
// ANTI-PATTERN: Spinning, bouncing, and wobbling for no reason
const DecorativeMotion: React.FC = () => {
  const frame = useCurrentFrame();

  // Random spin on the title -- communicates nothing
  const rotation = interpolate(frame, [0, 60], [0, 360]);
  // Constant bouncing -- distracting and purposeless
  const bounce = Math.sin(frame * 0.2) * 20;
  // Random scale pulsing
  const pulse = 1 + Math.sin(frame * 0.1) * 0.15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#F5F5F7',
          // Spinning text is unreadable and communicates nothing
          transform: `rotate(${rotation}deg) scale(${pulse})`,
        }}
      >
        Introducing Reel
      </h1>
      <p
        style={{
          fontSize: 28,
          color: '#86868B',
          // Constant bouncing prevents reading
          transform: `translateY(${bounce}px)`,
        }}
      >
        You can't even read this
      </p>
    </AbsoluteFill>
  );
};
```

---

### 4. Consistency

**Unified visual language. The same spacing, the same easing, the same color palette, throughout.**

Consistency means making decisions once and applying them everywhere. Choose a spacing scale and use it for all padding and margins. Choose a spring config and use it for all entrances. Choose a color palette and use only those colors. When everything shares the same DNA, the composition feels intentional.

**Correct -- shared constants drive every component:**

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

// Define once, use everywhere
const THEME = {
  colors: {
    bg: '#0A0A0F',
    surface: '#16161F',
    text: '#F5F5F7',
    muted: '#86868B',
    accent: '#0A84FF',
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48, xxl: 64 },
  fontSize: { display: 80, h1: 56, h2: 40, body: 24, caption: 16 },
  spring: { damping: 200 } as const, // Smooth (Apple default) everywhere
  stagger: 6, // 6 frames between each element, always
};

const fadeUp = (frame: number, startFrame: number) => {
  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps: 30,
    config: THEME.spring,
  });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
  };
};

const ConsistentScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.bg, padding: THEME.spacing.xxl }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <p
          style={{
            fontSize: THEME.fontSize.caption,
            color: THEME.colors.accent,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            ...fadeUp(frame, 0),
          }}
        >
          Chapter 01
        </p>
        <h1
          style={{
            fontSize: THEME.fontSize.h1,
            color: THEME.colors.text,
            fontWeight: 700,
            margin: 0,
            marginTop: THEME.spacing.sm,
            ...fadeUp(frame, THEME.stagger),
          }}
        >
          The Beginning
        </h1>
        <p
          style={{
            fontSize: THEME.fontSize.body,
            color: THEME.colors.muted,
            margin: 0,
            marginTop: THEME.spacing.md,
            maxWidth: 600,
            lineHeight: 1.5,
            ...fadeUp(frame, THEME.stagger * 2),
          }}
        >
          Every great story starts with a single step. This is ours.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

**Incorrect -- inconsistent values scattered throughout:**

```tsx
// ANTI-PATTERN: Random, inconsistent values everywhere
const InconsistentScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#111', padding: 50 }}>
      {/* Each element uses different spring configs */}
      <p
        style={{
          fontSize: 14, // random size
          color: '#00ff00', // random color not from any palette
          fontWeight: 800,
          letterSpacing: '0.1em',
          marginBottom: 10, // not on grid
          opacity: spring({ frame, fps: 30, config: { mass: 2, damping: 5, stiffness: 50 } }),
        }}
      >
        Chapter 01
      </p>
      <h1
        style={{
          fontSize: 52, // different from any scale
          color: '#ff00ff', // another random color
          fontWeight: 400, // title is lighter than label above?
          marginTop: 7, // not on grid
          opacity: spring({ frame, fps: 30, config: { damping: 200 } }), // different config
        }}
      >
        The Beginning
      </h1>
      <p
        style={{
          fontSize: 18, // yet another arbitrary size
          color: 'rgb(200, 180, 160)', // yet another random color
          marginTop: 33, // not on grid
          lineHeight: 2.2, // way too much line height
          opacity: spring({ frame, fps: 30, config: { mass: 0.5, damping: 30, stiffness: 400 } }), // yet another config
        }}
      >
        Every great story starts with a single step.
      </p>
    </AbsoluteFill>
  );
};
```

---

## Anti-Patterns Summary

| Anti-Pattern | Rule | Why It Fails |
|---|---|---|
| Too many colors | Max 3-4 colors per composition | Competing colors destroy hierarchy |
| Busy backgrounds | Solid or subtle gradient only | Background competes with content |
| Decorative animations | Every motion must communicate | Random motion is noise |
| Inconsistent spacing | Use 8px grid always | Arbitrary spacing looks unpolished |
| Font soup | Max 2 typefaces per video | Multiple fonts look amateurish |
| Centered everything | Left-align creates natural reading flow | Center alignment without hierarchy is flat |
| Drop shadows on everything | Shadows only for elevation | Overused shadows look dated |
| Full saturation colors | Use muted/desaturated palettes | Neon colors feel cheap |

---

## Design Audit Checklist

Before finalizing any composition, answer these questions:

### Restraint
- [ ] Can I remove any element without losing the message?
- [ ] Does every visual element serve a clear purpose?
- [ ] Am I using more than 4 colors? (If yes, reduce.)
- [ ] Am I using more than 2 typefaces? (If yes, reduce.)

### Hierarchy
- [ ] Can I tell what to read first, second, third within 1 second?
- [ ] Is there a clear size contrast between heading and body text (at least 2x)?
- [ ] Is muted text visually distinct from primary text?
- [ ] Does spacing separate groups logically (more space between groups, less within)?

### Flow
- [ ] Does every animation communicate something (reveal, transition, emphasis)?
- [ ] Are elements entering in a logical reading order (title before subtitle)?
- [ ] Is stagger timing consistent (same delay between each element)?
- [ ] Would removing an animation lose any meaning? (If no, remove it.)

### Consistency
- [ ] Am I using the same spring config for all similar animations?
- [ ] Are all spacings multiples of 8?
- [ ] Is the color palette limited to defined tokens?
- [ ] Does every scene in the composition share the same visual language?

### Final Check
- [ ] Is the frame less than 60% filled with content? (Breathing room.)
- [ ] Is there at least 5% safe zone padding on all edges?
- [ ] Does the composition look good at the first frame (thumbnail test)?
- [ ] Does the composition look good at the last frame (end state test)?
