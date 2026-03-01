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
// Design Tokens (Dawn palette from Layer 3)
// ---------------------------------------------------------------------------

const colors = {
  bg: '#FAFAF5',
  surface: '#FFFFFF',
  text: '#1D1D1F',
  muted: '#86868B',
  accent: '#FF6B35',
  secondary: '#FF9F1C',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)',
};

// Spring presets
const springs = {
  smooth: { damping: 200 },
  gentle: { mass: 1, damping: 15, stiffness: 100 },
  bouncy: { mass: 1, damping: 10, stiffness: 200 },
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

const useScaleIn = (delay: number, preset: keyof typeof springs = 'smooth') => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springs[preset],
  });
  return {
    opacity: progress,
    transform: `scale(${interpolate(progress, [0, 1], [0.85, 1])})`,
  };
};

// Gradient text helper
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

// Glass card
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderRadius: 24,
      padding: 48,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Scene 1: Hero (0-180)
// ---------------------------------------------------------------------------

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({
    frame,
    fps,
    config: springs.bouncy,
  });

  const titleProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: springs.smooth,
  });
  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);

  const taglineAnim = useFadeUp(16);
  const badgeAnim = useScaleIn(30, 'bouncy');

  const exitProgress = frame > 150 ? interpolate(frame, [150, 180], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #FAFAF5 0%, #fff5eb 40%, #fef3c7 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitProgress,
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}15 0%, transparent 70%)`,
          top: -100,
          right: -100,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
          bottom: -50,
          left: -50,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        {/* Logo icon */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: colors.gradient,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 32px',
            opacity: logoProgress,
            transform: `scale(${interpolate(logoProgress, [0, 1], [0.3, 1])})`,
            boxShadow: `0 12px 40px ${colors.accent}40`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

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
          <GradientText>TaskFlow</GradientText>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: colors.muted,
            margin: 0,
            marginTop: 16,
            lineHeight: 1.5,
            ...taglineAnim,
          }}
        >
          Your tasks, simplified
        </p>

        {/* Badge */}
        <div
          style={{
            marginTop: 48,
            display: 'inline-block',
            ...badgeAnim,
          }}
        >
          <div
            style={{
              padding: '12px 32px',
              borderRadius: 9999,
              backgroundColor: `${colors.accent}15`,
              border: `1px solid ${colors.accent}30`,
              fontSize: 16,
              fontWeight: 600,
              color: colors.secondary,
            }}
          >
            Now Available on All Platforms
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: Feature 1 -- Smart Scheduling (180-420)
// ---------------------------------------------------------------------------

const Feature1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconAnim = useScaleIn(0, 'bouncy');
  const titleAnim = useFadeUp(8);
  const bodyAnim = useFadeUp(16);
  const cardAnim = useScaleIn(24);

  const exitProgress = frame > 210 ? interpolate(frame, [210, 240], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #FAFAF5 0%, #fff5eb 100%)',
        padding: 96,
        opacity: exitProgress,
      }}
    >
      <div style={{ display: 'flex', gap: 64, height: '100%', alignItems: 'center' }}>
        {/* Left: Text */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: colors.gradient,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
              ...iconAnim,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#fff" strokeWidth={2} />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="#fff" />
            </svg>
          </div>

          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.accent,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              margin: 0,
              ...titleAnim,
            }}
          >
            Feature 01
          </p>

          <h2
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: colors.text,
              margin: 0,
              marginTop: 12,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              ...titleAnim,
            }}
          >
            Smart Scheduling
          </h2>

          <p
            style={{
              fontSize: 24,
              color: colors.muted,
              margin: 0,
              marginTop: 24,
              lineHeight: 1.5,
              maxWidth: 500,
              ...bodyAnim,
            }}
          >
            AI-powered scheduling that learns your habits and suggests the
            perfect time for every task. Never miss a deadline again.
          </p>
        </div>

        {/* Right: Glass card mock UI */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', ...cardAnim }}>
          <GlassCard style={{ width: '100%', maxWidth: 500 }}>
            {/* Mini schedule UI */}
            {['9:00 AM - Team Standup', '10:30 AM - Design Review', '2:00 PM - Sprint Planning', '4:00 PM - Code Review'].map(
              (item, i) => {
                const itemProgress = spring({
                  frame: Math.max(0, frame - (30 + i * 5)),
                  fps,
                  config: springs.smooth,
                });
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px 0',
                      borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                      opacity: itemProgress,
                      transform: `translateX(${interpolate(itemProgress, [0, 1], [20, 0])}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: i === 0 ? colors.accent : i === 1 ? colors.secondary : '#d1d5db',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 20, color: colors.text, fontWeight: 500 }}>
                      {item}
                    </span>
                  </div>
                );
              }
            )}
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Feature 2 -- Team Collaboration (420-660)
// ---------------------------------------------------------------------------

