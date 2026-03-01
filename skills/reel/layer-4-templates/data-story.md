---
name: data-story
description: Template for data narratives with animated bar charts, line charts, counter animations, and clean data visualization using the Ocean palette
metadata:
  tags: data, chart, visualization, analytics, story, bar-chart, line-chart, statistics
---

# Data Story Template

A complete template for data-driven storytelling videos. Features animated bar charts (growing from bottom), animated line charts (path drawing from left to right using `evolvePath` from `@remotion/paths`), big number counter animations, and clean labeled axes. Built on the Ocean palette for a trustworthy, analytical feel.

---

## Storyboard

| Scene | Frames | Duration | Description |
|-------|--------|----------|-------------|
| 1 - Title Card | 0-224 | 7.5s | Story question fades up large and centered ("How fast is AI growing?"). A subtle deep-sea gradient radiates from the bottom. Label above sets context. |
| 2 - Bar Chart | 225-449 | 7.5s | Animated bar chart with 5 data points. Bars grow upward from the baseline with staggered heavy spring. X-axis labels fade in. Y-axis scale visible. |
| 3 - Line Chart | 450-674 | 7.5s | Animated line chart drawing from left to right using evolvePath. Grid lines visible. Data points appear as dots along the path after the line completes. |
| 4 - Comparison | 675-899 | 7.5s | Side-by-side bar pairs for direct comparison (e.g., 2023 vs 2024). Bars grow up with staggered timing. Legend at top indicates which color is which. |
| 5 - Key Insight | 900-1124 | 7.5s | Big number counter animates to the headline stat. Explanation text fades up below. The number uses the display type scale for maximum impact. Pulse emphasis on completion. |
| 6 - Conclusion | 1125-1349 | 7.5s | Summary statement fades up. Source attribution appears at the bottom in caption style. Accent divider separates content from source. |

---

## Design Tokens

### Colors (Ocean Palette)

Reference: `layer-3-design/color.md` - Ocean palette

```ts
const colors = {
  bg: '#0D1B2A',
  surface: '#1B2838',
  text: '#E0E1DD',
  muted: '#778DA9',
  accent: '#00D4AA',
  secondary: '#0077B6',
  gradient: 'linear-gradient(135deg, #00D4AA 0%, #0077B6 100%)',
};
```

Chart-specific colors:

```ts
const chartColors = {
  bar: '#00D4AA',          // primary bar color (accent)
  barSecondary: '#0077B6', // comparison bar color (secondary)
  line: '#00D4AA',         // line chart stroke
  dot: '#00D4AA',          // data point dots
  grid: 'rgba(119, 141, 169, 0.2)', // grid lines
  axis: '#778DA9',         // axis lines and labels
};
```

### Typography

Reference: `layer-3-design/typography.md`

- **Display (Big Numbers)**: Inter 800, 88px, letterSpacing `-0.02em`, lineHeight 1.1
- **Scene Titles**: Inter 700, 60px, letterSpacing `-0.02em`, lineHeight 1.1
- **Section Headers**: Inter 600, 44px, lineHeight 1.3
- **Body / Explanations**: Inter 400, 26px, lineHeight 1.5
- **Axis Labels**: Inter 500, 18px, lineHeight 1.4, letterSpacing `0.02em`
- **Source Attribution**: Inter 500, 16px, letterSpacing `0.02em`
- **Labels**: Inter 600, 14px, uppercase, letterSpacing `0.05em`

### Spacing

Reference: `layer-3-design/spacing-layout.md`

- Canvas: 1920x1080 (landscape)
- Safe zone padding: 96px horizontal, 54px vertical
- Chart area margins: 64px from edges
- Bar gap: 24px (md)
- Axis label offset: 16px (sm)

### Motion

Reference: `layer-3-design/motion-language.md`

- **Bar growth**: `heavy` spring (`{ mass: 3, damping: 25, stiffness: 150 }`) for dramatic reveals
- **Text entrances**: `smooth` spring (`{ damping: 200 }`)
- **Transitions**: `smooth` spring
- **Stagger delay**: 6 frames between bars for dramatic cascade
- **Counter animation**: ease-out interpolation over 60 frames
- **Line chart**: `smooth` spring driving `evolvePath` progress 0 to 1

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
import { evolvePath } from '@remotion/paths';
import { loadFont } from '@remotion/google-fonts/Inter';

