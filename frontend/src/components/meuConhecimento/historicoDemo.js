// One illustrative history keeps overlapping periods consistent across time zones.
const END = Date.UTC(2026, 10, 13);
const DAY = 86_400_000;
const anchors = [
  [0, 25],
  [90, 33],
  [180, 43],
  [275, 52],
  [335, 61],
  [358, 69],
  [364, 72],
];
export const PERIODS = [
  { days: 7, label: "7 dias" },
  { days: 30, label: "30 dias" },
  { days: 90, label: "3 meses" },
  { days: 365, label: "1 ano" },
];
export const evolutionHistory = Array.from({ length: 365 }, (_, index) => {
  const segment = anchors.findIndex(([day]) => day >= index);
  const [startDay, startScore] = anchors[Math.max(0, segment - 1)];
  const [endDay, endScore] = anchors[segment];
  const progress = endDay === startDay ? 0 : (index - startDay) / (endDay - startDay);
  const variation = Math.sin(progress * Math.PI) * Math.sin(index * 0.75) * 1.7;
  return {
    date: END - (364 - index) * DAY,
    score: Math.round(startScore + (endScore - startScore) * progress + variation),
  };
});
export function getEvolution(days) {
  const history = evolutionHistory.slice(-days);
  const step = days === 365 ? 14 : days === 90 ? 3 : 1;
  return history.filter((_, index) => index % step === 0 || index === history.length - 1);
}
export function formatDate(date, year = false) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    ...(year ? { year: "numeric" } : {}),
    timeZone: "UTC",
  })
    .format(date)
    .replaceAll(" de ", " ")
    .replaceAll(".", "");
}
export const categories = [
  { name: "Economia", count: 41, color: "#A18D26" },
  { name: "Política", count: 31, color: "#304B5B" },
  { name: "Meio ambiente", count: 23, color: "#4C8977" },
  { name: "Tecnologia", count: 19, color: "#558DB2" },
  { name: "Sociedade", count: 14, color: "#8D7C9C" },
];
