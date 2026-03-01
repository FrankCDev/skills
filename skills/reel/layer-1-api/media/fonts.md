---
name: fonts
description: Loading Google Fonts and local fonts in Remotion - weights, subsets, waitUntilDone
metadata:
  tags: fonts, google-fonts, typography, text, loadFont, local-fonts
---

# Fonts

## Google Fonts with @remotion/google-fonts

The recommended way to use Google Fonts. Type-safe and automatically blocks rendering until the font is ready.

### Prerequisites

```bash
npx remotion add @remotion/google-fonts # If project uses npm
bunx remotion add @remotion/google-fonts # If project uses bun
yarn remotion add @remotion/google-fonts # If project uses yarn
pnpm exec remotion add @remotion/google-fonts # If project uses pnpm
```

### Basic Usage

```tsx
import { loadFont } from "@remotion/google-fonts/Lobster";

const { fontFamily } = loadFont();

export const MyComposition = () => {
  return <div style={{ fontFamily }}>Hello World</div>;
};
```

### Specifying Weights and Subsets

Reduce file size by loading only needed weights and subsets:

```tsx
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
```

### Waiting for Font to Load

Use `waitUntilDone()` when you need to know the font is ready (e.g., before measuring text):

```tsx
import { loadFont } from "@remotion/google-fonts/Lobster";

const { fontFamily, waitUntilDone } = loadFont();

await waitUntilDone();
```

## Local Fonts with @remotion/fonts

### Prerequisites

```bash
npx remotion add @remotion/fonts # If project uses npm
bunx remotion add @remotion/fonts # If project uses bun
yarn remotion add @remotion/fonts # If project uses yarn
pnpm exec remotion add @remotion/fonts # If project uses pnpm
```

### Loading a Local Font

Place font files in `public/` and use `loadFont()`:

```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

await loadFont({
  family: "MyFont",
  url: staticFile("MyFont-Regular.woff2"),
});

export const MyComposition = () => {
  return <div style={{ fontFamily: "MyFont" }}>Hello World</div>;
};
```

### Loading Multiple Weights

Load each weight separately with the same family name:

```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

await Promise.all([
  loadFont({
    family: "Inter",
    url: staticFile("Inter-Regular.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("Inter-Bold.woff2"),
    weight: "700",
  }),
]);
```

### Available Options

```tsx
loadFont({
  family: "MyFont",              // Required: name to use in CSS
  url: staticFile("font.woff2"), // Required: font file URL
  format: "woff2",               // Optional: auto-detected from extension
  weight: "400",                 // Optional: font weight
  style: "normal",               // Optional: normal or italic
  display: "block",              // Optional: font-display behavior
});
```

## Using in Components

Call `loadFont()` at the top level of your module (outside the component function) or in a separate file imported early:

```tsx
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const Title: React.FC<{ text: string }> = ({ text }) => {
  return (
    <h1
      style={{
        fontFamily,
        fontSize: 80,
        fontWeight: "bold",
      }}
    >
      {text}
    </h1>
  );
};
```

## Common Mistakes

- **Calling `loadFont()` inside a component render function** -- `loadFont()` should be called at module scope (top level), not inside a React component body. Calling it during render triggers repeated font loads.
- **Mismatching `fontFamily` string between `loadFont` and CSS** -- For local fonts, the `family` name passed to `loadFont()` must exactly match what you use in `style={{ fontFamily: "..." }}`.
- **Not waiting for fonts before measuring text** -- If you use `measureText()` or `fitText()` from `@remotion/layout-utils`, call `waitUntilDone()` first or set `validateFontIsLoaded: true`.
- **Loading all weights when only one is needed** -- Each weight is a separate network request. Specify only the weights you actually use to reduce load time.
- **Using `@remotion/google-fonts` import path without the font name** -- The import must include the specific font: `@remotion/google-fonts/Roboto`, not `@remotion/google-fonts`.
