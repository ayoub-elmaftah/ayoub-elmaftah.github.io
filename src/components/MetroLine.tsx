import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Station } from '../data/content';
import { ease } from './motion';
import Train from './Train';

/**
 * Le parcours façon ligne de métro : la ligne se trace quand on fait défiler la page,
 * chaque station s'allume quand la ligne l'atteint. Les stations « à venir » sont en pointillés,
 * la prochaine (le stage) clignote.
 * Horizontal sur grand écran, vertical sur téléphone.
 */
export default function MetroLine({ stations }: { stations: Station[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'start 62%'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const n = stations.length;
  const actuelle = Math.max(0, stations.findIndex((s) => s.etat === 'en-cours'));
  const prochaine = stations.findIndex((s) => s.etat === 'a-venir');
  const part = actuelle / (n - 1); // part de la ligne déjà parcourue

  // Position du train (en % de la ligne), rotation des roues, effet de vitesse
  const trainPos = useTransform(p, (v) => `${Math.min(1, Math.max(0, v)) * part * 100}%`);
  const wheel = useTransform(p, (v) => v * 900);
  const speed = useVelocity(p);
  const moving = useTransform(speed, (s) => Math.min(1, Math.abs(s) * 2.5));

  // Téléphone : distance réelle (en px) entre la 1re station et la station actuelle
  const listeV = useRef<HTMLOListElement>(null);
  const [cibleV, setCibleV] = useState(0);
  useEffect(() => {
    const ol = listeV.current;
    if (!ol) return;
    const mesure = () => {
      const items = ol.children as HTMLCollectionOf<HTMLElement>;
      if (items[actuelle] && items[0]) setCibleV(items[actuelle].offsetTop - items[0].offsetTop);
    };
    mesure();
    const ro = new ResizeObserver(mesure);
    ro.observe(ol);
    return () => ro.disconnect();
  }, [actuelle]);
  const trainPosV = useTransform(p, (v) => Math.min(1, Math.max(0, v)) * cibleV);
  const fillV = useTransform(p, (v) => Math.min(1, Math.max(0, v)) * cibleV);

  const [allumees, setAllumees] = useState(0);
  useMotionValueEvent(p, 'change', (v) => {
    // station i allumée quand la ligne l'atteint (petite marge pour la dernière)
    let k = 0;
    for (let i = 0; i <= actuelle; i++) if (i === 0 ? v > 0.02 : v >= i / actuelle - 0.1) k = i + 1;
    setAllumees(k);
  });

  const dot = (s: Station, i: number) => {
    const on = s.etat !== 'a-venir' && i < allumees;
    const next = i === prochaine;
    return (
      <span className="relative grid size-6 place-items-center">
        {next && <span className="absolute inset-0 animate-ping rounded-full bg-term/40" />}
        <motion.span
          animate={{ scale: on ? 1 : 0.85 }}
          transition={{ duration: 0.4, ease }}
          className={`relative block size-6 rounded-full border-[3px] transition-colors duration-500 ${
            s.etat === 'a-venir'
              ? `border-dashed bg-paper ${next ? 'border-term' : 'border-line'}`
              : on
                ? 'border-accent bg-accent shadow-[0_0_0_6px_var(--color-accent-soft)]'
                : 'border-line bg-paper'
          }`}
        >
          {on && s.etat === 'en-cours' && <span className="absolute inset-[5px] rounded-full bg-on-accent" />}
        </motion.span>
      </span>
    );
  };

  const label = (s: Station, i: number, align: 'center' | 'left') => {
    const on = s.etat !== 'a-venir' && i < allumees;
    return (
      <motion.div
        animate={{ opacity: on || s.etat === 'a-venir' ? 1 : 0.45, y: on ? 0 : 4 }}
        transition={{ duration: 0.5, ease }}
        className={align === 'center' ? 'text-center' : ''}
      >
        <p className={`font-mono text-[0.78rem] ${i === prochaine ? 'text-term' : 'text-muted'}`}>{s.annee}</p>
        <h3 className="mt-1 text-[1.15rem] leading-snug font-semibold">{s.titre}</h3>
        <p className="text-[0.95rem] text-muted">{s.lieu}</p>
        {s.detail && <p className={`mt-1 text-[0.9rem] ${i === prochaine ? 'font-medium text-term' : ''}`}>{s.detail}</p>}
      </motion.div>
    );
  };

  // Rails : deux fils + traverses
  const rails = (dir: 'h' | 'v') =>
    dir === 'h'
      ? 'linear-gradient(var(--color-muted), var(--color-muted)) 0 0 / 100% 2px no-repeat, linear-gradient(var(--color-muted), var(--color-muted)) 0 100% / 100% 2px no-repeat, repeating-linear-gradient(90deg, var(--color-line) 0 4px, transparent 4px 14px)'
      : 'linear-gradient(var(--color-muted), var(--color-muted)) 0 0 / 2px 100% no-repeat, linear-gradient(var(--color-muted), var(--color-muted)) 100% 0 / 2px 100% no-repeat, repeating-linear-gradient(180deg, var(--color-line) 0 4px, transparent 4px 14px)';

  return (
    <div ref={ref}>
      {/* Grand écran : ligne horizontale */}
      <div className="relative hidden md:block">
        <div className="absolute top-3 z-10 h-[12px] -translate-y-1/2" style={{ left: `${50 / n}%`, right: `${50 / n}%` }}>
          <div className="absolute inset-0 opacity-60" style={{ background: rails('h') }} />
          {/* portion déjà parcourue */}
          <motion.div className="absolute top-1/2 left-0 h-[4px] origin-left -translate-y-1/2 rounded-full bg-accent" style={{ width: `${part * 100}%`, scaleX: p }} />
          {/* le train : son nez s'arrête pile sur la station */}
          <motion.div className="pointer-events-none absolute -bottom-[1px] z-20" style={{ left: trainPos, x: '-96%' }}>
            <Train wheel={wheel} moving={moving} />
          </motion.div>
        </div>
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {stations.map((s, i) => (
            <li key={i} className="flex flex-col items-center gap-5 px-3">
              {dot(s, i)}
              {label(s, i, 'center')}
            </li>
          ))}
        </ol>
      </div>

      {/* Téléphone : ligne verticale */}
      <div className="relative md:hidden">
        <div className="absolute top-3 bottom-10 left-3 z-10 w-[12px] -translate-x-1/2">
          <div className="absolute inset-0 opacity-60" style={{ background: rails('v') }} />
          <motion.div className="absolute top-0 left-1/2 w-[4px] -translate-x-1/2 rounded-full bg-accent" style={{ height: fillV }} />
          {/* sur téléphone le train descend : on le tourne d'un quart de tour */}
          <motion.div className="pointer-events-none absolute left-1/2 z-20" style={{ top: trainPosV }}>
            <div className="origin-top-left" style={{ transform: 'scale(0.55) rotate(90deg) translate(-96%, -50%)' }}>
              <Train wheel={wheel} moving={moving} />
            </div>
          </motion.div>
        </div>
        <ol ref={listeV} className="relative grid gap-9">
          {stations.map((s, i) => (
            <li key={i} className="flex gap-5">
              {dot(s, i)}
              {label(s, i, 'left')}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
