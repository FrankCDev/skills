---
name: import-srt
description: Importing .srt subtitle files into Remotion using parseSrt from @remotion/captions
metadata:
  tags: captions, subtitles, srt, import, parse
---

# Importing .srt Subtitles into Remotion

Use `parseSrt()` from `@remotion/captions` to convert existing `.srt` files into the `Caption` format.

If you do not have a .srt file, see [transcribe.md](./transcribe.md) to generate captions from audio instead.

## Prerequisites

```bash
npx remotion add @remotion/captions # npm
bunx remotion add @remotion/captions # bun
yarn remotion add @remotion/captions # yarn
pnpm exec remotion add @remotion/captions # pnpm
```

## Reading and parsing an .srt file

Place your `.srt` file in the `public/` folder, then fetch and parse it:

```tsx
import { useState, useEffect, useCallback } from "react";
import { AbsoluteFill, staticFile, useDelayRender } from "remotion";
import { parseSrt } from "@remotion/captions";
import type { Caption } from "@remotion/captions";

export const MyComponent: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile("subtitles.srt"));
      const text = await response.text();
      const { captions: parsed } = parseSrt({ input: text });
      setCaptions(parsed);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  if (!captions) {
    return null;
  }

  return <AbsoluteFill>{/* Use captions here */}</AbsoluteFill>;
};
```

Remote URLs are also supported -- you can `fetch()` a URL directly instead of using `staticFile()`.

## Using imported captions

Once parsed, the captions are in the standard `Caption` format and work with all `@remotion/captions` utilities such as `createTikTokStyleCaptions()`. See [display.md](./display.md).

## Common mistakes

- Using `response.json()` instead of `response.text()` -- `.srt` is plain text, not JSON.
- Forgetting to destructure `{ captions: parsed }` from `parseSrt()` -- the function returns an object, not an array.
- Not wrapping the fetch in `useDelayRender()` / `continueRender()` -- the composition renders before the file loads.
- Placing the `.srt` file outside the `public/` folder when using `staticFile()`.
