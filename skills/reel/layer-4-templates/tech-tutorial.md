---
name: tech-tutorial
description: Template for code demos and step-by-step technical explanations with syntax-highlighted code editor, typewriter effects, and annotated walkthroughs
metadata:
  tags: tutorial, code, developer, tech, demo, walkthrough, programming
---

# Tech Tutorial Template

A complete template for creating polished technical tutorial videos. Features a simulated code editor with line-by-line typewriter reveal, spring-animated annotations, and a clean dark aesthetic built on the Midnight palette.

---

## Storyboard

| Scene | Frames | Duration | Description |
|-------|--------|----------|-------------|
| 1 - Title Card | 0-299 | 10s | Topic name centered on animated gradient background. Label fades up, then title with staggered entrance. Subtle radial glow pulses behind text. |
| 2 - Problem Statement | 300-599 | 10s | Problem icon scales in from center, followed by problem text fading up. Dark surface card contains the problem description. |
| 3 - Code Reveal | 600-1049 | 15s | Simulated code editor with line numbers. Code lines appear one by one with a typewriter effect. Syntax coloring applied per token. Cursor blinks at the end of the current line. |
| 4 - Solution Walkthrough | 1050-1349 | 10s | Code editor shrinks to the left. Annotation arrows spring in from the right pointing to key lines. Explanation text appears next to each arrow with staggered timing. |
| 5 - Result Demo | 1350-1649 | 10s | Side-by-side before/after comparison. Left panel shows the "before" state, right panel shows the "after" state. A divider line animates from center outward. |
| 6 - Outro / CTA | 1650-1799 | 5s | Gradient background fades in. CTA text scales in with bouncy spring. Social handles and subscribe prompt fade up below. |

---

## Design Tokens

### Colors (Midnight Palette)

Reference: `layer-3-design/color.md` - Midnight palette

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

Additional code editor colors:

```ts
const syntaxColors = {
  keyword: '#FF79C6',    // pink for keywords (const, function, return)
  string: '#50FA7B',     // green for string literals
  number: '#BD93F9',     // purple for numbers
  comment: '#6272A4',    // muted blue for comments
  function: '#0A84FF',   // accent blue for function names
  punctuation: '#86868B', // muted for brackets, semicolons
  lineNumber: '#4A4A55', // dim for line numbers
  cursor: '#0A84FF',     // accent for blinking cursor
  editorBg: '#12121A',   // slightly lighter than bg for editor
  gutterBg: '#0E0E16',   // gutter background
};
```

### Typography

Reference: `layer-3-design/typography.md`

- **Headlines**: Inter 700, 60px, letterSpacing `-0.02em`, lineHeight 1.1
- **Body**: Inter 400, 26px, lineHeight 1.5
- **Code**: JetBrains Mono 400, 22px, lineHeight 1.6
- **Labels**: Inter 600, 14px, uppercase, letterSpacing `0.05em`

### Spacing

Reference: `layer-3-design/spacing-layout.md`

- Canvas: 1920x1080 (landscape)
- Safe zone padding: 96px horizontal, 54px vertical
- Section spacing: 48px (xl)
- Element spacing: 24px (md)
- Code line spacing: driven by lineHeight 1.6

### Motion

Reference: `layer-3-design/motion-language.md`

- **Text entrances**: `smooth` spring (`{ damping: 200 }`)
- **Code line reveals**: `snappy` spring (`{ mass: 1, damping: 20, stiffness: 300 }`)
- **Stagger delay**: 4 frames between elements, 3 frames between code lines
- **Annotations**: `smooth` spring with slideFromRight entrance
- **CTA**: `bouncy` spring (`{ mass: 1, damping: 10, stiffness: 200 }`)
- **Background glow**: `gentle` spring (`{ mass: 1, damping: 15, stiffness: 100 }`)

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
  interpolateColors,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

// ---------------------------------------------------------------------------
// Font loading
// ---------------------------------------------------------------------------
const { fontFamily: interFamily } = loadFont();
const { fontFamily: monoFamily } = loadMono();

// ---------------------------------------------------------------------------
// Design tokens
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

const syntax = {
  keyword: '#FF79C6',
  string: '#50FA7B',
  number: '#BD93F9',
  comment: '#6272A4',
  function: '#0A84FF',
  punctuation: '#86868B',
  lineNumber: '#4A4A55',
  cursor: '#0A84FF',
  editorBg: '#12121A',
  gutterBg: '#0E0E16',
};

