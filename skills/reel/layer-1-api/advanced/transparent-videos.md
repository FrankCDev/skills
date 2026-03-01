---
name: transparent-videos
description: Rendering transparent videos with ProRes and WebM VP9 alpha channels
metadata:
  tags: transparent, alpha, codec, vp9, prores, webm
---

# Rendering Transparent Videos

Remotion can render transparent videos in two formats: ProRes (for video editing software) and WebM VP9 (for web playback).

## Transparent ProRes

Ideal for importing into video editing software.

**CLI:**

```bash
npx remotion render --image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444 MyComp out.mov
```

**Default in Studio** (restart Studio after changing):

```ts
// remotion.config.ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");
Config.setProResProfile("4444");
```

**Default export via calculateMetadata:**

```tsx
import { CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  return {
    defaultCodec: "prores",
    defaultVideoImageFormat: "png",
    defaultPixelFormat: "yuva444p10le",
    defaultProResProfile: "4444",
  };
};

<Composition
  id="my-video"
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  calculateMetadata={calculateMetadata}
/>;
```

## Transparent WebM (VP9)

Ideal for web playback in browsers.

**CLI:**

```bash
npx remotion render --image-format=png --pixel-format=yuva420p --codec=vp9 MyComp out.webm
```

**Default in Studio** (restart Studio after changing):

```ts
// remotion.config.ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva420p");
Config.setCodec("vp9");
```

**Default export via calculateMetadata:**

```tsx
import { CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  return {
    defaultCodec: "vp9",
    defaultVideoImageFormat: "png",
    defaultPixelFormat: "yuva420p",
  };
};

<Composition
  id="my-video"
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  calculateMetadata={calculateMetadata}
/>;
```

## Common mistakes

- Using `--image-format=jpeg` instead of `png` -- JPEG does not support alpha channels.
- Forgetting the `--pixel-format` flag -- without it the output will not have transparency.
- Using `defaultCodec: "vp8"` for WebM transparency -- use `"vp9"` for the CLI codec flag. Note: the calculateMetadata `defaultCodec` value should match the actual codec you intend to use.
- Not restarting Remotion Studio after changing `remotion.config.ts` -- changes only take effect on restart.
- Using `--prores-profile` without `--codec=prores` -- the profile flag is only valid for ProRes.
