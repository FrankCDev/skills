---
name: compositions
description: Defining compositions, stills, folders, default props, dynamic metadata, and nesting
metadata:
  tags: composition, still, folder, props, metadata, nesting, root
---

# Compositions

A `<Composition>` defines a renderable video with its component, dimensions, fps, and duration. Place compositions in `src/Root.tsx`.

```tsx
import { Composition } from "remotion";
import { MyComposition } from "./MyComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
    />
  );
};
```

## Default Props

Pass `defaultProps` to provide initial values. Values must be JSON-serializable (`Date`, `Map`, `Set`, and `staticFile()` are also supported).

```tsx
import { Composition } from "remotion";
import { MyComposition, MyCompositionProps } from "./MyComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={
        {
          title: "Hello World",
          color: "#ff0000",
        } satisfies MyCompositionProps
      }
    />
  );
};
```

Use `type` declarations for props (not `interface`) to ensure `defaultProps` type safety.

## Folders

Use `<Folder>` to organize compositions in the sidebar. Folders can be nested.

```tsx
import { Composition, Folder } from "remotion";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Marketing">
        <Composition id="Promo" /* ... */ />
        <Composition id="Ad" /* ... */ />
      </Folder>
      <Folder name="Social">
        <Folder name="Instagram">
          <Composition id="Story" /* ... */ />
          <Composition id="Reel" /* ... */ />
        </Folder>
      </Folder>
    </>
  );
};
```

## Stills

Use `<Still>` for single-frame images. No `durationInFrames` or `fps` required.

```tsx
import { Still } from "remotion";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot = () => {
  return (
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
  );
};
```

## Calculate Metadata

Use `calculateMetadata` to dynamically set dimensions, duration, or props based on fetched data. It runs once before rendering begins.

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";
import { MyComposition, MyCompositionProps } from "./MyComposition";

const calculateMetadata: CalculateMetadataFunction<
  MyCompositionProps
> = async ({ props, abortSignal }) => {
  const data = await fetch(`https://api.example.com/video/${props.videoId}`, {
    signal: abortSignal,
  }).then((res) => res.json());

  return {
    durationInFrames: Math.ceil(data.duration * 30),
    props: {
      ...props,
      videoUrl: data.url,
    },
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100} // Placeholder, will be overridden
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ videoId: "abc123" }}
      calculateMetadata={calculateMetadata}
    />
  );
};
```

The function can return `props`, `durationInFrames`, `width`, `height`, `fps`, and codec-related defaults.

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

- **Using `interface` instead of `type` for props** -- `interface` breaks `satisfies` checks on `defaultProps`. Always use `type`.
- **Forgetting `id` on Composition** -- Every `<Composition>` requires a unique `id` string for CLI rendering and Studio selection.
- **Non-serializable defaultProps** -- Functions, class instances, and symbols cannot be used in `defaultProps`.
- **Omitting placeholder values when using `calculateMetadata`** -- You still need to provide `durationInFrames`, `fps`, etc. on the `<Composition>` even if `calculateMetadata` will override them.
- **Folder names with special characters** -- Folder names can only contain letters, numbers, and hyphens.
