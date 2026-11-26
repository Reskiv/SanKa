import { Coffee } from "lucide-react";
import { usePhotoUrl } from "@/lib/photoStore";

export default function Photo({ uri, alt = "", className = "", imgClassName = "h-full w-full object-cover" }) {
  const { url, loading, failed } = usePhotoUrl(uri);

  return (
    <div className={`relative overflow-hidden bg-cream ${className}`}>
      {loading && <div className="absolute inset-0 animate-pulse bg-cocoa/10" aria-hidden="true" />}
      {!loading && (failed || !url) && (
        <div className="absolute inset-0 grid place-items-center text-cocoa/30" aria-hidden="true">
          <span className="flex flex-col items-center gap-1"><Coffee className="h-6 w-6" strokeWidth={1.8} />{failed && <span className="text-[10px]">Photo unavailable</span>}</span>
        </div>
      )}
      {url && <img src={url} alt={alt} className={imgClassName} loading="lazy" />}
    </div>
  );
}