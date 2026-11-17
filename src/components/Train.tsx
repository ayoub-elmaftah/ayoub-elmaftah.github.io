import { motion, useMotionValueEvent, type MotionValue } from 'motion/react';
import { useState } from 'react';

/**
 * Le petit métro qui roule sur la ligne du parcours (vue de côté, en SVG).
 * `wheel` : angle des roues (elles tournent quand le train avance).
 * `moving` : 0 → 1, fait apparaître les traits de vitesse et le faisceau du phare.
 */
export default function Train({ wheel, moving }: { wheel: MotionValue<number>; moving: MotionValue<number> }) {
  const [angle, setAngle] = useState(() => wheel.get());
  useMotionValueEvent(wheel, 'change', setAngle);
  const body = 'var(--color-accent)';
  const dark = 'color-mix(in oklab, var(--color-accent) 55%, black)';
  const glass = 'color-mix(in oklab, var(--color-paper) 30%, #bfe8ff)';

  const Wheel = ({ cx }: { cx: number }) => (
    <g>
      <circle cx={cx} cy="47" r="5.2" fill="#1d2027" stroke="#6b7280" strokeWidth="1.2" />
      <g transform={`rotate(${angle} ${cx} 47)`}>
        <path d={`M${cx - 4} 47h8M${cx} 43v8`} stroke="#9aa1ad" strokeWidth="1.1" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy="47" r="1.4" fill="#cfd4dc" />
    </g>
  );

  const Car = ({ x, nose }: { x: number; nose?: boolean }) => (
    <g transform={`translate(${x} 0)`}>
      {/* caisse */}
      <path
        d={nose ? 'M2 14 Q2 10 6 10 H62 Q76 10 82 24 L84 33 Q85 40 78 40 H6 Q2 40 2 36Z' : 'M2 14 Q2 10 6 10 H70 Q74 10 74 14 V36 Q74 40 70 40 H6 Q2 40 2 36Z'}
        fill={body}
      />
      {/* bande basse */}
      <path d={nose ? 'M2 33 H84 Q85 40 78 40 H6 Q2 40 2 36Z' : 'M2 33 H74 V36 Q74 40 70 40 H6 Q2 40 2 36Z'} fill={dark} />
      {/* liseré */}
      <rect x="2" y="30" width={nose ? 82 : 72} height="1.6" fill="rgba(255,255,255,0.55)" />
      {/* fenêtres */}
      {[8, 24, 40].map((wx) => (
        <rect key={wx} x={wx} y="15" width="12" height="10" rx="2.2" fill={glass} />
      ))}
      {!nose && <rect x="56" y="15" width="12" height="10" rx="2.2" fill={glass} />}
      {/* reflets */}
      {[8, 24, 40].map((wx) => (
        <path key={`r${wx}`} d={`M${wx + 2} 23 L${wx + 7} 16`} stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" />
      ))}
      {/* pare-brise + phare */}
      {nose && (
        <>
          <path d="M60 15 H64 Q73 15 77 24 H60Z" fill={glass} />
          <circle cx="81" cy="33" r="1.8" fill="#fff6c8" />
        </>
      )}
      {/* porte */}
      <rect x={nose ? 54 : 52} y="14" width="1.2" height="18" fill={dark} opacity="0.6" />
    </g>
  );

  return (
    <svg viewBox="0 0 172 56" width="196" height="64" aria-hidden style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="beam" x1="0" x2="1">
          <stop offset="0" stopColor="#fff6c8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* faisceau du phare */}
      <motion.path d="M166 33 L220 22 L220 46Z" fill="url(#beam)" style={{ opacity: moving }} />
      {/* traits de vitesse */}
      <motion.g style={{ opacity: moving }} stroke="var(--color-muted)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M-6 18 H-26" />
        <path d="M-10 26 H-38" />
        <path d="M-4 34 H-20" />
      </motion.g>

      {/* pantographe */}
      <path d="M108 10 L116 3 L126 3" stroke="#6b7280" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* wagon arrière + attelage + motrice */}
      <Car x={0} />
      <rect x="74" y="30" width="12" height="3" rx="1" fill="#4b5563" />
      <Car x={84} nose />

      {/* roues */}
      {[14, 58, 100, 146].map((cx) => (
        <Wheel key={cx} cx={cx} />
      ))}
    </svg>
  );
}
