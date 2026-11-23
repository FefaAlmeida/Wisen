import FormularioAuth from "@/components/formularioAuth";

export default function AuthScreen({ action = null, token = "", onboarding = false }) {
  return (
    <div className="relative isolate min-h-svh overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-[position:center_top] bg-no-repeat"
        style={{ backgroundImage: "url('/globoWisen-v1.webp')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080F1C]/90 via-[#080F1C]/65 to-[#080F1C]/60"
      />
      <main className="flex min-h-svh items-center justify-center px-4 py-6 sm:px-8 sm:py-10">
        <FormularioAuth
          key={`${action}:${token}`}
          glass
          initialAction={action}
          resetToken={token}
          initialOnboarding={onboarding}
        />
      </main>
    </div>
  );
}
