import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useContent } from '../i18n';
import { ArrowIcon, DownloadIcon, PinIcon } from '../components/Icons';
import { GithubLogo, LinkedinLogo, MailLogo } from '../components/SocialIcons';
import Terminal from '../components/Terminal';
import { ease } from '../components/motion';

const appear = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease, delay },
});

export default function Hero() {
  const { intro, person, ui } = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const termY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section id="top" ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden">
      <motion.div aria-hidden style={{ y: bgY }} className="absolute inset-0">
        <div className="aurora absolute inset-0" />
        <div className="dots-bg absolute inset-0" />
      </motion.div>

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-6xl items-center gap-14 px-5 pt-28 pb-20 sm:px-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
        <div>
          <motion.p {...appear(0.1)} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[0.8rem] text-muted">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-term opacity-60" />
              <span className="relative size-2 rounded-full bg-term" />
            </span>
            {person.status}
          </motion.p>

          <motion.h1 {...appear(0.2)} id="hero-title" className="mt-6 text-[clamp(2.9rem,1.6rem+5vw,5.6rem)] leading-[0.98] font-bold tracking-[-0.04em]">
            {person.firstName}
            <br />
            <span className="bg-gradient-to-r from-accent to-term bg-clip-text text-transparent">{person.lastName}</span>
          </motion.h1>
          <motion.p {...appear(0.3)} className="mt-4 font-mono text-[clamp(1rem,0.9rem+0.5vw,1.2rem)] text-accent">
            {'// '}{person.title}
          </motion.p>
          <motion.p {...appear(0.4)} className="mt-6 max-w-[48ch] text-[1.12rem] leading-relaxed text-muted">
            {intro}
          </motion.p>

          <motion.div {...appear(0.5)} className="mt-9 flex flex-wrap gap-3">
            <a href="#projets" className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-on-accent shadow-[0_10px_30px_-10px_var(--color-glow)] transition-[transform,opacity] duration-200 hover:-translate-y-0.5 hover:opacity-90">
              {ui.heroProjects}
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {person.cv && (
              <a href={person.cv} download className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 font-medium transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent/50">
                <DownloadIcon /> {ui.heroCv}
              </a>
            )}
          </motion.div>

          <motion.ul {...appear(0.6)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.95rem] text-muted">
            <li className="flex items-center gap-2"><PinIcon /> {person.location}</li>
            <li><a href={person.linkedin} className="flex items-center gap-2 transition-colors hover:text-ink"><LinkedinLogo /> LinkedIn</a></li>
            <li><a href={person.github} className="flex items-center gap-2 transition-colors hover:text-ink"><GithubLogo /> GitHub</a></li>
            <li><a href={`mailto:${person.email}`} className="flex items-center gap-2 transition-colors hover:text-ink"><MailLogo /> E-mail</a></li>
          </motion.ul>
        </div>

        <motion.div style={{ y: termY }} className="relative w-full">
          <Terminal />
          <motion.div {...appear(1)} className="absolute -bottom-6 -left-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.5)] sm:-left-8">
            <p className="font-mono text-[0.72rem] text-muted uppercase">{ui.heroBadge}</p>
            <p className="text-[0.95rem] font-medium">BUT Informatique · {person.school}</p>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#profil"
        aria-label={ui.scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.4, duration: 0.8 }, y: { delay: 1.4, duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted md:block"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden><path d="M6 9l6 6 6-6" /></svg>
      </motion.a>
    </section>
  );
}
