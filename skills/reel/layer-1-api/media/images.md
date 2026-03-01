---
name: images
description: Embedding images in Remotion using the Img component - static, remote, dynamic, dimensions
metadata:
  tags: images, img, staticFile, png, jpg, svg, webp, dimensions
---

# Images

## The `<Img>` Component

Always use the `<Img>` component from `remotion` to display images:

```tsx
import { Img, staticFile } from "remotion";

export const MyComposition = () => {
  return <Img src={staticFile("photo.png")} />;
};
```

## Important Restrictions

**You MUST use `<Img>` from `remotion`.** Do NOT use:

- Native HTML `<img>` elements
- Next.js `<Image>` component
- CSS `background-image`

The `<Img>` component blocks rendering until the image is fully loaded, preventing flickering and blank frames during export.

## Local Images with staticFile()

Place images in the `public/` folder and reference with `staticFile()`:

```
my-video/
├─ public/
│  ├─ logo.png
│  ├─ avatar.jpg
│  └─ icon.svg
├─ src/
├─ package.json
```

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("logo.png")} />;
```

## Remote Images

Remote URLs work directly without `staticFile()`. Ensure CORS is enabled.

```tsx
<Img src="https://example.com/image.png" />
```

For animated GIFs, use the `<AnimatedImage>` component (or `<Gif>` from `@remotion/gif`) instead.

## Sizing and Positioning

```tsx
<Img
  src={staticFile("photo.png")}
  style={{
    width: 500,
    height: 300,
    position: "absolute",
    top: 100,
    left: 50,
    objectFit: "cover",
  }}
/>
```

## Dynamic Image Paths

Use template literals for dynamic file references:

```tsx
import { Img, staticFile, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

// Image sequence
<Img src={staticFile(`frames/frame${frame}.png`)} />

// Selecting based on props
<Img src={staticFile(`avatars/${props.userId}.png`)} />

// Conditional images
<Img src={staticFile(`icons/${isActive ? "active" : "inactive"}.svg`)} />
```

Useful for: image sequences, user-specific avatars, theme-based icons, state-dependent graphics.

## Getting Image Dimensions

Use `getImageDimensions()` to get the width and height of an image:

```tsx
import { getImageDimensions, staticFile } from "remotion";

const { width, height } = await getImageDimensions(staticFile("photo.png"));
```

Use with `calculateMetadata` to size compositions dynamically:

```tsx
import {
  getImageDimensions,
  staticFile,
  CalculateMetadataFunction,
} from "remotion";

const calculateMetadata: CalculateMetadataFunction = async () => {
  const { width, height } = await getImageDimensions(staticFile("photo.png"));
  return { width, height };
};
```

## Common Mistakes

- **Using native `<img>` instead of `<Img>`** -- Native elements do not block rendering, causing blank or partially loaded frames during export.
- **Using CSS `background-image` for dynamic content** -- Remotion cannot track loading state of background images. Use `<Img>` with absolute positioning instead.
- **Forgetting CORS for remote images** -- Remote image servers must send appropriate `Access-Control-Allow-Origin` headers, or rendering will fail.
- **Using `<Img>` for animated GIFs** -- `<Img>` renders only the first frame of a GIF. Use `<AnimatedImage>` or `<Gif>` from `@remotion/gif` for animation.
- **Calling `getImageDimensions()` inside a render function** -- It is async and should be called in `calculateMetadata` or at module level, not during rendering.
