---
name: charts
description: Chart and data visualization patterns using SVG, @remotion/paths, bar charts, pie charts, and line charts
metadata:
  tags: charts, data, visualization, bar-chart, pie-chart, line-chart, svg, evolvePath
---

# Charts in Remotion

Create charts using React code -- HTML, SVG, and D3.js are all supported.

**Disable all animations from third-party libraries -- they cause flickering.**
Drive all animations from `useCurrentFrame()`.

## Bar chart

```tsx
const STAGGER_DELAY = 5;
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const bars = data.map((item, i) => {
  const height = spring({
    frame,
    fps,
    delay: i * STAGGER_DELAY,
    config: { damping: 200 },
  });
  return <div style={{ height: height * item.value }} />;
});
```

## Pie chart

Animate segments using stroke-dashoffset, starting from 12 o'clock:

```tsx
const progress = interpolate(frame, [0, 100], [0, 1]);
const circumference = 2 * Math.PI * radius;
const segmentLength = (value / total) * circumference;
const offset = interpolate(progress, [0, 1], [segmentLength, 0]);

<circle
  r={radius}
  cx={center}
  cy={center}
  fill="none"
  stroke={color}
  strokeWidth={strokeWidth}
  strokeDasharray={`${segmentLength} ${circumference}`}
  strokeDashoffset={offset}
  transform={`rotate(-90 ${center} ${center})`}
/>;
```

## Line chart / path animation

Use `@remotion/paths` for animating SVG paths (line charts, stock graphs, signatures).

```bash
npx remotion add @remotion/paths
```

### Convert data points to SVG path

```tsx
type Point = { x: number; y: number };

const generateLinePath = (points: Point[]): string => {
  if (points.length < 2) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
};
```

### Draw path with animation

```tsx
import { evolvePath } from "@remotion/paths";

const path = "M 100 200 L 200 150 L 300 180 L 400 100";
const progress = interpolate(frame, [0, 2 * fps], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.quad),
});

const { strokeDasharray, strokeDashoffset } = evolvePath(progress, path);

<path
  d={path}
  fill="none"
  stroke="#FF3232"
  strokeWidth={4}
  strokeDasharray={strokeDasharray}
  strokeDashoffset={strokeDashoffset}
/>;
```

### Follow path with marker/arrow

```tsx
import {
  getLength,
  getPointAtLength,
  getTangentAtLength,
} from "@remotion/paths";

const pathLength = getLength(path);
const point = getPointAtLength(path, progress * pathLength);
const tangent = getTangentAtLength(path, progress * pathLength);
const angle = Math.atan2(tangent.y, tangent.x);

<g
  style={{
    transform: `translate(${point.x}px, ${point.y}px) rotate(${angle}rad)`,
    transformOrigin: "0 0",
  }}
>
  <polygon points="0,0 -20,-10 -20,10" fill="#FF3232" />
</g>;
```

## Common mistakes

- Using built-in animations from D3.js or chart libraries -- they cause flickering during rendering. Drive everything with `useCurrentFrame()`.
- Forgetting `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"` on `interpolate()` -- values will overshoot beyond the defined range.
- Not installing `@remotion/paths` before using `evolvePath()`.
- Using `fill` on a line chart path instead of `fill="none"` -- this fills the area under the line.
