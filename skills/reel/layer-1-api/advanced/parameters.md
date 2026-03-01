---
name: parameters
description: Making Remotion videos parametrizable with Zod schemas and zColor
metadata:
  tags: parameters, zod, schema, zColor, composition, props
---

# Parametrizable Compositions

Add a Zod schema to a `<Composition>` to make it parametrizable with visual controls in Remotion Studio.

## Prerequisites

Install `zod` based on your package manager:

```bash
npm i zod            # npm
bun i zod            # bun
yarn add zod         # yarn
pnpm i zod           # pnpm
```

## Defining a schema

Define a Zod schema alongside the component:

```tsx title="src/MyComposition.tsx"
import { z } from "zod";

export const MyCompositionSchema = z.object({
  title: z.string(),
});

const MyComponent: React.FC<z.infer<typeof MyCompositionSchema>> = ({
  title,
}) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};
```

## Registering the schema on a Composition

```tsx title="src/Root.tsx"
import { Composition } from "remotion";
import { MyComponent, MyCompositionSchema } from "./MyComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComponent}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ title: "Hello World" }}
      schema={MyCompositionSchema}
    />
  );
};
```

Now the user can edit the parameter visually in the Studio sidebar.

All Zod types are supported. The top-level type **must** be a `z.object()` because React component props are always an object.

## Color picker with zColor

For a color picker in the Studio sidebar, use `zColor()` from `@remotion/zod-types`.

```bash
npx remotion add @remotion/zod-types # npm
bunx remotion add @remotion/zod-types # bun
yarn remotion add @remotion/zod-types # yarn
pnpm exec remotion add @remotion/zod-types # pnpm
```

```tsx
import { zColor } from "@remotion/zod-types";

export const MyCompositionSchema = z.object({
  color: zColor(),
});
```

## Common mistakes

- Using a non-object type as the top-level schema (e.g. `z.string()`) -- it must be `z.object({...})`.
- Forgetting `defaultProps` on the `<Composition>` -- the schema needs matching defaults.
- Not destructuring props in the component (accessing `props.title` without receiving `props` as a parameter, or forgetting to destructure `{ title }`).
- Using a plain string for colors instead of `zColor()` -- you lose the visual color picker in Studio.
- Mismatching the `defaultProps` keys with the schema fields -- this will cause a runtime error.
