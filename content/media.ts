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
  },
  {
    slug: "veil-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Eastern Veil Nebula",
    description:
      "Delicate filaments from the Cygnus Loop, the glowing remains of a massive star that exploded thousands of years ago.",
    alt: "The blue and red filaments of the Eastern Veil Nebula",
    details: {
      target: "NGC 6992 · Cygnus",
      acquisition: "Multiple nights · dual narrowband",
      location: "Home and Teruel, Spain",
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
  },
  {
    slug: "horsehead-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Horsehead Nebula",
    description:
      "Barnard 33 appears in silhouette against the glowing hydrogen of IC 434 in Orion.",
    alt: "The dark Horsehead Nebula against red emission nebulosity",
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
    details: {
      target: "IC 1805 · Cassiopeia",
      acquisition: "Multiple nights · dual narrowband",
      location: "Home",
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
  },
  {
    slug: "pleiades",
    kind: "image",
    category: "Deep sky",
    title: "The Pleiades",
    description:
      "The Seven Sisters shine through the blue reflection dust that surrounds this nearby open cluster.",
    alt: "The blue Pleiades star cluster and surrounding dust",
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
  },
  {
    slug: "dumbbell-nebula",
    kind: "image",
    category: "Deep sky",
    title: "Dumbbell Nebula",
    description:
      "One of the sky's brightest planetary nebulae: the expanding shell left behind by a dying star.",
    alt: "The Dumbbell Nebula in a dense star field",
    details: {
      target: "Messier 27 · Vulpecula",
      equipment: "Seestar S50",
      location: "Home",
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
  },
  {
    slug: "bodes-galaxy",
    kind: "image",
    category: "Deep sky",
    title: "Bode's Galaxy",
    description:
      "M81 and the Cigar Galaxy, two contrasting galaxies interacting in Ursa Major.",
    alt: "Bode's Galaxy and the Cigar Galaxy",
    details: {
      target: "Messier 81 & 82 · Ursa Major",
      location: "Near Olivella Observatory, Spain",
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
  },
  {
    slug: "ngc-6914",
    kind: "image",
    category: "Deep sky",
    title: "NGC 6914",
    description:
      "A layered complex of reflection, emission, and dark nebulae in the heart of Cygnus.",
    alt: "The blue and red nebulosity of NGC 6914",
    details: {
      target: "NGC 6914 · Cygnus",
      location: "Lleida, Spain",
    },
  },
  {
    slug: "milky-way-timelapse",
    kind: "video",
    category: "Motion",
    title: "Night in Motion",
    description:
      "A minute beneath the rotating sky, condensed into a vertical Milky Way timelapse.",
    alt: "A vertical timelapse of the Milky Way",
  },
  {
    slug: "galactic-arch",
    kind: "image",
    category: "Nightscapes",
    title: "Galactic Arch",
    description:
      "The Milky Way stretches from horizon to horizon in a wide nightscape.",
    alt: "The Milky Way forming an arch across the sky",
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
