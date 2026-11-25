"use client";

import Link from "next/link";
import { publicDemoPrefix } from "@/lib/public-demo";
import { usePublicDemo } from "./mode";

export function useDemoHref() {
  const demo = usePublicDemo();
  return (href) =>
    demo && typeof href === "string" && href.startsWith("/") && !href.startsWith("//")
      ? `${publicDemoPrefix}${href}`
      : href;
}

export default function DemoLink({ href, ...props }) {
  const demoHref = useDemoHref();
  return <Link href={demoHref(href)} {...props} />;
}
