---
name: dark-light-themes
description: Theme system with createTheme() utility, pre-built palettes, theme switching, auto-contrast text, and theme-aware glassmorphism
metadata:
  tags: theme, dark-mode, light-mode, theming, colors, createTheme, contrast, glass
---

# Dark & Light Themes

A professional video system needs both dark and light modes. Dark mode is not just "invert the colors" -- it requires careful adjustments to contrast, saturation, surface hierarchy, and glass treatment. This guide provides a complete theme system for Remotion compositions with a `createTheme()` factory function, pre-built palettes, and theme-aware components.

---

## 1. createTheme() Utility

The core factory function. Pass a mode and accent configuration, receive a complete, balanced theme object with all design tokens. This is the single source of truth for all themed components.

```ts
// lib/theme.ts

export interface ThemeGradient {
  primary: string;
  secondary: string;
}

export interface ThemeGlass {
  background: string;
  border: string;
  blur: number;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface Theme {
  name: string;
  mode: 'dark' | 'light';
  colors: {
    bg: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    muted: string;
    accent: string;
    accentText: string;
    secondary: string;
    border: string;
    borderSubtle: string;
    overlay: string;
    success: string;
    warning: string;
    error: string;
  };
  gradient: ThemeGradient;
  shadows: ThemeShadows;
  glass: ThemeGlass;
}

interface CreateThemeOptions {
  name?: string;
  mode: 'dark' | 'light';
  accent?: string;
  secondary?: string;
  bg?: string;
  surface?: string;
}

export function createTheme(options: CreateThemeOptions): Theme {
  const {
    mode,
    name = mode === 'dark' ? 'Dark' : 'Light',
    accent = '#0A84FF',
    secondary = '#5E5CE6',
  } = options;

  if (mode === 'dark') {
    const bg = options.bg ?? '#0A0A0F';
    const surface = options.surface ?? '#16161F';

    return {
      name,
      mode: 'dark',
      colors: {
        bg,
        surface,
        surfaceHover: '#1E1E2A',
        // NOT pure white -- #F5F5F7 reduces eye strain
        text: '#F5F5F7',
        textSecondary: '#A1A1A6',
        muted: '#86868B',
        accent,
        accentText: '#FFFFFF',
        secondary,
        // Borders: very subtle, just enough to define edges
        border: 'rgba(255, 255, 255, 0.12)',
        borderSubtle: 'rgba(255, 255, 255, 0.06)',
        overlay: 'rgba(0, 0, 0, 0.6)',
        // Semantic: slightly more saturated for dark mode visibility
        success: '#30D158',
        warning: '#FFD60A',
        error: '#FF453A',
      },
      gradient: {
        primary: `linear-gradient(135deg, ${accent} 0%, ${secondary} 100%)`,
        secondary: `linear-gradient(180deg, ${bg} 0%, ${surface} 100%)`,
      },
      shadows: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
        md: '0 8px 24px rgba(0, 0, 0, 0.5)',
        lg: '0 16px 48px rgba(0, 0, 0, 0.6)',
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.08)',
        border: 'rgba(255, 255, 255, 0.12)',
        blur: 24,
      },
    };
  }

  // Light mode
  const bg = options.bg ?? '#FAFAFA';
  const surface = options.surface ?? '#FFFFFF';

  return {
    name,
    mode: 'light',
    colors: {
      bg,
      surface,
      surfaceHover: '#F5F5F5',
      // NOT pure black -- #1D1D1F is slightly softer
      text: '#1D1D1F',
      textSecondary: '#6E6E73',
      muted: '#86868B',
      accent,
      accentText: '#FFFFFF',
      secondary,
      border: 'rgba(0, 0, 0, 0.12)',
      borderSubtle: 'rgba(0, 0, 0, 0.06)',
      overlay: 'rgba(0, 0, 0, 0.4)',
      // Semantic: standard saturation
      success: '#34C759',
      warning: '#FF9F0A',
      error: '#FF3B30',
    },
    gradient: {
      primary: `linear-gradient(135deg, ${accent} 0%, ${secondary} 100%)`,
      secondary: `linear-gradient(180deg, ${bg} 0%, ${surface} 100%)`,
    },
    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
      md: '0 8px 24px rgba(0, 0, 0, 0.12)',
      lg: '0 16px 48px rgba(0, 0, 0, 0.16)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(0, 0, 0, 0.08)',
      blur: 24,
    },
  };
}
```

