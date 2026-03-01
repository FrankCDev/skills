---
name: data-driven
description: Building data-driven videos from APIs, JSON configs, and external data sources with calculateMetadata, delayRender, and batch rendering
metadata:
  tags: data, api, fetch, dynamic, json, calculateMetadata, delayRender, batch
---

# Data-Driven Videos

Data-driven videos are generated dynamically from external data sources: APIs, databases, JSON files, or user input. Instead of hardcoding content, you fetch data at render time and build the video structure around it. This is the foundation of programmatic video generation -- rendering thousands of personalized videos from a single composition.

---

## 1. Fetching Data in calculateMetadata

The recommended pattern for loading external data is `calculateMetadata`. It runs once before rendering starts and can modify the composition's props, duration, dimensions, and fps based on the fetched data. All async work -- API calls, file reads, data transformations -- belongs here.

### Basic Pattern

```tsx
import type { CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';

// Define the data shape with Zod
const articleSchema = z.object({
  title: z.string(),
  source: z.string(),
  imageUrl: z.string(),
  summary: z.string(),
  publishedAt: z.string(),
});

export const newsDigestSchema = z.object({
  feedUrl: z.string(),
  maxArticles: z.number().default(5),
  articles: z.array(articleSchema).optional(),
});

export type NewsDigestProps = z.infer<typeof newsDigestSchema>;

const ARTICLE_DURATION_FRAMES = 150; // 5 seconds per article at 30fps
const INTRO_FRAMES = 60;
const OUTRO_FRAMES = 60;

// Runs ONCE before rendering -- fetch all data here
export const calculateNewsMetadata: CalculateMetadataFunction<
  NewsDigestProps
> = async ({ props, abortSignal }) => {
  // Always pass abortSignal so Remotion can cancel the request
  const response = await fetch(props.feedUrl, {
    signal: abortSignal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch news feed: ${response.status}`);
  }

  const feed = await response.json();
  const articles = feed.articles.slice(0, props.maxArticles);

  // Calculate total duration based on the number of articles
  const totalFrames =
    INTRO_FRAMES +
    articles.length * ARTICLE_DURATION_FRAMES +
    OUTRO_FRAMES;

  return {
    props: {
      ...props,
      articles, // Inject fetched data into props
    },
    durationInFrames: totalFrames, // Dynamic duration
  };
};
```

### Error Handling in calculateMetadata

Always handle errors explicitly. A thrown error in `calculateMetadata` surfaces as a clear error message in the Remotion Studio and CLI. An unhandled rejection or silent failure causes confusing timeouts.

```tsx
import type { CalculateMetadataFunction } from 'remotion';

export const calculateMetadata: CalculateMetadataFunction<MyProps> = async ({
  props,
  abortSignal,
}) => {
  try {
    const response = await fetch(props.apiUrl, { signal: abortSignal });

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Validate data shape before using it
    if (!data.items || data.items.length === 0) {
      throw new Error('API returned no items -- cannot generate video');
    }

    return {
      props: { ...props, items: data.items },
      durationInFrames: data.items.length * 90,
    };
  } catch (err) {
    // Let abort errors propagate naturally
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    // Re-throw with context for all other errors
    throw new Error(
      `Failed to load data for video: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
};
```

### Using Environment Variables for API Keys

Never hardcode API keys. Use environment variables prefixed with `REMOTION_` so they are available during rendering.

```tsx
export const calculateWeatherMetadata: CalculateMetadataFunction<
  WeatherProps
> = async ({ props, abortSignal }) => {
  const apiKey = process.env.REMOTION_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error(
      'REMOTION_WEATHER_API_KEY environment variable is not set',
    );
  }

  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${props.city}&days=7`,
    { signal: abortSignal },
  );

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  const forecast = data.forecast.forecastday.map((day: any) => ({
    date: day.date,
    tempHigh: day.day.maxtemp_c,
    tempLow: day.day.mintemp_c,
    condition: day.day.condition.text,
    icon: `https:${day.day.condition.icon}`,
    humidity: day.day.avghumidity,
  }));

  return {
    props: { ...props, forecast },
    durationInFrames: 90 + forecast.length * 120,
  };
};
```

### Registering with the Composition

```tsx
import { Composition } from 'remotion';
import { NewsDigest, calculateNewsMetadata } from './compositions/NewsDigest/NewsDigest';
import { newsDigestSchema } from './compositions/NewsDigest/schema';

<Composition
  id="NewsDigest"
  component={NewsDigest}
  schema={newsDigestSchema}
  calculateMetadata={calculateNewsMetadata}
  durationInFrames={300} // Overridden by calculateMetadata
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    feedUrl: 'https://api.example.com/news',
    maxArticles: 5,
  }}
