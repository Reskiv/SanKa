import { useEffect, useState } from "react";
import { Check } from "lucide-react";

function relative(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 20) return "just now";
  if (seconds < 90) return "a minute ago";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/* A quiet save indicator: it says where the data went and when it last did,
   without asking for attention. */
export default function SaveStatus({ lastSavedAt, className = "" }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className={`flex items-center gap-1.5 text-[11.5px] font-semibold text-cocoa/45 ${className}`} role="status">
      <Check className="h-3 w-3 text-mint-deep" aria-hidden="true" />
      Saved in this browser{lastSavedAt ? ` · ${relative(lastSavedAt)}` : ""}
    </p>
  );
}