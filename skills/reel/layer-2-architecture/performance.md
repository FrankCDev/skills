---
name: performance
description: Performance optimization techniques for complex Remotion videos
metadata:
  tags: performance, optimization, memory, speed, rendering
---

# Performance Optimization

Remotion renders each frame as an independent React render. This means performance bottlenecks that are negligible in a web app (where you render at most 60fps in real time) become significant when you render thousands of frames. A 10ms per-frame overhead becomes 5 extra minutes on a 10-minute, 30fps video. This guide covers the most impactful optimization techniques.

---

## 1. Memoize Heavy Computations with useMemo

Every frame triggers a full React render of your composition. If you perform expensive calculations (parsing data, computing SVG paths, generating arrays), wrap them in `useMemo` so they only recompute when their dependencies change.

```tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { useMemo } from "react";

type DataPoint = {
  x: number;
  y: number;
  label: string;
};

type ChartSceneProps = {
  data: DataPoint[];
};

export const ChartScene: React.FC<ChartSceneProps> = ({ data }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // GOOD: This expensive computation only runs when data, width, or height change
  // It does NOT re-run on every frame
  const processedData = useMemo(() => {
    const maxX = Math.max(...data.map((d) => d.x));
    const maxY = Math.max(...data.map((d) => d.y));

    return data.map((d) => ({
      ...d,
      screenX: (d.x / maxX) * (width - 100) + 50,
      screenY: height - (d.y / maxY) * (height - 100) - 50,
    }));
  }, [data, width, height]);

  // Only the frame-dependent animation is recalculated every frame
  const progress = Math.min(frame / 60, 1);

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {processedData.map((point, i) => (
          <circle
            key={i}
            cx={point.screenX}
            cy={point.screenY}
            r={8 * progress}
            fill="#3B82F6"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
```

```tsx
// BAD: This recalculates on every single frame render
export const BadChart: React.FC<ChartSceneProps> = ({ data }) => {
  const frame = useCurrentFrame();

  // This runs 9000 times for a 5-minute video at 30fps
  const sorted = [...data].sort((a, b) => a.x - b.x);
  const normalized = sorted.map((d) => ({
    ...d,
    value: d.y / Math.max(...sorted.map((s) => s.y)),
  }));

  return <div>{/* render normalized */}</div>;
};
```

---

## 2. Use calculateMetadata for One-Time Async Work

`calculateMetadata` runs once before rendering starts. Use it for all data fetching, API calls, and async setup instead of doing it inside the component.

```tsx
// src/compositions/StockChart/schema.ts
import { z } from "zod";

export const stockChartSchema = z.object({
  ticker: z.string(),
  stockData: z
    .array(
      z.object({
        date: z.string(),
        price: z.number(),
      }),
    )
    .optional(),
});

export type StockChartProps = z.infer<typeof stockChartSchema>;
```

```tsx
// src/compositions/StockChart/StockChart.tsx
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  CalculateMetadataFunction,
} from "remotion";
import { StockChartProps, stockChartSchema } from "./schema";

// This runs ONCE before rendering begins
export const calculateStockMetadata: CalculateMetadataFunction<
  StockChartProps
> = async ({ props, abortSignal }) => {
  const response = await fetch(
    `https://api.example.com/stock/${props.ticker}/history`,
    { signal: abortSignal },
  );
  const data = await response.json();

  return {
    props: {
      ...props,
      stockData: data.prices, // Pass fetched data as a prop
    },
    // Dynamically set duration based on data length
    durationInFrames: data.prices.length * 3 + 60,
  };
};