/>
```

---

## 2. delayRender / continueRender Patterns

When data must be loaded at the component level -- for example, a component that dynamically loads additional resources based on its own props -- use `delayRender` / `continueRender`. This pauses frame capture until the data is ready.

### Basic Pattern

```tsx
import {
  AbsoluteFill,
  delayRender,
  continueRender,
  cancelRender,
  useCurrentFrame,
  interpolate,
  Img,
} from 'remotion';
import { useCallback, useEffect, useState } from 'react';

type UserCardProps = {
  userId: string;
};

type UserData = {
  name: string;
  avatarUrl: string;
  bio: string;
};

export const UserCard: React.FC<UserCardProps> = ({ userId }) => {
  const frame = useCurrentFrame();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Create the delay handle in useState initializer -- runs exactly once
  const [handle] = useState(() =>
    delayRender(`Loading user data for ${userId}`),
  );

  const loadUser = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.example.com/users/${userId}`,
      );

      if (!response.ok) {
        // Cancel the render immediately with a descriptive error
        cancelRender(
          new Error(`Failed to load user ${userId}: ${response.status}`),
        );
        return;
      }

      const data: UserData = await response.json();
      setUserData(data);
      continueRender(handle); // Signal that rendering can proceed
    } catch (err) {
      cancelRender(
        err instanceof Error ? err : new Error(String(err)),
      );
    }
  }, [userId, handle]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Render nothing while loading -- frame capture is paused by delayRender
  if (!userData) {
    return null;
  }

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <Img
        src={userData.avatarUrl}
        style={{ width: 120, height: 120, borderRadius: 60 }}
      />
      <h2 style={{ color: '#F5F5F7', fontSize: 36, marginTop: 20 }}>
        {userData.name}
      </h2>
      <p style={{ color: '#86868B', fontSize: 20 }}>{userData.bio}</p>
    </AbsoluteFill>
  );
};
```

### Loading Images with delayRender

```tsx
import {
  delayRender,
  continueRender,
  cancelRender,
  Img,
} from 'remotion';
import { useState, useCallback } from 'react';

const PreloadedImage: React.FC<{ src: string }> = ({ src }) => {
  const [handle] = useState(() =>
    delayRender(`Loading image: ${src}`),
  );

  const onLoad = useCallback(() => {
    continueRender(handle);
  }, [handle]);

  const onError = useCallback(() => {
    cancelRender(new Error(`Failed to load image: ${src}`));
  }, [src]);

  return (
    <Img
      src={src}
      onLoad={onLoad}
      onError={onError}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};
```

### When to Use Each Pattern

| Pattern | Use When |
|---|---|
| `calculateMetadata` | Data determines the composition structure (duration, number of scenes, dimensions) |
| `delayRender` | Data is needed by a specific component but does not change composition structure |

Prefer `calculateMetadata` whenever possible. It is more performant because data is loaded once and passed as serializable props, rather than loaded per-component during each frame render.

---

## 3. Building Videos from API Responses

A complete example that fetches real data from an API and uses it to drive composition content. The component receives pre-fetched data through props -- no async work happens in the render path.

### Weather Forecast Video

```tsx
// schema.ts
import { z } from 'zod';

const forecastDaySchema = z.object({
  date: z.string(),
  tempHigh: z.number(),
  tempLow: z.number(),
  condition: z.string(),
  humidity: z.number(),
});

export const weatherSchema = z.object({
  city: z.string(),
  forecast: z.array(forecastDaySchema).optional(),
});

export type WeatherProps = z.infer<typeof weatherSchema>;
```

```tsx
// WeatherForecast.tsx
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import type { WeatherProps } from './schema';

const FRAMES_PER_DAY = 120;
const INTRO_FRAMES = 90;

export const calculateWeatherMetadata: CalculateMetadataFunction<
  WeatherProps
> = async ({ props, abortSignal }) => {
  const apiKey = process.env.REMOTION_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('REMOTION_WEATHER_API_KEY not set');
  }

  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(props.city)}&days=7`,
    { signal: abortSignal },
  );

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  const forecast = data.forecast.forecastday.map((day: any) => ({
    date: day.date,
    tempHigh: Math.round(day.day.maxtemp_c),
    tempLow: Math.round(day.day.mintemp_c),
    condition: day.day.condition.text,
    humidity: day.day.avghumidity,
  }));

  return {
    props: { ...props, forecast },
    durationInFrames: INTRO_FRAMES + forecast.length * FRAMES_PER_DAY,
  };
};

