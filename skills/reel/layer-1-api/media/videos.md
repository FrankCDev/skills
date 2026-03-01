---
name: videos
description: Embedding videos in Remotion - trimming, volume, speed, looping, pitch
metadata:
  tags: video, media, trim, volume, speed, loop, pitch, playback
---

# Videos

## Prerequisites

The `@remotion/media` package must be installed:

```bash
npx remotion add @remotion/media # If project uses npm
bunx remotion add @remotion/media # If project uses bun
yarn remotion add @remotion/media # If project uses yarn
pnpm exec remotion add @remotion/media # If project uses pnpm
```

## Basic Usage

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Video src={staticFile("video.mp4")} />;
};
```

Remote URLs are also supported:

```tsx
<Video src="https://remotion.media/video.mp4" />
```

## Trimming

Use `trimBefore` and `trimAfter` to remove portions. Values are in **frames**.

```tsx
const { fps } = useVideoConfig();

return (
  <Video
    src={staticFile("video.mp4")}
    trimBefore={2 * fps} // Skip the first 2 seconds
    trimAfter={10 * fps} // End at the 10 second mark
  />
);
```

## Delaying

Wrap in a `<Sequence>` to delay when the video appears:

```tsx
import { Sequence, staticFile } from "remotion";
import { Video } from "@remotion/media";

const { fps } = useVideoConfig();

return (
  <Sequence from={1 * fps}>
    <Video src={staticFile("video.mp4")} />
  </Sequence>
);
```

## Sizing and Position

```tsx
<Video
  src={staticFile("video.mp4")}
  style={{
    width: 500,
    height: 300,
    position: "absolute",
    top: 100,
    left: 50,
    objectFit: "cover",
  }}
/>
```

## Volume

Static volume (0 to 1):

```tsx
<Video src={staticFile("video.mp4")} volume={0.5} />
```

Dynamic volume via callback (frame `f` starts at 0 when the video begins playing):

```tsx
import { interpolate } from "remotion";

const { fps } = useVideoConfig();

return (
  <Video
    src={staticFile("video.mp4")}
    volume={(f) =>
      interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })
    }
  />
);
```

Mute entirely:

```tsx
<Video src={staticFile("video.mp4")} muted />
```

## Speed

```tsx
<Video src={staticFile("video.mp4")} playbackRate={2} />   {/* 2x speed */}
<Video src={staticFile("video.mp4")} playbackRate={0.5} /> {/* Half speed */}
```

Reverse playback is NOT supported.

## Looping

```tsx
<Video src={staticFile("video.mp4")} loop />
```

Control how the frame count in the `volume` callback behaves during loops:

- `"repeat"`: frame resets to 0 each loop
- `"extend"`: frame continues incrementing

```tsx
<Video
  src={staticFile("video.mp4")}
  loop
  loopVolumeCurveBehavior="extend"
  volume={(f) => interpolate(f, [0, 300], [1, 0])} // Fade out over multiple loops
/>
```

## Pitch

Adjust pitch without affecting speed using `toneFrequency` (range: 0.01 to 2):

```tsx
<Video src={staticFile("video.mp4")} toneFrequency={1.5} /> {/* Higher pitch */}
<Video src={staticFile("video.mp4")} toneFrequency={0.8} /> {/* Lower pitch */}
```

Pitch shifting only works during **server-side rendering**, not in the Studio preview or `<Player />`.

## Common Mistakes

- **Importing `Video` from `remotion` instead of `@remotion/media`** -- The `Video` component lives in `@remotion/media`. Install it first with `npx remotion add @remotion/media`.
- **Using native `<video>` element** -- Native elements do not synchronize with Remotion's frame-based rendering. Always use `<Video>` from `@remotion/media`.
- **Passing seconds to `trimBefore`/`trimAfter`** -- These props expect frame counts, not seconds. Multiply seconds by `fps`.
- **Expecting pitch shifting in preview** -- `toneFrequency` only works during server-side rendering (final export). It has no effect in Studio or Player.
- **Using negative `playbackRate` for reverse playback** -- Reverse playback is not supported. To reverse a video, pre-process it externally.
