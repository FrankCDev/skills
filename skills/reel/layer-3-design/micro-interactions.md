---
name: micro-interactions
description: Animated counters, progress bars, text highlights, staggered reveals, shimmer effects, particles, cursor animations, and icon transitions
metadata:
  tags: counter, progress, highlight, underline, particles, shimmer, cursor, icon, micro-animation, stagger
---

# Micro-Interactions

Micro-interactions are the small, focused animations that bring data and UI elements to life. A number that counts up. A progress bar that fills. An underline that sweeps in. These details are what make a composition feel alive and polished rather than static and flat.

---

## 1. Animated Counters

Animate from 0 to a target value using spring physics. Essential for data presentations, metrics, financial content, and stat reveals.

### Basic Number Counter

```tsx
import React from 'react';
import { useCurrentFrame, spring, interpolate } from 'remotion';

interface NumberCounterProps {
  target: number;
  delay?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix like "$" or "+" */
  prefix?: string;
  /** Suffix like "%" or "K" */
  suffix?: string;
  /** Add comma separators. Default: true */
  commas?: boolean;
}

const NumberCounter: React.FC<NumberCounterProps> = ({
  target,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  commas = true,
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { damping: 200 }, // smooth preset
  });

  const currentValue = interpolate(progress, [0, 1], [0, target]);

  let formatted = currentValue.toFixed(decimals);
  if (commas) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');
  }

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default NumberCounter;
```

### Stat Reveal Scene

