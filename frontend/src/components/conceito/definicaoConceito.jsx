
import { Card, CardContent } from "@/components/ui/card";

export default function DefinicaoConceito() {
  return (
    <Card className="h-full gap-0 rounded-xl border-0 bg-white p-0 shadow-none">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8DD]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#17254D"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M12 6c-2-2-5-2-9-1v14c4-1 7-1 9 1 2-2 5-2 9-1V5c-4-1-7-1-9 1Z" />
              <path d="M12 6v14" />
            </svg>
          </span>

          <h2 className="text-[22px] font-semibold tracking-tight text-[#101A40]">
            Definição e explicação
          </h2>
        </div>

        <div className="space-y-4 pl-0 text-[15px] leading-[1.55] text-[#617398] md:pl-[52px]">
          <p>
            Inflação é o aumento generalizado e contínuo dos
            preços de bens e serviços em uma economia, o que
            reduz o poder de compra da moeda. Isso significa
            que, com o passar do tempo, a mesma quantidade
            de dinheiro passa a comprar menos produtos e serviços.
          </p>

          <p>
            A inflação pode ser causada por diferentes fatores,
            como aumento da demanda, elevação dos custos de
            produção (por exemplo, de energia ou matérias-primas)
            e expansão da quantidade de dinheiro em circulação.
            Ela é medida por índices de preços, como o IPCA
            no Brasil, que acompanham a variação média dos
            preços de uma cesta de produtos e serviços.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl bg-[#FFF9E6] px-4 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0A9] text-2xl">
            💡
          </span>

          <div className="border-l border-[#D6C78A] pl-4">
            <h3 className="text-[15px] font-semibold text-[#101A40]">
              Em palavras simples
            </h3>
            <p className="mt-1 text-[14px] leading-5 text-[#617398]">
              Inflação é quando os preços, em geral, sobem
              ao longo do tempo e o seu dinheiro compra menos coisas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
