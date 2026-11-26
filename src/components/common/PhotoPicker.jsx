import { useId, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import Photo from "@/components/common/Photo";
import { MAX_PHOTOS, PHOTO_ACCEPT, uploadPhoto } from "@/lib/photoStore";

export default function PhotoPicker({ value = [], onChange, max = MAX_PHOTOS, label = "Add photos", hint }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const remaining = max - value.length;

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    setError("");
    const room = max - value.length;
    const queue = files.slice(0, room);
    if (files.length > room) {
      setError(`You can keep up to ${max} photos. ${files.length - room} were skipped.`);
    }

    setBusy(true);
    const uploaded = [];
    try {
      for (let i = 0; i < queue.length; i += 1) {
        setProgress(`Saving ${i + 1} of ${queue.length}…`);
        try {
          uploaded.push(await uploadPhoto(queue[i]));
        } catch (uploadIssue) {
          setError(uploadIssue.message || "One photo did not upload.");
        }
      }
      if (uploaded.length) onChange([...value, ...uploaded]);
    } finally {
      setBusy(false);
      setProgress("");
    }
  };

  const remove = (uri) => onChange(value.filter((item) => item !== uri));

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="field-label">{label}</span>
        <span className="text-[11px] font-semibold text-cocoa/40">
          {value.length}/{max} · optional
        </span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((uri) => (
          <div key={uri} className="relative">
            <Photo uri={uri} alt="Attached photo" className="aspect-square rounded-[16px] border border-cocoa/10" />
            <button
              type="button"
              onClick={() => remove(uri)}
              aria-label="Remove photo"
              className="absolute -right-1.5 -top-1.5 grid h-7 w-7 place-items-center rounded-full border border-cocoa/15 bg-paper text-cocoa shadow-soft transition-transform active:scale-90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <label
            htmlFor={inputId}
            className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[16px] border-2 border-dashed border-cocoa/20 bg-cream/50 text-center transition-colors hover:border-caramel/60 hover:bg-cream ${
              busy ? "pointer-events-none opacity-70" : ""
            }`}
          >
            {busy ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-cocoa/60" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-5 w-5 text-cocoa/55" aria-hidden="true" />
            )}
            <span className="px-1 text-[11px] font-bold leading-tight text-cocoa/60">{busy ? "Saving" : "Add photo"}</span>
          </label>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={PHOTO_ACCEPT}
        multiple
        className="sr-only"
        onChange={handleFiles}
        disabled={busy || remaining <= 0}
      />

      <p className="mt-2 text-[12px] leading-relaxed text-cocoa/50" aria-live="polite">
        {progress || error || hint || "JPG, PNG or WebP up to 8 MB each. Saved only in this browser."}
      </p>
    </div>
  );
}