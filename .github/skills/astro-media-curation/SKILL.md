---
name: astro-media-curation
description: Curate astrophotography archives, extract defensible capture metadata, calculate integration time, detect duplicates, and import optimized portfolio media.
---

# Astrophotography media curation

Use this skill when adding images or videos from an astrophotography archive,
recovering capture details, auditing existing metadata, or regenerating web
derivatives.

## Privacy and safety

- Treat the source archive as read-only. Never rename, move, delete, convert in
  place, or write sidecar files beside originals.
- Refer to the source as `<archive-root>` in documentation, logs, commits, and
  reports. Do not commit hostnames, usernames, mount points, network shares, or
  private directory structures.
- Use `ASTRO_ARCHIVE_DIR` locally when the archive is outside the ignored
  `media-originals` directory.
- Commit only generated web derivatives. Camera originals, project files,
  calibration frames, and processing intermediates remain outside Git.
- Do not infer facts from weak evidence. Omit optional metadata when confidence
  is insufficient.

## Repository surfaces

- `scripts/process-media.mjs`: canonical source mapping and derivative pipeline.
- `content/media.ts`: editorial metadata displayed by the site.
- `content/generated-media.json`: generated dimensions, widths, and durations.
- `public/media/`: committed responsive images, videos, and posters.
- `docs/media-metadata.md`: public metadata field reference.

Keep generated dimensions out of `content/media.ts`; they belong in the
generated manifest.

## Archive inventory

Start with a bounded, read-only inventory:

```bash
find "<archive-root>" -maxdepth 3 -type d -print
find "<archive-root>" -type f -printf '%s\t%p\n'
```

Summarize extensions and sizes before inspecting individual files. Large
archives commonly contain:

- Finished outputs: JPEG, PNG, TIFF, MP4, MOV, or WebM.
- Camera originals: CR2, CR3, NEF, ARW, DNG, and similar RAW formats.
- Astronomy lights: FIT/FITS and XISF.
- Calibration data: DARK, FLAT, BIAS, DARKFLAT, and master frames.
- Processing products: registered frames, normalized frames, rejection maps,
  masks, integration files, PixInsight projects, and application caches.

Do not equate a common image extension with a finished result. Timelapse source
frames and preview JPEGs may number in the thousands.

## Choosing finished media

Prefer candidates supported by several signals:

1. A descriptive target/session folder.
2. A filename such as `final`, `edited`, `export`, `finished`, or a clear target
   name.
3. Placement in an export or final-output directory.
4. Full useful resolution and a visually finished render.
5. Distinction from current portfolio media and alternate processing variants.

Normally exclude:

- LIGHT, DARK, FLAT, BIAS, SNAPSHOT, and calibration directories.
- `master`, `registered`, `calibrated`, `debayered`, `normalized`, `rejected`,
  and drizzle products unless a clearly finished export exists nowhere else.
- Masks, starless processing layers, rejection maps, previews, thumbnails, and
  temporary autosaves.
- Generic numbered files whose subject cannot be established.
- Multiple exports of the same edit.

A file named `final` is strong evidence of processing state, but not of target,
date, location, or equipment.

## Metadata evidence hierarchy

Use the strongest source available for each individual field:

1. Embedded camera or astronomy header.
2. Capture application logs, sequence files, or accepted-frame lists.
3. Original LIGHT filenames with consistent structured tokens.
4. Dated target/location session folder.
5. Finished-output filename.
6. Visual identification.

Folder context may establish a date or location but must not override conflicting
embedded metadata. Visual identification can support a target classification,
but should not be used to invent catalogue numbers, equipment, exposure
settings, or location.

Record uncertainty per field. One reliable field does not make every inferred
field reliable.

## Inspecting media

### Finished images

```bash
magick identify -format '%i\t%wx%h\t%b\n' "<image>"
magick identify -verbose "<image>"
```

Useful EXIF fields include:

- `DateTimeOriginal`
- `Model`
- `LensModel`
- `ExposureTime`
- `FNumber`
- `FocalLength`
- `ISOSpeedRatings`

Prefer `exiftool -json` when installed. ImageMagick and `raw-identify` are useful
fallbacks for camera RAW files.

### Videos

```bash
ffprobe -v error \
  -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size \
  -of json "<video>"
```

Inspect representative frames when filenames are vague:

```bash
ffmpeg -ss 00:00:02 -i "<video>" -frames:v 1 -f image2 "<temporary-frame>.jpg"
```

Create temporary files only in session or operating-system temporary storage
and remove them after analysis.

### FITS

FITS headers contain fixed-width cards near the start of the file. Use a FITS
library when available; otherwise inspect bounded header text:

```bash
strings -n 8 "<light.fit>" | head -200
```

Common fields include `OBJECT`, `DATE-OBS`, `EXPTIME`, `FILTER`, `INSTRUME`,
`TELESCOP`, `FOCALLEN`, `GAIN`, `OFFSET`, `XBINNING`, and `YBINNING`.

