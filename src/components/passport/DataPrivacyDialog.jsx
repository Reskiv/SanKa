import { useEffect, useState } from "react";
import { AlertTriangle, Download, HardDrive, LoaderCircle, ShieldCheck, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePassport } from "@/lib/passport";
import { passportBytes } from "@/lib/passport-storage";
import { parseBackup } from "@/lib/passport-backup";
import { photoStats } from "@/lib/photoStore";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-cocoa/10 py-2 first:border-t-0 first:pt-0">
      <dt className="text-[12px] font-semibold text-cocoa/55">{label}</dt>
      <dd className="text-right text-[13px] font-bold text-cocoa">{value}</dd>
    </div>
  );
}

export default function DataPrivacyDialog({ open, onOpenChange }) {
  const { passport, exportBackup, importBackup, reset } = usePassport();
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError("");
    setPreview(null);
    setConfirmDelete(false);
    setBusy("");
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    let alive = true;
    const load = async () => {
      const local = passportBytes(window.localStorage);
      let photos = { count: 0, bytes: 0 };
      try {
        photos = await photoStats();
      } catch {
        photos = { count: 0, bytes: 0 };
      }
      let origin = null;
      try {
        if (navigator.storage?.estimate) {
          const estimate = await navigator.storage.estimate();
          origin = estimate.usage || null;
        }
      } catch {
        origin = null;
      }
      if (alive) setStats({ local, photos, origin });
    };
    load();
    return () => { alive = false; };
  }, [open]);

  const download = async () => {
    setError("");
    setBusy("export");
    try {
      const backup = await exportBackup();
      if (!backup) {
        setError("There is no passport to export yet.");
        return;
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sanka-passport-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast.success("Backup downloaded", { description: "Keep the file somewhere private." });
    } catch {
      setError("The backup could not be built. Try again, or export from a browser with more free space.");
    } finally {
      setBusy("");
    }
  };

  const chooseFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setPreview(null);
    setBusy("read");
    try {
      if (file.size > 64 * 1024 * 1024) throw new Error("That backup is larger than 64 MB and was not opened.");
      const text = await file.text();
      setPreview(parseBackup(text));
    } catch (issue) {
      setError(issue.message || "That file could not be read.");
    } finally {
      setBusy("");
    }
  };

  const confirmImport = async () => {
    if (!preview) return;
    setBusy("import");
    setError("");
    try {
      const result = await importBackup(preview);
      if (!result) {
        setError("The backup could not be saved in this browser.");
        return;
      }
      toast.success("Backup imported", {
        description: result.restored ? `${result.restored} photo${result.restored === 1 ? "" : "s"} restored.` : "Passport restored.",
      });
      setPreview(null);
      onOpenChange(false);
    } catch {
      setError("The import could not finish. Check your passport before retrying; part of the backup may already be saved.");
    } finally {
      setBusy("");
    }
  };

  const deleteEverything = async () => {
    setBusy("delete");
    setError("");
    if (await reset()) {
      toast.success("Passport deleted", { description: "This browser no longer holds your stamps, notes or photos." });
      setConfirmDelete(false);
      onOpenChange(false);
    } else {
      setError("Your data could not be deleted. Check browser storage and try again.");
    }
    setBusy("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-cocoa/15 bg-paper sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-[22px] text-cocoa">
            <ShieldCheck className="h-5 w-5 text-mint-deep" aria-hidden="true" /> Data &amp; privacy
          </DialogTitle>
          <DialogDescription className="text-[14px] text-cocoa/60">
            Your passport lives in this browser. Export a backup before clearing it, or before switching devices.
          </DialogDescription>
        </DialogHeader>

        <section aria-labelledby="storage-heading" className="rounded-[20px] border border-cocoa/10 bg-cream/50 p-4">
          <h3 id="storage-heading" className="flex items-center gap-1.5 font-heading text-[15px] font-bold text-cocoa">
            <HardDrive className="h-4 w-4 text-mint-deep" aria-hidden="true" /> What is stored
          </h3>
          {!stats ? (
            <p className="mt-2 flex items-center gap-2 text-[12.5px] text-cocoa/55">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Measuring this browser’s storage…
            </p>
          ) : (
            <dl className="mt-2">
              <StatRow label="Passport &amp; journal (browser storage)" value={formatBytes(stats.local)} />
              <StatRow label="Photos kept in this browser" value={`${stats.photos.count} · ${formatBytes(stats.photos.bytes)}`} />
              <StatRow label="Site storage reported by the browser" value={stats.origin ? formatBytes(stats.origin) : "Not reported"} />
            </dl>
          )}
          <p className="mt-2 text-[11.5px] leading-relaxed text-cocoa/50">
            Nothing is uploaded. Clearing this site’s browser data, or deleting the passport below, removes it.
          </p>
        </section>

        <section aria-labelledby="export-heading">
          <h3 id="export-heading" className="font-heading text-[15px] font-bold text-cocoa">Backup &amp; export</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-cocoa/60">
            The file includes your private notes, journal entries and photos. Keep it somewhere you trust.
          </p>
          <button type="button" onClick={download} disabled={busy === "export"} className="btn btn-primary mt-2.5 w-full !py-2.5 text-[14px]">
            {busy === "export" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
            {busy === "export" ? "Building backup…" : "Download backup (.json)"}
          </button>
        </section>

        <section aria-labelledby="import-heading" className="border-t border-cocoa/10 pt-3">
          <h3 id="import-heading" className="font-heading text-[15px] font-bold text-cocoa">Import a backup</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-cocoa/60">
            Importing replaces the passport in this browser. You will see a summary before anything is saved.
          </p>
          <label className="btn btn-ghost mt-2.5 w-full cursor-pointer !py-2.5 text-[14px]">
            {busy === "read" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
            {busy === "read" ? "Reading file…" : "Choose a backup file"}
            <input type="file" accept="application/json,.json" className="sr-only" onChange={chooseFile} disabled={Boolean(busy)} />
          </label>

          {preview && (
            <div className="mt-3 rounded-[20px] border border-caramel/40 bg-butter/40 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cocoa/50">Preview</p>
              <p className="mt-1 font-heading text-[16px] font-bold text-cocoa">{preview.summary.name}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-cocoa/70">
                {preview.summary.stamps} stamps · {preview.summary.notes} notes · {preview.summary.coffees} coffees ·{" "}
                {preview.summary.favorites} favorites · {preview.summary.wantToVisit} want to visit · {preview.summary.photos} photos
              </p>
              {preview.warnings.map((warning) => (
                <p key={warning} className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-cocoa/60">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" /> {warning}
                </p>
              ))}
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={confirmImport} disabled={busy === "import"} className="btn btn-primary flex-1 !py-2 text-[13px]">
                  {busy === "import" ? "Importing…" : "Replace this passport"}
                </button>
                <button type="button" onClick={() => setPreview(null)} className="btn btn-ghost !py-2 text-[13px]">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="delete-heading" className="border-t border-cocoa/10 pt-3">
          <h3 id="delete-heading" className="font-heading text-[15px] font-bold text-cocoa">Delete everything</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-cocoa/60">
            Removes the passport, stamps, notes, favorites, journal entries and stored photos from this browser. This cannot be undone.
          </p>
          {confirmDelete ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button type="button" onClick={deleteEverything} disabled={busy === "delete"} className="btn btn-danger flex-1 !py-2 text-[13px]">
                {busy === "delete" ? "Deleting…" : "Yes, delete my passport"}
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="btn btn-ghost !py-2 text-[13px]">
                Keep it
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="btn btn-ghost mt-2.5 w-full !py-2 text-[13px]">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete my data
            </button>
          )}
        </section>

        {error && (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-3 py-2 text-[13px] font-semibold text-destructive">
            {error}
          </p>
        )}

        {passport && (
          <p className="text-[11.5px] leading-relaxed text-cocoa/45">
            Privacy details are on the Privacy and Data declaration pages, linked in the footer.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}