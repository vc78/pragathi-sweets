/**
 * RangoliDivider – Slim decorative section rule
 * A thin gold line with a miniature half-mandala centrepiece.
 * Height ≈ 36px — sits exactly on the divider line.
 */
export default function RangoliDivider({ flip = false, className = '' }) {
  return (
    <div
      className={`relative w-full overflow-visible pointer-events-none select-none ${className}`}
      style={{ height: 36, marginTop: -1, marginBottom: -1 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 36"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="rdg-m2" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#C9A45C" />
            <stop offset="45%" stopColor="#9B2043" />
            <stop offset="100%" stopColor="#5A0A1C" />
          </radialGradient>
          <radialGradient id="rdg-gem2" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F5C2C7" />
            <stop offset="60%" stopColor="#9B2043" />
            <stop offset="100%" stopColor="#5A0A1C" />
          </radialGradient>
          <linearGradient id="rdg-line-l" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A45C" stopOpacity="0" />
            <stop offset="30%" stopColor="#C9A45C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C9A45C" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="rdg-line-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A45C" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#C9A45C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C9A45C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left line */}
        <line x1="0" y1="4" x2="562" y2="4"
          stroke="url(#rdg-line-l)" strokeWidth="0.75" />

        {/* Right line */}
        <line x1="638" y1="4" x2="1200" y2="4"
          stroke="url(#rdg-line-r)" strokeWidth="0.75" />

        {/* Left accent dots */}
        <circle cx="200" cy="4" r="1.2" fill="#C9A45C" opacity="0.45" />
        <circle cx="380" cy="4" r="1.5" fill="#C9A45C" opacity="0.55" />
        <circle cx="500" cy="4" r="1.2" fill="#C9A45C" opacity="0.45" />

        {/* Right accent dots */}
        <circle cx="700" cy="4" r="1.2" fill="#C9A45C" opacity="0.45" />
        <circle cx="820" cy="4" r="1.5" fill="#C9A45C" opacity="0.55" />
        <circle cx="1000" cy="4" r="1.2" fill="#C9A45C" opacity="0.45" />

        {/* ── Mini Mandala centred at (600, 4) ── */}
        {/* Outer petals (7) */}
        {[-3,-2,-1,0,1,2,3].map((i) => (
          <g key={`op-${i}`} transform={`rotate(${i * 22} 600 4)`}>
            <path
              d="M600,4 C597.5,7 597.5,13 600,15 C602.5,13 602.5,7 600,4"
              fill="url(#rdg-m2)"
              opacity={i === 0 ? 0.95 : 0.65 - Math.abs(i) * 0.05}
            />
          </g>
        ))}

        {/* Inner petals (5) */}
        {[-2,-1,0,1,2].map((i) => (
          <g key={`ip-${i}`} transform={`rotate(${i * 18} 600 4)`}>
            <path
              d="M600,4 C598.5,6 598.5,10 600,11 C601.5,10 601.5,6 600,4"
              fill="#C9A45C"
              opacity={0.75}
            />
          </g>
        ))}

        {/* Centre gem */}
        <circle cx="600" cy="4" r="2.5" fill="url(#rdg-m2)" />
        <circle cx="600" cy="4" r="1.1" fill="#F5C2C7" opacity="0.7" />

        {/* Hanging teardrop gem */}
        <path d="M600,15 C598,18 598,22 600,23 C602,22 602,18 600,15"
          fill="url(#rdg-gem2)" opacity="0.9" />
        <circle cx="599.5" cy="18" r="0.8" fill="#F9D5D8" opacity="0.6" />

        {/* Thin vertical connector */}
        <line x1="600" y1="4" x2="600" y2="15"
          stroke="#C9A45C" strokeWidth="0.5" opacity="0.6" />

        {/* Tiny rose petals near centre */}
        <ellipse cx="570" cy="2" rx="3" ry="1.8"
          fill="#F5C2C7" opacity="0.4" transform="rotate(-25 570 2)" />
        <ellipse cx="630" cy="2" rx="3" ry="1.8"
          fill="#F5C2C7" opacity="0.4" transform="rotate(25 630 2)" />
        <ellipse cx="548" cy="5" rx="2" ry="1.2"
          fill="#E8A0A8" opacity="0.35" transform="rotate(10 548 5)" />
        <ellipse cx="652" cy="5" rx="2" ry="1.2"
          fill="#E8A0A8" opacity="0.35" transform="rotate(-10 652 5)" />
      </svg>
    </div>
  )
}