The key to convincing counter animations: use `fontVariantNumeric: 'tabular-nums'` so all digits have equal width and the number does not shift horizontally as it counts up.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const StatRevealScene: React.FC = () => {
  const frame = useCurrentFrame();

  const counter = (target: number, delay: number, decimals = 0) => {
    const progress = spring({
      frame: Math.max(0, frame - delay),
      fps: 30,
      config: { damping: 200 },
    });
    const value = interpolate(progress, [0, 1], [0, target]);
    return decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString();
  };

  const fadeUp = (delay: number) => {
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps: 30,
      config: { damping: 200 },
    });
    return {
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
    };
  };

  return (
    <AbsoluteFill
      style={{ backgroundColor: '#0A0A0F', justifyContent: 'center', padding: 96 }}
    >
      <h2 style={{ fontSize: 32, fontWeight: 600, color: '#86868B', margin: 0, ...fadeUp(0) }}>
        Q4 Performance
      </h2>

      <div style={{ display: 'flex', gap: 64, marginTop: 48 }}>
        <div style={fadeUp(6)}>
          <p
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: '#F5F5F7',
              margin: 0,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${counter(2400000, 6)}
          </p>
          <p style={{ fontSize: 20, color: '#86868B', margin: 0, marginTop: 8 }}>Revenue</p>
        </div>

        <div style={fadeUp(12)}>
          <p
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: '#F5F5F7',
              margin: 0,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {counter(847000, 12)}
          </p>
          <p style={{ fontSize: 20, color: '#86868B', margin: 0, marginTop: 8 }}>Active Users</p>
        </div>

        <div style={fadeUp(18)}>
          <p
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: '#34C759',
              margin: 0,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            +{counter(47.5, 18, 1)}%
          </p>
          <p style={{ fontSize: 20, color: '#86868B', margin: 0, marginTop: 8 }}>Growth</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

## 2. Progress Bars

### Horizontal Progress Bar

A bar that fills with spring easing. Use for completion percentages, skill levels, or comparative metrics.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

interface ProgressBarProps {
  /** Value from 0 to 100 */
  value: number;
  delay?: number;
  color?: string;
  bgColor?: string;
  height?: number;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  delay = 0,
  color = '#0A84FF',
  bgColor = 'rgba(255, 255, 255, 0.08)',
  height = 8,
  label,
  showPercentage = false,
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { damping: 200 },
  });

  const width = interpolate(progress, [0, 1], [0, value]);

  return (
    <div>
      {(label || showPercentage) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {label && (
            <span style={{ fontSize: 18, fontWeight: 500, color: '#F5F5F7' }}>{label}</span>
          )}
          {showPercentage && (
            <span style={{ fontSize: 18, fontWeight: 500, color: '#86868B', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(width)}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: bgColor,
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: '100%',
            background: color,
            borderRadius: height / 2,
          }}
        />
      </div>
    </div>
  );
};
```

### Staggered Progress Bars

```tsx
const SkillBarsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const bars = [
    { label: 'TypeScript', value: 92, color: '#0A84FF' },
    { label: 'React', value: 87, color: '#5E5CE6' },
    { label: 'Node.js', value: 78, color: '#34C759' },
    { label: 'Python', value: 65, color: '#FF9F0A' },
    { label: 'Rust', value: 42, color: '#FF3B30' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F', justifyContent: 'center', padding: 96 }}>
      <h2 style={{ fontSize: 44, fontWeight: 700, color: '#F5F5F7', margin: 0, marginBottom: 48 }}>
        Skills Overview
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800 }}>
        {bars.map((bar, index) => {
          const delay = 8 + index * 4; // 4-frame stagger
          const s = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { damping: 200 } });
          const barWidth = interpolate(s, [0, 1], [0, bar.value]);

          return (
            <div
              key={bar.label}
              style={{
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 500, color: '#F5F5F7' }}>{bar.label}</span>
                <span style={{ fontSize: 20, fontWeight: 500, color: '#86868B', fontVariantNumeric: 'tabular-nums' }}>
                  {Math.round(barWidth)}%
                </span>
              </div>
              <div style={{ width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${barWidth}%`, height: '100%', background: bar.color, borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

### Circular Progress

An SVG-based circular progress indicator for single metrics, scores, or completion states.

```tsx
import React from 'react';
import { useCurrentFrame, spring, interpolate } from 'remotion';

interface CircularProgressProps {
  value: number;
  delay?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  delay = 0,
  size = 200,
  strokeWidth = 8,
  color = '#0A84FF',
  bgColor = 'rgba(255, 255, 255, 0.1)',
  label,
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { damping: 200 },
  });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const currentValue = interpolate(progress, [0, 1], [0, value]);
  const strokeDashoffset = circumference - (currentValue / 100) * circumference;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{ fontSize: size * 0.22, fontWeight: 700, color: '#F5F5F7', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(currentValue)}%
        </p>
        {label && (
          <p style={{ fontSize: size * 0.08, fontWeight: 500, color: '#86868B', margin: 0, marginTop: 4 }}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
};
```

---

## 3. Text Highlights

### Animated Underline

An underline that wipes in from left to right, drawing attention to a word or phrase.

```tsx
import React from 'react';
import { useCurrentFrame, spring } from 'remotion';

interface HighlightUnderlineProps {
  children: React.ReactNode;
  delay?: number;
  color?: string;
  thickness?: number;
}

const HighlightUnderline: React.FC<HighlightUnderlineProps> = ({
  children,
  delay = 0,
  color = '#0A84FF',
  thickness = 4,
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { damping: 200 },
  });

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: -4,
          left: 0,
          width: '100%',
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
        }}
      />
    </span>
  );
};
```

### Background Sweep

A highlight rectangle that expands behind text from left to right, like a text marker.

```tsx
import React from 'react';
import { useCurrentFrame, spring } from 'remotion';

interface TextHighlightProps {
  children: React.ReactNode;
  delay?: number;
  color?: string;
}

const TextHighlight: React.FC<TextHighlightProps> = ({
  children,
  delay = 0,
  color = 'rgba(10, 132, 255, 0.2)',
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { damping: 200 },
  });

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span
        style={{
          position: 'absolute',
          inset: '-4px -8px',
          backgroundColor: color,
          borderRadius: 6,
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
          zIndex: -1,
        }}
      />
      {children}
    </span>
  );
};
```

### Usage

```tsx
import { AbsoluteFill } from 'remotion';

const HighlightScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0F', justifyContent: 'center', padding: 96 }}>
    <h1 style={{ fontSize: 64, fontWeight: 700, color: '#F5F5F7', margin: 0 }}>
      We make{' '}
      <HighlightUnderline delay={15} color="#0A84FF">
        beautiful
      </HighlightUnderline>{' '}
      videos
    </h1>
    <p style={{ fontSize: 32, color: '#F5F5F7', lineHeight: 1.8, marginTop: 32 }}>
      Our platform processed{' '}
      <TextHighlight delay={25} color="rgba(52, 199, 89, 0.2)">
        <strong>2.4 billion</strong>
      </TextHighlight>{' '}
      transactions this quarter.
    </p>
  </AbsoluteFill>
);
```

---

## 4. Staggered List Reveals

Items entering one by one with a consistent delay creates a cascade effect that guides the eye through content in reading order. Use a 4-frame stagger at 30fps (133ms) as the default.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

const STAGGER_DELAY = 4; // frames between each item

interface StaggeredListProps {
  items: Array<{ title: string; description: string }>;
  titleDelay?: number;
}

const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  titleDelay = 0,
}) => {
  const frame = useCurrentFrame();

  const fadeUp = (delay: number) => {
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps: 30,
      config: { damping: 200 },
    });
    return {
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F', justifyContent: 'center', padding: 96 }}>
      <h2
        style={{
          fontSize: 44,
          fontWeight: 700,
          color: '#F5F5F7',
          margin: 0,
          marginBottom: 48,
          ...fadeUp(titleDelay),
        }}
      >
        Key Features
      </h2>

      {items.map((item, index) => {
        const itemDelay = titleDelay + 8 + index * STAGGER_DELAY;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              marginBottom: 32,
              ...fadeUp(itemDelay),
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#0A84FF',
                flexShrink: 0,
                marginTop: 10,
              }}
            />
            <div>
              <p style={{ fontSize: 24, fontWeight: 600, color: '#F5F5F7', margin: 0 }}>
                {item.title}
              </p>
              <p style={{ fontSize: 18, color: '#86868B', margin: 0, marginTop: 4, lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Usage
const ListScene: React.FC = () => (
  <StaggeredList
    items={[
      { title: 'Spring-based physics', description: 'Natural motion with mass, damping, and stiffness.' },
      { title: 'Six curated palettes', description: 'Midnight, Dawn, Ocean, Blossom, Mono, Aurora.' },
      { title: 'Video-optimized type scale', description: 'Sizes designed for screen viewing distance.' },
      { title: 'Apple-inspired motion', description: 'Smooth entrances, purposeful emphasis, clean exits.' },
    ]}
  />
);
```

---

## 5. Shimmer / Loading Effects

Skeleton loading placeholders with an animated gradient that sweeps across the surface, indicating loading state. Useful for data-driven compositions where content loads progressively.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface ShimmerBlockProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  delay?: number;
}

const ShimmerBlock: React.FC<ShimmerBlockProps> = ({
  width,
  height,
  borderRadius = 8,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  // The shimmer sweeps from left (-100%) to right (+100%) on a 45-frame loop
  const cyclePosition = (adjustedFrame % 45) / 45;
  const translateX = interpolate(cyclePosition, [0, 1], [-100, 100]);

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 40%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.06) 60%,
            transparent 100%
          )`,
          transform: `translateX(${translateX}%)`,
        }}
      />
    </div>
  );
};

// Skeleton loading card
const SkeletonCard: React.FC = () => (
  <div
    style={{
      backgroundColor: '#16161F',
      borderRadius: 20,
      padding: 40,
      border: '1px solid rgba(255, 255, 255, 0.06)',
      width: 480,
    }}
  >
    {/* Avatar placeholder */}
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ShimmerBlock width={48} height={48} borderRadius={24} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <ShimmerBlock width="60%" height={16} delay={2} />
        <ShimmerBlock width="40%" height={12} delay={4} />
      </div>
    </div>

    {/* Content lines */}
    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ShimmerBlock width="100%" height={14} delay={6} />
      <ShimmerBlock width="90%" height={14} delay={8} />
      <ShimmerBlock width="75%" height={14} delay={10} />
    </div>

    {/* Action placeholder */}
    <div style={{ marginTop: 32 }}>
      <ShimmerBlock width={120} height={40} borderRadius={10} delay={14} />
    </div>
  </div>
);

const ShimmerScene: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: '#0A0A0F',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <SkeletonCard />
  </AbsoluteFill>
);
```

---

## 6. Particle Effects

### Floating Ambient Particles

Soft, slowly-moving dots that create depth and atmosphere in the background. Use behind glass panels or as scene ambiance.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  offset: number;
}

