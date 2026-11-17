import { motion } from 'motion/react';
import { ease } from './motion';

/** Le logo : <ayoub/> en police de code, les lettres apparaissent une à une. */
export default function BrandMark() {
  const letters = 'ayoub'.split('');
  return (
    <span className="inline-flex items-baseline font-mono text-[1.05rem] font-semibold tracking-tight">
      <span className="text-accent">&lt;</span>
      {letters.map((l, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.25 + i * 0.07 }}>
          {l}
        </motion.span>
      ))}
      <span className="text-accent">/&gt;</span>
    </span>
  );
}
