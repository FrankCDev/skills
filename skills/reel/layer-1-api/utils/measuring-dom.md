---
name: measuring-dom
description: Measuring DOM element dimensions in Remotion using useCurrentScale() and getBoundingClientRect correction
metadata:
  tags: measure, layout, dimensions, getBoundingClientRect, scale, useCurrentScale
---

# Measuring DOM Nodes in Remotion

Remotion applies a `scale()` transform to the video container, which affects values from `getBoundingClientRect()`. Use `useCurrentScale()` to get correct measurements.

## Measuring element dimensions

```tsx
import { useCurrentScale } from "remotion";
import { useRef, useEffect, useState } from "react";

export const MyComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scale = useCurrentScale();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setDimensions({
      width: rect.width / scale,
      height: rect.height / scale,
    });
  }, [scale]);

  return <div ref={ref}>Content to measure</div>;
};
```

The key correction: divide `getBoundingClientRect()` values by `scale` to get the true pixel dimensions at the composition's native resolution.

## Common mistakes

- Using `getBoundingClientRect()` without dividing by `useCurrentScale()` -- the returned values will be scaled and incorrect.
- Forgetting to add `scale` to the `useEffect` dependency array -- dimensions will not update when the preview scale changes.
- Measuring before the element is mounted -- always check `if (!ref.current) return` first.
- Using `offsetWidth` / `offsetHeight` instead of `getBoundingClientRect()` -- these also need the scale correction.
