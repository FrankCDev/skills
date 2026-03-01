# Reel — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build "reel", a 4-layer Claude Code Skill that replaces the official Remotion Skill with Apple-inspired design aesthetics, engineering architecture, and scene templates.

**Architecture:** 4-layer system (API Rules → Architecture → Design System → Templates). SKILL.md acts as an intelligent router. All content in English. All code in TypeScript + React.

**Tech Stack:** Remotion v4, React, TypeScript, TailwindCSS, @remotion/google-fonts, @remotion/transitions, @remotion/captions, @remotion/media

---

## Task 1: Project Scaffolding

**Files:**
- Create: `skills/reel/SKILL.md`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/index.ts`
- Create: `src/Root.tsx`
- Create: `README.md`

**Step 1: Create directory structure**

```bash
cd /Users/jinchaofs/Desktop/just_to_do/enhanced_remotion
mkdir -p skills/reel/layer-1-api/{core,media,text,captions,effects,advanced,utils}
mkdir -p skills/reel/layer-2-architecture
mkdir -p skills/reel/layer-3-design
mkdir -p skills/reel/layer-4-templates/assets
mkdir -p src
```

**Step 2: Create package.json**

```json
{
  "name": "reel",
  "description": "Enhanced Remotion Skill with Apple-inspired design system",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "remotion studio"
  },
  "devDependencies": {
    "remotion": "^4.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@remotion/cli": "^4.0.0",
    "@remotion/bundler": "^4.0.0",
    "@remotion/google-fonts": "^4.0.0",
    "@remotion/transitions": "^4.0.0",
    "@remotion/captions": "^4.0.0",
    "@remotion/media": "^4.0.0",
    "@remotion/shapes": "^4.0.0",
    "@remotion/three": "^4.0.0",
    "@remotion/lottie": "^4.0.0",
    "@remotion/media-utils": "^4.0.0",
    "@remotion/paths": "^4.0.0",
    "@remotion/layout-utils": "^4.0.0",
    "@remotion/light-leaks": "^4.0.0",
    "@remotion/sfx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "noEmit": true,
    "strict": true
  },
  "include": ["./src", "./skills"]
}
```

**Step 4: Create src/index.ts and src/Root.tsx**

Placeholder Root.tsx that will be updated as templates are built. Initially imports nothing.

**Step 5: Create SKILL.md (the intelligent router)**

This is the most critical file. See Task 2 for full content.

**Step 6: Create README.md**

Brief README explaining what reel is and how to install.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: scaffold reel project structure"
```

---

## Task 2: SKILL.md — Intelligent Router

**Files:**
- Create: `skills/reel/SKILL.md`

The SKILL.md must contain:
1. Frontmatter with name, description, tags
2. "When to use" section
3. Intent-based routing decision tree
4. Topic-specific quick-load sections (captions, ffmpeg, audio-viz, sfx)
5. Complete file index organized by layer

Full content for SKILL.md:

````markdown
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
- [layer-1-api/captions/subtitles.md](layer-1-api/captions/subtitles.md) — Caption format, routing to sub-files
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
````

**Step 2: Commit**

```bash
git add skills/reel/SKILL.md && git commit -m "feat: add SKILL.md intelligent router"
```

---

## Task 3: Layer 1 — Core API Rules (5 files)

**Files:**
- Create: `skills/reel/layer-1-api/core/compositions.md`
- Create: `skills/reel/layer-1-api/core/animations.md`
- Create: `skills/reel/layer-1-api/core/timing.md`
- Create: `skills/reel/layer-1-api/core/sequencing.md`
- Create: `skills/reel/layer-1-api/core/trimming.md`

These are optimized rewrites of the official rules. Key improvements:
- Add frontmatter with name, description, metadata tags
- Keep all API examples from official
- Fix any inaccuracies
- Add "Common mistakes" section to each file
- Keep content concise and scannable

Source reference: Official rules at `/Users/jinchaofs/Desktop/just_to_do/skills-main/skills/remotion/rules/`

**Commit:** `feat: add Layer 1 core API rules`

---

## Task 4: Layer 1 — Media API Rules (6 files)

**Files:**
- Create: `skills/reel/layer-1-api/media/assets.md`
- Create: `skills/reel/layer-1-api/media/videos.md`
- Create: `skills/reel/layer-1-api/media/audio.md`
- Create: `skills/reel/layer-1-api/media/images.md`
- Create: `skills/reel/layer-1-api/media/fonts.md`
- Create: `skills/reel/layer-1-api/media/gifs.md`

Source reference: Official rules. Optimized rewrites with improvements.

**Commit:** `feat: add Layer 1 media API rules`

---

## Task 5: Layer 1 — Text API Rules (3 files)

**Files:**
- Create: `skills/reel/layer-1-api/text/text-animations.md`
- Create: `skills/reel/layer-1-api/text/measuring-text.md`
- Create: `skills/reel/layer-1-api/text/tailwind.md`

Source reference: Official rules. Enhanced text-animations.md with inline code examples (not just file references).

**Commit:** `feat: add Layer 1 text API rules`

---

## Task 6: Layer 1 — Captions API Rules (5 files)

**Files:**
- Create: `skills/reel/layer-1-api/captions/subtitles.md`
- Create: `skills/reel/layer-1-api/captions/transcribe.md`
- Create: `skills/reel/layer-1-api/captions/display.md`
- Create: `skills/reel/layer-1-api/captions/import-srt.md`
- Create: `skills/reel/layer-1-api/captions/voiceover.md`

