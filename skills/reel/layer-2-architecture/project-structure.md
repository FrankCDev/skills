---
name: project-structure
description: How to organize a Remotion project for maintainability and scalability
metadata:
  tags: architecture, project, structure, organization, best-practices
---

# Remotion Project Structure

A well-organized Remotion project makes compositions easy to find, components reusable, and the codebase scalable as video complexity grows. This guide covers the recommended folder layout, naming conventions, shared patterns, and Root.tsx organization.

---

## Recommended Folder Layout

```
my-remotion-project/
├── src/
│   ├── Root.tsx                    # Registers all compositions
│   ├── compositions/               # Top-level video compositions
│   │   ├── ProductDemo/
│   │   │   ├── ProductDemo.tsx      # Main composition component
│   │   │   ├── scenes/
│   │   │   │   ├── IntroScene.tsx
│   │   │   │   ├── FeaturesScene.tsx
│   │   │   │   └── OutroScene.tsx
│   │   │   └── schema.ts           # Zod schema + types for this composition
│   │   ├── SocialPost/
│   │   │   ├── SocialPost.tsx
│   │   │   ├── scenes/
│   │   │   │   ├── HeadlineScene.tsx
│   │   │   │   └── StatsScene.tsx
│   │   │   └── schema.ts
│   │   └── WeeklyReport/
│   │       ├── WeeklyReport.tsx
│   │       ├── scenes/
│   │       │   ├── CoverScene.tsx
│   │       │   ├── ChartScene.tsx
│   │       │   └── SummaryScene.tsx
│   │       └── schema.ts
│   ├── components/                  # Shared, reusable UI components
│   │   ├── AnimatedTitle.tsx
│   │   ├── FadeIn.tsx
│   │   ├── LogoReveal.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Background.tsx
│   │   └── SlideTransition.tsx
│   ├── lib/                         # Utility functions and helpers
│   │   ├── animations.ts            # Easing helpers, spring presets
│   │   ├── colors.ts                # Brand color palettes
│   │   ├── timing.ts                # Duration/frame calculators
│   │   ├── fonts.ts                 # Font loading utilities
│   │   └── math.ts                  # Interpolation helpers
│   ├── data/                        # Static data, configs, mock data
│   │   ├── sampleProducts.ts
│   │   └── weeklyReportConfig.ts
│   └── types/                       # Shared TypeScript types
│       ├── common.ts
│       └── themes.ts
├── public/                          # Static assets (images, audio, video, fonts)
│   ├── images/
│   │   ├── logo.png
│   │   └── product-hero.webp
│   ├── audio/
│   │   ├── background-music.mp3
│   │   └── whoosh.mp3
│   ├── video/
│   │   └── overlay-clip.mp4
│   └── fonts/
│       └── CustomFont.woff2
├── .env                             # Environment variables
├── remotion.config.ts               # Remotion bundler configuration
├── package.json
└── tsconfig.json
```

### Why This Layout Works

- **`compositions/`** groups each video project with its own scenes and schema, so everything related to one composition stays together.
- **`components/`** holds reusable building blocks shared across multiple compositions.
- **`lib/`** contains pure utility functions with no React dependency, making them easy to test and reuse.
- **`data/`** separates static configuration from rendering logic.
- **`public/`** is the only place Remotion can serve static files from via `staticFile()`.

---

## Root.tsx Organization with Folders

Root.tsx is the entry point that registers all compositions. Use `<Folder>` to group related compositions in the Studio sidebar for easy navigation.