// The component receives pre-fetched data and never does async work
export const StockChart: React.FC<StockChartProps> = ({
  ticker,
  stockData,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // stockData is already available -- no fetching, no delayRender needed
  if (!stockData) return null;

  const visiblePoints = Math.min(
    Math.floor(frame / 3),
    stockData.length,
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#0F172A", padding: 60 }}
    >
      <h1 style={{ color: "white", fontSize: 48 }}>{ticker}</h1>
      <svg width={1800} height={800}>
        {stockData.slice(0, visiblePoints).map((point, i) => (
          <circle
            key={i}
            cx={(i / stockData.length) * 1800}
            cy={800 - (point.price / Math.max(...stockData.map((p) => p.price))) * 800}
            r={4}
            fill="#22D3EE"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
```

```tsx
// Root.tsx registration
<Composition
  id="StockChart"
  component={StockChart}
  schema={stockChartSchema}
  calculateMetadata={calculateStockMetadata}
  durationInFrames={300} // Will be overridden by calculateMetadata
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ ticker: "AAPL" }}
/>
```

**Why this is faster**: Instead of fetching data on every frame render (or using `delayRender` which blocks the renderer), the data is fetched once and baked into the props. The component becomes a pure function of frame + props.

---

## 3. Image Optimization

Large images are one of the biggest performance drains. Each frame loads and decodes every visible image.

### Compress and Resize Before Importing

```bash
# Resize to the actual display size (no point loading a 4000px image for a 500px element)
ffmpeg -i hero-original.png -vf scale=960:-1 hero-resized.png

# Convert to WebP for smaller file size
ffmpeg -i photo.png -c:v libwebp -quality 85 photo.webp

# Batch convert all PNGs in a directory
for f in public/images/*.png; do
  ffmpeg -i "$f" -c:v libwebp -quality 85 "${f%.png}.webp"
done
```

### Use WebP Format

```tsx
import { Img, staticFile } from "remotion";

export const OptimizedImage: React.FC = () => {
  return (
    // WebP is typically 25-35% smaller than PNG with similar quality
    <Img
      src={staticFile("images/hero.webp")}
      style={{ width: 960, height: 540 }}
    />
  );
};
```

### Avoid Loading Offscreen Images

```tsx
import { AbsoluteFill, Sequence, Img, staticFile } from "remotion";

export const ImageGallery: React.FC = () => {
  const images = ["photo1.webp", "photo2.webp", "photo3.webp"];

  return (
    <AbsoluteFill>
      {images.map((img, i) => (
        // Each image only loads during its Sequence
        // It is completely unmounted outside this range
        <Sequence
          key={img}
          from={i * 90}
          durationInFrames={90}
          name={`Image ${i + 1}`}
        >
          <Img
            src={staticFile(`images/${img}`)}
            style={{ width: "100%", height: "100%" }}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

---

## 4. Video Optimization

Loading a large video file and trimming it in Remotion is expensive because the browser still decodes unnecessary portions of the file.

### Pre-Trim Videos with FFmpeg

```bash
# Instead of loading a 10-minute video and using trimBefore/trimAfter,
# trim it beforehand so Remotion only loads the relevant segment.

# Extract 5 seconds starting at 1:23
ffmpeg -ss 00:01:23 -i full-video.mp4 -t 5 -c:v libx264 -c:a aac trimmed-clip.mp4

# Re-encode for optimal seeking (no B-frames)
ffmpeg -i clip.mp4 -c:v libx264 -bf 0 -c:a aac -movflags +faststart clip-optimized.mp4
```

### Use OffthreadVideo for Better Performance

`<OffthreadVideo>` renders video frames outside the main thread, preventing the video decode from blocking other rendering work.

```tsx
import { OffthreadVideo, staticFile } from "remotion";

export const VideoScene: React.FC = () => {
  return (
    // OffthreadVideo is more performant than <Video> during rendering
    // It extracts frames using FFmpeg rather than the browser's video decoder
    <OffthreadVideo
      src={staticFile("video/background-clip.mp4")}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
```

**When to use `<Video>` vs `<OffthreadVideo>`:**
- Use `<OffthreadVideo>` for rendering (better performance, no seeking issues)
- `<OffthreadVideo>` also works in the Studio for previewing
- Use `<Video>` only if you need the `<video>` element's browser APIs for special effects

---

## 5. Pre-Calculate Complex Paths and Animations

If your animation involves complex math (Bezier curves, physics simulations, path generation), calculate the full trajectory once outside the component or in `useMemo`, then index into it by frame.

```tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { useMemo } from "react";

type PathPoint = { x: number; y: number };

// Pre-calculate a complex path (e.g., a spiral)
const generateSpiralPath = (
  totalFrames: number,
  centerX: number,
  centerY: number,
): PathPoint[] => {
  const points: PathPoint[] = [];
  for (let i = 0; i < totalFrames; i++) {
    const t = i / totalFrames;
    const angle = t * Math.PI * 8;
    const radius = t * 400;
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }
  return points;
};

export const SpiralAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Calculate all points once, not on every frame
  const path = useMemo(
    () => generateSpiralPath(durationInFrames, width / 2, height / 2),
    [durationInFrames, width, height],
  );

  const currentPoint = path[Math.min(frame, path.length - 1)];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
      {/* Trail: show all previous points */}
      <svg width={width} height={height}>
        {path.slice(0, frame + 1).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2}
            fill={`rgba(59, 130, 246, ${i / frame})`}
          />
        ))}
        {/* Current position */}
        <circle cx={currentPoint.x} cy={currentPoint.y} r={10} fill="#22D3EE" />
      </svg>
    </AbsoluteFill>
  );
};
```

---

## 6. Concurrency Settings

Remotion renders frames in parallel. The `--concurrency` flag controls how many frames are rendered simultaneously.

### Guidelines

| Composition Type | Recommended Concurrency | Why |
|---|---|---|
| Simple text/shapes | `75%` or `100%` of CPU cores | Low memory per frame |
| Images + text | `50%` (default) | Moderate memory per frame |
| Video compositing | `2-4` | Video decode is memory-heavy |
| WebGL / 3D | `1-2` | GPU memory is the bottleneck |
| Maps (Mapbox, etc.) | `1-2` | Network + GPU constrained |

```bash
# For a simple text animation, max out parallelism
npx remotion render TextAnimation out/video.mp4 --concurrency=100%

