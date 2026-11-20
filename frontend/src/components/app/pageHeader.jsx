export function PageHeader({ title, highlight, description, eyebrow, className = "", children }) {
  return (
    <header className={`min-w-0 ${className}`}>
      {eyebrow && <p className="wisen-eyebrow">{eyebrow}</p>}
      <h1 className={`${eyebrow ? "mt-3 " : ""}wisen-page-title`}>
        {title}
        {highlight && (
          <>
            <span> </span>
            <span className="text-wisen-destaque">{highlight}</span>
          </>
        )}
      </h1>
      {description && <p className="wisen-page-description mt-3">{description}</p>}
      {children}
    </header>
  );
}
