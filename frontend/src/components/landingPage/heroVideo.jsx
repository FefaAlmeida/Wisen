"use client";
import { useEffect, useRef } from "react";

export default function HeroVideo() {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    function sync() {
      if (visible && !document.hidden && !motion.matches) video.play().catch(() => {});
      else video.pause();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      video.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);
  return (
    <video
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center brightness-105 contrast-105"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster="/globoWisen-v1.webp"
      tabIndex={-1}
      aria-hidden="true"
    >
      <source src="/globo-hero-v1.mp4" type="video/mp4" />
    </video>
  );
}
