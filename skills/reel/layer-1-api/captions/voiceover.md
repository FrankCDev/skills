---
name: voiceover
description: Adding AI-generated voiceover to Remotion compositions using ElevenLabs TTS with dynamic duration
metadata:
  tags: voiceover, audio, elevenlabs, tts, speech, calculateMetadata, dynamic-duration
---

# Adding AI Voiceover to a Remotion Composition

Use ElevenLabs TTS to generate speech audio per scene, then use `calculateMetadata` to dynamically size the composition to match the audio.

## Prerequisites

An **ElevenLabs API key** is required (`ELEVENLABS_API_KEY` environment variable).

**MUST** ask the user for their ElevenLabs API key if `ELEVENLABS_API_KEY` is not set. **MUST NOT** fall back to other TTS tools.

## Generating audio with ElevenLabs

Create a script that calls the ElevenLabs API for each scene and writes MP3 files to `public/` so Remotion can access them via `staticFile()`.

```ts title="generate-voiceover.ts"
const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: "Welcome to the show.",
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
      },
    }),
  },
);

const audioBuffer = Buffer.from(await response.arrayBuffer());
writeFileSync(`public/voiceover/${compositionId}/${scene.id}.mp3`, audioBuffer);
```

Run the generation script:

```bash
node --strip-types generate-voiceover.ts
```

## Dynamic composition duration with calculateMetadata

Use `calculateMetadata` to measure audio durations and set the composition length:

```tsx
import { CalculateMetadataFunction, staticFile } from "remotion";
import { getAudioDuration } from "./get-audio-duration";

const FPS = 30;

const SCENE_AUDIO_FILES = [
  "voiceover/my-comp/scene-01-intro.mp3",
  "voiceover/my-comp/scene-02-main.mp3",
  "voiceover/my-comp/scene-03-outro.mp3",
];

export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const durations = await Promise.all(
    SCENE_AUDIO_FILES.map((file) => getAudioDuration(staticFile(file))),
  );

  const sceneDurations = durations.map((durationInSeconds) => {
    return durationInSeconds * FPS;
  });

  return {
    durationInFrames: Math.ceil(sceneDurations.reduce((sum, d) => sum + d, 0)),
  };
};
```

Pass computed `sceneDurations` to the component via a `voiceover` prop so the component knows how long each scene should be.

If the composition uses `<TransitionSeries>`, subtract the overlap from total duration. See [transitions.md](../effects/transitions.md#duration-calculation).

## Rendering audio in the component

See Remotion's audio documentation for how to render `<Audio>` tags in the component.

## Delaying audio start

Wrap `<Audio>` in a `<Sequence from={delayFrames}>` to delay the audio start. Use `trimBefore` (in seconds) to skip the beginning of the audio file.

## Common mistakes

- Not setting `ELEVENLABS_API_KEY` as an environment variable before running the script.
- Writing generated audio files outside `public/` -- Remotion cannot access them via `staticFile()`.
- Forgetting to create the output directory (`public/voiceover/...`) before writing files.
- Not accounting for transition overlap when calculating total `durationInFrames`.
- Using a model that does not exist -- verify the `model_id` in the ElevenLabs docs.
