export function sortCoffees(coffees = []) {
  return [...coffees].sort((a, b) => {
    const left = `${a.date || ""}T00:00`;
    const right = `${b.date || ""}T00:00`;
    if (left === right) return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    return right.localeCompare(left);
  });
}

export function formatEntryDate(date, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!date) return "No date";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", options);
}

export function todayKey() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/* Currencies offered in the coffee journal. Symbols are used only for compact
   display; totals are always formatted with Intl and an explicit locale. */
export const CURRENCIES = [
  { code: "PHP", label: "PHP · Philippine peso" },
  { code: "USD", label: "USD · US dollar" },
  { code: "EUR", label: "EUR · Euro" },
  { code: "GBP", label: "GBP · British pound" },
  { code: "JPY", label: "JPY · Japanese yen" },
  { code: "SGD", label: "SGD · Singapore dollar" },
  { code: "AUD", label: "AUD · Australian dollar" },
  { code: "CAD", label: "CAD · Canadian dollar" },
  { code: "HKD", label: "HKD · Hong Kong dollar" },
  { code: "KRW", label: "KRW · South Korean won" },
  { code: "TWD", label: "TWD · New Taiwan dollar" },
  { code: "THB", label: "THB · Thai baht" },
  { code: "MYR", label: "MYR · Malaysian ringgit" },
  { code: "IDR", label: "IDR · Indonesian rupiah" },
  { code: "INR", label: "INR · Indian rupee" },
  { code: "AED", label: "AED · UAE dirham" },
];

export const CURRENCY_CODES = CURRENCIES.map((currency) => currency.code);
export const DEFAULT_CURRENCY = "PHP";

export function formatMoney(amount, currency = DEFAULT_CURRENCY) {
  if (!Number.isFinite(amount)) return "";
  const code = CURRENCY_CODES.includes(currency) ? currency : DEFAULT_CURRENCY;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "JPY" || code === "KRW" ? 0 : 2,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${amount.toFixed(2)}`;
  }
}

/* Totals per currency: spending is never converted, since the app has no
   exchange-rate source. */
export function spendingByCurrency(coffees = []) {
  const totals = new Map();
  coffees.forEach((entry) => {
    const price = Number(entry.price);
    if (!Number.isFinite(price) || price <= 0) return;
    const code = CURRENCY_CODES.includes(entry.currency) ? entry.currency : DEFAULT_CURRENCY;
    const current = totals.get(code) || { code, total: 0, count: 0 };
    totals.set(code, { code, total: current.total + price, count: current.count + 1 });
  });
  return [...totals.values()].sort((a, b) => b.total - a.total);
}

export function monthKey(date) {
  return typeof date === "string" ? date.slice(0, 7) : "";
}

export function spendingForMonth(coffees = [], month = monthKey(todayKey())) {
  return spendingByCurrency(coffees.filter((entry) => monthKey(entry.date) === month));
}