const Feature2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useFadeUp(6);
  const bodyAnim = useFadeUp(14);

  const exitProgress = frame > 210 ? interpolate(frame, [210, 240], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  // Avatars in a row
  const avatarColors = ['#0A84FF', '#E84393', '#00D4AA', '#FF6B35', '#A855F7'];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #FAFAF5 0%, #fef3c7 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
        opacity: exitProgress,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 900 }}>
        {/* Icon */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: -12,
            marginBottom: 40,
          }}
        >
          {avatarColors.map((color, i) => {
            const avatarProgress = spring({
              frame: Math.max(0, frame - i * 4),
              fps,
              config: springs.bouncy,
            });
            return (
              <div
                key={i}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: color,
                  border: '3px solid #FFFFFF',
                  marginLeft: i > 0 ? -12 : 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  opacity: avatarProgress,
                  transform: `scale(${interpolate(avatarProgress, [0, 1], [0.3, 1])})`,
                  zIndex: avatarColors.length - i,
                }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            );
          })}
        </div>

        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            ...titleAnim,
          }}
        >
          Feature 02
        </p>

        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            marginTop: 12,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            ...titleAnim,
          }}
        >
          Team Collaboration
        </h2>

        <p
          style={{
            fontSize: 24,
            color: colors.muted,
            margin: '24px auto 0',
            lineHeight: 1.5,
            maxWidth: 600,
            ...bodyAnim,
          }}
        >
          Work together seamlessly. Share tasks, leave comments,
          and track progress in real-time with your entire team.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 48, flexWrap: 'wrap' }}>
          {['Real-time sync', 'Comments', 'File sharing', 'Mentions'].map((pill, i) => {
            const pillProgress = spring({
              frame: Math.max(0, frame - (24 + i * 4)),
              fps,
              config: springs.smooth,
            });
            return (
              <div
                key={i}
                style={{
                  padding: '12px 28px',
                  borderRadius: 9999,
                  backgroundColor: colors.surface,
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontSize: 18,
                  fontWeight: 500,
                  color: colors.text,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  opacity: pillProgress,
                  transform: `translateY(${interpolate(pillProgress, [0, 1], [20, 0])}px)`,
                }}
              >
                {pill}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Feature 3 -- AI Insights (660-900)
// ---------------------------------------------------------------------------

const Feature3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useFadeUp(6);
  const bodyAnim = useFadeUp(14);

  const exitProgress = frame > 210 ? interpolate(frame, [210, 240], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  // Mini bar chart data
  const chartData = [
    { label: 'Mon', value: 0.6 },
    { label: 'Tue', value: 0.8 },
    { label: 'Wed', value: 0.45 },
    { label: 'Thu', value: 0.9 },
    { label: 'Fri', value: 0.7 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #FAFAF5 0%, #fff5eb 100%)',
        padding: 96,
        opacity: exitProgress,
      }}
    >
      <div style={{ display: 'flex', gap: 64, height: '100%', alignItems: 'center' }}>
        {/* Left: Chart card */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <GlassCard style={{ width: '100%', maxWidth: 480 }}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: colors.muted,
                margin: 0,
                marginBottom: 24,
              }}
            >
              Productivity This Week
            </p>

            {/* Bar chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, height: 200 }}>
              {chartData.map((bar, i) => {
                const barProgress = spring({
                  frame: Math.max(0, frame - (20 + i * 6)),
                  fps,
                  config: springs.gentle,
                });
                const barHeight = bar.value * 180 * barProgress;

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: barHeight,
                        borderRadius: 8,
                        background: i === 3 ? colors.gradient : `${colors.accent}30`,
                        transition: 'none',
                      }}
                    />
                    <span style={{ fontSize: 14, color: colors.muted, fontWeight: 500 }}>
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Insight badge */}
            <div
              style={{
                marginTop: 24,
                padding: '10px 16px',
                borderRadius: 12,
                backgroundColor: `${colors.accent}10`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                  fill={colors.accent}
                />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.secondary }}>
                Thursday was your most productive day!
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Right: Text */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: colors.gradient,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
              ...useScaleIn(0, 'bouncy'),
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.accent,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              margin: 0,
              ...titleAnim,
            }}
          >
            Feature 03
          </p>

          <h2
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: colors.text,
              margin: 0,
              marginTop: 12,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              ...titleAnim,
            }}
          >
            AI Insights
          </h2>

          <p
            style={{
              fontSize: 24,
              color: colors.muted,
              margin: 0,
              marginTop: 24,
              lineHeight: 1.5,
              maxWidth: 500,
              ...bodyAnim,
            }}
          >
            Get intelligent insights about your productivity patterns.
            Our AI learns how you work and helps you optimize your time.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Stats (900-1110) -- Animated counters
