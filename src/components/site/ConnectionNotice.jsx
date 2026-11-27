import { useEffect, useState } from "react";
import { CloudOff, Wifi } from "lucide-react";

/* The passport lives in this browser, so nothing is lost while offline. The
   notice only says what is happening, and stays out of the way otherwise. */
export default function ConnectionNotice() {
  const [state, setState] = useState("online");
  const [justBack, setJustBack] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof navigator === "undefined") return;
      setState(navigator.onLine ? "online" : "offline");
    };
    const offline = () => {
      setState("offline");
      setJustBack(false);
    };
    const online = () => {
      setState("online");
      setJustBack(true);
      window.setTimeout(() => setJustBack(false), 4000);
    };
    update();
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => {
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, []);

  if (state === "online" && !justBack) return null;

  const offline = state === "offline";

  return (
    <div className="wrap pt-3">
      <p
        role="status"
        className={`flex items-center gap-2 rounded-[14px] border px-3 py-2 text-[12.5px] font-semibold ${
          offline ? "border-caramel/40 bg-butter/45 text-cocoa" : "border-mint-deep/25 bg-mint-soft/70 text-mint-deep"
        }`}
      >
        {offline ? <CloudOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <Wifi className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
        {offline
          ? "You are offline. Your passport and notes still save in this browser."
          : "Back online. Everything is still saved in this browser."}
      </p>
    </div>
  );
}