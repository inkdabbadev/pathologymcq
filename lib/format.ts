const CURRENCY_SYMBOL: Record<string, string> = {
  GBP: "£",
  INR: "₹",
  USD: "$",
};

export function formatPrice(cents: number, currency: string) {
  const symbol = CURRENCY_SYMBOL[currency] ?? currency;
  return `${symbol}${(cents / 100).toLocaleString()}`;
}