const generateParticles = (count: number, seed: number): Particle[] => {
  // Deterministic pseudo-random for consistent renders
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const s = Math.sin(seed + i * 127.1) * 43758.5453;
    const rand = s - Math.floor(s);
    const s2 = Math.sin(seed + i * 269.5) * 43758.5453;
    const rand2 = s2 - Math.floor(s2);
    const s3 = Math.sin(seed + i * 419.3) * 43758.5453;
    const rand3 = s3 - Math.floor(s3);

    particles.push({
      x: rand * 100,
      y: rand2 * 100,
      size: 2 + rand3 * 4,
      speed: 0.3 + rand * 0.7,
      opacity: 0.15 + rand2 * 0.25,
      offset: rand3 * 200,
    });
  }
  return particles;
};

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  seed?: number;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 30,
  color = '#0A84FF',
  seed = 42,
}) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => generateParticles(count, seed), [count, seed]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const yOffset = Math.sin((frame + p.offset) * 0.02 * p.speed) * 20;
        const xOffset = Math.cos((frame + p.offset) * 0.015 * p.speed) * 15;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: p.opacity,
              transform: `translate(${xOffset}px, ${yOffset}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

### Confetti Burst

A burst of colored rectangles for celebration moments.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

const CONFETTI_COLORS = ['#0A84FF', '#5E5CE6', '#34C759', '#FF9F0A', '#FF3B30', '#E84393'];

interface ConfettiPiece {
  x: number;
  angle: number;
  speed: number;
  rotationSpeed: number;
  color: string;
  size: number;
  delay: number;
}

const generateConfetti = (count: number): ConfettiPiece[] => {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < count; i++) {
    const s = Math.sin(i * 127.1 + 7.3) * 43758.5453;
    const r1 = s - Math.floor(s);
    const s2 = Math.sin(i * 269.5 + 3.7) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 419.3 + 11.1) * 43758.5453;
    const r3 = s3 - Math.floor(s3);

    pieces.push({
      x: 30 + r1 * 40,
      angle: -90 + (r2 - 0.5) * 120,
      speed: 5 + r3 * 10,
      rotationSpeed: 3 + r1 * 8,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + r2 * 8,
      delay: Math.floor(r3 * 8),
    });
  }
  return pieces;
};

const ConfettiBurst: React.FC<{ startFrame?: number; count?: number }> = ({
  startFrame = 0,
  count = 40,
}) => {
  const frame = useCurrentFrame();
  const pieces = React.useMemo(() => generateConfetti(count), [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map((piece, i) => {
        const elapsed = Math.max(0, frame - startFrame - piece.delay);
        const radians = (piece.angle * Math.PI) / 180;

        const x = 50 + Math.cos(radians) * piece.speed * elapsed * 0.3;
        const y = 50 + Math.sin(radians) * piece.speed * elapsed * 0.3 + elapsed * elapsed * 0.015;
        const rotation = elapsed * piece.rotationSpeed;
        const opacity = interpolate(elapsed, [0, 5, 40, 60], [0, 1, 1, 0], {
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              borderRadius: 2,
              transform: `rotate(${rotation}deg)`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

---

## 7. Cursor / Pointer Animations

Simulated click and tap interactions for UI demo videos. A dot follows a predefined path and "clicks" at specific frames.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

interface AnimatedCursorProps {
  keyframes: CursorKeyframe[];
}

const AnimatedCursor: React.FC<AnimatedCursorProps> = ({ keyframes }) => {
  const frame = useCurrentFrame();

  // Find the current segment
  let currentX = keyframes[0].x;
  let currentY = keyframes[0].y;
  let isClicking = false;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const from = keyframes[i];
    const to = keyframes[i + 1];

    if (frame >= from.frame && frame < to.frame) {
      const segmentProgress = spring({
        frame: Math.max(0, frame - from.frame),
        fps: 30,
        config: { damping: 200 },
        durationInFrames: to.frame - from.frame,
      });

      currentX = interpolate(segmentProgress, [0, 1], [from.x, to.x]);
      currentY = interpolate(segmentProgress, [0, 1], [from.y, to.y]);
      break;
    } else if (frame >= to.frame) {
      currentX = to.x;
      currentY = to.y;
    }
  }

  // Check for click at current frame
  const clickKeyframe = keyframes.find(
    (kf) => kf.click && Math.abs(frame - kf.frame) < 6,
  );

  if (clickKeyframe) {
    const clickProgress = spring({
      frame: Math.max(0, frame - clickKeyframe.frame),
      fps: 30,
      config: { mass: 1, damping: 20, stiffness: 300 }, // snappy
    });
    isClicking = clickProgress < 0.95;
  }

  // Click ripple
  const rippleScale = clickKeyframe
    ? interpolate(
        Math.max(0, frame - (clickKeyframe?.frame ?? 0)),
        [0, 15],
        [0, 1.5],
        { extrapolateRight: 'clamp' },
      )
    : 0;
  const rippleOpacity = clickKeyframe
    ? interpolate(
        Math.max(0, frame - (clickKeyframe?.frame ?? 0)),
        [0, 15],
        [0.4, 0],
        { extrapolateRight: 'clamp' },
      )
    : 0;

  return (
    <>
      {/* Click ripple */}
      {clickKeyframe && rippleOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: currentX - 20,
            top: currentY - 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid #0A84FF',
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Cursor dot */}
      <div
        style={{
          position: 'absolute',
          left: currentX - 8,
          top: currentY - 8,
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          transform: `scale(${isClicking ? 0.8 : 1})`,
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />
    </>
  );
};

// Usage
const CursorDemoScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0F', position: 'relative' }}>
    {/* UI elements the cursor interacts with */}
    <div
      style={{
        position: 'absolute',
        left: 700,
        top: 400,
        padding: '16px 40px',
        backgroundColor: '#0A84FF',
        borderRadius: 12,
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      Get Started
    </div>

    <AnimatedCursor
      keyframes={[
        { frame: 0, x: 960, y: 600 },
        { frame: 20, x: 760, y: 420 },
        { frame: 35, x: 760, y: 420, click: true },
        { frame: 60, x: 500, y: 300 },
      ]}
    />
  </AbsoluteFill>
);
```

