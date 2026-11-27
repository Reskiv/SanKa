import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Camera, Check, PenLine, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Photo from "@/components/common/Photo";
import PhotoPicker from "@/components/common/PhotoPicker";
import PhotoViewer from "@/components/common/PhotoViewer";
import SaveCafeButtons from "@/components/cafes/SaveCafeButtons";
import ShareCafeButton from "@/components/cafes/ShareCafeButton";
import { usePassport } from "@/lib/passport";

export default function VisitPanel({ cafe }) {
  const { passport, ready, markVisited, saveReview, removeReview } = usePassport();
  const saved = passport?.reviews?.[cafe.id];
  const visited = Boolean(passport?.visits?.[cafe.id]);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(saved?.rating || 0);
  const [text, setText] = useState(saved?.text || "");
  const [photos, setPhotos] = useState(saved?.photos || []);
  const [viewer, setViewer] = useState({ photos: [], index: -1 });

  useEffect(() => {
    setRating(saved?.rating || 0);
    setText(saved?.text || "");
    setPhotos(saved?.photos || []);
  }, [saved?.rating, saved?.text, saved?.photos]);

  const resetForm = () => {
    setRating(saved?.rating || 0);
    setText(saved?.text || "");
    setPhotos(saved?.photos || []);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!rating) {
      toast.error("Pick a star rating first.");
      return;
    }
    if (!saveReview(cafe.id, { rating, text: text.trim(), photos })) return;
    setEditing(false);
    toast.success(saved ? "Review updated" : "Review saved, stamp collected");
  };

  return (
    <aside className="card p-4 sm:p-5">
      <p className="eyebrow">Your visit</p>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {ready && passport && <SaveCafeButtons cafe={cafe} variant="panel" />}
        <ShareCafeButton cafe={cafe} variant="panel" />
      </div>

      {!ready && <p className="mt-3 text-[14px] text-cocoa/55">Checking your passport…</p>}

      {ready && !passport && (
        <>
          <h2 className="mt-2 font-heading text-[19px] font-bold text-cocoa">Collect a stamp here</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-cocoa/65">
            A passport is just a name and a browser. Create one to mark visits, keep notes and add photos.
          </p>
          <Link to="/passport" className="btn btn-primary mt-4 w-full !py-2.5 text-[14px]">
            Create your passport
          </Link>
        </>
      )}

      {ready && passport && (
        <>
          <div className="mt-2 flex items-center justify-between gap-2">
            <h2 className="font-heading text-[19px] font-bold text-cocoa">
              {saved ? "Your note" : visited ? "Marked as visited" : "Been here?"}
            </h2>
            {visited && (
              <span className="inline-flex items-center gap-1 rounded-full bg-butter/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cocoa-deep">
                <Check className="h-3 w-3" /> Stamped
              </span>
            )}
          </div>

          {!visited && (
            <>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-cocoa/65">
                Mark the visit and SanKa keeps a stamp for this café in your passport.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!markVisited(cafe.id)) return;
                  toast.success("Visit saved, stamp collected");
                }}
                className="btn btn-primary mt-4 w-full !py-2.5 text-[14px]"
              >
                Mark as visited
              </button>
            </>
          )}

          {visited && saved && !editing && (
            <div className="mt-3 rounded-[18px] border border-cocoa/10 bg-cream/50 p-3">
              <div className="flex items-center gap-1" aria-label={`${saved.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`h-4 w-4 ${n <= saved.rating ? "fill-caramel text-caramel" : "text-cocoa/20"}`} strokeWidth={1.8} />
                ))}
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-cocoa/75">{saved.text || "No written note."}</p>

              {saved.photos?.length > 0 && (
                <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                  {saved.photos.map((uri, index) => (
                    <button
                      key={uri}
                      type="button"
                      onClick={() => setViewer({ photos: saved.photos, index })}
                      aria-label={`Open photo ${index + 1} of ${saved.photos.length}`}
                      className="transition-transform active:scale-95"
                    >
                      <Photo uri={uri} alt={`${cafe.name} visit photo ${index + 1}`} className="aspect-square rounded-[12px] border border-cocoa/10" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setEditing(true);
                  }}
                  className="btn btn-ghost !px-3 !py-1.5 text-[12.5px]"
                >
                  <PenLine className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!removeReview(cafe.id)) return;
                    toast.success("Review removed");
                  }}
                  className="btn btn-ghost !px-3 !py-1.5 text-[12.5px]"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          )}

          {visited && (!saved || editing) && (
            <form onSubmit={submit} className="mt-3">
              <fieldset>
                <legend className="field-label">How was it?</legend>
                <div className="mt-1 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                      aria-pressed={rating === n}
                      className="rounded-full p-1 transition-transform duration-150 active:scale-90"
                    >
                      <Star className={`h-6 w-6 ${n <= rating ? "fill-caramel text-caramel" : "text-cocoa/20"}`} strokeWidth={1.8} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="review-note" className="field-label mt-3 block">
                A little note (optional)
              </label>
              <textarea
                id="review-note"
                rows={3}
                value={text}
                maxLength={400}
                onChange={(event) => setText(event.target.value)}
                placeholder="Quiet corner, good light, the pastry to order…"
                className="field mt-1.5 resize-none"
              />

              <div className="mt-3">
                <PhotoPicker value={photos} onChange={setPhotos} label="Photos" hint="Optional. Saved only in this browser." />
              </div>

              <div className="mt-3 flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 !py-2.5 text-[14px]">
                  {saved ? "Save changes" : "Save review"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setEditing(false);
                    }}
                    className="btn btn-ghost !py-2.5 text-[14px]"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {photos.length > 0 && (
                <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-cocoa/45">
                  <Camera className="h-3 w-3" /> {photos.length} photo{photos.length > 1 ? "s" : ""} attached
                </p>
              )}
            </form>
          )}
        </>
      )}

      <PhotoViewer
        photos={viewer.photos}
        startIndex={viewer.index}
        onClose={() => setViewer({ photos: [], index: -1 })}
      />
    </aside>
  );
}