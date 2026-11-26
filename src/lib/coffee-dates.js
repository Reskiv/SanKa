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