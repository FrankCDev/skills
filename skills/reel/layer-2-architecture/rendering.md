---
name: rendering
description: Render configuration, codec selection, and output optimization for Remotion
metadata:
  tags: render, codec, output, optimization, export, h264, prores, vp9
---

# Rendering and Output Configuration

Remotion provides multiple rendering paths: the CLI for automation, the Studio for visual preview and interactive rendering, and Lambda for cloud-based parallel rendering. This guide covers codec selection, resolution presets, render flags, and optimization strategies.

---

## CLI Render Command

The primary way to render a Remotion video is via the CLI:

```bash
npx remotion render <composition-id> <output-file>
```

### Basic Examples

```bash
# Render to MP4 with H.264 (default codec)
npx remotion render MyComposition out/video.mp4

# Render a vertical video for TikTok
npx remotion render SocialPost-Reels out/reels.mp4

# Render with specific props from a JSON file
npx remotion render MyComposition out/video.mp4 --props='{"title":"Hello"}'
```

---

## Codec Comparison

Choose the codec based on your delivery target:

| Codec | File Extension | Best For | Pros | Cons |
|---|---|---|---|---|
| **H.264** | `.mp4` | General distribution, YouTube, social media | Universal compatibility, small files | No transparency support |
| **H.265 (HEVC)** | `.mp4` | Archival, modern devices | ~30% smaller than H.264 at same quality | Limited browser support, slower encode |
| **ProRes** | `.mov` | Post-production, video editing | Lossless quality, fast editing | Very large files (10-50x H.264) |
| **VP8** | `.webm` | Legacy web use | Open format, transparency support | Largely superseded by VP9 |
| **VP9** | `.webm` | Web distribution, transparency | Smaller than H.264, supports alpha channel | Slower encoding |
| **GIF** | `.gif` | Short loops, social previews | Universal support, auto-plays everywhere | Huge files, 256 colors, no audio |

### Specifying a Codec

```bash
# H.264 (default, best compatibility)
npx remotion render MyComp out/video.mp4 --codec=h264

# H.265 for smaller files
npx remotion render MyComp out/video.mp4 --codec=h265

# ProRes for editing workflows
npx remotion render MyComp out/video.mov --codec=prores --prores-profile=4444

# VP9 WebM for web embedding
npx remotion render MyComp out/video.webm --codec=vp9

# Transparent video with VP9
npx remotion render MyComp out/transparent.webm --codec=vp9 --image-format=png

# GIF for short loops
npx remotion render MyComp out/animation.gif --codec=gif
```

### ProRes Profiles

When using ProRes, select the profile based on your quality needs:

| Profile | Flag Value | Use Case |
|---|---|---|
| ProRes 422 Proxy | `proxy` | Offline editing, low storage |
| ProRes 422 LT | `light` | Lightweight editing |
| ProRes 422 | `normal` | Standard post-production |
| ProRes 422 HQ | `hq` | High-quality finishing |
| ProRes 4444 | `4444` | Motion graphics with alpha |
| ProRes 4444 XQ | `4444-xq` | Highest quality with alpha |

```bash
npx remotion render MyComp out/video.mov --codec=prores --prores-profile=hq
```

---

## Resolution Presets

Set resolution in your `<Composition>` definition. Common presets:

| Platform | Width | Height | Aspect Ratio | Notes |
|---|---|---|---|---|
| YouTube / General HD | 1920 | 1080 | 16:9 | Standard landscape |
| YouTube 4K | 3840 | 2160 | 16:9 | Ultra HD |
| TikTok / Instagram Reels | 1080 | 1920 | 9:16 | Vertical full-screen |
| Instagram Post (Square) | 1080 | 1080 | 1:1 | Square format |
| Instagram Story | 1080 | 1920 | 9:16 | Same as Reels |
| Twitter / X Video | 1280 | 720 | 16:9 | 720p is common |
| LinkedIn | 1920 | 1080 | 16:9 | Standard landscape |

