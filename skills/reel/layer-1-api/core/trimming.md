---
name: trimming
description: Trimming patterns - cut the beginning or end of animations using Sequence
metadata:
  tags: sequence, trim, clip, cut, offset, negative-from
---

# Trimming

Use `<Sequence>` to trim the start or end of an animation.

## Trim the Beginning

A negative `from` value shifts time backwards, making the animation start partway through:

```tsx
import { Sequence, useVideoConfig } from "remotion";

const { fps } = useVideoConfig();

<Sequence from={-0.5 * fps}>
  <MyAnimation />
</Sequence>
```

At 30fps this trims the first 15 frames. Inside `<MyAnimation>`, `useCurrentFrame()` starts at 15 instead of 0.

## Trim the End

Use `durationInFrames` to unmount content after a specified duration:

```tsx
const { fps } = useVideoConfig();

<Sequence durationInFrames={1.5 * fps}>
  <MyAnimation />
</Sequence>
```

The animation plays for the given frames, then the component unmounts.

## Trim and Delay (Combined)

Nest sequences to both trim the beginning AND delay when the result appears:

```tsx
<Sequence from={30}>
  <Sequence from={-15}>
    <MyAnimation />
  </Sequence>
</Sequence>
```

- **Inner sequence** (`from={-15}`): trims 15 frames from the start of `<MyAnimation>`.
- **Outer sequence** (`from={30}`): delays the trimmed result by 30 frames.

## Common Mistakes

- **Confusing negative `from` with delay** -- A negative `from` trims (skips) the beginning of the content. A positive `from` delays it. They do opposite things.
- **Expecting `useCurrentFrame()` to start at 0 after trimming** -- When you use `from={-15}`, `useCurrentFrame()` inside the child starts at 15, not 0. The frames before that are skipped.
- **Nesting in the wrong order for trim+delay** -- The inner `<Sequence>` should do the trimming (negative `from`) and the outer one should do the delaying (positive `from`). Reversing this order produces different behavior.
- **Using `startFrom` instead of negative `from`** -- There is no `startFrom` prop on `<Sequence>`. Use a negative `from` value for trimming.
