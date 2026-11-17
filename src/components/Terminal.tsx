import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useContent } from '../i18n';
import { ease } from './motion';

/**
 * Fenêtre de terminal : les commandes de data/content.ts (terminal) se tapent toutes seules,
 * puis leur résultat s'affiche. Si le visiteur a coupé les animations, tout s'affiche d'un coup.
 */
export default function Terminal() {
  const { terminal, ui } = useContent();
  const reduce = useReducedMotion();
  // step = nombre de caractères déjà tapés, toutes commandes confondues
  const total = terminal.reduce((n, l) => n + l.cmd.length + 6, 0);
  const [step, setStep] = useState(reduce ? total : 0);

  useEffect(() => {
    if (reduce || step >= total) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 55);
    return () => clearTimeout(t);
  }, [step, total, reduce]);

  let budget = step;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, ease, delay: 0.35 }}
      className="overflow-hidden rounded-2xl border border-line bg-surface/80 shadow-[0_40px_80px_-40px_var(--color-glow)] backdrop-blur-sm"
      style={{ transformPerspective: 900 }}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[0.78rem] text-muted">ayoub@blagnac: ~</span>
      </div>
      <div aria-label={ui.terminalLabel} className="min-h-[268px] px-5 py-5 font-mono text-[0.86rem] leading-[1.8] sm:text-[0.9rem]">
        {terminal.map((line, i) => {
          const typed = Math.max(0, Math.min(line.cmd.length, budget));
          budget -= line.cmd.length;
          const showOut = budget > 0;
          budget -= 6; // petite pause avant la commande suivante
          if (typed === 0 && i > 0 && !showOut) return null;
          const typing = typed < line.cmd.length || (!showOut && i === terminal.length - 1);
          return (
            <div key={line.cmd} className="mb-2">
              <p>
                <span className="text-term">➜</span> <span className="text-accent">~</span> {line.cmd.slice(0, typed)}
                {typing && <span className="caret ml-0.5" />}
              </p>
              {showOut && line.out.map((o) => <p key={o} className="text-muted">{o}</p>)}
            </div>
          );
        })}
        {step >= total && (
          <p>
            <span className="text-term">➜</span> <span className="text-accent">~</span> <span className="caret" />
          </p>
        )}
      </div>
    </motion.div>
  );
}
