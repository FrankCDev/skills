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
// Design Tokens (Midnight palette + type scale from Layer 3)
// ---------------------------------------------------------------------------

const colors = {
  bg: '#0A0A0F',
  surface: '#16161F',
  text: '#F5F5F7',
  muted: '#86868B',
  accent: '#0A84FF',
  secondary: '#5E5CE6',
  gradient: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
};

const editorBg = '#1e1e2e';
const editorGutter = '#2a2a3e';
const editorLine = '#313147';

const syntaxColors = {
  keyword: '#c678dd',
  function: '#61afef',
  string: '#98c379',
  variable: '#e06c75',
  comment: '#5c6370',
  bracket: '#d4d4d4',
  type: '#e5c07b',
  number: '#d19a66',
  operator: '#56b6c2',
  plain: '#abb2bf',
};

// Spring presets
const springs = {
  smooth: { damping: 200 },
  snappy: { mass: 1, damping: 20, stiffness: 300 },
};

// ---------------------------------------------------------------------------
// Helper: entrance animation
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

// ---------------------------------------------------------------------------
// Gradient Text
// ---------------------------------------------------------------------------

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
// Scene 1: Title (frames 0-150)
// ---------------------------------------------------------------------------

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: springs.smooth,
  });
  const titleY = interpolate(titleProgress, [0, 1], [60, 0]);

  const subtitleProgress = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: springs.smooth,
  });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);

  const dividerProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: springs.smooth,
  });

  const labelAnim = useFadeUp(28);

  // Exit fade
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
      {/* Radial glow behind */}
      <div
        style={{
          position: 'absolute',
          width: '80%',
          height: '80%',
          background: `radial-gradient(ellipse at center, ${colors.accent}18 0%, transparent 70%)`,
        }}
      />

      <div style={{ textAlign: 'center' }}>
        {/* Label */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            marginBottom: 16,
            ...labelAnim,
          }}
        >
          Tutorial Series
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
          <GradientText>React Hooks 101</GradientText>
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
            opacity: subtitleProgress,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          Everything you need to know to get started
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: Problem (frames 150-360)
// ---------------------------------------------------------------------------

