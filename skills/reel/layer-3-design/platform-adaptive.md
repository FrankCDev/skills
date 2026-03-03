---
name: platform-adaptive
description: Platform-aware design system for mobile, desktop, social platforms, and large screens with responsive patterns
metadata:
  tags: mobile, responsive, adaptive, platform, tiktok, reels, shorts, instagram, youtube, desktop, tv
---

# Platform-Adaptive Design

Videos live on different screens — a phone held vertically on a subway, a laptop in a meeting, a TV across the room. The same content needs different treatment depending on where it's watched. This guide helps you make the right design choices for each viewing context.

---

## Platform Decision Matrix

Before designing, answer one question: **Where will people watch this?**

| Platform | Aspect | Resolution | Avg View Duration | Sound | Viewing Distance |
|----------|--------|------------|-------------------|-------|-----------------|
| TikTok | 9:16 | 1080×1920 | 3-15s | Often off | 30cm (handheld) |
| Instagram Reels | 9:16 | 1080×1920 | 5-30s | Often off | 30cm (handheld) |
| YouTube Shorts | 9:16 | 1080×1920 | 15-60s | Mixed | 30cm (handheld) |
| Instagram Post | 1:1 | 1080×1080 | 5-30s | Usually off | 30cm (handheld) |
| Instagram Story | 9:16 | 1080×1920 | 5-15s | Mixed | 30cm (handheld) |
| YouTube | 16:9 | 1920×1080 | 2-10min | On | 50cm-3m |
| LinkedIn | 16:9 | 1920×1080 | 15-60s | Usually off | 50cm (desktop) |
| Conference / TV | 16:9 | 3840×2160 | 5-30min | On | 3-10m |
| Keynote / Webinar | 16:9 | 1920×1080 | 1-60min | On | 1-5m |

---

## Adaptive Type Scale

Text size must adapt to viewing context. The same 24px body text that's readable on a desktop presentation is invisible on a phone screen.

```ts
// Platform-aware type scale
// All values in pixels at native resolution

export const typeScale = {
  // Mobile-first (9:16, 1080×1920, viewed at 30cm)
  mobile: {
    display: 120,    // Hero hooks, single words
    h1: 80,          // Scene titles
    h2: 56,          // Section headers
    body: 40,        // Readable body text
    caption: 32,     // Labels, timestamps
    label: 26,       // Small tags, badges
    minimum: 26,     // Nothing smaller than this
  },

  // Desktop / Landscape (16:9, 1920×1080, viewed at 50cm-3m)
  desktop: {
    display: 96,
    h1: 64,
    h2: 44,
    body: 26,
    caption: 20,
    label: 16,
    minimum: 16,
  },

  // Large screen / 4K (16:9, 3840×2160, viewed at 3-10m)
  large: {
    display: 180,
    h1: 120,
    h2: 80,
    body: 48,
    caption: 36,
    label: 28,
    minimum: 28,
  },

  // Square (1:1, 1080×1080, viewed at 30cm)
  square: {
    display: 96,
    h1: 64,
    h2: 48,
    body: 36,
    caption: 28,
    label: 22,
    minimum: 22,
  },
} as const;

export type PlatformTarget = keyof typeof typeScale;
```

### Auto-Select Type Scale

```tsx
import { useVideoConfig } from 'remotion';

const useTypeScale = () => {
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;
  const isSquare = Math.abs(width - height) < 100;
  const is4K = width >= 3840;

  if (isSquare) return typeScale.square;
  if (isPortrait) return typeScale.mobile;
  if (is4K) return typeScale.large;
  return typeScale.desktop;
};
```

---

## Platform Safe Zones

Different platforms overlay UI elements at different positions. Content beneath these overlays becomes invisible.

