const formatters = new Map();

function getFormatter(currency) {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    formatters.set(currency, formatter);
  }
  return formatter;
}

export function formatPrice(money) {
  return getFormatter(money.currency).format(money.amount / 100);
}
