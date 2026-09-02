"use client";

/* eslint-disable @next/next/no-img-element -- pre-generated responsive assets avoid runtime image transforms */

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MediaCategory, MediaItem } from "@/content/media";

const PanoramaViewer = dynamic(() => import("./panorama-viewer"), {
  ssr: false,
  loading: () => <div className="panorama-status">Preparing 360° view…</div>,
});

const filters: Array<"All" | MediaCategory> = [
  "All",
  "Deep sky",
  "Nightscapes",
  "Motion",
];
type SortOrder = "latest" | "curated";

function imagePath(item: MediaItem, width: number) {
  return `/media/images/${item.slug}/${width}.webp`;
}

function imageSrcSet(item: MediaItem) {
  return item.widths
    .map((width) => `${imagePath(item, width)} ${width}w`)
    .join(", ");
}

function formatCapturedAt(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!month) return String(year);

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    ...(day ? { day: "numeric" as const } : {}),
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day ?? 1)));
}

function MediaPreview({ item }: { item: MediaItem }) {
  if (item.kind === "video") {
    return (
      <img
        src={`/media/videos/${item.slug}/poster.webp`}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={imagePath(item, item.widths[0])}
      srcSet={imageSrcSet(item)}
      sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 1100px) 50vw, 33vw"
      alt={item.alt}
      width={item.width}
      height={item.height}
      loading={item.featured ? "eager" : "lazy"}
      style={{
        backgroundImage: `url(/media/images/${item.slug}/blur.webp)`,
      }}
    />
  );
}

function DetailList({ item }: { item: MediaItem }) {
  const entries = [
    ["Captured", item.capturedAt && formatCapturedAt(item.capturedAt)],
    ["Target", item.details?.target],
    ["Acquisition", item.details?.acquisition],
    ["Integration", item.details?.integration],
    ["Equipment", item.details?.equipment],
    ["Location", item.details?.location],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (!entries.length) return null;

  return (
    <dl className="capture-details">
      {entries.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LightboxMedia({ item }: { item: MediaItem }) {
  if (item.kind === "panorama") {
    return (
      <PanoramaViewer
        src={imagePath(item, item.widths.at(-1) ?? item.widths[0])}
        alt={item.alt}
      />
    );
  }

  if (item.kind === "video") {
    return (
      <video
        className="lightbox-video"
        poster={`/media/videos/${item.slug}/poster.webp`}
        controls
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        {item.widths
          .slice()
          .reverse()
          .map((width) => (
            <source
              key={width}
              src={`/media/videos/${item.slug}/${width}.mp4`}
              type="video/mp4"
              media={width > 1080 ? "(min-width: 1600px)" : undefined}
            />
          ))}
        Your browser does not support embedded video.
      </video>
    );
  }

  return (
    <img
      className="lightbox-image"
      src={imagePath(item, item.widths.at(-1) ?? item.widths[0])}
      srcSet={imageSrcSet(item)}
      sizes="100vw"
      width={item.width}
      height={item.height}
      alt={item.alt}
    />
  );
}

function MediaDialog({
  item,
  onDismiss,
}: {
  item: MediaItem;
  onDismiss: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={item.title}
      onClose={onDismiss}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <button
        className="lightbox-close"
        type="button"
        onClick={close}
        aria-label="Close viewer"
        autoFocus
      >
        <span aria-hidden="true">×</span>
      </button>
      <div className="lightbox-layout">
        <div className="lightbox-stage">
          <LightboxMedia item={item} />
        </div>
        <aside className="lightbox-info">
          <span className="eyebrow">{item.category}</span>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <DetailList item={item} />
        </aside>
      </div>
    </dialog>
  );
}

export default function Gallery({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const visibleItems = useMemo(
    () => {
      const filtered =
        filter === "All"
        ? items
          : items.filter((item) => item.category === filter);
      if (sortOrder === "curated") return filtered;

      const curatedOrder = new Map(
        items.map((item, index) => [item.slug, index]),
      );
      return filtered.slice().sort((a, b) => {
        if (a.capturedAt && b.capturedAt) {
          return b.capturedAt.localeCompare(a.capturedAt);
        }
        if (a.capturedAt) return -1;
        if (b.capturedAt) return 1;
        return (
          (curatedOrder.get(a.slug) ?? 0) - (curatedOrder.get(b.slug) ?? 0)
        );
      });
    },
    [filter, items, sortOrder],
  );
  const selected = items.find((item) => item.slug === selectedSlug);

  return (
    <>
      <div className="gallery-controls">
        <div className="gallery-toolbar" aria-label="Filter gallery">
          {filters.map((option) => (
            <button
              type="button"
              key={option}
              className={option === filter ? "active" : undefined}
              onClick={() => setFilter(option)}
              aria-pressed={option === filter}
            >
              {option}
            </button>
          ))}
        </div>
        <label className="gallery-sort">
          <span>Order</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            <option value="latest">Latest first</option>
            <option value="curated">Curated</option>
          </select>
        </label>
      </div>

      <div className="gallery-grid">
        {visibleItems.map((item, index) => (
          <button
            className="gallery-card"
            type="button"
            key={item.slug}
            onClick={() => setSelectedSlug(item.slug)}
            style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
            aria-label={`Open ${item.title}`}
          >
            <MediaPreview item={item} />
            <span className="card-shade" />
            <span className="card-copy">
              <span className="card-category">
                {item.category}
                {item.capturedAt && ` · ${item.capturedAt.slice(0, 4)}`}
              </span>
              <strong>{item.title}</strong>
            </span>
            {item.kind !== "image" && (
              <span className="media-badge">
                {item.kind === "panorama" ? "360°" : "Play"}
              </span>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <MediaDialog
          item={selected}
          onDismiss={() => setSelectedSlug(null)}
        />
      )}
    </>
  );
}