```tsx
// src/Root.tsx
import { Composition, Folder } from "remotion";
import { ProductDemo } from "./compositions/ProductDemo/ProductDemo";
import { productDemoSchema } from "./compositions/ProductDemo/schema";
import { SocialPost } from "./compositions/SocialPost/SocialPost";
import { socialPostSchema } from "./compositions/SocialPost/schema";
import { WeeklyReport } from "./compositions/WeeklyReport/WeeklyReport";
import { weeklyReportSchema } from "./compositions/WeeklyReport/schema";
import { calculateWeeklyReportMetadata } from "./compositions/WeeklyReport/WeeklyReport";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Marketing videos */}
      <Folder name="Marketing">
        <Composition
          id="ProductDemo"
          component={ProductDemo}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          schema={productDemoSchema}
          defaultProps={{
            productName: "Acme Widget",
            tagline: "Built for speed",
            primaryColor: "#3B82F6",
          }}
        />
        <Composition
          id="ProductDemo-Vertical"
          component={ProductDemo}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          schema={productDemoSchema}
          defaultProps={{
            productName: "Acme Widget",
            tagline: "Built for speed",
            primaryColor: "#3B82F6",
          }}
        />
      </Folder>

      {/* Social media content */}
      <Folder name="Social">
        <Composition
          id="SocialPost-Reels"
          component={SocialPost}
          durationInFrames={450}
          fps={30}
          width={1080}
          height={1920}
          schema={socialPostSchema}
          defaultProps={{
            headline: "Big News!",
            body: "Check out our latest feature.",
          }}
        />
        <Composition
          id="SocialPost-Square"
          component={SocialPost}
          durationInFrames={450}
          fps={30}
          width={1080}
          height={1080}
          schema={socialPostSchema}
          defaultProps={{
            headline: "Big News!",
            body: "Check out our latest feature.",
          }}
        />
      </Folder>

      {/* Data-driven reports */}
      <Folder name="Reports">
        <Composition
          id="WeeklyReport"
          component={WeeklyReport}
          durationInFrames={600}
          fps={30}
          width={1920}
          height={1080}
          schema={weeklyReportSchema}
          defaultProps={{
            reportUrl: "https://api.example.com/weekly-report",
          }}
          calculateMetadata={calculateWeeklyReportMetadata}
        />
      </Folder>
    </>
  );
};
```

**Key points about Folders:**
- `<Folder name="Marketing">` groups compositions under a collapsible sidebar section in Remotion Studio.
- Folders are purely organizational -- they have no effect on rendering.
- You can nest Folders inside Folders for deeper hierarchy.
- Each `<Composition>` still needs a globally unique `id`.

---

## Component Naming Conventions

Follow these conventions consistently across the project:

| Item | Convention | Example |
|---|---|---|
| Composition components | PascalCase | `ProductDemo.tsx` |
| Scene components | PascalCase with `Scene` suffix | `IntroScene.tsx` |
| Shared UI components | PascalCase | `AnimatedTitle.tsx` |
| Utility functions | camelCase | `animations.ts`, `formatDuration()` |
| Zod schemas | camelCase with `Schema` suffix | `productDemoSchema` |
| Type definitions | PascalCase with descriptive name | `ProductDemoProps` |
| Static assets | kebab-case | `hero-background.webp` |
| Composition IDs | PascalCase, hyphenated for variants | `"ProductDemo"`, `"ProductDemo-Vertical"` |

---

## Shared Types and Props Patterns

Use `type` instead of `interface` for Remotion props. This is important because Remotion's `z.infer` utility from Zod produces type aliases, and using `type` keeps everything consistent and avoids subtle TypeScript issues with mapped types.

### Define Schemas with Zod

```tsx
// src/compositions/ProductDemo/schema.ts
import { z } from "zod";

export const productDemoSchema = z.object({
  productName: z.string(),
  tagline: z.string(),
  primaryColor: z.string(),
  showPricing: z.boolean().optional(),
  logoUrl: z.string().optional(),
});

// Derive the type from the schema -- always use `type`, not `interface`
export type ProductDemoProps = z.infer<typeof productDemoSchema>;
```

### Use the Derived Type in Components

```tsx
// src/compositions/ProductDemo/ProductDemo.tsx
import { AbsoluteFill, Sequence } from "remotion";
import type { ProductDemoProps } from "./schema";
import { IntroScene } from "./scenes/IntroScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { OutroScene } from "./scenes/OutroScene";

export const ProductDemo: React.FC<ProductDemoProps> = ({
  productName,
  tagline,
  primaryColor,
  showPricing = false,
}) => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90} name="Intro">
        <IntroScene productName={productName} primaryColor={primaryColor} />
      </Sequence>
      <Sequence from={90} durationInFrames={120} name="Features">
        <FeaturesScene tagline={tagline} showPricing={showPricing} />
      </Sequence>
      <Sequence from={210} durationInFrames={90} name="Outro">
        <OutroScene productName={productName} primaryColor={primaryColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### Common Shared Types

```tsx
// src/types/common.ts

// Reusable dimension type for responsive compositions
export type Dimensions = {
  width: number;
  height: number;
};

// Theme colors used across compositions
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
};

// Standard scene props that every scene component receives
export type BaseSceneProps = {
  theme: ThemeColors;
  dimensions: Dimensions;
};
```

---

## Shared Utility Functions

### Animation Helpers

```tsx
// src/lib/animations.ts
import { interpolate, spring, SpringConfig } from "remotion";

