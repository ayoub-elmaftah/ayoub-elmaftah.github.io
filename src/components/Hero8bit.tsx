import type { Direction } from './SokobanGame';

/**
 * Le personnage du mini-Sokoban : un petit dev en sweat à capuche, dessiné en SVG.
 * Une image différente pour chaque direction (comme dans le jeu JavaFX).
 * Pour mettre un autre personnage : remplace ce composant, ou affiche 4 images selon `dir`.
 */
export default function Hero8bit({ dir, size }: { dir: Direction; size: number }) {
  const skin = '#f2c9a0';
  const hair = '#2a1d16';
  const hoodie = 'var(--color-accent)';
  const shade = 'color-mix(in oklab, var(--color-accent) 70%, black)';
  const flip = dir === 'gauche' ? 'scale(-1,1) translate(-32,0)' : undefined;

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden style={{ overflow: 'visible' }}>
      {/* ombre au sol */}
      <ellipse cx="16" cy="29.5" rx="8" ry="1.8" fill="rgba(0,0,0,0.28)" />
      <g transform={flip}>
        {/* jambes */}
        <rect x="11.5" y="23" width="3.5" height="5.5" rx="1.2" fill="#2b2f3a" />
        <rect x="17" y="23" width="3.5" height="5.5" rx="1.2" fill="#2b2f3a" />
        {/* corps (sweat) */}
        <rect x="9" y="14" width="14" height="11" rx="4" fill={hoodie} />
        {dir === 'bas' && <path d="M14 15.5 L16 18 L18 15.5" stroke={shade} strokeWidth="1" fill="none" strokeLinecap="round" />}
        {dir === 'haut' && <path d="M11 15 Q16 19 21 15" fill={shade} />}
        {/* bras */}
        {(dir === 'bas' || dir === 'haut') && (
          <>
            <rect x="6.5" y="15" width="3.2" height="8" rx="1.6" fill={shade} />
            <rect x="22.3" y="15" width="3.2" height="8" rx="1.6" fill={shade} />
          </>
        )}
        {(dir === 'droite' || dir === 'gauche') && <rect x="14.5" y="15.5" width="3.4" height="8" rx="1.7" fill={shade} />}

        {/* tête */}
        <circle cx="16" cy="9" r="6.2" fill={skin} />

        {dir === 'bas' && (
          <>
            <path d="M9.8 8.4 Q10 2.4 16 2.6 Q22 2.4 22.2 8.4 Q19.5 5.6 16 6.2 Q12.5 5.6 9.8 8.4Z" fill={hair} />
            <rect x="12.6" y="9" width="1.8" height="2.3" rx="0.9" fill="#1b1b1f" />
            <rect x="17.6" y="9" width="1.8" height="2.3" rx="0.9" fill="#1b1b1f" />
            <path d="M14.6 12.9 Q16 13.8 17.4 12.9" stroke="#8a4b2f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          </>
        )}
        {dir === 'haut' && <path d="M9.8 9.5 Q9.6 2.4 16 2.6 Q22.4 2.4 22.2 9.5 Q22 13.5 16 14 Q10 13.5 9.8 9.5Z" fill={hair} />}
        {(dir === 'droite' || dir === 'gauche') && (
          <>
            <path d="M9.8 10 Q9.4 2.4 16.5 2.6 Q22 2.8 22.2 7.4 Q18 5.4 15 7.2 L14 11.5 Q11 12 9.8 10Z" fill={hair} />
            <rect x="18.8" y="8.8" width="1.7" height="2.3" rx="0.85" fill="#1b1b1f" />
            <path d="M22 10.2 L23.2 11.4 L22 12" fill={skin} />
          </>
        )}
      </g>
    </svg>
  );
}
