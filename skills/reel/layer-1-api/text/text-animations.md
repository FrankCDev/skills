---
name: text-animations
description: Typography and text animation patterns - typewriter effect, word highlight with spring wipe
metadata:
  tags: typography, text, typewriter, highlight, animation, spring, cursor
---

# Text Animations

All text animations must be driven by `useCurrentFrame()`. Never use CSS transitions or Tailwind animation classes.

## Typewriter Effect

Use string slicing to reveal text character by character. Never use per-character opacity.

### Basic Typewriter

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

const CHAR_FRAMES = 2; // Frames per character

export const Typewriter: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const charsVisible = Math.floor(frame / CHAR_FRAMES);
  const typedText = text.slice(0, charsVisible);

  return (
    <div style={{ fontSize: 48, fontFamily: "monospace" }}>
      {typedText}
    </div>
  );
};
```

### Typewriter with Blinking Cursor and Pause

Full implementation with a blinking cursor and a configurable pause after a specific phrase:

```tsx
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FULL_TEXT = "From prompt to motion graphics. This is Remotion.";
const PAUSE_AFTER = "From prompt to motion graphics.";
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;
const PAUSE_SECONDS = 1;

const getTypedText = ({
  frame,
  fullText,
  pauseAfter,
  charFrames,
  pauseFrames,
}: {
  frame: number;
  fullText: string;
  pauseAfter: string;
  charFrames: number;
  pauseFrames: number;
}): string => {
  const pauseIndex = fullText.indexOf(pauseAfter);
  const preLen =
    pauseIndex >= 0 ? pauseIndex + pauseAfter.length : fullText.length;

  let typedChars = 0;
  if (frame < preLen * charFrames) {
    // Phase 1: typing up to the pause point
    typedChars = Math.floor(frame / charFrames);
  } else if (frame < preLen * charFrames + pauseFrames) {
    // Phase 2: pausing
    typedChars = preLen;
  } else {
    // Phase 3: typing the rest
    const postPhase = frame - preLen * charFrames - pauseFrames;
    typedChars = Math.min(
      fullText.length,
      preLen + Math.floor(postPhase / charFrames),
    );
  }
  return fullText.slice(0, typedChars);
};

const Cursor: React.FC<{
  frame: number;
  blinkFrames: number;
  symbol?: string;
}> = ({ frame, blinkFrames, symbol = "\u258C" }) => {
  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <span style={{ opacity }}>{symbol}</span>;
};

export const TypewriterAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pauseFrames = Math.round(fps * PAUSE_SECONDS);

  const typedText = getTypedText({
    frame,
    fullText: FULL_TEXT,
    pauseAfter: PAUSE_AFTER,
    charFrames: CHAR_FRAMES,
    pauseFrames,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <div
        style={{
          color: "#000000",
          fontSize: 72,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        <span>{typedText}</span>
        <Cursor frame={frame} blinkFrames={CURSOR_BLINK_FRAMES} />
      </div>
    </AbsoluteFill>
  );
};
```

**Key techniques:**
- Three-phase typing: type to pause point, pause, type remainder
- Cursor blink via `interpolate` on `frame % blinkFrames` (not CSS animation)
- String slicing with `fullText.slice(0, typedChars)` for the reveal

## Word Highlighting

A spring-animated wipe effect that highlights a specific word, like a highlighter pen.

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FULL_TEXT = "This is Remotion.";
const HIGHLIGHT_WORD = "Remotion";
const COLOR_HIGHLIGHT = "#A7C7E7";
const HIGHLIGHT_START_FRAME = 30;
const HIGHLIGHT_WIPE_DURATION = 18;

const { fontFamily } = loadFont();

const Highlight: React.FC<{
  word: string;
  color: string;
  delay: number;
  durationInFrames: number;
}> = ({ word, color, delay, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlightProgress = spring({
    fps,
    frame,
    config: { damping: 200 },
    delay,
    durationInFrames,
  });
  const scaleX = Math.max(0, Math.min(1, highlightProgress));

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {/* Background wipe */}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: "1.05em",
          transform: `translateY(-50%) scaleX(${scaleX})`,
          transformOrigin: "left center",
          backgroundColor: color,
          borderRadius: "0.18em",
          zIndex: 0,
        }}
      />
      {/* Text on top */}
      <span style={{ position: "relative", zIndex: 1 }}>{word}</span>
    </span>
  );
};

export const WordHighlightAnimation = () => {
  const highlightIndex = FULL_TEXT.indexOf(HIGHLIGHT_WORD);
  const hasHighlight = highlightIndex >= 0;
  const preText = hasHighlight ? FULL_TEXT.slice(0, highlightIndex) : FULL_TEXT;
  const postText = hasHighlight
    ? FULL_TEXT.slice(highlightIndex + HIGHLIGHT_WORD.length)
    : "";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          color: "#000000",
          fontSize: 72,
          fontWeight: 700,
        }}
      >
        {hasHighlight ? (
          <>
            <span>{preText}</span>
            <Highlight
              word={HIGHLIGHT_WORD}
              color={COLOR_HIGHLIGHT}
              delay={HIGHLIGHT_START_FRAME}
              durationInFrames={HIGHLIGHT_WIPE_DURATION}
            />
            <span>{postText}</span>
          </>
        ) : (
          <span>{FULL_TEXT}</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Key techniques:**
- `display: "inline-block"` on the wrapper to get the correct width for the highlight background
- `scaleX` transform with `transformOrigin: "left center"` for a left-to-right wipe
- Spring with `damping: 200` for a smooth, non-bouncy wipe
- Text split into pre/highlight/post segments using `indexOf` and `slice`

## Common Mistakes

- **Using per-character opacity for typewriter** -- This produces a fade-in-each-letter effect, not a typewriter. Use string slicing (`text.slice(0, n)`) instead.
- **Using CSS `animation` for the cursor blink** -- CSS animations are forbidden in Remotion. Drive the cursor opacity from `frame % blinkFrames` with `interpolate`.
- **Forgetting `display: "inline-block"` on the highlight wrapper** -- Without it, the absolute-positioned background will not have the correct width.
- **Using `width` instead of `scaleX` for the wipe** -- `scaleX` with `transformOrigin: "left center"` produces a smoother wipe animation than animating width.
- **Hardcoding frame counts without considering `fps`** -- Multiply seconds by `fps` for timing values so animations work correctly at any frame rate.
