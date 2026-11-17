import { motion } from 'motion/react';
import { useContent } from '../i18n';
import photo from '../assets/photo-ayoub.webp';
import SectionHeader from '../components/SectionHeader';
import { ease, fadeUp, inView, stagger } from '../components/motion';

export default function Profile() {
  const { about, ui } = useContent();
  return (
    <section id="profil" aria-labelledby="profil-title" className="border-t border-line bg-subtle">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-32">
        <div>
          <SectionHeader id="profil-title" label={ui.profileLabel} title={about.title} />
          <motion.figure
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            viewport={inView}
            transition={{ duration: 0.8, ease }}
            className="relative mx-auto mt-10 max-w-[280px] overflow-hidden sm:max-w-[340px] md:mx-0 rounded-3xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
          >
            <img src={photo} alt={ui.photoAlt} width={720} height={977} loading="lazy" className="aspect-[720/977] w-full object-cover" />
            <span aria-hidden className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
          </motion.figure>
        </div>
        <motion.div variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={inView}>
          {about.paragraphs.map((p) => (
            <motion.p key={p} variants={fadeUp} className="mb-5 text-[1.12rem] leading-relaxed">
              {p}
            </motion.p>
          ))}
          <motion.dl variants={stagger(0.08)} className="mt-8 grid gap-4 sm:grid-cols-2">
            {about.facts.map((f) => (
              <motion.div key={f.label} variants={fadeUp} className="rounded-xl border border-line bg-surface p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/40">
                <dt className="font-mono text-[0.74rem] font-medium tracking-[0.06em] text-muted uppercase">{f.label}</dt>
                <dd className="mt-1.5 text-[1.08rem] font-medium">{f.value}</dd>
                {f.detail && <dd className="text-[0.93rem] text-muted">{f.detail}</dd>}
              </motion.div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
