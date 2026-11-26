export default function CatMascot({ variant = "cup", className = "", float = true }) {
  return (
    <svg
      viewBox="0 0 300 320"
      className={`${className} ${float ? "animate-floaty" : ""}`}
      role="img"
      aria-label="SanKa coffee cat mascot"
    >
      {/* tail */}
      <path
        className="cat-tail"
        d="M206 262C240 258 248 230 237 214C229 202 211 205 209 218C207 229 219 233 225 227"
        fill="none"
        stroke="hsl(var(--cocoa))"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* body */}
      <g className="cat-body">
        <path
          d="M150 176C110 176 88 202 88 234C88 268 116 288 150 288C184 288 212 268 212 234C212 202 190 176 150 176Z"
          fill="hsl(var(--paper))"
          stroke="hsl(var(--cocoa))"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* held object */}
        {variant === "cup" && (
          <g>
            <path className="cat-steam-a" d="M137 212C130 203 145 197 139 186" fill="none" stroke="hsl(var(--cocoa-soft))" strokeWidth="6" strokeLinecap="round" />
            <path className="cat-steam-b" d="M163 212C170 203 155 197 161 186" fill="none" stroke="hsl(var(--cocoa-soft))" strokeWidth="6" strokeLinecap="round" />
            <path d="M178 234C198 234 198 262 178 262" fill="none" stroke="hsl(var(--cocoa))" strokeWidth="8" strokeLinecap="round" />
            <rect x="120" y="220" width="58" height="52" rx="17" fill="hsl(var(--lagoon))" stroke="hsl(var(--cocoa))" strokeWidth="8" />
            <path d="M132 240h34" stroke="hsl(var(--paper))" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
          </g>
        )}

        {variant === "map" && (
          <g>
            <path d="M112 224l28-11l24 11l28-11v44l-28 11l-24-11l-28 11z" fill="hsl(var(--lagoon-soft))" stroke="hsl(var(--cocoa))" strokeWidth="7" strokeLinejoin="round" />
            <path d="M122 246c14-9 20 6 34-2s14-10 24-4" fill="none" stroke="hsl(var(--cocoa))" strokeWidth="4" strokeDasharray="5 7" strokeLinecap="round" />
            <circle cx="170" cy="238" r="5" fill="hsl(var(--cocoa))" />
          </g>
        )}

        {variant === "stamp" && (
          <g>
            <circle cx="150" cy="248" r="30" fill="hsl(var(--lagoon))" stroke="hsl(var(--cocoa))" strokeWidth="7" />
            <path d="M150 232l5 11l12 1l-9 8l3 12l-11-6l-11 6l3-12l-9-8l12-1z" fill="hsl(var(--paper))" />
          </g>
        )}

        {/* paws */}
        <ellipse cx="114" cy="252" rx="15" ry="12" fill="hsl(var(--paper))" stroke="hsl(var(--cocoa))" strokeWidth="7" />
        <ellipse cx="186" cy="252" rx="15" ry="12" fill="hsl(var(--paper))" stroke="hsl(var(--cocoa))" strokeWidth="7" />
      </g>

      {/* ears */}
      <path className="cat-ear-l" d="M100 84L86 32L134 62Z" fill="hsl(var(--paper))" stroke="hsl(var(--cocoa))" strokeWidth="8" strokeLinejoin="round" />
      <path className="cat-ear-r" d="M200 84L214 32L166 62Z" fill="hsl(var(--paper))" stroke="hsl(var(--cocoa))" strokeWidth="8" strokeLinejoin="round" />
      <path d="M103 75L96 50L121 64Z" fill="hsl(var(--lagoon))" opacity="0.7" />
      <path d="M197 75L204 50L179 64Z" fill="hsl(var(--lagoon))" opacity="0.7" />

      {/* head */}
      <ellipse cx="150" cy="112" rx="66" ry="58" fill="hsl(var(--paper))" stroke="hsl(var(--cocoa))" strokeWidth="8" />

      {/* cheeks */}
      <circle cx="108" cy="136" r="10" fill="hsl(var(--lagoon))" opacity="0.55" />
      <circle cx="192" cy="136" r="10" fill="hsl(var(--lagoon))" opacity="0.55" />

      {/* eyes */}
      <ellipse className="cat-eye" cx="126" cy="110" rx="6.5" ry="8.5" fill="hsl(var(--cocoa))" />
      <ellipse className="cat-eye cat-eye-b" cx="174" cy="110" rx="6.5" ry="8.5" fill="hsl(var(--cocoa))" />

      {/* nose + mouth */}
      <path d="M150 124l-6 6h12z" fill="hsl(var(--cocoa))" />
      <path d="M150 133c0 7-8 10-12 5M150 133c0 7 8 10 12 5" fill="none" stroke="hsl(var(--cocoa))" strokeWidth="5" strokeLinecap="round" />

      {/* whiskers */}
      <g stroke="hsl(var(--cocoa))" strokeWidth="4" strokeLinecap="round" opacity="0.35">
        <path d="M98 120L74 115" />
        <path d="M98 130L74 135" />
        <path d="M202 120L226 115" />
        <path d="M202 130L226 135" />
      </g>

      {/* scarf */}
      <path d="M96 164Q150 188 204 164L200 182Q150 204 100 182Z" fill="hsl(var(--lagoon))" stroke="hsl(var(--cocoa))" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}