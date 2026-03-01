---
name: debugging
description: Common Remotion errors, diagnostic checklist, and troubleshooting guide
metadata:
  tags: debug, errors, troubleshooting, common-issues, fix
---

# Debugging and Troubleshooting

This guide covers the most common Remotion errors, their root causes, and how to fix them. Each issue includes the symptom you will observe, the underlying cause, and a concrete fix with code examples.

---

## 1. Blank or White Frames

### Symptom
The rendered video contains blank white frames, often at the beginning or intermittently throughout. The Studio preview may look fine but the rendered output has missing content.

### Cause
Content that depends on asynchronous loading (images, fonts, data) is not ready when the frame is captured. The renderer captures each frame immediately unless told to wait.

### Fix: Use `<Img>` Instead of `<img>`

Remotion's `<Img>` component automatically signals the renderer to wait for the image to load before capturing the frame.

```tsx
// BAD: Native <img> does not block rendering
import { AbsoluteFill } from "remotion";

export const BadExample: React.FC = () => {
  return (
    <AbsoluteFill>
      <img src="https://example.com/photo.jpg" />
    </AbsoluteFill>
  );
};

// GOOD: Remotion <Img> blocks rendering until loaded
import { AbsoluteFill, Img, staticFile } from "remotion";

export const GoodExample: React.FC = () => {
  return (
    <AbsoluteFill>
      <Img src={staticFile("images/photo.jpg")} />
    </AbsoluteFill>
  );
};
```

### Fix: Use delayRender for Async Data

When loading data asynchronously (API calls, dynamic imports), use `delayRender()` and `continueRender()` to block frame capture until the data is available.

```tsx
import { AbsoluteFill, delayRender, continueRender } from "remotion";
import { useCallback, useEffect, useState } from "react";

export const DataDrivenScene: React.FC = () => {
  const [data, setData] = useState<string[] | null>(null);
  const [handle] = useState(() => delayRender("Loading API data"));

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://api.example.com/items");
      const json = await response.json();
      setData(json.items);
      continueRender(handle);
    } catch (err) {
      // Cancel the render with an error message
      continueRender(handle);
    }
  }, [handle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) {
    return null;
  }

  return (
    <AbsoluteFill>
      {data.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </AbsoluteFill>
  );
};
```

**Tip**: Always pass a descriptive label to `delayRender()` so you can identify which delay is hanging if a render times out: `delayRender("Waiting for product images to load")`.

---

## 2. Flickering

### Symptom
Elements randomly appear and disappear, flicker in opacity, or jump between positions across consecutive frames. The preview may look smooth, but the rendered video shows inconsistencies.

### Cause
Non-deterministic rendering. Remotion renders each frame independently in a random order. Any code that relies on state persisting between frames, browser animation APIs, or CSS transitions will produce different results for each frame.

### Fix: Only Use `useCurrentFrame()`

```tsx
// BAD: CSS transitions cause flickering because each frame is rendered independently
export const BadFlicker: React.FC = () => {
  const frame = useCurrentFrame();
  const isVisible = frame > 30;

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease", // NEVER use CSS transitions
      }}
    >
      Hello
    </div>
  );
};

// BAD: requestAnimationFrame and useFrame() are non-deterministic
export const BadAnimation: React.FC = () => {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    // This runs differently for each frame render
    const id = requestAnimationFrame(() => setPos((p) => p + 1));
    return () => cancelAnimationFrame(id);
  }, []);

  return <div style={{ transform: `translateX(${pos}px)` }}>Moving</div>;
};

// GOOD: Derive everything from useCurrentFrame()
import { useCurrentFrame, interpolate } from "remotion";

export const GoodAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(frame, [0, 60], [0, 200], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      Hello
    </div>
  );
};
```

### Common Flickering Causes Checklist

- [ ] CSS `transition` property used -- remove it, use `interpolate()` instead
- [ ] `requestAnimationFrame` used -- remove it, derive from `useCurrentFrame()`
- [ ] `setTimeout` or `setInterval` used -- remove, calculate from frame number
- [ ] `Math.random()` without a seed -- use a deterministic random based on frame
- [ ] `Date.now()` or `new Date()` used -- derive time from frame and fps
- [ ] `useState` that changes over time -- derive from frame instead

---

## 3. Audio Sync Issues

### Symptom
Audio plays out of sync with the visual elements. Music cues do not line up with animations, or audio starts at the wrong time.

### Cause
Audio trimming uses frame numbers, not seconds. If your composition fps does not match your mental model, the timing will be off. Also, mixing audio files with different sample rates can cause drift.

