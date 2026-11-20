export function AdminSummary({ title, description, items, loading = false }) {
  return (
    <section
      aria-label={title}
      className="flex min-w-0 flex-col gap-4 rounded-2xl border border-wisen-borda bg-wisen-superficie p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-wisen-titulo">{title}</h2>
        <span aria-hidden="true" className="mt-2 block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
        <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#EBDD80] bg-[#F3E69A] px-3 py-1.5 text-[11px] font-medium text-wisen-titulo"
          >
            {loading ? "..." : item}
          </span>
        ))}
      </div>
    </section>
  );
}
