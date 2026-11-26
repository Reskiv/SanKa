import { useRef, useState } from "react";
import { Camera, LoaderCircle, Trash2 } from "lucide-react";
import Photo from "@/components/common/Photo";
import CatMascot from "@/components/brand/CatMascot";
import { uploadPhoto } from "@/lib/photoStore";

export default function AvatarPicker({ uri, onSave, onRemove }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const uploaded = await uploadPhoto(file);
      if (onSave(uploaded) === false) throw new Error("Your profile photo could not be saved. Please try again.");
    } catch (uploadIssue) {
      setError(uploadIssue.message || "That photo did not upload. Try another one.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[104px] w-[104px] shrink-0">
        <div className="absolute inset-0 rounded-full bg-butter/70" aria-hidden="true" />
        {uri ? (
          <Photo uri={uri} alt="Your profile photo" className="!absolute inset-0 rounded-full border-4 border-paper shadow-soft" />
        ) : (
          <CatMascot variant="stamp" float={false} className="absolute inset-0 h-full w-full p-1" />
        )}
        {busy && (
          <span className="absolute inset-0 grid place-items-center rounded-full bg-paper/70">
            <LoaderCircle className="h-5 w-5 animate-spin text-cocoa" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-full border border-cocoa/15 bg-paper px-2.5 py-1 text-[11px] font-bold text-cocoa transition-colors hover:bg-cream disabled:opacity-60"
        >
          <Camera className="h-3 w-3" /> {uri ? "Change" : "Add photo"}
        </button>
        {uri && (
          <button
            type="button"
            onClick={() => {
              if (onRemove() === false) return;
              setError("");
            }}
            aria-label="Remove profile photo"
            className="grid h-6 w-6 place-items-center rounded-full border border-cocoa/15 bg-paper text-cocoa/60 transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFile} disabled={busy} aria-label="Upload a profile photo" />
      <p className="max-w-[150px] text-center text-[10.5px] leading-tight text-cocoa/45" aria-live="polite">
        {error || (busy ? "Saving…" : "JPG or PNG up to 8 MB")}
      </p>
    </div>
  );
}