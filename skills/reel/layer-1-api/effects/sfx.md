---
name: sfx
description: Sound effects from @remotion/sfx with available URLs for common effects
metadata:
  tags: sfx, sound, effect, audio, whoosh, click
---

# Sound Effects

The `@remotion/sfx` package provides a dedicated `<Audio>` component for sound effects. This is a **separate component** from the `<Audio>` in `@remotion/media` — it is specifically designed for playing remote sound effect URLs.

```tsx
import { Audio } from "@remotion/sfx";

<Audio src={"https://remotion.media/whoosh.wav"} />;
```

> **Note**: Do not confuse `import { Audio } from "@remotion/sfx"` with `import { Audio } from "@remotion/media"`. The `@remotion/sfx` Audio is for remote sound effect URLs. Use `@remotion/media` Audio for local audio files and advanced playback control (volume, trimming, looping, pitch).

## Available sound effects

- `https://remotion.media/whoosh.wav`
- `https://remotion.media/whip.wav`
- `https://remotion.media/page-turn.wav`
- `https://remotion.media/switch.wav`
- `https://remotion.media/mouse-click.wav`
- `https://remotion.media/shutter-modern.wav`
- `https://remotion.media/shutter-old.wav`

## Additional resources

For more sound effects, search the internet. A good resource is https://github.com/kapishdima/soundcn/tree/main/assets.

## Common mistakes

- Importing `Audio` from `"remotion"` instead of `"@remotion/sfx"` -- they are different components.
- Using a broken or misspelled URL for the sound effect.
- Forgetting to install `@remotion/sfx` if it is not already in the project.
