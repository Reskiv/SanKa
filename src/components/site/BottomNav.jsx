import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Coffee, Map, BookOpen, Heart } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/cafes", label: "Cafés", icon: Coffee },
  { to: "/map", label: "Map", icon: Map },
  { to: "/passport", label: "Passport", icon: BookOpen },
  { to: "/about", label: "About", icon: Heart },
];

export default function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <nav
        aria-label="Primary"
        className="pointer-events-auto mx-3 mb-3 flex items-center justify-between gap-1 rounded-[26px] border border-cocoa/10 bg-paper/95 p-1.5 shadow-[0_-6px_30px_-18px_hsl(var(--cocoa)/0.6)] backdrop-blur-md safe-bottom"
      >
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[20px] px-0.5 py-1.5 transition-all duration-200 ${
                active ? "bg-mint-soft text-mint-deep shadow-[0_8px_16px_-14px_hsl(var(--mint-deep)/0.9)]" : "text-cocoa/55 active:bg-cocoa/5"
              }`}
            >
              <Icon className="h-[21px] w-[21px]" strokeWidth={2.2} aria-hidden="true" />
              <span className="text-[10.5px] font-bold leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}