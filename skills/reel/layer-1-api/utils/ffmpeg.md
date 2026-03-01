---
name: ffmpeg
description: Using FFmpeg and FFprobe in Remotion for media processing and video trimming
metadata:
  tags: ffmpeg, ffprobe, video, trimming, audio, conversion
---

# FFmpeg in Remotion

`ffmpeg` and `ffprobe` do not need to be installed separately. They are available via Remotion:

```bash
bunx remotion ffmpeg -i input.mp4 output.mp3
bunx remotion ffprobe input.mp4
```

## Trimming videos

Two options for trimming:

### Option 1: FFmpeg command line

You **MUST** re-encode the video to avoid frozen frames at the start:

```bash
bunx remotion ffmpeg -ss 00:00:05 -i public/input.mp4 -to 00:00:10 -c:v libx264 -c:a aac public/output.mp4
```

### Option 2: Video component props (non-destructive)

Use `trimBefore` and `trimAfter` props on the `<Video>` component. This is non-destructive and can be changed at any time:

```tsx
import { Video } from "@remotion/media";

<Video
  src={staticFile("video.mp4")}
  trimBefore={5 * fps}
  trimAfter={10 * fps}
/>;
```

## Common mistakes

- Not re-encoding when trimming with FFmpeg (e.g. using `-c copy`) -- this causes frozen frames at the start of the trimmed video.
- Placing `-ss` after `-i` instead of before it -- this is significantly slower because FFmpeg decodes from the beginning.
- Forgetting that `trimBefore` and `trimAfter` expect frame numbers, not seconds -- multiply by `fps`.
- Using system-installed `ffmpeg` instead of `bunx remotion ffmpeg` -- the bundled version is guaranteed to be compatible.
