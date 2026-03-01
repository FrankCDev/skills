---
name: timing
description: Interpolation and timing curves - linear, easing, spring, bezier
metadata:
  tags: interpolate, spring, easing, bezier, timing, animation-curves
---

# Timing

## interpolate()

Linear interpolation maps a frame number to an output range:

```ts
import { interpolate } from "remotion";

const opacity = interpolate(frame, [0, 100], [0, 1]);
```

By default values are NOT clamped (they extrapolate beyond the output range). Clamp them:

```ts
const opacity = interpolate(frame, [0, 100], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
});
```

## Spring Animations

Springs produce natural motion, animating from 0 to 1.

```ts
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
});
```

### Physical Properties

Default config: `mass: 1, damping: 10, stiffness: 100` (produces a slight bounce).

```ts
const scale = spring({
  frame,
  fps,
  config: { damping: 200 },
});
```

Common presets:

```tsx
const gentle = { mass: 1, damping: 15, stiffness: 100 };  // Soft reveals, subtle
const smooth = { damping: 200 };                          // No bounce, professional (default)
const snappy = { mass: 1, damping: 20, stiffness: 300 }; // Quick, minimal overshoot
const bouncy = { mass: 1, damping: 10, stiffness: 200 }; // Playful, visible bounce
const heavy  = { mass: 3, damping: 25, stiffness: 150 }; // Dramatic, weighty
const elastic = { mass: 1, damping: 8, stiffness: 150 }; // Rubber-band, use sparingly
```

### Delay

Delay the start by a number of frames:

```tsx
const entrance = spring({
  frame,
  fps,
  delay: 20,
});
```

### Duration

Override the natural spring duration with an explicit frame count:

```tsx
const value = spring({
  frame,
  fps,
  durationInFrames: 40,
});
```

### Combining spring() with interpolate()

Map spring output (0-1) to any custom range:

```tsx
const springProgress = spring({ frame, fps });

const rotation = interpolate(springProgress, [0, 1], [0, 360]);

<div style={{ rotate: rotation + "deg" }} />;
```

### Adding Springs (Enter + Exit)

Spring values are plain numbers -- use arithmetic to compose them:

```tsx
const frame = useCurrentFrame();
const { fps, durationInFrames } = useVideoConfig();

const inAnimation = spring({ frame, fps });
const outAnimation = spring({
  frame,
  fps,
  durationInFrames: 1 * fps,
  delay: durationInFrames - 1 * fps,
});

const scale = inAnimation - outAnimation;
```

## Easing

Apply easing curves to `interpolate`:

```ts
import { interpolate, Easing } from "remotion";

const value = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.inOut(Easing.quad),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

**Convexities** (how acceleration changes):
- `Easing.in` -- starts slow, accelerates
- `Easing.out` -- starts fast, decelerates
- `Easing.inOut` -- slow at both ends

**Curves** (most linear to most curved):
- `Easing.quad`
- `Easing.sin`
- `Easing.exp`
- `Easing.circle`

Convexities and curves must be combined: `Easing.inOut(Easing.quad)`.

### Cubic Bezier

```ts
const value = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.bezier(0.8, 0.22, 0.96, 0.65),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

## Common Mistakes

- **Forgetting to clamp interpolate** -- Without `extrapolateRight: "clamp"`, values will go beyond your output range (e.g., opacity > 1).
- **Using `Easing.quad` alone without a convexity wrapper** -- `Easing.quad` is a curve, not a complete easing function. Wrap it: `Easing.inOut(Easing.quad)`.
- **Shadowing `spring` with a variable named `spring`** -- The official example `const spring = spring({...})` will cause a runtime error. Use a different variable name like `springValue` or `progress`.
- **Passing seconds instead of frames to `delay` or `durationInFrames`** -- These parameters expect frame counts. Multiply seconds by `fps`.
- **Not passing `fps` to spring()** -- The `fps` parameter is required for spring to calculate correctly. Always destructure it from `useVideoConfig()`.
