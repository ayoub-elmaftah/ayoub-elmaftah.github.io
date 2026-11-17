import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import Hero8bit from './Hero8bit';
import { useContent } from '../i18n';

/**
 * Mini-Sokoban jouable dans la page : version web (TypeScript) de mon jeu JavaFX,
 * avec les mêmes niveaux tutoriel et la même logique :
 * - Ctrl+Z (ou Cmd+Z) annule, R recommence
 * - détection de blocage : une caisse poussée dans un coin sans cible → « Bloqué ! »
 * Les cases sont dessinées avec les couleurs du site (thème clair et thème sombre).
 * Symboles : # mur · espace sol · . cible · $ caisse · @ joueur · * caisse sur cible · + joueur sur cible
 */
const NIVEAUX = [
  { nom: 'Pousser une caisse', grille: ['########', '#      #', '#      #', '# @$ . #', '#      #', '#      #', '#      #', '########'] },
  { nom: 'Tourner autour', grille: ['########', '#      #', '# .  . #', '#      #', '# $@$  #', '#      #', '#      #', '########'] },
  { nom: 'Petit obstacle', grille: ['########', '# .    #', '#  $   #', '#  ##  #', '#   $  #', '#   @  #', '#    . #', '########'] },
  { nom: 'Trois caisses', grille: ['########', '#  ... #', '#      #', '# $$$  #', '#      #', '#  @   #', '#      #', '########'] },
];

export type Direction = 'haut' | 'bas' | 'gauche' | 'droite';
const DELTA: Record<Direction, [number, number]> = { haut: [-1, 0], bas: [1, 0], gauche: [0, -1], droite: [0, 1] };
const KEYS: Record<string, Direction> = { arrowup: 'haut', arrowdown: 'bas', arrowleft: 'gauche', arrowright: 'droite', z: 'haut', s: 'bas', q: 'gauche', d: 'droite', w: 'haut', a: 'gauche' };

type Pos = { r: number; c: number };
type Box = Pos & { id: number };
type Etat = { joueur: Pos; caisses: Box[]; dir: Direction; coups: number; poussees: number };

function charger(n: number) {
  const g = NIVEAUX[n].grille;
  const murs = new Set<string>();
  const cibles = new Set<string>();
  const caisses: Box[] = [];
  let joueur: Pos = { r: 0, c: 0 };
  g.forEach((ligne, r) =>
    [...ligne].forEach((ch, c) => {
      const k = `${r},${c}`;
      if (ch === '#') murs.add(k);
      if (ch === '.' || ch === '*' || ch === '+') cibles.add(k);
      if (ch === '$' || ch === '*') caisses.push({ id: caisses.length, r, c });
      if (ch === '@' || ch === '+') joueur = { r, c };
    }),
  );
  return { murs, cibles, lignes: g.length, cols: Math.max(...g.map((l) => l.length)), depart: { joueur, caisses, dir: 'bas' as Direction, coups: 0, poussees: 0 } };
}