### XISF

XISF files contain XML metadata that can often be inspected without decoding
the image:

```bash
strings "<light.xisf>" |
  grep -Ei 'DATE-OBS|EXPTIME|FILTER|OBJECT|INSTRUME|TELESCOP|FOCALLEN|GAIN'
```

Keep output bounded and inspect several representative frames before assuming a
session is internally consistent.

## Calculating acquisition and integration

Count original LIGHT frames only. Never count:

- DARK, FLAT, BIAS, or DARKFLAT frames.
- Master calibration or master integration files.
- Registered, calibrated, normalized, debayered, or duplicated copies.
- JPEG renders paired with FITS timelapse sources.
- Test exposures, snapshots, or frames belonging to another target.

Group lights by:

- Target or `OBJECT`
- Session/night
- Exposure duration
- Filter
- Camera and optical system

For each unambiguous group:

```text
group integration = frame count × exposure seconds
total integration = sum of all group integrations
```

Example:

```text
Night 1: 24 × 300 s
Night 2: 31 × 300 s
Total: 55 × 300 s = 16,500 s = 4 h 35 min
```

If no accepted/rejected frame list exists, label the result **captured
integration**, not usable or final integration:

```ts
details: {
  acquisition: "Two nights · 55 × 300 s",
  integration: "4 h 35 min captured",
}
```

If different exposures or filters were used, preserve the grouping:

```ts
details: {
  acquisition: "120 × 3 s · 48 × 180 s",
  integration: "2 h 30 min captured",
}
```

Do not derive still-image integration from a timelapse video duration. If the
source frame sequence is unambiguous, it is acceptable to describe captured
source exposure while making clear that it is not stacked integration.

## Equipment rules

- Use exact embedded model names when available.
- A session-level equipment profile may fill missing headers only when the
  association to that session is explicit.
- Camera RAW files can establish camera and lens settings for their own
  sequence; they do not establish the equipment for nearby astronomy-format
  files.
- FITS/XISF files may come from different smart telescopes or imaging rigs.
  Distinguish them using `INSTRUME`, `TELESCOP`, focal length, sensor name, or
  an explicit sequence folder.
- Never add a filter based only on the colours of a processed image.

## Dates, locations, and ordering

`capturedAt` accepts:

```text
YYYY
YYYY-MM
YYYY-MM-DD
```

Use the precision supported by evidence. Do not turn an export timestamp into a
capture date. Dated items are displayed newest first; undated items remain
visible at the bottom under `Date unknown`.

Normalize public locations to a useful place name such as city, region, and
country. Do not publish exact coordinates, private addresses, server paths, or
unnecessary site details.

## Duplicate detection

Check byte-identical candidates first:

```bash
sha256sum "<candidate>" "<existing-source>"
```

Then compare normalized derivatives to catch equivalent exports:

```bash
magick "<candidate>" -auto-orient -resize 640x640\> "<temporary-a>.png"
magick "<existing>" -auto-orient -resize 640x640\> "<temporary-b>.png"
magick compare -metric PHASH "<temporary-a>.png" "<temporary-b>.png" null:
```

Treat perceptual distance as review evidence, not an automatic deletion rule.
Different sessions or processing versions of the same target may be intentional
progression pieces.

## Import workflow

1. Inventory the archive and current catalog.
2. Build a candidate report with source path, proposed slug, target, date,
   location, dimensions, confidence, and evidence.
3. Separate new works, metadata updates, duplicates, and ambiguous files.
4. Ask for clarification only for valuable ambiguous candidates. Never guess.
5. Add accepted source mappings to `scripts/process-media.mjs`, relative to
   `archiveDir`.
6. Add matching editorial entries to `content/media.ts`.
7. Run `pnpm media:build`.
8. Run exact and perceptual duplicate checks on generated 640px derivatives.
9. Run `pnpm lint` and `pnpm build`.
10. Review repository size and ensure no generated file exceeds hosting limits.

The pipeline validates all source paths before deleting old generated outputs.
Preserve this fail-fast behavior.

## Candidate report shape

Use this structure for substantial archive investigations:

```json
{
  "slug": "example-target-2025",
  "sourcePath": "<archive-root>/2025-01-01 Session/final.jpg",
  "kind": "image",
  "category": "Deep sky",
  "capturedAt": "2025-01-01",
  "location": "Region, Country",
  "confidence": "high",
  "evidence": [
    "Target and date are explicit in the session folder",
    "Filename marks this as the final export"
  ],
  "acquisition": {
    "groups": [
      {
        "frames": 30,
        "exposureSeconds": 180
      }
    ],
    "integrationLabel": "captured integration"
  }
}
```

Use `high`, `medium`, or `low` confidence. Import high-confidence candidates by
default, request review for medium-confidence candidates, and leave
low-confidence candidates untouched.