export const WeatherForecast: React.FC<WeatherProps> = ({
  city,
  forecast = [],
}) => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #1B2838 100%)',
      }}
    >
      <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Intro">
        <WeatherIntro city={city} days={forecast.length} />
      </Sequence>

      {forecast.map((day, index) => (
        <Sequence
          key={day.date}
          from={INTRO_FRAMES + index * FRAMES_PER_DAY}
          durationInFrames={FRAMES_PER_DAY}
          name={day.date}
        >
          <DayForecast
            date={day.date}
            tempHigh={day.tempHigh}
            tempLow={day.tempLow}
            condition={day.condition}
            humidity={day.humidity}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const WeatherIntro: React.FC<{ city: string; days: number }> = ({
  city,
  days,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const subtitleSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <h1
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: '#E0E1DD',
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
        }}
      >
        {city}
      </h1>
      <p
        style={{
          fontSize: 28,
          color: '#778DA9',
          marginTop: 16,
          opacity: subtitleSpring,
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        {days}-Day Forecast
      </p>
    </AbsoluteFill>
  );
};

type DayForecastProps = {
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  humidity: number;
};

const DayForecast: React.FC<DayForecastProps> = ({
  date,
  tempHigh,
  tempLow,
  condition,
  humidity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 200 } });
  const barWidth = interpolate(frame, [20, 60], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: cardSpring,
        transform: `translateY(${interpolate(cardSpring, [0, 1], [40, 0])}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 24,
          padding: 64,
          width: 800,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p style={{ color: '#778DA9', fontSize: 24, margin: 0 }}>
          {date}
        </p>
        <h2
          style={{
            color: '#E0E1DD',
            fontSize: 56,
            fontWeight: 700,
            margin: 0,
            marginTop: 8,
          }}
        >
          {condition}
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 32,
          }}
        >
          <div>
            <p style={{ color: '#FF6B35', fontSize: 48, fontWeight: 700, margin: 0 }}>
              {tempHigh}°
            </p>
            <p style={{ color: '#778DA9', fontSize: 18, margin: 0, marginTop: 4 }}>High</p>
          </div>
          <div>
            <p style={{ color: '#00D4AA', fontSize: 48, fontWeight: 700, margin: 0 }}>
              {tempLow}°
            </p>
            <p style={{ color: '#778DA9', fontSize: 18, margin: 0, marginTop: 4 }}>Low</p>
          </div>
          <div>
            <p style={{ color: '#0A84FF', fontSize: 48, fontWeight: 700, margin: 0 }}>
              {humidity}%
            </p>
            <p style={{ color: '#778DA9', fontSize: 18, margin: 0, marginTop: 4 }}>Humidity</p>
          </div>
        </div>

        {/* Temperature range bar */}
        <div
          style={{
            marginTop: 32,
            height: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }}
        >
          <div
            style={{
              width: `${barWidth}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00D4AA, #FF6B35)',
              borderRadius: 3,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

## 4. JSON Config-Driven Compositions

Build compositions that read a configuration file to determine which scenes to show, their order, and their content. This pattern enables non-developers to create videos by editing a JSON file.

### Config File Format

```json
{
  "title": "Introducing Widget Pro",
  "theme": {
    "primaryColor": "#0A84FF",
    "backgroundColor": "#0A0A0F",
    "textColor": "#F5F5F7"
  },
  "scenes": [
    {
      "type": "title",
      "durationSeconds": 4,
      "props": {
        "heading": "Introducing Widget Pro",
        "subheading": "The future of productivity"
      }
    },
    {
      "type": "features",
      "durationSeconds": 6,
      "props": {
        "features": [
          { "icon": "zap", "title": "Lightning Fast", "description": "10x faster processing" },
          { "icon": "shield", "title": "Secure", "description": "End-to-end encryption" },
          { "icon": "globe", "title": "Global", "description": "Available in 120 countries" }
        ]
      }
    },
    {
      "type": "testimonial",
      "durationSeconds": 5,
      "props": {
        "quote": "Widget Pro changed everything for our team.",
        "author": "Jane Doe, CEO"
      }
    },
    {
      "type": "cta",
      "durationSeconds": 3,
      "props": {
        "text": "Try it free today",
        "url": "widgetpro.com"
      }
    }
  ]
}
```

### Scene Registry

Map scene type strings to React components. This decouples config authoring from code.

```tsx
// SceneRegistry.tsx
import { TitleScene } from './scenes/TitleScene';
import { FeaturesScene } from './scenes/FeaturesScene';
import { TestimonialScene } from './scenes/TestimonialScene';
import { CTAScene } from './scenes/CTAScene';

export const SCENE_REGISTRY: Record<string, React.FC<any>> = {
  title: TitleScene,
  features: FeaturesScene,
  testimonial: TestimonialScene,
  cta: CTAScene,
};
```

### Config-Driven Composition

```tsx
// ConfigDriven.tsx
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
} from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { SCENE_REGISTRY } from './SceneRegistry';

const sceneConfigSchema = z.object({
  type: z.string(),
  durationSeconds: z.number(),
  props: z.record(z.any()),
});

const themeSchema = z.object({
  primaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
});

export const configDrivenSchema = z.object({
  configUrl: z.string(),
  title: z.string().optional(),
  theme: themeSchema.optional(),
  scenes: z.array(sceneConfigSchema).optional(),
});

export type ConfigDrivenProps = z.infer<typeof configDrivenSchema>;

// Load and parse the config file before rendering
export const calculateConfigMetadata: CalculateMetadataFunction<
  ConfigDrivenProps
> = async ({ props, abortSignal }) => {
  const response = await fetch(props.configUrl, { signal: abortSignal });

  if (!response.ok) {
    throw new Error(`Config fetch failed: ${response.status}`);
  }

  const config = await response.json();

  const totalDurationSeconds = config.scenes.reduce(
    (sum: number, scene: any) => sum + scene.durationSeconds,
    0,
  );

  return {
    props: {
      ...props,
      title: config.title,
      theme: config.theme,
      scenes: config.scenes,
    },
    durationInFrames: Math.round(totalDurationSeconds * 30),
  };
};

// The composition receives all config data as pre-loaded props
export const ConfigDriven: React.FC<ConfigDrivenProps> = ({
  theme,
  scenes = [],
}) => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;

  return (
    <AbsoluteFill
      style={{ backgroundColor: theme?.backgroundColor ?? '#0A0A0F' }}
    >
      {scenes.map((scene, index) => {
        const SceneComponent = SCENE_REGISTRY[scene.type];
        if (!SceneComponent) {
          console.warn(`Unknown scene type: ${scene.type}`);
          return null;
        }

        const durationInFrames = Math.round(scene.durationSeconds * fps);
        const from = currentFrame;
        currentFrame += durationInFrames;

        return (
          <Sequence
            key={index}
            from={from}
            durationInFrames={durationInFrames}
            name={`${scene.type}-${index}`}
          >
            <SceneComponent {...scene.props} theme={theme} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

### Array-to-Sequences Helper

A generic utility for converting any array of data items into a sequence of video scenes.

```tsx
// lib/arrayToSequences.tsx
import { Sequence } from 'remotion';
import React from 'react';

type ArrayToSequencesOptions<T> = {
  items: T[];
  framesPerItem: number;
  introFrames?: number;
  outroFrames?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderIntro?: () => React.ReactNode;
  renderOutro?: () => React.ReactNode;
};

export const arrayToSequences = <T,>({
  items,
  framesPerItem,
  introFrames = 0,
  outroFrames = 0,
  renderItem,
  renderIntro,
  renderOutro,
}: ArrayToSequencesOptions<T>): React.ReactNode => {
  return (
    <>
      {renderIntro && introFrames > 0 && (
        <Sequence from={0} durationInFrames={introFrames} name="Intro">
          {renderIntro()}
        </Sequence>
      )}

      {items.map((item, index) => (
        <Sequence
          key={index}
          from={introFrames + index * framesPerItem}
          durationInFrames={framesPerItem}
          name={`Item ${index + 1}`}
        >
          {renderItem(item, index)}
        </Sequence>
      ))}

      {renderOutro && outroFrames > 0 && (
        <Sequence
          from={introFrames + items.length * framesPerItem}
          durationInFrames={outroFrames}
          name="Outro"
        >
          {renderOutro()}
        </Sequence>
      )}
    </>
  );
};

export const arrayTotalFrames = (
  itemCount: number,
  framesPerItem: number,
  introFrames: number = 0,
  outroFrames: number = 0,
): number => {
  return introFrames + itemCount * framesPerItem + outroFrames;
};
```

---

## 5. Batch Rendering

Render the same composition multiple times with different data sets. Bundle the project once, then loop through data to render each variant.

### Batch Render Script

```tsx
// scripts/batchRender.ts
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

type Recipient = {
  recipientName: string;
  message: string;
  backgroundColor: string;
  avatarUrl?: string;
};

const run = async () => {
  // Load recipient data from a JSON file
  const recipientsRaw = fs.readFileSync(
    path.resolve('./data/recipients.json'),
    'utf-8',
  );
  const recipients: Recipient[] = JSON.parse(recipientsRaw);

  console.log(`Rendering ${recipients.length} personalized videos...`);

  // Bundle the project ONCE -- reuse for all renders
  const bundled = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  // Ensure output directory exists
  const outDir = path.resolve('./out/greetings');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Render each video sequentially
  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    console.log(
      `[${i + 1}/${recipients.length}] Rendering for ${recipient.recipientName}...`,
    );

    const composition = await selectComposition({
      serveUrl: bundled,
      id: 'PersonalizedGreeting',
      inputProps: recipient,
    });

    const sanitizedName = recipient.recipientName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: path.resolve(`./out/greetings/${sanitizedName}.mp4`),
      inputProps: recipient,
    });

    console.log(`  Done: out/greetings/${sanitizedName}.mp4`);
  }

  console.log('All videos rendered!');
};

