import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Photo from "@/components/common/Photo";

export default function PhotoViewer({ photos = [], startIndex = 0, onClose }) {
  const open = startIndex !== null && startIndex >= 0;
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  if (!open || photos.length === 0) return null;

  const safeIndex = Math.min(Math.max(index, 0), photos.length - 1);
  const go = (step) => setIndex((current) => (current + step + photos.length) % photos.length);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden border-cocoa/15 bg-paper p-3 sm:p-4">
        <DialogTitle className="sr-only">Photo {safeIndex + 1} of {photos.length}</DialogTitle>
        <div
          className="relative"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              go(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              go(-1);
            }
          }}
        >
          <Photo uri={photos[safeIndex]} alt={`Photo ${safeIndex + 1}`} className="max-h-[70vh] rounded-[18px]" imgClassName="h-auto max-h-[70vh] w-full object-contain" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-cocoa shadow-soft transition-transform active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-cocoa shadow-soft transition-transform active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-cocoa shadow-soft transition-transform active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        {photos.length > 1 && (
          <p className="pt-2 text-center text-[12px] font-bold text-cocoa/50">
            {safeIndex + 1} / {photos.length}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}