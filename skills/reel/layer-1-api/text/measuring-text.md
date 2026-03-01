---
name: measuring-text
description: Measuring text dimensions, fitting text to containers, and checking overflow
metadata:
  tags: measure, text, layout, dimensions, fitText, fillTextBox, layout-utils
---

# Measuring Text

## Prerequisites

Install `@remotion/layout-utils` if not already installed:

```bash
npx remotion add @remotion/layout-utils # If project uses npm
bunx remotion add @remotion/layout-utils # If project uses bun
yarn remotion add @remotion/layout-utils # If project uses yarn
pnpm exec remotion add @remotion/layout-utils # If project uses pnpm
```

## measureText()

Calculate the width and height of text. Results are cached.

```tsx
import { measureText } from "@remotion/layout-utils";

const { width, height } = measureText({
  text: "Hello World",
  fontFamily: "Arial",
  fontSize: 32,
  fontWeight: "bold",
});
```

## fitText()

Find the optimal font size for a given container width:

```tsx
import { fitText } from "@remotion/layout-utils";

const { fontSize } = fitText({
  text: "Hello World",
  withinWidth: 600,
  fontFamily: "Inter",
  fontWeight: "bold",
});

return (
  <div
    style={{
      fontSize: Math.min(fontSize, 80), // Cap at 80px
      fontFamily: "Inter",
      fontWeight: "bold",
    }}
  >
    Hello World
  </div>
);
```

## fillTextBox()

Check if text exceeds a box with a given width and max lines:

```tsx
import { fillTextBox } from "@remotion/layout-utils";

const box = fillTextBox({ maxBoxWidth: 400, maxLines: 3 });

const words = ["Hello", "World", "This", "is", "a", "test"];
for (const word of words) {
  const { exceedsBox } = box.add({
    text: word + " ",
    fontFamily: "Arial",
    fontSize: 24,
  });
  if (exceedsBox) {
    // Text would overflow, handle accordingly
    break;
  }
}
```

## Best Practices

**Load fonts first.** Only call measurement functions after fonts are loaded:

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily, waitUntilDone } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

waitUntilDone().then(() => {
  const { width } = measureText({
    text: "Hello",
    fontFamily,
    fontSize: 32,
  });
});
```

**Use `validateFontIsLoaded`.** Catch font loading issues early:

```tsx
measureText({
  text: "Hello",
  fontFamily: "MyCustomFont",
  fontSize: 32,
  validateFontIsLoaded: true, // Throws if font not loaded
});
```

**Match font properties between measurement and rendering:**

```tsx
const fontStyle = {
  fontFamily: "Inter",
  fontSize: 32,
  fontWeight: "bold" as const,
  letterSpacing: "0.5px",
};

const { width } = measureText({
  text: "Hello",
  ...fontStyle,
});

return <div style={fontStyle}>Hello</div>;
```

**Use `outline` instead of `border`** to prevent layout differences between measurement and rendering:

```tsx
<div style={{ outline: "2px solid red" }}>Text</div>
```

## Common Mistakes

- **Measuring text before fonts are loaded** -- Measurements will use a fallback font and return incorrect dimensions. Always wait for fonts first with `waitUntilDone()` or use `validateFontIsLoaded: true`.
- **Mismatching font properties between `measureText` and the rendered element** -- If you measure with `fontSize: 32` but render with `fontSize: 36`, the layout will be wrong. Extract shared font properties into a constant.
- **Using `border` instead of `outline`** -- CSS `border` adds to the element's dimensions, causing discrepancies between measured and rendered sizes. Use `outline` instead.
- **Calling `measureText` in a hot loop without caching** -- While results are cached internally, calling with slightly different parameters each frame will fill the cache. Compute measurements once and store the result.
- **Forgetting to install `@remotion/layout-utils`** -- These functions are not part of the core `remotion` package. Install separately with `npx remotion add @remotion/layout-utils`.
