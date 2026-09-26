/**
 * RangoliDivider – Aesthetic mandala/rangoli section divider
 * Renders a symmetric half-mandala with flowing silk wisps,
 * scattered rose petals and hanging gem chains – pure SVG, zero images.
 */
export default function RangoliDivider({ flip = false, className = '' }) {
  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{ height: 120 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      >
        <defs>
          {/* Warm rose-gold radial gradient for mandala petals */}
          <radialGradient id="rdg-mandala" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#C9A45C" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#9B2043" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7B1030" stopOpacity="0.6" />
          </radialGradient>
          {/* Silk ribbon gradient – left waft */}
          <linearGradient id="rdg-silk-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FADADD" stopOpacity="0" />
            <stop offset="30%" stopColor="#F5C2C7" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#EAA0A8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FADADD" stopOpacity="0" />
          </linearGradient>
          {/* Silk ribbon gradient – right waft */}
          <linearGradient id="rdg-silk-r" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FADADD" stopOpacity="0" />
            <stop offset="30%" stopColor="#F5C2C7" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#EAA0A8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FADADD" stopOpacity="0" />
          </linearGradient>
          {/* Gold chain gradient */}
          <linearGradient id="rdg-chain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C9A45C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E6C687" stopOpacity="0.5" />
          </linearGradient>
          {/* Gem gradient */}
          <radialGradient id="rdg-gem" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F5C2C7" />
            <stop offset="50%" stopColor="#9B2043" />
            <stop offset="100%" stopColor="#5A0A1C" />
          </radialGradient>
          {/* Background warm glow */}
          <radialGradient id="rdg-glow" cx="50%" cy="0%" r="50%">
            <stop offset="0%" stopColor="#FFF0E6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFF8F5" stopOpacity="0" />
          </radialGradient>
          <filter id="rdg-soft">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
          <filter id="rdg-glow-filter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Warm background glow at top center ── */}
        <ellipse cx="600" cy="0" rx="320" ry="80" fill="url(#rdg-glow)" />

        {/* ══ LEFT SILK RIBBON ══ */}
        <path
          d="M0,60 C80,20 180,80 280,45 C360,18 420,55 500,40 C540,33 570,18 600,0"
          fill="none"
          stroke="url(#rdg-silk-l)"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M0,72 C90,35 200,90 310,58 C390,35 450,70 540,52 C575,44 592,26 600,0"
          fill="none"
          stroke="url(#rdg-silk-l)"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* ══ RIGHT SILK RIBBON ══ */}
        <path
          d="M1200,60 C1120,20 1020,80 920,45 C840,18 780,55 700,40 C660,33 630,18 600,0"
          fill="none"
          stroke="url(#rdg-silk-r)"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M1200,72 C1110,35 1000,90 890,58 C810,35 750,70 660,52 C625,44 608,26 600,0"
          fill="none"
          stroke="url(#rdg-silk-r)"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* ══ GOLDEN CHAIN LEFT ══ */}
        <path
          d="M600,0 C590,10 570,18 540,22 C510,26 480,24 450,30 C420,36 395,50 380,70"
          fill="none"
          stroke="url(#rdg-chain)"
          strokeWidth="0.8"
          strokeDasharray="3,2"
          filter="url(#rdg-soft)"
        />
        {/* Chain gem left */}
        <ellipse cx="378" cy="72" rx="4" ry="6" fill="url(#rdg-gem)" opacity="0.9" />
        <ellipse cx="378" cy="72" rx="2" ry="3" fill="#F5C2C7" opacity="0.5" />

        {/* ══ GOLDEN CHAIN RIGHT ══ */}
        <path
          d="M600,0 C610,10 630,18 660,22 C690,26 720,24 750,30 C780,36 805,50 820,70"
          fill="none"
          stroke="url(#rdg-chain)"
          strokeWidth="0.8"
          strokeDasharray="3,2"
          filter="url(#rdg-soft)"
        />
        {/* Chain gem right */}
        <ellipse cx="822" cy="72" rx="4" ry="6" fill="url(#rdg-gem)" opacity="0.9" />
        <ellipse cx="822" cy="72" rx="2" ry="3" fill="#F5C2C7" opacity="0.5" />

        {/* ══ HALF MANDALA at top-center ══ */}
        {/* Outer ring arches */}
        {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((i) => {
          const angle = i * 16 // degrees spread
          const rad = (angle * Math.PI) / 180
          const r = 62
          const x = 600 + r * Math.sin(rad)
          const y = -r * Math.cos(rad) + r
          return (
            <g key={i} transform={`rotate(${angle} 600 0)`}>
              {/* Outer petal arch */}
              <path
                d={`M600,0 C${600 - 14},${20} ${600 - 10},${38} 600,${44} C${600 + 10},${38} ${600 + 14},${20} 600,0`}
                fill="url(#rdg-mandala)"
                opacity={0.55 + Math.abs(i) * 0.02}
                filter={i === 0 ? 'url(#rdg-glow-filter)' : undefined}
              />
              {/* Petal tip gem dot */}
              <circle cx="600" cy="43" r="1.8" fill="#E6C687" opacity="0.9" />
            </g>
          )
        })}

        {/* Inner layer petals (slightly smaller) */}
        {[-4,-3,-2,-1,0,1,2,3,4].map((i) => (
          <g key={`inner-${i}`} transform={`rotate(${i * 12} 600 0)`}>
            <path
              d={`M600,0 C${600 - 9},${14} ${600 - 7},${26} 600,${30} C${600 + 7},${26} ${600 + 9},${14} 600,0`}
              fill="#9B2043"
              opacity={0.5 - Math.abs(i) * 0.04}
            />
          </g>
        ))}

        {/* Innermost mandala center ring */}
        {[-3,-2,-1,0,1,2,3].map((i) => (
          <g key={`core-${i}`} transform={`rotate(${i * 8} 600 0)`}>
            <path
              d={`M600,0 C${600 - 6},${8} ${600 - 4},${16} 600,${19} C${600 + 4},${16} ${600 + 6},${8} 600,0`}
              fill="#C9A45C"
              opacity={0.7}
            />
          </g>
        ))}

        {/* Mandala center gem */}
        <circle cx="600" cy="0" r="5" fill="url(#rdg-gem)" />
        <circle cx="600" cy="0" r="2.5" fill="#F5C2C7" opacity="0.7" />

        {/* ══ HANGING GEM PENDANT ══ */}
        {/* Vertical chain from mandala center down */}
        <line x1="600" y1="44" x2="600" y2="62" stroke="url(#rdg-chain)" strokeWidth="0.8" />
        <line x1="600" y1="62" x2="600" y2="74" stroke="url(#rdg-chain)" strokeWidth="0.8" />
        {/* Top diamond bead */}
        <polygon points="600,62 596,68 600,72 604,68" fill="url(#rdg-gem)" opacity="0.95" />
        <polygon points="600,63 597,67 600,70 603,67" fill="#F5C2C7" opacity="0.4" />
        {/* Bottom teardrop */}
        <path d="M600,72 C596,76 596,82 600,84 C604,82 604,76 600,72" fill="url(#rdg-gem)" opacity="0.95" />
        <ellipse cx="599" cy="77" rx="1.5" ry="2" fill="#F9D5D8" opacity="0.5" />

        {/* ══ DECORATIVE HORIZONTAL DIVIDER LINES ══ */}
        {/* Left line from mandala base */}
        <line x1="0" y1="0.5" x2="530" y2="0.5" stroke="#C9A45C" strokeWidth="0.5" opacity="0.3" />
        {/* Right line */}
        <line x1="670" y1="0.5" x2="1200" y2="0.5" stroke="#C9A45C" strokeWidth="0.5" opacity="0.3" />
        {/* Accent gold dots on lines */}
        {[100,200,300,400,480].map(x => (
          <circle key={x} cx={x} cy="0.5" r="1.5" fill="#C9A45C" opacity="0.4" />
        ))}
        {[720,800,900,1000,1100].map(x => (
          <circle key={x} cx={x} cy="0.5" r="1.5" fill="#C9A45C" opacity="0.4" />
        ))}

        {/* ══ SCATTERED ROSE PETALS ══ */}
        {/* Left petals */}
        <ellipse cx="130" cy="45" rx="8" ry="5" fill="#E8A0A8" opacity="0.5" transform="rotate(-35 130 45)" />
        <ellipse cx="210" cy="28" rx="6" ry="4" fill="#F5C2C7" opacity="0.6" transform="rotate(20 210 28)" />
        <ellipse cx="310" cy="55" rx="7" ry="4.5" fill="#E8A0A8" opacity="0.45" transform="rotate(-55 310 55)" />
        <ellipse cx="420" cy="35" rx="5" ry="3.5" fill="#F5C2C7" opacity="0.5" transform="rotate(15 420 35)" />
        <ellipse cx="72" cy="70" rx="6" ry="4" fill="#E8A0A8" opacity="0.4" transform="rotate(-20 72 70)" />
        <ellipse cx="175" cy="80" rx="5" ry="3" fill="#FADADD" opacity="0.5" transform="rotate(40 175 80)" />
        {/* Right petals */}
        <ellipse cx="1070" cy="45" rx="8" ry="5" fill="#E8A0A8" opacity="0.5" transform="rotate(35 1070 45)" />
        <ellipse cx="990" cy="28" rx="6" ry="4" fill="#F5C2C7" opacity="0.6" transform="rotate(-20 990 28)" />
        <ellipse cx="890" cy="55" rx="7" ry="4.5" fill="#E8A0A8" opacity="0.45" transform="rotate(55 890 55)" />
        <ellipse cx="780" cy="35" rx="5" ry="3.5" fill="#F5C2C7" opacity="0.5" transform="rotate(-15 780 35)" />
        <ellipse cx="1128" cy="70" rx="6" ry="4" fill="#E8A0A8" opacity="0.4" transform="rotate(20 1128 70)" />
        <ellipse cx="1025" cy="80" rx="5" ry="3" fill="#FADADD" opacity="0.5" transform="rotate(-40 1025 80)" />
        {/* A couple near center */}
        <ellipse cx="490" cy="62" rx="5" ry="3" fill="#F5C2C7" opacity="0.45" transform="rotate(30 490 62)" />
        <ellipse cx="710" cy="62" rx="5" ry="3" fill="#F5C2C7" opacity="0.45" transform="rotate(-30 710 62)" />
      </svg>
    </div>
  )
}
