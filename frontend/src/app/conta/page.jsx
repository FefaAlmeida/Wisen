import { redirect } from "next/navigation";
import { Suspense } from "react";
import Account from "@/components/platform/account";
export default async function Page({ searchParams }) {
  const params = await searchParams;
  if (!params?.action || ["forgot", "reset"].includes(params.action)) {
    const query = new URLSearchParams({ action: params?.action || "forgot" });
    if (typeof params?.token === "string") query.set("token", params.token);
    redirect(`/auth?${query}`);
  }
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <Account />
    </Suspense>
  );
}
