import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { lazy, Suspense, useState, type PointerEvent } from 'react';
import type { Project } from '../data/content';
import { useContent } from '../i18n';
import Logo from '../components/Logo';
import SectionHeader from '../components/SectionHeader';
import { ArrowIcon } from '../components/Icons';
import { ease } from '../components/motion';

const SokobanGame = lazy(() => import('../components/SokobanGame'));

/** Carte de projet : se soulève au survol, un halo suit la souris et un trait dégradé se trace en haut. */
function ProjectCard({ p, n }: { p: Project; n: number }) {
  const { ui } = useContent();
  const [play, setPlay] = useState(false);
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <article
      onPointerMove={onMove}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_60px_-30px_var(--color-glow)]"
      style={{ backgroundImage: 'radial-gradient(340px circle at var(--x, -200px) var(--y, -200px), color-mix(in oklab, var(--color-accent) 10%, transparent), transparent 70%)' }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-accent to-term transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[0.75rem] font-medium text-accent">{p.category}</span>
        <span className="font-mono text-[0.8rem] text-muted tabular-nums">{String(n).padStart(2, '0')}</span>
      </div>
      <h3 className={`mt-5 leading-snug font-semibold tracking-[-0.015em] ${p.featured ? 'text-[1.8rem]' : 'text-[1.4rem]'}`}>{p.title}</h3>
      {p.context && <p className="mt-1 text-[0.93rem] text-muted">{p.context}</p>}
      <p className="mt-4 leading-relaxed">{p.description}</p>
      {p.highlights && (
        <ul className={`mt-4 grid gap-2 text-[0.96rem] text-muted ${p.featured ? 'md:grid-cols-3 md:gap-4' : ''}`}>
          {p.highlights.map((h) => (
            <li key={h} className="relative pl-5">
              <span aria-hidden className="absolute top-[0.25em] left-0 font-mono text-term">›</span>
              {h}
            </li>
          ))}
        </ul>
      )}
      {p.playable && (
        <div className="mt-5">
          <button
            type="button"
            aria-expanded={play}
            onClick={() => setPlay((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-accent/40 bg-accent-soft px-4 py-2 font-mono text-[0.82rem] text-accent transition-transform hover:-translate-y-0.5"
          >
            {play ? ui.closeGame : ui.play}
          </button>
          {play && (
            <Suspense fallback={<p className="mt-4 font-mono text-[0.8rem] text-muted">{ui.loading}</p>}>
              <SokobanGame />
            </Suspense>
          )}
        </div>
      )}
      {(p.tech || p.link) && (
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="flex flex-wrap gap-2">
            {p.tech?.map((name) => (
              <span key={name} className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 font-mono text-[0.78rem]">
                <Logo name={name} size={15} /> {name}
              </span>
            ))}
          </span>
          {p.link && (
            <a href={p.link.href} className="inline-flex shrink-0 items-center gap-1.5 font-medium text-accent">
              {p.link.label} <ArrowIcon />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function Projects() {
  const { categories, projects, ui } = useContent();
  // filtre gardé par position (0 = tout) pour rester valable quand on change de langue
  const [filtre, setFiltre] = useState(0);
  const filter = categories[filtre];
  const shown = projects.filter((p) => filtre === 0 || p.category === filter);
  const used = categories.map((c, i) => ({ c, i })).filter(({ c, i }) => i === 0 || projects.some((p) => p.category === c));

  return (
    <section id="projets" aria-labelledby="projets-title" className="border-y border-line bg-subtle">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <SectionHeader id="projets-title" label={ui.projectsLabel} title={ui.projectsTitle} intro={ui.projectsIntro} />

        <LayoutGroup>
          <div role="group" aria-label={ui.projectsFilter} className="mt-10 flex flex-wrap gap-2">
            {used.map(({ c, i }) => {
              const on = filtre === i;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFiltre(i)}
                  className={`relative cursor-pointer rounded-full px-4 py-1.5 font-mono text-[0.82rem] transition-colors duration-200 ${on ? 'text-on-accent' : 'border border-line text-muted hover:text-ink'}`}
                >
                  {on && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="relative">{c}</span>
                </button>
              );
            })}
          </div>

          <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <motion.div
                  key={projects.indexOf(p)}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease }}
                  className={`h-full ${p.featured && filtre === 0 ? 'md:col-span-2' : ''}`}
                >
                  <ProjectCard p={p} n={projects.indexOf(p) + 1} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
