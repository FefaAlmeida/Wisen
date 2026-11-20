import Image from "next/image";
import { PageHeader } from "@/components/app/pageHeader";

export function HomeBanner({ title, highlight, description, eyebrow, children }) {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-[#293B5C] bg-[#101A40] bg-linear-to-r from-[#101A40] via-[#172B54] to-[#234573] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block">
        <Image
          src="/foto_paginaInicialCliente-v1.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 1px"
          className="object-cover object-left"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#172B54] via-transparent to-transparent" />
      </div>
      <PageHeader
        title={title}
        highlight={highlight}
        description={description}
        eyebrow={eyebrow}
        className="relative z-10 max-w-2xl lg:max-w-[58%] [&_h1]:text-white [&_p]:text-[#C4D2EA]"
      >
        {children}
      </PageHeader>
    </section>
  );
}