---

## 8. Icon Animations

### Scale Bounce

An icon that scales in with a bouncy spring, communicating arrival or emphasis.

```tsx
import React from 'react';
import { useCurrentFrame, spring, interpolate } from 'remotion';

interface AnimatedIconProps {
  children: React.ReactNode;
  delay?: number;
  animation?: 'scaleBounce' | 'rotate' | 'pulse';
  size?: number;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  delay = 0,
  animation = 'scaleBounce',
  size = 56,
}) => {
  const frame = useCurrentFrame();

  const getStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'scaleBounce': {
        // bouncy preset: { mass: 1, damping: 10, stiffness: 200 }
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps: 30,
          config: { mass: 1, damping: 10, stiffness: 200 },
        });
        const scale = interpolate(progress, [0, 1], [0, 1]);
        return { transform: `scale(${scale})`, opacity: progress };
      }

      case 'rotate': {
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps: 30,
          config: { damping: 200 },
        });
        const rotation = interpolate(progress, [0, 1], [-180, 0]);
        return {
          transform: `rotate(${rotation}deg)`,
          opacity: progress,
        };
      }

      case 'pulse': {
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps: 30,
          config: { mass: 1, damping: 10, stiffness: 200 },
        });
        const scale = interpolate(progress, [0, 1], [1, 1.15]);
        return { transform: `scale(${scale})` };
      }

      default:
        return {};
    }
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...getStyle(),
      }}
    >
      {children}
    </div>
  );
};
```

### SVG Checkmark Draw

An animated checkmark that draws its stroke, communicating completion or success.

```tsx
import React from 'react';
import { useCurrentFrame, spring } from 'remotion';

interface CheckmarkDrawProps {
  delay?: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const CheckmarkDraw: React.FC<CheckmarkDrawProps> = ({
  delay = 0,
  size = 64,
  color = '#34C759',
  strokeWidth = 4,
}) => {
  const frame = useCurrentFrame();

  // Circle draws first
  const circleProgress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: { mass: 1, damping: 20, stiffness: 300 }, // snappy
  });

  // Checkmark draws after the circle
  const checkProgress = spring({
    frame: Math.max(0, frame - delay - 8),
    fps: 30,
    config: { mass: 1, damping: 20, stiffness: 300 },
  });

  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const checkPathLength = size * 0.8;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - circleProgress)}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
      <path
        d={`M ${size * 0.28} ${size * 0.5} L ${size * 0.45} ${size * 0.65} L ${size * 0.72} ${size * 0.35}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={checkPathLength}
        strokeDashoffset={checkPathLength * (1 - checkProgress)}
      />
    </svg>
  );
};
```

### Icon State Transition

Morphing between two icon states using opacity crossfade and rotation.

```tsx
import React from 'react';
import { useCurrentFrame, spring, interpolate } from 'remotion';

interface IconTransitionProps {
  /** Frame at which the transition starts */
  transitionFrame: number;
  iconA: React.ReactNode;
  iconB: React.ReactNode;
  size?: number;
}