// ---------------------------------------------------------------------------

const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 10, suffix: 'M+', label: 'Active Users' },
    { value: 4.9, suffix: '', label: 'App Store Rating', decimals: 1 },
    { value: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
  ];

  const titleAnim = useFadeUp(0);

  const exitProgress = frame > 180 ? interpolate(frame, [180, 210], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #FAFAF5 0%, #fef3c7 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
        opacity: exitProgress,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 80, ...titleAnim }}>
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
          Trusted Worldwide
        </p>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            marginTop: 12,
            lineHeight: 1.1,
          }}
        >
          Numbers That Speak
        </h2>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 64 }}>
        {stats.map((stat, i) => {
          const statDelay = 15 + i * 10;
          const statProgress = spring({
            frame: Math.max(0, frame - statDelay),
            fps,
            config: springs.smooth,
          });

          // Counting animation
          const countProgress = interpolate(
            frame,
            [statDelay, statDelay + 45],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
          );
          const displayValue = stat.decimals
            ? (stat.value * countProgress).toFixed(stat.decimals)
            : Math.floor(stat.value * countProgress);

          const statY = interpolate(statProgress, [0, 1], [40, 0]);

          return (
            <div
              key={i}
              style={{
                textAlign: 'center',
                opacity: statProgress,
                transform: `translateY(${statY}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                <GradientText>
                  {displayValue}{stat.suffix}
                </GradientText>
              </div>
              <p
                style={{
                  fontSize: 22,
                  color: colors.muted,
                  margin: 0,
                  marginTop: 12,
                  fontWeight: 500,
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
// Scene 6: CTA (1110-1350)
// ---------------------------------------------------------------------------

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: springs.smooth,
  });
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  const subtitleAnim = useFadeUp(10);

  // Bouncing CTA button
  const ctaProgress = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: springs.bouncy,
  });

  // Continuous subtle pulse after initial animation
  const pulsePhase = Math.max(0, frame - 60);
  const pulse = pulsePhase > 0 ? 1 + Math.sin(pulsePhase * 0.08) * 0.02 : 1;

  const logoAnim = useScaleIn(0, 'bouncy');

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #FAFAF5 0%, #fff5eb 40%, #fef3c7 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at center, ${colors.accent}12 0%, transparent 60%)`,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: colors.gradient,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 40px',
            boxShadow: `0 12px 40px ${colors.accent}40`,
            ...logoAnim,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            color: colors.text,
            opacity: titleProgress,
            transform: `translateY(${titleY}px)`,
          }}
        >
          Ready to get{' '}
          <GradientText>organized</GradientText>?
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 26,
            color: colors.muted,
            margin: 0,
            marginTop: 20,
            lineHeight: 1.5,
            ...subtitleAnim,
          }}
        >
          Join millions of productive teams worldwide
        </p>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 56,
            opacity: ctaProgress,
            transform: `scale(${interpolate(ctaProgress, [0, 1], [0.6, 1]) * pulse})`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '24px 64px',
              background: colors.gradient,
              borderRadius: 16,
              fontSize: 24,
              fontWeight: 700,
              color: '#FFFFFF',
              boxShadow: `0 8px 32px ${colors.accent}40`,
            }}
          >
            Try It Free
          </div>
        </div>

        {/* Small note */}
        <p
          style={{
            fontSize: 16,
            color: colors.muted,
            margin: 0,
            marginTop: 16,
            ...useFadeUp(36),
          }}
        >
          No credit card required
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const ProductShowcaseDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Scene 1: Hero */}
      <Sequence from={0} durationInFrames={180}>
        <HeroScene />
      </Sequence>

      {/* Scene 2: Feature 1 - Smart Scheduling */}
      <Sequence from={180} durationInFrames={240}>
        <Feature1Scene />
      </Sequence>

      {/* Scene 3: Feature 2 - Team Collaboration */}
      <Sequence from={420} durationInFrames={240}>
        <Feature2Scene />
      </Sequence>

      {/* Scene 4: Feature 3 - AI Insights */}
      <Sequence from={660} durationInFrames={240}>
        <Feature3Scene />
      </Sequence>

      {/* Scene 5: Stats */}
      <Sequence from={900} durationInFrames={210}>
        <StatsScene />
      </Sequence>

      {/* Scene 6: CTA */}
      <Sequence from={1110} durationInFrames={240}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