run().catch(console.error);
```

### Using the CLI with --props

For quick one-off renders with different data, pass props directly via the CLI.

```bash
# Render a single composition with custom props
npx remotion render MyComposition out/video.mp4 \
  --props='{"title":"Hello World","color":"#0A84FF"}'

# Render from a props file
npx remotion render MyComposition out/video.mp4 \
  --props=./data/my-props.json
```

### Parallel Batch Rendering

For faster batch output, render multiple videos concurrently.

```tsx
// scripts/batchRenderParallel.ts
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

const CONCURRENCY = 3; // Render 3 videos at a time

const run = async () => {
  const recipients = JSON.parse(
    fs.readFileSync('./data/recipients.json', 'utf-8'),
  );

  const bundled = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  // Process in batches of CONCURRENCY
  for (let i = 0; i < recipients.length; i += CONCURRENCY) {
    const batch = recipients.slice(i, i + CONCURRENCY);

    await Promise.all(
      batch.map(async (recipient: any, batchIndex: number) => {
        const globalIndex = i + batchIndex;
        console.log(
          `[${globalIndex + 1}/${recipients.length}] ${recipient.recipientName}`,
        );

        const composition = await selectComposition({
          serveUrl: bundled,
          id: 'PersonalizedGreeting',
          inputProps: recipient,
        });

        const sanitizedName = recipient.recipientName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-');

        await renderMedia({
          composition,
          serveUrl: bundled,
          codec: 'h264',
          outputLocation: `./out/greetings/${sanitizedName}.mp4`,
          inputProps: recipient,
        });
      }),
    );
  }

  console.log('All videos rendered!');
};

