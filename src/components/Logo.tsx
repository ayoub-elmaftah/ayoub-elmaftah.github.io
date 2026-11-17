/*
 * Logos des langages et outils (bibliothèque Devicon, via le paquet devicons-react).
 * Pour ajouter un logo : importe-le ici (liste complète : https://devicon.dev),
 * ajoute son nom à LOGOS, puis utilise ce nom dans data/content.ts.
 */
import type { FunctionComponent, SVGProps } from 'react';
import JavaOriginal from 'devicons-react/icons/JavaOriginal';
import PythonOriginal from 'devicons-react/icons/PythonOriginal';
import LuaOriginal from 'devicons-react/icons/LuaOriginal';
import BashOriginal from 'devicons-react/icons/BashOriginal';
import Html5Original from 'devicons-react/icons/Html5Original';
import Css3Original from 'devicons-react/icons/Css3Original';
import PhpOriginal from 'devicons-react/icons/PhpOriginal';
import JavascriptOriginal from 'devicons-react/icons/JavascriptOriginal';
import OracleOriginal from 'devicons-react/icons/OracleOriginal';
import GitOriginal from 'devicons-react/icons/GitOriginal';
import MavenOriginal from 'devicons-react/icons/MavenOriginal';
import VscodeOriginal from 'devicons-react/icons/VscodeOriginal';

type IconProps = SVGProps<SVGElement> & { size?: number | string };

/** SQL n'a pas de logo officiel : une base de données dessinée au trait. */
const Database: FunctionComponent<IconProps> = ({ size = 28 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#38bdf8" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
    <path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" />
  </svg>
);

const LOGOS = {
  Java: JavaOriginal,
  JavaFX: JavaOriginal,
  Python: PythonOriginal,
  Luau: LuaOriginal, // le langage de Roblox, dérivé de Lua
  Bash: BashOriginal,
  HTML: Html5Original,
  CSS: Css3Original,
  PHP: PhpOriginal,
  JavaScript: JavascriptOriginal,
  Oracle: OracleOriginal,
  SQL: Database,
  Git: GitOriginal,
  Maven: MavenOriginal,
  'VS Code': VscodeOriginal,
} satisfies Record<string, FunctionComponent<IconProps>>;

export type LogoName = keyof typeof LOGOS;

export default function Logo({ name, size = 28 }: { name: LogoName; size?: number }) {
  const Icon = LOGOS[name] as FunctionComponent<IconProps>;
  return <Icon size={size} aria-hidden="true" focusable="false" />;
}
