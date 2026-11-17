import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './Icons';
import { useContent } from '../i18n';

/** Bouton clair / sombre. Le choix est retenu par le navigateur. */
export default function ThemeToggle() {
  const { ui } = useContent();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  // Suit les changements de thème faits ailleurs (sélecteur de style)
  useEffect(() => {
    const html = document.documentElement;
    const obs = new MutationObserver(() => setDark(html.classList.contains('dark')));
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme-v2', next ? 'dark' : 'light');
    } catch {
      /* stockage indisponible : le thème vaut pour cette visite */
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? ui.themeLight : ui.themeDark}
      className="grid size-10 cursor-pointer place-items-center rounded-lg border border-line text-muted transition-colors duration-200 hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="grid place-items-center"
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
