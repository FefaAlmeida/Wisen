import { AdminPageHeader } from "@/components/admin/adminPageHeader";
import { AdminSummary } from "@/components/admin/adminSummary";

export function TopoMonitorIa() {
  return (
    <div className="space-y-7">
      <AdminPageHeader title="Monitor de" highlight="IA." />
      <AdminSummary
        title="Consumo e desempenho da IA"
        description="Acompanhe os gastos e o uso de tokens por modelo. Consulte o histórico de requisições para conferir os tempos de resposta e identificar falhas."
      />
    </div>
  );
}