---

## 2. Theme Structure

Every theme follows a consistent token structure. Components should only reference these tokens -- never hardcode colors.

| Token | Purpose | Dark Example | Light Example |
|---|---|---|---|
| `bg` | Page / composition background | `#0A0A0F` | `#FAFAFA` |
| `surface` | Cards, panels, elevated elements | `#16161F` | `#FFFFFF` |
| `surfaceHover` | Hover/pressed state for surfaces | `#1E1E2A` | `#F5F5F5` |
| `text` | Primary text | `#F5F5F7` | `#1D1D1F` |
| `textSecondary` | Supporting text | `#A1A1A6` | `#6E6E73` |
| `muted` | Low-emphasis text (labels, captions) | `#86868B` | `#86868B` |
| `accent` | Brand / interactive color | Per theme | Per theme |
| `accentText` | Text on accent background | `#FFFFFF` | `#FFFFFF` |
| `secondary` | Secondary brand color | Per theme | Per theme |
| `border` | Standard borders | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.12)` |
| `borderSubtle` | Subtle dividers | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.06)` |
| `gradient.primary` | Main gradient (accent to secondary) | Accent gradient | Accent gradient |
| `shadows.md` | Standard elevation shadow | Deep, diffused | Light, defined |
| `glass.background` | Glassmorphism tint | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.6)` |
| `glass.border` | Glass edge border | White alpha | Black alpha |
| `glass.blur` | Backdrop blur radius | `24` | `24` |

---

## 3. Pre-Built Themes

Four ready-to-use themes built with `createTheme()`. Each uses accent colors from the palette system defined in `color.md`.

```ts
// lib/themes.ts
import { createTheme, type Theme } from './theme';

/** Deep dark with electric blue accent. The default. */
export const midnight: Theme = createTheme({
  name: 'Midnight',
  mode: 'dark',
  accent: '#0A84FF',
  secondary: '#5E5CE6',
  bg: '#0A0A0F',
  surface: '#16161F',
});

/** Clean light mode with warm undertones. */
export const daylight: Theme = createTheme({
  name: 'Daylight',
  mode: 'light',
  accent: '#0A84FF',
  secondary: '#5E5CE6',
  bg: '#FAFAFA',
  surface: '#FFFFFF',
});

/** Teal and deep sea tones. */
export const ocean: Theme = createTheme({
  name: 'Ocean',
  mode: 'dark',
  accent: '#00D4AA',
  secondary: '#0A84FF',
  bg: '#0D1B2A',
  surface: '#1B2838',
});

/** Soft pink and warm tones. */
export const blossom: Theme = createTheme({
  name: 'Blossom',
  mode: 'dark',
  accent: '#E84393',
  secondary: '#FD79A8',
  bg: '#1A0A14',
  surface: '#2A1420',
});

// Export all themes as a map
export const themes = {
  midnight,
  daylight,
  ocean,
  blossom,
} as const;

export type ThemeName = keyof typeof themes;
```

### Registering Multiple Theme Variants

```tsx
import { Composition } from 'remotion';
import { MyComposition } from './compositions/MyComposition';
import { themes, type ThemeName } from './lib/themes';

