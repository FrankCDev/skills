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
// Design Tokens (Aurora palette from Layer 3)
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

// Spring presets
const springs = {
  snappy: { mass: 1, damping: 20, stiffness: 300 },
  bouncy: { mass: 1, damping: 10, stiffness: 200 },
  elastic: { mass: 1, damping: 8, stiffness: 150 },
};

// Safe zones for vertical (top 15% = 288px, bottom 20% = 384px)
const safeTop = 288;
const safeBottom = 384;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const useFadeUp = (delay: number, preset: keyof typeof springs = 'snappy') => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springs[preset],
  });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
  };
};

const useSlideFromLeft = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springs.snappy,
  });
  return {
    opacity: progress,
    transform: `translateX(${interpolate(progress, [0, 1], [-300, 0])}px)`,
  };
};

const useSlideFromRight = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springs.snappy,
  });
  return {
    opacity: progress,
    transform: `translateX(${interpolate(progress, [0, 1], [300, 0])}px)`,
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

// Number badge
const NumberBadge: React.FC<{
  number: number;
  style?: React.CSSProperties;
}> = ({ number, style }) => (
  <div
    style={{
      width: 56,
      height: 56,
      borderRadius: 16,
      background: colors.gradient,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 28,
      fontWeight: 800,
      color: '#F0F0F0',
      flexShrink: 0,
      ...style,
    }}
  >
    {number}
  </div>
);

// Trick card
const TrickCard: React.FC<{
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  animStyle: React.CSSProperties;
}> = ({ number, title, description, icon, animStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentDelay = 10;
  const contentProgress = spring({
    frame: Math.max(0, frame - contentDelay),
    fps,
    config: springs.snappy,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        padding: '0 54px',
      }}
    >
      {/* Background gradient accent */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at center, ${colors.accent}10 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          ...animStyle,
          paddingTop: safeTop,
          paddingBottom: safeBottom,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        {/* Icon area */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            backgroundColor: `${colors.accent}15`,
            border: `1px solid ${colors.accent}30`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
            opacity: contentProgress,
            transform: `scale(${interpolate(contentProgress, [0, 1], [0.5, 1])})`,
          }}
        >
          {icon}
        </div>

        {/* Number badge + title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 24,
          }}
        >
          <NumberBadge number={number} />
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: colors.text,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: colors.muted,
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 800,
            opacity: contentProgress,
            transform: `translateY(${interpolate(contentProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          {description}
        </p>

        {/* Decorative gradient bar */}
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            marginTop: 32,
            transform: `scaleX(${contentProgress})`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 1: Hook (0-120) -- "5 CSS Tricks" big bold text, scale-in
// ---------------------------------------------------------------------------

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame,
    fps,
    config: springs.elastic,
  });
  const mainScale = interpolate(mainProgress, [0, 1], [0.3, 1]);

  const subtitleAnim = useFadeUp(12);

  // Pulsing background
  const bgPulse = 1 + Math.sin(frame * 0.05) * 0.02;

  const exitProgress = frame > 100 ? interpolate(frame, [100, 120], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitProgress,
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          background: `radial-gradient(ellipse at center, ${colors.accent}18 0%, ${colors.secondary}08 40%, transparent 70%)`,
          transform: `scale(${bgPulse})`,
        }}
      />

      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
          padding: '0 54px',
        }}
      >
        {/* Main title */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            color: colors.text,
            opacity: mainProgress,
            transform: `scale(${mainScale})`,
          }}
        >
          5 CSS Tricks
        </h1>

        {/* Fire emoji line */}
        <div
          style={{
            fontSize: 64,
            marginTop: 16,
            opacity: mainProgress,
            transform: `scale(${mainScale})`,
          }}
        >
          <GradientText style={{ fontSize: 80, fontWeight: 800 }}>
            You Need
          </GradientText>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: colors.muted,
            margin: 0,
            marginTop: 32,
            ...subtitleAnim,
          }}
        >
          Level up your CSS game
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: Trick 1 -- Container Queries (120-270)
// ---------------------------------------------------------------------------

