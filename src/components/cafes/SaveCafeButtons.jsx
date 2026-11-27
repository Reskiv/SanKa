import { useNavigate } from "@tanstack/react-router";
import { Bookmark, Heart } from "lucide-react";
import { toast } from "sonner";
import { usePassport } from "@/lib/passport";

/* Two small save controls, used on café cards and the café page. They keep the
   same rounded-pill styling as the other chips and stay out of the way when
   the café is not saved. */
export default function SaveCafeButtons({ cafe, variant = "card", className = "" }) {
  const navigate = useNavigate();
  const { passport, ready, toggleFavorite, toggleWantToVisit } = usePassport();
  const favorite = Boolean(passport?.favorites?.[cafe.id]);
  const wanted = Boolean(passport?.wantToVisit?.[cafe.id]);

  const guard = () => {
    if (!ready) return false;
    if (!passport) {
      toast("Create a passport to save cafés", { description: "A name is enough, and it stays in this browser." });
      navigate({ to: "/passport" });
      return false;
    }
    return true;
  };

  const onFavorite = () => {
    if (!guard()) return;
    if (!toggleFavorite(cafe.id)) return;
    toast.success(favorite ? "Removed from favorites" : "Saved to favorites", {
      description: favorite ? cafe.name : `${cafe.name} is in your passport.`,
    });
  };

  const onWant = () => {
    if (!guard()) return;
    if (!toggleWantToVisit(cafe.id)) return;
    toast.success(wanted ? "Removed from want to visit" : "Added to want to visit", {
      description: wanted ? cafe.name : `${cafe.name} is on your list.`,
    });
  };

  const size = variant === "panel" ? "h-10 px-3 text-[12.5px]" : "h-8 w-8";
  const base = `inline-flex items-center justify-center gap-1.5 rounded-full border transition-all duration-200 active:scale-95 ${size}`;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={onFavorite}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${cafe.name} from favorites` : `Save ${cafe.name} to favorites`}
        title={favorite ? "Remove from favorites" : "Save to favorites"}
        className={`${base} ${
          favorite
            ? "border-mint-deep/30 bg-mint-soft text-mint-deep"
            : "border-cocoa/15 bg-paper text-cocoa/55 hover:border-cocoa/30 hover:text-cocoa"
        }`}
      >
        <Heart className={`h-4 w-4 ${favorite ? "fill-mint-deep" : ""}`} strokeWidth={2} aria-hidden="true" />
        {variant === "panel" && <span className="font-bold">{favorite ? "Favorited" : "Favorite"}</span>}
      </button>

      <button
        type="button"
        onClick={onWant}
        aria-pressed={wanted}
        aria-label={wanted ? `Remove ${cafe.name} from want to visit` : `Add ${cafe.name} to want to visit`}
        title={wanted ? "Remove from want to visit" : "Want to visit"}
        className={`${base} ${
          wanted
            ? "border-caramel/60 bg-butter/70 text-cocoa-deep"
            : "border-cocoa/15 bg-paper text-cocoa/55 hover:border-cocoa/30 hover:text-cocoa"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${wanted ? "fill-cocoa-deep" : ""}`} strokeWidth={2} aria-hidden="true" />
        {variant === "panel" && <span className="font-bold">{wanted ? "On your list" : "Want to visit"}</span>}
      </button>
    </div>
  );
}