### Defining Multiple Resolutions for the Same Composition

```tsx
// src/Root.tsx
import { Composition, Folder } from "remotion";
import { SocialPost } from "./compositions/SocialPost/SocialPost";
import { socialPostSchema } from "./compositions/SocialPost/schema";

const defaultSocialProps = {
  headline: "Breaking News",
  body: "Something amazing happened.",
};

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Social Post">
      <Composition
        id="SocialPost-Landscape"
        component={SocialPost}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
        schema={socialPostSchema}
        defaultProps={defaultSocialProps}
      />
      <Composition
        id="SocialPost-Vertical"
        component={SocialPost}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={300}
        schema={socialPostSchema}
        defaultProps={defaultSocialProps}
      />
      <Composition
        id="SocialPost-Square"
        component={SocialPost}
        width={1080}
        height={1080}
        fps={30}
        durationInFrames={300}
        schema={socialPostSchema}
        defaultProps={defaultSocialProps}
      />
    </Folder>
  );
};
```

### Responsive Compositions

Use `useVideoConfig()` to adapt layout to the current resolution:

```tsx
import { AbsoluteFill, useVideoConfig } from "remotion";

export const ResponsiveLayout: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;
  const isSquare = width === height;

  return (
    <AbsoluteFill
      style={{
        flexDirection: isPortrait ? "column" : "row",
        padding: isPortrait ? 40 : 80,
      }}
    >
      <div
        style={{
          fontSize: isPortrait ? 48 : 64,
          textAlign: isSquare ? "center" : "left",
        }}
      >
        Adapts to any resolution
      </div>
    </AbsoluteFill>
  );
};
```

---

## Frame Rate

Set `fps` in your `<Composition>` definition:

| FPS | Use Case | Notes |
|---|---|---|
| **24** | Cinematic feel | Film-like motion, lower file size |
| **30** | Standard video | Default for most web/social content |
| **60** | Smooth motion | Sports, gaming, UI animations |

```tsx
<Composition
  id="CinematicTrailer"
  component={CinematicTrailer}
  fps={24}
  durationInFrames={240} // 10 seconds at 24fps
  width={1920}
  height={1080}
/>
```

**Important**: When using audio, make sure the audio file's sample rate is compatible with your chosen fps. Mismatched settings can cause audio drift.

---

## Audio Codec

Remotion uses AAC by default for MP4 output. You can change this with `--audio-codec`:

```bash
# AAC (default, best compatibility with MP4)
npx remotion render MyComp out/video.mp4 --audio-codec=aac

# MP3 (smaller file, slightly less quality)
npx remotion render MyComp out/video.mp4 --audio-codec=mp3

# Opus (for WebM containers)
npx remotion render MyComp out/video.webm --codec=vp9 --audio-codec=opus
```

| Audio Codec | Container | Quality | Compatibility |
|---|---|---|---|
| AAC | MP4, MOV | Excellent | Universal |
| MP3 | MP4 | Good | Universal |
| Opus | WebM | Excellent | Modern browsers |

---

## Render Flags Reference

### Performance Flags

```bash
# Control parallelism (default: 50% of CPU cores)
npx remotion render MyComp out/video.mp4 --concurrency=4

# Use half of available cores
npx remotion render MyComp out/video.mp4 --concurrency=50%

# Render specific frame range (useful for testing or segmented rendering)
npx remotion render MyComp out/video.mp4 --frames=0-89
```

### Graphics and Rendering Engine

```bash
# Use ANGLE for OpenGL rendering (required for maps, 3D, some CSS filters)
npx remotion render MyComp out/video.mp4 --gl=angle

# Use Vulkan (Linux)
npx remotion render MyComp out/video.mp4 --gl=vulkan

# Use software rendering (fallback, slowest)
npx remotion render MyComp out/video.mp4 --gl=swiftshader
```

