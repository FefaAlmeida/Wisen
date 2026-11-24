"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requisitar } from "@/services/api";
export default function Account() {
  const params = useSearchParams();
  const action = params.get("action") === "delete" ? "delete" : "verify";
  const token = params.get("token") ?? "";
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await requisitar(action === "delete" ? "/account" : `/account/${action}`, {
        method: action === "delete" ? "DELETE" : "POST",
        body: action === "verify" ? { token } : { confirmation },
      });
      setMessage(result.message);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-wisen-superficie px-5 text-[#101A40]">
      <section className="w-full max-w-md rounded-2xl bg-card p-8">
        <Link href="/" className="text-sm font-semibold">
          Wisen
        </Link>
        <h1 className="mb-6 mt-6 text-2xl font-semibold">
          {action === "verify" ? "Confirmar e-mail" : "Excluir minha conta"}
        </h1>
        <form onSubmit={submit} className="space-y-5">
          {action === "delete" && (
            <label className="block">
              Isso remove sua conta, histórico e respostas. Digite EXCLUIR para confirmar.
              <input
                required
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>
          )}
          <Button
            disabled={busy || (action === "delete" && confirmation !== "EXCLUIR")}
            type="submit"
          >
            {busy
              ? "Aguarde…"
              : action === "verify"
                ? "Confirmar e-mail"
                : action === "delete"
                  ? "Excluir conta"
                  : "Continuar"}
          </Button>
        </form>
        {message && (
          <p role="status" className="mt-5">
            {message}
          </p>
        )}
        <Link href="/auth" className="mt-6 block underline">
          Voltar para login
        </Link>
      </section>
    </main>
  );
}
