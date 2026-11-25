import { PageHeader } from "@/components/app/pageHeader";

export function AdminPageHeader(props) {
  return <PageHeader {...props} />;
}

export function AdminPage({ title, highlight, description, children }) {
  return (
    <div className="w-full min-w-0 bg-transparent font-[family-name:var(--font-geist-sans)]">
      <div className="wisen-container relative z-10 min-w-0 space-y-7 pt-7 pb-12">
        <AdminPageHeader title={title} highlight={highlight} description={description} />
        {children}
      </div>
    </div>
  );
}
