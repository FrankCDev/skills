---
name: assets
description: Importing images, videos, audio, and fonts using the public folder and staticFile()
metadata:
  tags: assets, staticFile, public, images, fonts, video, audio, import
---

# Assets

## The public Folder

Place all static assets (images, videos, audio, fonts) in the `public/` folder at your project root.

## staticFile()

Use `staticFile()` to reference files from the `public/` folder. It returns an encoded URL that works correctly when deploying to subdirectories.

```tsx
import { Img, staticFile } from "remotion";

export const MyComposition = () => {
  return <Img src={staticFile("logo.png")} />;
};
```

## Using with Components

**Images:**

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("photo.png")} />;
```

**Videos:**

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

<Video src={staticFile("clip.mp4")} />;
```

**Audio:**

```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

<Audio src={staticFile("music.mp3")} />;
```

**Fonts:**

```tsx
import { staticFile } from "remotion";

const fontFamily = new FontFace("MyFont", `url(${staticFile("font.woff2")})`);
await fontFamily.load();
document.fonts.add(fontFamily);
```

## Remote URLs

Remote URLs can be used directly without `staticFile()`:

```tsx
<Img src="https://example.com/image.png" />
<Video src="https://remotion.media/video.mp4" />
```

## Important Notes

- Remotion components (`<Img>`, `<Video>`, `<Audio>`) ensure assets are fully loaded before rendering, preventing flickering and blank frames.
- Special characters in filenames (`#`, `?`, `&`) are automatically encoded by `staticFile()`.

## Common Mistakes

- **Using native `<img>`, `<video>`, or `<audio>` elements** -- Always use Remotion's `<Img>`, `<Video>`, `<Audio>` components. Native elements do not block rendering until loaded, causing blank frames during export.
- **Hardcoding `/public/` in paths** -- `staticFile("logo.png")` maps to `public/logo.png`. Do NOT write `staticFile("/public/logo.png")`.
- **Forgetting `staticFile()` for local files** -- Writing `src="logo.png"` or `src="/logo.png"` directly will not resolve correctly in all deployment contexts.
- **Using `import` for large media files** -- Use `staticFile()` for videos, audio, and large images. JavaScript `import` is for code modules, not media assets.
