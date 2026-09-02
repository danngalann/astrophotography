import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const archiveDir = resolve(
  process.env.ASTRO_ARCHIVE_DIR ?? join(root, "media-originals"),
);
const outputDir = join(root, "public/media");
const manifestPath = join(root, "content/generated-media.json");

const sources = [
  [
    "andromeda",
    "image",
    join(
      archiveDir,
      "2025-01-31 Olivella - Horsehead and Andromeda/master/andromeda_2025_1_31.jpg",
    ),
  ],
  [
    "bodes-galaxy",
    "image",
    join(
      archiveDir,
      "2025-03-29 Casa Leo - Pinwheel and Bode/bode_wbpp/master/bode_new.jpg",
    ),
  ],
  [
    "dumbbell-nebula",
    "image",
    join(archiveDir, "2025-08-05 Granollers - dumbbell/dumbbell.jpg"),
  ],
  [
    "heart-nebula",
    "image",
    join(
      archiveDir,
      "2025-11-25 - Granollers - Heart Nebula/heart_nebula_RGB.jpg",
    ),
  ],
  [
    "horsehead-nebula",
    "image",
    join(
      archiveDir,
      "2025-01-31 Olivella - Horsehead and Andromeda/master/Image18_flipped.jpg",
    ),
  ],
  [
    "milky-way",
    "image",
    join(archiveDir, "2024-08-3 Montseny/south/integration_DBE.jpg"),
  ],
  [
    "ngc-6914",
    "image",
    join(
      archiveDir,
      "2025-08-23 Castellar - Veil and NGC6914/NCG6914/wbpp/master/ncg6914.jpg",
    ),
  ],
  [
    "pleiades",
    "image",
    join(
      archiveDir,
      "2025-01-24 Olivella - Horsehead and Pleiades/plaiades.jpg",
    ),
  ],
  [
    "silhouette",
    "image",
    join(
      archiveDir,
      "2024-05-11 Turó del Home Alison y Emma/edited/healed/24.jpg",
    ),
  ],
  [
    "veil-nebula",
    "image",
    join(archiveDir, "2026-06-12 - Olivella - Veil Nebula/veil.jpg"),
  ],
  ["galactic-arch", "image", join(archiveDir, "Teruel/arch.jpg")],
  [
    "galactic-panorama",
    "image",
    join(archiveDir, "Teruel/final_best_360.jpg"),
  ],
  [
    "milky-way-portrait",
    "image",
    join(archiveDir, "Teruel/Canon/Day 2 Milky way/finals/Image31.jpg"),
  ],
  ["observatory-360", "video", join(archiveDir, "Teruel/360_animation.mp4")],
  [
    "milky-way-foreground",
    "video",
    join(
      archiveDir,
      "Teruel/Day_2_Milky_way_with_foreground_h264-420_Rec.709L_4KUHD_29.97_HQ.mp4",
    ),
  ],
  [
    "telescope-under-stars",
    "video",
    join(
      archiveDir,
      "Teruel/Canon/Day 2 Telescope/Day_2_Telescope_h264-420_Rec.709L_4KUHD_29.97_HQ.mp4",
    ),
  ],
  [
    "milky-way-timelapse",
    "video",
    join(
      archiveDir,
      "2026-03-21 - Olivella - Timelapse/MilkyWay_timelapse_sub_h264-420_Rec.709L_4KUHD_29.97_HQ_mb02.mp4",
    ),
  ],
  [
    "triangulum-galaxy-2024",
    "image",
    join(archiveDir, "2024-09-15 Triangulum Galaxy/master/FINAL.jpg"),
  ],
  [
    "fish-head-nebula",
    "image",
    join(archiveDir, "2024-09-15 Fish Head Nebula/master/FINAL.jpg"),
  ],
  [
    "orion-nebula-2024",
    "image",
    join(archiveDir, "2024-11-29 Orion & Pleiades/final_cropped.jpg"),
  ],
  [
    "pinwheel-galaxy",
    "image",
    join(
      archiveDir,
      "2025-03-29 Casa Leo - Pinwheel and Bode/pinwheel_wbpp/master/final.jpg",
    ),
  ],
  [
    "elephants-trunk-nebula",
    "image",
    join(
      archiveDir,
      "2025-06-28 - Castelltallat - Veil and Trunk/IC 1396A_sub/master/final.jpg",
    ),
  ],
  [
    "crescent-nebula",
    "image",
    join(
      archiveDir,
      "2025-07-13 Granollers - Crescent & Wizard/NGC 6888_sub/final.jpg",
    ),
  ],
  [
    "wizard-nebula",
    "image",
    join(
      archiveDir,
      "2025-07-13 Granollers - Crescent & Wizard/NGC 7380_sub/final_hoo_nbstars.jpg",
    ),
  ],
  [
    "pacman-nebula",
    "image",
    join(
      archiveDir,
      "2025-09-26 - Castellar - Pacman/NGC 281W_sub/wbpp/master/NGC_281.jpg",
    ),
  ],
  [
    "orion-nebula-hdr",
    "image",
    join(
      archiveDir,
      "2026-02-21 - Olivella - Orion and M44/Image20_resample_flipped.jpg",
    ),
  ],
  [
    "first-galactic-core",
    "image",
    join(
      archiveDir,
      "2023-08-12 Garraf 1a vez/edited/1_merge4.png",
    ),
  ],
  [
    "milky-way-2023-reprocess",
    "image",
    join(
      archiveDir,
      "2023-08-14/edits/integration_DBE.jpg",
    ),
  ],
  [
    "milky-way-and-trees",
    "image",
    join(archiveDir, "2023-08-14/edits/4.jpg"),
  ],
  [
    "touching-the-sky",
    "image",
    join(
      archiveDir,
      "2023-10-12 Turó del home/Edits/Siluetas/daniel_touching_sky.png",
    ),
  ],
  [
    "wide-field-andromeda",
    "image",
    join(
      archiveDir,
      "2023-10-12 Turó del home/Edits/Andrómeda/integration_DBE.jpg",
    ),
  ],
  [
    "pinwheel-galaxy-2024",
    "image",
    join(archiveDir, "2024-07-26 Casa Leo/processed-DeNoiseAI-standard.jpg"),
  ],
  [
    "full-veil-nebula-2024",
    "image",
    join(archiveDir, "2024-08-9 Pujalt/final.jpg"),
  ],
  [
    "horsehead-first-session",
    "image",
    join(
      archiveDir,
      "2025-01-24 Olivella - Horsehead and Pleiades/StarReduced.jpg",
    ),
  ],
  [
    "scope-tracking-timelapse",
    "video",
    join(
      archiveDir,
      "2024-09-27 Wizard Nebula (to edit)/Timelapses/scope_timelapse.mp4",
    ),
  ],
  [
    "moon-through-clouds",
    "video",
    join(archiveDir, "moon with clouds.mp4"),
  ],
  [
    "solar-eclipse-timelapse-teruel",
    "video",
    join(archiveDir, "Teruel/S50/2026-08-12-202013-Solar-timelapse.mp4"),
  ],
];