export const RemotionRoot: React.FC = () => (
  <>
    {(Object.keys(themes) as ThemeName[]).map((name) => (
      <Composition
        key={name}
        id={`MyVideo-${name}`}
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          themeName: name,
          title: 'Hello World',
        }}
      />
    ))}
  </>
);
```

---

## 4. Using Themes in Components

Components accept a `theme` prop and reference only the theme tokens for all visual properties. No hardcoded colors anywhere.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import type { Theme } from './lib/theme';
import { themes, type ThemeName } from './lib/themes';

// --- Theme-aware components ---

interface ThemeCardProps {
  theme: Theme;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  title,
  subtitle,
  metric,
  metricLabel,
}) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: 30, config: { damping: 200 } });
  const contentS = spring({ frame: Math.max(0, frame - 8), fps: 30, config: { damping: 200 } });

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 40,
        width: 440,
        // Dark mode uses borders; light mode uses shadows
        border: theme.mode === 'dark'
          ? `1px solid ${theme.colors.border}`
          : 'none',
        boxShadow: theme.mode === 'light' ? theme.shadows.md : 'none',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: theme.colors.accent,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: theme.colors.text,
          margin: 0,
          marginTop: 12,
        }}
      >
        {title}
      </h3>

      <div
        style={{
          height: 1,
          backgroundColor: theme.colors.borderSubtle,
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      <div
        style={{
          opacity: contentS,
          transform: `translateY(${interpolate(contentS, [0, 1], [12, 0])}px)`,
        }}
      >
        <p
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: theme.colors.text,
            margin: 0,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {metric}
        </p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: theme.colors.muted,
            margin: 0,
            marginTop: 4,
          }}
        >
          {metricLabel}
        </p>
      </div>
    </div>
  );
};

// --- Theme-aware button ---

interface ThemeButtonProps {
  theme: Theme;
  label: string;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ theme, label }) => (
  <div
    style={{
      display: 'inline-block',
      padding: '14px 32px',
      backgroundColor: theme.colors.accent,
      color: theme.colors.accentText,
      borderRadius: 12,
      fontSize: 18,
      fontWeight: 600,
    }}
  >
    {label}
  </div>
);

// --- Full themed composition ---

interface ThemedCompositionProps {
  themeName: ThemeName;
  title: string;
}

const ThemedComposition: React.FC<ThemedCompositionProps> = ({
  themeName,
  title,
}) => {
  const frame = useCurrentFrame();
  const theme = themes[themeName];

  const fadeUp = (delay: number) => {
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps: 30,
      config: { damping: 200 },
    });
    return {
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, padding: 96 }}>
      <div style={fadeUp(0)}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: theme.colors.accent,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            margin: 0,
          }}
        >
          {theme.name} Theme
        </p>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: theme.colors.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            marginTop: 16,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 24, color: theme.colors.muted, margin: 0, marginTop: 12 }}>
          All colors adapt to the active theme automatically.
        </p>
      </div>

      <div style={{ marginTop: 48, display: 'flex', gap: 24 }}>
        <div style={fadeUp(10)}>
          <ThemeCard
            theme={theme}
            title="Performance"
            subtitle="Metric"
            metric="98.7%"
            metricLabel="Uptime this quarter"
          />
        </div>
        <div style={fadeUp(16)}>
          <ThemeCard
            theme={theme}
            title="Growth"
            subtitle="Metric"
            metric="+47%"
            metricLabel="Year over year"
          />
        </div>
      </div>

      <div style={{ marginTop: 48, ...fadeUp(24) }}>
        <ThemeButton theme={theme} label="Learn More" />
      </div>
    </AbsoluteFill>
  );
};
```

---

## 5. Theme Switching Animation

Transitioning between themes within a single composition. The background, text, and surface colors crossfade at a specified frame. Use `interpolateColors` for smooth color interpolation.

```tsx
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  interpolate,
  interpolateColors,
} from 'remotion';
import type { Theme } from './lib/theme';
import { midnight, daylight } from './lib/themes';

interface ThemeSwitchProps {
  themeA: Theme;
  themeB: Theme;
  /** Frame at which the transition starts */
  switchFrame: number;
}

const ThemeSwitchScene: React.FC<ThemeSwitchProps> = ({
  themeA,
  themeB,
  switchFrame,
}) => {
  const frame = useCurrentFrame();

  // Smooth transition over ~20 frames
  const transition = spring({
    frame: Math.max(0, frame - switchFrame),
    fps: 30,
    config: { damping: 200 },
  });

  // Interpolate every color token between the two themes
  const bg = interpolateColors(transition, [0, 1], [themeA.colors.bg, themeB.colors.bg]);
  const surface = interpolateColors(transition, [0, 1], [themeA.colors.surface, themeB.colors.surface]);
  const text = interpolateColors(transition, [0, 1], [themeA.colors.text, themeB.colors.text]);
  const muted = interpolateColors(transition, [0, 1], [themeA.colors.muted, themeB.colors.muted]);
  const accent = interpolateColors(transition, [0, 1], [themeA.colors.accent, themeB.colors.accent]);
  const border = interpolateColors(
    transition,
    [0, 1],
    [themeA.colors.border, themeB.colors.border],
  );

  // Determine current mode for elevation style
  const currentMode = transition < 0.5 ? themeA.mode : themeB.mode;
  const shadow = transition < 0.5 ? themeA.shadows.md : themeB.shadows.md;

  return (
    <AbsoluteFill style={{ backgroundColor: bg, padding: 96 }}>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: accent,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
          margin: 0,
        }}
      >
        Theme Transition
      </p>

      <h1
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: text,
          margin: 0,
          marginTop: 16,
          lineHeight: 1.1,
        }}
      >
        Watch the colors shift
      </h1>

      <p style={{ fontSize: 24, color: muted, margin: 0, marginTop: 12 }}>
        Smooth crossfade between dark and light themes.
      </p>

      {/* Themed card that transitions */}
      <div
        style={{
          backgroundColor: surface,
          borderRadius: 20,
          padding: 40,
          marginTop: 48,
          maxWidth: 500,
          border: currentMode === 'dark' ? `1px solid ${border}` : 'none',
          boxShadow: currentMode === 'light' ? shadow : 'none',
        }}
      >
        <p style={{ fontSize: 20, color: muted, margin: 0 }}>
          Card content adapts seamlessly.
        </p>
        <div
          style={{
            marginTop: 24,
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: accent,
            color: '#FFFFFF',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Action Button
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Usage: switches from Midnight to Daylight at frame 60
const ThemeSwitchDemo: React.FC = () => (
  <ThemeSwitchScene
    themeA={midnight}
    themeB={daylight}
    switchFrame={60}
  />
);
```

