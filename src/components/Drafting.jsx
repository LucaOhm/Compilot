// Zeichenwerkzeuge und Planelemente als ruhige Gestaltungselemente im Hintergrund.
// Keine Animation – sie sollen wie Hinweise auf einem Zeichentisch wirken.

/** Maßkette: |←— Text —→| */
export function Dim({ children, className = '' }) {
  return (
    <span className={`dim ${className}`} aria-hidden="true">
      <span className="dim__line" />
      <span className="dim__label mono">{children}</span>
      <span className="dim__line" />
    </span>
  );
}

/** Geodreieck */
export function SetSquare({ className = '', ...rest }) {
  const ticks = Array.from({ length: 39 }, (_, i) => i);
  return (
    <svg className={`draft ${className}`} viewBox="0 0 400 206" aria-hidden="true" {...rest}>
      <path d="M3 203 L397 203 L200 6 Z" />
      <path d="M128 180 L272 180 L200 108 Z" />
      {ticks.map((i) => (
        <line key={i} x1={10 + i * 10} y1="203" x2={10 + i * 10} y2={i % 5 === 0 ? 188 : 195} />
      ))}
      <path d="M140 203 A60 60 0 0 1 260 203" />
      <path d="M110 203 A90 90 0 0 1 290 203" strokeDasharray="2 4" />
    </svg>
  );
}

/** Zirkel mit gezogenem Bogen */
export function Compass({ className = '', ...rest }) {
  return (
    <svg className={`draft ${className}`} viewBox="0 0 300 300" aria-hidden="true" {...rest}>
      <circle cx="150" cy="210" r="120" strokeDasharray="1 0" />
      <circle cx="150" cy="210" r="3" />
      <line x1="150" y1="210" x2="200" y2="30" />
      <line x1="270" y1="210" x2="200" y2="30" />
      <circle cx="200" cy="30" r="7" />
      <line x1="200" y1="23" x2="200" y2="6" />
      <line x1="176" y1="120" x2="236" y2="120" />
    </svg>
  );
}

/** Grundriss-Fragment mit Türaufschlägen, Achsen und Maßkette */
export function PlanFragment({ className = '', ...rest }) {
  return (
    <svg className={`draft ${className}`} viewBox="0 0 520 360" aria-hidden="true" {...rest}>
      {/* Achsen */}
      {[60, 220, 380].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="20" x2={x} y2="330" strokeDasharray="14 4 2 4" />
          <circle cx={x} cy="14" r="10" />
          <text x={x} y="18" textAnchor="middle">{String.fromCharCode(65 + i)}</text>
        </g>
      ))}
      {/* Wände */}
      <path d="M40 60 H480 V300 H40 Z" strokeWidth="3" />
      <path d="M220 60 V150 M220 200 V300 M40 180 H160 M280 180 H480" strokeWidth="3" />
      {/* Türaufschläge */}
      <path d="M220 150 A50 50 0 0 1 270 200 M220 200 H270" />
      <path d="M160 180 A40 40 0 0 0 200 220 M200 180 V220" />
      {/* Fenster */}
      <path d="M90 60 H170 M90 56 H170 M90 64 H170 M300 300 H420 M300 296 H420 M300 304 H420" />
      {/* Treppe */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={300 + i * 18} y1="190" x2={300 + i * 18} y2="250" />
      ))}
      <path d="M300 220 H440 M430 214 L440 220 L430 226" />
      {/* Maßkette */}
      <path d="M40 340 H480 M40 334 V346 M220 334 V346 M480 334 V346" />
      <text x="130" y="332" textAnchor="middle">8,00</text>
      <text x="350" y="332" textAnchor="middle">10,40</text>
    </svg>
  );
}

/** Nordpfeil + Maßstabsleiste */
export function NorthScale({ className = '' }) {
  return (
    <svg className={`draft ${className}`} viewBox="0 0 220 70" aria-hidden="true">
      <circle cx="30" cy="35" r="22" />
      <path d="M30 13 L38 45 L30 39 L22 45 Z" />
      <text x="30" y="10" textAnchor="middle">N</text>
      <path d="M70 50 H210 M70 44 V56 M105 46 V54 M140 44 V56 M175 46 V54 M210 44 V56" />
      <rect x="70" y="47" width="35" height="6" className="fill" />
      <rect x="140" y="47" width="35" height="6" className="fill" />
      <text x="70" y="38">0</text>
      <text x="205" y="38">5 m</text>
    </svg>
  );
}

