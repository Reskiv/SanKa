import { useMemo, useState } from "react";
import { CalendarDays, Coffee, LayoutGrid, List, Plus } from "lucide-react";
import { toast } from "sonner";
import CatMascot from "@/components/brand/CatMascot";
import CoffeeCalendar from "@/components/journal/CoffeeCalendar";
import CoffeeScrapbook from "@/components/journal/CoffeeScrapbook";
import CoffeeTimeline from "@/components/journal/CoffeeTimeline";
import CoffeeEntryDialog from "@/components/journal/CoffeeEntryDialog";
import SpendingSummary from "@/components/journal/SpendingSummary";
import { sortCoffees } from "@/lib/passport";

const VIEWS = [
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "scrapbook", label: "Scrapbook", icon: LayoutGrid },
  { key: "timeline", label: "Timeline", icon: List },
];

export default function JournalTab({ passport, view = "scrapbook", onViewChange, addCoffee, updateCoffee, deleteCoffee }) {
  const [dialog, setDialog] = useState({ open: false, entry: null, date: null });
  const [highlightId, setHighlightId] = useState(null);

  const entries = useMemo(() => sortCoffees(passport.coffees), [passport.coffees]);

  const openNew = (date = null) => setDialog({ open: true, entry: null, date });
  const openEdit = (entry) => setDialog({ open: true, entry, date: null });

  const handleSave = (data) => {
    if (dialog.entry) {
      if (!updateCoffee(dialog.entry.id, data)) return false;
      toast.success("Coffee updated");
      setHighlightId(dialog.entry.id);
    } else {
      const saved = addCoffee(data);
      if (!saved) return false;
      toast.success("Coffee saved", { description: "Tucked into your journal." });
      if (saved?.id) setHighlightId(saved.id);
    }
    window.setTimeout(() => setHighlightId(null), 900);
    return true;
  };

  return (
    <section aria-labelledby="journal-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="journal-heading" className="font-heading text-[22px] font-bold text-cocoa">
            Coffee journal
          </h2>
          <p className="text-[13px] font-semibold text-cocoa/50">
            {entries.length} {entries.length === 1 ? "cup" : "cups"} logged · saved in this browser
          </p>
        </div>
        <button type="button" onClick={() => openNew()} className="btn btn-caramel !py-2.5 text-[14px]">
          <Plus className="h-4 w-4" strokeWidth={2.4} /> Add coffee
        </button>
      </div>

      <SpendingSummary coffees={entries} className="mt-4" />

      <div role="group" aria-label="Journal view" className="mt-4 flex w-full rounded-full border border-cocoa/10 bg-cream/80 p-1 sm:inline-flex sm:w-auto">
        {VIEWS.map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onViewChange(item.key)}
              aria-pressed={active}
              className={`tab-pill flex-1 justify-center !px-2.5 !py-1.5 text-[12.5px] sm:flex-none ${active ? "tab-pill-active" : ""}`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {entries.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="relative w-[110px]">
              <div className="animate-blob absolute inset-0 bg-butter/60" style={{ borderRadius: "50% 50% 46% 54% / 46% 54% 46% 54%" }} />
              <CatMascot variant="cup" className="relative h-[110px] w-[110px]" />
            </div>
            <h3 className="font-heading text-[19px] font-bold text-cocoa">Your journal is waiting for its first sip</h3>
            <p className="max-w-sm text-[14px] leading-relaxed text-cocoa/65">
              Log what you drank, where you sat, and the little things worth remembering. Photos are optional.
            </p>
            <button type="button" onClick={() => openNew()} className="btn btn-primary mt-1">
              <Coffee className="h-4 w-4" /> Add your first coffee
            </button>
          </div>
        ) : view === "calendar" ? (
          <CoffeeCalendar entries={entries} onEdit={openEdit} onAdd={openNew} />
        ) : view === "timeline" ? (
          <CoffeeTimeline entries={entries} onEdit={openEdit} />
        ) : (
          <CoffeeScrapbook entries={entries} onEdit={openEdit} highlightId={highlightId} />
        )}
      </div>

      <CoffeeEntryDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        entry={dialog.entry}
        defaultDate={dialog.date}
        defaultCurrency={passport.currency}
        onSave={handleSave}
        onDelete={(id) => {
          if (!deleteCoffee(id)) return false;
          toast.success("Entry deleted");
          return true;
        }}
      />
    </section>
  );
}