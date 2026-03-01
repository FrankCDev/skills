---
name: light-leaks
description: WebGL light leak overlay effects using @remotion/light-leaks with seed and hueShift customization
metadata:
  tags: light-leaks, overlays, effects, transitions, WebGL
---

# Light Leaks

Requires Remotion 4.0.415+. Check with `npx remotion versions` and upgrade with `npx remotion upgrade`.

`<LightLeak>` from `@remotion/light-leaks` renders a WebGL-based light leak effect. It reveals during the first half of its duration and retracts during the second half.

Typically used inside a `<TransitionSeries.Overlay>` to play over the cut point between two scenes. See [transitions.md](./transitions.md) for overlay usage.

## Prerequisites

```bash
npx remotion add @remotion/light-leaks
```

## Basic usage with TransitionSeries

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { LightLeak } from "@remotion/light-leaks";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={30}>
    <LightLeak />
  </TransitionSeries.Overlay>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>;
```

## Props

- `durationInFrames?` -- defaults to the parent sequence/composition duration. Reveals first half, retracts second half.
- `seed?` -- determines the shape of the light leak pattern. Different seeds produce different patterns. Default: `0`.
- `hueShift?` -- rotates the hue in degrees (`0`-`360`). Default: `0` (yellow-to-orange). `120` = green, `240` = blue.

## Customizing the look

```tsx
import { LightLeak } from "@remotion/light-leaks";

// Blue-tinted light leak with a different pattern
<LightLeak seed={5} hueShift={240} />;

// Green-tinted light leak
<LightLeak seed={2} hueShift={120} />;
```

## Standalone usage

`<LightLeak>` can also be used outside of `<TransitionSeries>` as a decorative overlay:

```tsx
import { AbsoluteFill } from "remotion";
import { LightLeak } from "@remotion/light-leaks";

const MyComp: React.FC = () => (
  <AbsoluteFill>
    <MyContent />
    <LightLeak durationInFrames={60} seed={3} />
  </AbsoluteFill>
);
```

When using standalone, you must pass `durationInFrames` explicitly since there is no parent to inherit from.

## Common mistakes

- Using on Remotion versions older than 4.0.415 -- the component does not exist in earlier versions.
- Forgetting `durationInFrames` when using standalone outside `<TransitionSeries>` -- the component needs to know how long it should play.
- Placing a `<LightLeak>` overlay adjacent to a `<TransitionSeries.Transition>` or another overlay -- this is not allowed in `<TransitionSeries>`.
- Not installing `@remotion/light-leaks` as a separate package.
