"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { publicDemoHome } from "@/lib/public-demo";

const desktopWidth = 1280;

export function DemoLanding() {
  const frame = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = frame.current;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const desktop = width >= 500;
  const scale = desktop ? width / desktopWidth : 1;
  const height = desktop ? 768 : 560;

  return (
    <div
      ref={frame}
      className="relative h-[560px] overflow-hidden rounded-[17px] border border-[#D5DEE9] bg-wisen-superficie @min-[500px]:h-auto @min-[500px]:aspect-[5/3]"
    >
      <iframe
        src={publicDemoHome}
        title="Demonstração interativa do Wisen"
        loading="lazy"
        allow="clipboard-write"
        className="absolute top-0 left-0 origin-top-left border-0"
        style={{
          width: desktop ? desktopWidth : "100%",
          height,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