run().catch(console.error);
```

### Running Batch Renders

```bash
# Run the batch render script
npx tsx scripts/batchRender.ts

# Or add as an npm script
# package.json: "render:batch": "tsx scripts/batchRender.ts"
npm run render:batch
```

---

## 6. Common Mistakes

### Mistake 1: Forgetting continueRender

If you call `delayRender()` but never call `continueRender()`, the render will hang for 30 seconds and then time out with a cryptic error. Every `delayRender` must have a matching `continueRender` in all code paths -- including error paths.

```tsx
// WRONG: continueRender is never called if the fetch fails
const [handle] = useState(() => delayRender('Loading data'));

useEffect(() => {
  fetch('/api/data')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
      continueRender(handle);
    });
  // If fetch throws, continueRender is never called -> 30s timeout
}, []);
```

```tsx
// CORRECT: continueRender or cancelRender called in all paths
const [handle] = useState(() => delayRender('Loading data'));

useEffect(() => {
  fetch('/api/data')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      setData(data);
      continueRender(handle);
    })
    .catch((err) => {
      cancelRender(err instanceof Error ? err : new Error(String(err)));
    });
}, [handle]);
```

### Mistake 2: Making Network Requests During Render

Each frame renders independently. If you fetch data inside the render function (not in `useEffect` or `calculateMetadata`), you will make one network request per frame -- potentially thousands of identical requests.

```tsx
// WRONG: Fetch runs on every frame render
const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  // This fires on EVERY FRAME -- 900 requests for a 30-second video at 30fps
  const [data, setData] = useState(null);
  fetch('/api/data').then(r => r.json()).then(setData);

  return <div>{data?.title}</div>;
};
```

```tsx
// CORRECT: Fetch in calculateMetadata (runs once) and pass as props
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  const res = await fetch('/api/data', { signal: abortSignal });
  const data = await res.json();
  return { props: { ...props, data } };
};

