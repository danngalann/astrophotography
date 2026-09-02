import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const portfolioDir = resolve(
  process.env.PORTFOLIO_ASTRO_DIR ?? join(root, "../portfolio/public/astro"),
);
const uploadDir = resolve(
  process.env.ASTRO_UPLOAD_DIR ?? "/run/media/daniel/ASTRODRIVE/to_upload",
);
const outputDir = join(root, "public/media");
const manifestPath = join(root, "content/generated-media.json");

const sources = [
  ["andromeda", "image", join(portfolioDir, "andromeda.jpg")],
  ["bodes-galaxy", "image", join(portfolioDir, "bode.jpg")],
  ["dumbbell-nebula", "image", join(portfolioDir, "dumbbell.jpg")],
  ["heart-nebula", "image", join(portfolioDir, "heart_nebula.jpg")],
  ["horsehead-nebula", "image", join(portfolioDir, "horsehead.jpg")],
  ["milky-way", "image", join(portfolioDir, "milky_way.jpg")],
  ["ngc-6914", "image", join(portfolioDir, "ngc6914.jpg")],
  ["pleiades", "image", join(portfolioDir, "pleiades.jpg")],
  ["silhouette", "image", join(portfolioDir, "silhouette.jpg")],
  ["veil-nebula", "image", join(portfolioDir, "veil_nebula.jpg")],
  ["galactic-arch", "image", join(uploadDir, "arch.jpg")],
  ["galactic-panorama", "image", join(uploadDir, "final_best_360.tif")],
  ["milky-way-portrait", "image", join(uploadDir, "Image31.jpg")],
  ["observatory-360", "video", join(uploadDir, "360_animation.mp4")],
  [
    "milky-way-foreground",
    "video",
    join(
      uploadDir,
      "Day_2_Milky_way_with_foreground_h264-420_Rec.709L_4KUHD_29.97_HQ.mp4",
    ),
  ],
  [
    "telescope-under-stars",
    "video",
    join(
      uploadDir,
      "Day_2_Telescope_h264-420_Rec.709L_4KUHD_29.97_HQ.mp4",
    ),
  ],
  [
    "milky-way-timelapse",
    "video",
    join(
      uploadDir,
      "MilkyWay_timelapse_sub_h264-420_Rec.709L_4KUHD_29.97_HQ_mb02.mp4",
    ),
  ],
];

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
      outputWidth <= 1080 ? "24" : "22",
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
