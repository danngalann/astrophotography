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

function imagePath(item: MediaItem, width: number) {
  return `/media/images/${item.slug}/${width}.webp`;
}

function imageSrcSet(item: MediaItem) {
  return item.widths
    .map((width) => `${imagePath(item, width)} ${width}w`)
    .join(", ");
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
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const visibleItems = useMemo(
    () =>
      filter === "All"
        ? items
        : items.filter((item) => item.category === filter),
    [filter, items],
  );
  const selected = items.find((item) => item.slug === selectedSlug);

  return (
    <>
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
              <span className="card-category">{item.category}</span>
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
