"use client";
import { useEffect } from "react";
import { requisitar } from "@/services/api";
export default function ReadingTracker({ eventId }) {
  useEffect(() => {
    if (!eventId) return;
    const send = (type, seconds = 0) =>
      requisitar("/feed/interactions", {
        method: "POST",
        body: { eventId, type, seconds, requestId: crypto.randomUUID() },
        keepalive: true,
      }).catch(() => {});
    send("open");
    let previous = performance.now(),
      elapsed = 0;
    const tick = () => {
      const now = performance.now();
      if (document.visibilityState === "visible" && document.hasFocus())
        elapsed += Math.min(1000, now - previous);
      previous = now;
      if (elapsed >= 5000) {
        const seconds = Math.floor(elapsed / 1000);
        elapsed -= seconds * 1000;
        send("progress", seconds);
      }
    };
    const timer = setInterval(tick, 1000);
    return () => {
      clearInterval(timer);
      if (elapsed >= 1000) send("progress", Math.floor(elapsed / 1000));
    };
  }, [eventId]);
  return null;
}