# For a composition with many large images
npx remotion render ImageSlideshow out/video.mp4 --concurrency=4

# For 3D/WebGL compositions, minimize parallelism
npx remotion render ThreeDScene out/video.mp4 --concurrency=1 --gl=angle
```

### Measuring the Impact

```bash
# Time a render with different concurrency values to find the sweet spot
time npx remotion render MyComp out/test.mp4 --concurrency=2
time npx remotion render MyComp out/test.mp4 --concurrency=4
time npx remotion render MyComp out/test.mp4 --concurrency=8
```

---

## 7. Sequence durationInFrames for Automatic Unmounting

One of the most powerful performance features in Remotion is that `<Sequence>` components automatically unmount their children when the current frame is outside their range. Always set `durationInFrames` to ensure components are not rendered when they are not visible.

```tsx
import { AbsoluteFill, Sequence } from "remotion";

// BAD: All scenes are mounted for the entire video
export const BadPerformance: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {frame < 90 && <HeavyIntro />}
      {frame >= 90 && frame < 270 && <HeavyContent />}
      {frame >= 270 && <HeavyOutro />}
    </AbsoluteFill>
  );
};

// GOOD: Each scene is mounted only during its frame range
export const GoodPerformance: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <HeavyIntro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <HeavyContent />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <HeavyOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
```

Without `durationInFrames`, the Sequence lasts until the end of the composition, meaning the component stays mounted and consuming memory for the entire video.

---

## 8. Avoid Deep Component Trees with Many Sequences

Deeply nested Sequence trees add overhead because React must evaluate the entire tree on every frame to determine which components are active.

```tsx
// BAD: 100 nested sequences, all evaluated every frame
export const TooManySequences: React.FC = () => {
  return (
    <AbsoluteFill>
      {Array.from({ length: 100 }).map((_, i) => (
        <Sequence key={i} from={i * 30} durationInFrames={30}>
          <TextCard text={`Slide ${i + 1}`} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// BETTER: Group slides into scenes of 10
export const GroupedSequences: React.FC = () => {
  const SLIDES_PER_GROUP = 10;
  const SLIDE_DURATION = 30;
  const GROUP_DURATION = SLIDES_PER_GROUP * SLIDE_DURATION;
  const totalGroups = 10;

  return (
    <AbsoluteFill>
      {Array.from({ length: totalGroups }).map((_, groupIndex) => (
        <Sequence
          key={groupIndex}
          from={groupIndex * GROUP_DURATION}
          durationInFrames={GROUP_DURATION}
        >
          {/* Only 10 slides are mounted at a time */}
          {Array.from({ length: SLIDES_PER_GROUP }).map((_, slideIndex) => (
            <Sequence
              key={slideIndex}
              from={slideIndex * SLIDE_DURATION}
              durationInFrames={SLIDE_DURATION}
            >
              <TextCard
                text={`Slide ${groupIndex * SLIDES_PER_GROUP + slideIndex + 1}`}
              />
            </Sequence>
          ))}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

---

## 9. Canvas-Based Rendering for Particle Effects

DOM elements are expensive. If you need to render hundreds or thousands of particles, circles, or dots, use a `<canvas>` element instead of individual DOM nodes.

```tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { useRef, useEffect, useMemo } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
};

export const ParticleEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate particle initial states once (deterministic, seeded)
  const particles = useMemo((): Particle[] => {
    const result: Particle[] = [];
    for (let i = 0; i < 500; i++) {
      // Use a seeded pseudo-random to keep it deterministic
      const seed = i * 13.37;
      result.push({
        x: (Math.sin(seed) * 0.5 + 0.5) * width,
        y: (Math.cos(seed * 2.1) * 0.5 + 0.5) * height,
        vx: Math.sin(seed * 3.7) * 3,
        vy: Math.cos(seed * 4.3) * 3,
        size: 2 + (Math.sin(seed * 5.1) * 0.5 + 0.5) * 6,
        hue: (i * 3.6) % 360,
      });
    }
    return result;
  }, [width, height]);

  // Draw all particles on the canvas based on the current frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      const x = (p.x + p.vx * frame) % width;
      const y = (p.y + p.vy * frame) % height;

      ctx.beginPath();
      ctx.arc(
        x < 0 ? x + width : x,
        y < 0 ? y + height : y,
        p.size,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.8)`;
      ctx.fill();
    }
  }, [frame, particles, width, height]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
```

**Performance comparison for 500 elements:**
- DOM approach (`<div>` per particle): ~30ms per frame
- Canvas approach: ~2ms per frame
- 15x faster rendering per frame

---

## 10. Profiling with console.time

Use `console.time` in `calculateMetadata` to measure initialization cost, and track per-frame render time in development.

### Profiling calculateMetadata

```tsx
import type { CalculateMetadataFunction } from "remotion";
import type { ReportProps } from "./schema";

export const calculateReportMetadata: CalculateMetadataFunction<
  ReportProps
> = async ({ props, abortSignal }) => {
  console.time("calculateMetadata:total");

  console.time("calculateMetadata:fetch");
  const response = await fetch(props.dataUrl, { signal: abortSignal });
  const data = await response.json();
  console.timeEnd("calculateMetadata:fetch");

  console.time("calculateMetadata:process");
  const processedData = data.items.map((item: any) => ({
    ...item,
    normalized: item.value / data.maxValue,
  }));
  console.timeEnd("calculateMetadata:process");

  console.timeEnd("calculateMetadata:total");

  return {
    props: { ...props, processedData },
    durationInFrames: processedData.length * 90 + 60,
  };
};
```

### Profiling Per-Frame Render Time

```tsx
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { useEffect } from "react";

export const ProfiledScene: React.FC<{ items: any[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const renderStart = performance.now();

  // ... your rendering logic ...

  useEffect(() => {
    const renderTime = performance.now() - renderStart;
    if (renderTime > 16) {
      // Log frames that take longer than 16ms (60fps budget)
      console.warn(`Frame ${frame} took ${renderTime.toFixed(1)}ms`);
    }
  });

  return (
    <AbsoluteFill>
      {/* composition content */}
    </AbsoluteFill>
  );
};
```

---

## Performance Checklist

Run through this checklist when your renders are slow:

- [ ] **Memoize**: Wrap expensive calculations in `useMemo()`
- [ ] **Fetch outside render**: Use `calculateMetadata` instead of `delayRender` for data fetching
- [ ] **Optimize images**: Use WebP, resize to display dimensions, compress
- [ ] **Optimize video**: Pre-trim with FFmpeg, use `<OffthreadVideo>`
- [ ] **Pre-calculate paths**: Compute complex animation trajectories once
- [ ] **Set durationInFrames**: On every `<Sequence>` to unmount offscreen content
- [ ] **Tune concurrency**: Lower for memory-heavy, higher for lightweight compositions
- [ ] **Use Canvas**: For particle effects or many small visual elements (100+)
- [ ] **Flatten Sequences**: Group related sequences to reduce tree depth
- [ ] **Profile**: Use `console.time` to find the actual bottleneck

---

## Summary: Impact Ranking

| Optimization | Effort | Impact | When to Apply |
|---|---|---|---|
| `calculateMetadata` for data | Low | Very High | Any composition with external data |
| Image compression/resizing | Low | High | Compositions with many images |
| `useMemo` for computations | Low | High | Compositions with complex math |
| Sequence durationInFrames | Low | High | Any multi-scene composition |
| `<OffthreadVideo>` | Low | Medium-High | Compositions with video files |
| Concurrency tuning | Low | Medium | All compositions |
| Pre-trim videos with FFmpeg | Medium | High | Long source videos |
| Canvas for particles | Medium | Very High | 100+ animated elements |
| Group Sequences | Medium | Medium | 50+ sequences |
| Segmented rendering | Medium | Medium | Very long videos |
