import generatedMedia from "./generated-media.json";

export type MediaCategory = "Deep sky" | "Nightscapes" | "Motion";
export type MediaKind = "image" | "video" | "panorama";

export interface CaptureDetails {
  target?: string;
  acquisition?: string;
  integration?: string;
  equipment?: string;
  location?: string;
}

export interface MediaItem {
  slug: string;
  kind: MediaKind;
  category: MediaCategory;
  title: string;
  description: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
  duration?: number;
  featured?: boolean;
  capturedAt?: string;
  details?: CaptureDetails;
}

type EditorialItem = Omit<
  MediaItem,
  "width" | "height" | "widths" | "duration"
>;

const editorial: EditorialItem[] = [
  {
    slug: "galactic-panorama",
    kind: "panorama",
    category: "Nightscapes",
    title: "Under the Milky Way",
    description:
      "An immersive 360-degree panorama beneath the galactic core. Drag to look around, scroll to zoom, or enter fullscreen.",
    alt: "A 360-degree night-sky panorama beneath the Milky Way",
    featured: true,
    capturedAt: "2026-08-13",
    details: {
      equipment: "Insta360 X4",
      location: "Teruel, Spain",
    },
  },
  {
    slug: "veil-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Eastern Veil Nebula",
    description:
      "Delicate filaments from the Cygnus Loop, the glowing remains of a massive star that exploded thousands of years ago.",
    alt: "The blue and red filaments of the Eastern Veil Nebula",
    capturedAt: "2026-06-12",
    details: {
      target: "NGC 6992 · Cygnus",
      acquisition: "Three nights · 113 × 180 s",
      integration: "5 h 39 min captured",
      equipment: "Poseidon-C PRO · 71f · 490 mm",
      location: "Olivella and Teruel, Spain",
    },
  },
  {
    slug: "andromeda",
    kind: "image",
    category: "Deep sky",
    title: "Andromeda Galaxy",
    description:
      "Our nearest large galactic neighbour, captured over two nights while waiting for Orion to rise into position.",
    alt: "The Andromeda Galaxy surrounded by a dense star field",
    capturedAt: "2025-01-31",
    details: {
      target: "Messier 31 · Andromeda",
      acquisition: "Two nights",
      location: "Near Olivella Observatory, Spain",
    },
  },
  {
    slug: "milky-way-foreground",
    kind: "video",
    category: "Motion",
    title: "Milky Way Rising",
    description:
      "A short vertical study of the Milky Way emerging over the landscape.",
    alt: "The Milky Way rising above a dark foreground",
    capturedAt: "2026-08-12",
    details: {
      equipment: "Canon EOS RP · EF 50 mm f/1.8 STM",
      location: "Teruel, Spain",
    },
  },
  {
    slug: "horsehead-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Horsehead Nebula",
    description:
      "Barnard 33 appears in silhouette against the glowing hydrogen of IC 434 in Orion.",
    alt: "The dark Horsehead Nebula against red emission nebulosity",
    capturedAt: "2025-01-31",
    details: {
      target: "Barnard 33 · Orion",
      acquisition: "Two nights",
      location: "Near Olivella Observatory, Spain",
    },
  },
  {
    slug: "milky-way",
    kind: "image",
    category: "Nightscapes",
    title: "Galactic Core",
    description:
      "The textured centre of our galaxy photographed from a dark mountain sky.",
    alt: "The bright core of the Milky Way in a dark sky",
    capturedAt: "2024-08-03",
    details: { location: "Montseny, Spain" },
  },
  {
    slug: "heart-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Heart Nebula",
    description:
      "IC 1805 is a vast star-forming region, rendered through narrowband light from a light-polluted sky.",
    alt: "The red Heart Nebula surrounded by stars",
    capturedAt: "2025-11-25",
    details: {
      target: "IC 1805 · Cassiopeia",
      acquisition: "Two nights · 67 × 300 s",
      integration: "5 h 35 min captured",
      equipment: "Poseidon-C PRO · 71f · 490 mm",
      location: "Granollers, Spain",
    },
  },
  {
    slug: "telescope-under-stars",
    kind: "video",
    category: "Motion",
    title: "A Night in the Field",
    description:
      "The telescope at work beneath a clear, star-filled sky.",
    alt: "A telescope operating under the stars",
    capturedAt: "2026-08-13",
    details: {
      equipment: "Canon EOS RP · EF 50 mm f/1.8 STM",
      location: "Teruel, Spain",
    },
  },
  {
    slug: "pleiades",
    kind: "image",
    category: "Deep sky",
    title: "The Pleiades",
    description:
      "The Seven Sisters shine through the blue reflection dust that surrounds this nearby open cluster.",
    alt: "The blue Pleiades star cluster and surrounding dust",
    capturedAt: "2025-01-24",
    details: {
      target: "Messier 45 · Taurus",
      location: "Near Olivella Observatory, Spain",
    },
  },
  {
    slug: "milky-way-portrait",
    kind: "image",
    category: "Nightscapes",
    title: "Across the Night",
    description:
      "A portrait-oriented view into the luminous structure of the summer Milky Way.",
    alt: "A vertical view of the Milky Way",
    capturedAt: "2026-08-13",
    details: {
      equipment: "Canon EOS RP · EF 50 mm f/1.8 STM",
      location: "Teruel, Spain",
    },
  },
  {
    slug: "dumbbell-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Dumbbell Nebula",
    description:
      "One of the sky's brightest planetary nebulae: the expanding shell left behind by a dying star.",
    alt: "The Dumbbell Nebula in a dense star field",
    capturedAt: "2025-08-05",
    details: {
      target: "Messier 27 · Vulpecula",
      equipment: "Seestar S50",
      location: "Granollers, Spain",
    },
  },
  {
    slug: "observatory-360",
    kind: "video",
    category: "Motion",
    title: "Orbit",
    description:
      "A rotating night-sky sequence that circles the observing setup.",
    alt: "A rotating view around an astrophotography setup",
    capturedAt: "2026-08-13",
    details: { location: "Teruel, Spain" },
  },
  {
    slug: "bodes-galaxy",
    kind: "image",
    category: "Deep sky",
    title: "Bode's Galaxy",
    description:
      "M81 and the Cigar Galaxy, two contrasting galaxies interacting in Ursa Major.",
    alt: "Bode's Galaxy and the Cigar Galaxy",
    capturedAt: "2025-03-29",
    details: {
      target: "Messier 81 & 82 · Ursa Major",
      location: "Casa Leo, Spain",
    },
  },
  {
    slug: "silhouette",
    kind: "image",
    category: "Nightscapes",
    title: "Stargazer",
    description:
      "A quiet human silhouette set against the scale and colour of the night sky.",
    alt: "A silhouetted stargazer beneath the Milky Way",
    capturedAt: "2024-05-11",
    details: { location: "Turó del Home, Montseny, Spain" },
  },
  {
    slug: "ngc-6914",
    kind: "image",
    category: "Deep sky",
    title: "NGC 6914",
    description:
      "A layered complex of reflection, emission, and dark nebulae in the heart of Cygnus.",
    alt: "The blue and red nebulosity of NGC 6914",
    capturedAt: "2025-08-23",
    details: {
      target: "NGC 6914 · Cygnus",
      location: "Castellar, Spain",
    },
  },
  {
    slug: "milky-way-timelapse",
    kind: "video",
    category: "Motion",
    title: "Telescope Under the Milky Way",
    description:
      "The telescope tracks through the night beneath the rising Milky Way in this vertical timelapse.",
    alt: "A telescope tracking beneath the Milky Way in a vertical timelapse",
    capturedAt: "2026-03-21",
    details: {
      acquisition: "1796 × 10 s source frames",
      integration: "4 h 59 min 20 s captured source exposure",
      equipment: "Seestar S30 Pro wide camera · imx586",
      location: "Olivella, Spain",
    },
  },
  {
    slug: "galactic-arch",
    kind: "image",
    category: "Nightscapes",
    title: "Galactic Arch",
    description:
      "The Milky Way stretches from horizon to horizon in a wide nightscape.",
    alt: "The Milky Way forming an arch across the sky",
    capturedAt: "2026-08-13",
    details: {
      equipment: "Insta360 X4",
      location: "Teruel, Spain",
    },
  },
  {
    slug: "triangulum-galaxy-2024",
    kind: "image",
    category: "Deep sky",
    title: "Triangulum Galaxy",
    description:
      "Messier 33 reveals its loose spiral structure and scattered star-forming regions.",
    alt: "The Triangulum Galaxy surrounded by stars",
    capturedAt: "2024-09-15",
    details: {
      target: "Messier 33 · Triangulum",
      acquisition: "43 × 90 s",
      integration: "1 h 04 min 30 s captured",
      equipment: "Uranus-C PRO · 71f · 490 mm",
      location: "Granollers, Spain",
    },
  },
  {
    slug: "fish-head-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Fish Head Nebula",
    description:
      "A bright ridge of ionised gas and dark dust at the edge of the Heart Nebula complex.",
    alt: "The glowing Fish Head Nebula and surrounding dark dust",
    capturedAt: "2024-09-15",
    details: { target: "IC 1795 / NGC 896 region" },
  },
  {
    slug: "orion-nebula-2024",
    kind: "image",
    category: "Deep sky",
    title: "Orion Nebula",
    description:
      "The luminous core of Messier 42 and the Running Man region set against Orion's molecular clouds.",
    alt: "The Orion Nebula and Running Man Nebula",
    capturedAt: "2024-11-29",
    details: { target: "Messier 42 · Orion" },
  },
  {
    slug: "pinwheel-galaxy",
    kind: "image",
    category: "Deep sky",
    title: "Pinwheel Galaxy",
    description:
      "A face-on view of Messier 101, with asymmetric spiral arms shaped by its galactic neighbours.",
    alt: "The face-on Pinwheel Galaxy in a star field",
    capturedAt: "2025-03-29",
    details: {
      target: "Messier 101 · Ursa Major",
      location: "Casa Leo, Spain",
    },
  },
  {
    slug: "elephants-trunk-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Elephant's Trunk Nebula",
    description:
      "A dense column of gas and dust winding through the wider IC 1396 emission region.",
    alt: "The Elephant's Trunk Nebula in glowing hydrogen gas",
    capturedAt: "2025-06-28",
    details: {
      target: "IC 1396A · Cepheus",
      location: "Castelltallat, Spain",
    },
  },
  {
    slug: "crescent-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Crescent Nebula",
    description:
      "A shell of energised gas driven outward by the powerful Wolf-Rayet star at its centre.",
    alt: "The Crescent Nebula against a dense Cygnus star field",
    capturedAt: "2025-07-13",
    details: {
      target: "NGC 6888 · Cygnus",
      location: "Granollers, Spain",
    },
  },
  {
    slug: "wizard-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Wizard Nebula",
    description:
      "Sculpted pillars and glowing gas surround the young open cluster NGC 7380.",
    alt: "The Wizard Nebula rendered in narrowband colour",
    capturedAt: "2025-07-13",
    details: {
      target: "NGC 7380 · Cepheus",
      location: "Granollers, Spain",
    },
  },
  {
    slug: "pacman-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Pacman Nebula",
    description:
      "Dark dust cuts into the bright emission of NGC 281, giving the nebula its familiar shape.",
    alt: "The Pacman Nebula surrounded by stars",
    capturedAt: "2025-09-26",
    details: {
      target: "NGC 281 · Cassiopeia",
      location: "Castellar, Spain",
    },
  },
  {
    slug: "orion-nebula-hdr",
    kind: "image",
    category: "Deep sky",
    title: "Orion Nebula HDR",
    description:
      "Short and long exposures preserve the brilliant Trapezium while reaching into Orion's faint outer clouds.",
    alt: "A high dynamic range view of the Orion and Running Man nebulae",
    capturedAt: "2026-02-21",
    details: {
      target: "Messier 42 and Running Man · Orion",
      acquisition: "200 × 3 s · 106 × 90 s",
      integration: "2 h 49 min captured",
      equipment: "Poseidon-C PRO · 71f · 490 mm",
      location: "Olivella, Spain",
    },
  },
  {
    slug: "first-galactic-core",
    kind: "image",
    category: "Nightscapes",
    title: "First Galactic Core",
    description:
      "My first astrophotograph: an early wide-field experiment that unexpectedly captured the galactic core.",
    alt: "An early wide-field photograph of the Milky Way's galactic core",
    capturedAt: "2023-08-12",
    details: {
      target: "Milky Way · Galactic core",
      location: "Garraf, Spain",
    },
  },
  {
    slug: "milky-way-2023-reprocess",
    kind: "image",
    category: "Nightscapes",
    title: "Milky Way Reprocessed",
    description:
      "An early Milky Way data set revisited in PixInsight for more controlled colour and contrast.",
    alt: "A portrait view of the Milky Way reprocessed in PixInsight",
    capturedAt: "2023-08-14",
    details: { target: "Milky Way · Galactic core" },
  },
  {
    slug: "milky-way-and-trees",
    kind: "image",
    category: "Nightscapes",
    title: "Milky Way and Trees",
    description:
      "A wide-angle view of the galactic core rising above a dark tree line.",
    alt: "The Milky Way's galactic core above silhouetted trees",
    capturedAt: "2023-08-14",
    details: {
      target: "Milky Way · Galactic core",
      equipment: "Canon EOS 1300D · EF-S 18–55 mm",
    },
  },
  {
    slug: "touching-the-sky",
    kind: "image",
    category: "Nightscapes",
    title: "Touching the Sky",
    description:
      "A silhouette reaches into the star field from the summit of Turó del Home.",
    alt: "A person silhouetted while reaching toward the stars",
    capturedAt: "2023-10-12",
    details: { location: "Turó del Home, Montseny, Spain" },
  },
  {
    slug: "wide-field-andromeda",
    kind: "image",
    category: "Nightscapes",
    title: "Andromeda, Wide Field",
    description:
      "The Andromeda Galaxy appears as a small point of light in a wide field captured with a camera lens.",
    alt: "A wide star field containing the distant Andromeda Galaxy",
    capturedAt: "2023-10-12",
    details: {
      target: "Messier 31 · Andromeda",
      equipment: "Camera lens · no telescope",
      location: "Turó del Home, Montseny, Spain",
    },
  },
  {
    slug: "pinwheel-galaxy-2024",
    kind: "image",
    category: "Deep sky",
    title: "Pinwheel Galaxy, First Attempt",
    description:
      "An early capture of Messier 101, beginning to resolve the galaxy's face-on spiral structure.",
    alt: "An early image of the Pinwheel Galaxy",
    capturedAt: "2024-07-26",
    details: {
      target: "Messier 101 · Ursa Major",
      location: "Casa Leo, Spain",
    },
  },
  {
    slug: "full-veil-nebula-2024",
    kind: "image",
    category: "Deep sky",
    title: "The Veil, Wide Field",
    description:
      "An early full-field view of the Cygnus Loop captured with a Canon EOS RP, retaining the strong vignetting of the original data.",
    alt: "A wide-field image of the complete Veil Nebula",
    capturedAt: "2024-08-09",
    details: {
      target: "Cygnus Loop · Cygnus",
      equipment: "Canon EOS RP",
      location: "Pujalt, Spain",
    },
  },
  {
    slug: "scope-tracking-timelapse",
    kind: "video",
    category: "Motion",
    title: "Tracking the Night",
    description:
      "A telescope follows the sky while the stars move steadily overhead.",
    alt: "A telescope tracking beneath moving stars",
    capturedAt: "2024-09-27",
  },
  {
    slug: "moon-through-clouds",
    kind: "video",
    category: "Motion",
    title: "Moon Through Clouds",
    description:
      "Moonlight shifts through passing layers of cloud in a vertical study.",
    alt: "The Moon moving behind passing clouds",
    details: { target: "Moon" },
    capturedAt: "2025-11-22",
  },
  {
    slug: "solar-eclipse-timelapse-teruel",
    kind: "video",
    category: "Motion",
    title: "Solar Eclipse Timelapse",
    description:
      "The Moon crosses the solar disc during the partial phase of the 2026 eclipse.",
    alt: "A partial solar eclipse progressing across the Sun",
    capturedAt: "2026-08-12",
    details: {
      target: "Partial solar eclipse",
      equipment: "Seestar S50",
      location: "Teruel, Spain",
    },
  },
];

const generatedBySlug = new Map(
  generatedMedia.map((item) => [item.slug, item]),
);

export const mediaItems: MediaItem[] = editorial.map((item) => {
  const generated = generatedBySlug.get(item.slug);
  if (!generated) {
    throw new Error(`Missing generated media for "${item.slug}"`);
  }
  if (
    item.capturedAt &&
    !/^\d{4}(?:-\d{2}){0,2}$/.test(item.capturedAt)
  ) {
    throw new Error(
      `Invalid capturedAt date for "${item.slug}": use YYYY, YYYY-MM, or YYYY-MM-DD`,
    );
  }

  return {
    ...item,
    width: generated.width,
    height: generated.height,
    widths: generated.widths,
    duration: "duration" in generated ? generated.duration : undefined,
  };
});