---

## 6. Auto-Contrast Text

A utility that ensures text is readable against any background by choosing either white or black text based on the perceived luminance of the background color.

```ts
// lib/autoContrast.ts

/**
 * Returns '#FFFFFF' or '#1D1D1F' based on which provides better contrast
 * against the given background color.
 *
 * Uses the WCAG relative luminance formula.
 */
export function autoContrastText(bgHex: string): string {
  const hex = bgHex.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // sRGB to linear
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  // WCAG recommends white text on dark backgrounds (luminance < 0.179)
  return luminance > 0.179 ? '#1D1D1F' : '#F5F5F7';
}

/**
 * Returns the full contrast pair: text color and muted text color.
 */
export function autoContrastPair(bgHex: string): {
  text: string;
  muted: string;
} {
  const hex = bgHex.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  if (luminance > 0.179) {
    return { text: '#1D1D1F', muted: '#6E6E73' };
  }
  return { text: '#F5F5F7', muted: '#86868B' };
}
```

### Usage in Components

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import { autoContrastText, autoContrastPair } from './lib/autoContrast';

interface AccentBannerProps {
  backgroundColor: string;
  title: string;
  subtitle: string;
}

const AccentBanner: React.FC<AccentBannerProps> = ({
  backgroundColor,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: 30, config: { damping: 200 } });
  const { text, muted } = autoContrastPair(backgroundColor);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: s,
      }}
    >
      <h1
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: text,
          margin: 0,
          transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 28,
          color: muted,
          margin: 0,
          marginTop: 12,
          transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};

// Works on any background color
const AutoContrastDemo: React.FC = () => (
  <>
    {/* Text is automatically white on dark backgrounds */}
    <AccentBanner backgroundColor="#0A0A0F" title="Dark background" subtitle="Text adapts automatically" />

    {/* Text is automatically dark on light backgrounds */}
    <AccentBanner backgroundColor="#FAFAFA" title="Light background" subtitle="Text adapts automatically" />

    {/* Text is correct on accent colors */}
    <AccentBanner backgroundColor="#0A84FF" title="Accent background" subtitle="Still readable" />
  </>
);
```

---

## 7. Theme-Aware Glass

Glassmorphism that automatically adapts to the current theme. On dark backgrounds, glass uses white tint with white borders. On light backgrounds, glass uses higher white opacity with darker borders. Uses tokens from the theme's `glass` property.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import type { Theme } from './lib/theme';
import { midnight, daylight } from './lib/themes';

interface ThemeGlassCardProps {
  theme: Theme;
  children: React.ReactNode;
  padding?: number;
}

const ThemeGlassCard: React.FC<ThemeGlassCardProps> = ({
  theme,
  children,
  padding = 48,
}) => (
  <div
    style={{
      backgroundColor: theme.glass.background,
      backdropFilter: `blur(${theme.glass.blur}px)`,
      WebkitBackdropFilter: `blur(${theme.glass.blur}px)`,
      border: `1px solid ${theme.glass.border}`,
      borderRadius: 24,
      padding,
      boxShadow: theme.shadows.md,
      willChange: 'transform',
    }}
  >
    {children}
  </div>
);

// Dark theme glass demo
const DarkGlassScene: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = midnight;
  const s = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Ambient gradient -- glass needs content behind it */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          background: `radial-gradient(ellipse at center, ${theme.colors.accent}33 0%, transparent 70%)`,
        }}
      />

      <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)` }}>
        <ThemeGlassCard theme={theme}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: theme.colors.text, margin: 0 }}>
            Dark Glass
          </h2>
          <p style={{ fontSize: 20, color: theme.colors.muted, margin: 0, marginTop: 12, lineHeight: 1.5 }}>
            White tint, white border, deep shadow.
          </p>
        </ThemeGlassCard>
      </div>
    </AbsoluteFill>
  );
};