```ts
export const platformSafeZones = {
  // TikTok: username, caption, and music info at bottom; share buttons on right
  tiktok: {
    width: 1080,
    height: 1920,
    top: 150,        // Status bar + back button
    bottom: 400,     // Username, caption, music ticker
    left: 40,
    right: 120,      // Like, comment, share, bookmark buttons
  },

  // Instagram Reels: similar to TikTok but slightly different overlay
  instagramReels: {
    width: 1080,
    height: 1920,
    top: 120,        // Status bar
    bottom: 380,     // Username, caption, audio, CTA
    left: 40,
    right: 100,      // Like, comment, share buttons
  },

  // YouTube Shorts: title and channel info at bottom
  youtubeShorts: {
    width: 1080,
    height: 1920,
    top: 120,        // Status bar
    bottom: 350,     // Channel info, subscribe button, title
    left: 40,
    right: 100,      // Like, dislike, comment, share
  },

  // Instagram Story: minimal overlay
  instagramStory: {
    width: 1080,
    height: 1920,
    top: 160,        // Status bar + story bar
    bottom: 200,     // Reply bar + swipe up
    left: 40,
    right: 40,
  },

  // YouTube landscape: progress bar at bottom, controls overlay
  youtube: {
    width: 1920,
    height: 1080,
    top: 60,
    bottom: 80,      // Progress bar + controls
    left: 60,
    right: 60,
  },

  // Presentation / clean: minimal safe margin
  presentation: {
    width: 1920,
    height: 1080,
    top: 54,
    bottom: 54,
    left: 96,
    right: 96,
  },
} as const;

export type Platform = keyof typeof platformSafeZones;
```

### PlatformSafeArea Component

```tsx
import { AbsoluteFill } from 'remotion';

interface PlatformSafeAreaProps {
  children: React.ReactNode;
  platform: Platform;
  showDebug?: boolean;
}

const PlatformSafeArea: React.FC<PlatformSafeAreaProps> = ({
  children,
  platform,
  showDebug = false,
}) => {
  const zones = platformSafeZones[platform];

  return (
    <AbsoluteFill>
      {/* Debug overlay: shows danger zones in red */}
      {showDebug && (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: zones.top,
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
            borderBottom: '1px dashed rgba(255, 0, 0, 0.4)',
            zIndex: 999,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: zones.bottom,
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
            borderTop: '1px dashed rgba(255, 0, 0, 0.4)',
            zIndex: 999,
          }} />
          <div style={{
            position: 'absolute', top: zones.top, left: 0,
            width: zones.left,
            height: zones.height - zones.top - zones.bottom,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            zIndex: 999,
          }} />
          <div style={{
            position: 'absolute', top: zones.top, right: 0,
            width: zones.right,
            height: zones.height - zones.top - zones.bottom,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            zIndex: 999,
          }} />
        </>
      )}

      {/* Content area within safe zone */}
      <div style={{
        position: 'absolute',
        top: zones.top,
        left: zones.left,
        right: zones.right,
        bottom: zones.bottom,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
```

---

## Sound-Off Design

Over 80% of mobile social media videos are watched without sound initially. Design for silence first, then enhance with audio.

### Principles

1. **Text drives the narrative** — Every key message must appear as text on screen, not just in voiceover
2. **Visual rhythm replaces audio rhythm** — Use animation timing to create pace without sound
3. **Captions are mandatory, not optional** — Always add captions for spoken content
4. **Sound is a bonus layer** — Audio should enhance, not carry, the message

### Sound-Off Scene Pattern

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Sequence } from 'remotion';

