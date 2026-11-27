import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

/* Shares the café page with the device share sheet, or copies the link when
   the browser has no share sheet. Nothing leaves the app until it is pressed. */
export default function ShareCafeButton({ cafe, variant = "card", className = "" }) {
  const [busy, setBusy] = useState(false);

  const share = async () => {
    if (busy) return;
    const url = `${window.location.origin}/cafes/${cafe.id}`;
    const payload = { title: `${cafe.name} — SanKa`, text: cafe.summary, url };
    setBusy(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied", { description: "Paste it wherever you plan the next stop." });
        return;
      }
      toast.error("This browser cannot share links. Copy the address from the bar instead.");
    } catch (error) {
      if (error?.name === "AbortError") return;
      toast.error("This link could not be shared. Copy the address from the bar instead.");
    } finally {
      setBusy(false);
    }
  };

  const size = variant === "panel" ? "h-10 px-3 text-[12.5px]" : "h-8 w-8";

  return (
    <button
      type="button"
      onClick={share}
      aria-label={`Share ${cafe.name}`}
      title="Share this café"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-cocoa/15 bg-paper text-cocoa/55 transition-all duration-200 hover:border-cocoa/30 hover:text-cocoa active:scale-95 ${size} ${className}`}
    >
      <Share2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      {variant === "panel" && <span className="font-bold">Share</span>}
    </button>
  );
}