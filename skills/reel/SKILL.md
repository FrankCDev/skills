---
name: reel
description: Enhanced Remotion skill with Apple-inspired design system, engineering architecture, and scene templates for creating professional videos in React.
metadata:
  tags: remotion, video, react, animation, design-system, apple, motion-graphics
---

## When to use

Use this skill whenever you are working with Remotion code. It provides domain-specific knowledge for the Remotion framework, an Apple-inspired design system, engineering best practices, and ready-to-use scene templates.

## Intent routing

Load files based on what the user needs:

**Starting a new project?**
→ Load [layer-2-architecture/project-structure.md](layer-2-architecture/project-structure.md) + [layer-3-design/philosophy.md](layer-3-design/philosophy.md)

**Asking about a specific Remotion API?**
→ Load the corresponding file from `layer-1-api/`

**Wants the video to "look good" or "be professional"?**
→ Load [layer-3-design/philosophy.md](layer-3-design/philosophy.md) + the relevant design file from `layer-3-design/`

**Says "make a [type] video"?**
→ Load the matching template from `layer-4-templates/` + [layer-3-design/motion-language.md](layer-3-design/motion-language.md)

**Encountering a bug or error?**
→ Load [layer-2-architecture/debugging.md](layer-2-architecture/debugging.md)

**Ready to render/export?**
→ Load [layer-2-architecture/rendering.md](layer-2-architecture/rendering.md)

**Working with captions or subtitles?**
→ Load [layer-1-api/captions/subtitles.md](layer-1-api/captions/subtitles.md) first, then the specific sub-file

**Working with FFmpeg?**
→ Load [layer-1-api/utils/ffmpeg.md](layer-1-api/utils/ffmpeg.md)

**Needs audio visualization?**
→ Load [layer-1-api/effects/audio-visualization.md](layer-1-api/effects/audio-visualization.md)

**Needs sound effects?**
→ Load [layer-1-api/effects/sfx.md](layer-1-api/effects/sfx.md)

**Wants to use TailwindCSS?**
→ Load [layer-1-api/text/tailwind.md](layer-1-api/text/tailwind.md)

**Wants 3D, Lottie, charts, or maps?**
→ Load the corresponding file from `layer-1-api/advanced/`

**Wants parametrizable videos with schemas?**
→ Load [layer-1-api/advanced/parameters.md](layer-1-api/advanced/parameters.md)

## Layer 1 — API Rules

Core framework knowledge. Load these when the user needs specific Remotion API guidance.

### Core
- [layer-1-api/core/compositions.md](layer-1-api/core/compositions.md) — Defining compositions, stills, folders, default props and dynamic metadata
- [layer-1-api/core/animations.md](layer-1-api/core/animations.md) — Fundamental animation patterns driven by useCurrentFrame()
- [layer-1-api/core/timing.md](layer-1-api/core/timing.md) — Interpolation, spring physics, easing, and bezier curves
- [layer-1-api/core/sequencing.md](layer-1-api/core/sequencing.md) — Sequence, Series, delays, overlaps, and nesting
- [layer-1-api/core/trimming.md](layer-1-api/core/trimming.md) — Trimming the start or end of animations

### Media
- [layer-1-api/media/assets.md](layer-1-api/media/assets.md) — Importing assets with staticFile() from the public/ folder
- [layer-1-api/media/videos.md](layer-1-api/media/videos.md) — Embedding videos with trimming, volume, speed, looping, pitch
- [layer-1-api/media/audio.md](layer-1-api/media/audio.md) — Audio playback, trimming, volume curves, speed, looping, pitch
- [layer-1-api/media/images.md](layer-1-api/media/images.md) — Embedding images with the Img component
- [layer-1-api/media/fonts.md](layer-1-api/media/fonts.md) — Loading Google Fonts and local fonts
- [layer-1-api/media/gifs.md](layer-1-api/media/gifs.md) — Displaying animated GIFs, APNG, AVIF, WebP

### Text
- [layer-1-api/text/text-animations.md](layer-1-api/text/text-animations.md) — Typewriter, word highlight, and text animation patterns
- [layer-1-api/text/measuring-text.md](layer-1-api/text/measuring-text.md) — Measuring text dimensions, fitting text, checking overflow
- [layer-1-api/text/tailwind.md](layer-1-api/text/tailwind.md) — Using TailwindCSS in Remotion

### Captions
- [layer-1-api/captions/subtitles.md](layer-1-api/captions/subtitles.md) — Caption format and routing to sub-files
- [layer-1-api/captions/transcribe.md](layer-1-api/captions/transcribe.md) — Transcribing audio with Whisper.cpp
- [layer-1-api/captions/display.md](layer-1-api/captions/display.md) — Displaying TikTok-style captions with word highlighting
- [layer-1-api/captions/import-srt.md](layer-1-api/captions/import-srt.md) — Importing .srt subtitle files
- [layer-1-api/captions/voiceover.md](layer-1-api/captions/voiceover.md) — AI voiceover with ElevenLabs TTS