// Sound-off friendly: text carries the full message
const SoundOffScene: React.FC<{
  headline: string;
  body: string;
  fps: number;
}> = ({ headline, body, fps }) => {
  const frame = useCurrentFrame();

  const headlineSpring = spring({ frame, fps, config: { damping: 200 } });
  const bodySpring = spring({ frame: frame - 12, fps, config: { damping: 200 } });

  const headlineY = interpolate(headlineSpring, [0, 1], [30, 0]);
  const bodyY = interpolate(bodySpring, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0A0A0F',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 80,
    }}>
      {/* Large, bold headline — readable even at small sizes */}
      <div style={{
        fontSize: 72,
        fontWeight: 800,
        color: '#F5F5F7',
        textAlign: 'center',
        lineHeight: 1.1,
        opacity: headlineSpring,
        transform: `translateY(${headlineY}px)`,
        maxWidth: '80%',
      }}>
        {headline}
      </div>

      {/* Supporting text — appears shortly after */}
      <div style={{
        fontSize: 32,
        fontWeight: 400,
        color: '#86868B',
        textAlign: 'center',
        lineHeight: 1.4,
        marginTop: 24,
        opacity: Math.max(0, bodySpring),
        transform: `translateY(${bodyY}px)`,
        maxWidth: '70%',
      }}>
        {body}
      </div>
    </AbsoluteFill>
  );
};
```

---

## Thumb-Stop Patterns

On mobile feeds, you have less than 1 second to stop a user from scrolling past. The first frame must demand attention.

### Hook Techniques

```ts
// Ranked by effectiveness on mobile feeds
const hookPatterns = {
  // 1. Bold text on contrasting background — fastest to parse
  boldStatement: {
    fontSize: 120,       // Massive, can't miss it
    fontWeight: 900,
    maxWords: 5,         // "You're Doing It Wrong"
    enterFrames: 0,      // Visible from frame 0 — no fade in
  },

  // 2. Big number — triggers curiosity
  statistic: {
    fontSize: 160,
    fontWeight: 800,
    format: '$XXX / XX% / XXM',  // "$4.2B", "97%", "10M+"
    enterFrames: 0,
  },

  // 3. Question — creates open loop
  question: {
    fontSize: 80,
    fontWeight: 700,
    endWithQuestionMark: true,    // "Why do 90% of startups fail?"
    enterFrames: 0,
  },

  // 4. Motion hook — something already moving on frame 1
  motion: {
    startAnimationAt: -10,  // Use negative Sequence from to pre-start
    speed: 'fast',          // snappy or elastic spring
  },
} as const;
```

### Frame-Zero Hook Component

```tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';

// Content is VISIBLE from frame 0 — no slow fade-in
// Then animates for emphasis, not for entrance
const ThumbStopHook: React.FC<{
  text: string;
  fps: number;
}> = ({ text, fps }) => {
  const frame = useCurrentFrame();

  // Scale starts at 1.1 and settles to 1.0 — already visible, just refining
  const settleSpring = spring({
    frame,
    fps,
    config: { mass: 1, damping: 20, stiffness: 300 },
  });
  const scale = interpolate(settleSpring, [0, 1], [1.1, 1]);

  // Subtle glow pulse for emphasis
  const glowOpacity = interpolate(
    frame,
    [0, 15, 30],
    [0.8, 0.3, 0],
    { extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0F0C29',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Background glow — draws eye to center */}
      <div style={{
        position: 'absolute',
        width: '60%',
        height: '40%',
        background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.4), transparent)',
        opacity: glowOpacity,
      }} />

      <div style={{
        fontSize: 120,
        fontWeight: 900,
        color: '#F0F0F0',
        textAlign: 'center',
        transform: `scale(${scale})`,
        lineHeight: 1.05,
        padding: '0 60px',
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
```

---

## Responsive Layout Patterns

Build once, adapt to any aspect ratio using `useVideoConfig()`.

### Adaptive Composition

```tsx
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

interface AdaptiveSceneProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
}

const AdaptiveScene: React.FC<AdaptiveSceneProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;
  const isSquare = Math.abs(width - height) < 100;

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const subtitleSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });

  // Adaptive sizing
  const titleSize = isPortrait ? 80 : isSquare ? 64 : 64;
  const subtitleSize = isPortrait ? 36 : isSquare ? 28 : 26;
  const padding = isPortrait ? '96px 54px' : isSquare ? '54px' : '54px 96px';
  const layout = isPortrait ? 'column' : 'row';
  const textAlign = isPortrait ? 'center' : 'left';
  const titleMaxWidth = isPortrait ? '100%' : '60%';

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0A0A0F',
      padding,
      display: 'flex',
      flexDirection: layout,
      justifyContent: 'center',
      alignItems: isPortrait ? 'center' : 'flex-start',
      gap: isPortrait ? 32 : 64,
    }}>
      <div style={{ maxWidth: titleMaxWidth }}>
        <div style={{
          fontSize: titleSize,
          fontWeight: 700,
          color: '#F5F5F7',
          lineHeight: 1.1,
          textAlign: textAlign as 'center' | 'left',
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
        }}>
          {title}
        </div>

        <div style={{
          fontSize: subtitleSize,
          fontWeight: 400,
          color: '#86868B',
          lineHeight: 1.4,
          textAlign: textAlign as 'center' | 'left',
          marginTop: 16,
          opacity: Math.max(0, subtitleSpring),
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [20, 0])}px)`,
        }}>
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

### Multi-Format Registration

Register the same composition in all formats at once:

```tsx
import { Composition, Folder } from 'remotion';