// ---------------------------------------------------------------------------
// Font loading
// ---------------------------------------------------------------------------
const { fontFamily } = loadFont();

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const colors = {
  bg: '#0D1B2A',
  surface: '#1B2838',
  text: '#E0E1DD',
  muted: '#778DA9',
  accent: '#00D4AA',
  secondary: '#0077B6',
  gradient: 'linear-gradient(135deg, #00D4AA 0%, #0077B6 100%)',
};

const chartColors = {
  bar: '#00D4AA',
  barSecondary: '#0077B6',
  line: '#00D4AA',
  dot: '#00D4AA',
  grid: 'rgba(119, 141, 169, 0.2)',
  axis: '#778DA9',
};

const springPresets = {
  gentle: { mass: 1, damping: 15, stiffness: 100 },
  smooth: { damping: 200 },
  snappy: { mass: 1, damping: 20, stiffness: 300 },
  bouncy: { mass: 1, damping: 10, stiffness: 200 },
  heavy: { mass: 3, damping: 25, stiffness: 150 },
} as const;

// ---------------------------------------------------------------------------
// Content configuration - EDIT THESE to customise
// ---------------------------------------------------------------------------
const CONTENT = {
  label: 'Data Story',
  question: 'How fast is AI growing?',
  barChart: {
    title: 'Global AI Market Size (Billions USD)',
    data: [
      { label: '2020', value: 62 },
      { label: '2021', value: 93 },
      { label: '2022', value: 137 },
      { label: '2023', value: 208 },
      { label: '2024', value: 305 },
    ],
  },
  lineChart: {
    title: 'AI Adoption Rate by Enterprises (%)',
    data: [
      { x: 0, y: 20 },
      { x: 1, y: 31 },
      { x: 2, y: 47 },
      { x: 3, y: 56 },
      { x: 4, y: 72 },
      { x: 5, y: 78 },
    ],
    xLabels: ['2019', '2020', '2021', '2022', '2023', '2024'],
  },
  comparison: {
    title: 'Investment Growth by Sector',
    legend: { primary: '2023', secondary: '2024' },
    data: [
      { label: 'Healthcare', primary: 45, secondary: 72 },
      { label: 'Finance', primary: 38, secondary: 65 },
      { label: 'Retail', primary: 28, secondary: 51 },
      { label: 'Manufacturing', primary: 22, secondary: 40 },
    ],
  },
  insight: {
    number: 305,
    prefix: '$',
    suffix: 'B',
    description: 'The global AI market has grown nearly 5x since 2020, with enterprise adoption accelerating across every major industry.',
  },
  conclusion: {
    statement: 'AI is not just growing -- it is reshaping every industry at unprecedented speed.',
    source: 'Source: Grand View Research, McKinsey Global Survey 2024',
  },
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
// Scene 1: Title Card
// ---------------------------------------------------------------------------
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();

  const glowProgress = spring({
    frame,
    fps: 30,
    config: springPresets.gentle,
  });
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.2]);

  const labelAnim = useFadeUp(0);
  const questionAnim = useFadeUp(8);
  const barAnim = useFadeUp(18);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Bottom glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '50%',
          background: `radial-gradient(ellipse at bottom, rgba(0, 212, 170, ${glowOpacity}) 0%, transparent 60%)`,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1, padding: 96 }}>
        <p
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            ...labelAnim,
          }}
        >
          {CONTENT.label}
        </p>

        <h1
          style={{
            fontFamily,
            fontSize: 60,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            marginTop: 16,
            ...questionAnim,
          }}
        >
          {CONTENT.question}
        </h1>

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
// Scene 2: Bar Chart
// ---------------------------------------------------------------------------
const BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { data, title } = CONTENT.barChart;
  const maxValue = Math.max(...data.map((d) => d.value));

  const CHART_WIDTH = 1200;
  const CHART_HEIGHT = 500;
  const BAR_GAP = 24;
  const BAR_WIDTH = (CHART_WIDTH - BAR_GAP * (data.length + 1)) / data.length;
  const BAR_STAGGER = 6;

  const titleAnim = useFadeUp(0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      {/* Chart title */}
      <p
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 600,
          color: colors.text,
          margin: 0,
          marginBottom: 48,
          ...titleAnim,
        }}
      >
        {title}
      </p>

      {/* Chart area */}
      <div style={{ position: 'relative', width: CHART_WIDTH, height: CHART_HEIGHT }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: ratio * CHART_HEIGHT,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: chartColors.grid,
            }}
          />
        ))}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              bottom: ratio * CHART_HEIGHT - 10,
              left: -56,
              fontFamily,
              fontSize: 16,
              fontWeight: 500,
              color: chartColors.axis,
              textAlign: 'right',
              width: 48,
            }}
          >
            {Math.round(maxValue * ratio)}
          </span>
        ))}

        {/* Bars */}
        {data.map((item, index) => {
          const delay = 12 + index * BAR_STAGGER;
          const barProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: springPresets.heavy,
          });
          const barHeight = (item.value / maxValue) * CHART_HEIGHT * barProgress;
          const barX = BAR_GAP + index * (BAR_WIDTH + BAR_GAP);

          // Label animation
          const labelProgress = spring({
            frame: Math.max(0, frame - delay - 8),
            fps,
            config: springPresets.smooth,
          });

          return (
            <React.Fragment key={index}>
              {/* Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: barX,
                  width: BAR_WIDTH,
                  height: barHeight,
                  backgroundColor: chartColors.bar,
                  borderRadius: '8px 8px 0 0',
                }}
              />

              {/* Value label above bar */}
              <span
                style={{
                  position: 'absolute',
                  bottom: barHeight + 8,
                  left: barX,
                  width: BAR_WIDTH,
                  textAlign: 'center',
                  fontFamily,
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.accent,
                  opacity: labelProgress,
                }}
              >
                ${item.value}B
              </span>

              {/* X-axis label */}
              <span
                style={{
                  position: 'absolute',
                  bottom: -36,
                  left: barX,
                  width: BAR_WIDTH,
                  textAlign: 'center',
                  fontFamily,
                  fontSize: 18,
                  fontWeight: 500,
                  color: chartColors.axis,
                  opacity: labelProgress,
                }}
              >
                {item.label}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Line Chart
// ---------------------------------------------------------------------------
const LineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { data, title, xLabels } = CONTENT.lineChart;
  const maxY = Math.max(...data.map((d) => d.y));

  const CHART_WIDTH = 1200;
  const CHART_HEIGHT = 500;

  const titleAnim = useFadeUp(0);

  // Build SVG path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - (d.y / maxY) * CHART_HEIGHT;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Animate path drawing using evolvePath
  const drawProgress = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: springPresets.smooth,
  });

  const evolvedPath = evolvePath(drawProgress, pathD);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      {/* Title */}
      <p
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 600,
          color: colors.text,
          margin: 0,
          marginBottom: 48,
          ...titleAnim,
        }}
      >
        {title}
      </p>

      {/* Chart area */}
      <div style={{ position: 'relative', width: CHART_WIDTH, height: CHART_HEIGHT }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: ratio * CHART_HEIGHT,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: chartColors.grid,
            }}
          />
        ))}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              bottom: ratio * CHART_HEIGHT - 10,
              left: -48,
              fontFamily,
              fontSize: 16,
              fontWeight: 500,
              color: chartColors.axis,
              textAlign: 'right',
              width: 40,
            }}
          >
            {Math.round(maxY * ratio)}%
          </span>
        ))}

        {/* SVG line */}
        <svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path
            d={pathD}
            fill="none"
            stroke={chartColors.line}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={evolvedPath.strokeDasharray}
            strokeDashoffset={evolvedPath.strokeDashoffset}
          />
        </svg>

        {/* Data point dots */}
        {points.map((point, index) => {
          const dotDelay = 20 + index * 4;
          const dotProgress = spring({
            frame: Math.max(0, frame - dotDelay),
            fps,
            config: springPresets.bouncy,
          });
          const dotScale = interpolate(dotProgress, [0, 1], [0, 1]);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: point.x - 6,
                top: point.y - 6,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: chartColors.dot,
                border: `2px solid ${colors.bg}`,
                transform: `scale(${dotScale})`,
              }}
            />
          );
        })}

        {/* X-axis labels */}
        {xLabels.map((label, index) => {
          const labelDelay = 16 + index * 3;
          const labelProgress = spring({
            frame: Math.max(0, frame - labelDelay),
            fps,
            config: springPresets.smooth,
          });

          return (
            <span
              key={index}
              style={{
                position: 'absolute',
                bottom: -36,
                left: (index / (xLabels.length - 1)) * CHART_WIDTH - 24,
                width: 48,
                textAlign: 'center',
                fontFamily,
                fontSize: 18,
                fontWeight: 500,
                color: chartColors.axis,
                opacity: labelProgress,
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Comparison
// ---------------------------------------------------------------------------
const ComparisonChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { data, title, legend } = CONTENT.comparison;
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.primary, d.secondary])
  );

  const CHART_WIDTH = 1200;
  const CHART_HEIGHT = 450;
  const GROUP_GAP = 48;
  const BAR_GAP = 8;
  const GROUP_WIDTH = (CHART_WIDTH - GROUP_GAP * (data.length + 1)) / data.length;
  const BAR_WIDTH = (GROUP_WIDTH - BAR_GAP) / 2;
  const BAR_STAGGER = 6;

  const titleAnim = useFadeUp(0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      {/* Title */}
      <p
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 600,
          color: colors.text,
          margin: 0,
          marginBottom: 16,
          ...titleAnim,
        }}
      >
        {title}
      </p>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          marginBottom: 40,
          ...useFadeUp(6),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: chartColors.bar }} />
          <span style={{ fontFamily, fontSize: 16, color: colors.muted }}>{legend.primary}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: chartColors.barSecondary }} />
          <span style={{ fontFamily, fontSize: 16, color: colors.muted }}>{legend.secondary}</span>
        </div>
      </div>

      {/* Chart area */}
      <div style={{ position: 'relative', width: CHART_WIDTH, height: CHART_HEIGHT }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: ratio * CHART_HEIGHT,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: chartColors.grid,
            }}
          />
        ))}

        {/* Bar groups */}
        {data.map((item, index) => {
          const groupX = GROUP_GAP + index * (GROUP_WIDTH + GROUP_GAP);
          const primaryDelay = 12 + index * BAR_STAGGER;
          const secondaryDelay = primaryDelay + 4;

          const primaryProgress = spring({
            frame: Math.max(0, frame - primaryDelay),
            fps,
            config: springPresets.heavy,
          });
          const secondaryProgress = spring({
            frame: Math.max(0, frame - secondaryDelay),
            fps,
            config: springPresets.heavy,
          });

          const primaryHeight = (item.primary / maxValue) * CHART_HEIGHT * primaryProgress;
          const secondaryHeight = (item.secondary / maxValue) * CHART_HEIGHT * secondaryProgress;

          const labelProgress = spring({
            frame: Math.max(0, frame - primaryDelay - 8),
            fps,
            config: springPresets.smooth,
          });

          return (
            <React.Fragment key={index}>
              {/* Primary bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: groupX,
                  width: BAR_WIDTH,
                  height: primaryHeight,
                  backgroundColor: chartColors.bar,
                  borderRadius: '6px 6px 0 0',
                }}
              />
              {/* Secondary bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: groupX + BAR_WIDTH + BAR_GAP,
                  width: BAR_WIDTH,
                  height: secondaryHeight,
                  backgroundColor: chartColors.barSecondary,
                  borderRadius: '6px 6px 0 0',
                }}
              />
              {/* Group label */}
              <span
                style={{
                  position: 'absolute',
                  bottom: -36,
                  left: groupX,
                  width: GROUP_WIDTH,
                  textAlign: 'center',
                  fontFamily,
                  fontSize: 18,
                  fontWeight: 500,
                  color: chartColors.axis,
                  opacity: labelProgress,
                }}
              >
                {item.label}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Key Insight (Big Number)
// ---------------------------------------------------------------------------
const KeyInsight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { number, prefix, suffix, description } = CONTENT.insight;

  const COUNTER_DURATION = 60;
  const counterProgress = Math.min(1, frame / COUNTER_DURATION);
  const easedProgress = 1 - Math.pow(1 - counterProgress, 3);
  const currentValue = Math.round(number * easedProgress);

  // Pulse emphasis when counter reaches target
  const pulseFrame = COUNTER_DURATION + 5;
  const pulseProgress = spring({
    frame: Math.max(0, frame - pulseFrame),
    fps,
    config: springPresets.bouncy,
  });
  const pulseScale = interpolate(pulseProgress, [0, 1], [1, 1.05]);

  const descAnim = useFadeUp(COUNTER_DURATION + 10);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      {/* Radial glow behind the number */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0, 212, 170, 0.12) 0%, transparent 60%)`,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            marginBottom: 16,
            ...useFadeUp(0),
          }}
        >
          Key Insight
        </p>

        <h1
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 800,
            color: colors.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            transform: `scale(${pulseScale})`,
          }}
        >
          {prefix}
          {currentValue.toLocaleString()}
          {suffix}
        </h1>

        <p
          style={{
            fontFamily,
            fontSize: 26,
            fontWeight: 400,
            color: colors.muted,
            lineHeight: 1.5,
            margin: 0,
            marginTop: 32,
            maxWidth: 700,
            ...descAnim,
          }}
        >
          {description}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: Conclusion
// ---------------------------------------------------------------------------
const Conclusion: React.FC = () => {
  const statementAnim = useFadeUp(0);
  const dividerAnim = useFadeUp(12);
  const sourceAnim = useFadeUp(20);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 900 }}>
        <h2
          style={{
            fontFamily,
            fontSize: 44,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            margin: 0,
            ...statementAnim,
          }}
        >
          {CONTENT.conclusion.statement}
        </h2>

        {/* Accent divider */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            margin: '48px auto',
            ...dividerAnim,
          }}
        />

        {/* Source attribution */}
        <p
          style={{
            fontFamily,
            fontSize: 16,
            fontWeight: 500,
            color: colors.muted,
            letterSpacing: '0.02em',
            margin: 0,
            ...sourceAnim,
          }}
        >
          {CONTENT.conclusion.source}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------
export const DataStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Sequence from={0} durationInFrames={225} name="Title Card">
        <TitleCard />
      </Sequence>

      <Sequence from={225} durationInFrames={225} name="Bar Chart">
        <BarChart />
      </Sequence>

      <Sequence from={450} durationInFrames={225} name="Line Chart">
        <LineChart />
      </Sequence>

      <Sequence from={675} durationInFrames={225} name="Comparison">
        <ComparisonChart />
      </Sequence>

      <Sequence from={900} durationInFrames={225} name="Key Insight">
        <KeyInsight />
      </Sequence>

      <Sequence from={1125} durationInFrames={225} name="Conclusion">
        <Conclusion />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Remotion registration
// ---------------------------------------------------------------------------
export const DataStoryComposition: React.FC = () => {
  return (
    <Composition
      id="DataStory"
      component={DataStory}
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

### Changing the data

Edit the `CONTENT` object to tell a different data story:

| Field | What to change |
|-------|---------------|
| `CONTENT.question` | The opening question that hooks viewers |
| `CONTENT.barChart.title` | Title above the bar chart |
| `CONTENT.barChart.data` | Array of `{ label, value }` objects for bars |
| `CONTENT.lineChart.title` | Title above the line chart |
| `CONTENT.lineChart.data` | Array of `{ x, y }` points for the line |
| `CONTENT.lineChart.xLabels` | X-axis labels for the line chart |
| `CONTENT.comparison.data` | Array of `{ label, primary, secondary }` for comparison bars |
| `CONTENT.comparison.legend` | Labels for the two comparison series |
| `CONTENT.insight.number` | The big headline number |
| `CONTENT.insight.prefix` / `suffix` | Text before/after the number (e.g., "$", "B") |
| `CONTENT.insight.description` | Explanation paragraph below the big number |
| `CONTENT.conclusion.statement` | Final takeaway statement |
| `CONTENT.conclusion.source` | Data source attribution |

### Changing the color palette

Replace the `colors` object with any palette from `layer-3-design/color.md`. For a corporate look, use Midnight:

```ts
const colors = {
  bg: '#0A0A0F',
  surface: '#16161F',
  text: '#F5F5F7',
  muted: '#86868B',
  accent: '#0A84FF',
  secondary: '#5E5CE6',
  gradient: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
};
```

Update `chartColors` to match the new palette accents.

### Adjusting chart dimensions

The chart area is controlled by `CHART_WIDTH` and `CHART_HEIGHT` constants in each scene. The bars, line, and grid automatically scale to fit. Adjust these values to change the chart proportions.

### Using evolvePath for the line chart

The line chart uses `evolvePath` from `@remotion/paths` to animate path drawing. The function takes:
- `progress` (0 to 1): how much of the path is drawn
- `pathD`: an SVG path string (M/L commands)

It returns `{ strokeDasharray, strokeDashoffset }` that you apply to the SVG `<path>` element.

### Changing bar growth speed

Bar growth uses the `heavy` spring preset for dramatic weight. To make bars grow faster, switch to `smooth` or `snappy`. To make them even more dramatic, increase `BAR_STAGGER` for more delay between bars.

### Counter animation easing

The key insight counter uses a cubic ease-out (`1 - Math.pow(1 - t, 3)`). For different effects:
- `t` (linear) - constant speed
- `1 - Math.pow(1 - t, 2)` - quadratic ease-out (gentler deceleration)
- `1 - Math.pow(1 - t, 4)` - quartic ease-out (stronger deceleration)

Adjust `COUNTER_DURATION` to change the total counting time.

### Adding more data points

Simply add entries to the data arrays. The charts scale automatically. For more than 6-7 bars, consider reducing `BAR_WIDTH` or increasing `CHART_WIDTH`.

### Scene timing

Each scene is 225 frames (7.5 seconds). Adjust `durationInFrames` on each `<Sequence>` and update the total in `<Composition>`.
