export function AdminPageHeader({ title, highlight, description, className = "", children }) {
  return (
    <header className={`min-w-0 ${className}`}>
      <p className="text-[11px] font-semibold text-[#93A3BE]">ADMINISTRAÇÃO</p>
      <h1 className="mt-4 break-words text-[36px] font-medium leading-[1.05] tracking-tight text-wisen-titulo sm:text-[44px]">
        {title}
        {highlight && (
          <>
            <span> </span>
            <span className="text-[#D7BF4D]">{highlight}</span>
          </>
        )}
      </h1>
      {description && (
        <p className="mt-3 max-w-[650px] text-[15px] leading-6 text-wisen-texto-suave">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}

export function AdminPage({ title, highlight, description, children }) {
  return (
    <main className="min-h-screen w-full min-w-0 bg-transparent font-[family-name:var(--font-geist-sans)]">
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1600px] space-y-7 px-4 pt-7 pb-12 sm:px-5 lg:px-7">
        <AdminPageHeader title={title} highlight={highlight} description={description} />
        {children}
      </div>
    </main>
  );
}