const formats = [
  { suffix: 'Landscape', width: 1920, height: 1080 },
  { suffix: 'Vertical', width: 1080, height: 1920 },
  { suffix: 'Square', width: 1080, height: 1080 },
  { suffix: '4K', width: 3840, height: 2160 },
] as const;

export const RemotionRoot: React.FC = () => (
  <Folder name="Product Launch">
    {formats.map(({ suffix, width, height }) => (
      <Composition
        key={suffix}
        id={`ProductLaunch-${suffix}`}
        component={AdaptiveScene}
        width={width}
        height={height}
        fps={30}
        durationInFrames={900}
        defaultProps={{
          title: 'Introducing Our Product',
          subtitle: 'The future starts now.',
        }}
      />
    ))}
  </Folder>
);
```

---

## Mobile-Specific Design Rules

When targeting mobile platforms (TikTok, Reels, Shorts, Stories):

### Do

- **Use 40px+ body text** — Anything smaller is unreadable on a 6-inch screen
- **Keep 5 words or fewer per screen** — Mobile viewers scan, they don't read
- **Front-load content** — Put the hook at frame 0, not after a 3-second intro
- **Use high contrast** — Phones are viewed outdoors in sunlight; low-contrast text disappears
- **Fill the frame** — No tiny centered content with massive empty margins
- **Pace at 3-5 seconds per scene** — Mobile attention span is short
- **Design for portrait grip** — Content in center-to-upper-third is most visible

### Don't

- **Don't use thin font weights** — Weight 300 and below is hard to read on small screens
- **Don't put critical content in bottom 20%** — Platform UI covers it
- **Don't rely on fine details** — Subtle textures, thin borders, and small icons are lost
- **Don't use slow entrances** — 2-second fade-ins feel like loading on mobile
- **Don't assume landscape** — Most mobile users won't rotate their phone

---

## Desktop / Presentation Design Rules

When targeting desktop, keynote, or webinar:

### Do

- **Use generous whitespace** — Large screens can afford breathing room
- **Layer information** — Main content + supporting details + ambient background
- **Use subtle animations** — Gentle springs, longer durations, smooth transitions
- **Support wide layouts** — Two-column, three-column, and split-screen work well
- **Include fine details** — Subtle gradients, glass effects, and micro-interactions shine on desktop

### Don't

- **Don't make text too large** — 96px display text is appropriate; 160px is overwhelming on a 27" screen
- **Don't pace too fast** — Desktop viewers expect more depth per scene
- **Don't ignore the corners** — Wide aspect ratios have usable corner space for logos, timestamps, labels

---

## Large Screen / 4K Design Rules

When targeting TV, conference displays, or 4K output:

### Do

- **Scale everything proportionally** — 4K is 2× the pixels of 1080p; elements should be 1.5-2× larger
- **Use maximum image quality** — Compression artifacts are visible on large screens
- **Increase line weight** — Thin 1px borders at 1080p should be 2-3px at 4K
- **Test at actual viewing distance** — Step back 3 meters from your monitor to simulate

### Don't

- **Don't assume pixel-perfect rendering** — Some displays upscale; keep safe margins wide
- **Don't use aliased edges** — Anti-aliasing issues are magnified at 4K

---

## Compression Per Platform

Different platforms have different upload limits and recommended settings.

```ts
export const platformEncoding = {
  tiktok: {
    codec: 'h264' as const,
    maxFileSize: '287MB',
    maxDuration: 600,    // 10 minutes
    recommendedBitrate: '8M',
    crf: 18,
    notes: 'TikTok re-encodes all uploads. Provide highest quality.',
  },
  instagramReels: {
    codec: 'h264' as const,
    maxFileSize: '4GB',
    maxDuration: 5400,   // 90 minutes
    recommendedBitrate: '8M',
    crf: 18,
    notes: 'Instagram heavily re-compresses. Upload high quality.',
  },
  youtubeShorts: {
    codec: 'h264' as const,
    maxFileSize: '256MB',
    maxDuration: 180,    // 3 minutes (Shorts ≤ 3min)
    recommendedBitrate: '10M',
    crf: 17,
    notes: 'YouTube preserves quality well. CRF 17-18 is sufficient.',
  },
  youtube: {
    codec: 'h264' as const,
    maxFileSize: '256GB',
    maxDuration: 43200,  // 12 hours
    recommendedBitrate: '12M',
    crf: 17,
    notes: 'For 4K, use VP9 codec with CRF 28-32.',
  },
  linkedin: {
    codec: 'h264' as const,
    maxFileSize: '5GB',
    maxDuration: 600,
    recommendedBitrate: '6M',
    crf: 20,
    notes: 'LinkedIn auto-mutes in feed. Design for sound-off.',
  },
  presentation: {
    codec: 'h264' as const,
    maxFileSize: null,
    maxDuration: null,
    recommendedBitrate: '20M',
    crf: 15,
    notes: 'Max quality. ProRes if editing in post.',
  },
} as const;
```

### Render Command Examples

```bash
# TikTok / Instagram Reels (high quality, H.264)
npx remotion render MyComp-Vertical out/reels.mp4 --codec=h264 --crf=18