const Trick1Scene: React.FC = () => {
  const slideAnim = useSlideFromLeft(0);

  const exitFrame = useCurrentFrame();
  const exitProgress = exitFrame > 120 ? interpolate(exitFrame, [120, 150], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div style={{ opacity: exitProgress, width: '100%', height: '100%', position: 'absolute' }}>
      <TrickCard
        number={1}
        title="Container Queries"
        description="Style elements based on their container size, not the viewport. Finally, truly responsive components."
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="18" rx="2" stroke={colors.accent} strokeWidth={2} />
            <path d="M9 3v18M2 9h7M2 15h7" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" />
          </svg>
        }
        animStyle={slideAnim}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Trick 2 -- Scroll Animations (270-420)
// ---------------------------------------------------------------------------

const Trick2Scene: React.FC = () => {
  const slideAnim = useSlideFromRight(0);

  const exitFrame = useCurrentFrame();
  const exitProgress = exitFrame > 120 ? interpolate(exitFrame, [120, 150], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div style={{ opacity: exitProgress, width: '100%', height: '100%', position: 'absolute' }}>
      <TrickCard
        number={2}
        title="Scroll Animations"
        description="Drive animations from scroll position with pure CSS. No JavaScript needed for scroll-linked effects."
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v18m0 0l-4-4m4 4l4-4M3 12h4m10 0h4"
              stroke={colors.secondary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        animStyle={slideAnim}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Trick 3 -- :has() Selector (420-570)
// ---------------------------------------------------------------------------

const Trick3Scene: React.FC = () => {
  const slideAnim = useSlideFromLeft(0);

  const exitFrame = useCurrentFrame();
  const exitProgress = exitFrame > 120 ? interpolate(exitFrame, [120, 150], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div style={{ opacity: exitProgress, width: '100%', height: '100%', position: 'absolute' }}>
      <TrickCard
        number={3}
        title=":has() Selector"
        description="The 'parent selector' CSS never had. Style parents based on their children. A game changer for layouts."
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={colors.accent} strokeWidth={2} />
            <path d="M9 12l2 2 4-4" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        animStyle={slideAnim}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Trick 4 -- Subgrid (570-720)
// ---------------------------------------------------------------------------

const Trick4Scene: React.FC = () => {
  const slideAnim = useSlideFromRight(0);

  const exitFrame = useCurrentFrame();
  const exitProgress = exitFrame > 120 ? interpolate(exitFrame, [120, 150], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div style={{ opacity: exitProgress, width: '100%', height: '100%', position: 'absolute' }}>
      <TrickCard
        number={4}
        title="Subgrid"
        description="Child elements inherit the parent's grid. Perfect alignment across complex nested layouts, effortlessly."
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke={colors.secondary} strokeWidth={2} />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke={colors.secondary} strokeWidth={2} />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke={colors.secondary} strokeWidth={2} />
            <rect x="14" y="14" width="7" height="7" rx="1" stroke={colors.secondary} strokeWidth={2} />
          </svg>
        }
        animStyle={slideAnim}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: CTA (720-900) -- "Follow @csstricks" with bounce
// ---------------------------------------------------------------------------

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: springs.bouncy,
  });
  const titleScale = interpolate(titleProgress, [0, 1], [0.3, 1]);

  const handleAnim = useFadeUp(12, 'snappy');
  const buttonAnim = useFadeUp(24, 'bouncy');

  // Continuous bounce for the button
  const bouncePhase = Math.max(0, frame - 50);
  const bounce = bouncePhase > 0 ? Math.sin(bouncePhase * 0.12) * 8 : 0;

  // Trick 5 reveal
  const trick5Delay = 8;
  const trick5Progress = spring({
    frame: Math.max(0, frame - trick5Delay),
    fps,
    config: springs.snappy,
  });

  // Fade out at the end
  const fadeOut = frame > 160 ? interpolate(frame, [160, 180], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Gradient background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at center, ${colors.accent}15 0%, ${colors.secondary}08 40%, transparent 70%)`,
        }}
      />

      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
          padding: `${safeTop}px 54px ${safeBottom}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* Bonus trick 5 */}
        <div
          style={{
            marginBottom: 48,
            opacity: trick5Progress,
            transform: `translateY(${interpolate(trick5Progress, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 28px',
              borderRadius: 16,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.accent}30`,
            }}
          >
            <NumberBadge number={5} style={{ width: 40, height: 40, borderRadius: 12, fontSize: 20 }} />
            <span style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              Nesting
            </span>
          </div>
          <p
            style={{
              fontSize: 20,
              color: colors.muted,
              margin: 0,
              marginTop: 12,
              lineHeight: 1.5,
            }}
          >
            Native CSS nesting is here!
          </p>
        </div>

        {/* Main text */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            color: colors.text,
            opacity: titleProgress,
            transform: `scale(${titleScale})`,
          }}
        >
          Want more{'\n'}
          <GradientText>CSS tips</GradientText>?
        </h1>

        {/* Handle */}
        <div
          style={{
            marginTop: 40,
            ...handleAnim,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.accent,
            }}
          >
            @csstricks
          </span>
        </div>

        {/* Follow button */}
        <div
          style={{
            marginTop: 40,
            ...buttonAnim,
            transform: `translateY(${bounce}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '20px 64px',
              background: colors.gradient,
              borderRadius: 16,
              fontSize: 26,
              fontWeight: 700,
              color: '#F0F0F0',
              boxShadow: `0 8px 32px ${colors.accent}40`,
            }}
          >
            Follow for More
          </div>
        </div>

        {/* Like & share reminder */}
        <p
          style={{
            fontSize: 20,
            color: colors.muted,
            margin: 0,
            marginTop: 32,
            ...useFadeUp(40),
          }}
        >
          Save this for later!
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition (Vertical 9:16 -- 1080x1920)
// ---------------------------------------------------------------------------

export const SocialShortDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Scene 1: Hook */}
      <Sequence from={0} durationInFrames={120}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Trick 1 - Container Queries */}
      <Sequence from={120} durationInFrames={150}>
        <Trick1Scene />
      </Sequence>

      {/* Scene 3: Trick 2 - Scroll Animations */}
      <Sequence from={270} durationInFrames={150}>
        <Trick2Scene />
      </Sequence>

      {/* Scene 4: Trick 3 - :has() Selector */}
      <Sequence from={420} durationInFrames={150}>
        <Trick3Scene />
      </Sequence>

      {/* Scene 5: Trick 4 - Subgrid */}
      <Sequence from={570} durationInFrames={150}>
        <Trick4Scene />
      </Sequence>

      {/* Scene 6: CTA */}
      <Sequence from={720} durationInFrames={180}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
