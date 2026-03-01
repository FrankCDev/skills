---
name: sequencing
description: Sequencing patterns - Sequence, Series, premounting, layout, nesting, frame references
metadata:
  tags: sequence, series, timing, delay, premount, layout, nesting
---

# Sequencing

## Sequence

Use `<Sequence>` to delay when an element appears and control its duration.

```tsx
import { Sequence, useVideoConfig } from "remotion";

const { fps } = useVideoConfig();

<Sequence from={1 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>
  <Title />
</Sequence>
<Sequence from={2 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>
  <Subtitle />
</Sequence>
```

By default, `<Sequence>` wraps its children in an `AbsoluteFill`. To prevent this:

```tsx
<Sequence layout="none">
  <Title />
</Sequence>
```

## Premounting

Premounting loads a component before its visible time, allowing it to preload data or assets. Always premount sequences that contain heavy content.

```tsx
<Sequence premountFor={1 * fps}>
  <Title />
</Sequence>
```

## Series

Use `<Series>` when elements should play back-to-back without overlap.

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={45}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <MainContent />
  </Series.Sequence>
  <Series.Sequence durationInFrames={30}>
    <Outro />
  </Series.Sequence>
</Series>
```

`<Series.Sequence>` also wraps children in an `AbsoluteFill` by default. Set `layout="none"` to disable.

### Series with Overlaps

Use a negative `offset` for overlapping sequences:

```tsx
<Series>
  <Series.Sequence durationInFrames={60}>
    <SceneA />
  </Series.Sequence>
  <Series.Sequence offset={-15} durationInFrames={60}>
    {/* Starts 15 frames before SceneA ends */}
    <SceneB />
  </Series.Sequence>
</Series>
```

## Frame References Inside Sequences

Inside a `<Sequence>`, `useCurrentFrame()` returns the LOCAL frame (starting from 0), not the global composition frame:

```tsx
<Sequence from={60} durationInFrames={30}>
  <MyComponent />
  {/* Inside MyComponent, useCurrentFrame() returns 0-29, not 60-89 */}
</Sequence>
```

## Nested Sequences

Sequences can be nested for complex timing hierarchies:

```tsx
<Sequence from={0} durationInFrames={120}>
  <Background />
  <Sequence from={15} durationInFrames={90} layout="none">
    <Title />
  </Sequence>
  <Sequence from={45} durationInFrames={60} layout="none">
    <Subtitle />
  </Sequence>
</Sequence>
```

## Nesting Compositions

To embed one composition inside another, use `<Sequence>` with explicit `width` and `height`:

```tsx
<AbsoluteFill>
  <Sequence width={COMPOSITION_WIDTH} height={COMPOSITION_HEIGHT}>
    <CompositionComponent />
  </Sequence>
</AbsoluteFill>
```

## Common Mistakes

- **Forgetting `premountFor` on data-heavy sequences** -- Without premounting, components only mount when their `from` frame is reached, which can cause visible loading delays.
- **Expecting global frames inside a Sequence** -- `useCurrentFrame()` resets to 0 inside each `<Sequence>`. If you need the global frame, call `useCurrentFrame()` in the parent and pass it as a prop.
- **Omitting `layout="none"` on inline elements** -- Without it, the Sequence wraps children in an `AbsoluteFill`, which can break flex/grid layouts.
- **Using `<Series.Sequence>` outside of `<Series>`** -- `<Series.Sequence>` must be a direct child of `<Series>`.
- **Forgetting `durationInFrames` on Sequence** -- Without it the component stays mounted until the end of the parent. This is sometimes intended, but often a mistake that causes overlapping content.
