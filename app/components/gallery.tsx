"use client";

/* eslint-disable @next/next/no-img-element -- pre-generated responsive assets avoid runtime image transforms */

import dynamic from "next/dynamic";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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

function VideoPreview({ item }: { item: MediaItem }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !posterReady) return;

    const desktop = window.matchMedia(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    );
    let observer: IntersectionObserver | undefined;

    const observeWhenEligible = () => {
      observer?.disconnect();
      observer = undefined;
      if (!desktop.matches) {
        setLoadVideo(false);
        setNearViewport(false);
        setPlaying(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setNearViewport(entry.isIntersecting);
          setLoadVideo(entry.isIntersecting);
        },
        { rootMargin: "300px 0px" },
      );
      observer.observe(container);
    };

    observeWhenEligible();
    desktop.addEventListener("change", observeWhenEligible);
    return () => {
      observer?.disconnect();
      desktop.removeEventListener("change", observeWhenEligible);
    };
  }, [posterReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!nearViewport) {
      video.pause();
      return;
    }
    void video.play().catch(() => setPlaying(false));
  }, [loadVideo, nearViewport]);

  return (
    <span className="media-preview" ref={containerRef}>
      <img
        src={`/media/videos/${item.slug}/poster.webp`}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
        onLoad={() => setPosterReady(true)}
      />
      {loadVideo && (
        <video
          ref={videoRef}
          className={playing ? "preview-video playing" : "preview-video"}
          src={`/media/videos/${item.slug}/1080.mp4`}
          width={item.width}
          height={item.height}
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
    </span>
  );
}

function MediaPreview({ item }: { item: MediaItem }) {
  if (item.kind === "video") {
    return <VideoPreview item={item} />;
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
        width={item.width}
        height={item.height}
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
      <div
        className={
          item.width < item.height && item.kind !== "panorama"
            ? "lightbox-layout lightbox-layout-portrait"
            : "lightbox-layout"
        }
      >
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
    () => {
      const filtered =
        filter === "All"
        ? items
        : items.filter((item) => item.category === filter);
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
          <Fragment key={item.slug}>
            {(index === 0 ||
              item.capturedAt?.slice(0, 4) !==
                visibleItems[index - 1].capturedAt?.slice(0, 4)) && (
              <div className="year-marker">
                <span>
                  {item.capturedAt?.slice(0, 4) ?? "Date unknown"}
                </span>
              </div>
            )}
            <button
              className="gallery-card"
              type="button"
              onClick={() => setSelectedSlug(item.slug)}
              style={{
                animationDelay: `${Math.min(index * 45, 450)}ms`,
                aspectRatio: `${item.width} / ${item.height}`,
                flexBasis: `${Math.round((item.width / item.height) * 400)}px`,
                flexGrow: item.width / item.height,
              }}
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
          </Fragment>
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
