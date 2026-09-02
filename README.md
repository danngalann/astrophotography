# Astrophotography

An English-only astrophotography portfolio built with Next.js.

## Development

```bash
pnpm install
pnpm dev
```

## Docker

The production image uses Next.js standalone output, runs as a non-root user,
and joins the external `proxy` Docker network without publishing a host port.
Create that network once if it does not already exist:

```bash
docker network create proxy
make deploy
```

The reverse proxy can reach the application at `http://astrophotography:3000`.
Use `make logs`, `make status`, `make restart`, and `make down` for routine
operations.

## Media workflow

Originals deliberately live outside this repository. The committed web assets
are responsive WebP images and H.264 videos generated with ImageMagick and
FFmpeg:

```bash
pnpm media:build
```

By default the script reads stills from `../portfolio/public/astro` and uploads
from `/run/media/daniel/ASTRODRIVE/to_upload`. Override either location when
needed:

```bash
PORTFOLIO_ASTRO_DIR=/path/to/images \
ASTRO_UPLOAD_DIR=/path/to/uploads \
pnpm media:build
```

## Editing picture metadata

All titles, descriptions, dates, and capture details live in
[`content/media.ts`](content/media.ts). Find the entry with the matching
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

The supported fields are:

| Field | Purpose | Example |
| --- | --- | --- |
| `capturedAt` | Capture date and chronological ordering | `"2025-08-14"` |
| `details.target` | Object, catalogue number, and constellation | `"M31 · Andromeda"` |
| `details.acquisition` | Exposure count, exposure length, filters, gain, or session notes | `"60 × 180 s · LRGB"` |
| `details.integration` | Total usable exposure time across all sessions | `"3 h"` |
| `details.equipment` | Telescope, lens, camera, mount, filters, or guiding equipment | `"RedCat 51 · ASI2600MC Pro · HEQ5"` |
| `details.location` | Capture site | `"Montseny, Spain"` |

`capturedAt` accepts `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Dated work is shown
newest first. Pictures without a date are still displayed after dated work, in
their existing order in `content/media.ts`.

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

Generated videos can be moved to object storage later without changing the
content model. Until Git LFS is installed, do not add camera originals or
master exports to Git.
