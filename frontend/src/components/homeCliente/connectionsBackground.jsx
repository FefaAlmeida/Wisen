"use client";

import { useEffect, useRef } from "react";

export function ConnectionsBackground() {
  const canvasRef = useRef(null);

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
    let frameId = 0;

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const heroHeight = Math.min(height * 0.26, 390);
      const count = Math.min(115, Math.max(48, Math.round((width * height) / 8500)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y:
          Math.random() < 0.08
            ? Math.random() * heroHeight
            : heroHeight + Math.random() * (height - heroHeight),
        vx: (Math.random() - 0.5) * 0.28 * motionScale,
        vy: (Math.random() - 0.5) * 0.28 * motionScale,
      }));

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

    function connect(first, second, opacity) {
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.strokeStyle = `rgba(67, 91, 131, ${opacity})`;
      context.lineWidth = 0.65;
      context.stroke();
    }

    function draw() {
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

      frameId = window.requestAnimationFrame(draw);
    }

    resize();
    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0, transparent 370px, black 560px)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, transparent 370px, black 560px)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}