### Fix: Align Audio with Frames

```tsx
import { Audio, Sequence, useVideoConfig, staticFile } from "remotion";

export const AudioSyncExample: React.FC = () => {
  const { fps } = useVideoConfig();

  // Convert seconds to frames for precise timing
  const musicStartFrame = Math.round(2 * fps); // 2 seconds in
  const sfxFrame = Math.round(5.5 * fps); // 5.5 seconds in

  return (
    <>
      {/* Background music starting at 2 seconds */}
      <Sequence from={musicStartFrame}>
        <Audio src={staticFile("audio/background.mp3")} volume={0.3} />
      </Sequence>

      {/* Sound effect at 5.5 seconds */}
      <Sequence from={sfxFrame} durationInFrames={Math.round(1 * fps)}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.8} />
      </Sequence>
    </>
  );
};
```

### Fix: Trim Audio

```tsx
import { Audio } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";

export const TrimmedAudio: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    // Skip the first 3 seconds and stop at 30 seconds
    // trimBefore and trimAfter are in SECONDS, not frames
    <Audio
      src={staticFile("audio/song.mp3")}
      trimBefore={3}
      trimAfter={30}
      volume={0.5}
    />
  );
};
```

**Common mistake**: Confusing `trimBefore`/`trimAfter` (which accept seconds) with frame-based values. These props trim the source media at the specified time in seconds.

---

## 4. Font Not Rendering

### Symptom
Text renders in a fallback system font (e.g., Times New Roman or Arial) instead of the intended custom font. This often only appears in the rendered output, not in the Studio preview.

### Cause
The custom font has not finished loading before the frame is captured. The Studio uses your browser's cached fonts, but the renderer starts fresh for each frame.

### Fix: Use loadFont() with waitUntilDone()

```tsx
import { AbsoluteFill } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

// Call waitUntilDone() to ensure the font is loaded before rendering
const { waitUntilDone } = loadFont();

export const FontExample: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: fontFamily,
        fontSize: 72,
      }}
    >
      This text uses Inter font
    </AbsoluteFill>
  );
};
```

### Fix: Load a Local Font with delayRender

```tsx
import { AbsoluteFill, delayRender, continueRender, staticFile } from "remotion";
import { useEffect, useState } from "react";

export const LocalFontExample: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading custom font"));

  useEffect(() => {
    const font = new FontFace("CustomFont", `url(${staticFile("fonts/CustomFont.woff2")})`);

    font
      .load()
      .then(() => {
        document.fonts.add(font);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Font load failed:", err);
        continueRender(handle);
      });
  }, [handle]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "CustomFont, sans-serif",
        fontSize: 64,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Custom font text
    </AbsoluteFill>
  );
};
```

---

## 5. Memory Errors on Long Videos

### Symptom
The render process crashes with "JavaScript heap out of memory" or the system becomes unresponsive during rendering. This typically happens with videos longer than a few minutes or compositions with many heavy assets.

### Cause
Too many frames are being rendered concurrently, each holding large images, canvases, or DOM trees in memory.

### Fix: Reduce Concurrency

```bash
# Default concurrency might be too high for memory-heavy compositions
# Reduce to 2 or even 1 for very heavy renders
npx remotion render MyComp out/video.mp4 --concurrency=2
```

### Fix: Render in Segments

```bash
# Render in segments and concatenate later
npx remotion render MyComp out/part1.mp4 --frames=0-899
npx remotion render MyComp out/part2.mp4 --frames=900-1799
npx remotion render MyComp out/part3.mp4 --frames=1800-2699

# Concatenate with FFmpeg
ffmpeg -f concat -safe 0 -i filelist.txt -c copy out/full-video.mp4
```

### Fix: Increase Node Memory Limit

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=8192" npx remotion render MyComp out/video.mp4
```

### Fix: Unmount Offscreen Content

```tsx
import { AbsoluteFill, Sequence } from "remotion";

// Sequences automatically unmount their children when the frame is outside
// their range. Use durationInFrames to limit each scene's lifetime.
export const MemoryFriendly: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* This component unmounts after frame 150 */}
      <Sequence from={0} durationInFrames={150} name="Scene 1">
        <HeavyScene1 />
      </Sequence>

      {/* This component only mounts at frame 150 */}
      <Sequence from={150} durationInFrames={150} name="Scene 2">
        <HeavyScene2 />
      </Sequence>

      {/* This component only mounts at frame 300 */}
      <Sequence from={300} durationInFrames={150} name="Scene 3">
        <HeavyScene3 />
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

