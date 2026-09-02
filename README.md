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

Edit `content/media.ts` to add optional target, acquisition, integration,
equipment, location, and `capturedAt` details. Capture dates accept `YYYY`,
`YYYY-MM`, or `YYYY-MM-DD`. The default gallery order places dated work newest
first, followed by undated work in curated order. Empty fields are omitted from
the interface.

Generated videos can be moved to object storage later without changing the
content model. Until Git LFS is installed, do not add camera originals or
master exports to Git.
