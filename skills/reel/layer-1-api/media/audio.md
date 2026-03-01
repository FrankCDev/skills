---
name: audio
description: Using audio in Remotion - importing, trimming, volume, muting, speed, looping, pitch
metadata:
  tags: audio, media, trim, volume, speed, loop, pitch, mute, sound, sfx
---

# Audio

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
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Audio src={staticFile("audio.mp3")} />;
};
```

Remote URLs are also supported:

```tsx
<Audio src="https://remotion.media/audio.mp3" />
```

By default, audio plays from the start at full volume for the full composition. Multiple `<Audio>` components can be layered.

## Trimming

Use `trimBefore` and `trimAfter` to play only a portion. Values are in **frames**.

```tsx
const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    trimBefore={2 * fps} // Skip the first 2 seconds
    trimAfter={10 * fps} // End at the 10 second mark
  />
);
```

The audio still starts playing at the beginning of the composition -- only the specified portion is played.

## Delaying

Wrap in a `<Sequence>` to delay when audio starts:

```tsx
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

const { fps } = useVideoConfig();

return (
  <Sequence from={1 * fps}>
    <Audio src={staticFile("audio.mp3")} />
  </Sequence>
);
```

## Volume

Static volume (0 to 1):

```tsx
<Audio src={staticFile("audio.mp3")} volume={0.5} />
```

Dynamic volume via callback. The value of `f` starts at 0 when the audio begins playing, not the composition frame:

```tsx
import { interpolate } from "remotion";

const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    volume={(f) =>
      interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })
    }
  />
);
```

## Muting

Use `muted` to silence audio. It can be set dynamically:

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    muted={frame >= 2 * fps && frame <= 4 * fps} // Mute between 2s and 4s
  />
);
```

## Speed

```tsx
<Audio src={staticFile("audio.mp3")} playbackRate={2} />   {/* 2x speed */}
<Audio src={staticFile("audio.mp3")} playbackRate={0.5} /> {/* Half speed */}
```

Reverse playback is NOT supported.

## Looping

```tsx
<Audio src={staticFile("audio.mp3")} loop />
```

Control how the frame count in the `volume` callback behaves during loops:

- `"repeat"`: frame resets to 0 each loop (default)
- `"extend"`: frame continues incrementing

```tsx
<Audio
  src={staticFile("audio.mp3")}
  loop
  loopVolumeCurveBehavior="extend"
  volume={(f) => interpolate(f, [0, 300], [1, 0])} // Fade out over multiple loops
/>
```

## Pitch

Adjust pitch without affecting speed using `toneFrequency` (range: 0.01 to 2):

```tsx
<Audio src={staticFile("audio.mp3")} toneFrequency={1.5} /> {/* Higher pitch */}
<Audio src={staticFile("audio.mp3")} toneFrequency={0.8} /> {/* Lower pitch */}
```

Pitch shifting only works during **server-side rendering**, not in the Studio preview or `<Player />`.

## Common Mistakes

- **Importing `Audio` from `remotion` instead of `@remotion/media`** -- The `Audio` component lives in `@remotion/media`. Install it with `npx remotion add @remotion/media`.
- **Passing seconds to `trimBefore`/`trimAfter`** -- These props expect frame counts. Multiply seconds by `fps`.
- **Expecting the `volume` callback `f` to match composition frame** -- `f` starts at 0 when the audio begins playing (accounting for `<Sequence>` delay), not the global composition frame.
- **Using `volume={0}` instead of `muted`** -- While `volume={0}` works, `muted` is more explicit and can be toggled dynamically without affecting volume curves.
- **Expecting pitch shifting in preview** -- `toneFrequency` only works during server-side rendering (final export).
