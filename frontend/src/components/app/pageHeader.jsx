export function PageHeader({ title, highlight, description, eyebrow, className = "", children }) {
  return (
    <header className={`min-w-0 ${className}`}>
      {eyebrow && <p className="wisen-eyebrow">{eyebrow}</p>}
      <h1 className={`${eyebrow ? "mt-3 " : ""}wisen-page-title`}>
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-wisen-destaque">{highlight}</span>
          </>
        )}
      </h1>
      {description && <p className="wisen-page-description mt-3">{description}</p>}
      {children}
    </header>
  );
}

export function PageIntro({ title, children }) {
  return (
    <section className="wisen-panel mb-7 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-wisen-titulo">{title}</h2>
      <span aria-hidden="true" className="mt-2 block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
      <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">{children}</p>
    </section>
  );
}