## 6. "Could Not Play Video/Audio"

### Symptom
Error message in the Studio: "Could not play video with src ..." or "Could not play audio". The media file exists but fails to load.

### Cause
The media file uses a codec not supported by the browser's `<video>` or `<audio>` element. Common culprits: video encoded with VP9 in a non-WebM container, audio in FLAC or OGG, or video with B-frames that confuse the seeking mechanism.

### Fix: Convert to H.264 / AAC

```bash
# Convert video to H.264 with AAC audio (most compatible)
ffmpeg -i input-video.mov -c:v libx264 -c:a aac -movflags +faststart output.mp4

# Convert audio to AAC
ffmpeg -i input-audio.wav -c:a aac -b:a 192k output.mp3

# Remove B-frames from video (fixes seeking issues in Studio)
ffmpeg -i input.mp4 -c:v libx264 -bf 0 -c:a copy output-no-bframes.mp4

# Convert to a web-friendly format with faststart for streaming
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 18 -c:a aac -movflags +faststart output.mp4
```

### Supported Formats in Studio

| Type | Recommended Format | Notes |
|---|---|---|
| Video | H.264 in MP4 | Use `-movflags +faststart` for better seeking |
| Audio | AAC in M4A or MP3 | WAV also works but is large |
| Images | PNG, JPEG, WebP | Use `<Img>` component, not `<img>` |

---

## 7. Static File Not Found

### Symptom
Error: "Could not find file ..." or images/audio/video do not appear. The path looks correct but the file is not served.

### Cause
The file is not in the `public/` directory, or the path passed to `staticFile()` is incorrect (has a typo, wrong casing, or includes `public/` in the path).

### Fix: Verify the File Path

```tsx
// BAD: Including "public/" in the path
import { staticFile } from "remotion";
const bad = staticFile("public/images/logo.png"); // WRONG

// BAD: Wrong casing (file systems may be case-sensitive)
const bad2 = staticFile("images/Logo.PNG"); // File is actually "logo.png"

// GOOD: Path relative to the public/ directory
const good = staticFile("images/logo.png");
```

### Fix: Check the public/ Folder Structure

```
public/
├── images/
│   └── logo.png        <-- staticFile("images/logo.png")
├── audio/
│   └── music.mp3       <-- staticFile("audio/music.mp3")
└── video/
    └── clip.mp4        <-- staticFile("video/clip.mp4")
```

### Diagnostic Steps

1. Verify the file exists: `ls public/images/logo.png`
2. Check exact casing: file systems on Linux and in Docker are case-sensitive
3. Verify you are not nesting `public/` inside the path
4. Ensure the file is committed to version control if rendering on CI
5. Try opening `http://localhost:3000/images/logo.png` in the browser while Studio is running

---

## 8. Studio vs Render Differences

### Symptom
The video looks correct in the Remotion Studio preview but the rendered output looks different: missing elements, wrong colors, different font rendering, or broken layouts.

### Cause
The Studio runs in your full Chrome browser with all extensions and cached data. The renderer runs in a headless Chromium instance that may behave differently for certain APIs.

### Common Differences and Fixes

| Difference | Cause | Fix |
|---|---|---|
| Missing fonts | Browser has cached fonts, renderer does not | Use `loadFont()` with `waitUntilDone()` |
| Different text wrapping | Headless browser has slightly different font metrics | Set explicit `width` on text containers |
| Missing images | Browser cache, renderer fetches fresh | Use `<Img>` component to block on load |
| WebGL/Canvas issues | Different GPU driver in headless mode | Use `--gl=angle` flag |
| CSS backdrop-filter missing | Headless Chromium may not support some CSS | Use `--gl=angle` or use a solid background fallback |
| Video not displaying | Browser codec support differs | Convert videos to H.264 |

### Debugging Strategy

```bash
# Render a single frame to see what the renderer produces
npx remotion still MyComp out/debug-frame.png --frame=45

# Compare with what the Studio shows at frame 45
# If they differ, the issue is a render-vs-browser discrepancy

# Try with ANGLE rendering
npx remotion still MyComp out/debug-frame-angle.png --frame=45 --gl=angle
```

---

## 9. delayRender Timeout

### Symptom
Error: "A delayRender() was called but after 30 seconds the render was not continued. Your render function must call continueRender() within the timeout."

### Cause
`delayRender()` was called but `continueRender()` was never called. This usually means an async operation failed silently, or the `continueRender()` call is inside a code path that is never reached.

