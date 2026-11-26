export function Squiggle({ className = "", flip = false }) {
  return (
    <svg viewBox="0 0 320 24" className={className} fill="none" aria-hidden="true" style={flip ? { transform: "scaleY(-1)" } : undefined}>
      <path d="M2 12C28 2 46 22 72 12S118 2 144 12s46 10 72 0 46-10 72 0" stroke="hsl(var(--cocoa))" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function TrailPath({ className = "" }) {
  return (
    <svg viewBox="0 0 640 120" className={className} fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path
        className="draw-path"
        d="M10 96C90 66 132 22 210 40S318 96 392 74 470 18 540 34s74 40 94 30"
        stroke="hsl(var(--cocoa))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 10"
      />
      <circle cx="10" cy="96" r="6" fill="hsl(var(--cocoa))" />
      <circle cx="634" cy="64" r="7" fill="hsl(var(--lagoon-deep))" />
    </svg>
  );
}

export function StarBurst({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <path d="M32 4v18M32 42v18M4 32h18M42 32h18M12 12l13 13M39 39l13 13M52 12L39 25M25 39L12 52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Blob({ className = "" }) {
  return (
    <div
      className={`animate-blob ${className}`}
      style={{ borderRadius: "46% 54% 44% 56% / 52% 46% 54% 48%" }}
      aria-hidden="true"
    />
  );
}