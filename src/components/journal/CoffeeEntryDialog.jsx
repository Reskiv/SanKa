import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PhotoPicker from "@/components/common/PhotoPicker";
import { CURRENCIES, DEFAULT_CURRENCY, todayKey } from "@/lib/passport";

const blank = (currency = DEFAULT_CURRENCY) => ({ drink: "", cafe: "", date: todayKey(), rating: 0, notes: "", photos: [], price: "", currency });

export default function CoffeeEntryDialog({ open, onOpenChange, entry, defaultDate, defaultCurrency = DEFAULT_CURRENCY, onSave, onDelete }) {
  const [form, setForm] = useState(() => blank(defaultCurrency));
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(entry
      ? { ...blank(defaultCurrency), ...entry, price: Number.isFinite(Number(entry.price)) && Number(entry.price) > 0 ? String(entry.price) : "" }
      : { ...blank(defaultCurrency), date: defaultDate || todayKey() });
    setError("");
    setConfirmDelete(false);
  }, [open, entry, defaultDate, defaultCurrency]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.drink.trim()) {
      setError("Give this coffee a name first.");
      return;
    }
    const price = form.price === "" || form.price === null ? null : Number(form.price);
    if (price !== null && (!Number.isFinite(price) || price < 0 || price > 1000000)) {
      setError("Add a price of 0 or more, or leave it blank.");
      return;
    }
    const saved = onSave({
      drink: form.drink.trim(),
      cafe: form.cafe.trim(),
      date: form.date || todayKey(),
      rating: Number(form.rating) || 0,
      notes: form.notes.trim(),
      photos: form.photos || [],
      price: price === null ? null : Math.round(price * 100) / 100,
      currency: form.currency || DEFAULT_CURRENCY,
    });
    if (saved !== false) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-cocoa/15 bg-paper sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-[22px] text-cocoa">
            {entry ? "Edit this coffee" : "Log a coffee"}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-cocoa/60">
            Saved to this browser only, so it stays your private journal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-1 space-y-4">
          <div>
            <label htmlFor="coffee-drink" className="field-label">
              Coffee or drink
            </label>
            <input
              id="coffee-drink"
              value={form.drink}
              onChange={(event) => set("drink", event.target.value)}
              maxLength={60}
              placeholder="Iced oat latte"
              className="field mt-1.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="coffee-cafe" className="field-label">
                Café
              </label>
              <input
                id="coffee-cafe"
                value={form.cafe}
                onChange={(event) => set("cafe", event.target.value)}
                maxLength={60}
                placeholder="Moonbeam Nook"
                className="field mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="coffee-date" className="field-label">
                Visit date
              </label>
              <input
                id="coffee-date"
                type="date"
                value={form.date}
                max={todayKey()}
                onChange={(event) => set("date", event.target.value)}
                className="field mt-1.5"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
            <div>
              <label htmlFor="coffee-price" className="field-label">
                Price <span className="normal-case tracking-normal text-cocoa/40">optional</span>
              </label>
              <input
                id="coffee-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => set("price", event.target.value)}
                placeholder="180"
                className="field mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="coffee-currency" className="field-label">
                Currency
              </label>
              <select
                id="coffee-currency"
                value={form.currency}
                onChange={(event) => set("currency", event.target.value)}
                className="field mt-1.5"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="!mt-1.5 text-[12px] leading-relaxed text-cocoa/50">
            Only used to total your own spending. Totals are never converted between currencies.
          </p>

          <fieldset>
            <legend className="field-label">Rating</legend>
            <div className="mt-1.5 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("rating", form.rating === value ? 0 : value)}
                  aria-label={`${value} ${value === 1 ? "cup" : "cups"}`}
                  aria-pressed={form.rating >= value}
                  className="rounded-full p-1 transition-transform duration-150 active:scale-90"
                >
                  <Star
                    className={`h-7 w-7 ${value <= form.rating ? "fill-caramel text-caramel" : "text-cocoa/20"}`}
                    strokeWidth={1.8}
                  />
                </button>
              ))}
              <span className="ml-1 text-[13px] font-semibold text-cocoa/50">
                {form.rating ? `${form.rating} / 5` : "optional"}
              </span>
            </div>
          </fieldset>

          <div>
            <label htmlFor="coffee-notes" className="field-label">
              Tasting notes
            </label>
            <textarea
              id="coffee-notes"
              rows={4}
              value={form.notes}
              maxLength={600}
              onChange={(event) => set("notes", event.target.value)}
              placeholder="Nutty, a little sweet. Window seat, quiet at 3pm."
              className="field mt-1.5 resize-none"
            />
            <p className="mt-1.5 text-[12px] leading-relaxed text-cocoa/50">
              New to this? Note whether it tasted sweet, bitter or sour, whether it felt strong or light, and how the room felt.
            </p>
          </div>

          <PhotoPicker value={form.photos || []} onChange={(photos) => set("photos", photos)} label="Photos" />

          {error && (
            <p role="alert" className="rounded-2xl bg-destructive/10 px-3 py-2 text-[13px] font-semibold text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button type="submit" className="btn btn-primary flex-1">
              {entry ? "Save changes" : "Save coffee"}
            </button>
            <button type="button" onClick={() => onOpenChange(false)} className="btn btn-ghost">
              Cancel
            </button>
          </div>

          {entry && (
            <div className="border-t border-cocoa/10 pt-3">
              {confirmDelete ? (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="flex-1 text-[13px] font-semibold text-cocoa/70">Delete this entry for good?</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (onDelete(entry.id) !== false) onOpenChange(false);
                    }}
                    className="btn btn-danger !px-4 !py-2 text-[13px]"
                  >
                    Yes, delete
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="btn btn-ghost !px-4 !py-2 text-[13px]">
                    Keep it
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-cocoa/50 transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete entry
                </button>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}