**When to use `--gl=angle`:**
- Rendering maps (e.g., Mapbox, Google Maps)
- Using WebGL or Three.js
- CSS `backdrop-filter`, complex `filter()` chains
- Canvas-based animations

### Image Format (Per-Frame)

```bash
# JPEG frames (default, faster, no transparency)
npx remotion render MyComp out/video.mp4 --image-format=jpeg

# PNG frames (supports transparency, slower, larger)
npx remotion render MyComp out/transparent.webm --codec=vp9 --image-format=png

# JPEG quality (0-100, default 80)
npx remotion render MyComp out/video.mp4 --image-format=jpeg --jpeg-quality=90
```

### Quality Flags

```bash
# Constant Rate Factor for H.264/H.265 (lower = better quality, larger file)
# Range: 0-51, default ~18
npx remotion render MyComp out/video.mp4 --crf=15

# Video bitrate (alternative to CRF)
npx remotion render MyComp out/video.mp4 --video-bitrate=8M

# Audio bitrate
npx remotion render MyComp out/video.mp4 --audio-bitrate=320k
```

### Other Useful Flags

```bash
# Override composition props
npx remotion render MyComp out/video.mp4 --props='{"title":"Custom Title"}'

# Set a custom log level
npx remotion render MyComp out/video.mp4 --log=verbose

# Render a still image (single frame)
npx remotion still MyComp out/thumbnail.png --frame=45

# Override the number of threads for FFmpeg
npx remotion render MyComp out/video.mp4 --number-of-gif-loops=0
```

---

## Studio Render vs CLI Render

| Feature | Studio | CLI |
|---|---|---|
| **Interface** | Visual GUI in browser | Terminal command |
| **Preview** | Real-time playback | No preview (renders directly) |
| **Props editing** | Interactive sidebar | JSON via `--props` |
| **Best for** | Development, design iteration | CI/CD, batch rendering, automation |
| **Speed** | Slower (renders on demand) | Faster (optimized pipeline) |
| **Automation** | Manual | Fully scriptable |

### Starting the Studio

```bash
npx remotion studio
```

In the Studio, you can:
- Preview compositions in real time
- Edit props via the sidebar (when using Zod schemas)
- Trigger renders via the "Render" button
- Inspect individual frames

### CLI Render in Scripts

```json
// package.json
{
  "scripts": {
    "render": "remotion render MyComp out/video.mp4",
    "render:4k": "remotion render MyComp out/video-4k.mp4 --width=3840 --height=2160",
    "render:vertical": "remotion render SocialPost-Reels out/reels.mp4",
    "render:gif": "remotion render MyComp out/preview.gif --codec=gif --every-nth-frame=2",
    "render:thumbnail": "remotion still MyComp out/thumb.png --frame=45"
  }
}
```

---

## Lambda Rendering

Remotion Lambda renders videos in the cloud using AWS Lambda functions, enabling massively parallel rendering. Each chunk of frames is rendered by a separate Lambda invocation, then stitched together.

### When to Use Lambda

- Rendering many videos in parallel (batch jobs)
- Rendering very long or complex videos faster
- Offloading rendering from your local machine or CI server
- Serverless video generation in production APIs

### Basic Lambda Setup

```bash
# Install the Lambda package
npm install @remotion/lambda

# Deploy the Lambda function and S3 site
npx remotion lambda sites create src/index.ts --site-name=my-video-site
npx remotion lambda functions deploy
```

### Triggering a Lambda Render

```tsx
// scripts/renderOnLambda.ts
import { renderMediaOnLambda, getRenderProgress } from "@remotion/lambda/client";

const { renderId, bucketName } = await renderMediaOnLambda({
  region: "us-east-1",
  functionName: "remotion-render-3-4-1-mem2048mb-disk2048mb-120sec",
  composition: "MyComposition",
  serveUrl: "https://my-s3-bucket.s3.amazonaws.com/sites/my-video-site/",
  codec: "h264",
  inputProps: {
    title: "Hello from Lambda",
  },
});

console.log(`Render started: ${renderId}`);

// Poll for progress
let progress;
do {
  progress = await getRenderProgress({
    renderId,
    bucketName,
    region: "us-east-1",
    functionName: "remotion-render-3-4-1-mem2048mb-disk2048mb-120sec",
  });
  console.log(`Progress: ${(progress.overallProgress * 100).toFixed(1)}%`);
} while (!progress.done);

console.log("Render complete:", progress.outputFile);
```

