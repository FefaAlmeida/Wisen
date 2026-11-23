"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./heroVideo.module.css";

export default function HeroVideo() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const motionRef = useRef(null);
  const [hasFrame, setHasFrame] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let frameRequest;
    function sync() {
      const shouldPlay = visible && !document.hidden && !motion.matches;
      motionRef.current.style.animationPlayState = shouldPlay ? "running" : "paused";
      if (shouldPlay) {
        // Set the DOM properties before play() as well as the JSX attributes:
        // browsers require muted inline playback for background autoplay.
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.play().catch(() => {
          if (video.paused) setHasFrame(false);
        });
      } else {
        video.pause();
      }
    }
    function onPlaying() {
      if (video.requestVideoFrameCallback) {
        if (frameRequest !== undefined) video.cancelVideoFrameCallback(frameRequest);
        frameRequest = video.requestVideoFrameCallback(() => setHasFrame(true));
      } else if (video.readyState >= 2) {
        setHasFrame(true);
      }
    }
    function showFallback() {
      setHasFrame(false);
    }
    function retryPlayback() {
      if (video.paused) sync();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(containerRef.current);
    video.addEventListener("canplay", sync);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", showFallback);
    video.addEventListener("error", showFallback);
    window.addEventListener("pageshow", sync);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("pointerdown", retryPlayback, { passive: true });
    document.addEventListener("keydown", retryPlayback);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      video.pause();
      if (frameRequest !== undefined) video.cancelVideoFrameCallback(frameRequest);
      observer.disconnect();
      video.removeEventListener("canplay", sync);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", showFallback);
      video.removeEventListener("error", showFallback);
      window.removeEventListener("pageshow", sync);
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("pointerdown", retryPlayback);
      document.removeEventListener("keydown", retryPlayback);
      motion.removeEventListener("change", sync);
    };
  }, []);
  return (
    <div ref={containerRef} className={styles.backdrop} aria-hidden="true">
      <div ref={motionRef} className={styles.approach}>
        <Image
          src="/globoWisen-v1.webp"
          alt=""
          fill
          sizes="100vw"
          preload
          unoptimized
          className="object-cover object-center"
        />
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: hasFrame ? 1 : 0 }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/globoWisen-v1.webp"
          tabIndex={-1}
          aria-hidden="true"
        >
          <source src="/globo-hero-v1.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