/* ---------- Bruitages (synthétisés, aucun fichier audio) ---------- */
let ctxAudio: AudioContext | null = null;
function bip(notes: { f: number; t: number; d: number; type?: OscillatorType; v?: number }[]) {
  try {
    ctxAudio ??= new AudioContext();
    const a = ctxAudio;
    const t0 = a.currentTime;
    for (const n of notes) {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = n.type ?? 'triangle';
      o.frequency.setValueAtTime(n.f, t0 + n.t);
      g.gain.setValueAtTime(0.0001, t0 + n.t);
      g.gain.exponentialRampToValueAtTime(n.v ?? 0.12, t0 + n.t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
      o.connect(g).connect(a.destination);
      o.start(t0 + n.t);
      o.stop(t0 + n.t + n.d + 0.02);
    }
  } catch {
    /* son indisponible : on joue sans */
  }
}
const SONS = {
  pas: () => bip([{ f: 220, t: 0, d: 0.05, type: 'sine', v: 0.04 }]),
  pousse: () => bip([{ f: 140, t: 0, d: 0.09, type: 'square', v: 0.05 }]),
  cible: () => bip([{ f: 660, t: 0, d: 0.12 }, { f: 990, t: 0.07, d: 0.16 }]),
  gagne: () => bip([523, 659, 784, 1047].map((f, i) => ({ f, t: i * 0.11, d: 0.28, v: 0.14 }))),
  bloque: () => bip([{ f: 300, t: 0, d: 0.18, type: 'sawtooth', v: 0.06 }, { f: 200, t: 0.16, d: 0.3, type: 'sawtooth', v: 0.06 }]),
  annule: () => bip([{ f: 440, t: 0, d: 0.06, type: 'sine', v: 0.05 }, { f: 330, t: 0.05, d: 0.08, type: 'sine', v: 0.05 }]),
};

/* ---------- Cases dessinées aux couleurs du site ---------- */
function Mur({ t }: { t: number }) {
  return (
    <div
      className="absolute inset-[1px] rounded-[6px] border border-line"
      style={{
        background: 'linear-gradient(160deg, color-mix(in oklab, var(--color-accent) 22%, var(--color-surface)), color-mix(in oklab, var(--color-accent) 8%, var(--color-surface)))',
        boxShadow: `inset 0 ${Math.max(1, t / 14)}px 0 color-mix(in oklab, white 12%, transparent)`,
      }}
    />
  );
}
function Cible() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="size-[42%] rounded-full border-2 border-dashed border-term opacity-90" />
      <span className="absolute size-[14%] rounded-full bg-term" />
    </div>
  );
}
function Caisse({ ok }: { ok: boolean }) {
  return (
    <div
      className={`absolute inset-[9%] rounded-[22%] border-2 transition-colors duration-300 ${ok ? 'border-accent bg-accent' : 'border-accent/70 bg-surface'}`}
      style={{ boxShadow: ok ? '0 0 18px var(--color-glow)' : '0 4px 10px -4px rgba(0,0,0,0.4)' }}
    >
      <svg viewBox="0 0 10 10" className="absolute inset-[18%]" aria-hidden>
        {ok ? (
          <path d="M2 5.3 L4.2 7.4 L8 2.8" fill="none" stroke="var(--color-on-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M1 1 L9 9 M9 1 L1 9" stroke="color-mix(in oklab, var(--color-accent) 60%, transparent)" strokeWidth="1" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}

export default function SokobanGame() {
  const t = useContent().ui.soko;
  const [niveau, setNiveau] = useState(0);
  const [plan, setPlan] = useState(() => charger(0));
  const [etat, setEtat] = useState<Etat>(plan.depart);
  const [historique, setHistorique] = useState<Etat[]>([]);
  const [bloque, setBloque] = useState(false);
  const [son, setSon] = useState(true);
  const [tuile, setTuile] = useState(36);
  const boite = useRef<HTMLDivElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const jouer = (s: keyof typeof SONS) => son && SONS[s]();

  const surCible = (b: Pos) => plan.cibles.has(`${b.r},${b.c}`);
  const gagne = etat.caisses.every(surCible);

  // Taille des cases adaptée à la largeur disponible
  useEffect(() => {
    const el = boite.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setTuile(Math.max(24, Math.min(42, Math.floor(e.contentRect.width / plan.cols)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [plan.cols]);

  // Même règle que JeuSokoban.estCaisseCoinceeApresPoussee : caisse hors cible coincée dans un coin
  const coincee = useCallback(
    (b: Pos) => {
      if (surCible(b)) return false;
      const m = (r: number, c: number) => plan.murs.has(`${r},${c}`);
      return (m(b.r - 1, b.c) || m(b.r + 1, b.c)) && (m(b.r, b.c - 1) || m(b.r, b.c + 1));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan],
  );

  const aller = useCallback(
    (dir: Direction) => {
      if (gagne || bloque) return;
      const [dr, dc] = DELTA[dir];
      const dest = { r: etat.joueur.r + dr, c: etat.joueur.c + dc };
      if (plan.murs.has(`${dest.r},${dest.c}`)) return setEtat({ ...etat, dir });
      const b = etat.caisses.find((x) => x.r === dest.r && x.c === dest.c);
      if (b) {
        const nb = { r: b.r + dr, c: b.c + dc };
        const k2 = `${nb.r},${nb.c}`;
        if (plan.murs.has(k2) || etat.caisses.some((x) => `${x.r},${x.c}` === k2)) return setEtat({ ...etat, dir });
        const caisses = etat.caisses.map((x) => (x.id === b.id ? { ...x, ...nb } : x));
        setHistorique((h) => [...h, etat]);
        setEtat({ joueur: dest, dir, coups: etat.coups + 1, poussees: etat.poussees + 1, caisses });
        if (caisses.every(surCible)) jouer('gagne');
        else if (coincee(nb)) {
          setBloque(true);
          jouer('bloque');
        } else jouer(surCible(nb) ? 'cible' : 'pousse');
        return;
      }
      setHistorique((h) => [...h, etat]);
      setEtat({ ...etat, joueur: dest, dir, coups: etat.coups + 1 });
      jouer('pas');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etat, plan, gagne, bloque, son, coincee],
  );

  const annuler = () => {
    if (!historique.length) return;
    setEtat(historique[historique.length - 1]);
    setHistorique((h) => h.slice(0, -1));
    setBloque(false);
    jouer('annule');
  };
  const lancer = (n: number) => {
    const p = charger(n);
    setNiveau(n);
    setPlan(p);
    setEtat(p.depart);
    setHistorique([]);
    setBloque(false);
    zone.current?.focus({ preventScroll: true });
  };

  // Clavier : seulement quand le jeu a le focus (la page ne défile pas pendant qu'on joue)
  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') {
      e.preventDefault();
      annuler();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === 'r') {
      e.preventDefault();
      lancer(niveau);
      return;
    }
    const d = KEYS[k];
    if (d) {
      e.preventDefault();
      aller(d);
    }
  };

  // Glisser du doigt sur téléphone
  const down = (e: PointerEvent) => (swipe.current = { x: e.clientX, y: e.clientY });
  const up = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    aller(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'droite' : 'gauche') : dy > 0 ? 'bas' : 'haut');
  };

  useEffect(() => zone.current?.focus({ preventScroll: true }), []);

  const tr = { type: 'tween', duration: 0.12, ease: 'easeOut' } as const;
  const btn = 'cursor-pointer rounded-md border border-line px-3 py-1.5 font-mono text-[0.78rem] transition-colors hover:border-accent/50 hover:text-accent disabled:cursor-default disabled:opacity-40';

  return (
    <div ref={boite} className="mt-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.78rem] text-muted">
        <span>
          {t.level} {niveau + 1}/{NIVEAUX.length} · {t.levels[niveau] ?? NIVEAUX[niveau].nom}
        </span>
        <span className="flex items-center gap-3 tabular-nums">
          {etat.coups} {t.moves} · {etat.poussees} {t.pushes}
          <button type="button" onClick={() => setSon((v) => !v)} aria-pressed={son} aria-label={son ? t.soundOn : t.soundOff} className="cursor-pointer text-[0.95rem] hover:text-accent">
            {son ? '🔊' : '🔇'}
          </button>
        </span>
      </div>

      <div
        ref={zone}
        tabIndex={0}
        role="application"
        aria-label={t.aria}
        onKeyDown={onKey}
        onPointerDown={down}
        onPointerUp={up}
        className="relative mx-auto touch-none overflow-hidden rounded-2xl border border-line outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{
          width: plan.cols * tuile + 2,
          height: plan.lignes * tuile + 2,
          backgroundColor: 'var(--color-subtle)',
          backgroundImage: 'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
          backgroundSize: `${tuile}px ${tuile}px`,
          backgroundPosition: '-1px -1px',
        }}
      >
        {/* Décor : murs et cibles */}
        {NIVEAUX[niveau].grille.map((ligne, r) =>
          [...ligne.padEnd(plan.cols)].map((_, c) => {
            const k = `${r},${c}`;
            const mur = plan.murs.has(k);
            const cible = plan.cibles.has(k);
            if (!mur && !cible) return null;
            return (
              <div key={k} className="absolute" style={{ left: c * tuile, top: r * tuile, width: tuile, height: tuile }}>
                {mur ? <Mur t={tuile} /> : <Cible />}
              </div>
            );
          }),
        )}
        {/* Caisses (glissent d'une case à l'autre) */}
        {etat.caisses.map((b) => {
          const ok = surCible(b);
          return (
            <motion.div
              key={b.id}
              className="absolute"
              style={{ width: tuile, height: tuile }}
              initial={false}
              animate={{ x: b.c * tuile, y: b.r * tuile, scale: ok ? [1, 1.12, 1] : 1 }}
              transition={tr}
            >
              <Caisse ok={ok} />
            </motion.div>
          );
        })}
        {/* Joueur : l'image change selon la direction */}
        <motion.div className="absolute z-10" style={{ width: tuile, height: tuile }} initial={false} animate={{ x: etat.joueur.c * tuile, y: etat.joueur.r * tuile }} transition={tr}>
          <div className="absolute" style={{ left: -tuile * 0.2, top: -tuile * 0.32, width: tuile * 1.4, height: tuile * 1.4 }}>
            <Hero8bit dir={etat.dir} size={tuile * 1.4} />
          </div>
        </motion.div>

        {/* Fenêtres de fin : gagné ou bloqué */}
        <AnimatePresence>
          {(gagne || bloque) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 grid place-items-center bg-paper/70 backdrop-blur-[3px]">
              <motion.div initial={{ scale: 0.85, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }} className="mx-4 rounded-2xl border border-line bg-surface px-6 py-5 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                {gagne ? (
                  <>
                    <p className="text-[1.3rem] font-bold text-accent">{t.win}</p>
                    <p className="mt-1 font-mono text-[0.8rem] text-muted">
                      {etat.coups} {t.moves} · {etat.poussees} {t.pushes}
                    </p>
                    {niveau < NIVEAUX.length - 1 ? (
                      <button type="button" onClick={() => lancer(niveau + 1)} className="mt-4 cursor-pointer rounded-lg bg-accent px-4 py-2 text-[0.9rem] font-medium text-on-accent">
                        {t.nextBtn}
                      </button>
                    ) : (
                      <p className="mt-3 text-[0.95rem]">{t.allDone}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-[1.3rem] font-bold text-term">{t.stuck}</p>
                    <p className="mt-1 text-[0.95rem] text-muted">{t.stuckMsg}</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <button type="button" onClick={annuler} className="cursor-pointer whitespace-nowrap rounded-lg bg-accent px-4 py-2 text-[0.9rem] font-medium text-on-accent">
                        {t.undoMove}
                      </button>
                      <button type="button" onClick={() => lancer(niveau)} className="cursor-pointer whitespace-nowrap rounded-lg border border-line px-4 py-2 text-[0.9rem]">
                        {t.restartBtn}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={btn} onClick={annuler} disabled={!historique.length}>{t.undo}</button>
        <button type="button" className={btn} onClick={() => lancer(niveau)}>{t.restart}</button>
        <button type="button" className={btn} onClick={() => lancer(Math.max(0, niveau - 1))} disabled={niveau === 0} aria-label={t.prev}>‹</button>
        <button type="button" className={btn} onClick={() => lancer(Math.min(NIVEAUX.length - 1, niveau + 1))} disabled={niveau === NIVEAUX.length - 1} aria-label={t.next}>›</button>
      </div>
      <p className="mt-2 text-center font-mono text-[0.72rem] text-muted">{t.hint}</p>
    </div>
  );
}
