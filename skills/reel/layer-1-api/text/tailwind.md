---
name: tailwind
description: Using TailwindCSS in Remotion - allowed utilities, forbidden animation classes
metadata:
  tags: tailwind, css, styling, forbidden-animations, utility-classes
---

# TailwindCSS in Remotion

You can and should use TailwindCSS for styling in Remotion, if TailwindCSS is installed in the project.

## What Is Allowed

All TailwindCSS utility classes for static styling are fine:
- Layout: `flex`, `grid`, `absolute`, `relative`, `w-full`, `h-screen`, etc.
- Spacing: `p-4`, `m-2`, `gap-3`, etc.
- Typography: `text-xl`, `font-bold`, `leading-tight`, etc.
- Colors: `bg-blue-500`, `text-white`, `border-gray-200`, etc.
- Borders, shadows, rounded corners, etc.

## What Is Forbidden

**`transition-*` classes are FORBIDDEN** -- e.g., `transition-all`, `transition-opacity`, `transition-transform`. These rely on CSS transitions which do not render correctly frame-by-frame.

**`animate-*` classes are FORBIDDEN** -- e.g., `animate-bounce`, `animate-spin`, `animate-pulse`, `animate-ping`. These rely on CSS `@keyframes` which are time-based and incompatible with Remotion's frame-based rendering.

## How to Animate Instead

Always use `useCurrentFrame()` with inline `style` props for any animated values:

```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const AnimatedBox = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 1 * fps], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="bg-blue-500 text-white font-bold text-2xl rounded-lg p-6"
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      Hello World
    </div>
  );
};
```

Use Tailwind for static styles (`className`) and `useCurrentFrame()` with `style` for anything that changes over time.

## Setup

Tailwind must be installed and configured in the Remotion project first. Refer to the official Remotion documentation at https://www.remotion.dev/docs/tailwind for setup instructions.

## Common Mistakes

- **Using `animate-spin` or `animate-bounce`** -- These will not render correctly during video export. Use `useCurrentFrame()` + `interpolate` to drive rotation or bounce via inline `style`.
- **Using `transition-opacity` for fade effects** -- CSS transitions are time-based and will not work. Compute opacity from `useCurrentFrame()` instead.
- **Putting animated values in `className`** -- Tailwind classes are static. Dynamic values must go in the `style` prop: `style={{ opacity }}`, not `className={opacity > 0.5 ? "opacity-100" : "opacity-0"}` (this would cause a jump, not a smooth animation).
- **Assuming Tailwind is pre-installed** -- Tailwind is not included in Remotion by default. It must be installed and configured before use.