Key improvement: Fix the caption generation issues (Issue #6352) — ensure videos go to public/, preserve whitespace, clear Whisper.cpp instructions.

**Commit:** `feat: add Layer 1 captions API rules`

---

## Task 7: Layer 1 — Effects API Rules (4 files)

**Files:**
- Create: `skills/reel/layer-1-api/effects/transitions.md`
- Create: `skills/reel/layer-1-api/effects/light-leaks.md`
- Create: `skills/reel/layer-1-api/effects/audio-visualization.md`
- Create: `skills/reel/layer-1-api/effects/sfx.md`

Source reference: Official rules. Keep all content.

**Commit:** `feat: add Layer 1 effects API rules`

---

## Task 8: Layer 1 — Advanced API Rules (6 files)

**Files:**
- Create: `skills/reel/layer-1-api/advanced/3d.md`
- Create: `skills/reel/layer-1-api/advanced/lottie.md`
- Create: `skills/reel/layer-1-api/advanced/charts.md`
- Create: `skills/reel/layer-1-api/advanced/maps.md`
- Create: `skills/reel/layer-1-api/advanced/transparent-videos.md`
- Create: `skills/reel/layer-1-api/advanced/parameters.md`

Source reference: Official rules. Keep all content.

**Commit:** `feat: add Layer 1 advanced API rules`

---

## Task 9: Layer 1 — Utils API Rules (4 files)

**Files:**
- Create: `skills/reel/layer-1-api/utils/calculate-metadata.md`
- Create: `skills/reel/layer-1-api/utils/measuring-dom.md`
- Create: `skills/reel/layer-1-api/utils/media-analysis.md` (merges 5 official files)
- Create: `skills/reel/layer-1-api/utils/ffmpeg.md`

Key improvement: media-analysis.md consolidates get-video-duration, get-video-dimensions, get-audio-duration, can-decode, and extract-frames into one comprehensive file.

**Commit:** `feat: add Layer 1 utils API rules`

---

## Task 10: Layer 2 — Architecture (5 files)

**Files:**
- Create: `skills/reel/layer-2-architecture/project-structure.md`
- Create: `skills/reel/layer-2-architecture/rendering.md`
- Create: `skills/reel/layer-2-architecture/debugging.md`
- Create: `skills/reel/layer-2-architecture/performance.md`
- Create: `skills/reel/layer-2-architecture/data-driven.md`

All new content — none of this exists in the official skill.

**project-structure.md**: Recommended folder layout, component organization, shared utilities, props typing patterns, Root.tsx organization with Folders.

**rendering.md**: CLI render commands, codec comparison (H.264 vs H.265 vs ProRes vs VP9), resolution presets, frame rate guidance, audio codec options, Lambda/cloud rendering overview, render optimization flags.

**debugging.md**: Common errors catalog (blank frames, flickering, audio sync, memory), diagnostic checklist, Studio vs render differences, font loading issues, async data loading pitfalls.

**performance.md**: Reducing re-renders, offscreen optimization, heavy computation patterns (useMemo, calculateMetadata), image/video optimization, concurrency settings, memory management for long videos.

**data-driven.md**: Fetching data in calculateMetadata, delayRender/continueRender patterns, building videos from API responses, JSON config-driven compositions, batch rendering different data sets.

**Commit:** `feat: add Layer 2 architecture guides`

---

## Task 11: Layer 3 — Design System (8 files)

**Files:**
- Create: `skills/reel/layer-3-design/philosophy.md`
- Create: `skills/reel/layer-3-design/color.md`
- Create: `skills/reel/layer-3-design/typography.md`
- Create: `skills/reel/layer-3-design/spacing-layout.md`
- Create: `skills/reel/layer-3-design/motion-language.md`
- Create: `skills/reel/layer-3-design/glassmorphism.md`
- Create: `skills/reel/layer-3-design/micro-interactions.md`
- Create: `skills/reel/layer-3-design/dark-light-themes.md`

This is the core differentiator. All new content with comprehensive Remotion code examples.

See design doc for detailed content specification per file.

**Commit:** `feat: add Layer 3 design system`

---

## Task 12: Layer 4 — Templates (4 md + 4 tsx)

**Files:**
- Create: `skills/reel/layer-4-templates/tech-tutorial.md`
- Create: `skills/reel/layer-4-templates/product-showcase.md`
- Create: `skills/reel/layer-4-templates/data-story.md`
- Create: `skills/reel/layer-4-templates/social-short.md`
- Create: `skills/reel/layer-4-templates/assets/tech-tutorial-demo.tsx`
- Create: `skills/reel/layer-4-templates/assets/product-showcase-demo.tsx`
- Create: `skills/reel/layer-4-templates/assets/data-story-demo.tsx`
- Create: `skills/reel/layer-4-templates/assets/social-short-demo.tsx`

Each .md contains: storyboard, design token references, full inline TSX code.
Each .tsx is a runnable Remotion composition demonstrating the template.

**Commit:** `feat: add Layer 4 scene templates`

---

## Task 13: Root Project Setup + Final Integration

**Files:**
- Update: `src/Root.tsx` — import all 4 template demos as compositions
- Update: `src/index.ts` — registerRoot
- Verify: All file paths in SKILL.md match actual files

**Commit:** `feat: finalize project setup with all template compositions`

---

## Dependency Graph

Tasks 3-9 (Layer 1) are independent of each other — can run in parallel.
Task 10 (Layer 2) is independent — can run in parallel with Layer 1.
Task 11 (Layer 3) is independent — can run in parallel with Layer 1 and 2.
Task 12 (Layer 4) depends on Layer 3 design tokens being defined.
Task 13 depends on Task 12.

```
Task 1 (scaffolding)
  → Task 2 (SKILL.md)
  → Tasks 3-11 (all in parallel)
    → Task 12 (templates, after Layer 3)
      → Task 13 (integration)
```