const IconTransition: React.FC<IconTransitionProps> = ({
  transitionFrame,
  iconA,
  iconB,
  size = 48,
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - transitionFrame),
    fps: 30,
    config: { mass: 1, damping: 20, stiffness: 300 }, // snappy
  });

  const rotationA = interpolate(progress, [0, 1], [0, 90]);
  const rotationB = interpolate(progress, [0, 1], [-90, 0]);
  const opacityA = interpolate(progress, [0, 0.5], [1, 0], { extrapolateRight: 'clamp' });
  const opacityB = interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: opacityA,
          transform: `rotate(${rotationA}deg)`,
        }}
      >
        {iconA}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: opacityB,
          transform: `rotate(${rotationB}deg)`,
        }}
      >
        {iconB}
      </div>
    </div>
  );
};
```

---

## 9. Anti-Patterns

### Over-animating

Not every element needs a micro-interaction. If everything is animated, nothing stands out. Reserve micro-interactions for the 2-3 most important data points per scene.

```tsx
// ANTI-PATTERN: Every element has a different animation
<>
  <div style={{ animation: 'bounce 1s infinite' }}>Title</div>
  <div style={{ animation: 'shake 0.5s infinite' }}>Subtitle</div>
  <div style={{ animation: 'pulse 2s infinite' }}>Body text</div>
  <div style={{ animation: 'spin 3s infinite' }}>Footer</div>
  {/* The viewer's eye has nowhere to rest */}
</>
```

```tsx
// CORRECT: One animated counter, rest uses simple fadeUp
const fadeUp = (delay: number) => { /* spring-based entrance */ };

<>
  <h2 style={fadeUp(0)}>Revenue</h2>
  <p style={{ ...fadeUp(6), fontVariantNumeric: 'tabular-nums' }}>
    ${animatedCounter(2400000, 6)} {/* The ONE animated element */}
  </p>
  <p style={fadeUp(12)}>A 47% increase over last year.</p>
</>
```

### Conflicting timings

Using different stagger delays or spring configs in the same scene creates visual chaos. All related elements should share the same timing DNA.

```tsx
// ANTI-PATTERN: Random timing values
const item1 = spring({ frame, config: { damping: 200 } });
const item2 = spring({ frame: frame - 3, config: { mass: 2, damping: 10, stiffness: 50 } });
const item3 = spring({ frame: frame - 17, config: { damping: 200 } });
// Inconsistent delays (0, 3, 17) and mixed spring configs
```

```tsx
// CORRECT: Consistent timing system
const STAGGER = 4;
const CONFIG = { damping: 200 }; // smooth preset everywhere

const item1 = spring({ frame, config: CONFIG });
const item2 = spring({ frame: Math.max(0, frame - STAGGER), config: CONFIG });
const item3 = spring({ frame: Math.max(0, frame - STAGGER * 2), config: CONFIG });
```

### Performance issues with particles

Too many particles or too-frequent recomputation can slow the Remotion Studio preview. Keep particle counts under 50 for ambient effects. Use `React.useMemo` for particle generation to avoid recalculating positions on every render.

```tsx
// ANTI-PATTERN: Regenerating particles every frame
const FloatingDots: React.FC = () => {
  // This creates new particle positions on EVERY render
  const particles = Array.from({ length: 200 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));
  return <>{/* render particles */}</>;
};
```

```tsx
// CORRECT: Memoized deterministic particles
const FloatingDots: React.FC = () => {
  const particles = React.useMemo(
    () => generateParticles(30, 42), // deterministic, computed once
    [],
  );
  return <>{/* render particles */}</>;
};
```

### Animating layout properties

Never animate `width`, `height`, `margin`, `padding`, `top`, or `left`. These trigger layout reflow and are not GPU-composited. Instead animate `transform` and `opacity`.

```tsx
// ANTI-PATTERN: Animating width triggers layout reflow
<div style={{ width: `${interpolate(progress, [0, 1], [0, 300])}px` }}>
  Progress bar
</div>
```

```tsx
// CORRECT: Use scaleX on an inner element
<div style={{ width: 300, overflow: 'hidden' }}>
  <div
    style={{
      width: '100%',
      height: '100%',
      transform: `scaleX(${progress})`,
      transformOrigin: 'left',
      backgroundColor: '#0A84FF',
    }}
  />
</div>
```

### Missing `fontVariantNumeric: 'tabular-nums'`

Without tabular numerals, animated numbers shift horizontally as digit widths change (e.g., "1" is narrower than "0"). This creates a jittery, unprofessional look.

```tsx
// ANTI-PATTERN: No tabular nums -- numbers jitter horizontally
<p style={{ fontSize: 80, fontWeight: 800, color: '#F5F5F7' }}>
  {counter(1234567, 0)}
</p>
```

```tsx
// CORRECT: Tabular nums keep digits the same width
<p style={{ fontSize: 80, fontWeight: 800, color: '#F5F5F7', fontVariantNumeric: 'tabular-nums' }}>
  {counter(1234567, 0)}
</p>
```