---

## Batch Rendering with Different Props

Render the same composition multiple times with different input data:

### Shell Script Approach

```bash
#!/bin/bash
# render-batch.sh

ITEMS='[
  {"title": "Episode 1", "color": "#FF0000"},
  {"title": "Episode 2", "color": "#00FF00"},
  {"title": "Episode 3", "color": "#0000FF"}
]'

echo "$ITEMS" | jq -c '.[]' | while read -r item; do
  TITLE=$(echo "$item" | jq -r '.title')
  FILENAME=$(echo "$TITLE" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
  echo "Rendering $TITLE..."
  npx remotion render MyComp "out/${FILENAME}.mp4" --props="$item"
done
```

### Node.js Script Approach

```tsx
// scripts/batchRender.ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";

const items = [
  { title: "Q1 Report", quarter: "Q1", color: "#3B82F6" },
  { title: "Q2 Report", quarter: "Q2", color: "#10B981" },
  { title: "Q3 Report", quarter: "Q3", color: "#F59E0B" },
  { title: "Q4 Report", quarter: "Q4", color: "#EF4444" },
];

const run = async () => {
  const bundled = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
  });

  for (const item of items) {
    const composition = await selectComposition({
      serveUrl: bundled,
      id: "QuarterlyReport",
      inputProps: item,
    });

    const outputPath = path.resolve(`./out/${item.quarter}-report.mp4`);

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: item,
    });

    console.log(`Rendered: ${outputPath}`);
  }
};

run();
```

---

## Rendering Transparent Videos

To render a video with a transparent background (alpha channel), you need two things:

1. A codec that supports transparency (VP9 or ProRes 4444)
2. PNG image format for per-frame transparency

```bash
# Transparent WebM
npx remotion render MyComp out/overlay.webm \
  --codec=vp9 \
  --image-format=png

# Transparent ProRes (for editing software)
npx remotion render MyComp out/overlay.mov \
  --codec=prores \
  --prores-profile=4444 \
  --image-format=png
```

### Composition Setup for Transparency

```tsx
// Make sure your composition has no background color
export const TransparentOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    // Do NOT set backgroundColor on the AbsoluteFill
    <AbsoluteFill>
      <div
        style={{
          fontSize: 80,
          color: "white",
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          opacity,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        Lower Third Text
      </div>
    </AbsoluteFill>
  );
};
```

**Note**: H.264 (standard MP4) does not support transparency. If you render with H.264, the transparent areas will be black.

---

## Summary: Quick Render Reference

```bash
# Standard HD MP4
npx remotion render MyComp out/video.mp4

# High-quality HD
npx remotion render MyComp out/video.mp4 --crf=15

# 4K render
npx remotion render MyComp out/video.mp4 --crf=18

# Vertical for Reels/TikTok
npx remotion render SocialPost-Reels out/reels.mp4

# Transparent overlay
npx remotion render Overlay out/overlay.webm --codec=vp9 --image-format=png

# Fast preview (lower quality)
npx remotion render MyComp out/preview.mp4 --jpeg-quality=60 --crf=28

# Single frame thumbnail
npx remotion still MyComp out/thumb.png --frame=45

# GIF export
npx remotion render MyComp out/anim.gif --codec=gif --every-nth-frame=2

# Parallel rendering for speed
npx remotion render MyComp out/video.mp4 --concurrency=8

# With GPU acceleration
npx remotion render MyComp out/video.mp4 --gl=angle
```