// Preset spring configs for consistent motion across the project
// Match the presets from layer-3-design/motion-language.md
export const SPRING_PRESETS = {
  gentle: { mass: 1, damping: 15, stiffness: 100 } satisfies SpringConfig,
  smooth: { damping: 200 } satisfies SpringConfig,
  snappy: { mass: 1, damping: 20, stiffness: 300 } satisfies SpringConfig,
  bouncy: { mass: 1, damping: 10, stiffness: 200 } satisfies SpringConfig,
  heavy: { mass: 3, damping: 25, stiffness: 150 } satisfies SpringConfig,
  elastic: { mass: 1, damping: 8, stiffness: 150 } satisfies SpringConfig,
} as const;

// Fade in from 0 to 1 over a range of frames
export const fadeIn = (
  frame: number,
  startFrame: number,
  durationFrames: number,
): number => {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Slide in from a direction
export const slideIn = (
  frame: number,
  fps: number,
  direction: "left" | "right" | "top" | "bottom" = "left",
  delay: number = 0,
): { translateX: number; translateY: number; opacity: number } => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_PRESETS.gentle,
  });

  const offsets = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    top: { x: 0, y: -100 },
    bottom: { x: 0, y: 100 },
  };

  return {
    translateX: interpolate(progress, [0, 1], [offsets[direction].x, 0]),
    translateY: interpolate(progress, [0, 1], [offsets[direction].y, 0]),
    opacity: progress,
  };
};
```

### Color Utilities

```tsx
// src/lib/colors.ts

// Convert hex to rgba with optional alpha
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generate a gradient string from two colors
export const linearGradient = (
  color1: string,
  color2: string,
  angle: number = 135,
): string => {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

// Lighten or darken a hex color by a percentage
export const adjustBrightness = (hex: string, percent: number): string => {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
};
```

### Timing Presets

```tsx
// src/lib/timing.ts

// Convert seconds to frames at a given fps
export const secondsToFrames = (seconds: number, fps: number): number => {
  return Math.round(seconds * fps);
};

// Convert frames to seconds
export const framesToSeconds = (frames: number, fps: number): number => {
  return frames / fps;
};

// Standard timing presets in seconds (multiply by fps to get frames)
export const TIMING = {
  /** Quick flash or micro-animation */
  flash: 0.3,
  /** Short transition between elements */
  transitionShort: 0.5,
  /** Standard transition duration */
  transition: 0.8,
  /** Long, dramatic transition */
  transitionLong: 1.2,
  /** How long a single text card stays visible */
  cardHold: 3,
  /** How long a title screen stays visible */
  titleHold: 4,
  /** Standard scene duration */
  sceneDuration: 5,
} as const;

// Calculate total duration from an array of scene durations (in seconds)
export const totalDurationFrames = (
  sceneDurations: number[],
  fps: number,
): number => {
  const totalSeconds = sceneDurations.reduce((sum, d) => sum + d, 0);
  return secondsToFrames(totalSeconds, fps);
};
```

---

## Splitting Large Compositions into Scenes

When a composition grows beyond ~100 lines, split it into scene components. Each scene is a self-contained visual segment rendered within a `<Sequence>`.

### Before (monolithic composition)

```tsx
// BAD: Everything in one file
export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {/* 200 lines of intro animation */}
      {/* 150 lines of content */}
      {/* 100 lines of outro */}
    </AbsoluteFill>
  );
};
```

### After (split into scenes)

```tsx
// src/compositions/MyVideo/MyVideo.tsx
import { AbsoluteFill, Sequence } from "remotion";
import type { MyVideoProps } from "./schema";
import { IntroScene } from "./scenes/IntroScene";
import { ContentScene } from "./scenes/ContentScene";
import { OutroScene } from "./scenes/OutroScene";
import { secondsToFrames } from "../../lib/timing";

const FPS = 30;
const INTRO_DURATION = secondsToFrames(3, FPS);
const CONTENT_DURATION = secondsToFrames(6, FPS);
const OUTRO_DURATION = secondsToFrames(3, FPS);

export const MyVideo: React.FC<MyVideoProps> = ({ title, items, theme }) => {
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      <Sequence
        from={currentFrame}
        durationInFrames={INTRO_DURATION}
        name="Intro"
      >
        <IntroScene title={title} theme={theme} />
      </Sequence>

      {(() => {
        currentFrame += INTRO_DURATION;
        return null;
      })()}

      <Sequence
        from={currentFrame}
        durationInFrames={CONTENT_DURATION}
        name="Content"
      >
        <ContentScene items={items} theme={theme} />
      </Sequence>

      {(() => {
        currentFrame += CONTENT_DURATION;
        return null;
      })()}

      <Sequence
        from={currentFrame}
        durationInFrames={OUTRO_DURATION}
        name="Outro"
      >
        <OutroScene title={title} theme={theme} />
      </Sequence>
    </AbsoluteFill>
  );
};
```

A cleaner approach to sequential scene placement uses a helper:

```tsx
// src/lib/sequenceLayout.ts
export type SceneDefinition = {
  durationInFrames: number;
  name: string;
};

