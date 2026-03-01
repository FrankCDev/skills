---
name: subtitles
description: Caption type definition and routing to transcribe, display, and import-srt workflows
metadata:
  tags: subtitles, captions, remotion, json, Caption
---

# Captions in Remotion

All captions must be processed as JSON using the `Caption` type:

```ts
import type { Caption } from "@remotion/captions";
```

Type definition:

```ts
type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};
```

## Generating captions

Transcribe video/audio files to produce captions. See [transcribe.md](./transcribe.md).

## Displaying captions

Render TikTok-style captions with word highlighting. See [display.md](./display.md).

## Importing captions from .srt

Parse existing `.srt` subtitle files into the `Caption` format. See [import-srt.md](./import-srt.md).

## Common mistakes

- Using a custom caption shape instead of the `Caption` type from `@remotion/captions`.
- Storing timestamps in seconds instead of milliseconds (`startMs` / `endMs` are in ms).
- Forgetting to install `@remotion/captions` before importing the type.