// Light theme glass demo
const LightGlassScene: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = daylight;
  const s = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Warm ambient gradient */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          background: `radial-gradient(ellipse at center, ${theme.colors.accent}20 0%, transparent 70%)`,
        }}
      />

      <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)` }}>
        <ThemeGlassCard theme={theme}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: theme.colors.text, margin: 0 }}>
            Light Glass
          </h2>
          <p style={{ fontSize: 20, color: theme.colors.muted, margin: 0, marginTop: 12, lineHeight: 1.5 }}>
            Higher opacity, darker border, lighter shadow.
          </p>
        </ThemeGlassCard>
      </div>
    </AbsoluteFill>
  );
};
```

### Glass Dashboard with Theme

A complete themed glass dashboard scene.

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import type { Theme } from './lib/theme';

interface GlassDashboardProps {
  theme: Theme;
  metrics: Array<{ label: string; value: string; change: string }>;
}

const GlassDashboard: React.FC<GlassDashboardProps> = ({ theme, metrics }) => {
  const frame = useCurrentFrame();

  const animate = (delay: number) => {
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps: 30,
      config: { damping: 200 },
    });
    return {
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
    };
  };

  const glassStyle: React.CSSProperties = {
    backgroundColor: theme.glass.background,
    backdropFilter: `blur(${theme.glass.blur}px)`,
    WebkitBackdropFilter: `blur(${theme.glass.blur}px)`,
    border: `1px solid ${theme.glass.border}`,
    borderRadius: 20,
    willChange: 'transform',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, padding: 80 }}>
      {/* Ambient gradient for glass to blur against */}
      <div
        style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          top: '10%',
          right: '10%',
          background: `radial-gradient(ellipse, ${theme.colors.accent}25 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          bottom: '15%',
          left: '15%',
          background: `radial-gradient(ellipse, ${theme.colors.secondary}20 0%, transparent 70%)`,
        }}
      />

      {/* Title */}
      <div style={animate(0)}>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: theme.colors.text, margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 20, color: theme.colors.muted, margin: 0, marginTop: 8 }}>
          Real-time metrics
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: 24, marginTop: 48 }}>
        {metrics.map((metric, i) => (
          <div
            key={i}
            style={{
              ...glassStyle,
              flex: 1,
              padding: 32,
              ...animate(8 + i * 4),
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: theme.colors.muted, margin: 0 }}>
              {metric.label}
            </p>
            <p
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: theme.colors.text,
                margin: 0,
                marginTop: 8,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {metric.value}
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: theme.colors.success,
                margin: 0,
                marginTop: 8,
              }}
            >
              {metric.change}
            </p>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

---

## 8. Anti-Patterns

### Hardcoded colors

The most common mistake. If any component contains a literal color value instead of referencing a theme token, it will break when the theme changes.

```tsx
// ANTI-PATTERN: Hardcoded colors everywhere
<div style={{ backgroundColor: '#0A0A0F' }}>
  <h1 style={{ color: '#F5F5F7' }}>Title</h1>
  <p style={{ color: '#86868B' }}>Subtitle</p>
  <div style={{ backgroundColor: '#16161F', border: '1px solid rgba(255,255,255,0.12)' }}>
    Card
  </div>
</div>
```

```tsx
// CORRECT: All colors come from the theme
<div style={{ backgroundColor: theme.colors.bg }}>
  <h1 style={{ color: theme.colors.text }}>Title</h1>
  <p style={{ color: theme.colors.muted }}>Subtitle</p>
  <div
    style={{
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
    }}
  >
    Card
  </div>
