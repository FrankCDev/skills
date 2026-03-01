import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  Easing,
} from 'remotion';

// ---------------------------------------------------------------------------
// Design Tokens (Ocean palette from Layer 3)
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

// Spring presets
const springs = {
  heavy: { mass: 3, damping: 25, stiffness: 150 },
  smooth: { damping: 200 },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const useFadeUp = (delay: number, preset: keyof typeof springs = 'smooth') => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springs[preset],
  });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
  };
};

const useScaleIn = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springs.smooth,
  });
  return {
    opacity: progress,
    transform: `scale(${interpolate(progress, [0, 1], [0.85, 1])})`,
  };
};

// Gradient Text
const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
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
// Scene 1: Title (0-150)
// ---------------------------------------------------------------------------

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: springs.smooth,
  });
  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);

  const subtitleAnim = useFadeUp(12);
  const dividerProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: springs.smooth,
  });

  const labelAnim = useFadeUp(28);

  const exitProgress = frame > 120 ? interpolate(frame, [120, 150], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitProgress,
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at bottom, ${colors.accent}12 0%, transparent 60%)`,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        {/* Label */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            marginBottom: 24,
            ...labelAnim,
          }}
        >
          Data Visualization
        </p>

        {/* Title */}
        <h1
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            color: colors.text,
            opacity: titleProgress,
            transform: `translateY(${titleY}px)`,
          }}
        >
          The Rise of <GradientText>AI</GradientText>
        </h1>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            margin: '32px auto 0',
            transform: `scaleX(${dividerProgress})`,
            transformOrigin: 'center',
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: colors.muted,
            margin: 0,
            marginTop: 24,
            lineHeight: 1.5,
            ...subtitleAnim,
          }}
        >
          A data story
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: Bar Chart (150-450) -- AI Market Size by Year
// ---------------------------------------------------------------------------

const BarChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useFadeUp(0);

  const barData = [
    { year: '2020', value: 62, display: '$62B' },
    { year: '2021', value: 93, display: '$93B' },
    { year: '2022', value: 136, display: '$136B' },
    { year: '2023', value: 197, display: '$197B' },
    { year: '2024', value: 305, display: '$305B' },
  ];

  const maxValue = 305;
  const maxBarHeight = 400;

  const exitProgress = frame > 270 ? interpolate(frame, [270, 300], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 96,
        opacity: exitProgress,
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: 48, ...titleAnim }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
          }}
        >
          Global AI Market
        </p>
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            marginTop: 8,
            lineHeight: 1.2,
          }}
        >
          AI Market Size by Year
        </h2>
        <p style={{ fontSize: 22, color: colors.muted, margin: 0, marginTop: 8 }}>
          Revenue in billions (USD)
        </p>
      </div>

      {/* Chart area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 48,
          paddingBottom: 48,
        }}
      >
        {barData.map((bar, i) => {
          const barDelay = 20 + i * 12;
          const barProgress = spring({
            frame: Math.max(0, frame - barDelay),
            fps,
            config: springs.heavy,
          });
          const barHeight = (bar.value / maxValue) * maxBarHeight * barProgress;

          // Value label appears after bar
          const labelProgress = spring({
            frame: Math.max(0, frame - (barDelay + 15)),
            fps,
            config: springs.smooth,
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Value label */}
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.text,
                  marginBottom: 12,
                  opacity: labelProgress,
                  transform: `translateY(${interpolate(labelProgress, [0, 1], [10, 0])}px)`,
                }}
              >
                {bar.display}
              </div>

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 120,
                  height: barHeight,
                  borderRadius: 12,
                  background:
                    i === barData.length - 1
                      ? colors.gradient
                      : `${colors.accent}40`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Shimmer for last bar */}
                {i === barData.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(180deg, ${colors.accent}30 0%, transparent 100%)`,
                    }}
                  />
                )}
              </div>

              {/* Year label */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: colors.muted,
                  marginTop: 16,
                  opacity: labelProgress,
                }}
              >
                {bar.year}
              </div>
            </div>
          );
        })}
      </div>

      {/* Horizontal axis line */}
      <div
        style={{
          height: 2,
          backgroundColor: `${colors.muted}30`,
          borderRadius: 1,
          marginTop: -48,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Line Chart (450-750) -- Trend line with SVG path
// ---------------------------------------------------------------------------

const LineChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useFadeUp(0);

  // Data points for the trend line (normalized 0-1)
  const dataPoints = [
    { x: 0, y: 0.1 },
    { x: 0.15, y: 0.15 },
    { x: 0.25, y: 0.22 },
    { x: 0.35, y: 0.2 },
    { x: 0.45, y: 0.35 },
    { x: 0.55, y: 0.45 },
    { x: 0.65, y: 0.55 },
    { x: 0.72, y: 0.58 },
    { x: 0.8, y: 0.7 },
    { x: 0.88, y: 0.78 },
    { x: 1, y: 0.95 },
  ];

  const chartWidth = 1400;
  const chartHeight = 500;
  const padding = 40;

  // Build SVG path
  const points = dataPoints.map((p) => ({
    x: padding + p.x * (chartWidth - 2 * padding),
    y: chartHeight - padding - p.y * (chartHeight - 2 * padding),
  }));

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) * 0.5;
    const cp1y = points[i - 1].y;
    const cp2x = points[i - 1].x + (points[i].x - points[i - 1].x) * 0.5;
    const cp2y = points[i].y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  // Path draw animation via dashOffset
  const totalLength = 2000;
  const drawProgress = interpolate(frame, [15, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Area fill path
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${chartHeight - padding}` +
    ` L ${points[0].x} ${chartHeight - padding} Z`;

  const exitProgress = frame > 270 ? interpolate(frame, [270, 300], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  // Dot on the leading edge
  const dotIndex = Math.min(
    points.length - 1,
    Math.floor(drawProgress * (points.length - 1))
  );
  const dotFraction =
    drawProgress * (points.length - 1) - dotIndex;
  const dotX =
    dotIndex < points.length - 1
      ? points[dotIndex].x + (points[dotIndex + 1].x - points[dotIndex].x) * dotFraction
      : points[points.length - 1].x;
  const dotY =
    dotIndex < points.length - 1
      ? points[dotIndex].y + (points[dotIndex + 1].y - points[dotIndex].y) * dotFraction
      : points[points.length - 1].y;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: '54px 96px',
        flexDirection: 'column',
        opacity: exitProgress,
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: 32, ...titleAnim }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
          }}
        >
          Trend Analysis
        </p>
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            marginTop: 8,
            lineHeight: 1.2,
          }}
        >
          AI Adoption Growth
        </h2>
        <p style={{ fontSize: 22, color: colors.muted, margin: 0, marginTop: 8 }}>
          Enterprise adoption rate (2018 - 2024)
        </p>
      </div>

      {/* Chart */}
      <div
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}
      >
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((v, i) => {
            const y = chartHeight - padding - v * (chartHeight - 2 * padding);
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke={`${colors.muted}20`}
                strokeWidth={1}
              />
            );
          })}

          {/* Area fill */}
          <path
            d={areaD}
            fill={`${colors.accent}10`}
            clipPath="url(#lineClip)"
          />

          {/* Clip for area fill to follow animation */}
          <defs>
            <clipPath id="lineClip">
              <rect
                x={0}
                y={0}
                width={padding + drawProgress * (chartWidth - 2 * padding)}
                height={chartHeight}
              />
            </clipPath>
          </defs>

          {/* Main line */}
          <path
            d={pathD}
            fill="none"
            stroke={colors.accent}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={totalLength * (1 - drawProgress)}
          />

          {/* Leading dot */}
          {drawProgress > 0.02 && (
            <>
              <circle
                cx={dotX}
                cy={dotY}
                r={12}
                fill={`${colors.accent}30`}
              />
              <circle
                cx={dotX}
                cy={dotY}
                r={6}
                fill={colors.accent}
              />
            </>
          )}

          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((v, i) => {
            const y = chartHeight - padding - (v / 100) * (chartHeight - 2 * padding);
            return (
              <text
                key={i}
                x={padding - 12}
                y={y + 5}
                textAnchor="end"
                fill={colors.muted}
                fontSize={14}
                fontWeight={500}
              >
                {v}%
              </text>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Comparison (750-1020) -- Side-by-side bars
// ---------------------------------------------------------------------------

const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useFadeUp(0);

  const categories = [
    {
      label: 'Healthcare',
      values: [
        { name: '2022', value: 0.45, color: `${colors.accent}60` },
        { name: '2024', value: 0.82, color: colors.accent },
      ],
    },
    {
      label: 'Finance',
      values: [
        { name: '2022', value: 0.55, color: `${colors.secondary}60` },
        { name: '2024', value: 0.91, color: colors.secondary },
      ],
    },
    {
      label: 'Retail',
      values: [
        { name: '2022', value: 0.35, color: `${colors.accent}60` },
        { name: '2024', value: 0.73, color: colors.accent },
      ],
    },
    {
      label: 'Manufacturing',
      values: [
        { name: '2022', value: 0.4, color: `${colors.secondary}60` },
        { name: '2024', value: 0.68, color: colors.secondary },
      ],
    },
  ];

  const maxBarWidth = 600;

  const exitProgress = frame > 240 ? interpolate(frame, [240, 270], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 96,
        opacity: exitProgress,
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: 48, ...titleAnim }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
          }}
        >
          Industry Comparison
        </p>
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            marginTop: 8,
            lineHeight: 1.2,
          }}
        >
          AI Adoption by Sector
        </h2>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: `${colors.accent}60` }} />
          <span style={{ fontSize: 16, color: colors.muted }}>2022</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: colors.accent }} />
          <span style={{ fontSize: 16, color: colors.muted }}>2024</span>
        </div>
      </div>

      {/* Comparison bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, flex: 1 }}>
        {categories.map((cat, catIndex) => {
          const catDelay = 15 + catIndex * 12;

          return (
            <div key={catIndex}>
              {/* Category label */}
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: colors.text,
                  margin: 0,
                  marginBottom: 16,
                  opacity: spring({
                    frame: Math.max(0, frame - catDelay),
                    fps,
                    config: springs.smooth,
                  }),
                }}
              >
                {cat.label}
              </p>

              {/* Bars */}
              {cat.values.map((v, vi) => {
                const barDelay = catDelay + 5 + vi * 6;
                const barProgress = spring({
                  frame: Math.max(0, frame - barDelay),
                  fps,
                  config: springs.heavy,
                });
                const barWidth = v.value * maxBarWidth * barProgress;

                return (
                  <div
                    key={vi}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: vi < cat.values.length - 1 ? 8 : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: colors.muted,
                        width: 44,
                        flexShrink: 0,
                      }}
                    >
                      {v.name}
                    </span>
                    <div
                      style={{
                        height: 28,
                        width: barWidth,
                        borderRadius: 6,
                        backgroundColor: v.color,
                        position: 'relative',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: colors.text,
                        opacity: barProgress,
                      }}
                    >
                      {Math.round(v.value * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Big Number (1020-1200)
// ---------------------------------------------------------------------------

const BigNumberScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Counter animation for the big number
  const countDuration = 60;
  const countProgress = interpolate(frame, [10, 10 + countDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const displayValue = Math.floor(500 * countProgress);

  const numberProgress = spring({
    frame,
    fps,
    config: springs.heavy,
  });
  const numberScale = interpolate(numberProgress, [0, 1], [0.7, 1]);

  const subtitleAnim = useFadeUp(20);
  const noteAnim = useFadeUp(35);

  const exitProgress = frame > 150 ? interpolate(frame, [150, 180], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitProgress,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at center, ${colors.accent}15 0%, transparent 50%)`,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        {/* Big number */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            opacity: numberProgress,
            transform: `scale(${numberScale})`,
          }}
        >
          <GradientText>${displayValue}B</GradientText>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: colors.text,
            margin: 0,
            marginTop: 24,
            lineHeight: 1.3,
            ...subtitleAnim,
          }}
        >
          Projected AI Market by 2028
        </p>

        {/* Source note */}
        <p
          style={{
            fontSize: 18,
            color: colors.muted,
            margin: 0,
            marginTop: 16,
            ...noteAnim,
          }}
        >
          A 5x increase from 2022
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: Conclusion (1200-1350) -- Source attribution, fade out
// ---------------------------------------------------------------------------