const springPresets = {
  gentle: { mass: 1, damping: 15, stiffness: 100 },
  smooth: { damping: 200 },
  snappy: { mass: 1, damping: 20, stiffness: 300 },
  bouncy: { mass: 1, damping: 10, stiffness: 200 },
  heavy: { mass: 3, damping: 25, stiffness: 150 },
} as const;

const STAGGER = 4;

// ---------------------------------------------------------------------------
// Content configuration - EDIT THESE to customise
// ---------------------------------------------------------------------------
const CONTENT = {
  label: 'Tech Tutorial',
  title: 'Building a REST API\nwith Express & TypeScript',
  problem: 'Setting up a type-safe API server from scratch is tedious and error-prone without a solid boilerplate.',
  problemIcon: '\u26A0',
  codeLines: [
    { tokens: [{ text: 'import ', color: syntax.keyword }, { text: 'express', color: syntax.string }, { text: ' from ', color: syntax.keyword }, { text: "'express'", color: syntax.string }, { text: ';', color: syntax.punctuation }] },
    { tokens: [{ text: 'import ', color: syntax.keyword }, { text: '{ json }', color: syntax.punctuation }, { text: ' from ', color: syntax.keyword }, { text: "'express'", color: syntax.string }, { text: ';', color: syntax.punctuation }] },
    { tokens: [{ text: '', color: syntax.punctuation }] },
    { tokens: [{ text: 'const ', color: syntax.keyword }, { text: 'app', color: colors.text }, { text: ' = ', color: syntax.punctuation }, { text: 'express', color: syntax.function }, { text: '();', color: syntax.punctuation }] },
    { tokens: [{ text: 'app', color: colors.text }, { text: '.', color: syntax.punctuation }, { text: 'use', color: syntax.function }, { text: '(', color: syntax.punctuation }, { text: 'json', color: syntax.function }, { text: '());', color: syntax.punctuation }] },
    { tokens: [{ text: '', color: syntax.punctuation }] },
    { tokens: [{ text: '// Define a typed route handler', color: syntax.comment }] },
    { tokens: [{ text: 'app', color: colors.text }, { text: '.', color: syntax.punctuation }, { text: 'get', color: syntax.function }, { text: '(', color: syntax.punctuation }, { text: "'/api/users'", color: syntax.string }, { text: ', (req, res) => {', color: syntax.punctuation }] },
    { tokens: [{ text: '  const ', color: syntax.keyword }, { text: 'users', color: colors.text }, { text: ' = ', color: syntax.punctuation }, { text: 'getUsers', color: syntax.function }, { text: '();', color: syntax.punctuation }] },
    { tokens: [{ text: '  res', color: colors.text }, { text: '.', color: syntax.punctuation }, { text: 'json', color: syntax.function }, { text: '(users);', color: syntax.punctuation }] },
    { tokens: [{ text: '});', color: syntax.punctuation }] },
    { tokens: [{ text: '', color: syntax.punctuation }] },
    { tokens: [{ text: 'app', color: colors.text }, { text: '.', color: syntax.punctuation }, { text: 'listen', color: syntax.function }, { text: '(', color: syntax.punctuation }, { text: '3000', color: syntax.number }, { text: ', () => {', color: syntax.punctuation }] },
    { tokens: [{ text: '  console', color: colors.text }, { text: '.', color: syntax.punctuation }, { text: 'log', color: syntax.function }, { text: '(', color: syntax.punctuation }, { text: "'Server running on :3000'", color: syntax.string }, { text: ');', color: syntax.punctuation }] },
    { tokens: [{ text: '});', color: syntax.punctuation }] },
  ],
  annotations: [
    { line: 3, text: 'Initialize Express app' },
    { line: 7, text: 'Type-safe route with GET handler' },
    { line: 12, text: 'Start server on port 3000' },
  ],
  beforeLabel: 'Before',
  beforeText: 'Untyped JavaScript\nNo error handling\nManual JSON parsing',
  afterLabel: 'After',
  afterText: 'Full TypeScript safety\nBuilt-in validation\nAuto-serialization',
  ctaText: 'Subscribe for more tutorials',
  handle: '@yourhandle',
};

