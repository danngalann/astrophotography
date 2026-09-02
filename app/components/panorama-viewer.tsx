"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface PanoramaViewerProps {
  src: string;
  alt: string;
}

export default function PanoramaViewer({ src, alt }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1100);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    const geometry = new THREE.SphereGeometry(500, 64, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    const view = { longitude: 0, latitude: 5, fov: 70 };
    let disposed = false;
    let pointer: { x: number; y: number; longitude: number; latitude: number } | null =
      null;

    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", alt);
    renderer.domElement.setAttribute("role", "application");
    renderer.domElement.setAttribute("tabindex", "0");
    renderer.domElement.setAttribute(
      "aria-description",
      "Use arrow keys to look around, plus and minus to zoom, and Home to reset.",
    );

    const render = () => {
      const phi = THREE.MathUtils.degToRad(90 - view.latitude);
      const theta = THREE.MathUtils.degToRad(view.longitude);
      camera.fov = view.fov;
      camera.updateProjectionMatrix();
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      );
      renderer.render(scene, camera);
    };

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(clientWidth, clientHeight, false);
      render();
    };

    scene.add(sphere);
    new THREE.TextureLoader().load(
      src,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        material.map = texture;
        material.needsUpdate = true;
        setStatus("ready");
        render();
      },
      undefined,
      () => {
        if (!disposed) setStatus("error");
      },
    );

    const onPointerDown = (event: PointerEvent) => {
      renderer.domElement.setPointerCapture(event.pointerId);
      pointer = {
        x: event.clientX,
        y: event.clientY,
        longitude: view.longitude,
        latitude: view.latitude,
      };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer) return;
      view.longitude = pointer.longitude + (pointer.x - event.clientX) * 0.12;
      view.latitude = THREE.MathUtils.clamp(
        pointer.latitude + (event.clientY - pointer.y) * 0.12,
        -85,
        85,
      );
      render();
    };
    const onPointerUp = () => {
      pointer = null;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      view.fov = THREE.MathUtils.clamp(view.fov + event.deltaY * 0.04, 30, 90);
      render();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const commands: Record<string, () => void> = {
        ArrowLeft: () => (view.longitude -= 5),
        ArrowRight: () => (view.longitude += 5),
        ArrowUp: () => (view.latitude = Math.min(view.latitude + 5, 85)),
        ArrowDown: () => (view.latitude = Math.max(view.latitude - 5, -85)),
        "+": () => (view.fov = Math.max(view.fov - 5, 30)),
        "=": () => (view.fov = Math.max(view.fov - 5, 30)),
        "-": () => (view.fov = Math.min(view.fov + 5, 90)),
        Home: () => {
          view.longitude = 0;
          view.latitude = 5;
          view.fov = 70;
        },
      };
      const command = commands[event.key];
      if (!command) return;
      event.preventDefault();
      command();
      render();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("keydown", onKeyDown);
    resize();

    return () => {
      disposed = true;
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("keydown", onKeyDown);
      material.map?.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [alt, src]);

  const enterFullscreen = () => {
    void containerRef.current?.requestFullscreen();
  };

  return (
    <div className="panorama" ref={containerRef}>
      {status === "loading" && (
        <div className="panorama-status">Loading 360° view…</div>
      )}
      {status === "error" && (
        <div className="panorama-status">The 360° view could not be loaded.</div>
      )}
      <div className="panorama-hint" aria-hidden="true">
        Drag to explore · Scroll to zoom
      </div>
      <button
        className="panorama-fullscreen"
        type="button"
        onClick={enterFullscreen}
        aria-label="View panorama in fullscreen"
      >
        Fullscreen
      </button>
    </div>
  );
}