### Effects
- [layer-1-api/effects/transitions.md](layer-1-api/effects/transitions.md) — Scene transitions: fade, slide, wipe, flip, clock-wipe
- [layer-1-api/effects/light-leaks.md](layer-1-api/effects/light-leaks.md) — WebGL light leak overlay effects
- [layer-1-api/effects/audio-visualization.md](layer-1-api/effects/audio-visualization.md) — Spectrum bars, waveforms, bass-reactive effects
- [layer-1-api/effects/sfx.md](layer-1-api/effects/sfx.md) — Built-in sound effects

### Advanced
- [layer-1-api/advanced/3d.md](layer-1-api/advanced/3d.md) — Three.js and React Three Fiber in Remotion
- [layer-1-api/advanced/lottie.md](layer-1-api/advanced/lottie.md) — Embedding Lottie animations
- [layer-1-api/advanced/charts.md](layer-1-api/advanced/charts.md) — Bar, pie, line, and stock chart animations
- [layer-1-api/advanced/maps.md](layer-1-api/advanced/maps.md) — Mapbox map animations with camera and line animation
- [layer-1-api/advanced/transparent-videos.md](layer-1-api/advanced/transparent-videos.md) — Rendering videos with alpha transparency
- [layer-1-api/advanced/parameters.md](layer-1-api/advanced/parameters.md) — Parametrizable videos with Zod schemas

### Utils
- [layer-1-api/utils/calculate-metadata.md](layer-1-api/utils/calculate-metadata.md) — Dynamic composition duration, dimensions, and props
- [layer-1-api/utils/measuring-dom.md](layer-1-api/utils/measuring-dom.md) — Measuring DOM elements accounting for Remotion's scale transform
- [layer-1-api/utils/media-analysis.md](layer-1-api/utils/media-analysis.md) — Video/audio duration, dimensions, decode checks, frame extraction
- [layer-1-api/utils/ffmpeg.md](layer-1-api/utils/ffmpeg.md) — Using FFmpeg/FFprobe in Remotion

## Layer 2 — Architecture

Engineering best practices not covered by the official skill.

- [layer-2-architecture/project-structure.md](layer-2-architecture/project-structure.md) — How to organize a Remotion project
- [layer-2-architecture/rendering.md](layer-2-architecture/rendering.md) — Render configuration, codecs, optimization
- [layer-2-architecture/debugging.md](layer-2-architecture/debugging.md) — Common errors and troubleshooting guide
- [layer-2-architecture/performance.md](layer-2-architecture/performance.md) — Performance optimization for complex videos
- [layer-2-architecture/data-driven.md](layer-2-architecture/data-driven.md) — Building data-driven videos from APIs

## Layer 3 — Design System

Apple-inspired design system with modern flourishes. Load these for visual quality.

- [layer-3-design/philosophy.md](layer-3-design/philosophy.md) — Core design principles and anti-patterns
- [layer-3-design/color.md](layer-3-design/color.md) — Color palettes, gradients, semantic colors, dark/light
- [layer-3-design/typography.md](layer-3-design/typography.md) — Font stacks, type scale, weight pairing, CJK support
- [layer-3-design/spacing-layout.md](layer-3-design/spacing-layout.md) — Grid system, safe zones, aspect ratios, breathing room
- [layer-3-design/motion-language.md](layer-3-design/motion-language.md) — Spring presets, entrance/exit/emphasis animations
- [layer-3-design/glassmorphism.md](layer-3-design/glassmorphism.md) — Frosted glass, material effects, backdrop-filter
- [layer-3-design/micro-interactions.md](layer-3-design/micro-interactions.md) — Counters, progress, highlights, subtle effects
- [layer-3-design/dark-light-themes.md](layer-3-design/dark-light-themes.md) — Theme system with createTheme() utility

## Layer 4 — Templates

Ready-to-use scene templates. Each includes storyboard, design tokens, and full TSX code.

- [layer-4-templates/tech-tutorial.md](layer-4-templates/tech-tutorial.md) — Code demos, step-by-step explanations
- [layer-4-templates/product-showcase.md](layer-4-templates/product-showcase.md) — Feature highlights, scene transitions
- [layer-4-templates/data-story.md](layer-4-templates/data-story.md) — Chart animations, data narratives
- [layer-4-templates/social-short.md](layer-4-templates/social-short.md) — Vertical format, fast pace, strong hooks
