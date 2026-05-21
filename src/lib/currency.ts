export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(amount);
}
