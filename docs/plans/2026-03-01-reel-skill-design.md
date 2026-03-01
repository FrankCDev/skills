# Reel — Enhanced Remotion Skill Design

## Overview

**Name**: reel
**Purpose**: A Claude Code Skill that completely replaces the official Remotion Skill, adding Apple-inspired design aesthetics, engineering architecture guidance, scene templates, and comprehensive debugging/rendering support.
**Target User**: Independent developers/creators making tech tutorials, product showcases, data visualizations, and social media short videos.
**Distribution**: Open source via GitHub, installable via `npx skills add`.

## Architecture: 4-Layer System

```
Layer 4: Templates   — Scene templates with full TSX implementations
Layer 3: Design      — Apple + modern design system (colors, typography, motion, layout)
Layer 2: Architecture — Project structure, rendering, debugging, performance
Layer 1: API Rules   — Optimized rewrite of official Remotion rules
```

AI loads 2-3 files at a time based on intent routing in SKILL.md.

## Directory Structure

```
skills/reel/
├── SKILL.md                          # Entry point with intent-based routing
├── layer-1-api/
│   ├── core/                         # compositions, animations, timing, sequencing, trimming
│   ├── media/                        # videos, audio, images, fonts, gifs, assets
│   ├── text/                         # text-animations, measuring-text, tailwind
│   ├── captions/                     # transcribe, display, import-srt, voiceover
│   ├── effects/                      # transitions, light-leaks, audio-viz, sfx
│   ├── advanced/                     # 3d, lottie, charts, maps, transparent-videos, parameters
│   └── utils/                        # calculate-metadata, measuring-dom, media-analysis, ffmpeg
├── layer-2-architecture/
│   ├── project-structure.md
│   ├── rendering.md
│   ├── debugging.md
│   ├── performance.md
│   └── data-driven.md
├── layer-3-design/
│   ├── philosophy.md
│   ├── color.md
│   ├── typography.md
│   ├── spacing-layout.md
│   ├── motion-language.md
│   ├── glassmorphism.md
│   ├── micro-interactions.md
│   └── dark-light-themes.md
└── layer-4-templates/
    ├── tech-tutorial.md
    ├── product-showcase.md
    ├── data-story.md
    ├── social-short.md
    └── assets/
        ├── tech-tutorial-demo.tsx
        ├── product-showcase-demo.tsx
        ├── data-story-demo.tsx
        └── social-short-demo.tsx
```

## Key Design Decisions

1. **Layer 1 merges redundant files** — e.g. get-video-duration, get-video-dimensions, get-audio-duration, can-decode, extract-frames → single media-analysis.md
2. **Layer 3 is the core differentiator** — Apple aesthetic + modern design encoded as reusable Remotion code patterns
3. **Layer 4 templates reference Layer 3** — templates use design system tokens, not hardcoded values
4. **SKILL.md uses intent routing** — AI loads only relevant files based on user request type
5. **All code examples use TypeScript + React** — consistent with Remotion ecosystem

## Design System Principles (Layer 3)

- **Restraint**: Less is more. Every element must earn its place.
- **Hierarchy**: Clear visual priority through size, weight, and spacing.
- **Flow**: Motion has purpose. No decorative animations.
- **Consistency**: Unified visual language across all scenes.

## Implementation Priority

Phase 1: Scaffolding + SKILL.md + Layer 1 API rules (core + media + text)
Phase 2: Layer 1 remaining (captions + effects + advanced + utils)
Phase 3: Layer 2 Architecture
Phase 4: Layer 3 Design System
Phase 5: Layer 4 Templates + demo assets
Phase 6: Root project setup (package.json, src/, preview)
