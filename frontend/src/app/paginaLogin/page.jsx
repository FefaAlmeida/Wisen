import { redirect } from "next/navigation";

export default async function LegacyAuthPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : null;
  redirect(next ? `/auth?${new URLSearchParams({ next })}` : "/auth");
}
