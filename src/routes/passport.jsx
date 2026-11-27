import { Route as rootRoute } from "./__root";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Coffee, Heart, MapPin, ShieldCheck, Star, Stamp } from "lucide-react";
import CatMascot from "@/components/brand/CatMascot";
import AvatarPicker from "@/components/passport/AvatarPicker";
import JournalTab from "@/components/journal/JournalTab";
import Photo from "@/components/common/Photo";
import PhotoViewer from "@/components/common/PhotoViewer";
import DataPrivacyDialog from "@/components/passport/DataPrivacyDialog";
import SavedCafes from "@/components/passport/SavedCafes";
import SaveStatus from "@/components/passport/SaveStatus";
import { formatEntryDate, usePassport } from "@/lib/passport";
import { CAFES } from "@/data/cafes";

const VIEWS = ["calendar", "scrapbook", "timeline"];
const TABS = ["passport", "favorites", "want", "coffee"];

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/passport",
  validateSearch: (search) => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
    view: typeof search.view === "string" ? search.view : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your passport — SanKa" },
      { name: "description", content: "Your café stamps, coffee journal and tasting notes, kept in this browser." },
    ],
  }),
  component: PassportPage,
});

function PassportPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const {
    passport, ready, lastSavedAt, create, setAvatar, addCoffee, updateCoffee, deleteCoffee,
    toggleFavorite, toggleWantToVisit,
  } = usePassport();
  const [name, setName] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [viewer, setViewer] = useState({ photos: [], index: null });

  const tab = TABS.includes(search.tab) ? search.tab : "passport";
  const view = VIEWS.includes(search.view) ? search.view : "scrapbook";

  const visited = useMemo(
    () => (passport ? CAFES.filter((cafe) => passport.visits[cafe.id]) : []),
    [passport],
  );
  const notes = useMemo(
    () =>
      passport
        ? CAFES.map((cafe) => ({ cafe, review: passport.reviews[cafe.id] })).filter((item) => item.review)
        : [],
    [passport],
  );
  const coffeeCount = passport?.coffees?.length || 0;

  const setTab = (nextTab) =>
    navigate({ to: "/passport", search: { tab: nextTab, view: nextTab === "coffee" ? view : undefined }, replace: true });

  const setView = (nextView) =>
    navigate({ to: "/passport", search: { tab: "coffee", view: nextView }, replace: true });

  return (
    <div className="pb-10">
      <div className="wrap pt-6 md:pt-8">
        {!ready && <div className="skeleton h-40 w-full" />}

        {ready && !passport && (
          <div className="mx-auto max-w-md">
            <div className="card p-6 text-center sm:p-8">
              <div className="relative mx-auto w-[130px]">
                <div className="animate-blob absolute inset-0 bg-butter/60" style={{ borderRadius: "50% 50% 46% 54% / 46% 54% 46% 54%" }} />
                <CatMascot variant="stamp" className="relative h-[130px] w-[130px]" />
              </div>
              <h1 className="mt-4 font-heading text-[26px] font-extrabold text-cocoa">Start your café passport</h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-cocoa/65">
                One name, kept on this device. Then stamp cafés, keep notes and fill a coffee journal.
              </p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  create(name);
                }}
                className="mt-5 text-left"
              >
                <label htmlFor="passport-name" className="field-label">
                  Name on the passport
                </label>
                <input
                  id="passport-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={40}
                  placeholder="e.g. Mika"
                  className="field mt-1.5"
                />
                <button type="submit" className="btn btn-primary mt-4 w-full">
                  Create passport
                </button>
              </form>
              <p className="mt-3 text-[12px] text-cocoa/45">
                Stamps, notes and photos stay in this browser. No account needed.
              </p>
            </div>
          </div>
        )}

        {ready && passport && (
          <>
            <section className="card p-4 sm:p-5" aria-label="Passport profile">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <AvatarPicker uri={passport.avatar} onSave={setAvatar} onRemove={() => setAvatar(null)} />

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="eyebrow">Café passport</p>
                  <h1 className="mt-1 font-heading text-[26px] font-extrabold leading-tight text-cocoa sm:text-[30px]">
                    {passport.name}
                  </h1>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-cocoa/60">
                    {visited.length} of {CAFES.length} cafés stamped · {coffeeCount} {coffeeCount === 1 ? "coffee" : "coffees"} logged
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { label: "Stamps", value: visited.length, icon: Stamp },
                      { label: "Notes", value: notes.length, icon: Star },
                      { label: "Coffees", value: coffeeCount, icon: Coffee },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-[16px] border border-cocoa/10 bg-cream/60 px-2 py-2 text-center">
                        <stat.icon className="mx-auto h-3.5 w-3.5 text-lagoon-deep" aria-hidden="true" />
                        <p className="mt-1 font-heading text-[17px] font-extrabold leading-none text-cocoa">{stat.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-cocoa/45">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <SaveStatus lastSavedAt={lastSavedAt} className="mt-2.5 justify-center sm:justify-start" />
                </div>
              </div>

              <div role="group" aria-label="Passport section" className="mt-4 grid grid-cols-2 gap-1 rounded-[26px] border border-cocoa/10 bg-cream/80 p-1 sm:flex sm:rounded-full">
                <button
                  type="button"
                  onClick={() => setTab("passport")}
                  aria-pressed={tab === "passport"}
                  className={`tab-pill justify-center sm:flex-1 ${tab === "passport" ? "tab-pill-active" : ""}`}
                >
                  <BookOpen className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Passport
                </button>
                <button
                  type="button"
                  onClick={() => setTab("favorites")}
                  aria-pressed={tab === "favorites"}
                  className={`tab-pill justify-center sm:flex-1 ${tab === "favorites" ? "tab-pill-active" : ""}`}
                >
                  <Heart className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Favorites
                </button>
                <button
                  type="button"
                  onClick={() => setTab("want")}
                  aria-pressed={tab === "want"}
                  className={`tab-pill justify-center sm:flex-1 ${tab === "want" ? "tab-pill-active" : ""}`}
                >
                  <MapPin className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Want to visit
                </button>
                <button
                  type="button"
                  onClick={() => setTab("coffee")}
                  aria-pressed={tab === "coffee"}
                  className={`tab-pill justify-center sm:flex-1 ${tab === "coffee" ? "tab-pill-active" : ""}`}
                >
                  <Coffee className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Coffee
                </button>
              </div>
            </section>

            <div className="mt-5">
              {tab === "coffee" ? (
                <JournalTab
                  passport={passport}
                  view={view}
                  onViewChange={setView}
                  addCoffee={addCoffee}
                  updateCoffee={updateCoffee}
                  deleteCoffee={deleteCoffee}
                />
              ) : tab === "favorites" ? (
                <SavedCafes kind="favorites" passport={passport} onRemove={toggleFavorite} />
              ) : tab === "want" ? (
                <SavedCafes kind="wantToVisit" passport={passport} onRemove={toggleWantToVisit} />
              ) : (
                <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-start">
                  <div className="space-y-5">
                    <section className="card p-4 sm:p-5" aria-labelledby="stamps-heading">
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 id="stamps-heading" className="font-heading text-[19px] font-bold text-cocoa">
                          Collected stamps
                        </h2>
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cocoa/40">
                          {visited.length}/{CAFES.length}
                        </span>
                      </div>

                      {visited.length === 0 ? (
                        <div className="mt-4 rounded-[18px] border border-dashed border-cocoa/20 bg-cream/40 p-6 text-center">
                          <p className="text-[14px] text-cocoa/65">No stamps yet. Mark a visit on any café page.</p>
                          <Link to="/cafes" className="btn btn-soft mt-3 !py-2 text-[13px]">
                            Find a café
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                          {visited.map((cafe) => (
                            <Link
                              key={cafe.id}
                              to="/cafes/$cafeId"
                              params={{ cafeId: cafe.id }}
                              className="group flex flex-col items-center rounded-[18px] border border-cocoa/10 bg-cream/50 p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-caramel/50 active:scale-[0.98]"
                            >
                              <span className="stamp-ring h-14 w-14 transition-colors group-hover:border-lagoon-deep">
                                <span className="font-heading text-[19px] font-extrabold leading-none">{cafe.name.charAt(0)}</span>
                              </span>
                              <span className="mt-2 text-[12.5px] font-bold leading-tight text-cocoa">{cafe.name}</span>
                              <span className="text-[10.5px] text-cocoa/45">{formatEntryDate(passport.visits[cafe.id]?.slice(0, 10))}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </section>

                    <section className="card p-4 sm:p-5" aria-labelledby="notes-heading">
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 id="notes-heading" className="font-heading text-[19px] font-bold text-cocoa">
                          Tasting notes
                        </h2>
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cocoa/40">{notes.length}</span>
                      </div>

                      {notes.length === 0 ? (
                        <div className="mt-4 rounded-[18px] border border-dashed border-cocoa/20 bg-cream/40 p-6 text-center">
                          <p className="text-[14px] text-cocoa/65">No notes yet. Rate a café you have visited.</p>
                          <Link to="/cafes" className="btn btn-soft mt-3 !py-2 text-[13px]">
                            Pick a café
                          </Link>
                        </div>
                      ) : (
                        <ul className="mt-3 space-y-2">
                          {notes.map(({ cafe, review }) => (
                            <li key={cafe.id} className="rounded-[18px] border border-cocoa/10 bg-cream/50 p-3">
                              <div className="flex items-baseline justify-between gap-2">
                                <Link
                                  to="/cafes/$cafeId"
                                  params={{ cafeId: cafe.id }}
                                  className="font-heading text-[15px] font-bold text-cocoa hover:text-lagoon-deep"
                                >
                                  {cafe.name}
                                </Link>
                                <span className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5`}>
                                  {[1, 2, 3, 4, 5].map((n) => (
                                    <Star key={n} className={`h-3 w-3 ${n <= review.rating ? "fill-caramel text-caramel" : "text-cocoa/20"}`} strokeWidth={1.8} />
                                  ))}
                                </span>
                              </div>
                              {review.text && <p className="mt-1 text-[13.5px] leading-relaxed text-cocoa/70">{review.text}</p>}
                              {review.photos?.length > 0 && (
                                <div className="mt-2 flex gap-1.5">
                                  {review.photos.map((uri, index) => (
                                    <button
                                      key={uri}
                                      type="button"
                                      onClick={() => setViewer({ photos: review.photos, index })}
                                      aria-label={`Open photo ${index + 1} of ${review.photos.length}`}
                                      className="transition-transform active:scale-95"
                                    >
                                      <Photo uri={uri} alt="" className="h-14 w-14 rounded-[12px] border border-cocoa/10" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  </div>

                  <aside className="space-y-4 lg:sticky lg:top-20">
                    <div className="rounded-[22px] border border-cocoa/10 bg-butter/45 p-5">
                      <p className="font-heading text-[17px] font-bold text-cocoa">Keep going</p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-cocoa/70">
                        {coffeeCount === 0
                          ? "Log your first coffee and the journal will fill itself in."
                          : `${coffeeCount} ${coffeeCount === 1 ? "coffee" : "coffees"} remembered so far.`}
                      </p>
                      <div className="mt-3 flex flex-col gap-2">
                        <button type="button" onClick={() => setTab("coffee")} className="btn btn-primary !py-2.5 text-[13px]">
                          <Coffee className="h-4 w-4" /> Open coffee journal
                        </button>
                        <Link to="/map" className="btn btn-ghost !py-2.5 text-[13px]">
                          Open the map <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="card p-5">
                      <p className="eyebrow">This device only</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-cocoa/60">
                        Stamps, favorites, journal entries and photos are saved in this browser. Back it up or delete it whenever you like.
                      </p>
                      <button type="button" onClick={() => setPrivacyOpen(true)} className="btn btn-ghost mt-3 w-full !py-2 text-[12.5px]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Data &amp; privacy
                      </button>
                    </div>
                  </aside>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <PhotoViewer
        photos={viewer.photos}
        startIndex={viewer.index ?? -1}
        onClose={() => setViewer({ photos: [], index: null })}
      />

      <DataPrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </div>
  );
}