const MyComponent: React.FC<{ data: any }> = ({ data }) => {
  // Data is already available -- no fetch needed
  return <div>{data.title}</div>;
};
```

### Mistake 3: Non-Serializable Props

Props passed to compositions must be JSON-serializable. Functions, class instances, Dates, Maps, Sets, and Symbols cannot be serialized. Remotion serializes props to JSON when passing them between the main thread and the renderer.

```tsx
// WRONG: These prop types are not serializable
const badProps = {
  onClick: () => console.log('click'),  // Function -- not serializable
  createdAt: new Date(),                 // Date object -- serializes to string
  metadata: new Map([['key', 'value']]), // Map -- serializes to {}
  data: new Set([1, 2, 3]),             // Set -- serializes to {}
};
```

```tsx
// CORRECT: Use plain serializable types
const goodProps = {
  createdAt: '2025-01-15T10:30:00Z',    // ISO string
  metadata: { key: 'value' },            // Plain object
  data: [1, 2, 3],                       // Plain array
  actionType: 'click',                   // String enum
};
```

### Mistake 4: Not Using abortSignal in calculateMetadata

When the user changes props in the Remotion Studio, the previous `calculateMetadata` call is aborted. If you do not pass `abortSignal` to your fetch calls, stale requests may complete and overwrite fresh data.

```tsx
// WRONG: No abortSignal -- stale requests can overwrite fresh data
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const res = await fetch(props.apiUrl); // Cannot be cancelled
  const data = await res.json();
  return { props: { ...props, data } };
};
```

```tsx
// CORRECT: Pass abortSignal for cancellation support
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  const res = await fetch(props.apiUrl, { signal: abortSignal });
  const data = await res.json();
  return { props: { ...props, data } };
};
```

### Mistake 5: Creating delayRender Handles in useEffect

The `delayRender` call must happen synchronously during the initial render, before the component mounts. If you create it inside `useEffect`, Remotion may capture a frame before the delay is registered.

```tsx
// WRONG: delayRender is called after mount -- Remotion may capture a blank frame
useEffect(() => {
  const handle = delayRender('Loading'); // Too late!
  fetch('/api/data')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
      continueRender(handle);
    });
}, []);
```

```tsx
// CORRECT: delayRender in useState initializer -- runs during first render
const [handle] = useState(() => delayRender('Loading'));

