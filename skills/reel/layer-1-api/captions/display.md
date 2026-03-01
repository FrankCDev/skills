---
name: display-captions
description: Displaying TikTok-style captions with word highlighting using Sequences in Remotion
metadata:
  tags: captions, subtitles, display, tiktok, highlight, Sequence
---

# Displaying Captions in Remotion

Render captions as TikTok-style pages with per-word highlighting. Assumes captions are already in the [`Caption`](https://www.remotion.dev/docs/captions/caption) format (see [transcribe.md](./transcribe.md)).

## Prerequisites

```bash
npx remotion add @remotion/captions
```

## Fetching captions

Load the JSON file from `public/` using `staticFile()`. Use `useDelayRender()` to hold rendering until data is ready:

```tsx
import { useState, useEffect, useCallback } from "react";
import { AbsoluteFill, staticFile, useDelayRender } from "remotion";
import type { Caption } from "@remotion/captions";

export const MyComponent: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile("captions.json"));
      const data = await response.json();
      setCaptions(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  if (!captions) {
    return null;
  }

  return <AbsoluteFill>{/* Render captions here */}</AbsoluteFill>;
};
```

## Creating pages

Use `createTikTokStyleCaptions()` to group captions into pages. `combineTokensWithinMilliseconds` controls how many words appear at once:

```tsx
import { useMemo } from "react";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption } from "@remotion/captions";

// Higher = more words per page, lower = more word-by-word
const SWITCH_CAPTIONS_EVERY_MS = 1200;

const { pages } = useMemo(() => {
  return createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
  });
}, [captions]);
```

## Rendering with Sequences

Map pages to `<Sequence>` components. Calculate start frame and duration from page timing:

```tsx
import { Sequence, useVideoConfig, AbsoluteFill } from "remotion";
import type { TikTokPage } from "@remotion/captions";

const CaptionedContent: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,
        );
        const durationInFrames = endFrame - startFrame;

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

## Word highlighting

Each page has `tokens` for per-word highlight. Convert frame time to absolute milliseconds:

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";

const HIGHLIGHT_COLOR = "#39E508";

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time relative to the Sequence start
  const currentTimeMs = (frame / fps) * 1000;
  // Convert to absolute time by adding the page start
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 80, fontWeight: "bold", whiteSpace: "pre" }}>
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;

          return (
            <span
              key={token.fromMs}
              style={{ color: isActive ? HIGHLIGHT_COLOR : "white" }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

## White-space preservation

Captions are whitespace-sensitive. Spaces are included in the `text` field before each word. Always use `whiteSpace: "pre"` to preserve them.

## Display captions alongside video

Put captions alongside video content so they stay in sync. Create a separate captions JSON file per video clip.

```tsx
<AbsoluteFill>
  <Video src={staticFile("video.mp4")} />
  <CaptionPage page={page} />
</AbsoluteFill>
```

## Separate component

Put captioning logic in its own file/component for reuse.

## Common mistakes

- Forgetting `whiteSpace: "pre"` -- words will collapse together without spaces.
- Using `useCurrentFrame()` directly as absolute time -- inside a `<Sequence>`, the frame resets to 0. You must add `page.startMs` to get absolute time.
- Placing the captions JSON outside `public/` -- `staticFile()` only serves from `public/`.
- Not wrapping fetch in `useDelayRender()` -- the composition will render before captions load.
- Putting all caption logic in the main composition instead of a separate component.