const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useFadeUp(0);
  const dividerProgress = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: springs.smooth,
  });
  const bodyAnim = useFadeUp(18);
  const sourceAnim = useFadeUp(28);

  // Global fade out at the end
  const fadeOut = frame > 120 ? interpolate(frame, [120, 150], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
        opacity: fadeOut,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at bottom, ${colors.accent}08 0%, transparent 60%)`,
        }}
      />

      <div style={{ textAlign: 'center', maxWidth: 800, zIndex: 1 }}>
        {/* Title */}
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            ...titleAnim,
          }}
        >
          The Future is <GradientText>Intelligent</GradientText>
        </h2>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            margin: '32px auto 0',
            transform: `scaleX(${dividerProgress})`,
            transformOrigin: 'center',
          }}
        />

        {/* Body */}
        <p
          style={{
            fontSize: 24,
            color: colors.muted,
            margin: 0,
            marginTop: 32,
            lineHeight: 1.5,
            ...bodyAnim,
          }}
        >
          AI is reshaping every industry, every workflow, every business.
          The companies investing today will lead tomorrow.
        </p>

        {/* Sources */}
        <div
          style={{
            marginTop: 64,
            padding: '24px 40px',
            borderRadius: 16,
            backgroundColor: colors.surface,
            border: '1px solid rgba(255,255,255,0.06)',
            ...sourceAnim,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.muted,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              margin: 0,
              marginBottom: 12,
            }}
          >
            Sources
          </p>
          <p style={{ fontSize: 16, color: colors.muted, margin: 0, lineHeight: 1.6 }}>
            Grand View Research, 2024 -- AI Market Size Report{'\n'}
            McKinsey Global Institute -- The State of AI, 2024{'\n'}
            Statista -- AI Adoption Rates by Industry, 2024
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const DataStoryDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Scene 1: Title */}
      <Sequence from={0} durationInFrames={150}>
        <TitleScene />
      </Sequence>

      {/* Scene 2: Bar Chart */}
      <Sequence from={150} durationInFrames={300}>
        <BarChartScene />
      </Sequence>

      {/* Scene 3: Line Chart */}
      <Sequence from={450} durationInFrames={300}>
        <LineChartScene />
      </Sequence>

      {/* Scene 4: Comparison */}
      <Sequence from={750} durationInFrames={270}>
        <ComparisonScene />
      </Sequence>

      {/* Scene 5: Big Number */}
      <Sequence from={1020} durationInFrames={180}>
        <BigNumberScene />
      </Sequence>

      {/* Scene 6: Conclusion */}
      <Sequence from={1200} durationInFrames={150}>
        <ConclusionScene />
      </Sequence>
    </AbsoluteFill>
  );
};
