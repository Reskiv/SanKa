import { useId } from "react";

/** Soft mint arch — the little window the mascot sits in. */
export function MintArch({ className = "" }) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="hsl(var(--mint-soft))" />
          <stop offset="100%" stopColor="hsl(var(--mint))" />
        </linearGradient>
      </defs>
      <path d="M34 196V96a66 66 0 0 1 132 0v100z" fill={`url(#${id}-fill)`} />
      <path
        d="M34 196V96a66 66 0 0 1 132 0v100"
        fill="none"
        stroke="hsl(var(--mint-deep))"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeDasharray="8 9"
        strokeLinecap="round"
      />
      <circle cx="70" cy="86" r="3" fill="hsl(var(--paper))" fillOpacity="0.8" />
      <circle cx="128" cy="66" r="4" fill="hsl(var(--paper))" fillOpacity="0.7" />
      <circle cx="104" cy="118" r="2.5" fill="hsl(var(--paper))" fillOpacity="0.65" />
    </svg>
  );
}

/** Animated steam curls for cups and the tip jar. */
export function SteamCurls({ className = "" }) {
  return (
    <svg viewBox="0 0 60 44" className={className} fill="none" aria-hidden="true">
      <path className="animate-steam" d="M18 38c-6-7 6-10 0-18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path className="animate-steam-b" d="M30 40c-6-8 6-11 0-20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path className="animate-steam" style={{ animationDelay: "2.4s" }} d="M42 38c-6-7 6-10 0-18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A small cluster of doodled coffee beans. */
export function BeanCluster({ className = "" }) {
  const bean = (rotate, x, y, key) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <ellipse rx="11" ry="7.5" fill="hsl(var(--caramel))" />
      <path d="M-7 0c4-4 10 4 14 0" stroke="hsl(var(--cocoa-deep))" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </g>
  );
  return (
    <svg viewBox="0 0 96 60" className={className} aria-hidden="true">
      {bean(-18, 24, 24, "a")}
      {bean(22, 60, 34, "b")}
      {bean(-6, 44, 48, "c")}
    </svg>
  );
}

/** Four-point sparkle used as a depth accent. */
export function Sparkle({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 1.5c1.2 5.4 3.6 7.8 9 9-5.4 1.2-7.8 3.6-9 9-1.2-5.4-3.6-7.8-9-9 5.4-1.2 7.8-3.6 9-9z" fill="currentColor" />
    </svg>
  );
}

/** Mint wavy divider between stacked sections. */
export function MintWave({ className = "" }) {
  return (
    <svg viewBox="0 0 1200 40" className={className} fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M0 24c120-22 240 22 360 8s240-28 360-8 240 26 360 6 120-8 120-8"
        stroke="hsl(var(--mint-deep))"
        strokeOpacity="0.28"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The tip jar illustration: a mason jar with a heart and a few coins. */
export function TipJarArt({ className = "" }) {
  const id = useId();
  return (
    <svg viewBox="0 0 140 170" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-jar`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="hsl(var(--mint-soft))" />
          <stop offset="100%" stopColor="hsl(var(--mint))" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="158" rx="44" ry="7" fill="hsl(var(--cocoa))" fillOpacity="0.12" />
      <path
        d="M34 54h72v70a22 22 0 0 1-22 22H56a22 22 0 0 1-22-22z"
        fill={`url(#${id}-jar)`}
        stroke="hsl(var(--mint-deep))"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="28" y="40" width="84" height="16" rx="8" fill="hsl(var(--butter))" stroke="hsl(var(--cocoa))" strokeWidth="3" />
      <path
        d="M70 124c-14-9-22-16-22-26a12 12 0 0 1 22-6 12 12 0 0 1 22 6c0 10-8 17-22 26z"
        fill="hsl(var(--paper))"
        stroke="hsl(var(--cocoa))"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="94" r="9" fill="hsl(var(--butter))" stroke="hsl(var(--cocoa))" strokeWidth="2.4" />
      <path d="M42 94h8M46 90v8" stroke="hsl(var(--cocoa))" strokeWidth="2" strokeLinecap="round" />
      <circle cx="98" cy="106" r="7" fill="hsl(var(--butter))" stroke="hsl(var(--cocoa))" strokeWidth="2.2" />
      <path d="M108 34l2.2 6.6L117 43l-6.8 2.4L108 52l-2.2-6.6L99 43l6.8-2.4z" fill="hsl(var(--caramel))" />
      <path d="M26 30l1.6 4.8 4.8 1.6-4.8 1.6L26 43l-1.6-5-4.8-1.6 4.8-1.6z" fill="hsl(var(--mint-deep))" fillOpacity="0.55" />
    </svg>
  );
}