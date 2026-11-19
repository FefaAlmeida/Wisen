import CentralRevisao from "@/components/centralRevisao/centralRevisao";
import RevisoesLayout from "@/components/centralRevisao/layout";
export default function PaginaRevisoes(props) {
  return (
    <RevisoesLayout>
      <CentralRevisao {...props} />
    </RevisoesLayout>
  );
}
