---
name: lottie
description: Embedding Lottie animations in Remotion with delayRender and fetch pattern
metadata:
  tags: lottie, animation, delayRender, fetch
---

# Using Lottie Animations in Remotion

## Prerequisites

```bash
npx remotion add @remotion/lottie # npm
bunx remotion add @remotion/lottie # bun
yarn remotion add @remotion/lottie # yarn
pnpm exec remotion add @remotion/lottie # pnpm
```

## Displaying a Lottie file

To embed a Lottie animation:

1. Fetch the Lottie JSON asset.
2. Wrap the loading in `delayRender()` / `continueRender()`.
3. Store the animation data in state.
4. Render using the `Lottie` component.

```tsx
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";

export const MyAnimation = () => {
  const [handle] = useState(() => delayRender("Loading Lottie animation"));

  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch("https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json")
      .then((data) => data.json())
      .then((json) => {
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle]);

  if (!animationData) {
    return null;
  }

  return <Lottie animationData={animationData} />;
};
```

## Styling and animating

Use the `style` prop to control dimensions and layout:

```tsx
return (
  <Lottie animationData={animationData} style={{ width: 400, height: 400 }} />
);
```

## Common mistakes

- Forgetting `delayRender()` / `continueRender()` -- the composition will render before the Lottie JSON loads, showing nothing.
- Not calling `cancelRender()` in the `.catch()` handler -- fetch errors will silently hang the render.
- Importing from `lottie-web` directly instead of using `@remotion/lottie` -- the Remotion wrapper handles frame synchronization.
- Not returning `null` while `animationData` is still loading.