/** Plankopf (Schriftfeld) – wie auf einem Bauplan */
export function TitleBlock({ rows, className = '' }) {
  return (
    <div className={`titleblock mono ${className}`} aria-hidden="true">
      {rows.map(([k, v]) => (
        <div key={k}>
          <span>{k}</span>
          <strong>{v}</strong>
        </div>
      ))}
    </div>
  );
}

/** Linien-Illustration: kleines Architekturbüro (fiktiv) */
export function OfficeIllustration({ className = '' }) {
  return (
    <svg className={`office-ill ${className}`} viewBox="0 0 560 360" role="img" aria-label="Illustration eines kleinen Architekturbüros">
      {/* Raum */}
      <path d="M20 320 H540" className="o-strong" />
      {/* Fensterband */}
      <rect x="40" y="30" width="300" height="150" />
      {[115, 190, 265].map((x) => (
        <line key={x} x1={x} y1="30" x2={x} y2="180" />
      ))}
      <line x1="40" y1="70" x2="340" y2="70" />
      {/* Stadt-Silhouette im Fenster */}
      <path d="M40 180 V150 H70 V120 H95 V150 H130 V105 H150 V95 H170 V150 H205 V130 H240 V150 H270 V115 H300 V150 H340" className="o-faint" />
      {/* Pinnwand mit Plänen */}
      <rect x="372" y="34" width="150" height="104" />
      <rect x="384" y="46" width="60" height="44" className="o-paper" />
      <path d="M390 82 H438 M390 74 H420 M390 56 H438 V82" className="o-faint" />
      <rect x="452" y="46" width="58" height="80" className="o-paper" />
      <circle cx="481" cy="76" r="18" className="o-faint" />
      <path d="M463 76 H499 M481 58 V94" className="o-faint" />
      <rect x="384" y="98" width="60" height="28" className="o-accent-fill" />
      {/* Langer Arbeitstisch */}
      <path d="M40 232 H400" className="o-strong" />
      <path d="M60 232 V320 M380 232 V320" />
      {/* Bildschirme */}
      <rect x="80" y="178" width="84" height="50" />
      <path d="M122 228 V232" />
      <rect x="236" y="178" width="84" height="50" />
      <path d="M278 228 V232" />
      <path d="M92 192 H150 M92 202 H136 M92 212 H144" className="o-faint" />
      <path d="M250 214 L268 196 L284 208 L306 188" className="o-accent" />
      {/* Lampe */}
      <path d="M200 232 V196 L222 170" />
      <path d="M212 162 L236 178 L226 186 Z" />
      {/* Personen */}
      {[
        [122, 262],
        [278, 262],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y - 26} r="14" className="o-paper" />
          <path d={`M${x - 26} ${y + 20} C${x - 26} ${y - 6} ${x + 26} ${y - 6} ${x + 26} ${y + 20}`} className="o-paper" />
        </g>
      ))}
      {/* Modelltisch mit Holzmodell */}
      <path d="M428 262 H532 M440 262 V320 M520 262 V320" className="o-strong" />
      <path d="M446 262 V226 H476 V262 M476 238 H512 V262 M446 226 L461 212 L476 226" />
      <path d="M454 238 H468 M454 248 H468 M484 248 H504" className="o-faint" />
      {/* Person am Modell */}
      <circle cx="486" cy="168" r="14" className="o-paper" />
      <path d="M460 212 C460 186 512 186 512 212" className="o-paper" />
      {/* Planrolle + Pflanze */}
      <path d="M520 320 L548 250" />
      <ellipse cx="548" cy="248" rx="5" ry="3" />
      <path d="M18 320 V292 H46 V320" />
      <path d="M32 292 C20 270 24 254 32 244 C40 254 44 270 32 292 M32 292 C14 282 8 270 10 260 M32 292 C50 282 56 270 54 260" className="o-faint" />
    </svg>
  );
}