const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon animation
  const iconProgress = spring({
    frame,
    fps,
    config: springs.snappy,
  });

  const titleAnim = useFadeUp(8);
  const bodyAnim = useFadeUp(18);
  const listItems = [
    'Verbose lifecycle methods',
    'Confusing "this" binding',
    'Hard to reuse stateful logic',
    'Classes feel heavy for simple components',
  ];

  const exitProgress = frame > 180 ? interpolate(frame, [180, 210], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 96,
        justifyContent: 'center',
        opacity: exitProgress,
      }}
    >
      {/* Warning icon */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: `${colors.accent}20`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 32,
          opacity: iconProgress,
          transform: `scale(${interpolate(iconProgress, [0, 1], [0.5, 1])})`,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke={colors.accent}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

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
        The Problem with Class Components
      </h2>

      {/* Body */}
      <p
        style={{
          fontSize: 24,
          color: colors.muted,
          margin: 0,
          marginTop: 24,
          lineHeight: 1.5,
          maxWidth: 700,
          ...bodyAnim,
        }}
      >
        Before hooks, React forced you into patterns that were hard to read,
        hard to test, and hard to share.
      </p>

      {/* Problem list */}
      <div style={{ marginTop: 48 }}>
        {listItems.map((item, i) => {
          const itemDelay = 28 + i * 5;
          const itemProgress = spring({
            frame: Math.max(0, frame - itemDelay),
            fps,
            config: springs.smooth,
          });
          const itemY = interpolate(itemProgress, [0, 1], [20, 0]);

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 20,
                opacity: itemProgress,
                transform: `translateY(${itemY}px)`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.accent,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 26, color: colors.text, fontWeight: 400 }}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Code Reveal (frames 360-720) -- Typewriter code editor
// ---------------------------------------------------------------------------

interface CodeLine {
  text: string;
  indent: number;
  tokens: Array<{ text: string; color: string }>;
}

const codeLines: CodeLine[] = [
  {
    text: "import { useState } from 'react';",
    indent: 0,
    tokens: [
      { text: 'import', color: syntaxColors.keyword },
      { text: ' { ', color: syntaxColors.bracket },
      { text: 'useState', color: syntaxColors.function },
      { text: ' } ', color: syntaxColors.bracket },
      { text: 'from', color: syntaxColors.keyword },
      { text: " '", color: syntaxColors.string },
      { text: 'react', color: syntaxColors.string },
      { text: "';", color: syntaxColors.string },
    ],
  },
  {
    text: '',
    indent: 0,
    tokens: [],
  },
  {
    text: 'function Counter() {',
    indent: 0,
    tokens: [
      { text: 'function', color: syntaxColors.keyword },
      { text: ' Counter', color: syntaxColors.function },
      { text: '() {', color: syntaxColors.bracket },
    ],
  },
  {
    text: '  const [count, setCount] = useState(0);',
    indent: 1,
    tokens: [
      { text: '  const', color: syntaxColors.keyword },
      { text: ' [', color: syntaxColors.bracket },
      { text: 'count', color: syntaxColors.variable },
      { text: ', ', color: syntaxColors.bracket },
      { text: 'setCount', color: syntaxColors.function },
      { text: '] = ', color: syntaxColors.bracket },
      { text: 'useState', color: syntaxColors.function },
      { text: '(', color: syntaxColors.bracket },
      { text: '0', color: syntaxColors.number },
      { text: ');', color: syntaxColors.bracket },
    ],
  },
  {
    text: '',
    indent: 0,
    tokens: [],
  },
  {
    text: '  // Simple, clean, functional',
    indent: 1,
    tokens: [
      { text: '  // Simple, clean, functional', color: syntaxColors.comment },
    ],
  },
  {
    text: '  return (',
    indent: 1,
    tokens: [
      { text: '  return', color: syntaxColors.keyword },
      { text: ' (', color: syntaxColors.bracket },
    ],
  },
  {
    text: '    <button onClick={() => setCount(c => c + 1)}>',
    indent: 2,
    tokens: [
      { text: '    <', color: syntaxColors.bracket },
      { text: 'button', color: syntaxColors.variable },
      { text: ' onClick', color: syntaxColors.type },
      { text: '={', color: syntaxColors.bracket },
      { text: '() =>', color: syntaxColors.keyword },
      { text: ' setCount', color: syntaxColors.function },
      { text: '(', color: syntaxColors.bracket },
      { text: 'c', color: syntaxColors.variable },
      { text: ' => ', color: syntaxColors.keyword },
      { text: 'c', color: syntaxColors.variable },
      { text: ' + ', color: syntaxColors.operator },
      { text: '1', color: syntaxColors.number },
      { text: ')', color: syntaxColors.bracket },
      { text: '}>',  color: syntaxColors.bracket },
    ],
  },
  {
    text: '      Count: {count}',
    indent: 3,
    tokens: [
      { text: '      Count: ', color: syntaxColors.plain },
      { text: '{', color: syntaxColors.bracket },
      { text: 'count', color: syntaxColors.variable },
      { text: '}', color: syntaxColors.bracket },
    ],
  },
  {
    text: '    </button>',
    indent: 2,
    tokens: [
      { text: '    </', color: syntaxColors.bracket },
      { text: 'button', color: syntaxColors.variable },
      { text: '>', color: syntaxColors.bracket },
    ],
  },
  {
    text: '  );',
    indent: 1,
    tokens: [
      { text: '  );', color: syntaxColors.bracket },
    ],
  },
  {
    text: '}',
    indent: 0,
    tokens: [
      { text: '}', color: syntaxColors.bracket },
    ],
  },
];

const CodeRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerAnim = useFadeUp(0);

  // Editor appears
  const editorProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: springs.smooth,
  });

  const framesPerLine = 22;
  const lineStartDelay = 30;

  // Exit
  const exitProgress = frame > 330 ? interpolate(frame, [330, 360], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: '54px 96px',
        flexDirection: 'column',
        opacity: exitProgress,
      }}
    >
      {/* Scene header */}
      <div style={{ marginBottom: 32, ...headerAnim }}>
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
          useState Hook
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
          A Simple Counter
        </h2>
      </div>

      {/* Code editor panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: editorBg,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: editorProgress,
          transform: `translateY(${interpolate(editorProgress, [0, 1], [20, 0])}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            backgroundColor: editorGutter,
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#28c840' }} />
          <span
            style={{
              marginLeft: 16,
              fontSize: 13,
              color: colors.muted,
              fontFamily: 'monospace',
            }}
          >
            Counter.tsx
          </span>
        </div>

        {/* Code area */}
        <div style={{ padding: '24px 0', flex: 1 }}>
          {codeLines.map((line, lineIndex) => {
            const lineDelay = lineStartDelay + lineIndex * framesPerLine;
            const lineProgress = spring({
              frame: Math.max(0, frame - lineDelay),
              fps,
              config: springs.snappy,
            });

            // Typewriter: how many characters are visible
            const totalChars = line.text.length;
            const typewriterFrame = Math.max(0, frame - lineDelay);
            const charsVisible = Math.min(
              totalChars,
              Math.floor(interpolate(typewriterFrame, [0, framesPerLine * 0.7], [0, totalChars], {
                extrapolateRight: 'clamp',
                easing: Easing.linear,
              }))
            );

            // Build visible tokens
            let charCount = 0;

            return (
              <div
                key={lineIndex}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 34,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: 20,
                  lineHeight: 1.6,
                  opacity: lineProgress,
                }}
              >
                {/* Line number */}
                <span
                  style={{
                    width: 56,
                    textAlign: 'right',
                    paddingRight: 20,
                    color: colors.muted,
                    fontSize: 14,
                    userSelect: 'none',
                    flexShrink: 0,
                  }}
                >
                  {lineIndex + 1}
                </span>

                {/* Tokens */}
                <span>
                  {line.tokens.map((token, ti) => {
                    const tokenStart = charCount;
                    charCount += token.text.length;
                    const tokenEnd = charCount;

                    if (tokenStart >= charsVisible) return null;
                    const visibleLen = Math.min(token.text.length, charsVisible - tokenStart);

                    return (
                      <span key={ti} style={{ color: token.color }}>
                        {token.text.slice(0, visibleLen)}
                      </span>
                    );
                  })}
                  {/* Cursor blink */}
                  {charsVisible < totalChars && charsVisible > 0 && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 2,
                        height: 20,
                        backgroundColor: colors.accent,
                        marginLeft: 1,
                        opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                        verticalAlign: 'middle',
                      }}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Walkthrough (frames 720-1080) -- Annotated code with highlights
// ---------------------------------------------------------------------------

const WalkthroughScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const annotations = [
    { label: 'State Declaration', line: 3, description: 'Destructure the state value and setter', delay: 0 },
    { label: 'Initial Value', line: 3, description: 'Pass the initial state as argument', delay: 60 },
    { label: 'Update Function', line: 7, description: 'Use the setter with a callback', delay: 120 },
    { label: 'Render', line: 8, description: 'Read state directly in JSX', delay: 180 },
  ];

  const exitProgress = frame > 330 ? interpolate(frame, [330, 360], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 96,
        opacity: exitProgress,
      }}
    >
      <div style={{ display: 'flex', gap: 64, height: '100%', alignItems: 'center' }}>
        {/* Left: Mini code view */}
        <div
          style={{
            flex: 1,
            backgroundColor: editorBg,
            borderRadius: 16,
            padding: 32,
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
          }}
        >
          {codeLines.slice(0, 12).map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                lineHeight: 1.8,
                color: syntaxColors.plain,
                position: 'relative',
              }}
            >
              {line.tokens.map((t, ti) => (
                <span key={ti} style={{ color: t.color }}>{t.text}</span>
              ))}
              {line.tokens.length === 0 && '\u00A0'}

              {/* Highlight box for active annotation */}
              {annotations.map((ann, ai) => {
                if (ann.line !== i) return null;
                const highlightProgress = spring({
                  frame: Math.max(0, frame - ann.delay),
                  fps,
                  config: springs.snappy,
                });
                const isActive = frame >= ann.delay && frame < ann.delay + 60;
                if (!isActive && frame < ann.delay) return null;

                const activeOpacity = isActive ? 1 : interpolate(frame, [ann.delay + 60, ann.delay + 80], [1, 0.3], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

                return (
                  <div
                    key={ai}
                    style={{
                      position: 'absolute',
                      top: -4,
                      left: -8,
                      right: -8,
                      bottom: -4,
                      backgroundColor: `${colors.accent}15`,
                      border: `2px solid ${colors.accent}`,
                      borderRadius: 8,
                      opacity: highlightProgress * activeOpacity,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Right: Annotation cards */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {annotations.map((ann, i) => {
            const cardProgress = spring({
              frame: Math.max(0, frame - ann.delay),
              fps,
              config: springs.smooth,
            });
            const cardY = interpolate(cardProgress, [0, 1], [30, 0]);
            const isActive = frame >= ann.delay && frame < ann.delay + 60;

            return (
              <div
                key={i}
                style={{
                  backgroundColor: isActive ? `${colors.accent}15` : colors.surface,
                  borderRadius: 16,
                  padding: 32,
                  border: `1px solid ${isActive ? colors.accent : 'rgba(255,255,255,0.08)'}`,
                  opacity: cardProgress,
                  transform: `translateY(${cardY}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: isActive ? colors.accent : colors.muted,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#ffffff',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 600, color: colors.text }}>
                    {ann.label}
                  </span>
                </div>
                <p style={{ fontSize: 18, color: colors.muted, margin: 0, lineHeight: 1.5 }}>
                  {ann.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Demo (frames 1080-1440) -- Before / After comparison
// ---------------------------------------------------------------------------

const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useFadeUp(0);

  const leftProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: springs.smooth,
  });
  const rightProgress = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: springs.smooth,
  });

  const vsProgress = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: springs.snappy,
  });

  const classCode = [
    'class Counter extends Component {',
    '  constructor(props) {',
    '    super(props);',
    '    this.state = { count: 0 };',
    '    this.handleClick =',
    '      this.handleClick.bind(this);',
    '  }',
    '  handleClick() {',
    '    this.setState(prev => ({',
    '      count: prev.count + 1',
    '    }));',
    '  }',
    '  render() {',
    '    return (',
    '      <button onClick={this.handleClick}>',
    '        {this.state.count}',
    '      </button>',
    '    );',
    '  }',
    '}',
  ];

  const hookCode = [
    'function Counter() {',
    '  const [count, setCount]',
    '    = useState(0);',
    '',
    '  return (',
    '    <button',
    '      onClick={() =>',
    '        setCount(c => c + 1)',
    '      }',
    '    >',
    '      {count}',
    '    </button>',
    '  );',
    '}',
  ];

  const exitProgress = frame > 330 ? interpolate(frame, [330, 360], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 96,
        flexDirection: 'column',
        opacity: exitProgress,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 48, ...titleAnim }}>
        <h2 style={{ fontSize: 44, fontWeight: 700, color: colors.text, margin: 0 }}>
          Before & After
        </h2>
        <p style={{ fontSize: 22, color: colors.muted, margin: 0, marginTop: 8 }}>
          See how hooks simplify your components
        </p>
      </div>

      {/* Comparison panels */}
      <div style={{ display: 'flex', gap: 32, flex: 1 }}>
        {/* Before: Class */}
        <div
          style={{
            flex: 1,
            backgroundColor: editorBg,
            borderRadius: 16,
            border: `1px solid ${colors.muted}30`,
            padding: 32,
            opacity: leftProgress,
            transform: `translateX(${interpolate(leftProgress, [0, 1], [-40, 0])}px)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              backgroundColor: '#e06c75',
            }}
          />
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#e06c75',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              margin: 0,
              marginBottom: 20,
            }}
          >
            Before -- Class Component
          </p>
          {classCode.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 16,
                lineHeight: 1.7,
                color: syntaxColors.plain,
              }}
            >
              {line || '\u00A0'}
            </div>
          ))}
          <div
            style={{
              marginTop: 20,
              fontSize: 16,
              fontWeight: 600,
              color: '#e06c75',
            }}
          >
            20 lines
          </div>
        </div>

        {/* VS badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: vsProgress,
            transform: `scale(${interpolate(vsProgress, [0, 1], [0.5, 1])})`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: colors.gradient,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            VS
          </div>
        </div>

        {/* After: Hooks */}
        <div
          style={{
            flex: 1,
            backgroundColor: editorBg,
            borderRadius: 16,
            border: `1px solid ${colors.accent}30`,
            padding: 32,
            opacity: rightProgress,
            transform: `translateX(${interpolate(rightProgress, [0, 1], [40, 0])}px)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: colors.gradient,
            }}
          />
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.accent,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              margin: 0,
              marginBottom: 20,
            }}
          >
            After -- Hooks
          </p>
          {hookCode.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 16,
                lineHeight: 1.7,
                color: syntaxColors.plain,
              }}
            >
              {line || '\u00A0'}
            </div>
          ))}
          <div
            style={{
              marginTop: 20,
              fontSize: 16,
              fontWeight: 600,
              color: colors.accent,
            }}
          >
            14 lines -- 30% less code
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: Outro (frames 1440-1800)
// ---------------------------------------------------------------------------

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: springs.smooth,
  });
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  const subtitleAnim = useFadeUp(10);
  const ctaAnim = useScaleIn(30);

  const tips = ['useState', 'useEffect', 'useContext', 'useReducer', 'useMemo'];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
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

      <div style={{ textAlign: 'center', maxWidth: 800 }}>
        {/* Emoji */}
        <div
          style={{
            fontSize: 64,
            marginBottom: 24,
            opacity: titleProgress,
            transform: `scale(${interpolate(titleProgress, [0, 1], [0.5, 1])})`,
          }}
        >
          {'</>'}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: colors.text,
            margin: 0,
            lineHeight: 1.1,
            opacity: titleProgress,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <GradientText>Happy Coding!</GradientText>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            color: colors.muted,
            margin: 0,
            marginTop: 24,
            lineHeight: 1.5,
            ...subtitleAnim,
          }}
        >
          Now go build something amazing with hooks
        </p>

        {/* Hook badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            marginTop: 48,
            flexWrap: 'wrap',
          }}
        >
          {tips.map((tip, i) => {
            const badgeDelay = 20 + i * 4;
            const badgeProgress = spring({
              frame: Math.max(0, frame - badgeDelay),
              fps,
              config: springs.snappy,
            });

            return (
              <div
                key={i}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  backgroundColor: `${colors.accent}15`,
                  border: `1px solid ${colors.accent}40`,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 18,
                  color: colors.secondary,
                  opacity: badgeProgress,
                  transform: `scale(${interpolate(badgeProgress, [0, 1], [0.7, 1])})`,
                }}
              >
                {tip}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 64, ...ctaAnim }}>
          <div
            style={{
              display: 'inline-block',
              padding: '20px 56px',
              background: colors.gradient,
              borderRadius: 16,
              fontSize: 22,
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            Subscribe for more tutorials
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const TechTutorialDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Scene 1: Title */}
      <Sequence from={0} durationInFrames={150}>
        <TitleScene />
      </Sequence>

      {/* Scene 2: Problem */}
      <Sequence from={150} durationInFrames={210}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: Code Reveal */}
      <Sequence from={360} durationInFrames={360}>
        <CodeRevealScene />
      </Sequence>

      {/* Scene 4: Walkthrough */}
      <Sequence from={720} durationInFrames={360}>
        <WalkthroughScene />
      </Sequence>

      {/* Scene 5: Demo / Before-After */}
      <Sequence from={1080} durationInFrames={360}>
        <DemoScene />
      </Sequence>

      {/* Scene 6: Outro */}
      <Sequence from={1440} durationInFrames={360}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
