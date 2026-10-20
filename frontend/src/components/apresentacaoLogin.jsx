
export default function ApresentacaoLogin() {
    return (
        <section className="relative flex min-h-[420px] flex-col overflow-hidden bg-[#202C3B] px-10 py-10 text-white lg:min-h-screen lg:px-14 lg:py-14">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/globoWisen.png')" }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#202C3B]/75 via-transparent to-[#101B29]/20" />

            <div className="relative z-10">
                <div className="flex items-start gap-1">
                    <span className="text-3xl font-light tracking-tight">
                        Wisen
                    </span>

                </div>

                <div className="mt-12 max-w-md lg:mt-14">
                    <h1 className="text-4xl leading-[1.08] font-medium tracking-tight lg:text-[44px]">
                        Entenda o mundo
                        <span className="block text-[#F2DF73]">
                            com mais clareza.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-[360px] text-sm leading-relaxed text-white/75 lg:text-base">
                        Conhecimento confiável, análises profundas e conexões
                        que ajudam você a tomar melhores decisões.
                    </p>
                </div>
            </div>
        </section>
    );
}
