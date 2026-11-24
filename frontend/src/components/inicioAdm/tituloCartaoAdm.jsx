export function TituloCartaoAdm({ titulo, descricao }) {
  return (
    <div className="min-w-0 space-y-1">
      <h3 className="text-lg font-medium leading-snug tracking-tight text-wisen-titulo sm:text-xl">
        {titulo}
      </h3>
      <span aria-hidden="true" className="block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
      {descricao && <p className="text-xs leading-5 text-[#7182A1]">{descricao}</p>}
    </div>
  );
}
