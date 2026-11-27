import { Link, useRouterState } from "@tanstack/react-router";
import { StarBurst } from "@/components/brand/Doodles";
import BottomNav from "@/components/site/BottomNav";
import ConnectionNotice from "@/components/site/ConnectionNotice";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/cafes", label: "Cafés" },
  { to: "/map", label: "Map" },
  { to: "/passport", label: "Passport" },
  { to: "/about", label: "About" },
];

const LEGAL = [
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/data-declaration", label: "Data declaration" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-oat/85 backdrop-blur-md">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="group flex items-baseline gap-1.5" aria-label="SanKa home">
          <span className="font-heading text-[26px] font-extrabold leading-none tracking-tight text-cocoa">
            San<span className="text-lagoon-deep">Ka</span>
          </span>
          <StarBurst className="mb-1 h-3.5 w-3.5 text-cocoa/50 transition-transform duration-500 group-hover:rotate-90" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors duration-300 ${
                  active ? "text-cocoa" : "text-cocoa/60 hover:text-cocoa"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-[2px] origin-left rounded-full bg-lagoon-deep transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
          <Link to="/" hash="contact" className="btn btn-primary ml-3 !px-5 !py-2.5 text-[14px]">
            Say hello
          </Link>
        </nav>

        <Link
          to="/"
          hash="contact"
          className="inline-flex items-center gap-1.5 rounded-full bg-cocoa px-4 py-2 text-[13px] font-semibold text-paper md:hidden"
        >
          Say hello
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-cocoa/15 bg-oat pb-[88px] md:pb-0">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-heading text-[24px] font-extrabold text-cocoa">SanKa</p>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-cocoa/70">
            A little café passport for explorers, students, remote workers and anyone new to the neighbourhood.
          </p>
          <p className="mt-5 font-hand text-[22px] text-lagoon-deep">good coffee, great little detours</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-[15px] text-cocoa/75">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-cocoa">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2 text-[15px] text-cocoa/75">
            <li>Email to be added</li>
            <li>Phone to be added</li>
            <li>Address to be added</li>
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-cocoa/10 py-6 text-[13px] text-cocoa/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} SanKa. Café listings are sample data for now.</p>
        <p>Map tiles © Esri · © OpenStreetMap contributors</p>
      </div>
      <div className="wrap border-t border-cocoa/10 py-4">
        <nav aria-label="Policies" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-cocoa/50">
          {LEGAL.map((item, index) => (
            <span key={item.to} className="inline-flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-cocoa/25">·</span>}
              <Link to={item.to} className="transition-colors hover:text-cocoa">
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default function SiteShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <ConnectionNotice />
      <main id="main-content" className="flex-1 pb-[92px] md:pb-0">
        {children}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}