---
name: animations
description: Fundamental animation rules for Remotion - useCurrentFrame driven, no CSS transitions
metadata:
  tags: animations, useCurrentFrame, frames, forbidden, css
---

# Animations

All animations MUST be driven by the `useCurrentFrame()` hook. Express timing in seconds and multiply by `fps` from `useVideoConfig()`.

```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return <div style={{ opacity }}>Hello World!</div>;
};
```

## Forbidden Patterns

**CSS transitions are FORBIDDEN** -- They are time-based and will not render correctly frame-by-frame during export.

**CSS animations (`@keyframes`) are FORBIDDEN** -- Same reason: they rely on wall-clock time, not frame count.

**Tailwind animation class names are FORBIDDEN** -- Classes like `animate-bounce`, `animate-spin`, `animate-pulse`, `transition-all`, etc. will not render correctly. Always use `useCurrentFrame()` with inline `style` props instead.

## Common Mistakes

- **Using `setTimeout` or `setInterval` for timing** -- These are wall-clock based. Use `useCurrentFrame()` to determine what should be visible at each frame.
- **Using CSS `transition` property** -- Even inline `style={{ transition: "opacity 0.3s" }}` will not work. Compute every style value from the current frame.
- **Using React state for animation progress** -- State changes are asynchronous and frame-independent. Derive all visual state from `useCurrentFrame()`.
- **Forgetting `extrapolateRight: "clamp"`** -- Without clamping, `interpolate` will extrapolate beyond your output range, causing values like opacity > 1 or < 0.
