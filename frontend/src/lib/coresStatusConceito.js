export const coresStatusConceito = {
  Lacuna: { indicador: "#FF6469", texto: "#B4232B" },
  "Em revisão": { indicador: "#FFD33D", texto: "#8A6500" },
  Dominado: { indicador: "#33B27C", texto: "#16734D" },
};

export function coresNivelDominio(percentual) {
  if (percentual >= 75) return coresStatusConceito.Dominado;
  if (percentual < 40) return coresStatusConceito.Lacuna;
  return coresStatusConceito["Em revisão"];
}
