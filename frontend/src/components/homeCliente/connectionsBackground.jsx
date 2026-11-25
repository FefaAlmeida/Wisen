"use client";

import { useEffect, useRef } from "react";

export function ConnectionsBackground({
  fadeTop = false,
  fullSpread = true,
  opacity,
  particleDensity = 1,
} = {}) {
  const canvasRef = useRef(null);
  const maskImage = fadeTop
    ? "linear-gradient(to bottom, transparent 0, transparent 370px, black 560px)"
    : "none";

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = reducedMotion ? 0.3 : 1;
    let particles = [];
    let connectedPairs = [];
    let connectedPairIds = new Set();
    let width = 0;
    let height = 0;
    let pixelRatio = 0;
    let frameId = 0;
    let visible = true;
    let lastFrame = 0;

    function createParticle() {
      const heroHeight = fullSpread ? 0 : Math.min(height * 0.26, 390);
      return {
        x: Math.random() * width,
        y: fullSpread
          ? Math.random() * height
          : Math.random() < 0.08
            ? Math.random() * heroHeight
            : heroHeight + Math.random() * (height - heroHeight),
        vx: (Math.random() - 0.5) * 0.28 * motionScale,
        vy: (Math.random() - 0.5) * 0.28 * motionScale,
      };
    }

    function rebuildConnections() {
      const count = particles.length;
      connectedPairs = [];
      connectedPairIds = new Set();
      const connectionDistance = new Float64Array(count).fill(Number.POSITIVE_INFINITY);
      const connectionParents = new Int32Array(count).fill(-1);
      const connected = new Uint8Array(count);
      connectionDistance[0] = 0;

      for (let step = 0; step < count; step += 1) {
        let current = -1;
        for (let index = 0; index < count; index += 1) {
          if (
            !connected[index] &&
            (current === -1 || connectionDistance[index] < connectionDistance[current])
          ) {
            current = index;
          }
        }
        if (current === -1) break;

        connected[current] = 1;
        const parent = connectionParents[current];
        if (parent >= 0) {
          connectedPairs.push([parent, current]);
          connectedPairIds.add(Math.min(parent, current) * count + Math.max(parent, current));
        }

        for (let index = 0; index < count; index += 1) {
          if (connected[index]) continue;
          const distance = Math.hypot(
            particles[current].x - particles[index].x,
            particles[current].y - particles[index].y,
          );
          if (distance < connectionDistance[index]) {
            connectionDistance[index] = distance;
            connectionParents[index] = current;
          }
        }
      }
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const nextWidth = Math.round(bounds.width);
      const nextHeight = Math.round(bounds.height);
      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      if (!nextWidth || !nextHeight) return;
      if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio) return;

      const previousWidth = width;
      const previousHeight = height;
      const previousCount = particles.length;
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextPixelRatio;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const minimumCount = Math.round(48 * particleDensity);
      const maximumCount = Math.round(115 * particleDensity);
      const count = Math.min(
        maximumCount,
        Math.max(minimumCount, Math.round(((width * height) / 8500) * particleDensity)),
      );

      if (!previousWidth || !previousHeight) {
        particles = Array.from({ length: count }, createParticle);
      } else {
        const scaleX = width / previousWidth;
        const scaleY = height / previousHeight;
        for (const particle of particles) {
          particle.x *= scaleX;
          particle.y *= scaleY;
        }
        particles.length = Math.min(particles.length, count);
        while (particles.length < count) particles.push(createParticle());
      }

      if (!previousWidth || particles.length !== previousCount) rebuildConnections();

      window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
      if (visible && !document.hidden) draw(performance.now());
    }

    function connect(first, second, opacity) {
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.strokeStyle = `rgba(67, 91, 131, ${opacity})`;
      context.lineWidth = 0.65;
      context.stroke();
    }

    function draw(now = 0) {
      frameId = 0;
      if (!visible || document.hidden) return;
      if (now - lastFrame < 32 && !reducedMotion) {
        frameId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      for (const [first, second] of connectedPairs) {
        connect(particles[first], particles[second], 0.12);
      }

      for (let first = 0; first < particles.length; first += 1) {
        const particle = particles[first];
        for (let second = first + 1; second < particles.length; second += 1) {
          if (connectedPairIds.has(first * particles.length + second)) continue;
          const neighbor = particles[second];
          const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y);
          if (distance < 145) {
            connect(particle, neighbor, (1 - distance / 145) * 0.12);
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, 1.9, 0, Math.PI * 2);
        context.fillStyle = "rgba(215, 191, 77, 0.88)";
        context.fill();
      }

      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    }

    function sync() {
      cancelAnimationFrame(frameId);
      frameId = 0;
      if (visible && !document.hidden) draw();
    }
    resize();
    sync();
    const visibilityObserver = fullSpread
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        });
    visibilityObserver?.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver?.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [fullSpread, particleDensity]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        maskImage,
        opacity,
        WebkitMaskImage: maskImage,
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