// Calculate the `from` offset for each scene placed sequentially
export const layoutScenes = (
  scenes: SceneDefinition[],
): Array<SceneDefinition & { from: number }> => {
  let offset = 0;
  return scenes.map((scene) => {
    const result = { ...scene, from: offset };
    offset += scene.durationInFrames;
    return result;
  });
};
```

```tsx
// Usage in a composition
import { layoutScenes } from "../../lib/sequenceLayout";

const scenes = layoutScenes([
  { durationInFrames: 90, name: "Intro" },
  { durationInFrames: 180, name: "Content" },
  { durationInFrames: 90, name: "Outro" },
]);

// scenes[0].from === 0
// scenes[1].from === 90
// scenes[2].from === 270
```

### Scene Component Pattern

Each scene component receives only the props it needs and uses `useCurrentFrame()` relative to its own start (Remotion handles this automatically inside a `<Sequence>`).

```tsx
// src/compositions/MyVideo/scenes/IntroScene.tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { slideIn } from "../../../lib/animations";
import type { ThemeColors } from "../../../types/common";

type IntroSceneProps = {
  title: string;
  theme: ThemeColors;
};

export const IntroScene: React.FC<IntroSceneProps> = ({ title, theme }) => {
  // frame starts at 0 within this Sequence, regardless of global position
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleAnimation = slideIn(frame, fps, "bottom", 10);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <h1
        style={{
          fontSize: 72,
          color: theme.text,
          transform: `translateY(${titleAnimation.translateY}px)`,
          opacity: titleAnimation.opacity,
        }}
      >
        {title}
      </h1>
    </AbsoluteFill>
  );
};
```

---

## Environment Variables

Use a `.env` file in the project root for API keys, external service tokens, and configuration values that should not be committed to source control.

```bash
# .env
REMOTION_MAPBOX_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGFi...
REMOTION_API_URL=https://api.example.com
REMOTION_BRAND_NAME=Acme Corp
```

**Important**: Only environment variables prefixed with `REMOTION_` are available inside Remotion compositions. This is a security feature to prevent accidental exposure of secrets.

### Accessing Environment Variables in Components

```tsx
// src/compositions/MapVideo/MapVideo.tsx
import { AbsoluteFill } from "remotion";
import { getRemotionEnvironment } from "remotion";

export const MapVideo: React.FC = () => {
  const mapboxToken = process.env.REMOTION_MAPBOX_TOKEN;

  if (!mapboxToken) {
    throw new Error(
      "REMOTION_MAPBOX_TOKEN is not set. Add it to your .env file.",
    );
  }

  return (
    <AbsoluteFill>
      {/* Use the token to render a map */}
      <div>Map token loaded: {mapboxToken.slice(0, 8)}...</div>
    </AbsoluteFill>
  );
};
```

### Using Environment Variables in calculateMetadata

```tsx
import type { CalculateMetadataFunction } from "remotion";
import type { WeatherVideoProps } from "./schema";

export const calculateWeatherMetadata: CalculateMetadataFunction<
  WeatherVideoProps
> = async ({ props, abortSignal }) => {
  const apiUrl = process.env.REMOTION_API_URL;
  if (!apiUrl) {
    throw new Error("REMOTION_API_URL not set");
  }

  const response = await fetch(`${apiUrl}/weather?city=${props.city}`, {
    signal: abortSignal,
  });
  const data = await response.json();

  return {
    props: {
      ...props,
      weatherData: data,
    },
    durationInFrames: data.forecast.length * 90,
  };
};
```

### .gitignore Entry

```gitignore
# Environment variables
.env
.env.local
```

---

## Summary Checklist

- [ ] Group compositions in `src/compositions/` with co-located scenes and schemas
- [ ] Place reusable components in `src/components/`
- [ ] Put pure utility functions in `src/lib/`
- [ ] Use `<Folder>` in Root.tsx to organize the Studio sidebar
- [ ] Use `type` (not `interface`) for all Remotion props, derived from Zod schemas
- [ ] Split compositions longer than ~100 lines into scene components
- [ ] Put all static assets in `public/` and reference them with `staticFile()`
- [ ] Prefix environment variables with `REMOTION_` to make them accessible
- [ ] Keep `.env` out of version control