</div>
```

### Inconsistent opacity

Mixing different opacity values for similar elements creates visual noise. Use the theme's `border` and `borderSubtle` tokens consistently.

```tsx
// ANTI-PATTERN: Random border opacity values
<div style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Card 1</div>
<div style={{ border: '1px solid rgba(255,255,255,0.2)' }}>Card 2</div>
<div style={{ border: '1px solid rgba(255,255,255,0.05)' }}>Card 3</div>
```

```tsx
// CORRECT: Consistent opacity from theme tokens
<div style={{ border: `1px solid ${theme.colors.border}` }}>Card 1</div>
<div style={{ border: `1px solid ${theme.colors.border}` }}>Card 2</div>
<div style={{ border: `1px solid ${theme.colors.border}` }}>Card 3</div>
```

### Theme leaking between scenes

If different scenes in the same composition use different themes without a proper transition, the viewer perceives a jarring flash. Either use a single theme throughout or animate the transition (see section 5).

```tsx
// ANTI-PATTERN: Abrupt theme change between sequences
<Sequence from={0} durationInFrames={90}>
  <DarkScene /> {/* Midnight theme */}
</Sequence>
<Sequence from={90} durationInFrames={90}>
  <LightScene /> {/* Daylight theme -- jarring flash */}
</Sequence>
```

```tsx
// CORRECT: Animated transition between themes
<Sequence from={0} durationInFrames={180}>
  <ThemeSwitchScene
    themeA={midnight}
    themeB={daylight}
    switchFrame={80} // Smooth crossfade starting at frame 80
  />
</Sequence>
```

### Using pure black and pure white

Pure black (`#000000`) and pure white (`#FFFFFF`) create maximum contrast, which causes eye strain. Always use the off-values from `createTheme()`.

```tsx
// ANTI-PATTERN: Pure black/white
<div style={{ backgroundColor: '#000000' }}>
  <p style={{ color: '#FFFFFF' }}>Maximum contrast -- harsh on the eyes</p>
</div>
```

```tsx
// CORRECT: Off-black/off-white from theme
<div style={{ backgroundColor: theme.colors.bg }}> {/* #0A0A0F */}
  <p style={{ color: theme.colors.text }}> {/* #F5F5F7 */}
    Comfortable contrast
  </p>
</div>
```

### Forgetting elevation differences between modes

In dark mode, shadows are nearly invisible. Surface elevation is communicated through brightness increments. In light mode, shadows are the primary elevation cue. Components must adapt their elevation strategy based on the theme mode.

```tsx
// ANTI-PATTERN: Same elevation style for both modes
<div style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
  {/* Shadow invisible on dark backgrounds */}
</div>
```

```tsx
// CORRECT: Mode-aware elevation
<div
  style={{
    backgroundColor: theme.colors.surface,
    // Dark: visible border, no shadow. Light: shadow, no border.
    border: theme.mode === 'dark' ? `1px solid ${theme.colors.border}` : 'none',
    boxShadow: theme.mode === 'light' ? theme.shadows.md : 'none',
  }}
>
  Properly elevated in both modes
</div>
```

### Not bumping saturation in dark mode

Colors that look vibrant on white backgrounds look dull on dark backgrounds. The `createTheme()` utility handles this for semantic colors (success, warning, error), but custom colors passed as accents should also be checked.

```tsx
// Dark mode semantic colors are MORE saturated than light mode
const darkSuccess = '#30D158';  // Brighter green
const lightSuccess = '#34C759'; // Standard green

const darkError = '#FF453A';    // Brighter red
const lightError = '#FF3B30';   // Standard red
```

---

## Quick Reference: Dark vs Light

| Token | Dark Mode | Light Mode | Why Different |
|---|---|---|---|
| bg | `#0A0A0F` | `#FAFAFA` | Off-black/off-white reduce strain |
| surface | `#16161F` | `#FFFFFF` | Brightness step creates elevation |
| text | `#F5F5F7` | `#1D1D1F` | Slightly reduced contrast |
| secondary | `#A1A1A6` | `#6E6E73` | Darker secondary in light mode |
| muted | `#86868B` | `#86868B` | Same -- mid-gray works universally |
| border | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.12)` | White on dark, dark on light |
| elevation | Brightness increments + borders | Box shadows | Shadows invisible on dark |
| glass bg | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.6)` | More opacity needed on light |
| glass border | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.08)` | Matches border convention |
| saturation | +10-15% more | Standard | Colors dull on dark backgrounds |
| success | `#30D158` | `#34C759` | Brighter for dark mode visibility |
| error | `#FF453A` | `#FF3B30` | Brighter for dark mode visibility |