useEffect(() => {
  fetch('/api/data')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
      continueRender(handle);
    })
    .catch((err) => cancelRender(err));
}, [handle]);
```

### Mistake 6: Mutating Props Instead of Returning New Ones

`calculateMetadata` must return a new props object. Mutating the input `props` object directly can cause unpredictable behavior.

```tsx
// WRONG: Mutating the props object
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  const res = await fetch(props.apiUrl, { signal: abortSignal });
  props.data = await res.json(); // Direct mutation -- unpredictable
  return { props };
};
```

```tsx
// CORRECT: Return a new props object with spread
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  const res = await fetch(props.apiUrl, { signal: abortSignal });
  const data = await res.json();
  return {
    props: { ...props, data }, // New object with merged data
  };
};
```

---

## Summary: Data Flow Patterns

| Pattern | Data Available | Duration Dynamic | Best For |
|---|---|---|---|
| `calculateMetadata` + fetch | Before render | Yes | API-driven videos, data determines structure |
| `delayRender` in component | Per-component | No | Component-specific resources |
| JSON config in `public/` | Before render (static) | Yes (with calculateMetadata) | Non-developer workflow, pre-built configs |
| Pre-fetched cache | Before render | Yes | Expensive APIs, offline rendering |
| CLI `--props` | Before render | No | Simple parametrization, quick one-offs |
| Batch script + Zod schema | Per-render | Yes (with calculateMetadata) | Mass personalization, programmatic video |

### Key Principles

1. **Fetch data as early as possible**: Use `calculateMetadata` to load data before rendering starts.
2. **Never fetch in the render function**: Each frame is rendered independently. Fetching per-frame means thousands of duplicate API calls.
3. **Always handle errors**: Use `cancelRender()` to fail fast instead of letting `delayRender` time out after 30 seconds.
4. **Validate with Zod**: Define schemas for all external data to catch shape mismatches at render time.
5. **Cache when possible**: Pre-fetch data to local JSON files for faster, more reliable renders.
6. **Always pass abortSignal**: Let Remotion cancel in-flight requests when props change in the Studio.
