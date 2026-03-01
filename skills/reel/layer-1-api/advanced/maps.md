---
name: maps
description: Map animations with Mapbox including camera animation, line animation, markers, 3D buildings, and rendering flags
metadata:
  tags: map, mapbox, animation, camera, geojson, turf
---

# Map Animations with Mapbox

Use Mapbox GL JS to add animated maps to Remotion compositions.

## Prerequisites

Install Mapbox and Turf.js based on your package manager:

```bash
npm i mapbox-gl @turf/turf @types/mapbox-gl      # npm
bun i mapbox-gl @turf/turf @types/mapbox-gl       # bun
yarn add mapbox-gl @turf/turf @types/mapbox-gl    # yarn
pnpm i mapbox-gl @turf/turf @types/mapbox-gl      # pnpm
```

Create a free Mapbox account and get an access token at https://console.mapbox.com/account/access-tokens/.

Add the token to `.env`:

```txt title=".env"
REMOTION_MAPBOX_TOKEN=pk.your-mapbox-access-token
```

## Adding a map

```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useDelayRender, useVideoConfig } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";

export const lineCoordinates = [
  [6.56158447265625, 46.059891147620725],
  [6.5691375732421875, 46.05679376154153],
  [6.5842437744140625, 46.05059898938315],
  [6.594886779785156, 46.04702502069337],
  [6.601066589355469, 46.0460718554722],
  [6.6089630126953125, 46.0365370783104],
  [6.6185760498046875, 46.018420689207964],
];

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

export const MyComposition = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { delayRender, continueRender } = useDelayRender();

  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 11.53,
      center: [6.5615, 46.0598],
      pitch: 65,
      bearing: 0,
      style: "mapbox://styles/mapbox/standard",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("style.load", () => {
      const hideFeatures = [
        "showRoadsAndTransit",
        "showRoads",
        "showTransit",
        "showPedestrianRoads",
        "showRoadLabels",
        "showTransitLabels",
        "showPlaceLabels",
        "showPointOfInterestLabels",
        "showPointsOfInterest",
        "showAdminBoundaries",
        "showLandmarkIcons",
        "showLandmarkIconLabels",
        "show3dObjects",
        "show3dBuildings",
        "show3dTrees",
        "show3dLandmarks",
        "show3dFacades",
      ];
      for (const feature of hideFeatures) {
        _map.setConfigProperty("basemap", feature, false);
      }

      _map.setConfigProperty("basemap", "colorTrunks", "rgba(0, 0, 0, 0)");

      _map.addSource("trace", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: lineCoordinates,
          },
        },
      });
      _map.addLayer({
        type: "line",
        source: "trace",
        id: "line",
        paint: { "line-color": "black", "line-width": 5 },
        layout: { "line-cap": "round", "line-join": "round" },
      });
    });

    _map.on("load", () => {
      continueRender(handle);
      setMap(_map);
    });
  }, [handle, lineCoordinates]);

  const style: React.CSSProperties = useMemo(
    () => ({ width, height, position: "absolute" }),
    [width, height],
  );

  return <AbsoluteFill ref={ref} style={style} />;
};
```

### Key Remotion rules for maps

- All animations must be driven by `useCurrentFrame()`. Disable Mapbox's own animations (`fadeDuration: 0`, `interactive: false`).
- Use `useDelayRender()` to hold rendering until the map loads.
- The map container element MUST have explicit `width`, `height`, and `position: "absolute"`.
- Do NOT add a `_map.remove()` cleanup function.

## Map style

Default to `mapbox://styles/mapbox/standard`. Unless otherwise requested, hide all features from the Mapbox Standard style:

```tsx
const hideFeatures = [
  "showRoadsAndTransit", "showRoads", "showTransit",
  "showPedestrianRoads", "showRoadLabels", "showTransitLabels",
  "showPlaceLabels", "showPointOfInterestLabels", "showPointsOfInterest",
  "showAdminBoundaries", "showLandmarkIcons", "showLandmarkIconLabels",
  "show3dObjects", "show3dBuildings", "show3dTrees",
  "show3dLandmarks", "show3dFacades",
];
for (const feature of hideFeatures) {
  _map.setConfigProperty("basemap", feature, false);
}
_map.setConfigProperty("basemap", "colorMotorways", "transparent");
_map.setConfigProperty("basemap", "colorRoads", "transparent");
_map.setConfigProperty("basemap", "colorTrunks", "transparent");
```

