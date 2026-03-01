---
name: transcribe
description: Transcribing audio to generate captions using Whisper.cpp in Remotion
metadata:
  tags: captions, transcribe, whisper, audio, speech-to-text
---

# Transcribing Audio

Use [`transcribe()`](https://www.remotion.dev/docs/install-whisper-cpp/transcribe) from [`@remotion/install-whisper-cpp`](https://www.remotion.dev/docs/install-whisper-cpp) to generate captions from audio/video files.

## Prerequisites

Install the package:

```bash
npx remotion add @remotion/install-whisper-cpp
```

## Audio format requirement

Whisper.cpp requires **16 kHz WAV** input. If your source is MP3, MP4, or another format, convert it first:

```bash
bunx remotion ffmpeg -i input.mp3 -ar 16000 public/audio.wav -y
bunx remotion ffmpeg -i input.mp4 -ar 16000 public/audio.wav -y
```

## Transcription script

Create a Node.js script that downloads Whisper.cpp, downloads a model, and transcribes the audio. **The output JSON must be written to the `public/` folder** so Remotion can load it via `staticFile()`.

```ts
import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import fs from "fs";

const to = path.join(process.cwd(), "whisper.cpp");

await installWhisperCpp({
  to,
  version: "1.5.5",
});

await downloadWhisperModel({
  model: "medium.en",
  folder: to,
});

const whisperCppOutput = await transcribe({
  model: "medium.en",
  whisperPath: to,
  whisperCppVersion: "1.5.5",
  inputPath: "public/audio.wav",
  tokenLevelTimestamps: true,
});

// Recommended postprocessing
const { captions } = toCaptions({
  whisperCppOutput,
});

// IMPORTANT: Write to public/ so staticFile() can access it
fs.writeFileSync(
  path.join(process.cwd(), "public", "captions.json"),
  JSON.stringify(captions, null, 2),
);
```

Run the script:

```bash
node --strip-types transcribe.ts
```

Transcribe each clip individually and create separate JSON files per clip.

See [display.md](./display.md) for how to render captions in your composition.

## Common mistakes

- Writing the JSON output outside of `public/` -- Remotion's `staticFile()` only serves files from the `public/` folder.
- Feeding a non-WAV or non-16 kHz file to Whisper.cpp -- it will either fail or produce garbage timestamps.
- Forgetting `tokenLevelTimestamps: true` -- without it you will not get per-word timing needed for highlighting.
- Using a relative path like `"captions.json"` instead of `path.join(process.cwd(), "public", "captions.json")` when writing the file.
