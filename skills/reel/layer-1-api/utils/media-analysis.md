---
name: media-analysis
description: Consolidated Mediabunny utilities for video duration, video dimensions, audio duration, decode checking, and frame extraction
metadata:
  tags: mediabunny, video, audio, duration, dimensions, decode, frames, extract, thumbnail
---

# Media Analysis with Mediabunny

Mediabunny provides utilities for analyzing media files. It works in browser, Node.js, and Bun environments.

---

## Video Duration

Get the duration of a video file in seconds.

```tsx
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export const getVideoDuration = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const durationInSeconds = await input.computeDuration();
  return durationInSeconds;
};
```

Usage:

```tsx
const duration = await getVideoDuration("https://remotion.media/video.mp4");
// e.g. 10.5 (seconds)
```

With `staticFile()`:

```tsx
import { staticFile } from "remotion";
const duration = await getVideoDuration(staticFile("video.mp4"));
```

---

## Video Dimensions

Get the width and height of a video file.

```tsx
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export const getVideoDimensions = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const videoTrack = await input.getPrimaryVideoTrack();
  if (!videoTrack) {
    throw new Error("No video track found");
  }

  return {
    width: videoTrack.displayWidth,
    height: videoTrack.displayHeight,
  };
};
```

Usage:

```tsx
const dims = await getVideoDimensions("https://remotion.media/video.mp4");
// dims.width = 1920, dims.height = 1080
```

---

## Audio Duration

Get the duration of an audio file in seconds.

```tsx title="get-audio-duration.ts"
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export const getAudioDuration = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const durationInSeconds = await input.computeDuration();
  return durationInSeconds;
};
```

Usage:

```tsx
import { staticFile } from "remotion";
const duration = await getAudioDuration(staticFile("audio.mp3"));
// e.g. 180.5 (seconds)
```

---

## Decode Checking

Check if a video can be decoded by the browser before attempting to play it.

```tsx
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export const canDecode = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  try {
    await input.getFormat();
  } catch {
    return false;
  }

  const videoTrack = await input.getPrimaryVideoTrack();
  if (videoTrack && !(await videoTrack.canDecode())) {
    return false;
  }

  const audioTrack = await input.getPrimaryAudioTrack();
  if (audioTrack && !(await audioTrack.canDecode())) {
    return false;
  }

  return true;
};
```

Usage:

```tsx
const isDecodable = await canDecode("https://remotion.media/video.mp4");
if (!isDecodable) {
  console.log("Video cannot be decoded by this browser");
}
```

For file uploads / drag-and-drop, use `BlobSource`:

```tsx
import { Input, ALL_FORMATS, BlobSource } from "mediabunny";

export const canDecodeBlob = async (blob: Blob) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(blob),
  });
  // Same validation logic as above
};
```

---

## Frame Extraction

Extract frames from videos at specific timestamps for thumbnails, filmstrips, or per-frame processing.

```tsx
import {
  ALL_FORMATS,
  Input,
  UrlSource,
  VideoSample,
  VideoSampleSink,
} from "mediabunny";

type Options = {
  track: { width: number; height: number };
  container: string;
  durationInSeconds: number | null;
};

export type ExtractFramesTimestampsInSecondsFn = (
  options: Options,
) => Promise<number[]> | number[];

export type ExtractFramesProps = {
  src: string;
  timestampsInSeconds: number[] | ExtractFramesTimestampsInSecondsFn;
  onVideoSample: (sample: VideoSample) => void;
  signal?: AbortSignal;
};

export async function extractFrames({
  src,
  timestampsInSeconds,
  onVideoSample,
  signal,
}: ExtractFramesProps): Promise<void> {
  using input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src),
  });

  const [durationInSeconds, format, videoTrack] = await Promise.all([
    input.computeDuration(),
    input.getFormat(),
    input.getPrimaryVideoTrack(),
  ]);

  if (!videoTrack) {
    throw new Error("No video track found in the input");
  }

  if (signal?.aborted) {
    throw new Error("Aborted");
  }

  const timestamps =
    typeof timestampsInSeconds === "function"
      ? await timestampsInSeconds({
          track: {
            width: videoTrack.displayWidth,
            height: videoTrack.displayHeight,
          },
          container: format.name,
          durationInSeconds,
        })
      : timestampsInSeconds;

  if (timestamps.length === 0) {
    return;
  }

  if (signal?.aborted) {
    throw new Error("Aborted");
  }

  const sink = new VideoSampleSink(videoTrack);

  for await (using videoSample of sink.samplesAtTimestamps(timestamps)) {
    if (signal?.aborted) {
      break;
    }
    if (!videoSample) {
      continue;
    }
    onVideoSample(videoSample);
  }
}
```

Basic usage:

```tsx
await extractFrames({
  src: "https://remotion.media/video.mp4",
  timestampsInSeconds: [0, 1, 2, 3, 4],
  onVideoSample: (sample) => {
    const canvas = document.createElement("canvas");
    canvas.width = sample.displayWidth;
    canvas.height = sample.displayHeight;
    const ctx = canvas.getContext("2d");
    sample.draw(ctx!, 0, 0);
  },
});
```

With AbortSignal for cancellation:

```tsx
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await extractFrames({
  src: "https://remotion.media/video.mp4",
  timestampsInSeconds: [0, 1, 2, 3, 4],
  onVideoSample: (sample) => {
    const canvas = document.createElement("canvas");
    canvas.width = sample.displayWidth;
    canvas.height = sample.displayHeight;
    const ctx = canvas.getContext("2d");
    sample.draw(ctx!, 0, 0);
  },
  signal: controller.signal,
});
```

---

## Using FileSource in Node.js / Bun

For all utilities above, use `FileSource` instead of `UrlSource` in server-side environments:

```tsx
import { Input, ALL_FORMATS, FileSource } from "mediabunny";

const input = new Input({
  formats: ALL_FORMATS,
  source: new FileSource(file),
});
```

## Common mistakes

- Using `UrlSource` in Node.js/Bun when a local file is available -- use `FileSource` for local files.
- Forgetting `staticFile()` when referencing files from `public/` -- bare paths will not resolve.
- Not handling the case where `getPrimaryVideoTrack()` returns `null` -- audio-only files have no video track.
- Calling `computeDuration()` on a stream without a known length -- this may return `null`.
- Forgetting to use the `using` keyword for resource disposal with `extractFrames` (requires TC39 explicit resource management).
