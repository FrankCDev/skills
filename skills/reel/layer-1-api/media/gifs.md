---
name: gifs
description: Displaying GIFs, APNG, AVIF, and WebP animations in Remotion
metadata:
  tags: gif, animation, animated-image, apng, avif, webp, playback
---

# Animated Images (GIF, APNG, AVIF, WebP)

## Basic Usage

Use `<AnimatedImage>` to display a GIF, APNG, AVIF, or WebP synchronized with Remotion's timeline:

```tsx
import { AnimatedImage, staticFile } from "remotion";

export const MyComposition = () => {
  return (
    <AnimatedImage src={staticFile("animation.gif")} width={500} height={500} />
  );
};
```

Remote URLs are also supported (must have CORS enabled):

```tsx
<AnimatedImage
  src="https://example.com/animation.gif"
  width={500}
  height={500}
/>
```

## Sizing and Fit

Control how the image fills its container with the `fit` prop:

```tsx
// Stretch to fill (default)
<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="fill" />

// Maintain aspect ratio, fit inside container
<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="contain" />

// Fill container, crop if needed
<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="cover" />
```

## Playback Speed

```tsx
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} playbackRate={2} />   {/* 2x speed */}
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} playbackRate={0.5} /> {/* Half speed */}
```

## Looping Behavior

Control what happens when the animation finishes:

```tsx
// Loop indefinitely (default)
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="loop" />

// Play once, freeze on final frame
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="pause-after-finish" />

// Play once, then clear canvas
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="clear-after-finish" />
```

## Styling

Use the `style` prop for additional CSS. Size must be set via `width` and `height` props:

```tsx
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={500}
  style={{
    borderRadius: 20,
    position: "absolute",
    top: 100,
    left: 50,
  }}
/>
```

## Getting GIF Duration

Use `getGifDurationInSeconds()` from `@remotion/gif` to get the duration:

```bash
npx remotion add @remotion/gif
```

```tsx
import { getGifDurationInSeconds } from "@remotion/gif";
import { staticFile } from "remotion";

const duration = await getGifDurationInSeconds(staticFile("animation.gif"));
console.log(duration); // e.g. 2.5
```

Use with `calculateMetadata` to match composition duration to the GIF:

```tsx
import { getGifDurationInSeconds } from "@remotion/gif";
import { staticFile, CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction = async () => {
  const duration = await getGifDurationInSeconds(staticFile("animation.gif"));
  return {
    durationInFrames: Math.ceil(duration * 30),
  };
};
```

## Fallback: `<Gif>` Component

If `<AnimatedImage>` does not work (it is only supported in Chrome and Firefox), use `<Gif>` from `@remotion/gif`:

```bash
npx remotion add @remotion/gif # If project uses npm
bunx remotion add @remotion/gif # If project uses bun
yarn remotion add @remotion/gif # If project uses yarn
pnpm exec remotion add @remotion/gif # If project uses pnpm
```

```tsx
import { Gif } from "@remotion/gif";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Gif src={staticFile("animation.gif")} width={500} height={500} />;
};
```

The `<Gif>` component has the same props as `<AnimatedImage>` but only supports GIF files (not APNG, AVIF, or WebP).

## Common Mistakes

- **Using `<Img>` for animated GIFs** -- `<Img>` renders only the first frame. Use `<AnimatedImage>` or `<Gif>` for animations.
- **Omitting `width` and `height` on `<AnimatedImage>`** -- These are required props. Without them the component will not render correctly.
- **Setting size via `style` instead of props** -- Use the `width` and `height` props for sizing. The `style` prop is for additional CSS like positioning and border radius.
- **Expecting `<AnimatedImage>` to work in Safari/WebKit** -- `<AnimatedImage>` only works in Chrome and Firefox. Use the `<Gif>` fallback from `@remotion/gif` for broader compatibility.
- **Forgetting to install `@remotion/gif` for `getGifDurationInSeconds`** -- This function comes from `@remotion/gif`, which is a separate package that must be installed.