# YouTube (standard HD)
npx remotion render MyComp-Landscape out/youtube.mp4 --codec=h264 --crf=17

# YouTube 4K (VP9 for better compression)
npx remotion render MyComp-4K out/youtube-4k.webm --codec=vp9 --crf=28

# Presentation (maximum quality, ProRes)
npx remotion render MyComp-Landscape out/keynote.mov --codec=prores --prores-profile=hq

# LinkedIn (smaller file, sound-off friendly)
npx remotion render MyComp-Landscape out/linkedin.mp4 --codec=h264 --crf=20
```

---

## Quick Reference: Platform Checklist

Before exporting, verify your video against the target platform:

### Mobile Platforms (TikTok / Reels / Shorts)

- [ ] Aspect ratio is 9:16 (1080×1920)
- [ ] No critical content in bottom 20% or right 10%
- [ ] Minimum text size is 40px
- [ ] Hook is visible from frame 0 (no slow intro)
- [ ] Watchable without sound (text carries the message)
- [ ] Scene pace is 3-5 seconds each
- [ ] Font weight is 500+ for body, 700+ for headlines
- [ ] Captions included for any voiceover

### Desktop / YouTube (Landscape)

- [ ] Aspect ratio is 16:9 (1920×1080)
- [ ] Safe margins of 60-96px on all sides
- [ ] Type scale uses desktop sizes (64px h1, 26px body)
- [ ] Whitespace feels generous, not cramped
- [ ] Animations use smooth or gentle springs

### Square (Instagram Post)

- [ ] Aspect ratio is 1:1 (1080×1080)
- [ ] Content centered vertically and horizontally
- [ ] Text size between mobile and desktop scale
- [ ] Works as both a static thumbnail and animated video

### Presentation / Keynote

- [ ] Highest quality encoding (CRF 15 or ProRes)
- [ ] No compression artifacts visible at full screen
- [ ] Fine details (glass effects, gradients) render cleanly
- [ ] Pacing allows audience to absorb information

---

## Anti-Patterns

- **Designing landscape-first and cropping to vertical** — Cropping loses composition. Design natively for each format, or use responsive `useVideoConfig()` patterns.
- **Same text size for all platforms** — 26px body text is fine on desktop but invisible on mobile. Always adapt.
- **Ignoring platform UI overlays** — Beautiful content hidden behind TikTok's share buttons is wasted work. Use `PlatformSafeArea`.
- **Slow intros on mobile** — A 3-second logo animation before content means 80% of mobile viewers have already scrolled away.
- **Assuming sound is on** — Design for silence first. Audio is the enhancement, not the foundation.
- **Testing only on desktop** — Preview at actual phone screen size (375×812 CSS pixels) to check readability.