// ---------------------------------------------------------------------------
// Utility: reusable fade-up animation
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
  const glowRadius = interpolate(glowProgress, [0, 1], [0, 400]);
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.15]);

  const labelAnim = useFadeUp(0);
  const titleAnim = useFadeUp(8);
  const subtitleAnim = useFadeUp(16);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          width: glowRadius * 2,
          height: glowRadius * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(10, 132, 255, ${glowOpacity}) 0%, transparent 70%)`,
        }}
      />

      <div style={{ textAlign: 'center', padding: 96, zIndex: 1 }}>
        {/* Label */}
        <p
          style={{
            fontFamily: interFamily,
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

        {/* Title */}
        <h1
          style={{
            fontFamily: interFamily,
            fontSize: 60,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            marginTop: 16,
            whiteSpace: 'pre-line',
            ...titleAnim,
          }}
        >
          {CONTENT.title}
        </h1>

        {/* Gradient accent bar */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: colors.gradient,
            margin: '32px auto 0',
            ...subtitleAnim,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: Problem Statement
// ---------------------------------------------------------------------------
const ProblemStatement: React.FC = () => {
  const frame = useCurrentFrame();

  const iconProgress = spring({
    frame,
    fps: 30,
    config: springPresets.smooth,
  });
  const iconScale = interpolate(iconProgress, [0, 1], [0.5, 1]);

  const textAnim = useFadeUp(12);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: 64,
          opacity: iconProgress,
          transform: `scale(${iconScale})`,
          marginBottom: 32,
        }}
      >
        {CONTENT.problemIcon}
      </div>

      {/* Problem card */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 64,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 800,
          textAlign: 'center',
          ...textAnim,
        }}
      >
        <p
          style={{
            fontFamily: interFamily,
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            marginBottom: 16,
          }}
        >
          The Problem
        </p>
        <p
          style={{
            fontFamily: interFamily,
            fontSize: 28,
            fontWeight: 400,
            color: colors.text,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {CONTENT.problem}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: Code Reveal
// ---------------------------------------------------------------------------
const CodeReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CODE_LINE_STAGGER = 3; // frames between each line reveal
  const editorAnim = useFadeUp(0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      {/* Editor chrome */}
      <div
        style={{
          width: 1000,
          backgroundColor: syntax.editorBg,
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          ...editorAnim,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            backgroundColor: syntax.gutterBg,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF5F56' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFBD2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#27C93F' }} />
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 13,
              color: syntax.lineNumber,
              marginLeft: 12,
            }}
          >
            server.ts
          </span>
        </div>

        {/* Code area */}
        <div style={{ padding: '24px 0', minHeight: 400 }}>
          {CONTENT.codeLines.map((line, index) => {
            const lineDelay = 12 + index * CODE_LINE_STAGGER;
            const lineProgress = spring({
              frame: Math.max(0, frame - lineDelay),
              fps,
              config: springPresets.snappy,
            });

            // Typewriter: reveal characters progressively
            const totalChars = line.tokens.reduce((sum, t) => sum + t.text.length, 0);
            const charsToShow = Math.round(
              interpolate(lineProgress, [0, 1], [0, totalChars])
            );

            let charsRendered = 0;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 35,
                  opacity: lineProgress > 0 ? 1 : 0,
                }}
              >
                {/* Line number */}
                <span
                  style={{
                    fontFamily: monoFamily,
                    fontSize: 14,
                    color: syntax.lineNumber,
                    width: 56,
                    textAlign: 'right',
                    paddingRight: 20,
                    userSelect: 'none',
                    flexShrink: 0,
                    backgroundColor: syntax.gutterBg,
                  }}
                >
                  {index + 1}
                </span>

                {/* Code tokens with typewriter */}
                <span style={{ fontFamily: monoFamily, fontSize: 22, lineHeight: 1.6 }}>
                  {line.tokens.map((token, tIdx) => {
                    const tokenStart = charsRendered;
                    charsRendered += token.text.length;
                    const visibleLength = Math.max(
                      0,
                      Math.min(token.text.length, charsToShow - tokenStart)
                    );
                    const visibleText = token.text.slice(0, visibleLength);

                    return (
                      <span key={tIdx} style={{ color: token.color }}>
                        {visibleText}
                      </span>
                    );
                  })}

                  {/* Blinking cursor on last revealed line */}
                  {lineProgress > 0 && lineProgress < 0.99 && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 2,
                        height: 22,
                        backgroundColor: syntax.cursor,
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
// Scene 4: Solution Walkthrough
// ---------------------------------------------------------------------------
const SolutionWalkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const editorAnim = useFadeUp(0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 96,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 48,
      }}
    >
      {/* Shrunken code editor on the left */}
      <div
        style={{
          flex: 1,
          backgroundColor: syntax.editorBg,
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          ...editorAnim,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            backgroundColor: syntax.gutterBg,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5F56' }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFBD2E' }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#27C93F' }} />
        </div>
        <div style={{ padding: '16px 0' }}>
          {CONTENT.codeLines.map((line, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 28,
              }}
            >
              <span
                style={{
                  fontFamily: monoFamily,
                  fontSize: 11,
                  color: syntax.lineNumber,
                  width: 40,
                  textAlign: 'right',
                  paddingRight: 12,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>
              <span style={{ fontFamily: monoFamily, fontSize: 16, lineHeight: 1.6 }}>
                {line.tokens.map((token, tIdx) => (
                  <span key={tIdx} style={{ color: token.color }}>
                    {token.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Annotations on the right */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <p
          style={{
            fontFamily: interFamily,
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
            ...useFadeUp(0),
          }}
        >
          How It Works
        </p>

        {CONTENT.annotations.map((annotation, index) => {
          const delay = 10 + index * 12;
          const progress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: springPresets.smooth,
          });
          const translateX = interpolate(progress, [0, 1], [80, 0]);

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                opacity: progress,
                transform: `translateX(${translateX}px)`,
              }}
            >
              {/* Arrow indicator */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: colors.gradient,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: interFamily,
                }}
              >
                {index + 1}
              </div>

              <div>
                <p
                  style={{
                    fontFamily: monoFamily,
                    fontSize: 14,
                    color: colors.muted,
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  Line {annotation.line + 1}
                </p>
                <p
                  style={{
                    fontFamily: interFamily,
                    fontSize: 22,
                    fontWeight: 500,
                    color: colors.text,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {annotation.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: Result Demo (Before / After)
// ---------------------------------------------------------------------------
const ResultDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dividerProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: springPresets.smooth,
  });
  const dividerScaleY = interpolate(dividerProgress, [0, 1], [0, 1]);

  const leftAnim = useFadeUp(0);
  const rightAnim = useFadeUp(8);

  const PanelCard: React.FC<{
    label: string;
    text: string;
    accentColor: string;
    animStyle: React.CSSProperties;
  }> = ({ label, text, accentColor, animStyle }) => (
    <div
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 48,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        ...animStyle,
      }}
    >
      <p
        style={{
          fontFamily: interFamily,
          fontSize: 14,
          fontWeight: 600,
          color: accentColor,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
          margin: 0,
          marginBottom: 24,
        }}
      >
        {label}
      </p>
      {text.split('\n').map((line, i) => (
        <p
          key={i}
          style={{
            fontFamily: interFamily,
            fontSize: 22,
            fontWeight: 400,
            color: colors.text,
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 96,
      }}
    >
      <div style={{ display: 'flex', gap: 48, width: '100%', alignItems: 'stretch' }}>
        <PanelCard
          label={CONTENT.beforeLabel}
          text={CONTENT.beforeText}
          accentColor="#FF3B30"
          animStyle={leftAnim}
        />

        {/* Divider */}
        <div
          style={{
            width: 2,
            backgroundColor: colors.muted,
            borderRadius: 1,
            transform: `scaleY(${dividerScaleY})`,
            transformOrigin: 'center',
            opacity: dividerProgress,
          }}
        />

        <PanelCard
          label={CONTENT.afterLabel}
          text={CONTENT.afterText}
          accentColor="#34C759"
          animStyle={rightAnim}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: Outro / CTA
// ---------------------------------------------------------------------------
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgProgress = spring({
    frame,
    fps,
    config: springPresets.gentle,
  });

  const ctaProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: springPresets.bouncy,
  });
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.8, 1]);

  const handleAnim = useFadeUp(24);

  return (
    <AbsoluteFill
      style={{
        background: interpolateColors(
          bgProgress,
          [0, 1],
          [colors.bg, '#0D0D1A']
        ),
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background gradient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(10, 132, 255, ${interpolate(bgProgress, [0, 1], [0, 0.12])}) 0%, transparent 70%)`,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        {/* CTA Button */}
        <div
          style={{
            display: 'inline-block',
            padding: '20px 56px',
            background: colors.gradient,
            borderRadius: 16,
            opacity: ctaProgress,
            transform: `scale(${ctaScale})`,
          }}
        >
          <span
            style={{
              fontFamily: interFamily,
              fontSize: 28,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            {CONTENT.ctaText}
          </span>
        </div>

        {/* Handle */}
        <p
          style={{
            fontFamily: interFamily,
            fontSize: 22,
            fontWeight: 400,
            color: colors.muted,
            marginTop: 32,
            ...handleAnim,
          }}
        >
          {CONTENT.handle}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------
export const TechTutorial: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Sequence from={0} durationInFrames={300} name="Title Card">
        <TitleCard />
      </Sequence>

      <Sequence from={300} durationInFrames={300} name="Problem Statement">
        <ProblemStatement />
      </Sequence>

      <Sequence from={600} durationInFrames={450} name="Code Reveal">
        <CodeReveal />
      </Sequence>

      <Sequence from={1050} durationInFrames={300} name="Solution Walkthrough">
        <SolutionWalkthrough />
      </Sequence>

      <Sequence from={1350} durationInFrames={300} name="Result Demo">
        <ResultDemo />
      </Sequence>

      <Sequence from={1650} durationInFrames={150} name="Outro">
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Remotion registration
// ---------------------------------------------------------------------------
export const TechTutorialComposition: React.FC = () => {
  return (
    <Composition
      id="TechTutorial"
      component={TechTutorial}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

---

## Customization Guide

### Changing the topic

Edit the `CONTENT` object at the top of the composition:

| Field | What to change |
|-------|---------------|
| `CONTENT.label` | The small uppercase label above the title (e.g., "React Hook", "DevOps") |
| `CONTENT.title` | The main title text. Use `\n` for line breaks. |
| `CONTENT.problem` | The problem statement shown in Scene 2. |
| `CONTENT.problemIcon` | Emoji or unicode character for the problem icon. |
| `CONTENT.codeLines` | Array of code lines. Each line has a `tokens` array with `{ text, color }` objects for syntax coloring. |
| `CONTENT.annotations` | Array of `{ line, text }` objects pointing to specific code lines in Scene 4. |
| `CONTENT.beforeText` / `CONTENT.afterText` | Before/after comparison text. Use `\n` for line breaks. |
| `CONTENT.ctaText` | Call-to-action button text. |
| `CONTENT.handle` | Your social media handle. |

### Changing the color palette

Replace the `colors` object with any palette from `layer-3-design/color.md`. For example, to use the Aurora palette:

```ts
const colors = {
  bg: '#0F0C29',
  surface: '#1A1640',
  text: '#F0F0F0',
  muted: '#8B8BA3',
  accent: '#A855F7',
  secondary: '#06B6D4',
  gradient: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
};
```

### Adjusting scene timing

Each `<Sequence>` has a `from` (start frame) and `durationInFrames`. At 30fps:
- 30 frames = 1 second
- 150 frames = 5 seconds
- 300 frames = 10 seconds

Adjust these values and update the total `durationInFrames` in the `<Composition>` accordingly.

### Changing the code language

The code is rendered as plain colored tokens. To change the language:
1. Update `CONTENT.codeLines` with your new code
2. Assign syntax colors from the `syntax` object to each token
3. Color conventions: `keyword` for language keywords, `string` for literals, `function` for function names, `number` for numeric values, `comment` for comments

### Adjusting spring presets

All spring presets are defined in the `springPresets` object and reference `layer-3-design/motion-language.md`. Change the preset used in any `useFadeUp()` call or direct `spring()` call:
- `smooth` - professional, no bounce (default)
- `snappy` - quick snap-in, good for code
- `bouncy` - playful, has overshoot
- `gentle` - soft and slow
- `heavy` - dramatic weight

### Adding more code lines

Simply add more entries to `CONTENT.codeLines`. The stagger timing adjusts automatically. If you add many lines, consider increasing the `durationInFrames` of the "Code Reveal" sequence.
