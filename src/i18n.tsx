import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fr, type Content } from './data/content';
import { en } from './data/content.en';

/**
 * Langue du site (français / anglais).
 * Le choix est retenu par le navigateur ; à la première visite, on prend la langue du navigateur.
 * Dans un composant : const c = useContent();  puis c.person, c.projects, c.ui.heroCv…
 */
export type Lang = 'fr' | 'en';
const CONTENUS: Record<Lang, Content> = { fr, en };

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'fr', setLang: () => {} });

function langueDeDepart(): Lang {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* stockage indisponible */
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(langueDeDepart);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* rien */
    }
  };
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'fr' ? 'Ayoub El Maftah · Portfolio' : 'Ayoub El Maftah · Portfolio (EN)';
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
export const useContent = () => CONTENUS[useContext(LangCtx).lang];