const missingSources = sources
  .map(([, , source]) => source)
  .filter((source) => !existsSync(source));
if (missingSources.length) {
  throw new Error(
    `Missing ${missingSources.length} media source(s):\n${missingSources.join("\n")}`,
  );
}

function run(command, args) {
  console.log(`  ${command} ${args.at(-1)}`);
  execFileSync(command, args, { stdio: "inherit" });
}

function identify(path) {
  const [width, height] = execFileSync("magick", [
    "identify",
    "-format",
    "%w %h",
    `${path}[0]`,
  ])
    .toString()
    .trim()
    .split(" ")
    .map(Number);
  return { width, height };
}

function processImage(slug, source) {
  const targetDir = join(outputDir, "images", slug);
  mkdirSync(targetDir, { recursive: true });
  const dimensions = identify(source);
  const widths = [640, 1280, 2048, 3840].filter(
    (width, index, values) =>
      width < dimensions.width ||
      (index === 0 || values[index - 1] < dimensions.width),
  );

  for (const width of widths) {
    const outputWidth = Math.min(width, dimensions.width);
    run("magick", [
      `${source}[0]`,
      "-auto-orient",
      "-strip",
      "-colorspace",
      "sRGB",
      "-resize",
      `${outputWidth}x>`,
      "-define",
      "webp:method=6",
      "-quality",
      outputWidth <= 1280 ? "80" : "86",
      join(targetDir, `${outputWidth}.webp`),
    ]);
  }

  run("magick", [
    `${source}[0]`,
    "-auto-orient",
    "-strip",
    "-resize",
    "40x40>",
    "-blur",
    "0x2",
    "-quality",
    "35",
    join(targetDir, "blur.webp"),
  ]);

  return {
    slug,
    kind: "image",
    width: dimensions.width,
    height: dimensions.height,
    widths: widths.map((width) => Math.min(width, dimensions.width)),
  };
}

function probeVideo(path) {
  return JSON.parse(
    execFileSync("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height:format=duration",
      "-of",
      "json",
      path,
    ]).toString(),
  );
}

function processVideo(slug, source) {
  const targetDir = join(outputDir, "videos", slug);
  mkdirSync(targetDir, { recursive: true });
  const probe = probeVideo(source);
  const stream = probe.streams[0];
  const widths = [1080, 1440].filter(
    (width, index) => width < stream.width || index === 0,
  );

  for (const width of widths) {
    const outputWidth = Math.min(width, stream.width);
    run("ffmpeg", [
      "-y",
      "-i",
      source,
      "-map",
      "0:v:0",
      "-vf",
      `scale='min(${outputWidth},iw)':-2`,
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      outputWidth <= 1080 ? "24" : "25",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      join(targetDir, `${outputWidth}.mp4`),
    ]);
  }

  run("ffmpeg", [
    "-y",
    "-ss",
    "00:00:01",
    "-i",
    source,
    "-frames:v",
    "1",
    "-vf",
    "scale='min(1280,iw)':-2",
    "-c:v",
    "libwebp",
    "-quality",
    "82",
    join(targetDir, "poster.webp"),
  ]);

  return {
    slug,
    kind: "video",
    width: stream.width,
    height: stream.height,
    duration: Number(probe.format.duration),
    widths: widths.map((width) => Math.min(width, stream.width)),
  };
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(dirname(manifestPath), { recursive: true });

const manifest = sources.map(([slug, kind, source]) => {
  console.log(`Processing ${slug}`);
  return kind === "image"
    ? processImage(slug, source)
    : processVideo(slug, source);
});

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${manifestPath}`);