### Fix: Always Call continueRender in Error Cases

```tsx
import { delayRender, continueRender, cancelRender } from "remotion";
import { useCallback, useEffect, useState } from "react";

export const RobustDataLoad: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [handle] = useState(() => delayRender("Fetching dashboard data"));

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("https://api.example.com/data");
      if (!res.ok) {
        // Cancel the entire render with an error
        cancelRender(new Error(`API returned ${res.status}`));
        return;
      }
      const json = await res.json();
      setData(json);
      continueRender(handle);
    } catch (err) {
      // Cancel the render so it fails fast instead of timing out
      cancelRender(err instanceof Error ? err : new Error(String(err)));
    }
  }, [handle]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!data) return null;

  return <div>{JSON.stringify(data)}</div>;
};
```

### Fix: Increase the Timeout

```tsx
// For slow APIs, increase the timeout (default is 30000ms)
const handle = delayRender("Loading large dataset", {
  timeoutInMilliseconds: 60000, // 60 seconds
});
```

---

## 10. Composition Not Found

### Symptom
Error: "No composition with the ID 'MyComp' found" when running `npx remotion render MyComp`.

### Cause
The composition ID does not match what is registered in Root.tsx. IDs are case-sensitive.

### Fix

```bash
# List all available compositions
npx remotion compositions

# Check the exact ID in Root.tsx
# The id prop is what you pass to the CLI, not the component name
```

```tsx
// Root.tsx
<Composition
  id="MyComposition"  // <-- This is the ID to use in the CLI
  component={MyComp}  // <-- This is NOT the CLI identifier
  // ...
/>
```

```bash
# Correct usage
npx remotion render MyComposition out/video.mp4
```

---

## Diagnostic Checklist

When you encounter any rendering issue, walk through this checklist systematically:

### Step 1: Isolate the Problem

```bash
# 1. Can you see the composition in the Studio?
npx remotion studio

# 2. Does a single frame render correctly?
npx remotion still MyComp out/test.png --frame=0 --log=verbose

# 3. Does the issue happen on a specific frame?
npx remotion still MyComp out/test-50.png --frame=50
npx remotion still MyComp out/test-100.png --frame=100
```

### Step 2: Check for Common Causes

- [ ] Is every `delayRender()` paired with a `continueRender()` or `cancelRender()`?
- [ ] Are all images using `<Img>` (not `<img>`)?
- [ ] Are all videos using `<Video>` or `<OffthreadVideo>` (not `<video>`)?
- [ ] Are all animations derived from `useCurrentFrame()` (no CSS transitions, no requestAnimationFrame)?
- [ ] Are fonts loaded with `loadFont()` and `waitUntilDone()`?
- [ ] Are static files in `public/` and referenced with `staticFile()`?
- [ ] Is `Math.random()` avoided (or seeded deterministically)?

### Step 3: Gather Information

```bash
# Verbose logging reveals detailed error information
npx remotion render MyComp out/video.mp4 --log=verbose

# Check Remotion version
npx remotion --version

# Check for outdated packages
npm outdated | grep remotion
```

### Step 4: Simplify and Reproduce

1. Comment out sections of the composition to find which part causes the issue
2. Replace dynamic data with hardcoded values to rule out data issues
3. Test with a minimal composition that only contains the problematic element
4. Try rendering with `--concurrency=1` to rule out parallelism issues

### Step 5: Environment Checks

```bash
# Check if ANGLE rendering fixes the issue
npx remotion render MyComp out/test.mp4 --gl=angle

# Check available memory
node -e "console.log(process.memoryUsage())"

# Render with increased memory
NODE_OPTIONS="--max-old-space-size=8192" npx remotion render MyComp out/test.mp4
```

---

## Quick Reference: Error to Fix

| Error / Symptom | Most Likely Fix |
|---|---|
| Blank/white frames | Use `<Img>`, add `delayRender()` |
| Flickering elements | Remove CSS transitions, use `interpolate()` |
| Audio out of sync | Multiply seconds by fps for frame values |
| Wrong font in render | `loadFont()` + `waitUntilDone()` |
| Out of memory | `--concurrency=2`, segment rendering |
| Cannot play media | Convert to H.264/AAC with FFmpeg |
| File not found | Check `public/` path, case sensitivity |
| Render looks different from Studio | Use `--gl=angle`, ensure fonts loaded |
| delayRender timeout | Ensure `continueRender()` is called in all code paths |
| Composition not found | Check exact `id` prop in Root.tsx |
