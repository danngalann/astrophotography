# Picture metadata

All titles, descriptions, dates, and capture details live in
[`content/media.ts`](../content/media.ts). Find the entry with the matching
`slug`, then add any fields that are available. Every metadata field is
optional.

For example:

```ts
{
  slug: "veil-nebula",
  kind: "image",
  category: "Deep sky",
  title: "Eastern Veil Nebula",
  description: "Delicate filaments from the Cygnus Loop.",
  alt: "The blue and red filaments of the Eastern Veil Nebula",
  capturedAt: "2025-08",
  details: {
    target: "NGC 6992 · Cygnus",
    acquisition: "42 × 300 s · dual narrowband · gain 100",
    integration: "3 h 30 min",
    equipment: "Telescope · camera · mount · filter",
    location: "Teruel, Spain",
  },
},
```

## Supported fields

| Field | Purpose | Example |
| --- | --- | --- |
| `capturedAt` | Capture date and chronological ordering | `"2025-08-14"` |
| `details.target` | Object, catalogue number, and constellation | `"M31 · Andromeda"` |
| `details.acquisition` | Exposure count, exposure length, filters, gain, or session notes | `"60 × 180 s · LRGB"` |
| `details.integration` | Total usable exposure time across all sessions | `"3 h"` |
| `details.equipment` | Telescope, lens, camera, mount, filters, or guiding equipment | `"RedCat 51 · ASI2600MC Pro · HEQ5"` |
| `details.location` | Capture site | `"Montseny, Spain"` |

## Dates and ordering

`capturedAt` accepts `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Dated work is shown
newest first. Pictures without a date are still displayed after dated work, in
their existing order in `content/media.ts`.

## Acquisition and integration

Use `acquisition` for how the data was captured and `integration` for the
combined exposure duration. For example, `36 × 300 s · dual narrowband` is the
acquisition, while `3 h` is the total integration time.

Do not add empty strings or placeholder values. If a field is omitted, its row
is automatically hidden in the picture viewer:

```ts
details: {
  target: "Messier 45 · Taurus",
  integration: "2 h 15 min",
  // Acquisition, equipment, and location are unknown, so omit them.
},
```

Metadata changes do not require running the media pipeline. Start the
development server with `pnpm dev`, open the picture, and verify the details in
its information panel.