## Animating the camera

```tsx
import * as turf from "@turf/turf";
import { interpolate, Easing, useCurrentFrame, useVideoConfig, useDelayRender } from "remotion";

const animationDuration = 20;
const cameraAltitude = 4000;
```

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const { delayRender, continueRender } = useDelayRender();

useEffect(() => {
  if (!map) return;
  const handle = delayRender("Moving point...");

  const routeDistance = turf.length(turf.lineString(lineCoordinates));
  const progress = interpolate(
    frame / fps,
    [0.00001, animationDuration],
    [0, 1],
    {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const camera = map.getFreeCameraOptions();
  const alongRoute = turf.along(
    turf.lineString(lineCoordinates),
    routeDistance * progress,
  ).geometry.coordinates;

  camera.lookAtPoint({ lng: alongRoute[0], lat: alongRoute[1] });
  map.setFreeCameraOptions(camera);
  map.once("idle", () => continueRender(handle));
}, [lineCoordinates, fps, frame, handle, map]);
```

Notes:
- Keep the camera oriented so north is up by default.
- For multi-step animations, set ALL properties at ALL stages (zoom, position, line progress) to prevent jumps.
- Clamp progress minimum to avoid empty lines causing turf errors.

## Animating lines

### Straight lines (linear interpolation)

For straight lines on the map, use linear interpolation. Do NOT use turf's `lineSliceAlong` or `along` -- they use geodesic calculations which appear curved on Mercator projection.

```tsx
const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.cubic),
});

const start = lineCoordinates[0];
const end = lineCoordinates[1];
const currentLng = start[0] + (end[0] - start[0]) * progress;
const currentLat = start[1] + (end[1] - start[1]) * progress;

const source = map.getSource("trace") as mapboxgl.GeoJSONSource;
if (source) {
  source.setData({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [start, [currentLng, currentLat]],
    },
  });
}
```

### Curved lines (geodesic/great circle)

For flight paths or geodesic routes, use turf's `lineSliceAlong`:

```tsx
import * as turf from "@turf/turf";

const routeLine = turf.lineString(lineCoordinates);
const routeDistance = turf.length(routeLine);
const currentDistance = Math.max(0.001, routeDistance * progress);
const slicedLine = turf.lineSliceAlong(routeLine, 0, currentDistance);

const source = map.getSource("route") as mapboxgl.GeoJSONSource;
if (source) {
  source.setData(slicedLine);
}
```

## Markers

```tsx
_map.addSource("markers", {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Point 1" },
        geometry: { type: "Point", coordinates: [-118.2437, 34.0522] },
      },
    ],
  },
});

_map.addLayer({
  id: "city-markers",
  type: "circle",
  source: "markers",
  paint: {
    "circle-radius": 40,
    "circle-color": "#FF4444",
    "circle-stroke-width": 4,
    "circle-stroke-color": "#FFFFFF",
  },
});

_map.addLayer({
  id: "labels",
  type: "symbol",
  source: "markers",
  layout: {
    "text-field": ["get", "name"],
    "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
    "text-size": 50,
    "text-offset": [0, 0.5],
    "text-anchor": "top",
  },
  paint: {
    "text-color": "#FFFFFF",
    "text-halo-color": "#000000",
    "text-halo-width": 2,
  },
});
```

Make labels big enough for legibility. For 1920x1080 compositions, use font size >= 40px. Keep `text-offset` small and close to the marker.

## 3D buildings

```tsx
_map.setConfigProperty("basemap", "show3dObjects", true);
_map.setConfigProperty("basemap", "show3dLandmarks", true);
_map.setConfigProperty("basemap", "show3dBuildings", true);
```

## Rendering

Render map animations with these required flags:

```bash
npx remotion render --gl=angle --concurrency=1
```

## Common mistakes

- Forgetting `--gl=angle --concurrency=1` when rendering -- maps will not render correctly otherwise.
- Adding a `_map.remove()` cleanup function -- this breaks Remotion's rendering.
- Not setting `interactive: false` and `fadeDuration: 0` -- Mapbox's built-in animations cause flickering.
- Missing explicit `width`, `height`, and `position: "absolute"` on the map container element.
- Using turf for straight lines on a Mercator map -- use linear interpolation instead.
- Not clamping progress to a minimum value -- empty lines cause turf errors.
- Using `=` instead of just the token value in the `.env` file (e.g. `==pk.token` instead of `=pk.token`).
