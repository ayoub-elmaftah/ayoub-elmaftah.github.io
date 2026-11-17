import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useContent } from '../i18n';
import { CheckIcon, CopyIcon, PinIcon } from '../components/Icons';
import GithubOriginal from 'devicons-react/icons/GithubOriginal';
import { LinkedinLogo, MailLogo } from '../components/SocialIcons';
import { ease, fadeUp, inView, stagger } from '../components/motion';

export default function Contact() {
  const { contact, person, ui } = useContent();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="px-5 pb-24 sm:px-8 md:pb-32">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-[color-mix(in_oklab,var(--color-accent)_70%,var(--color-term))] px-7 py-16 text-on-accent sm:px-12 md:px-16 md:py-20"
      >
        <div aria-hidden className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'linear-gradient(110deg, transparent 35%, #000)' }} />
        <div className="relative max-w-2xl">
          <motion.p variants={fadeUp} className="font-mono text-[0.8rem] font-medium tracking-[0.1em] uppercase opacity-80">
            {ui.contactLabel}
          </motion.p>
          <motion.h2 variants={fadeUp} id="contact-title" className="mt-3 text-[clamp(2rem,1.4rem+2vw,3rem)] leading-tight font-bold tracking-[-0.025em]">
            {ui.contactTitle}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-[1.12rem] opacity-85">
            {contact.sentence}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2 rounded-lg bg-on-accent px-5 py-3 font-medium text-accent transition-transform duration-200 hover:-translate-y-0.5">
              <MailLogo size={20} /> {person.email}
            </a>
            <button type="button" onClick={copy} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-on-accent/40 px-5 py-3 font-medium transition-colors duration-200 hover:bg-on-accent/10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? 'ok' : 'copy'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease }} className="inline-flex items-center gap-2">
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? ui.copied : ui.copy}
                </motion.span>
              </AnimatePresence>
            </button>
          </motion.div>
          <span className="sr-only" aria-live="polite">{copied ? ui.copiedSr : ''}</span>

          <motion.ul variants={fadeUp} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 opacity-90">
            <li><a href={person.linkedin} className="link-line inline-flex items-center gap-2 pb-0.5"><span className="grid size-7 place-items-center rounded-full bg-white"><LinkedinLogo size={16} /></span> LinkedIn</a></li>
            <li><a href={person.github} className="link-line inline-flex items-center gap-2 pb-0.5"><span className="grid size-7 place-items-center rounded-full bg-white"><span className="inline-flex"><GithubOriginal size={16} aria-hidden="true" /></span></span> GitHub</a></li>
            <li className="inline-flex items-center gap-2"><PinIcon /> {person.location}</li>
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
